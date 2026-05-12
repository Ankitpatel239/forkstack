
'use client';

import { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Store, 
  Package, 
  AlertTriangle, 
  ArrowUpRight, 
  MoreVertical,
  Edit,
  Trash2,
  Box,
  BadgeAlert,
  Loader2,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { adminDeleteInventoryItem, adminUpdateStock } from '@/app/actions/admin-inventory';

export function InventoryAdminClient({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingStock, setEditingStock] = useState<any>(null);
  const [newStockValue, setNewStockValue] = useState<number>(0);
  const [correctionReason, setCorrectionReason] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.vendor.businessName.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  const handleUpdateStock = async () => {
    if (!editingStock || isUpdating) return;
    setIsUpdating(true);
    try {
      await adminUpdateStock(editingStock.id, newStockValue, correctionReason);
      setItems(items.map(i => i.id === editingStock.id ? { ...i, quantity: newStockValue } : i));
      toast.success('Stock level globally updated');
      setEditingStock(null);
      setCorrectionReason('');
    } catch (e) {
      toast.error('Failed to update stock');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to purge this asset from the platform? This action is irreversible.')) return;
    setDeleting(id);
    try {
      await adminDeleteInventoryItem(id);
      setItems(items.filter(i => i.id !== id));
      toast.success('Asset purged from global registry');
    } catch (e) {
      toast.error('Failed to purge asset');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Search & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         <div className="lg:col-span-3">
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-emerald-500 transition-colors">
                <Search size={18} />
              </div>
              <Input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search globally by product name, SKU, or vendor brand..."
                className="h-14 pl-12 bg-zinc-900 border-zinc-800 rounded-2xl focus:ring-emerald-500/20 focus:border-emerald-500/50 text-white font-medium"
              />
            </div>
         </div>
         <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
            <div className="space-y-1">
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">Total Assets</p>
               <p className="text-2xl font-bold text-white tracking-tighter">{filteredItems.length}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
               <Box size={20} />
            </div>
         </div>
      </div>

      {/* Main Table */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-zinc-950/50 text-[10px] uppercase font-black tracking-[0.2em] text-zinc-600 border-b border-zinc-900">
            <tr>
              <th className="px-8 py-6">Product Information</th>
              <th className="px-8 py-6">Vendor Affinity</th>
              <th className="px-8 py-6">Stock Status</th>
              <th className="px-8 py-6">Classification</th>
              <th className="px-8 py-6 text-right">Master Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {filteredItems.length === 0 ? (
               <tr>
                 <td colSpan={5} className="py-32 text-center">
                    <div className="flex flex-col items-center gap-4 text-zinc-700">
                       <Package size={48} className="opacity-10" />
                       <p className="font-black uppercase tracking-widest text-xs italic">No matching products found in the platform catalog</p>
                    </div>
                 </td>
               </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-emerald-500/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                       <div className="h-14 w-14 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0 shadow-lg group-hover:border-emerald-500/30 transition-all">
                          <Package size={24} className="text-zinc-600 group-hover:text-emerald-500 transition-colors" />
                       </div>
                       <div className="space-y-1">
                          <p className="text-base font-black text-white tracking-tight leading-none mb-1">{item.name}</p>
                          <div className="flex items-center gap-2">
                             <Badge variant="outline" className="bg-zinc-950 border-zinc-800 text-zinc-500 text-[9px] font-bold px-2 py-0">
                                SKU: {item.sku}
                             </Badge>
                             {item.brand && (
                               <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                                 {item.brand}
                               </span>
                             )}
                          </div>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500">
                           <Store size={14} />
                        </div>
                        <div>
                           <p className="text-sm font-bold text-zinc-200">{item.vendor.businessName}</p>
                           <p className="text-[10px] text-zinc-600 font-medium tracking-tight">/{item.vendor.tenantSlug}</p>
                        </div>
                     </div>
                  </td>
                  <td className="px-8 py-6">
                     <div className="space-y-2">
                        <div className="flex items-end gap-2">
                           <span className="text-xl font-black text-white leading-none">{item.quantity}</span>
                           <span className="text-[10px] font-bold text-zinc-600 uppercase mb-0.5">{item.unit}</span>
                        </div>
                        {item.quantity <= item.lowStockThreshold ? (
                           <div className="flex items-center gap-1.5 text-orange-500 animate-pulse">
                              <AlertTriangle size={12} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Critical Reserve</span>
                           </div>
                        ) : (
                           <div className="flex items-center gap-1.5 text-emerald-500/50">
                              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Nominal</span>
                           </div>
                        )}
                     </div>
                  </td>
                  <td className="px-8 py-6">
                     <Badge className="bg-zinc-950 border-zinc-800 text-zinc-400 font-black uppercase text-[9px] tracking-widest px-3 py-1">
                        {item.inventoryCategory?.name || item.category || 'Unsorted'}
                     </Badge>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="h-10 w-10 flex items-center justify-center hover:bg-zinc-800 rounded-xl text-zinc-500 transition-all opacity-0 group-hover:opacity-100">
                          <MoreVertical size={20} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white w-56 p-2">
                         <DropdownMenuLabel className="text-[10px] font-black uppercase text-zinc-600 px-2 py-1.5 leading-none tracking-widest">Command Center</DropdownMenuLabel>
                         <DropdownMenuSeparator className="bg-zinc-800" />
                         <DropdownMenuItem 
                            onClick={() => {
                               setEditingStock(item);
                               setNewStockValue(item.quantity);
                            }}
                            className="focus:bg-zinc-800 px-2 py-2 rounded-lg cursor-pointer text-xs font-bold transition-colors"
                         >
                            <Edit className="w-4 h-4 mr-2 text-emerald-500" /> Force Stock Correction
                         </DropdownMenuItem>
                         <DropdownMenuItem className="focus:bg-zinc-800 px-2 py-2 rounded-lg cursor-pointer text-xs font-bold transition-colors">
                            <History className="w-4 h-4 mr-2 text-blue-500" /> Audit Logs
                         </DropdownMenuItem>
                         <DropdownMenuSeparator className="bg-zinc-800" />
                         <DropdownMenuItem 
                          onClick={() => handleDelete(item.id)}
                          disabled={deleting === item.id}
                          className="focus:bg-red-500/10 px-2 py-2 rounded-lg cursor-pointer text-red-500 text-xs font-bold transition-colors"
                         >
                            {deleting === item.id ? <Loader2 size={16} className="animate-spin mr-2" /> : <Trash2 size={16} className="mr-2" />}
                            Purge Asset From Platform
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

      {/* Stock Correction Dialog */}
      <Dialog open={!!editingStock} onOpenChange={(open) => !open && setEditingStock(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[500px] rounded-[2rem] p-0 overflow-hidden">
           <div className="p-8 border-b border-zinc-800 bg-zinc-950/20">
              <DialogHeader>
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4">
                   <Edit size={24} />
                </div>
                <DialogTitle className="text-xl font-black italic uppercase tracking-tight">Force Stock Correction</DialogTitle>
                <DialogDescription className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                   Directly overriding inventory levels for {editingStock?.name}
                </DialogDescription>
              </DialogHeader>
           </div>
           
           <div className="p-8 space-y-6">
              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">New Global Quantity</Label>
                 <Input 
                   type="number"
                   value={newStockValue}
                   onChange={e => setNewStockValue(parseInt(e.target.value))}
                   className="h-14 bg-zinc-950 border-zinc-800 rounded-xl px-6 text-xl font-black text-emerald-500 focus:border-emerald-500/50"
                 />
              </div>
              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Correction Reason (Admin Audit)</Label>
                 <Textarea 
                   value={correctionReason}
                   onChange={e => setCorrectionReason(e.target.value)}
                   placeholder="e.g., Physical audit discrepancy resolution"
                   className="min-h-[100px] bg-zinc-950 border-zinc-800 rounded-xl px-6 py-4 text-sm font-medium focus:border-emerald-500/50 resize-none"
                 />
              </div>
           </div>

           <div className="p-6 bg-zinc-950 border-t border-zinc-800 flex justify-end gap-3">
              <Button 
                variant="ghost" 
                onClick={() => setEditingStock(null)}
                className="h-12 px-6 text-zinc-500 font-bold uppercase tracking-widest text-[10px]"
              >
                 Abort
              </Button>
              <Button 
                onClick={handleUpdateStock}
                disabled={isUpdating || !correctionReason}
                className="h-12 px-8 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg shadow-emerald-500/10"
              >
                 {isUpdating ? <Loader2 size={16} className="animate-spin" /> : 'Confirm Override'}
              </Button>
           </div>
        </DialogContent>
      </Dialog>

      {/* Info Footer */}
      <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-8 flex items-center gap-6">
         <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
            <BadgeAlert size={24} />
         </div>
         <div>
            <p className="text-sm font-black italic uppercase text-white tracking-tight">Super-Admin Override Protocol</p>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
               As a Platform Administrator, you have total authority over vendor assets. Any modifications or deletions will be logged and are globally impactful. Use this control center for critical resolution and platform-wide cataloging.
            </p>
         </div>
      </div>
    </div>
  );
}
