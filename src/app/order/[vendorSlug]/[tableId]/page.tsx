
import { prisma } from '@/lib/db';
import { getVendorBySlug } from '@/lib/vendor';
import { notFound } from 'next/navigation';
import { OrderClient } from './OrderClient';

export default async function PublicOrderingPage({
  params
}: {
  params: Promise<{ vendorSlug: string; tableId: string }>
}) {
  const { vendorSlug, tableId } = await params;

  // 1. Fetch Vendor
  const vendor = await getVendorBySlug(vendorSlug);
  if (!vendor) notFound();

  // 2. Fetch Table
  const table = await prisma.table.findUnique({
    where: { id: tableId, vendorId: vendor.id }
  });
  if (!table) notFound();

  // 3. Fetch Menu
  const categories = await prisma.menuCategory.findMany({
    where: { vendorId: vendor.id },
    include: {
      items: {
        where: { isAvailable: true },
        include: { media: true }
      }
    },
    orderBy: { sortOrder: 'asc' }
  });

  // 4. Fetch Combos
  const combos = await prisma.combo.findMany({
    where: { vendorId: vendor.id },
    include: {
      items: {
        include: {
          menuItem: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-black">
      <OrderClient 
        vendor={vendor as any} 
        table={table as any} 
        categories={categories as any} 
        combos={combos as any}
      />
    </div>
  );
}
