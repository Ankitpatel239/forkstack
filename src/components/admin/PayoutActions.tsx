
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { updatePayoutStatus } from '@/app/actions/payouts';
import { PayoutStatus } from '@prisma/client';
import { toast } from 'sonner';
import { Loader2, Check, X, CreditCard } from 'lucide-react';

export function PayoutActions({ payoutId, currentStatus }: { payoutId: string, currentStatus: PayoutStatus }) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleUpdate = async (status: PayoutStatus) => {
    setIsLoading(status);
    try {
      await updatePayoutStatus(payoutId, status);
      toast.success(`Payout ${status.toLowerCase()} successfully`);
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setIsLoading(null);
    }
  };

  if (currentStatus === 'COMPLETED' || currentStatus === 'REJECTED') {
    return null;
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {currentStatus === 'PENDING' && (
        <>
          <Button 
            onClick={() => handleUpdate('APPROVED')}
            disabled={!!isLoading}
            variant="secondary" 
            className="h-8 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-none text-[9px] font-black uppercase tracking-widest"
          >
            {isLoading === 'APPROVED' ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} className="mr-1" />}
            Approve
          </Button>
          <Button 
            onClick={() => handleUpdate('REJECTED')}
            disabled={!!isLoading}
            variant="secondary" 
            className="h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 border-none text-[9px] font-black uppercase tracking-widest"
          >
            {isLoading === 'REJECTED' ? <Loader2 size={12} className="animate-spin" /> : <X size={12} className="mr-1" />}
            Reject
          </Button>
        </>
      )}
      {currentStatus === 'APPROVED' && (
        <Button 
          onClick={() => handleUpdate('COMPLETED')}
          disabled={!!isLoading}
          variant="secondary" 
          className="h-8 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-none text-[9px] font-black uppercase tracking-widest"
        >
          {isLoading === 'COMPLETED' ? <Loader2 size={12} className="animate-spin" /> : <CreditCard size={12} className="mr-1" />}
          Mark Paid
        </Button>
      )}
    </div>
  );
}
