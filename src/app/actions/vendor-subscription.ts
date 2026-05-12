
'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function getVendorSubscription() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Using raw SQL to bypass stale enum validation in the generated Prisma client
    const vendorsRaw = await prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM "VendorProfile" WHERE "ownerId" = $1 LIMIT 1`,
      session.user.id
    );
    const vendor = vendorsRaw[0];

    if (!vendor) {
      return { success: false, error: 'Vendor profile not found' };
    }

    // Fetch payments separately as we are using raw SQL for the main vendor fetch
    const payments = await prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM "SubscriptionPayment" WHERE "vendorId" = $1 ORDER BY "createdAt" DESC LIMIT 1`,
      vendor.id
    );

    return { success: true, data: { ...vendor, subscriptionPayments: payments } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAvailablePlans() {
  try {
    const plans = await (prisma as any).platformPlan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
      include: {
        category: true
      }
    });
    
    const features = await (prisma as any).platformFeature.findMany();
    const limits = await (prisma as any).platformLimit.findMany();

    return { 
      success: true, 
      data: { 
        plans, 
        features, 
        limits 
      } 
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function subscribeToPlan(planName: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const vendorsRaw = await prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM "VendorProfile" WHERE "ownerId" = $1 LIMIT 1`,
      session.user.id
    );
    const vendor = vendorsRaw[0];

    if (!vendor) {
      return { success: false, error: 'Vendor profile not found' };
    }

    // Fetch plan details for pricing
    const plan = await (prisma as any).platformPlan.findUnique({
      where: { name: planName }
    });

    // In a real app, this would trigger a Stripe checkout or similar.
    // For now, we'll just update the plan directly as requested.
    // Using raw SQL to bypass stale enum validation in the generated Prisma client
    await prisma.$executeRawUnsafe(
      `UPDATE "VendorProfile" SET "subscriptionPlan" = $1, "subscriptionStatus" = $2::"SubscriptionStatus", "subscriptionEnd" = $3 WHERE "id" = $4`,
      planName,
      'ACTIVE',
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      vendor.id
    );

    // Create a subscription payment record for history
    if (plan) {
      await prisma.$executeRawUnsafe(
        `INSERT INTO "SubscriptionPayment" (id, "vendorId", amount, plan, "startDate", "endDate", status, "createdAt") 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        Math.random().toString(36).substring(7),
        vendor.id,
        plan.price,
        plan.displayName,
        new Date(),
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        'COMPLETED',
        new Date()
      );
    }

    revalidatePath('/vendor/subscription');
    revalidatePath('/vendor/settings');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getVendorFeatures() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Using raw SQL to bypass stale enum validation
    const vendorsRaw = await prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM "VendorProfile" WHERE "ownerId" = $1 LIMIT 1`,
      session.user.id
    );
    const vendor = vendorsRaw[0];

    if (!vendor) {
      return { success: false, error: 'Vendor profile not found' };
    }

    const plan = await (prisma as any).platformPlan.findUnique({
      where: { name: vendor.subscriptionPlan },
      include: {
        category: true
      }
    });

    if (!plan) {
      // Default features if plan not found (fallback)
      return { 
        success: true, 
        data: { 
          features: [], 
          category: 'BASIC',
          limits: {},
          isLocked: vendor.isLocked || false
        } 
      };
    }

    return { 
      success: true, 
      data: { 
        features: plan.features, 
        category: plan.categoryName,
        limits: plan.limits,
        isLocked: vendor.isLocked || false
      } 
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
