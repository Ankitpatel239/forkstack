
'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  MapPin, 
  Table as TableIcon,
  Save,
  Loader2,
  Info
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createTable, updateTable } from '@/app/actions/tables';
import { toast } from 'sonner';

interface TableDialogProps {
  table?: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TableDialog({ table, open, onOpenChange }: TableDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tableNumber: table?.tableNumber || '',
    capacity: table?.capacity?.toString() || '4',
    chairCount: table?.chairCount?.toString() || '4',
    location: table?.location || '',
    status: table?.status || 'AVAILABLE'
  });

  useEffect(() => {
    if (open) {
      setFormData({
        tableNumber: table?.tableNumber || '',
        capacity: table?.capacity?.toString() || '4',
        chairCount: table?.chairCount?.toString() || '4',
        location: table?.location || '',
        status: table?.status || 'AVAILABLE'
      });
    }
  }, [table, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        ...formData,
        capacity: parseInt(formData.capacity),
        chairCount: parseInt(formData.chairCount)
      };

      if (table) {
        await updateTable(table.id, payload);
        toast.success('Table updated successfully');
      } else {
        await createTable(payload);
        toast.success('Table created successfully');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to save table');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-border text-foreground sm:max-w-[500px] rounded-[3rem] p-0 overflow-hidden shadow-2xl outline-none">
        <div className="bg-gradient-to-br from-card to-background p-10 border-b border-border relative">
           <DialogHeader>
             <div className="flex items-center gap-4 mb-2">
                <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                   <TableIcon size={28} />
                </div>
                <div>
                   <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter text-foreground">
                     {table ? 'Edit Table' : 'New Table'}
                   </DialogTitle>
                   <DialogDescription className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest mt-1">
                     Configure your physical dining points.
                   </DialogDescription>
                </div>
             </div>
           </DialogHeader>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-8">
           <div className="space-y-6">
              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Table Reference</Label>
                 <div className="relative">
                    <TableIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30" />
                    <Input 
                      value={formData.tableNumber}
                      onChange={e => setFormData({...formData, tableNumber: e.target.value})}
                      placeholder="e.g., T-05 or Window Seat"
                      className="bg-muted border-border h-14 pl-12 font-black italic text-sm rounded-2xl focus:border-emerald-500/50 text-foreground" 
                      required 
                    />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Max Capacity</Label>
                    <div className="relative">
                       <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30" />
                       <Input 
                         type="number"
                         value={formData.capacity}
                         onChange={e => setFormData({...formData, capacity: e.target.value})}
                         className="bg-muted border-border h-14 pl-12 font-black italic rounded-2xl text-foreground" 
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Actual Chairs</Label>
                    <div className="relative">
                       <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30" />
                       <Input 
                         type="number"
                         value={formData.chairCount}
                         onChange={e => setFormData({...formData, chairCount: e.target.value})}
                         className="bg-muted border-border h-14 pl-12 font-black italic rounded-2xl text-foreground" 
                       />
                    </div>
                 </div>
              </div>

              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Physical Location</Label>
                 <div className="relative">
                    <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30" />
                    <Input 
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                      placeholder="e.g., Rooftop Terrace, Near Window"
                      className="bg-muted border-border h-14 pl-12 font-black italic text-sm rounded-2xl text-foreground" 
                    />
                 </div>
              </div>

              {table && (
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Availability Status</Label>
                   <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
                      <SelectTrigger className="bg-muted border-border h-14 font-black italic rounded-2xl text-foreground">
                         <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-foreground font-black italic">
                         <SelectItem value="AVAILABLE">AVAILABLE</SelectItem>
                         <SelectItem value="OCCUPIED">OCCUPIED</SelectItem>
                         <SelectItem value="RESERVED">RESERVED</SelectItem>
                         <SelectItem value="MAINTENANCE">MAINTENANCE</SelectItem>
                      </SelectContent>
                   </Select>
                </div>
              )}
           </div>

           <DialogFooter className="pt-4 gap-4 sm:justify-between items-center">
              <div className="hidden sm:flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground/30">
                 <Info size={12} /> Live QR Sync
              </div>
              <Button 
                 type="submit" 
                 disabled={loading}
                 className="w-full sm:w-auto min-w-[180px] bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-[10px] h-14 rounded-2xl shadow-xl shadow-emerald-500/10 group active:scale-95 transition-all"
              >
                 {loading ? <Loader2 className="animate-spin" /> : (
                   <>
                     <Save size={18} className="mr-2" /> 
                     {table ? 'Save Changes' : 'Create Table'}
                   </>
                 )}
              </Button>
           </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
