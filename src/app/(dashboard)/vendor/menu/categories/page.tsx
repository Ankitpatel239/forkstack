
import { prisma } from '@/lib/db';
import { requireVendor } from '@/lib/vendor';
import CategoryClientPage from './CategoryClientPage';

export default async function CategoriesPage() {
  const vendor = await requireVendor();
  
  const categories = await prisma.menuCategory.findMany({
    where: { vendorId: vendor.id },
    orderBy: { sortOrder: 'asc' }
  });

  return (
    <div className="p-8 space-y-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Menu Categories</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mt-1">Organize your menu by creating categories and sub-categories.</p>
        </div>
      </div>

      <CategoryClientPage initialCategories={categories} />
    </div>
  );
}
