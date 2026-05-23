'use server';

import { prisma } from '@/lib/db';
import { requireVendor } from '@/lib/vendor';
import { revalidatePath } from 'next/cache';

// ========== MASTER CONFIGURATION ==========

export async function seedVendorMasters(vendorId: string) {
  // Check if they already have levels
  const existing = await prisma.salaryLevelMaster.findFirst({ where: { vendorId } });
  if (existing) return;

  // Seed default salary levels
  await prisma.salaryLevelMaster.createMany({
    data: [
      { vendorId, levelName: 'L1 - Trainee', baseSalary: 5000 },
      { vendorId, levelName: 'L2 - Junior', baseSalary: 12000 },
      { vendorId, levelName: 'L3 - Senior', baseSalary: 25000 },
    ]
  });

  // Seed default deduction types
  await prisma.deductionMaster.createMany({
    data: [
      { vendorId, name: 'Late Fine' },
      { vendorId, name: 'Uniform Replacement' },
      { vendorId, name: 'Damage/Loss' },
    ]
  });

  // Seed default bonus types
  await prisma.bonusMaster.createMany({
    data: [
      { vendorId, name: 'Overtime' },
      { vendorId, name: 'Performance Bonus' },
      { vendorId, name: 'Festival Bonus' },
    ]
  });

  // Seed default salary types
  await prisma.salaryTypeMaster.createMany({
    data: [
      { vendorId, name: 'FIXED MONTHLY' },
      { vendorId, name: 'HOURLY WAGE' },
      { vendorId, name: 'DAILY WAGE' },
    ]
  });
}

export async function getVendorMasters() {
  const vendor = await requireVendor();
  await seedVendorMasters(vendor.id); // Auto-seed if empty

  const [levels, deductions, bonuses, salaryTypes] = await Promise.all([
    prisma.salaryLevelMaster.findMany({ where: { vendorId: vendor.id } }),
    prisma.deductionMaster.findMany({ where: { vendorId: vendor.id } }),
    prisma.bonusMaster.findMany({ where: { vendorId: vendor.id } }),
    prisma.salaryTypeMaster.findMany({ where: { vendorId: vendor.id } })
  ]);

  return { levels, deductions, bonuses, salaryTypes };
}

export async function createMaster(model: 'SalaryLevel' | 'Deduction' | 'Bonus' | 'SalaryType', data: any) {
  const vendor = await requireVendor();
  
  if (model === 'SalaryLevel') {
    await prisma.salaryLevelMaster.create({ data: { vendorId: vendor.id, levelName: data.name, baseSalary: data.amount } });
  } else if (model === 'Deduction') {
    await prisma.deductionMaster.create({ data: { vendorId: vendor.id, name: data.name } });
  } else if (model === 'Bonus') {
    await prisma.bonusMaster.create({ data: { vendorId: vendor.id, name: data.name } });
  } else if (model === 'SalaryType') {
    await prisma.salaryTypeMaster.create({ data: { vendorId: vendor.id, name: data.name } });
  }

  revalidatePath('/vendor/staff');
}

export async function toggleMasterActive(model: 'SalaryLevel' | 'Deduction' | 'Bonus' | 'SalaryType', id: number, isActive: boolean) {
  const vendor = await requireVendor();
  const where = { id, vendorId: vendor.id };

  if (model === 'SalaryLevel') await prisma.salaryLevelMaster.update({ where, data: { isActive } });
  if (model === 'Deduction') await prisma.deductionMaster.update({ where, data: { isActive } });
  if (model === 'Bonus') await prisma.bonusMaster.update({ where, data: { isActive } });
  if (model === 'SalaryType') await prisma.salaryTypeMaster.update({ where, data: { isActive } });

  revalidatePath('/vendor/staff/settings');
}

export async function deleteMaster(model: 'SalaryLevel' | 'Deduction' | 'Bonus' | 'SalaryType', id: number) {
  const vendor = await requireVendor();
  const where = { id, vendorId: vendor.id };

  try {
    if (model === 'SalaryLevel') await prisma.salaryLevelMaster.delete({ where });
    if (model === 'Deduction') await prisma.deductionMaster.delete({ where });
    if (model === 'Bonus') await prisma.bonusMaster.delete({ where });
    if (model === 'SalaryType') await prisma.salaryTypeMaster.delete({ where });
    revalidatePath('/vendor/staff/settings');
  } catch (e: any) {
    throw new Error('Cannot delete this master configuration as it is actively used in staff assignments or past payrolls.');
  }
}

// ========== ATTENDANCE & PUNCHES ==========

export async function logPunch(userId: string, type: 'IN' | 'OUT', manualTimestamp?: string) {
  const vendor = await requireVendor();
  
  const assignment = await prisma.userVendorAssignment.findFirst({
    where: { userId, vendorId: vendor.id }
  });
  if (!assignment) throw new Error('Unauthorized');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let attendance = await prisma.attendance.findFirst({
    where: { userId, date: today },
    include: { punches: { orderBy: { timestamp: 'asc' } } }
  });

  if (!attendance) {
    attendance = await prisma.attendance.create({
      data: { userId, date: today, status: 'PRESENT' },
      include: { punches: true }
    });
  }

  // Create punch
  let punchTimestamp = new Date();
  if (manualTimestamp) {
    const [h, m] = manualTimestamp.split(':');
    punchTimestamp = new Date();
    punchTimestamp.setHours(parseInt(h), parseInt(m), 0, 0);
  }

  await prisma.attendancePunch.create({
    data: {
      attendanceId: attendance.id,
      type,
      timestamp: punchTimestamp
    }
  });

  // Re-calculate hours
  const allPunches = await prisma.attendancePunch.findMany({
    where: { attendanceId: attendance.id },
    orderBy: { timestamp: 'asc' }
  });

  let totalHours = 0;
  let lastIn: Date | null = null;

  for (const punch of allPunches) {
    if (punch.type === 'IN') {
      if (!lastIn) {
        lastIn = punch.timestamp; // Only use the first IN of a session
      }
    } else if (punch.type === 'OUT' && lastIn) {
      const diff = punch.timestamp.getTime() - lastIn.getTime();
      if (diff > 0) {
        totalHours += diff / (1000 * 60 * 60);
      }
      lastIn = null; // reset for next pair
    }
  }

  // Update attendance with new total hours
  await prisma.attendance.update({
    where: { id: attendance.id },
    data: { 
      hoursWorked: totalHours,
      // Keep checkIn/checkOut as legacy fields or reference to first/last
      checkIn: allPunches.find(p => p.type === 'IN')?.timestamp,
      checkOut: [...allPunches].reverse().find(p => p.type === 'OUT')?.timestamp
    }
  });

  revalidatePath('/vendor/staff');
}

export async function deletePunch(punchId: string) {
  const vendor = await requireVendor();
  
  const punch = await prisma.attendancePunch.findUnique({
    where: { id: punchId },
    include: { attendance: true }
  });
  
  if (!punch) return;
  
  await prisma.attendancePunch.delete({ where: { id: punchId } });

  // Re-calculate hours
  const allPunches = await prisma.attendancePunch.findMany({
    where: { attendanceId: punch.attendanceId },
    orderBy: { timestamp: 'asc' }
  });

  let totalHours = 0;
  let lastIn: Date | null = null;

  for (const p of allPunches) {
    if (p.type === 'IN') {
      if (!lastIn) {
        lastIn = p.timestamp;
      }
    } else if (p.type === 'OUT' && lastIn) {
      const diff = p.timestamp.getTime() - lastIn.getTime();
      if (diff > 0) {
        totalHours += diff / (1000 * 60 * 60);
      }
      lastIn = null;
    }
  }

  await prisma.attendance.update({
    where: { id: punch.attendanceId },
    data: { 
      hoursWorked: totalHours,
      checkIn: allPunches.find(x => x.type === 'IN')?.timestamp,
      checkOut: [...allPunches].reverse().find(x => x.type === 'OUT')?.timestamp
    }
  });

  revalidatePath('/vendor/staff');
}

export async function getUserAttendanceHistory(userId: string, year: number, month: number) {
  const vendor = await requireVendor();
  
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0, 23, 59, 59);

  return await prisma.attendance.findMany({
    where: { 
      userId,
      date: {
        gte: startDate,
        lte: endDate
      }
    },
    include: {
      punches: {
        orderBy: { timestamp: 'asc' }
      }
    },
    orderBy: { date: 'asc' }
  });
}

export async function logAttendanceStatus(userId: string, status: 'PRESENT' | 'ABSENT' | 'LEAVE') {
  const vendor = await requireVendor();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await prisma.attendance.findFirst({ where: { userId, date: today } });
  if (existing) {
    await prisma.attendance.update({
      where: { id: existing.id },
      data: { status }
    });
  } else {
    await prisma.attendance.create({
      data: { userId, date: today, status }
    });
  }
  revalidatePath('/vendor/staff');
}

// ========== PAYROLL & SALARY ==========

export async function generateSalaryRecord(userId: string, data: {
  month: number;
  year: number;
  baseSalary: number;
  bonus: number;
  deductions: number;
  breakdown: any;
}) {
  const vendor = await requireVendor();
  const netSalary = data.baseSalary + data.bonus - data.deductions;

  const record = await prisma.salaryRecord.create({
    data: {
      userId,
      month: data.month,
      year: data.year,
      baseSalary: data.baseSalary,
      bonus: data.bonus,
      deductions: data.deductions,
      netSalary,
      breakdown: data.breakdown,
    }
  });

  revalidatePath('/vendor/staff');
  return record;
}

export async function grantAdvance(userId: string, amount: number, notes?: string) {
  const vendor = await requireVendor();
  await prisma.advanceSalary.create({
    data: {
      userId,
      vendorId: vendor.id,
      amount,
      notes
    }
  });
  revalidatePath('/vendor/staff');
}

export async function getAdvances(userId: string) {
  const vendor = await requireVendor();
  return await prisma.advanceSalary.findMany({
    where: { userId, vendorId: vendor.id },
    orderBy: { date: 'desc' }
  });
}

export async function updateStaffAssignment(assignmentId: string, data: {
  roleInVendor?: string;
  isActive?: boolean;
  salaryTypeId?: number;
  salaryLevelId?: number;
  shiftStartTime?: string;
  shiftEndTime?: string;
}) {
  const vendor = await requireVendor();

  // If changing salaryLevelId, we should auto-update baseWage to match the level
  let baseWageUpdate = undefined;
  if (data.salaryLevelId) {
    const level = await prisma.salaryLevelMaster.findUnique({ where: { id: data.salaryLevelId } });
    if (level) baseWageUpdate = level.baseSalary;
  }

  await prisma.userVendorAssignment.update({
    where: { id: assignmentId, vendorId: vendor.id },
    data: { 
      ...data,
      ...(baseWageUpdate ? { baseWage: baseWageUpdate } : {})
    }
  });

  revalidatePath('/vendor/staff');
}

export async function recruitStaff(email: string, role: string) {
  const vendor = await requireVendor();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error('User not registered. Team members must create an account first.');
  }

  const existing = await prisma.userVendorAssignment.findUnique({
    where: { userId_vendorId: { userId: user.id, vendorId: vendor.id } }
  });

  if (existing) {
     throw new Error('Member already exists in your workforce registry.');
  }

  await prisma.userVendorAssignment.create({
    data: {
      userId: user.id,
      vendorId: vendor.id,
      roleInVendor: role,
      isActive: true
    }
  });

  revalidatePath('/vendor/staff');
}
