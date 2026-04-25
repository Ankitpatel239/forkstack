
'use client';

import { useState } from 'react';
import { 
  Users, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MessageSquare,
  ChevronRight,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createReservation, checkReservationConflicts, publicCancelReservation } from '@/app/actions/reservations';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';

export function BookingForm({ vendorId, tables, vendorSlug }: { vendorId: string, tables: any[], vendorSlug: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const manageId = searchParams.get('manage');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [conflict, setConflict] = useState<{ type: string; message: string } | null>(null);
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    reservationDate: '',
    startTime: '',
    guestCount: '2',
    tableId: '',
    notes: ''
  });

  // Handle conflict checking
  const handleCheckConflicts = async (tableId: string, date: string, time: string) => {
    if (!tableId || !date || !time || tableId === 'any') {
      setConflict(null);
      return;
    }

    try {
      const resDate = new Date(date);
      const [hours, minutes] = time.split(':');
      const startDateTime = new Date(resDate);
      startDateTime.setHours(parseInt(hours), parseInt(minutes));

      const result = await checkReservationConflicts(tableId, startDateTime);
      if (result.type !== 'NONE') {
        setConflict(result);
      } else {
        setConflict(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancel = async () => {
    if (!manageId || !formData.customerPhone) {
      toast.error('Please enter your phone number to verify cancellation');
      return;
    }

    if (!confirm('Are you sure you want to cancel this reservation?')) return;

    setLoading(true);
    try {
      await publicCancelReservation(manageId, formData.customerPhone);
      toast.success('Reservation cancelled successfully');
      router.push(`/${vendorSlug}`);
    } catch (e: any) {
      toast.error(e.message || 'Failed to cancel');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (conflict?.type === 'HARD') {
      toast.error('This table is not available at this time.');
      return;
    }

    setLoading(true);
    try {
      const resDate = new Date(formData.reservationDate);
      const [hours, minutes] = formData.startTime.split(':');
      const startDateTime = new Date(resDate);
      startDateTime.setHours(parseInt(hours), parseInt(minutes));

      await createReservation({
        vendorId,
        tableId: formData.tableId === 'any' || !formData.tableId ? undefined : formData.tableId,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail || undefined,
        reservationDate: resDate,
        startTime: startDateTime,
        guestCount: parseInt(formData.guestCount),
        notes: formData.notes
      });

      setSuccess(true);
      toast.success('Reservation request sent successfully');
      setTimeout(() => router.push(`/${vendorSlug}`), 3000);
    } catch (error) {
      console.error(error);
      toast.error('Failed to create reservation.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-12 rounded-[3rem] bg-zinc-900 border border-emerald-500/20 text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mx-auto shadow-[0_0_50px_rgba(16,185,129,0.2)]">
          <CheckCircle2 size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black italic uppercase tracking-tight text-white">Booking Requested!</h2>
          <p className="text-zinc-500 text-sm font-bold">
            We've received your request. The vendor will confirm your table shortly.
          </p>
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/50 pt-4">Redirecting you back to menu...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Customer Info */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
           <h3 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500/50 italic">Personal Details</h3>
           <div className="h-px bg-zinc-800 flex-1" />
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-1">Full Name</Label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" />
              <Input 
                required
                value={formData.customerName}
                onChange={e => setFormData({...formData, customerName: e.target.value})}
                placeholder="Your name"
                className="bg-zinc-900/50 border-zinc-800 h-14 pl-12 font-bold italic rounded-2xl focus:border-emerald-500/50 text-white placeholder:text-zinc-700 transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-1">Phone Number</Label>
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" />
              <Input 
                required
                type="tel"
                value={formData.customerPhone}
                onChange={e => setFormData({...formData, customerPhone: e.target.value})}
                placeholder="+91 00000 00000"
                className="bg-zinc-900/50 border-zinc-800 h-14 pl-12 font-bold italic rounded-2xl focus:border-emerald-500/50 text-white placeholder:text-zinc-700 transition-all"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-1">Email (Optional)</Label>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" />
            <Input 
              type="email"
              value={formData.customerEmail}
              onChange={e => setFormData({...formData, customerEmail: e.target.value})}
              placeholder="your@email.com"
              className="bg-zinc-900/50 border-zinc-800 h-14 pl-12 font-bold italic rounded-2xl focus:border-emerald-500/50 text-white placeholder:text-zinc-700 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Booking Details */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
           <h3 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500/50 italic">Reservation Details</h3>
           <div className="h-px bg-zinc-800 flex-1" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
           <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-1">Date</Label>
              <div className="relative">
                <CalendarIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 z-10" />
                <Input 
                  required
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.reservationDate}
                  onChange={e => {
                    setFormData({...formData, reservationDate: e.target.value});
                    handleCheckConflicts(formData.tableId, e.target.value, formData.startTime);
                  }}
                  className="bg-zinc-900/50 border-zinc-800 h-14 pl-12 font-bold italic rounded-2xl focus:border-emerald-500/50 text-white transition-all [color-scheme:dark]"
                />
              </div>
           </div>
           <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-1">Time</Label>
              <div className="relative">
                <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 z-10" />
                <Input 
                  required
                  type="time"
                  value={formData.startTime}
                  onChange={e => {
                    setFormData({...formData, startTime: e.target.value});
                    handleCheckConflicts(formData.tableId, formData.reservationDate, e.target.value);
                  }}
                  className="bg-zinc-900/50 border-zinc-800 h-14 pl-12 font-bold italic rounded-2xl focus:border-emerald-500/50 text-white transition-all [color-scheme:dark]"
                />
              </div>
           </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-1">Guests</Label>
            <div className="relative">
              <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 z-10" />
              <Select value={formData.guestCount} onValueChange={v => setFormData({...formData, guestCount: v})}>
                <SelectTrigger className="bg-zinc-900/50 border-zinc-800 h-14 pl-12 font-bold italic rounded-2xl focus:ring-emerald-500/50 text-white transition-all">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white font-bold italic">
                  {[1,2,3,4,5,6,7,8,10,12].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num} {num === 1 ? 'Person' : 'People'}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-1">Prefer Specific Table?</Label>
            <Select 
              value={formData.tableId} 
              onValueChange={v => {
                setFormData({...formData, tableId: v});
                handleCheckConflicts(v, formData.reservationDate, formData.startTime);
              }}
            >
              <SelectTrigger className="bg-zinc-900/50 border-zinc-800 h-14 font-bold italic rounded-2xl focus:ring-emerald-500/50 text-white transition-all">
                <SelectValue placeholder="Any Available Table" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-white font-bold italic">
                <SelectItem value="any">Any Available Table</SelectItem>
                {tables.map(table => (
                  <SelectItem key={table.id} value={table.id}>Table {table.tableNumber} ({table.capacity}p)</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Conflict Warning Message */}
        {conflict && (
          <div className={`p-4 rounded-2xl border animate-in fade-in slide-in-from-top-2 ${
            conflict.type === 'HARD' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
          }`}>
            <p className="text-xs font-bold leading-relaxed italic">
              {conflict.message}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-1">Special Requests</Label>
          <div className="relative">
            <MessageSquare size={16} className="absolute left-4 top-6 text-zinc-700" />
            <Textarea 
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
              placeholder="e.g., Anniversary, Window seat, Allergies..."
              className="bg-zinc-900/50 border-zinc-800 min-h-[120px] pl-12 pt-5 font-bold italic rounded-2xl focus:border-emerald-500/50 text-white placeholder:text-zinc-700 transition-all resize-none"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Button 
          type="submit"
          disabled={loading || conflict?.type === 'HARD'}
          className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest rounded-2xl shadow-[0_20px_40px_rgba(16,185,129,0.2)] transition-all active:scale-[0.98] group relative overflow-hidden"
        >
          {loading ? <Loader2 className="animate-spin" /> : (
            <div className="flex items-center justify-center gap-3">
              <span>{manageId ? 'Update Booking' : 'Confirm Booking'}</span>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </div>
          )}
        </Button>

        {manageId && (
          <Button 
            type="button"
            onClick={handleCancel}
            disabled={loading}
            variant="ghost"
            className="w-full h-14 text-red-500 hover:text-red-400 hover:bg-red-500/10 font-bold uppercase tracking-widest rounded-2xl transition-all"
          >
            Cancel My Reservation
          </Button>
        )}
      </div>
    </form>
  );
}
