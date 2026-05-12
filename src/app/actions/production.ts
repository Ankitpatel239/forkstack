"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { startOfDay, endOfDay } from "date-fns";
import { TiffinMealType, ProductionStatus } from "@prisma/client";

export async function getProductionPlans(vendorId: string, date: Date) {
  return await prisma.productionPlan.findMany({
    where: { 
      vendorId,
      date: {
        gte: startOfDay(date),
        lte: endOfDay(date)
      }
    },
    include: {
      items: {
        include: {
          menuItem: true,
          tiffinItem: true
        }
      }
    },
    orderBy: { mealType: 'asc' }
  });
}

export async function generateProductionPlan(vendorId: string, date: Date, mealType: TiffinMealType) {
  const dayStart = startOfDay(date);
  
  // 1. Get Tiffin Subscriptions for this meal type
  const subscriptions = await prisma.tiffinSubscription.findMany({
    where: {
      vendorId,
      status: "ACTIVE",
      startDate: { lte: dayStart },
      OR: [
        { endDate: null },
        { endDate: { gte: dayStart } }
      ],
      plan: {
        mealTypes: { has: mealType }
      }
    }
  });

  // 2. Get Menu for today to see what items are being served
  const menu = await prisma.tiffinMenu.findUnique({
    where: { vendorId_date_mealType: { vendorId, date: dayStart, mealType } }
  });

  if (!menu) throw new Error("No menu defined for this date/meal type");

  // 3. Create or Update Production Plan
  const plan = await prisma.productionPlan.upsert({
    where: { vendorId_date_mealType: { vendorId, date: dayStart, mealType } },
    update: { updatedAt: new Date() },
    create: { vendorId, date: dayStart, mealType, status: "PLANNED" }
  });

  // 4. Generate Production Items for each dish in the menu
  const servingCount = subscriptions.length;

  // Clear old items if it was already planned (optional, but keep it fresh)
  await prisma.productionItem.deleteMany({ where: { planId: plan.id } });

  // Add new items
  const productionItems = await Promise.all(menu.items.map(async (itemName) => {
    const tiffinItem = await prisma.tiffinItem.findFirst({
      where: { vendorId, name: itemName }
    });

    return await prisma.productionItem.create({
      data: {
        planId: plan.id,
        name: itemName,
        estimatedServings: servingCount,
        tiffinItemId: tiffinItem?.id
      }
    });
  }));

  revalidatePath("/vendor/tiffin/production");
  return { plan, items: productionItems };
}

export async function updateProductionStatus(planId: string, status: ProductionStatus) {
  const plan = await prisma.productionPlan.update({
    where: { id: planId },
    data: { status }
  });
  revalidatePath("/vendor/tiffin/production");
  return plan;
}

export async function updateProductionItem(itemId: string, data: { actualPrepared?: number, wasteQuantity?: number }) {
  const item = await prisma.productionItem.update({
    where: { id: itemId },
    data
  });
  revalidatePath("/vendor/tiffin/production");
  return item;
}

export async function getProductionAnalytics(vendorId: string, days: number = 7) {
  const startDate = startOfDay(new Date());
  startDate.setDate(startDate.getDate() - days);

  const plans = await prisma.productionPlan.findMany({
    where: {
      vendorId,
      date: { gte: startDate }
    },
    include: { items: true }
  });

  // Basic stats
  const totalProduced = plans.reduce((acc, p) => acc + p.items.reduce((sum, i) => sum + i.actualPrepared, 0), 0);
  const totalWaste = plans.reduce((acc, p) => acc + p.items.reduce((sum, i) => sum + i.wasteQuantity, 0), 0);

  return {
    totalProduced,
    totalWaste,
    wastePercentage: totalProduced > 0 ? (totalWaste / totalProduced) * 100 : 0,
    planCount: plans.length
  };
}
