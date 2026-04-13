
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Banknote, X, CheckCircle2, Loader2 } from 'lucide-react';
import { requestPayout } from '@/app/actions/payouts';
import { toast } from 'sonner';

export function PayoutRequestButton({ vendorId, availableBalance }: { vendorId: string, availableBalance: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState(availableBalance);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || amount > availableBalance) {
      toast.error('Invalid amount');
      return;
    }

    setIsLoading(true);
    try {
      await requestPayout(vendorId, amount);
      setIsSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
      }, 2000);
    } catch (error) {
      toast.error('Failed to request payout');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        disabled={availableBalance <= 0}
        className="rounded-xl bg-emerald-500 hover:bg-emerald-600 h-12 px-6 text-black font-black uppercase tracking-widest text-[10px]"
      >
        <Banknote className="w-4 h-4 mr-2" /> Request Payout
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsOpen(false)} />
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            {isSuccess ? (
              <div className="p-12 text-center space-y-4">
                <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} className="animate-bounce" />
                </div>
                <h3 className="text-2xl font-black text-white italic uppercase">Request Sent!</h3>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Our team will review your settlement request shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="p-8 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/20">
                  <h3 className="text-lg font-black text-white italic uppercase tracking-tight">Settlement Request</h3>
                  <button type="button" onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white"><X size={20} /></button>
                </div>
                <div className="p-8 space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Maximum Withdrawal</label>
                    <p className="text-2xl font-black text-white italic tracking-tighter">₹{availableBalance.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Withdrawal Amount (₹)</label>
                    <input 
                      type="number" 
                      value={amount} 
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl h-14 px-6 text-white font-black italic text-xl focus:border-emerald-500 transition-colors outline-none"
                      max={availableBalance}
                      min={1}
                      required
                    />
                  </div>
                  <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 flex gap-3">
                    <div className="text-emerald-500 shrink-0"><CheckCircle2 size={16} /></div>
                    <p className="text-[9px] text-emerald-500/70 font-bold uppercase tracking-widest leading-relaxed">
                      Settlements are typically processed within 24-48 hours to your registered bank account.
                    </p>
                  </div>
                </div>
                <div className="p-8 pt-0">
                  <Button 
                    type="submit" 
                    disabled={isLoading || amount <= 0 || amount > availableBalance}
                    className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-black font-black uppercase tracking-widest text-[12px] rounded-2xl"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Distribution'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
