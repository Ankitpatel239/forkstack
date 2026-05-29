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

    const items = await prisma.inventoryItem.findMany({
      where: { 
        vendorId: vendorId,
        isArchived: false 
      },
      include: { batches: true },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error('Inventory GET API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
