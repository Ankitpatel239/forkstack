import { prisma } from '@/lib/db';
import { requireVendor } from '@/lib/vendor';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  ChefHat, 
  Image as ImageIcon,
  ArrowUpDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import MenuActions from './MenuActions';

export default async function MenuItemsPage() {
  const vendor = await requireVendor();
  
  const items = await prisma.menuItem.findMany({
    where: { vendorId: vendor.id },
    orderBy: { category: 'asc' }
  });

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Menu Collection</h1>
          <p className="text-zinc-500 font-medium">Manage your digital menu items and availability.</p>
        </div>
        <div className="flex items-center gap-2">
           <Badge variant="outline" className="h-6 border-zinc-800 text-zinc-500 font-black uppercase tracking-widest text-[9px]">
             {items.length} TOTAL ITEMS
           </Badge>
        </div>
      </div>

      <MenuActions />

      {/* Items Table */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-950/50 text-[10px] uppercase font-black tracking-[0.2em] text-zinc-600 border-b border-zinc-900">
              <tr>
                <th className="px-6 py-5">Item</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5">
                   <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
                     Price <ArrowUpDown size={12} />
                   </div>
                </th>
                <th className="px-6 py-5">Stock Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                     <div className="flex flex-col items-center gap-4 text-zinc-600">
                        <ChefHat size={48} className="opacity-20" />
                        <div className="space-y-1">
                          <p className="font-bold text-zinc-400">Your kitchen is empty</p>
                          <p className="text-xs">Start by adding your first signature dish.</p>
                        </div>
                     </div>
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-800/20 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden shrink-0">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon size={20} className="text-zinc-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate mb-0.5">{item.name}</p>
                          <p className="text-[10px] text-zinc-500 truncate font-medium max-w-[200px]">{item.description || 'No description provided'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant="outline" className="border-zinc-800 text-zinc-400 font-bold uppercase text-[9px]">
                        {item.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-black text-white">${item.price.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-2">
                         <div className={`h-2 w-2 rounded-full ${item.isAvailable ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`} />
                         <span className={`text-[11px] font-bold uppercase tracking-tight ${item.isAvailable ? 'text-emerald-500' : 'text-red-500'}`}>
                           {item.isAvailable ? 'Live' : 'Sold Out'}
                         </span>
                       </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                             <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-all">
                                <MoreHorizontal size={18} />
                             </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white w-40">
                             <DropdownMenuLabel className="text-[10px] font-black uppercase text-zinc-600">Management</DropdownMenuLabel>
                             <DropdownMenuSeparator className="bg-zinc-800" />
                             <DropdownMenuItem className="focus:bg-zinc-800 cursor-pointer text-xs font-bold">
                               <Edit className="w-4 h-4 mr-2" /> Edit Item
                             </DropdownMenuItem>
                             <DropdownMenuItem className="focus:bg-zinc-800 cursor-pointer text-xs font-bold">
                               {item.isAvailable ? <X className="w-4 h-4 mr-2 text-red-400" /> : <Check className="w-4 h-4 mr-2 text-emerald-400" />}
                               {item.isAvailable ? 'Mark Sold Out' : 'Mark Available'}
                             </DropdownMenuItem>
                             <DropdownMenuSeparator className="bg-zinc-800" />
                             <DropdownMenuItem className="focus:bg-red-500/10 cursor-pointer text-red-500 text-xs font-bold">
                               <Trash2 className="w-4 h-4 mr-2" /> Delete Item
                             </DropdownMenuItem>
                          </DropdownMenuContent>
                       </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          {items.length > 0 && (
            <div className="px-6 py-5 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-500 font-bold uppercase tracking-widest bg-zinc-950/20">
               <div>Showing {items.length} results</div>
               <div className="flex items-center gap-2">
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
