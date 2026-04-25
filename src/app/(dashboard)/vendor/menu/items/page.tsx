
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
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2 italic uppercase">Your Menu</h1>
          <p className="text-muted-foreground font-medium">Manage your items, prices, and categories in one place.</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" className="h-10 border-border text-muted-foreground font-black uppercase tracking-widest text-[10px] px-6 bg-muted hover:bg-muted-foreground/10 rounded-xl" asChild>
             <a href="/vendor/menu/categories">Categories</a>
           </Button>
           <Button variant="outline" className="h-10 border-border text-emerald-500 font-black uppercase tracking-widest text-[10px] px-6 bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/20 rounded-xl" asChild>
             <a href="/vendor/menu/combos">Combos</a>
           </Button>
           <Button variant="outline" className="h-10 border-border text-amber-500 font-black uppercase tracking-widest text-[10px] px-6 bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/20 rounded-xl" asChild>
             <a href="/vendor/menu/offers">Offers</a>
           </Button>
           <Badge variant="outline" className="h-10 border-border text-muted-foreground font-black uppercase tracking-widest text-[9px] px-4 bg-muted">
             {items.length} TOTAL ITEMS
           </Badge>
        </div>
      </div>

      <MenuActions categories={categories} />

      {/* Items Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-5">Menu Item</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5">
                   <div className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors uppercase">
                     Value (₹) <ArrowUpDown size={12} />
                   </div>
                </th>
                <th className="px-6 py-5">Availability Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
             <tbody className="divide-y divide-border">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center">
                     <div className="flex flex-col items-center gap-6 text-muted-foreground/30">
                        <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center animate-pulse">
                          <ChefHat size={32} className="opacity-20" />
                        </div>
                        <div className="space-y-2">
                          <p className="font-black uppercase tracking-widest text-muted-foreground italic">No Items Found</p>
                          <p className="text-[10px] font-bold uppercase tracking-tighter">Add your first menu item to get started.</p>
                        </div>
                     </div>
                  </td>
                </tr>
              ) : (
                items.map((item: any) => (
                  <MenuItemRow key={item.id} item={item} categories={categories} />
                ))
              )}
            </tbody>
          </table>
          
          {items.length > 0 && (
            <div className="px-6 py-5 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] bg-muted/20 italic">
               <div>Total Items: {items.length}</div>
               <div className="flex items-center gap-2 font-sans font-bold not-italic">
                  <Button variant="outline" size="sm" disabled className="rounded-lg h-8 border-border text-[10px]">Previous</Button>
                  <Button variant="outline" size="sm" disabled className="rounded-lg h-8 border-border text-[10px]">Next</Button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
