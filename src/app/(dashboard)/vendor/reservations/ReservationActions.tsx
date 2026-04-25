
'use client';

import { useEffect, useState } from 'react';
import { Plus, Share2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { toast } from 'sonner';
import { ReservationDialog } from './ReservationDialog';

export function ReservationActions({ vendorSlug, vendorId, tables }: { vendorSlug: string, vendorId: string, tables: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const bookingLink = origin ? `${origin}/${vendorSlug}/reserve` : '';

  const copyToClipboard = () => {
    if (!bookingLink) return;
    navigator.clipboard.writeText(bookingLink);
    setCopied(true);
    toast.success('Booking link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-4">
      <Button 
        onClick={copyToClipboard}
        variant="outline"
        className="h-14 px-4 rounded-2xl border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-all shadow-lg hover:shadow-emerald-500/10"
      >
        {copied ? <Check className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
        Share Booking Link
      </Button>

      <Button 
        onClick={() => setIsModalOpen(true)}
        className="h-14 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-500/20 group"
      >
        <Plus size={18} className="mr-2 group-hover:rotate-90 transition-transform" /> 
        Add Manual Booking
      </Button>

      <ReservationDialog 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        vendorId={vendorId}
        tables={tables}
      />
    </div>
  );
}
