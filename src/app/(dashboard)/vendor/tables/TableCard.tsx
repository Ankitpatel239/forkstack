
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
  const statusColors = statusColorMap[table.status] || 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';

  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-8 hover:border-emerald-500/30 transition-all group relative overflow-hidden backdrop-blur-sm">
      {/* Background Decor */}
      <div className="absolute -top-10 -right-10 h-32 w-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all" />
      
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <Badge variant="outline" className={`font-black uppercase tracking-widest text-[8px] px-3 py-1 rounded-full ${statusColors}`}>
            {table.status}
          </Badge>
          <h3 className="text-2xl font-black italic uppercase text-white tracking-tighter">{table.tableNumber}</h3>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white transition-all">
              <MoreVertical size={18} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-zinc-950 border-zinc-900 text-white w-48 rounded-2xl p-2 shadow-2xl">
            <DropdownMenuLabel className="text-[10px] font-black uppercase text-zinc-600 px-3 py-2">Table Control</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-900" />
            <DropdownMenuItem onClick={() => setIsEditOpen(true)} className="rounded-xl focus:bg-zinc-900 cursor-pointer font-bold text-xs py-3">
              <Edit3 size={16} className="mr-2" /> Edit Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleStatus} className="rounded-xl focus:bg-zinc-900 cursor-pointer font-bold text-xs py-3">
              <StatusIcon size={16} className="mr-2" /> Mark as {table.status === 'AVAILABLE' ? 'Occupied' : 'Available'}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-900" />
            <DropdownMenuItem onClick={() => window.open(qrUrl, '_blank')} className="rounded-xl focus:bg-zinc-900 cursor-pointer font-bold text-xs py-3">
              <Download size={16} className="mr-2" /> Get QR Code
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="rounded-xl focus:bg-red-500/10 text-red-500 cursor-pointer font-bold text-xs py-3">
              <Trash2 size={16} className="mr-2" /> Remove Table
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
         <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-950/80 rounded-[2rem] backdrop-blur-sm px-6 text-center">
            <div className="space-y-4">
               <QrCode size={32} className="mx-auto text-emerald-500" />
               <p className="text-[10px] font-black uppercase tracking-widest text-white">Scan to Open Digital Menu</p>
               <Button size="sm" className="h-9 rounded-xl bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase tracking-widest px-4" onClick={() => window.open(`/order/${vendorSlug}/${table.id}`, '_blank')}>
                  <ExternalLink size={12} className="mr-2" /> Preview
               </Button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-950/50 rounded-2xl p-4 border border-zinc-900">
          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-1">Capacity</p>
          <div className="flex items-center gap-2">
            <Users size={14} className="text-zinc-500" />
            <span className="text-sm font-black text-white">{table.chairCount} Chairs</span>
          </div>
        </div>
        <div className="bg-zinc-950/50 rounded-2xl p-4 border border-zinc-900">
          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-1">Location</p>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-zinc-500" />
            <span className="text-sm font-black text-white truncate">{table.location || 'Main Hall'}</span>
          </div>
        </div>
      </div>

      <TableDialog table={table} open={isEditOpen} onOpenChange={setIsEditOpen} />
    </div>
  );
}
