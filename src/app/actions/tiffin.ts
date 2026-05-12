"use strict";
"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { TiffinSubscriptionStatus, TiffinDeliveryStatus, TiffinMealType } from "@prisma/client";
import { startOfDay, endOfDay, format } from "date-fns";

// ========== MASTER DATA ACTIONS ==========

export async function getTiffinItems(vendorId: string) {
  return await prisma.tiffinItem.findMany({
    where: { vendorId },
    orderBy: { name: "asc" },
  });
}

export async function createTiffinItem(vendorId: string, data: any) {
  const item = await prisma.tiffinItem.create({
    data: { ...data, vendorId },
  });
  revalidatePath("/vendor/tiffin/masters");
  return item;
}

export async function updateTiffinItem(id: string, data: any) {
  const item = await prisma.tiffinItem.update({
    where: { id },
    data,
  });
  revalidatePath("/vendor/tiffin/masters");
  return item;
}

export async function deleteTiffinItem(id: string) {
  await prisma.tiffinItem.delete({ where: { id } });
  revalidatePath("/vendor/tiffin/masters");
}

// Meal Sessions (Masters for Time Slots)
export async function getTiffinSessions(vendorId: string) {
  return await prisma.tiffinMealSession.findMany({
    where: { vendorId },
  });
}

export async function updateTiffinSession(vendorId: string, mealType: TiffinMealType, data: { startTime: string; endTime: string; isActive: boolean }) {
  const session = await prisma.tiffinMealSession.upsert({
    where: { vendorId_mealType: { vendorId, mealType } },
    update: data,
    create: { ...data, vendorId, mealType },
  });
  revalidatePath("/vendor/tiffin/masters");
  revalidatePath("/vendor/tiffin/deliveries");
  return session;
}

// Inclusions Master
export async function getTiffinInclusions(vendorId: string) {
  return await prisma.tiffinInclusion.findMany({
    where: { vendorId },
    orderBy: { name: "asc" },
  });
}

export async function createTiffinInclusion(vendorId: string, data: any) {
  const inc = await prisma.tiffinInclusion.create({
    data: { ...data, vendorId },
  });
  revalidatePath("/vendor/tiffin/masters");
  return inc;
}

export async function deleteTiffinInclusion(id: string) {
  await prisma.tiffinInclusion.delete({ where: { id } });
  revalidatePath("/vendor/tiffin/masters");
}

// Area Master
export async function getTiffinAreas(vendorId: string) {
  return await prisma.tiffinArea.findMany({
    where: { vendorId },
    orderBy: { name: "asc" },
  });
}

export async function createTiffinArea(vendorId: string, data: any) {
  const area = await prisma.tiffinArea.create({
    data: { ...data, vendorId },
  });
  revalidatePath("/vendor/tiffin/masters");
  return area;
}

export async function deleteTiffinArea(id: string) {
  await prisma.tiffinArea.delete({ where: { id } });
  revalidatePath("/vendor/tiffin/masters");
}

// Diet Type Master
export async function getTiffinDietTypes(vendorId: string) {
  return await prisma.tiffinDietType.findMany({
    where: { vendorId },
    orderBy: { name: "asc" },
  });
}

export async function createTiffinDietType(vendorId: string, data: any) {
  const res = await prisma.tiffinDietType.create({
    data: { ...data, vendorId },
  });
  revalidatePath("/vendor/tiffin/masters");
  return res;
}

export async function deleteTiffinDietType(id: string) {
  await prisma.tiffinDietType.delete({ where: { id } });
  revalidatePath("/vendor/tiffin/masters");
}

// Spice Level Master
export async function getTiffinSpiceLevels(vendorId: string) {
  return await prisma.tiffinSpiceLevel.findMany({
    where: { vendorId },
    orderBy: { name: "asc" },
  });
}

export async function createTiffinSpiceLevel(vendorId: string, data: any) {
  const res = await prisma.tiffinSpiceLevel.create({
    data: { ...data, vendorId },
  });
  revalidatePath("/vendor/tiffin/masters");
  return res;
}

export async function deleteTiffinSpiceLevel(id: string) {
  await prisma.tiffinSpiceLevel.delete({ where: { id } });
  revalidatePath("/vendor/tiffin/masters");
}

// ========== CORE TIFFIN ACTIONS ==========

export async function getTiffinPlans(vendorId: string) {
  return await prisma.tiffinPlan.findMany({
    where: { vendorId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createTiffinPlan(data: any) {
  const plan = await prisma.tiffinPlan.create({
    data,
  });
  revalidatePath("/vendor/tiffin/plans");
  return plan;
}

export async function updateTiffinPlan(id: string, data: any) {
  const plan = await prisma.tiffinPlan.update({
    where: { id },
    data,
  });
  revalidatePath("/vendor/tiffin/plans");
  return plan;
}

export async function deleteTiffinPlan(id: string) {
  await prisma.tiffinPlan.delete({
    where: { id },
  });
  revalidatePath("/vendor/tiffin/plans");
}

export async function getTiffinSubscriptions(vendorId: string) {
  return await prisma.tiffinSubscription.findMany({
    where: { vendorId },
    include: {
      customer: true,
      plan: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function toggleSubscriptionStatus(subscriptionId: string, currentStatus: TiffinSubscriptionStatus) {
  const newStatus = currentStatus === "ACTIVE" ? TiffinSubscriptionStatus.PAUSED : TiffinSubscriptionStatus.ACTIVE;
  
  const updated = await prisma.tiffinSubscription.update({
    where: { id: subscriptionId },
    data: { status: newStatus },
  });

  revalidatePath("/vendor/tiffin/subscriptions");
  return updated;
}

export async function getTiffinMenuSets(vendorId: string) {
  return await prisma.tiffinMenuSet.findMany({
    where: { vendorId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createTiffinMenuSet(data: any) {
  const set = await prisma.tiffinMenuSet.create({
    data,
  });
  revalidatePath("/vendor/tiffin/menu");
  return set;
}

export async function updateTiffinMenuSet(id: string, data: any) {
  const set = await prisma.tiffinMenuSet.update({
    where: { id },
    data,
  });
  revalidatePath("/vendor/tiffin/menu");
  return set;
}

export async function deleteTiffinMenuSet(id: string) {
  await prisma.tiffinMenuSet.delete({
    where: { id },
  });
  revalidatePath("/vendor/tiffin/menu");
}

export async function getTiffinWeeklySchedule(vendorId: string) {
  return await prisma.tiffinWeeklySchedule.findMany({
    where: { vendorId },
    include: { menuSet: true },
  });
}

export async function updateTiffinWeeklySchedule(data: any) {
  const schedule = await prisma.tiffinWeeklySchedule.upsert({
    where: {
      vendorId_dayOfWeek_mealType: {
        vendorId: data.vendorId,
        dayOfWeek: data.dayOfWeek,
        mealType: data.mealType,
      },
    },
    update: {
      menuSetId: data.menuSetId,
    },
    create: data,
  });
  revalidatePath("/vendor/tiffin/menu");
  return schedule;
}

export async function getTiffinMealRequests(vendorId: string, date: Date) {
  return await prisma.tiffinMealRequest.findMany({
    where: {
      subscription: { vendorId },
      date: startOfDay(date),
    },
    include: {
      subscription: {
        include: { customer: true }
      }
    }
  });
}

export async function getDailyDeliveries(vendorId: string, date: Date) {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  return await prisma.tiffinSubscription.findMany({
    where: {
      vendorId,
      status: "ACTIVE",
      startDate: { lte: dayEnd },
      OR: [
        { endDate: null },
        { endDate: { gte: dayStart } }
      ]
    },
    include: {
      customer: true,
      plan: true,
      deliveries: {
        where: {
          date: {
            gte: dayStart,
            lte: dayEnd
          }
        }
      }
    }
  });
}

export async function markAsDelivered(subscriptionId: string, date: Date, mealType: TiffinMealType) {
  const dayStart = startOfDay(date);

  return await prisma.$transaction(async (tx) => {
    const delivery = await tx.tiffinDelivery.upsert({
      where: {
        subscriptionId_date_mealType: {
          subscriptionId,
          date: dayStart,
          mealType
        }
      },
      update: {
        status: TiffinDeliveryStatus.DELIVERED
      },
      create: {
        subscriptionId,
        date: dayStart,
        mealType,
        status: TiffinDeliveryStatus.DELIVERED
      }
    });

    await tx.tiffinSubscription.update({
      where: { id: subscriptionId },
      data: {
        remainingMeals: {
          decrement: 1
        }
      }
    });

    return delivery;
  });
}

export async function getVendorByUserId(userId: string) {
  return await prisma.vendorProfile.findUnique({
    where: { ownerId: userId },
  });
}

export async function getTiffinMenu(vendorId: string, date: Date, mealType: TiffinMealType) {
  return await prisma.tiffinMenu.findUnique({
    where: {
      vendorId_date_mealType: {
        vendorId,
        date: startOfDay(date),
        mealType,
      },
    },
  });
}

export async function updateTiffinMenu(data: any) {
  const menu = await prisma.tiffinMenu.upsert({
    where: {
      vendorId_date_mealType: {
        vendorId: data.vendorId,
        date: startOfDay(data.date),
        mealType: data.mealType,
      },
    },
    update: {
      items: data.items,
      description: data.description,
    },
    create: {
      ...data,
      date: startOfDay(data.date)
    },
  });
  revalidatePath("/vendor/tiffin/menu");
  return menu;
}

export async function broadcastMenu(vendorId: string, date: Date, mealType: TiffinMealType) {
  const menu = await prisma.tiffinMenu.findUnique({
    where: { vendorId_date_mealType: { vendorId, date: startOfDay(date), mealType } }
  });
  
  if (!menu) throw new Error("Menu not found");
 
  const subscribers = await prisma.tiffinSubscription.findMany({
    where: { 
      vendorId, 
      status: "ACTIVE",
      plan: { mealTypes: { has: mealType } }
    },
    include: { customer: true }
  });

  return {
    count: subscribers.length,
    menuItems: menu.items
  };
}

export async function createManualSubscription(data: any) {
  const { vendorId, customerName, customerPhone, customerEmail, planId, address, startDate, dietType, spiceLevel } = data;

  // 1. Get Plan details for snapshot
  const plan = await prisma.tiffinPlan.findUnique({
    where: { id: planId }
  });

  if (!plan) throw new Error("Plan not found");

  // 2. Upsert Customer (User)
  // We identify by phone for tiffin service
  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { phone: customerPhone },
        customerEmail ? { email: customerEmail } : undefined
      ].filter(Boolean) as any
    }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: customerName,
        phone: customerPhone,
        email: customerEmail || `${customerPhone}@tiffin.local`,
        role: "CUSTOMER",
      }
    });
  }

  // 3. Create Subscription
  const subscription = await prisma.tiffinSubscription.create({
    data: {
      vendorId,
      customerId: user.id,
      planId,
      status: "ACTIVE",
      startDate: new Date(startDate),
      remainingMeals: plan.mealCount,
      customerName,
      address,
      dietTypeSnapshot: dietType || plan.dietType,
      spiceLevelSnapshot: spiceLevel || plan.spiceLevel,
      planNameSnapshot: plan.name,
      planPriceSnapshot: plan.price,
      inclusionsSnapshot: plan.inclusions,
      timeSlotSnapshot: data.timeSlot || plan.timeSlot
    }
  });

  revalidatePath("/vendor/tiffin/subscriptions");
  return subscription;
}

export async function getTiffinStats(vendorId: string) {
  const today = startOfDay(new Date());

  const [activeSubs, totalPlans, deliveriesToday, completedToday] = await Promise.all([
    // 1. Total Active Subscriptions
    prisma.tiffinSubscription.count({
      where: { vendorId, status: "ACTIVE" }
    }),
    
    // 2. Total Plans
    prisma.tiffinPlan.count({
      where: { vendorId, isActive: true }
    }),

    // 3. Deliveries Scheduled for Today
    prisma.tiffinSubscription.count({
      where: {
        vendorId,
        status: "ACTIVE",
        startDate: { lte: today },
        OR: [
          { endDate: null },
          { endDate: { gte: today } }
        ]
      }
    }),

    // 4. Completed Deliveries Today
    prisma.tiffinDelivery.count({
      where: {
        subscription: { vendorId },
        date: today,
        status: "DELIVERED"
      }
    })
  ]);

  return {
    activeSubs,
    totalPlans,
    deliveriesToday,
    completedToday
  };
}

export async function getTiffinPlansBySlug(slug: string) {
  const vendor = await prisma.vendorProfile.findUnique({
    where: { tenantSlug: slug },
    include: {
      tiffinPlans: {
        where: { isActive: true },
        orderBy: { price: "asc" }
      }
    }
  });

  return vendor?.tiffinPlans || [];
}

export async function createCustomerSubscription(data: any) {
  // Same logic as manual but used for public checkout
  return await createManualSubscription(data);
}

export async function getTiffinPlan(id: string) {
  return await prisma.tiffinPlan.findUnique({
    where: { id }
  });
}

export async function getVendorTiffinSettings(vendorId: string) {
  const [sessions, diets, spices] = await Promise.all([
    prisma.tiffinMealSession.findMany({ where: { vendorId, isActive: true } }),
    prisma.tiffinDietType.findMany({ where: { vendorId } }),
    prisma.tiffinSpiceLevel.findMany({ where: { vendorId } }),
  ]);

  return {
    timeSlots: sessions.map(s => `${s.mealType}: ${s.startTime} - ${s.endTime}`),
    dietTypes: diets.map(d => d.name),
    spiceLevels: spices.map(s => s.name),
  };
}

export async function updateSubscriptionStatus(id: string, status: any) {
  return await prisma.tiffinSubscription.update({
    where: { id },
    data: { status }
  });
}
