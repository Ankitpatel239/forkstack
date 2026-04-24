
'use server';

import { prisma } from '@/lib/db';
import { requireVendor } from '@/lib/vendor';
import { revalidatePath } from 'next/cache';
import { ReservationStatus } from '@prisma/client';

// Helper to save logs using raw SQL to bypass Prisma Client sync issues
async function saveHistoryLog(reservationId: string, action: string, details: string, changedBy: string = 'Staff') {
  console.log(`[HISTORY LOG] Attempting to save: ${action} for ${reservationId}`);
  try {
    const id = `cl${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`.substring(0, 25);
    
    // Auto-discover the real table name from the DB
    const tables: any = await prisma.$queryRaw`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'`;
    const realTableName = tables.find((t: any) => t.tablename.toLowerCase() === 'reservationlog')?.tablename || 'ReservationLog';
    
    console.log(`[HISTORY LOG] Using table name: ${realTableName}`);

    await (prisma as any).$executeRawUnsafe(
      `INSERT INTO "${realTableName}" (id, "reservationId", action, details, "changedBy", "createdAt") VALUES ($1, $2, $3, $4, $5, $6)`,
      id, reservationId, action, details, changedBy, new Date()
    );
    
    console.log("[HISTORY LOG] Success!");
  } catch (err: any) {
    console.error("[HISTORY LOG] CRITICAL ERROR:", err.message);
  }
}

export async function createReservation(data: {
  vendorId: string;
  tableId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  reservationDate: Date;
  startTime: Date;
  guestCount: number;
  notes?: string;
  createdBy?: string;
}) {
  const reservation = await (prisma.reservation as any).create({
    data: {
      vendorId: data.vendorId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      reservationDate: data.reservationDate,
      startTime: data.startTime,
      guestCount: data.guestCount,
      notes: data.notes,
      status: 'PENDING',
      table: data.tableId ? { connect: { id: data.tableId } } : undefined,
    }
  });

  await saveHistoryLog(reservation.id, 'CREATED', 'Reservation created', data.createdBy || 'Customer');

  revalidatePath('/vendor/reservations');
  return reservation;
}

export async function editReservation(id: string, data: {
  tableId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  reservationDate: Date;
  startTime: Date;
  guestCount: number;
  notes?: string;
}) {
  const vendor = await requireVendor();

  const reservation = await (prisma.reservation as any).update({
    where: { id, vendorId: vendor.id },
    data: {
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || null,
      reservationDate: data.reservationDate,
      startTime: data.startTime,
      guestCount: data.guestCount,
      notes: data.notes || null,
      table: data.tableId ? { connect: { id: data.tableId } } : { disconnect: true },
    }
  });

  await saveHistoryLog(id, 'EDITED', 'Reservation details updated by staff', 'Vendor Staff');

  revalidatePath('/vendor/reservations');
  return reservation;
}

export async function updateReservationStatus(id: string, status: ReservationStatus) {
  const vendor = await requireVendor();

  const reservation = await (prisma.reservation as any).update({
    where: { id, vendorId: vendor.id },
    data: { status }
  });

  await saveHistoryLog(id, 'STATUS_UPDATED', `Status changed to ${status}`, 'Vendor Staff');

  revalidatePath('/vendor/reservations');
  return reservation;
}

export async function getReservations() {
  const vendor = await requireVendor();
  
  const reservations = await prisma.reservation.findMany({
    where: { vendorId: vendor.id },
    include: { table: true },
    orderBy: { reservationDate: 'desc' }
  });

  try {
    // Discover real table name
    const tables: any = await prisma.$queryRaw`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'`;
    const realTableName = tables.find((t: any) => t.tablename.toLowerCase() === 'reservationlog')?.tablename || 'ReservationLog';

    // Fetch ALL logs and filter in memory to be 100% sure we don't miss anything due to SQL type/case issues
    const allLogsRaw: any[] = await (prisma as any).$queryRawUnsafe(`SELECT * FROM "${realTableName}"`);
    
    const reservationsWithLogs = reservations.map(res => {
      const matchedLogs = allLogsRaw
        .filter(l => (l.reservationId === res.id || l.reservationid === res.id || l.RESERVATIONID === res.id))
        .map(rl => ({
          id: rl.id || rl.ID,
          action: rl.action || rl.ACTION,
          details: rl.details || rl.DETAILS,
          changedBy: rl.changedBy || rl.changedby || rl.CHANGEDBY,
          createdAt: rl.createdAt || rl.createdat || rl.CREATEDAT
        }))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return { ...res, logs: matchedLogs };
    });

    return JSON.parse(JSON.stringify(reservationsWithLogs));
  } catch (err) {
    console.error("HISTORY FETCH CRASHED, RETURNING RAW:", err);
    return JSON.parse(JSON.stringify(reservations));
  }
}

export async function getAvailableTables(vendorId: string, date: Date) {
  return prisma.table.findMany({
    where: { 
      vendorId,
      isActive: true
    },
    orderBy: { tableNumber: 'asc' }
  });
}
