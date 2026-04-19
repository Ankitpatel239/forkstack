'use server';

import { prisma } from '@/lib/db';
import { SubscriptionPlan, SubscriptionStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { requireVendor } from '@/lib/vendor';

export async function subscribeToPlan(planName: string) {
  try {
    const vendor = await requireVendor();
    
    // Validate if the plan name is valid for our enum
    const validPlans = Object.values(SubscriptionPlan);
    if (!validPlans.includes(planName as SubscriptionPlan)) {
      return { success: false, error: "Invalid subscription tier" };
    }

    // In a real app, this would involve Stripe checkout.
    // For now, we update the database directly to simulate a successful subscription.
    
    await prisma.vendorProfile.update({
      where: { id: vendor.id },
      data: {
        subscriptionPlan: planName as SubscriptionPlan,
        subscriptionStatus: 'ACTIVE',
        subscriptionStart: new Date(),
        subscriptionEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) // 1 year
      }
    });

    // Create a payment record
    const planDetails = await (prisma as any).platformPlan.findUnique({
      where: { name: planName }
    });

    if (planDetails) {
      await prisma.subscriptionPayment.create({
        data: {
          vendorId: vendor.id,
          amount: planDetails.price,
          plan: planName as SubscriptionPlan,
          startDate: new Date(),
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          status: 'COMPLETED'
        }
      });
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
