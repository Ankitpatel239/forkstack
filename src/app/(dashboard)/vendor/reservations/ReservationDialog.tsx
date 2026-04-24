
'use client';

import { useEffect, useState } from 'react';
import { 
  Users, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MessageSquare,
  Save,
  Loader2
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createReservation, editReservation } from '@/app/actions/reservations';
import { toast } from 'sonner';

interface ReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendorId: string;
  tables: any[];
  reservation?: any; // If provided, we are editing
}

export function ReservationDialog({ open, onOpenChange, vendorId, tables, reservation }: ReservationDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: reservation?.customerName || '',
    customerPhone: reservation?.customerPhone || '',
    customerEmail: reservation?.customerEmail || '',
    reservationDate: reservation ? new Date(reservation.reservationDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    startTime: reservation ? new Date(reservation.startTime).toTimeString().slice(0, 5) : '19:00',
    guestCount: reservation?.guestCount?.toString() || '2',
    tableId: reservation?.tableId || 'any',
    notes: reservation?.notes || ''
  });

  // Update form data when reservation changes
  useEffect(() => {
    if (reservation) {
      setFormData({
        customerName: reservation.customerName,
        customerPhone: reservation.customerPhone,
        customerEmail: reservation.customerEmail || '',
        reservationDate: new Date(reservation.reservationDate).toISOString().split('T')[0],
        startTime: new Date(reservation.startTime).toTimeString().slice(0, 5),
        guestCount: reservation.guestCount.toString(),
        tableId: reservation.tableId || 'any',
        notes: reservation.notes || ''
      });
    }
  }, [reservation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const resDate = new Date(formData.reservationDate);
      const [hours, minutes] = formData.startTime.split(':');
      const startDateTime = new Date(resDate);
      startDateTime.setHours(parseInt(hours), parseInt(minutes));

      if (reservation) {
        // Edit existing
        await editReservation(reservation.id, {
          tableId: formData.tableId === 'any' ? undefined : formData.tableId,
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          customerEmail: formData.customerEmail || undefined,
          reservationDate: resDate,
          startTime: startDateTime,
          guestCount: parseInt(formData.guestCount),
          notes: formData.notes
        });
        toast.success('Reservation updated successfully');
      } else {
        // Create new
        await createReservation({
          vendorId,
          tableId: formData.tableId === 'any' ? undefined : formData.tableId,
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          customerEmail: formData.customerEmail || undefined,
          reservationDate: resDate,
          startTime: startDateTime,
          guestCount: parseInt(formData.guestCount),
          notes: formData.notes,
          createdBy: 'Staff'
        });
        toast.success('Reservation created successfully');
      }

      onOpenChange(false);
      if (!reservation) {
        setFormData({
          customerName: '',
          customerPhone: '',
          customerEmail: '',
          reservationDate: new Date().toISOString().split('T')[0],
          startTime: '19:00',
          guestCount: '2',
          tableId: 'any',
          notes: ''
        });
      }
    } catch (error) {
      toast.error(reservation ? 'Failed to update reservation' : 'Failed to create reservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-border text-foreground sm:max-w-[600px] rounded-[3rem] p-0 overflow-hidden shadow-2xl outline-none">
        <div className="bg-gradient-to-br from-card to-background p-10 border-b border-border relative">
           <DialogHeader>
             <div className="flex items-center gap-4 mb-2">
                <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                   <CalendarIcon size={28} />
                </div>
                <div>
                   <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter text-foreground">
                     {reservation ? 'Edit Reservation' : 'Manual Booking'}
                   </DialogTitle>
                   <DialogDescription className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest mt-1">
                     {reservation ? `Updating booking for ${reservation.customerName}` : 'Register a customer reservation manually.'}
                   </DialogDescription>
                </div>
             </div>
           </DialogHeader>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
           <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Customer Name</Label>
                 <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30" />
                    <Input 
                      required
                      value={formData.customerName}
                      onChange={e => setFormData({...formData, customerName: e.target.value})}
                      placeholder="Guest Name"
                      className="bg-muted border-border h-14 pl-12 font-black italic text-sm rounded-2xl focus:border-emerald-500/50 text-foreground" 
                    />
                 </div>
              </div>
              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Phone Number</Label>
                 <div className="relative">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30" />
                    <Input 
                      required
                      value={formData.customerPhone}
                      onChange={e => setFormData({...formData, customerPhone: e.target.value})}
                      placeholder="e.g., +91..."
                      className="bg-muted border-border h-14 pl-12 font-black italic text-sm rounded-2xl focus:border-emerald-500/50 text-foreground" 
                    />
                 </div>
              </div>
           </div>

           <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Reservation Date</Label>
                 <div className="relative">
                    <CalendarIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 z-10" />
                    <Input 
                      required
                      type="date"
                      value={formData.reservationDate}
                      onChange={e => setFormData({...formData, reservationDate: e.target.value})}
                      className="bg-muted border-border h-14 pl-12 font-black italic rounded-2xl text-foreground [color-scheme:dark]" 
                    />
                 </div>
              </div>
              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Start Time</Label>
                 <div className="relative">
                    <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 z-10" />
                    <Input 
                      required
                      type="time"
                      value={formData.startTime}
                      onChange={e => setFormData({...formData, startTime: e.target.value})}
                      className="bg-muted border-border h-14 pl-12 font-black italic rounded-2xl text-foreground [color-scheme:dark]" 
                    />
                 </div>
              </div>
           </div>

           <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Guest Count</Label>
                 <div className="relative">
                    <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 z-10" />
                    <Select value={formData.guestCount} onValueChange={v => setFormData({...formData, guestCount: v})}>
                       <SelectTrigger className="bg-muted border-border h-14 pl-12 font-black italic rounded-2xl text-foreground">
                          <SelectValue />
                       </SelectTrigger>
                       <SelectContent className="bg-card border-border text-foreground font-black italic">
                          {[1,2,3,4,5,6,7,8,10,12].map(num => (
                            <SelectItem key={num} value={num.toString()}>{num} {num === 1 ? 'Person' : 'People'}</SelectItem>
                          ))}
                       </SelectContent>
                    </Select>
                 </div>
              </div>
              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Assign Table</Label>
                 <Select value={formData.tableId} onValueChange={v => setFormData({...formData, tableId: v})}>
                    <SelectTrigger className="bg-muted border-border h-14 font-black italic rounded-2xl text-foreground">
                       <SelectValue placeholder="Any Available Table" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-foreground font-black italic">
                       <SelectItem value="any">Any Available Table</SelectItem>
                       {tables.map(table => (
                         <SelectItem key={table.id} value={table.id}>Table {table.tableNumber} ({table.capacity}p)</SelectItem>
                       ))}
                    </SelectContent>
                 </Select>
              </div>
           </div>

           <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Internal Notes</Label>
              <div className="relative">
                 <MessageSquare size={18} className="absolute left-4 top-4 text-muted-foreground/30" />
                 <Textarea 
                   value={formData.notes}
                   onChange={e => setFormData({...formData, notes: e.target.value})}
                   placeholder="e.g., Birthday celebration, VIP Guest..."
                   className="bg-muted border-border min-h-[100px] pl-12 pt-4 font-black italic text-sm rounded-2xl focus:border-emerald-500/50 text-foreground resize-none" 
                 />
              </div>
           </div>

           <DialogFooter className="pt-4">
              <Button 
                 type="submit" 
                 disabled={loading}
                 className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-[10px] h-14 rounded-2xl shadow-xl shadow-emerald-500/10 group active:scale-95 transition-all"
              >
                 {loading ? <Loader2 className="animate-spin" /> : (
                   <>
                     <Save size={18} className="mr-2" /> 
                     {reservation ? 'Update Reservation' : 'Create Reservation'}
                   </>
                 )}
              </Button>
           </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
