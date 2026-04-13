
import { prisma } from '@/lib/db';
import { requireVendor } from '@/lib/vendor';
import { 
  ChefHat, 
  ArrowUpDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MenuActions from './MenuActions';
import { MenuItemRow } from './MenuItemRow';

export default async function MenuItemsPage() {
  const vendor = await requireVendor();
  
  const items = await prisma.menuItem.findMany({
    where: { vendorId: vendor.id },
    include: {
      category: true,
      media: true
    },
    orderBy: { createdAt: 'desc' }
  });

  const categories = await prisma.menuCategory.findMany({
    where: { vendorId: vendor.id }
  });

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 italic uppercase">Your Menu</h1>
          <p className="text-zinc-500 font-medium">Manage your items, prices, and categories in one place.</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" className="h-10 border-zinc-800 text-zinc-400 font-black uppercase tracking-widest text-[10px] px-6 bg-zinc-950 hover:bg-zinc-900 rounded-xl" asChild>
             <a href="/vendor/menu/categories">Edit Categories</a>
           </Button>
           <Badge variant="outline" className="h-10 border-zinc-800 text-zinc-400 font-black uppercase tracking-widest text-[9px] px-4 bg-zinc-900">
             {items.length} TOTAL ITEMS
           </Badge>
        </div>
      </div>

      <MenuActions categories={categories} />

      {/* Items Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-950/50 text-[10px] uppercase font-black tracking-[0.2em] text-zinc-600 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-5">Menu Item</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5">
                   <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors uppercase">
                     Value (₹) <ArrowUpDown size={12} />
                   </div>
                </th>
                <th className="px-6 py-5">Availability Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center">
                     <div className="flex flex-col items-center gap-6 text-zinc-700">
                        <div className="h-16 w-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center animate-pulse">
                          <ChefHat size={32} className="opacity-20" />
                        </div>
                        <div className="space-y-2">
                          <p className="font-black uppercase tracking-widest text-zinc-400 italic">No Items Found</p>
                          <p className="text-[10px] font-bold uppercase tracking-tighter">Add your first menu item to get started.</p>
                        </div>
                     </div>
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <MenuItemRow key={item.id} item={item} categories={categories} />
                ))
              )}
            </tbody>
          </table>
          
          {items.length > 0 && (
            <div className="px-6 py-5 border-t border-zinc-800 flex items-center justify-between text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em] bg-zinc-950/20 italic">
               <div>Total Items: {items.length}</div>
               <div className="flex items-center gap-2 font-sans font-bold not-italic">
                  <Button variant="outline" size="sm" disabled className="rounded-lg h-8 border-zinc-800 text-[10px]">Previous</Button>
                  <Button variant="outline" size="sm" disabled className="rounded-lg h-8 border-zinc-800 text-[10px]">Next</Button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
