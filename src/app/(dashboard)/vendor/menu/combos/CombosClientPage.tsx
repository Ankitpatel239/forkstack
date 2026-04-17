
'use client';

import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  MoreVertical,
  Package,
  Layers,
  ArrowRight,
  Zap,
  Flame,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { deleteCombo } from '@/app/actions/menu';
import { toast } from 'sonner';

export default function CombosClientPage({ initialCombos }: { initialCombos: any[] }) {
  const [combos, setCombos] = useState(initialCombos);
  const [search, setSearch] = useState('');

  const filteredCombos = combos.filter((c: any) => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Decommission this bundle?')) return;
    try {
      await deleteCombo(id);
      setCombos(combos.filter((c: any) => c.id !== id));
      toast.success('Bundle decommissioned');
    } catch (e) {
      toast.error('Failed');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter text-emerald-500">Combo Synthesis</h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1">Bundle high-velocity items for maximum yield.</p>
        </div>
        <Button className="bg-white hover:bg-zinc-200 text-zinc-950 font-black uppercase tracking-widest text-[10px] h-11 px-6 rounded-xl shadow-lg border-none active:scale-95 transition-all">
          <Plus size={16} className="mr-2" /> Forge New Combo
        </Button>
      </div>

      <div className="flex items-center gap-3 bg-zinc-950 px-4 h-12 w-full md:w-[400px] rounded-2xl border border-zinc-900 group focus-within:border-emerald-500/30 transition-all">
        <Search size={16} className="text-zinc-600 group-focus-within:text-emerald-500 transition-colors" />
        <input 
          type="text" 
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Scan bundles..." 
          className="bg-transparent border-none focus:ring-0 text-xs font-bold flex-1 outline-none text-white tracking-tight" 
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredCombos.length === 0 ? (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-zinc-900 rounded-[3rem] opacity-20">
            <Layers size={64} className="mx-auto mb-6" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">No synthesized bundles detected.</p>
          </div>
        ) : (
          filteredCombos.map((combo: any) => (
            <div key={combo.id} className="bg-zinc-900/40 border border-zinc-800/80 p-8 rounded-[2.5rem] group hover:border-emerald-500/20 transition-all relative overflow-hidden shadow-2xl">
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-4">
                   <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                         <Flame size={20} />
                      </div>
                      <div>
                         <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">{combo.name}</h3>
                         <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Active Synthesis Node</p>
                      </div>
                   </div>
                   <p className="text-xs text-zinc-400 font-medium max-w-[300px]">{combo.description || 'Synergistic bundle for premium users.'}</p>
                </div>
                
                <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                      <button className="h-8 w-8 flex items-center justify-center hover:bg-zinc-800 rounded-lg text-zinc-600 transition-all">
                         <MoreVertical size={16} />
                      </button>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent align="end" className="bg-zinc-950 border-zinc-900 text-white w-40 rounded-xl p-1 shadow-2xl">
                      <DropdownMenuItem className="cursor-pointer text-[10px] font-bold py-2 px-3 rounded-lg focus:bg-emerald-500 focus:text-zinc-950">
                         <Edit size={14} className="mr-2" /> Re-Forge
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(combo.id)} className="cursor-pointer text-red-500 text-[10px] font-bold py-2 px-3 rounded-lg focus:bg-red-500/10">
                         <Trash2 size={14} className="mr-2" /> Decommission
                      </DropdownMenuItem>
                   </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-8 space-y-6 relative z-10">
                 <div className="space-y-2">
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600 px-1">Bundle Ingredients</p>
                    <div className="space-y-1">
                       {combo.items.map((it: any) => (
                          <div key={it.id} className="flex items-center justify-between text-[11px] font-bold text-zinc-300 p-2 bg-zinc-950/40 rounded-lg border border-zinc-900/50">
                             <div className="flex items-center gap-2">
                                <span className="h-5 w-5 rounded bg-zinc-900 flex items-center justify-center text-[8px] text-zinc-500">{it.quantity}x</span>
                                <span className="tracking-tight uppercase">{it.menuItem?.name || 'Unknown Item'}</span>
                             </div>
                             <span className="text-[9px] text-zinc-700">₹{it.menuItem?.price || 0}</span>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black uppercase text-zinc-600 tracking-widest line-through decoration-red-500/50 decoration-2">₹{combo.totalPrice + (combo.discount || 0)}</span>
                       <span className="text-2xl font-black italic text-white tracking-tighter">₹{combo.totalPrice}</span>
                    </div>
                    <div className="h-14 w-14 rounded-full border-2 border-emerald-500/20 flex flex-col items-center justify-center bg-emerald-500/5 text-emerald-500 group-hover:scale-110 transition-transform">
                       <span className="text-[8px] font-black uppercase leading-none">Save</span>
                       <span className="text-xs font-black tracking-tighter italic">₹{combo.discount || 0}</span>
                    </div>
                 </div>
              </div>

              {/* Background Art */}
              <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                 <Package size={120} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
