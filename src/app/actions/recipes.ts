"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getRecipes(vendorId: string) {
  return await prisma.recipe.findMany({
    where: { vendorId },
    include: {
      ingredients: {
        include: {
          inventoryItem: true
        }
      },
      menuItem: true,
      tiffinItem: true
    },
    orderBy: { updatedAt: "desc" }
  });
}

export async function createRecipe(vendorId: string, data: any) {
  const { name, description, instructions, servings, menuItemId, tiffinItemId, ingredients } = data;

  const recipe = await prisma.recipe.create({
    data: {
      vendorId,
      name,
      description,
      instructions,
      servings: parseFloat(servings) || 1,
      menuItemId: menuItemId || null,
      tiffinItemId: tiffinItemId || null,
      ingredients: {
        create: ingredients.map((ing: any) => ({
          inventoryItemId: ing.inventoryItemId,
          quantity: parseFloat(ing.quantity),
          unit: ing.unit,
          wastagePercent: parseFloat(ing.wastagePercent) || 0,
          isOptional: ing.isOptional || false
        }))
      }
    }
  });

  revalidatePath("/vendor/tiffin/menu");
  return recipe;
}

export async function updateRecipe(id: string, data: any) {
  const { name, description, instructions, servings, menuItemId, tiffinItemId, ingredients } = data;

  const recipe = await prisma.$transaction(async (tx) => {
    // Delete old ingredients
    await tx.recipeIngredient.deleteMany({
      where: { recipeId: id }
    });

    // Update recipe
    return await tx.recipe.update({
      where: { id },
      data: {
        name,
        description,
        instructions,
        servings: parseFloat(servings) || 1,
        menuItemId: menuItemId || null,
        tiffinItemId: tiffinItemId || null,
        ingredients: {
          create: ingredients.map((ing: any) => ({
            inventoryItemId: ing.inventoryItemId,
            quantity: parseFloat(ing.quantity),
            unit: ing.unit,
            wastagePercent: parseFloat(ing.wastagePercent) || 0,
            isOptional: ing.isOptional || false
          }))
        }
      }
    });
  });

  revalidatePath("/vendor/tiffin/menu");
  return recipe;
}

export async function deleteRecipe(id: string) {
  await prisma.recipe.delete({ where: { id } });
  revalidatePath("/vendor/tiffin/menu");
}

export async function getInventoryItems(vendorId: string) {
  return await prisma.inventoryItem.findMany({
    where: { vendorId },
    orderBy: { name: "asc" }
  });
}

export async function getMenuItems(vendorId: string) {
  return await prisma.menuItem.findMany({
    where: { vendorId },
    orderBy: { name: "asc" }
  });
}
