'use server';

import { prisma } from '@/lib/db';
import { requireVendor } from '@/lib/vendor';
import { revalidatePath } from 'next/cache';
import { ReservationStatus } from '@prisma/client';

// Helper to save logs using standard Prisma Model
async function saveHistoryLog(reservationId: string, action: string, details: string, changedBy: string = 'Staff') {
  try {
    await (prisma as any).reservationLog.create({
      data: {
        reservationId,
        action,
        details,
        changedBy
      }
    });
  } catch (err) {
    console.error("HISTORY LOG ERROR:", err);
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
      tableId: data.tableId || null,
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
      tableId: data.tableId || null,
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
  
  const reservations = await (prisma.reservation as any).findMany({
    where: { vendorId: vendor.id },
    include: { 
      table: true,
      logs: {
        orderBy: { createdAt: 'desc' }
      },
      order: {
        include: { items: true }
      }
    },
    orderBy: { reservationDate: 'desc' }
  });

  return JSON.parse(JSON.stringify(reservations));
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

// NEW: Public check for conflicts
export async function checkReservationConflicts(tableId: string, startTime: Date) {
  // We assume a standard reservation lasts 2 hours
  const requestedStart = new Date(startTime);
  const requestedEnd = new Date(requestedStart.getTime() + 2 * 60 * 60 * 1000);

  const conflicts = await prisma.reservation.findMany({
    where: {
      tableId,
      status: { notIn: ['CANCELLED', 'COMPLETED'] },
      // Check if it's the same day
      reservationDate: {
        gte: new Date(requestedStart.setHours(0,0,0,0)),
        lte: new Date(requestedStart.setHours(23,59,59,999))
      }
    }
  });

  for (const res of conflicts) {
    const existingStart = new Date(res.startTime);
    const existingEnd = new Date(existingStart.getTime() + 2 * 60 * 60 * 1000);

    // 1. HARD CONFLICT: Overlapping times
    const isOverlapping = (requestedStart < existingEnd && requestedEnd > existingStart);
    if (isOverlapping) {
      return { 
        type: 'HARD', 
        message: 'This table is already booked for this time slot. Please choose another table or time.' 
      };
    }

    // 2. SOFT CONFLICT: Next reservation starts within 2 hours (the "1-hour rule" warning)
    // If our requested start is before their start, but within 2 hours of it
    if (requestedStart < existingStart && (existingStart.getTime() - requestedStart.getTime()) <= 2 * 60 * 60 * 1000) {
      const timeStr = existingStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return {
        type: 'SOFT',
        message: `Sir, this table is reserved from ${timeStr}. If you are ready to change the table later, it will be helpful for us. You can book it now but please leave the table before that time.`
      };
    }
  }

  return { type: 'NONE' };
}

// NEW: Public cancel action for customers
export async function publicCancelReservation(id: string, phone: string) {
  const reservation = await prisma.reservation.findUnique({
    where: { id }
  });

  if (!reservation || reservation.customerPhone !== phone) {
    throw new Error('Reservation not found or phone mismatch');
  }

  const updated = await prisma.reservation.update({
    where: { id },
    data: { status: 'CANCELLED' }
  });

  await saveHistoryLog(id, 'CANCELLED', 'Reservation cancelled by customer', 'Customer');
  
  revalidatePath('/vendor/reservations');
  return updated;
}
