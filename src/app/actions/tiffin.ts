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
