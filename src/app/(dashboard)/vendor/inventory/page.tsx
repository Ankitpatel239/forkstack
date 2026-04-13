
import { prisma } from '@/lib/db';
import { requireVendor } from '@/lib/vendor';
import InventoryClientPage from './InventoryClientPage';

export default async function InventoryPage() {
  const vendor = await requireVendor();
  
  const items = await prisma.inventoryItem.findMany({
    where: { vendorId: vendor.id },
    orderBy: { updatedAt: 'desc' }
  });

  return <InventoryClientPage initialItems={items} />;
}
