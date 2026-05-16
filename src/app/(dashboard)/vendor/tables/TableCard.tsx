
'use client';

import { useState } from 'react';
import { 
  Users, 
  MapPin, 
  QrCode, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  ExternalLink,
  Download,
  CheckCircle2,
  XCircle,
  Clock
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
import { deleteTable, updateTable } from '@/app/actions/tables';
import { toast } from 'sonner';
import { TableDialog } from './TableDialog';
import { Button } from '@/components/ui/button';

export function TableCard({ table, vendorSlug }: { table: any, vendorSlug: string }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    if (!confirm('Are you sure you want to delete this table?')) return;
    try {
      await deleteTable(table.id);
      toast.success('Table deleted successfully');
    } catch (error) {
      toast.error('Failed to delete table');
    }
  };

  const toggleStatus = async () => {
    const nextStatus = table.status === 'AVAILABLE' ? 'OCCUPIED' : 'AVAILABLE';
    try {
      await updateTable(table.id, { status: nextStatus });
      toast.success(`Table marked as ${nextStatus.toLowerCase()}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`${window.location.origin}/order/${vendorSlug}/${table.id}`)}`;
  const statusIcons: any = {
    AVAILABLE: CheckCircle2,
    OCCUPIED: Users,
    RESERVED: Clock,
    MAINTENANCE: XCircle
  };
  const StatusIcon = statusIcons[table.status as keyof typeof statusIcons] || CheckCircle2;

  const statusColorMap: Record<string, string> = {
    AVAILABLE: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    OCCUPIED: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    RESERVED: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    MAINTENANCE: 'text-red-500 bg-red-500/10 border-red-500/20'
  };
  const statusColors = statusColorMap[table.status] || 'text-muted-foreground bg-muted border-border';

  return (
    <div className="bg-card/50 dark:bg-card/30 border border-border/50 rounded-[2.5rem] p-8 hover:border-emerald-500/50 hover:bg-card/80 dark:hover:bg-card/50 transition-all duration-500 group relative overflow-hidden backdrop-blur-md shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1">
      {/* Background Decor */}
      <div className="absolute -top-10 -right-10 h-32 w-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all duration-700" />

      
      <div className="flex items-start justify-between mb-10">
        <div className="space-y-3">
          <Badge variant="outline" className={`font-black uppercase tracking-widest text-[8px] px-3 py-1 rounded-md border-2 shadow-sm transition-all group-hover:scale-105 ${statusColors}`}>
            {table.status}
          </Badge>
          <h3 className="text-4xl font-black italic uppercase text-foreground leading-none tracking-tighter group-hover:text-emerald-500 transition-colors drop-shadow-md">
            {table.tableNumber}
          </h3>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-10 w-10 flex items-center justify-center rounded-full bg-muted/60 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted hover:border-emerald-500/30 transition-all duration-300 shadow-sm self-center">
              <MoreVertical size={18} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-xl border-border text-foreground w-56 rounded-[2rem] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in-95">
            <DropdownMenuLabel className="text-[10px] font-black uppercase text-muted-foreground/50 px-4 py-2 tracking-widest">Table Control</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/50 my-2" />
            <DropdownMenuItem onClick={() => setIsEditOpen(true)} className="rounded-xl focus:bg-emerald-500/10 focus:text-emerald-500 cursor-pointer font-bold text-xs py-4 px-4 transition-colors">
              <Edit3 size={16} className="mr-3" /> Edit Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleStatus} className="rounded-xl focus:bg-emerald-500/10 focus:text-emerald-500 cursor-pointer font-bold text-xs py-4 px-4 transition-colors">
              <StatusIcon size={16} className="mr-3" /> Mark as {table.status === 'AVAILABLE' ? 'Occupied' : 'Available'}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/50 my-2" />
            <DropdownMenuItem onClick={() => window.open(qrUrl, '_blank')} className="rounded-xl focus:bg-emerald-500/10 focus:text-emerald-500 cursor-pointer font-bold text-xs py-4 px-4 transition-colors">
              <Download size={16} className="mr-3" /> Get QR Code
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="rounded-xl focus:bg-red-500/10 text-red-500 cursor-pointer font-bold text-xs py-4 px-4 transition-colors">
              <Trash2 size={16} className="mr-3" /> Remove Table
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="relative aspect-square rounded-[2rem] bg-white p-6 mb-8 group-hover:scale-[1.02] transition-transform shadow-2xl group-hover:shadow-emerald-500/5">
         <img 
           src={qrUrl} 
           alt={`Table ${table.tableNumber} QR`} 
           className="w-full h-full object-contain mix-blend-multiply"
         />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 rounded-[2rem] backdrop-blur-sm px-6 text-center">
            <div className="space-y-4">
               <QrCode size={32} className="text-emerald-500 mx-auto" />
               <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Scan to Open Digital Menu</p>
               <Button size="sm" className="h-9 rounded-xl bg-card border border-border text-[10px] font-black uppercase tracking-widest px-4 hover:bg-muted text-foreground" onClick={() => window.open(`/order/${vendorSlug}/${table.id}`, '_blank')}>
                  <ExternalLink size={12} className="mr-2" /> Preview
               </Button>
            </div>
          </div>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 bg-muted/30 dark:bg-muted/10 rounded-2xl p-4 border border-border/50 group-hover:border-emerald-500/20 transition-all duration-500">
          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-2 whitespace-nowrap">Capacity</p>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Users size={14} className="text-emerald-500" />
            </div>
            <span className="text-xs font-black text-foreground drop-shadow-sm whitespace-nowrap">{table.chairCount} Chairs</span>
          </div>
        </div>
        <div className="flex-1 bg-muted/30 dark:bg-muted/10 rounded-2xl p-4 border border-border/50 group-hover:border-emerald-500/20 transition-all duration-500 min-w-0">
          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-2 whitespace-nowrap">Location</p>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
              <MapPin size={14} className="text-blue-500" />
            </div>
            <span className="text-xs font-black text-foreground truncate drop-shadow-sm">{table.location || 'Main'}</span>
          </div>
        </div>
      </div>

      <TableDialog table={table} open={isEditOpen} onOpenChange={setIsEditOpen} />
    </div>
  );
}
