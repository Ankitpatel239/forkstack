
'use client';

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableDialog } from './TableDialog';

export function TableActions() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setIsModalOpen(true)}
        className="h-14 px-8 rounded-[2rem] bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-500/20 group"
      >
        <Plus size={18} className="mr-2 group-hover:rotate-90 transition-transform" /> 
        Add New Table
      </Button>

      <TableDialog open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
