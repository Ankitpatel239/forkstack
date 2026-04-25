import { prisma } from '@/lib/db';
import { MenuClient } from './MenuClient';

export default async function VendorPublicMenu({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ vendorSlug: string }>,
  searchParams: Promise<{ table?: string }>
}) {
  const { vendorSlug } = await params;
  const { table } = await searchParams;
  
  const vendor = await prisma.vendorProfile.findUnique({
    where: { tenantSlug: vendorSlug },
    include: { 
      menuItems: {
        where: { isAvailable: true },
        include: { category: true, media: true }
      },
      combos: {
        where: { isActive: true },
        include: { items: { include: { menuItem: true } } }
      },
      offers: {
        where: { isActive: true, endDate: { gte: new Date() } },
        include: { items: { include: { menuItem: true } } }
      },
      menuCategories: {
        orderBy: { sortOrder: 'asc' }
      }
    }
  });

  if (!vendor) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
         <h1 className="text-zinc-700 font-black uppercase tracking-[0.5em]">Node Not Found</h1>
      </div>
    );
  }

  return (
    <MenuClient vendor={vendor} tableId={table} />
  );
}
