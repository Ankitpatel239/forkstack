
'use client';

import { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Loader2, 
  AlertCircle, 
  Package, 
  TrendingDown, 
  X, 
  RotateCcw, 
  IndianRupee, 
  MinusCircle, 
  PlusCircle,
  AlertTriangle
} from 'lucide-react';
import { createInventoryItem, logStockChange, updateStockBatch, updateInventoryItem } from '@/app/actions/inventory';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface StockBatch {
  id: string;
  quantity: number;
  costPrice: number;
  receivedDate: Date;
  batchNumber: string | null;
}

interface InventoryItem {
  id: string;
  name: string;
  sku: string | null;
  barcode: string | null;
  category: string | null;
  quantity: number;
  unit: string;
  lowStockThreshold: number;
  costPrice?: number;
  price?: number;
  supplier?: string;
  brand?: string;
  location?: string;
  expiryDate?: Date;
  batches?: StockBatch[];
}

interface InventoryDialogProps {
  item?: InventoryItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORIES = [
  "Raw Materials", "Finished Goods", "FMCG", "Electronics", "Textiles", 
  "Hardware", "Packaging", "Office Supplies", "Furniture", "Automotive", 
  "Food & Beverages", "Dairy", "Produce", "Others"
];

export function InventoryDialog({ item, open, onOpenChange }: InventoryDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'DETAILS' | 'REPLENISH'>(item ? 'REPLENISH' : 'DETAILS');
  const [adjustmentType, setAdjustmentType] = useState<'IN' | 'WASTE'>('IN');
  const [editingBatchId, setEditingBatchId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState<string>('');
  const [editReason, setEditReason] = useState<string>('');
  
  const [formData, setFormData] = useState({
    name: item?.name || '',
    sku: item?.sku || '',
    barcode: item?.barcode || '',
    category: item?.category || '',
    quantity: item?.quantity?.toString() || '0',
    unit: item?.unit || 'units',
    lowStockThreshold: item?.lowStockThreshold?.toString() || '10',
    costPrice: item?.costPrice?.toString() || '0',
    price: item?.price?.toString() || '0',
    supplier: item?.supplier || '',
    brand: item?.brand || '',
    location: item?.location || '',
    expiryDate: item?.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : '',
    changeReason: '',
    adjustmentValue: '0',
    newBatchCost: item?.costPrice?.toString() || '0'
  });

  useEffect(() => {
    if (open) {
      setMode(item ? 'REPLENISH' : 'DETAILS');
      setAdjustmentType('IN');
      setEditingBatchId(null);
      setFormData({
        name: item?.name || '',
        sku: item?.sku || '',
        barcode: item?.barcode || '',
        category: item?.category || '',
        quantity: item?.quantity?.toString() || '0',
        unit: item?.unit || 'units',
        lowStockThreshold: item?.lowStockThreshold?.toString() || '10',
        costPrice: item?.costPrice?.toString() || '0',
        price: item?.price?.toString() || '0',
        supplier: item?.supplier || '',
        brand: item?.brand || '',
        location: item?.location || '',
        expiryDate: item?.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : '',
        changeReason: '',
        adjustmentValue: '0',
        newBatchCost: item?.costPrice?.toString() || '0'
      });
    }
  }, [item, open]);

  const handleBatchUpdate = async (batchId: string) => {
    if (!editQty || !editReason) return;
    setLoading(true);
    try {
      await updateStockBatch(batchId, parseFloat(editQty) || 0, editReason);
      setEditingBatchId(null);
      router.refresh();
      setTimeout(() => onOpenChange(false), 300);
    } catch (error) {
      toast.error("Error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBatchId) return; 
    setLoading(true);
    try {
      if (item) {
        if (mode === 'REPLENISH') {
           const val = parseFloat(formData.adjustmentValue) || 0;
           if (val <= 0) { setLoading(false); return; }
           const realChange = adjustmentType === 'IN' ? val : -val;
           await logStockChange(item.id, realChange, adjustmentType, formData.changeReason || "Manual Fix", adjustmentType === 'IN' ? (parseFloat(formData.newBatchCost) || 0) : undefined);
           router.refresh();
        } else {
           const { quantity, adjustmentValue, newBatchCost, changeReason, ...cleanData } = formData;
           await updateInventoryItem(item.id, { 
             ...cleanData, 
             lowStockThreshold: parseFloat(formData.lowStockThreshold) || 0, 
             costPrice: parseFloat(formData.costPrice) || 0, 
             price: parseFloat(formData.price) || 0,
             expiryDate: cleanData.expiryDate ? new Date(cleanData.expiryDate) : undefined
           });
           router.refresh();
        }
      } else {
        const { adjustmentValue, newBatchCost, changeReason, ...cleanData } = formData;
        await createInventoryItem({ 
          ...cleanData, 
          quantity: parseFloat(formData.quantity) || 0, 
          lowStockThreshold: parseFloat(formData.lowStockThreshold) || 0, 
          costPrice: parseFloat(formData.costPrice) || 0, 
          price: parseFloat(formData.price) || 0,
          expiryDate: cleanData.expiryDate ? new Date(cleanData.expiryDate) : undefined
        });
        router.refresh();
      }
      onOpenChange(false);
    } catch (error) {
      toast.error('Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950 border-zinc-900 text-white sm:max-w-[600px] p-0 overflow-hidden rounded-2xl shadow-2xl">
        <DialogHeader className="p-6 pb-4 bg-zinc-900/40">
          <div className="flex items-center justify-between gap-4">
             <div>
                <DialogTitle className="text-base font-bold tracking-tight">
                  {item ? (mode === 'REPLENISH' ? 'Stock Update' : 'Asset Profile') : 'New Catalog Entry'}
                </DialogTitle>
                <DialogDescription className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest mt-0.5">
                  {item ? `${item.name} • ${item.sku}` : 'Setup new SKU'}
                </DialogDescription>
             </div>
             {item && (
                <div className="flex bg-zinc-900 p-0.5 rounded-lg">
                   <button type="button" onClick={() => setMode('REPLENISH')} className={`px-4 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all ${mode === 'REPLENISH' ? 'bg-emerald-500 text-zinc-950 shadow' : 'text-zinc-500'}`}>Inventory</button>
                   <button type="button" onClick={() => setMode('DETAILS')} className={`px-4 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all ${mode === 'DETAILS' ? 'bg-emerald-500 text-zinc-950 shadow' : 'text-zinc-500'}`}>Profile</button>
                </div>
             )}
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4 overflow-y-auto max-h-[70vh] custom-scrollbar">
          {item && mode === 'REPLENISH' ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
               <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-900/50 rounded-xl border border-zinc-900">
                  <button type="button" onClick={() => setAdjustmentType('IN')} className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${adjustmentType === 'IN' ? 'bg-emerald-500 text-zinc-950' : 'text-zinc-500'}`}><PlusCircle size={14} /> Intake</button>
                  <button type="button" onClick={() => setAdjustmentType('WASTE')} className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${adjustmentType === 'WASTE' ? 'bg-red-500 text-white' : 'text-zinc-500'}`}><MinusCircle size={14} /> Waste</button>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase text-zinc-500">Amount ({item.unit})</Label>
                    <Input type="number" step="0.01" value={formData.adjustmentValue} onChange={e => setFormData({...formData, adjustmentValue: e.target.value})} className="bg-zinc-900 h-10 px-4 rounded-lg text-sm font-bold" required />
                  </div>
                  {adjustmentType === 'IN' && (
                    <div className="space-y-1.5">
                      <Label className="text-[9px] font-bold uppercase text-zinc-500">Lot Cost (₹)</Label>
                      <Input type="number" step="0.01" value={formData.newBatchCost} onChange={e => setFormData({...formData, newBatchCost: e.target.value})} className="bg-zinc-900 h-10 px-4 rounded-lg text-sm font-bold" required />
                    </div>
                  )}
               </div>

               <div className="space-y-1.5">
                  <Label className="text-[9px] font-bold uppercase text-zinc-500">Log Entry Description</Label>
                  <Input value={formData.changeReason} onChange={e => setFormData({...formData, changeReason: e.target.value})} placeholder="Reason..." className="bg-zinc-900 h-10 px-4 rounded-lg text-[10px]" />
               </div>

               <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-3">
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-700 flex items-center gap-2">Audit History Control</p>
                  <div className="space-y-2">
                     {item.batches?.filter(b => b.quantity > 0).sort((a,b) => new Date(a.receivedDate).getTime() - new Date(b.receivedDate).getTime()).map((batch, idx) => (
                        <div key={batch.id}>
                           {editingBatchId === batch.id ? (
                              <div className="p-3 rounded-lg bg-zinc-900 border border-emerald-500/30 flex gap-2">
                                 <Input type="number" value={editQty} onChange={e => setEditQty(e.target.value)} className="h-8 text-xs bg-black" />
                                 <Input value={editReason} onChange={e => setEditReason(e.target.value)} placeholder="Fix note" className="h-8 text-[9px] bg-black" />
                                 <Button type="button" onClick={() => handleBatchUpdate(batch.id)} className="bg-emerald-500 text-zinc-950 h-8 px-3 rounded-md font-bold text-[8px]">SAVE</Button>
                              </div>
                           ) : (
                              <div className="group/batch flex items-center justify-between p-3 rounded-lg bg-zinc-900/30 border border-zinc-900/30 hover:bg-zinc-900/50">
                                 <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-black ${idx === 0 ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-500'}`}>{idx === 0 ? 'OLD' : `#${idx + 1}`}</div>
                                    <p className="text-[10px] font-bold text-zinc-400">{batch.quantity} {item.unit} <span className="text-[8px] text-zinc-700 font-medium ml-1">@{batch.costPrice}</span></p>
                                 </div>
                                 <button type="button" onClick={() => { setEditingBatchId(batch.id); setEditQty(batch.quantity.toString()); }} className="p-1.5 text-zinc-700 hover:text-emerald-500 transition-all opacity-0 group-hover/batch:opacity-100"><RotateCcw size={12} /></button>
                              </div>
                           )}
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5"><Label className="text-[9px] font-bold uppercase text-zinc-500">Name</Label><Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-zinc-900 h-10 px-4 rounded-lg text-xs font-bold" /></div>
                  <div className="space-y-1.5"><Label className="text-[9px] font-bold uppercase text-zinc-500">Barcode</Label><Input value={formData.barcode} onChange={e => setFormData({...formData, barcode: e.target.value})} className="bg-zinc-900 h-10 px-4 rounded-lg tracking-widest text-xs" /></div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5"><Label className="text-[9px] font-bold uppercase text-zinc-500">Category</Label>
                    <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v})}>
                      <SelectTrigger className="bg-zinc-900 h-10 rounded-lg text-xs font-bold"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
                        {CATEGORIES.map(cat => <SelectItem key={cat} value={cat} className="text-xs py-2">{cat}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5"><Label className="text-[9px] font-bold uppercase text-zinc-500">UOM</Label><Input value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="bg-zinc-900 h-10 rounded-lg text-xs font-bold" /></div>
               </div>
               <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-900">
                  <div className="space-y-1.5"><Label className="text-[9px] font-bold uppercase text-emerald-500">Price (POS)</Label><Input type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="bg-black h-10 px-4 rounded-lg text-sm font-bold text-emerald-400" /></div>
                  <div className="space-y-1.5"><Label className="text-[9px] font-bold uppercase text-red-500">Alert Lvl</Label><Input type="number" value={formData.lowStockThreshold} onChange={e => setFormData({...formData, lowStockThreshold: e.target.value})} className="bg-black h-10 px-4 rounded-lg text-sm font-bold" /></div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5"><Label className="text-[9px] font-bold uppercase text-zinc-500">Brand</Label><Input value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="bg-zinc-900 h-10 rounded-lg text-xs" /></div>
                  <div className="space-y-1.5"><Label className="text-[9px] font-bold uppercase text-zinc-500">Location</Label><Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="bg-zinc-900 h-10 rounded-lg text-xs" /></div>
               </div>
            </div>
          )}
          <DialogFooter className="pt-2">
            <Button type="submit" disabled={loading || !!editingBatchId} className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-[10px] h-11 rounded-xl shadow-lg transition-all active:scale-[0.98]">
              {loading ? "..." : item ? (mode === 'REPLENISH' ? 'Update Inventory' : 'Sync Profile') : 'Create SKU'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
