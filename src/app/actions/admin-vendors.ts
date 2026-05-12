
'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateVendorSubscription(vendorId: string, data: {
  plan: any;
  status: any;
  expiryDate: Date;
}) {
  try {
    // Using raw SQL to bypass stale enum validation in the generated Prisma client
    await prisma.$executeRawUnsafe(
      `UPDATE "VendorProfile" SET "subscriptionPlan" = $1, "subscriptionStatus" = $2::"SubscriptionStatus", "subscriptionEnd" = $3 WHERE "id" = $4`,
      data.plan,
      data.status,
      data.expiryDate,
      vendorId
    );
    revalidatePath('/admin/vendors');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
