
import { NextResponse } from 'next/server';
import { requireVendor } from '@/lib/vendor';

import { getVendorFeatures } from '@/app/actions/vendor-subscription';

export async function GET() {
  try {
    const result = await getVendorFeatures();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
}
