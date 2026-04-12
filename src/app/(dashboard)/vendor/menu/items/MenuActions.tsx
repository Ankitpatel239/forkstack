'use client';

import { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function MenuActions() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // This is a mockup of the "Add Item" functionality.
  // In a real app, we would use Server Actions.
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setIsAddModalOpen(false);
      toast.success('Item added successfully');
      // In a real app, we would refresh the page using router.refresh()
    }, 1000);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 h-11 w-full md:w-96 text-zinc-500 focus-within:border-emerald-500/50 transition-colors">
        <Search size={18} />
        <input 
          type="text" 
          placeholder="Search items, categories..." 
          className="bg-transparent border-none focus:ring-0 text-sm flex-1 outline-none text-white" 
        />
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" className="rounded-xl border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 font-bold h-11">
          <Filter className="w-4 h-4 mr-2" /> Filters
        </Button>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-xs h-11 px-6 shadow-lg shadow-emerald-500/20">
              <Plus className="w-5 h-5 mr-1" /> Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Add Menu Item</DialogTitle>
              <DialogDescription className="text-zinc-500">
                Create a new item for your digital menu.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddItem} className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-zinc-500">Item Name</Label>
                  <Input id="name" placeholder="e.g. Avocado Toast" className="bg-zinc-950 border-zinc-800" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-xs font-black uppercase tracking-widest text-zinc-500">Price ($)</Label>
                  <Input id="price" type="number" step="0.01" placeholder="12.99" className="bg-zinc-950 border-zinc-800" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-xs font-black uppercase tracking-widest text-zinc-500">Category</Label>
                <Select>
                  <SelectTrigger className="bg-zinc-950 border-zinc-800">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="drinks">Drinks</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="desc" className="text-xs font-black uppercase tracking-widest text-zinc-500">Description</Label>
                <textarea 
                  id="desc" 
                  rows={3}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
                  placeholder="Describe the ingredients or preparation..."
                />
              </div>

              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-xs h-12"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Create Menu Item'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
