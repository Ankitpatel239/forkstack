"use strict";
"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { TiffinMealType } from "@/types/tiffin";

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
}) {
  const plan = await prisma.tiffinPlan.create({
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
}export async function getTiffinPlansBySlug(slug: string) {
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

import { format, startOfDay, endOfDay } from "date-fns";
import { TiffinDeliveryStatus } from "@prisma/client";

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

