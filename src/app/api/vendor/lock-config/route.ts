
import { NextResponse } from 'next/server';
import { requireVendor } from '@/lib/vendor';

export async function GET() {
  try {
    const vendor = await requireVendor();
    return NextResponse.json({ lockPassword: vendor.lockPassword });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
