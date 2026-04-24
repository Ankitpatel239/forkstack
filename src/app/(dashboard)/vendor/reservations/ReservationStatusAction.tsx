
'use client';

import { useState } from 'react';
import { Check, X, CheckCircle, Loader2, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { updateReservationStatus } from '@/app/actions/reservations';
import { toast } from 'sonner';
import { ReservationStatus } from '@prisma/client';

export function ReservationStatusAction({ id, currentStatus }: { id: string, currentStatus: ReservationStatus }) {
  const [loading, setLoading] = useState<ReservationStatus | null>(null);

  const handleStatusUpdate = async (status: ReservationStatus) => {
    setLoading(status);
    try {
      await updateReservationStatus(id, status);
      toast.success(`Reservation marked as ${status.toLowerCase()}`);
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setLoading(null);
    }
  };

  if (currentStatus === 'CANCELLED' || currentStatus === 'COMPLETED') {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleStatusUpdate('PENDING')}
        disabled={loading !== null}
        className="border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-white font-black uppercase tracking-widest text-[10px] h-11 px-6 rounded-2xl"
      >
        {loading === 'PENDING' ? <Loader2 className="animate-spin" /> : (
          <div className="flex items-center gap-2">
            <RefreshCcw size={14} /> Revive Request
          </div>
        )}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {currentStatus === 'PENDING' && (
        <>
          <Button
            size="sm"
            onClick={() => handleStatusUpdate('CONFIRMED')}
            disabled={loading !== null}
            className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-[10px] h-11 px-6 rounded-2xl shadow-lg shadow-emerald-500/10"
          >
            {loading === 'CONFIRMED' ? <Loader2 className="animate-spin" /> : (
              <div className="flex items-center gap-2">
                <Check size={14} /> Confirm
              </div>
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStatusUpdate('CANCELLED')}
            disabled={loading !== null}
            className="border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white font-black uppercase tracking-widest text-[10px] h-11 px-6 rounded-2xl"
          >
            {loading === 'CANCELLED' ? <Loader2 className="animate-spin" /> : (
              <div className="flex items-center gap-2">
                <X size={14} /> Decline
              </div>
            )}
          </Button>
        </>
      )}

      {currentStatus === 'CONFIRMED' && (
        <Button
          size="sm"
          onClick={() => handleStatusUpdate('COMPLETED')}
          disabled={loading !== null}
          className="bg-blue-500 hover:bg-blue-400 text-white font-black uppercase tracking-widest text-[10px] h-11 px-6 rounded-2xl shadow-lg shadow-blue-500/10"
        >
          {loading === 'COMPLETED' ? <Loader2 className="animate-spin" /> : (
            <div className="flex items-center gap-2">
              <CheckCircle size={14} /> Mark Completed
            </div>
          )}
        </Button>
      )}
    </div>
  );
}
