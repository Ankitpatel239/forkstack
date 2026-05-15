"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deductStockForProduction(productionItemId: string, actualPrepared: number) {
  // 1. Get the ProductionItem and its linked Recipe
  const item = await prisma.productionItem.findUnique({
    where: { id: productionItemId },
    include: {
      tiffinItem: {
        include: { recipe: { include: { ingredients: true } } }
      },
      menuItem: {
        include: { recipe: { include: { ingredients: true } } }
      }
    }
  });

  if (!item) throw new Error("Production item not found");

  const recipe = item.tiffinItem?.recipe || item.menuItem?.recipe;
  if (!recipe) return; // No recipe linked, cannot auto-deduct

  // 2. Calculate consumption based on servings
  // Recipe ingredients are per 'recipe.servings'
  const multiplier = actualPrepared / recipe.servings;

  for (const ingredient of recipe.ingredients) {
    const consumptionQty = ingredient.quantity * multiplier;
    
    // Log consumption
    await prisma.inventoryConsumption.create({
      data: {
        inventoryItemId: ingredient.inventoryItemId,
        productionItemId: item.id,
        quantity: consumptionQty
      }
    });

    // Deduct stock
    const invItem = await prisma.inventoryItem.update({
      where: { id: ingredient.inventoryItemId },
      data: {
        quantity: { decrement: consumptionQty }
      }
    });

    // Check for low stock alert
    if (invItem.quantity < (invItem.lowStockThreshold || 0)) {
      await prisma.stockAlert.create({
        data: {
          vendorId: invItem.vendorId,
          inventoryItemId: invItem.id,
          message: `Low stock for ${invItem.name}: ${invItem.quantity.toFixed(2)} ${invItem.unit} left.`,
          severity: 'WARNING'
        }
      });
    }
  }

  revalidatePath("/vendor/inventory");
}

export async function getInventoryAlerts(vendorId: string) {
  return await prisma.stockAlert.findMany({
    where: { vendorId, isResolved: false },
    include: { inventoryItem: true },
    orderBy: { createdAt: 'desc' }
  });
}

export async function resolveAlert(alertId: string) {
  await prisma.stockAlert.update({
    where: { id: alertId },
    data: { isResolved: true }
  });
  revalidatePath("/vendor/inventory");
}

export async function getStockImpactPreview(productionItemId: string, quantity: number) {
    const item = await prisma.productionItem.findUnique({
    where: { id: productionItemId },
    include: {
      tiffinItem: {
        include: { recipe: { include: { ingredients: { include: { inventoryItem: true } } } } }
      },
      menuItem: {
        include: { recipe: { include: { ingredients: { include: { inventoryItem: true } } } } }
      }
    }
  });

  if (!item) return null;

  const recipe = item.tiffinItem?.recipe || item.menuItem?.recipe;
  if (!recipe) return null;

  const multiplier = quantity / recipe.servings;

  return recipe.ingredients.map(ing => ({
    name: ing.inventoryItem.name,
    required: ing.quantity * multiplier,
    available: ing.inventoryItem.quantity,
    unit: ing.unit,
    isShortage: (ing.inventoryItem.quantity < (ing.quantity * multiplier))
  }));
}
