
import { prisma } from '@/lib/db';
import { requireVendor } from '@/lib/vendor';
import InventoryClientPage from './InventoryClientPage';

import { redirect } from 'next/navigation';
import { getVendorFeatures } from '@/app/actions/vendor-subscription';

export default async function InventoryPage() {
  const vendor = await requireVendor();
  const features = await getVendorFeatures();

  if (!features?.success || !features?.data?.features?.includes('INVENTORY_SYNC')) {
    redirect('/vendor/subscription?error=feature_restriction');
  }
  
  const items = await prisma.inventoryItem.findMany({
    where: { 
      vendorId: vendor.id,
      isArchived: false 
    },
    include: { batches: true },
    orderBy: { updatedAt: 'desc' }
  });

  return <InventoryClientPage initialItems={items} vendorId={vendor.id} />;
}
