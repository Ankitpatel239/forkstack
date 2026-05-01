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

    const orders = await prisma.order.findMany({
      where: { vendorId },
      orderBy: { orderDate: 'desc' },
      include: {
        items: {
          include: {
            menuItem: true,
            inventoryItem: true
          }
        },
        payment: true,
        table: true
      },
      take: 50 // Limit to last 50 orders
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Mobile Orders API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
