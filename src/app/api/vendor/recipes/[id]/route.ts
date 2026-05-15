import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentVendor } from '@/lib/vendor';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vendor = await getCurrentVendor();
  if (!vendor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const recipe = await prisma.recipe.findFirst({
      where: { id, vendorId: vendor.id },
      include: {
        ingredients: {
          include: {
            inventoryItem: true
          }
        },
        menuItem: true,
        tiffinItem: true
      }
    });

    if (!recipe) return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });

    return NextResponse.json(recipe);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vendor = await getCurrentVendor();
  if (!vendor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await req.json();
    const { name, description, instructions, servings, menuItemId, tiffinItemId, ingredients } = data;

    // Transaction to update recipe and ingredients
    const updatedRecipe = await prisma.$transaction(async (tx) => {
      // Delete old ingredients
      await tx.recipeIngredient.deleteMany({
        where: { recipeId: id }
      });

      // Update recipe
      return await tx.recipe.update({
        where: { id, vendorId: vendor.id },
        data: {
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
    });

    return NextResponse.json(updatedRecipe);
  } catch (error: any) {
    console.error('Error updating recipe:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vendor = await getCurrentVendor();
  if (!vendor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await prisma.recipe.delete({
      where: { id, vendorId: vendor.id }
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
