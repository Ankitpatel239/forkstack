
'use client';

import { useState } from 'react';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Image as ImageIcon 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ItemDialog } from './ItemDialog';
import { toggleMenuItemAvailability, deleteMenuItem } from '@/app/actions/menu';
import { toast } from 'sonner';

import { MenuItem, MenuCategory } from '@/types/menu';

export function MenuItemRow({ item, categories }: { item: MenuItem, categories: MenuCategory[] }) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const onToggle = async () => {
    try {
      await toggleMenuItemAvailability(item.id, item.isAvailable);
      toast.success(item.isAvailable ? 'Item marked as unavailable' : 'Item is now available');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const onDelete = async () => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await deleteMenuItem(item.id);
      toast.success('Item removed from menu');
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  return (
    <>
      <tr className="hover:bg-muted/30 transition-colors group border-b border-border/50 last:border-0">
        <td className="px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0">
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  className="w-full h-full object-cover" 
                  alt={item.name} 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <ImageIcon size={20} className="text-muted-foreground/40" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground truncate mb-0.5">{item.name}</p>
              <p className="text-[10px] text-muted-foreground truncate font-medium max-w-[200px]">{item.description || 'No description provided'}</p>
            </div>
          </div>
        </td>
        <td className="px-6 py-5">
          <Badge variant="outline" className="border-border text-muted-foreground font-bold uppercase text-[9px] px-3 py-1 bg-muted/50">
            {item.category?.name || 'No Category'}
          </Badge>
        </td>
        <td className="px-6 py-5">
          <span className="text-sm font-black text-foreground">₹{item.price.toFixed(2)}</span>
        </td>
        <td className="px-6 py-5">
          <button onClick={onToggle} className="flex items-center gap-2 group/status">
            <div className={`h-2 w-2 rounded-full transition-all ${item.isAvailable ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500'} group-hover/status:scale-150`} />
            <span className={`text-[11px] font-bold uppercase tracking-tight ${item.isAvailable ? 'text-emerald-500' : 'text-red-500'}`}>
              {item.isAvailable ? 'Live' : 'Sold Out'}
            </span>
          </button>
        </td>
        <td className="px-6 py-5 text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-all">
                <MoreHorizontal size={18} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border text-foreground w-40">
              <DropdownMenuLabel className="text-[10px] font-black uppercase text-muted-foreground">Management</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem 
                onClick={() => setIsEditOpen(true)}
                className="focus:bg-muted cursor-pointer text-xs font-bold"
              >
                <Edit className="w-4 h-4 mr-2" /> Edit Item
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onToggle}
                className="focus:bg-muted cursor-pointer text-xs font-bold"
              >
                {item.isAvailable ? <X className="w-4 h-4 mr-2 text-red-500" /> : <Check className="w-4 h-4 mr-2 text-emerald-500" />}
                {item.isAvailable ? 'Mark Sold Out' : 'Mark Available'}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem 
                onClick={onDelete}
                className="focus:bg-red-500/10 cursor-pointer text-red-500 text-xs font-bold"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete Item
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>

      <ItemDialog 
        item={item} 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen} 
        categories={categories}
      />
    </>
  );
}
