import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyMobileAuth } from '@/lib/mobile-auth';

export async function PATCH(req: Request, { params }: { params: Promise<{ menuItemId: string }> }) {
  try {
    const auth = await verifyMobileAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const vendorId = auth.vendor!.id;
    const { menuItemId } = await params;

    const body = await req.json();
    const { name, description, price, categoryId, isVegetarian, isAvailable } = body;

    // Check if item exists and belongs to vendor
    const existing = await prisma.menuItem.findFirst({
      where: { id: menuItemId, vendorId }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (isVegetarian !== undefined) updateData.isVegetarian = isVegetarian;
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable;

    const updatedItem = await prisma.menuItem.update({
      where: { id: menuItemId },
      data: updateData
    });

    return NextResponse.json({ success: true, menuItem: updatedItem });
  } catch (error) {
    console.error('Mobile Menu PATCH API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
