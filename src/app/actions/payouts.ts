
'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { PayoutStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function updatePayoutStatus(id: string, status: PayoutStatus, adminNotes?: string, transactionId?: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const payout = await prisma.payout.update({
    where: { id },
    data: {
      status,
      adminNotes,
      transactionId,
      processedAt: status === 'COMPLETED' ? new Date() : undefined
    }
  });

  revalidatePath('/admin/payments');
  revalidatePath('/vendor/payments');

  return payout;
}

export async function requestPayout(vendorId: string, amount: number, vendorNotes?: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'VENDOR_OWNER') {
    throw new Error('Unauthorized');
  }

  const payout = await prisma.payout.create({
    data: {
      vendorId,
      amount,
      vendorNotes,
      status: 'PENDING'
    }
  });

  revalidatePath('/vendor/payments');
  revalidatePath('/admin/payments');

  return payout;
}
