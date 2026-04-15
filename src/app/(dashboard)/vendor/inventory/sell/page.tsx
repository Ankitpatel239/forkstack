
import { prisma } from '@/lib/db';
import { requireVendor } from '@/lib/vendor';
import SellClientPage from './SellClientPage';

export default async function SellPage() {
  const vendor = await requireVendor();
  
  const allItems = await prisma.inventoryItem.findMany({
    where: { 
      vendorId: vendor.id,
      isArchived: false
    },
    include: { batches: true },
    orderBy: { name: 'asc' }
  });

  return <SellClientPage initialItems={allItems} />;
}
