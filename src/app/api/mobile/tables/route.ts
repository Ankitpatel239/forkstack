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

    const tables = await prisma.table.findMany({
      where: { vendorId, isActive: true },
      orderBy: { tableNumber: 'asc' }
    });

    return NextResponse.json({ tables });
  } catch (error) {
    console.error('Mobile Tables API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
