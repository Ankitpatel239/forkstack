import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyMobileAuth } from '@/lib/mobile-auth';

export async function GET(req: Request) {
  try {
    const auth = await verifyMobileAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const vendorId = auth.vendor!.id;

    const menuItems = await prisma.menuItem.findMany({
      where: { vendorId },
      orderBy: { name: 'asc' }
    });

    // Optionally fetch combos if needed later, but for now we'll stick to menuItems.
    
    return NextResponse.json({ menuItems });
  } catch (error) {
    console.error('Mobile Menu API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await verifyMobileAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const vendorId = auth.vendor!.id;

    const body = await req.json();
    const { name, description, price, categoryId, isVegetarian } = body;

    if (!name || price === undefined) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        vendorId,
        name,
        description,
        price: parseFloat(price),
        categoryId: categoryId || null,
        isVegetarian: isVegetarian || false,
        isAvailable: true
      }
    });

    return NextResponse.json({ success: true, menuItem });
  } catch (error) {
    console.error('Mobile Menu POST API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
