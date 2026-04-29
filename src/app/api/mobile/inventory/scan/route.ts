import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback_secret_key_123';

export async function GET(req: Request) {
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

    const searchParams = new URL(req.url).searchParams;
    const barcodeRaw = searchParams.get('barcode');

    if (!barcodeRaw) {
      return NextResponse.json({ error: 'Barcode is required' }, { status: 400 });
    }

    const barcode = barcodeRaw.trim();

    const vendor = await prisma.vendorProfile.findFirst({
      where: {
        OR: [
          { ownerId: decoded.id },
          { staffAssignments: { some: { userId: decoded.id } } }
        ]
      }
    });

    const vendorId = vendor?.id;

    if (!vendorId) {
      return NextResponse.json({ error: 'Vendor profile not found' }, { status: 403 });
    }

    console.log(`Scanning barcode: "${barcode}" for vendor: ${vendorId}`);

    // Try case-insensitive first for both barcode and sku
    let item = await prisma.inventoryItem.findFirst({
      where: { 
        vendorId,
        OR: [
          { barcode: { equals: barcode, mode: 'insensitive' } },
          { sku: { equals: barcode, mode: 'insensitive' } }
        ]
      },
      include: { batches: true }
    });

    if (!item) {
      // Debug: Check if it exists at all for ANY vendor
      const anyItem = await prisma.inventoryItem.findFirst({
        where: {
          OR: [
            { barcode: { equals: barcode, mode: 'insensitive' } },
            { sku: { equals: barcode, mode: 'insensitive' } }
          ]
        }
      });
      console.log(`Debug: Item with barcode/sku ${barcode} exists for another vendor?`, !!anyItem);
      console.log(`Debug: AnyItem details:`, anyItem);

      return NextResponse.json({ error: 'Item not found in inventory' }, { status: 404 });
    }

    return NextResponse.json({ item });
  } catch (error) {
    console.error('Mobile Scan API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
