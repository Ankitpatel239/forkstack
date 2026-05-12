import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentVendor } from '@/lib/vendor';

export async function GET() {
  const vendor = await getCurrentVendor();
  if (!vendor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const recipes = await prisma.recipe.findMany({
      where: { vendorId: vendor.id },
      include: {
        ingredients: {
          include: {
            inventoryItem: true
          }
        },
        menuItem: true,
        tiffinItem: true
      },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json(recipes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const vendor = await getCurrentVendor();
  if (!vendor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await req.json();
    const { name, description, instructions, servings, menuItemId, tiffinItemId, ingredients } = data;

    // Validate if menuItem or tiffinItem already has a recipe
    if (menuItemId) {
      const existing = await prisma.recipe.findUnique({ where: { menuItemId } });
      if (existing) return NextResponse.json({ error: 'Menu item already has a recipe' }, { status: 400 });
    }
    if (tiffinItemId) {
      const existing = await prisma.recipe.findUnique({ where: { tiffinItemId } });
      if (existing) return NextResponse.json({ error: 'Tiffin item already has a recipe' }, { status: 400 });
    }

    const recipe = await prisma.recipe.create({
      data: {
        vendorId: vendor.id,
        name,
        description,
        instructions,
        servings: parseFloat(servings) || 1,
        menuItemId,
        tiffinItemId,
        ingredients: {
          create: ingredients.map((ing: any) => ({
            inventoryItemId: ing.inventoryItemId,
            quantity: parseFloat(ing.quantity),
            unit: ing.unit,
            wastagePercent: parseFloat(ing.wastagePercent) || 0,
            isOptional: ing.isOptional || false
          }))
        }
      },
      include: {
        ingredients: {
          include: {
            inventoryItem: true
          }
        }
      }
    });

    return NextResponse.json(recipe);
  } catch (error: any) {
    console.error('Error creating recipe:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
