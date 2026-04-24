
'use client';

import { useState, useEffect, Suspense } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableDialog } from './TableDialog';
import { useSearchParams, useRouter } from 'next/navigation';

function TableActionsContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      setIsModalOpen(true);
    }
  }, [searchParams]);

  const handleOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open && searchParams.get('action') === 'new') {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('action');
      const queryString = params.toString();
      router.replace(`/vendor/tables${queryString ? `?${queryString}` : ''}`);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsModalOpen(true)}
        className="h-14 px-8 rounded-[2rem] bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-500/20 group"
      >
        <Plus size={18} className="mr-2 group-hover:rotate-90 transition-transform" /> 
        Add New Table
      </Button>

      <TableDialog open={isModalOpen} onOpenChange={handleOpenChange} />
    </>
  );
}

export function TableActions() {
  return (
    <Suspense fallback={<Button disabled className="h-14 px-8 rounded-[2rem] bg-emerald-500/50 text-zinc-950 font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-500/10">Loading...</Button>}>
      <TableActionsContent />
    </Suspense>
  );
}
