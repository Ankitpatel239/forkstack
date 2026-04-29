import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback_secret_key_123';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    if (!decoded || !decoded.id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const vendor = await prisma.vendorProfile.findFirst({
      where: {
        OR: [
          { ownerId: decoded.id },
          { staffAssignments: { some: { userId: decoded.id } } }
        ]
      }
    });

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor profile not found' }, { status: 403 });
    }

    const body = await req.json();
    const { 
      name, sku, barcode, category, quantity, 
      unit, price, costPrice, location, brand 
    } = body;

    if (!name || !sku) {
      return NextResponse.json({ error: 'Name and SKU are required' }, { status: 400 });
    }

    // Check if SKU already exists for this vendor
    const existing = await prisma.inventoryItem.findFirst({
      where: { 
        vendorId: vendor.id,
        OR: [
          { sku },
          barcode ? { barcode } : {}
        ]
      }
    });

    if (existing) {
      return NextResponse.json({ 
        error: `Item with this ${existing.sku === sku ? 'SKU' : 'Barcode'} already exists.` 
      }, { status: 400 });
    }

    const newItem = await prisma.inventoryItem.create({
      data: {
        vendorId: vendor.id,
        name,
        sku,
        barcode,
        category: category || 'Uncategorized',
        quantity: quantity || 0,
        unit: unit || 'units',
        price: price || 0,
        costPrice,
        location,
        brand,
      }
    });

    return NextResponse.json({ success: true, item: newItem });
  } catch (error) {
    console.error('Inventory Add API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
