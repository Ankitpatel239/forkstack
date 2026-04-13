
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
import { Loader2 } from 'lucide-react';
import { createInventoryItem, updateInventoryItem } from '@/app/actions/inventory';
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
}

interface InventoryDialogProps {
  item?: InventoryItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InventoryDialog({ item, open, onOpenChange }: InventoryDialogProps) {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: item?.name || '',
    sku: item?.sku || '',
    category: item?.category || '',
    quantity: item?.quantity?.toString() || '0',
    unit: item?.unit || 'units',
    lowStockThreshold: item?.lowStockThreshold?.toString() || '10',
    price: item?.price?.toString() || '0'
  });

  // Sync form data when item changes or dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        name: item?.name || '',
        sku: item?.sku || '',
        category: item?.category || '',
        quantity: item?.quantity?.toString() || '0',
        unit: item?.unit || 'units',
        lowStockThreshold: item?.lowStockThreshold?.toString() || '10',
        price: item?.price?.toString() || '0'
      });
    }
  }, [item, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        name: formData.name,
        sku: formData.sku || undefined,
        category: formData.category || undefined,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        lowStockThreshold: parseFloat(formData.lowStockThreshold),
        price: parseFloat(formData.price)
      };

      if (item) {
        await updateInventoryItem(item.id, payload);
        toast.success('Inventory record updated');
      } else {
        await createInventoryItem(payload);
        toast.success('New item registered to inventory');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold italic uppercase tracking-tight">
            {item ? 'Modify Stock Node' : 'Register New Inventory Unit'}
          </DialogTitle>
          <DialogDescription className="text-zinc-500 font-medium">
            {item ? 'Update stock levels and configuration parameters.' : 'Initialize a new tracking unit for global stock management.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Asset Name</Label>
              <Input 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Arabica Beans" 
                className="bg-zinc-950 border-zinc-800 h-11 px-4" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">SKU / ID</Label>
              <Input 
                value={formData.sku}
                onChange={e => setFormData({...formData, sku: e.target.value})}
                placeholder="SKU-827-X" 
                className="bg-zinc-950 border-zinc-800 h-11 px-4" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={v => setFormData({...formData, category: v})}
              >
                <SelectTrigger className="bg-zinc-950 border-zinc-800 h-11">
                  <SelectValue placeholder="Classification" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white font-bold">
                  <SelectItem value="Raw Materials">Raw Materials</SelectItem>
                  <SelectItem value="Packaging">Packaging</SelectItem>
                  <SelectItem value="Condiments">Condiments</SelectItem>
                  <SelectItem value="Equipment">Equipment</SelectItem>
                  <SelectItem value="Consumables">Consumables</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Unit Type</Label>
              <Input 
                value={formData.unit}
                onChange={e => setFormData({...formData, unit: e.target.value})}
                placeholder="kg, units, Liters" 
                className="bg-zinc-950 border-zinc-800 h-11 px-4" 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-zinc-800/50 pt-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Current Qty</Label>
              <Input 
                type="number"
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: e.target.value})}
                className="bg-zinc-950 border-zinc-800 h-11 px-4 font-black" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Alert Min</Label>
              <Input 
                type="number"
                value={formData.lowStockThreshold}
                onChange={e => setFormData({...formData, lowStockThreshold: e.target.value})}
                className="bg-zinc-950 border-zinc-800 h-11 px-4 font-black" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Unit Cost (₹)</Label>
              <Input 
                type="number"
                step="0.01"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                className="bg-zinc-950 border-zinc-800 h-11 px-4 font-black" 
                required 
              />
            </div>
          </div>

          <DialogFooter className="pt-4 gap-3">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-[0.2em] text-[10px] h-14 rounded-2xl shadow-xl shadow-emerald-500/10"
            >
              {loading ? <Loader2 className="animate-spin" /> : item ? 'Sync Registry' : 'Authorize Acquisition'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
