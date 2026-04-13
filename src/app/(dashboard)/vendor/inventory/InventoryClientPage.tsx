
'use client';

import { useState } from 'react';
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
  Trash2,
  ChevronRight
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
import { InventoryDialog } from './InventoryDialog';
import { deleteInventoryItem } from '@/app/actions/inventory';
import { toast } from 'sonner';

interface InventoryItem {
  id: string;
  name: string;
  sku: string | null;
  category: string | null;
  quantity: number;
  unit: string;
  lowStockThreshold: number;
  price: number;
  updatedAt: string;
}

export default function InventoryClientPage({ initialItems }: { initialItems: any[] }) {
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const filteredItems = initialItems.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.sku?.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockItems = initialItems.filter(i => i.quantity <= i.lowStockThreshold);
  const totalValuation = initialItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to decommission this stock node?')) return;
    try {
      await deleteInventoryItem(id);
      toast.success('Asset removed from ledger');
    } catch (error) {
      toast.error('Deletion failed');
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 italic uppercase">Operational Ledger</h1>
          <p className="text-zinc-500 font-medium">Critical stock synchronization and automated resource management.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button 
             onClick={() => { setSelectedItem(null); setIsDialogOpen(true); }}
             className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-xs h-11 px-6 shadow-lg shadow-emerald-500/20 transition-all"
           >
             <Plus className="w-5 h-5 mr-1" /> Register Asset
           </Button>
        </div>
      </div>

      {/* Global Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
         <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <Package size={100} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-4">Total Unit Valuation</p>
            <div className="flex items-end gap-3">
               <h3 className="text-4xl font-black text-white italic tracking-tighter">₹{totalValuation.toLocaleString()}</h3>
               <span className="text-emerald-500 text-xs font-black uppercase mb-1.5 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                 <ArrowUpRight size={14} /> 4.2%
               </span>
            </div>
         </div>

         <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <AlertTriangle size={100} className="text-red-500" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-4 text-red-500/50">Critical Sync Status</p>
            <div className="flex items-end gap-3">
               <h3 className={`text-4xl font-black italic tracking-tighter ${lowStockItems.length > 0 ? 'text-red-500' : 'text-zinc-400'}`}>
                 {lowStockItems.length}
               </h3>
               <span className="text-zinc-600 text-xs font-black uppercase mb-1.5">Nodes at Risk</span>
            </div>
         </div>

         <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <BarChart3 size={100} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-4">Network Efficiency</p>
            <div className="flex items-end gap-3">
               <h3 className="text-4xl font-black text-emerald-500 italic tracking-tighter uppercase">Optimal</h3>
               <span className="text-zinc-600 text-xs font-black uppercase mb-1.5 underline decoration-emerald-500 underline-offset-4 font-sans">94.8% Turnover</span>
            </div>
         </div>
      </div>

      {/* Control Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-2xl px-4 h-14 w-full md:w-[450px] text-zinc-500 focus-within:border-emerald-500/50 transition-all shadow-inner">
          <Search size={20} className="text-zinc-700" />
          <input 
            type="text" 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Query Registry by Name or SKU..." 
            className="bg-transparent border-none focus:ring-0 text-sm font-bold flex-1 outline-none text-white tracking-tight" 
          />
        </div>
      </div>

      {/* Primary Registry */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-950/80 text-[10px] uppercase font-black tracking-[0.3em] text-zinc-600 border-b border-zinc-800">
              <tr>
                <th className="px-8 py-6 italic">Stock Node ID</th>
                <th className="px-8 py-6">Classification</th>
                <th className="px-8 py-6">Level / Status</th>
                <th className="px-8 py-6">Net Valuation</th>
                <th className="px-8 py-6 text-right">Modules</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredItems.length === 0 ? (
                <tr>
                   <td colSpan={5} className="py-40 text-center">
                      <div className="flex flex-col items-center gap-6">
                        <div className="h-20 w-20 rounded-3xl bg-zinc-800/40 flex items-center justify-center border border-zinc-800 border-dashed animate-pulse">
                          <Package size={36} className="text-zinc-700" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-black uppercase tracking-[0.2em] text-zinc-500 italic">No Registry Entries Found</p>
                          <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-tighter">Initialize stock nodes to begin synchronization.</p>
                        </div>
                      </div>
                   </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-800/30 transition-all group">
                    <td className="px-8 py-7">
                       <div className="space-y-1">
                          <p className="font-black text-white text-lg tracking-tighter group-hover:text-emerald-400 transition-colors">{item.name}</p>
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 font-sans">{item.sku || 'UNSPECIFIED'}</span>
                             <ChevronRight size={10} className="text-zinc-800" />
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-7 font-black text-zinc-500 uppercase tracking-widest text-[10px]">
                      <Badge variant="outline" className="border-zinc-800 bg-zinc-950/40 px-3 py-1 text-zinc-400 font-bold uppercase tracking-widest text-[9px] rounded-lg">
                        {item.category}
                      </Badge>
                    </td>
                    <td className="px-8 py-7">
                       <div className="space-y-3 w-[240px]">
                          <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                             <span className={item.quantity <= item.lowStockThreshold ? 'text-red-500 animate-pulse' : 'text-zinc-400'}>
                                {item.quantity} {item.unit} {item.quantity <= item.lowStockThreshold && '• CRITICAL'}
                             </span>
                          </div>
                          <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/50">
                             <div 
                               className={`h-full transition-all duration-1000 ${
                                 item.quantity <= item.lowStockThreshold 
                                 ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.7)]' 
                                 : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                               }`} 
                               style={{ width: `${Math.min(100, (item.quantity / (item.lowStockThreshold * 5)) * 100)}%` }} 
                             />
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-7">
                       <div className="space-y-0.5">
                         <p className="font-black text-white text-xl italic tracking-tighter">₹{(item.price * item.quantity).toLocaleString()}</p>
                         <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">Rate: ₹{item.price}/{item.unit}</p>
                       </div>
                    </td>
                    <td className="px-8 py-7 text-right">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                             <button className="p-3 hover:bg-zinc-800 rounded-2xl text-zinc-700 hover:text-white transition-all border border-transparent hover:border-zinc-700 shadow-md">
                                <MoreVertical size={20} />
                             </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white w-56 p-2 rounded-2xl shadow-2xl">
                             <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-3 py-2 italic border-b border-zinc-800/50">Node Operations</DropdownMenuLabel>
                             <DropdownMenuItem onClick={() => handleEdit(item)} className="focus:bg-emerald-500/10 focus:text-emerald-400 cursor-pointer text-[11px] font-black uppercase tracking-widest py-3 px-3 rounded-xl transition-colors mt-1">
                                <Edit className="w-4 h-4 mr-3" /> Adjust Quantities
                             </DropdownMenuItem>
                             <DropdownMenuItem className="focus:bg-zinc-800 cursor-pointer text-[11px] font-black uppercase tracking-widest py-3 px-3 rounded-xl transition-colors">
                                <History className="w-4 h-4 mr-3" /> Audit History
                             </DropdownMenuItem>
                             <DropdownMenuSeparator className="bg-zinc-800 my-1 mx-2" />
                             <DropdownMenuItem onClick={() => handleDelete(item.id)} className="focus:bg-red-500/10 cursor-pointer text-red-500 text-[11px] font-black uppercase tracking-widest py-3 px-3 rounded-xl transition-colors">
                                <Trash2 className="w-4 h-4 mr-3" /> Decommission Node
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

      <InventoryDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        item={selectedItem}
      />
    </div>
  );
}
