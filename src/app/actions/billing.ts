'use server';

import { prisma } from '@/lib/db';
import { SubscriptionStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { requireVendor } from '@/lib/vendor';

export async function subscribeToPlan(planName: string) {
  try {
    const vendor = await requireVendor();
    
    // Validate if the plan name exists in our platform master
    const planExists = await (prisma as any).platformPlan.findUnique({
      where: { name: planName }
    });
    if (!planExists) {
      return { success: false, error: "Invalid subscription tier" };
    }

    // In a real app, this would involve Stripe checkout.
    // For now, we update the database directly to simulate a successful subscription.
    
    // Using raw SQL to bypass stale enum validation in the generated Prisma client
    await prisma.$executeRawUnsafe(
      `UPDATE "VendorProfile" SET "subscriptionPlan" = $1, "subscriptionStatus" = $2::"SubscriptionStatus", "subscriptionStart" = $3, "subscriptionEnd" = $4 WHERE "id" = $5`,
      planName,
      'ACTIVE',
      new Date(),
      new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      vendor.id
    );

    // Create a payment record
    const planDetails = await (prisma as any).platformPlan.findUnique({
      where: { name: planName }
    });

    if (planDetails) {
      await prisma.$executeRawUnsafe(
        `INSERT INTO "SubscriptionPayment" (id, "vendorId", amount, plan, "startDate", "endDate", status, "createdAt") 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        Math.random().toString(36).substring(7), // simple cuid-like
        vendor.id,
        planDetails.price,
        planName,
        new Date(),
        new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        'COMPLETED',
        new Date()
      );
    }

    revalidatePath('/vendor/settings');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPlatformPlans() {
  try {
    const plans = await (prisma as any).platformPlan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' }
    });
    return { success: true, data: plans };
  } catch (error) {
    return { success: false, error: "Failed to fetch plans" };
  }
}
