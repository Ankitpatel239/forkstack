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

    const categories = await prisma.menuCategory.findMany({
      where: { vendorId },
      orderBy: { sortOrder: 'asc' }
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Mobile Menu Categories API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
