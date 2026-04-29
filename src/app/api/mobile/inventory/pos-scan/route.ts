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

    const body = await req.json();
    const { barcode } = body;

    if (!barcode) {
      return NextResponse.json({ error: 'Barcode is required' }, { status: 400 });
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

    console.log(`POS Scan emitted: "${barcode}" for vendor: ${vendorId}`);

    // Emit via global.io if available
    const io = (global as any).io;
    if (io) {
      io.to(`vendor-${vendorId}`).emit('pos-scan', { barcode });
    } else {
      console.warn('Socket.io not found on global');
    }

    return NextResponse.json({ success: true, barcode });
  } catch (error) {
    console.error('POS Scan API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
