
'use client';

import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ItemDialog } from './ItemDialog';
import { MenuCategory } from '@/types/menu';

export default function MenuActions({ categories }: { categories: MenuCategory[] }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 h-11 w-full md:w-96 text-muted-foreground focus-within:border-emerald-500/50 transition-colors">
        <Search size={18} />
        <input 
          type="text" 
          placeholder="Search items, categories..." 
          className="bg-transparent border-none focus:ring-0 text-sm flex-1 outline-none text-foreground font-medium" 
        />
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" className="rounded-xl border-border bg-muted/50 hover:bg-muted text-muted-foreground font-bold h-11">
          <Filter className="w-4 h-4 mr-2" /> Filters
        </Button>

        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-xs h-11 px-6 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-5 h-5 mr-1" /> Add New Item
        </Button>

        <ItemDialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen} categories={categories} />
      </div>
    </div>
  );
}
