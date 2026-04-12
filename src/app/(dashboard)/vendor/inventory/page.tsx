import { prisma } from '@/lib/db';
import { requireVendor } from '@/lib/vendor';
import { 
  Plus, 
  Search, 
  AlertTriangle, 
  Package, 
  BarChart3, 
  ArrowUpRight, 
  MoreVertical,
  Edit,
  History,
  Trash2
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

export default async function InventoryPage() {
  const vendor = await requireVendor();
  
  const items = await prisma.inventoryItem.findMany({
    where: { vendorId: vendor.id },
    orderBy: { updatedAt: 'desc' }
  });

  const lowStockItems = items.filter(i => i.quantity <= i.lowStockThreshold);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Inventory Ledger</h1>
          <p className="text-zinc-500 font-medium">Global stock tracking and automated supply management.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-xs h-11 px-6 shadow-lg shadow-emerald-500/20 transition-all">
             <Plus className="w-5 h-5 mr-1" /> Register Stock
           </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
         <div className="bg-zinc-900 shadow-xl border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <Package size={80} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Total Unit Value</p>
            <div className="flex items-end gap-3">
               <h3 className="text-3xl font-black text-white">${items.reduce((acc, i) => acc + (i.price * i.quantity), 0).toLocaleString()}</h3>
               <span className="text-emerald-500 text-[10px] font-bold uppercase mb-1 flex items-center gap-1">
                 <ArrowUpRight size={12} /> 4.2%
               </span>
            </div>
         </div>

         <div className="bg-zinc-900 shadow-xl border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <AlertTriangle size={80} className="text-red-500" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Low Stock Alerts</p>
            <div className="flex items-end gap-3">
               <h3 className={`text-3xl font-black ${lowStockItems.length > 0 ? 'text-red-500' : 'text-zinc-300'}`}>{lowStockItems.length}</h3>
               <span className="text-zinc-500 text-[10px] font-bold uppercase mb-1">Items at risk</span>
            </div>
         </div>

         <div className="bg-zinc-900 shadow-xl border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <BarChart3 size={80} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Inventory Health</p>
            <div className="flex items-end gap-3">
               <h3 className="text-3xl font-black text-emerald-500 italic">Optimal</h3>
               <span className="text-zinc-500 text-[10px] font-bold uppercase mb-1">94% turnover</span>
            </div>
         </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 h-12 w-full md:w-96 text-zinc-500 focus-within:border-emerald-500/50 transition-colors">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search SKU or name..." 
            className="bg-transparent border-none focus:ring-0 text-sm flex-1 outline-none text-white" 
          />
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-950/50 text-[10px] uppercase font-black tracking-[0.2em] text-zinc-600 border-b border-zinc-900">
              <tr>
                <th className="px-6 py-5">Product Details</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5">Inventory Level</th>
                <th className="px-6 py-5">Total Valuation</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {items.length === 0 ? (
                <tr>
                   <td colSpan={5} className="py-32 text-center text-zinc-600">
                      <div className="flex flex-col items-center gap-4">
                        <Package size={48} className="opacity-10" />
                        <p className="font-bold text-zinc-400">Inventory base is empty</p>
                        <Button variant="link" className="text-emerald-500 text-xs font-black uppercase tracking-widest">Register First Stock Item</Button>
                      </div>
                   </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-800/20 transition-colors group">
                    <td className="px-6 py-6">
                       <div className="space-y-0.5">
                          <p className="font-extrabold text-white text-base tracking-tight">{item.name}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{item.sku}</p>
                       </div>
                    </td>
                    <td className="px-6 py-6 font-bold text-zinc-400 uppercase tracking-tighter">{item.category}</td>
                    <td className="px-6 py-6">
                       <div className="space-y-2">
                          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                             <span className={item.quantity <= item.lowStockThreshold ? 'text-red-500' : 'text-zinc-500'}>
                                {item.quantity} units {item.quantity <= item.lowStockThreshold && '• CRITICAL'}
                             </span>
                             <span className="text-zinc-600 italic">Target: {item.lowStockThreshold * 5}</span>
                          </div>
                          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                             <div 
                               className={`h-full transition-all ${item.quantity <= item.lowStockThreshold ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-emerald-500'}`} 
                               style={{ width: `${Math.min(100, (item.quantity / (item.lowStockThreshold * 5)) * 100)}%` }} 
                             />
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-6 font-black text-white text-base tracking-tighter">
                       ${(item.price * item.quantity).toLocaleString()}
                    </td>
                    <td className="px-6 py-6 text-right">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                             <button className="p-2.5 hover:bg-zinc-800 rounded-xl text-zinc-600 hover:text-white transition-all">
                                <MoreVertical size={18} />
                             </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white w-48 p-2">
                             <DropdownMenuLabel className="text-[10px] font-black uppercase text-zinc-600 px-2 py-1.5">Stock Management</DropdownMenuLabel>
                             <DropdownMenuItem className="focus:bg-zinc-800 cursor-pointer text-xs font-bold py-2 px-2 rounded-lg">
                                <Edit className="w-4 h-4 mr-2" /> Adjust Quantity
                             </DropdownMenuItem>
                             <DropdownMenuItem className="focus:bg-zinc-800 cursor-pointer text-xs font-bold py-2 px-2 rounded-lg">
                                <History className="w-4 h-4 mr-2" /> View History
                             </DropdownMenuItem>
                             <DropdownMenuSeparator className="bg-zinc-800 my-1" />
                             <DropdownMenuItem className="focus:bg-red-500/10 cursor-pointer text-red-500 text-xs font-bold py-2 px-2 rounded-lg">
                                <Trash2 className="w-4 h-4 mr-2" /> Decommission
                             </DropdownMenuItem>
                          </DropdownMenuContent>
                       </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
