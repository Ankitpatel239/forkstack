"use strict";
"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { TiffinSubscriptionStatus, TiffinDeliveryStatus } from "@prisma/client";
import { TiffinMealType } from "@/types/tiffin";
import { startOfDay, endOfDay, format } from "date-fns";

export async function getTiffinPlans(vendorId: string) {
  return await prisma.tiffinPlan.findMany({
    where: { vendorId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createTiffinPlan(data: {
  vendorId: string;
  name: string;
  description?: string;
  price: number;
  mealCount: number;
  mealType: TiffinMealType;
  validityDays: number;
  inclusions: string[];
  // New Fields
  timeSlot?: string;
  areas: string[];
  deliveryRadiusKm?: number;
  customStartAllowed: boolean;
  pauseAllowed: boolean;
  maxSkips: number;
  dietType?: string;
  spiceLevel?: string;
  weeklyMenu?: any;
  paymentType: string;
  autoRenew: boolean;
  maxSubscribers?: number;
  tags: string[];
}) {
  const plan = await prisma.tiffinPlan.create({
    data,
  });
  revalidatePath("/vendor/tiffin/plans");
  return plan;
}

export async function updateTiffinPlan(id: string, data: {
  name: string;
  description?: string;
  price: number;
  mealCount: number;
  mealType: TiffinMealType;
  validityDays: number;
  inclusions: string[];
  // New Fields
  timeSlot?: string;
  areas: string[];
  deliveryRadiusKm?: number;
  customStartAllowed: boolean;
  pauseAllowed: boolean;
  maxSkips: number;
  dietType?: string;
  spiceLevel?: string;
  weeklyMenu?: any;
  paymentType: string;
  autoRenew: boolean;
  maxSubscribers?: number;
  tags: string[];
}) {
  const plan = await prisma.tiffinPlan.update({
    where: { id },
    data,
  });
  revalidatePath("/vendor/tiffin/plans");
  return plan;
}

export async function getVendorTiffinInclusions(vendorId: string) {
  const vendor = await prisma.vendorProfile.findUnique({
    where: { id: vendorId },
    select: { tiffinInclusions: true }
  });
  return vendor?.tiffinInclusions || [];
}

export async function updateVendorTiffinInclusions(vendorId: string, inclusions: string[]) {
  const vendor = await prisma.vendorProfile.update({
    where: { id: vendorId },
    data: { tiffinInclusions: inclusions }
  });
  revalidatePath("/vendor/tiffin/plans");
  revalidatePath("/vendor/tiffin/settings");
  return vendor.tiffinInclusions;
}

export async function getVendorTiffinSettings(vendorId: string) {
  const vendor = await prisma.vendorProfile.findUnique({
    where: { id: vendorId },
    select: { 
      tiffinInclusions: true,
      tiffinTimeSlots: true,
      tiffinDietTypes: true,
      tiffinSpiceLevels: true
    }
  });
  return vendor;
}

export async function updateVendorTiffinSettings(vendorId: string, data: {
  tiffinInclusions?: string[];
  tiffinTimeSlots?: string[];
  tiffinDietTypes?: string[];
  tiffinSpiceLevels?: string[];
}) {
  const vendor = await prisma.vendorProfile.update({
    where: { id: vendorId },
    data
  });
  revalidatePath("/vendor/tiffin/plans");
  revalidatePath("/vendor/tiffin/settings");
  return vendor;
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
}export async function getTiffinPlansBySlug(slug: string) {
  if (!slug) return [];
  const vendor = await prisma.vendorProfile.findUnique({
    where: { tenantSlug: slug },
    select: { id: true }
  });

  if (!vendor) return [];

  return await prisma.tiffinPlan.findMany({
    where: { 
      vendorId: vendor.id,
      isActive: true 
    },
    orderBy: { price: "asc" },
  });
}

export async function getTiffinMenu(vendorId: string, date: Date, mealType: TiffinMealType) {
  return await prisma.tiffinMenu.findUnique({
    where: {
      vendorId_date_mealType: {
        vendorId,
        date,
        mealType,
      },
    },
  });
}



export async function getVendorByUserId(userId: string) {
  return await prisma.vendorProfile.findUnique({
    where: { ownerId: userId },
  });
}

export async function updateTiffinMenu(data: {
  vendorId: string;
  date: Date;
  mealType: TiffinMealType;
  items: string[];
  description?: string;
}) {
  const menu = await prisma.tiffinMenu.upsert({
    where: {
      vendorId_date_mealType: {
        vendorId: data.vendorId,
        date: data.date,
        mealType: data.mealType,
      },
    },
    update: {
      items: data.items,
      description: data.description,
    },
    create: data,
  });
  revalidatePath("/vendor/tiffin/menu");
  return menu;
}

export async function updateSubscriptionStatus(id: string, status: TiffinSubscriptionStatus) {
  const sub = await prisma.tiffinSubscription.update({
    where: { id },
    data: { status },
  });
  revalidatePath("/vendor/tiffin/orders");
  revalidatePath("/vendor/tiffin/subscriptions");
  revalidatePath("/vendor/tiffin/deliveries");
  return sub;
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

export async function markAsDelivered(subscriptionId: string, date: Date) {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  // Use a transaction to ensure both updates happen together
  return await prisma.$transaction(async (tx) => {
    // 1. Create or update delivery record
    const delivery = await tx.tiffinDelivery.upsert({
      where: {
        subscriptionId_date: {
          subscriptionId,
          date: dayStart // Normalize to start of day for the unique constraint
        }
      },
      update: {
        status: TiffinDeliveryStatus.DELIVERED
      },
      create: {
        subscriptionId,
        date: dayStart,
        status: TiffinDeliveryStatus.DELIVERED
      }
    });

    // 2. Decrement remaining meals in subscription
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


export async function toggleSubscriptionStatus(id: string, currentStatus: TiffinSubscriptionStatus) {
  const newStatus = currentStatus === "ACTIVE" ? "PAUSED" : "ACTIVE";
  const sub = await prisma.tiffinSubscription.update({
    where: { id },
    data: { status: newStatus },
  });
  revalidatePath("/vendor/tiffin/subscriptions");
  return sub;
}

export async function getTiffinStats(vendorId: string) {
  const today = startOfDay(new Date());
  
  const [activeSubs, totalPlans, deliveriesToday, completedToday] = await Promise.all([
    prisma.tiffinSubscription.count({ where: { vendorId, status: "ACTIVE" } }),
    prisma.tiffinPlan.count({ where: { vendorId, isActive: true } }),
    prisma.tiffinSubscription.count({ 
      where: { 
        vendorId, 
        status: "ACTIVE",
        startDate: { lte: endOfDay(today) },
        OR: [{ endDate: null }, { endDate: { gte: today } }]
      } 
    }),
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
    completedToday,
    revenue: activeSubs * 1500, // Mock calculation for now
  };
}

export async function broadcastMenu(vendorId: string, date: Date, mealType: TiffinMealType) {
  // In a real app, this would integrate with WhatsApp API
  // 1. Get the menu
  const menu = await prisma.tiffinMenu.findUnique({
    where: { vendorId_date_mealType: { vendorId, date, mealType } }
  });
  
  if (!menu) throw new Error("Menu not found for this date/session");

  // 2. Get active subscribers for this meal type
  const subscribers = await prisma.tiffinSubscription.findMany({
    where: { 
      vendorId, 
      status: "ACTIVE",
      plan: { mealType: { in: [mealType, "BOTH"] } }
    },
    include: { customer: true }
  });

  // 3. Simulate sending WhatsApp messages
  console.log(`Broadcasting ${mealType} menu to ${subscribers.length} subscribers...`);
  
  // Return success info
  return {
    count: subscribers.length,
    menuItems: menu.items
  };
}

export async function createManualSubscription(data: {
  vendorId: string;
  planId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  startDate: Date;
  timeSlot?: string;
  dietType?: string;
  spiceLevel?: string;
  latitude?: number;
  longitude?: number;
}) {
  // 1. Find or create the customer user
  let user = await prisma.user.findFirst({
    where: { 
      OR: [
        { phone: data.customerPhone },
        data.customerEmail ? { email: data.customerEmail } : {}
      ]
    }
  });

  if (!user) {
    // Create a shadow user for the customer
    user = await prisma.user.create({
      data: {
        name: data.customerName,
        phone: data.customerPhone,
        email: data.customerEmail || `${data.customerPhone}@tiffin.local`,
        password: "hashed_placeholder", // Vendor created user
        role: "CUSTOMER"
      }
    });
  }

  // 2. Get the plan to find the meal count and snapshots
  const plan = await prisma.tiffinPlan.findUnique({
    where: { id: data.planId }
  });

  if (!plan) throw new Error("Plan not found");

  // 3. Create the subscription
  const subscription = await prisma.tiffinSubscription.create({
    data: {
      vendorId: data.vendorId,
      customerId: user.id,
      planId: data.planId,
      status: "ACTIVE",
      startDate: data.startDate,
      remainingMeals: plan.mealCount,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      // Snapshots for versioning
      planNameSnapshot: plan.name,
      planPriceSnapshot: plan.price,
      inclusionsSnapshot: plan.inclusions,
      timeSlotSnapshot: data.timeSlot || plan.timeSlot,
      dietTypeSnapshot: data.dietType || plan.dietType,
      spiceLevelSnapshot: data.spiceLevel || plan.spiceLevel,
    }
  });

  revalidatePath("/vendor/tiffin/subscriptions");
  revalidatePath("/vendor/tiffin");
  
  return subscription;
}

export async function getTiffinPlan(id: string) {
  return await prisma.tiffinPlan.findUnique({
    where: { id },
  });
}
export async function createCustomerSubscription(data: {
  vendorId: string;
  planId: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  startDate: Date;
  timeSlot?: string;
  dietType?: string;
  spiceLevel?: string;
  latitude?: number;
  longitude?: number;
}) {
  // Logic is similar to manual but focused on customer self-onboarding
  return await createManualSubscription({
    vendorId: data.vendorId,
    planId: data.planId,
    customerName: data.name,
    customerPhone: data.phone,
    customerEmail: data.email,
    address: data.address,
    startDate: data.startDate,
    timeSlot: data.timeSlot,
    dietType: data.dietType,
    spiceLevel: data.spiceLevel,
    latitude: data.latitude,
    longitude: data.longitude
  });
}
