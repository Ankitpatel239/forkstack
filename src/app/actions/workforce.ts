
'use server';

import { prisma } from '@/lib/db';
import { requireVendor } from '@/lib/vendor';
import { revalidatePath } from 'next/cache';

export async function logAttendance(userId: string, status: 'PRESENT' | 'ABSENT' | 'LEAVE', checkIn?: Date, checkOut?: Date, notes?: string) {
  const vendor = await requireVendor();

  // Ensure user belongs to this vendor
  const assignment = await prisma.userVendorAssignment.findFirst({
    where: { userId, vendorId: vendor.id }
  });

  if (!assignment) throw new Error('Unauthorized');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await prisma.attendance.findFirst({
    where: { userId, date: today }
  });

  let hoursWorked = undefined;
  if (checkIn && checkOut) {
    hoursWorked = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
  }

  if (existing) {
    await prisma.attendance.update({
      where: { id: existing.id },
      data: { status, checkIn, checkOut, hoursWorked, notes }
    });
  } else {
    await prisma.attendance.create({
      data: { userId, status, checkIn, checkOut, hoursWorked, notes, date: today }
    });
  }

  revalidatePath('/vendor/staff');
}

export async function generateSalaryRecord(userId: string, data: {
  month: number;
  year: number;
  baseSalary: number;
  bonus: number;
  deductions: number;
}) {
  const vendor = await requireVendor();

  const netSalary = data.baseSalary + data.bonus - data.deductions;

  const record = await prisma.salaryRecord.create({
    data: {
      userId,
      ...data,
      netSalary
    }
  });

  revalidatePath('/vendor/staff');
  return record;
}

export async function updateStaffRole(assignmentId: string, role: string, isActive: boolean) {
  const vendor = await requireVendor();

  await prisma.userVendorAssignment.update({
    where: { id: assignmentId, vendorId: vendor.id },
    data: { roleInVendor: role, isActive }
  });

  revalidatePath('/vendor/staff');
}

export async function recruitStaff(email: string, role: string) {
  const vendor = await requireVendor();

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error('User not registered. Team members must create an account first.');
  }

  const existing = await prisma.userVendorAssignment.findUnique({
    where: {
      userId_vendorId: {
        userId: user.id,
        vendorId: vendor.id
      }
    }
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
