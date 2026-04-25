
'use client';

import { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Users, 
  MessageSquare,
  Edit2,
  History,
  ChevronDown,
  Info,
  CheckCircle2,
  Clock3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReservationStatusAction } from './ReservationStatusAction';
import { ReservationDialog } from './ReservationDialog';
import { ManualOrderDialog } from '../orders/ManualOrderDialog';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { ShoppingBag } from 'lucide-react';

export function ReservationCard({ reservation, tables, vendorId }: { reservation: any, tables: any[], vendorId: string }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <div className="group bg-card/50 hover:bg-card border border-border/50 hover:border-emerald-500/20 rounded-[2.5rem] p-8 transition-all duration-300 shadow-sm hover:shadow-xl">
      <div className="flex flex-col xl:flex-row justify-between gap-8">
        <div className="flex flex-col md:flex-row gap-8 flex-1">
          {/* Status Badge & Date */}
          <div className="space-y-4 min-w-[200px]">
            <Badge className={`
              px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-[10px]
              ${reservation.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : ''}
              ${reservation.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : ''}
              ${reservation.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500 border-red-500/20' : ''}
              ${reservation.status === 'COMPLETED' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : ''}
            `}>
              {reservation.status}
            </Badge>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-foreground font-black italic uppercase tracking-tight">
                <Calendar size={14} className="text-emerald-500" />
                {new Date(reservation.reservationDate).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' })}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground font-bold text-xs">
                <Clock size={14} />
                {new Date(reservation.startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

          {/* Guest Info */}
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                <User size={18} />
              </div>
              <div>
                <p className="text-sm font-black uppercase italic tracking-tight text-foreground">{reservation.customerName}</p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1"><Phone size={10} /> {reservation.customerPhone}</span>
                  {reservation.customerEmail && <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1"><Mail size={10} /> {reservation.customerEmail}</span>}
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="px-3 py-1.5 rounded-xl bg-muted/50 border border-border/50 flex items-center gap-2">
                <Users size={12} className="text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground">{reservation.guestCount} People</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-muted/50 border border-border/50 flex items-center gap-2">
                <Info size={12} className="text-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
                  {reservation.table ? `Table ${reservation.table.tableNumber}` : 'Any Table'}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {reservation.notes && (
            <div className="flex-1 xl:max-w-md">
              <div className="bg-muted/30 p-4 rounded-2xl border border-border/50 h-full">
                <div className="flex items-center gap-2 mb-2 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                  <MessageSquare size={12} /> Special Request
                </div>
                <p className="text-xs text-muted-foreground italic font-medium leading-relaxed">"{reservation.notes}"</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 justify-center min-w-[200px]">
          <div className="flex items-center gap-2">
            <ManualOrderDialog 
              vendorId={vendorId} 
              reservation={reservation}
              trigger={
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-10 w-10 rounded-xl border-border/50 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                  title="Create Order for this Booking"
                >
                  <ShoppingBag size={16} />
                </Button>
              }
            />
            
            <ReservationStatusAction id={reservation.id} currentStatus={reservation.status} />
            
            <Button 
              onClick={() => setIsEditOpen(true)}
              variant="outline" 
              size="icon"
              className="h-10 w-10 rounded-xl border-border/50 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
            >
              <Edit2 size={16} />
            </Button>

            <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-10 w-10 rounded-xl border-border/50 hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                >
                  <History size={16} />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0a0a0a] border-zinc-900 text-white p-0 overflow-hidden rounded-[2.5rem] sm:max-w-[450px] shadow-2xl">
                <DialogHeader className="relative h-32 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex flex-row items-center px-8 border-b border-white/5 space-y-0">
                   <div className="absolute top-0 right-0 p-8 opacity-10">
                      <History size={80} />
                   </div>
                   <div className="text-left">
                      <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter mb-1">Audit Trail</DialogTitle>
                      <DialogDescription className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                         Reservation History • #{reservation.id.slice(-6)}
                      </DialogDescription>
                   </div>
                </DialogHeader>

                <div className="p-8 max-h-[65vh] overflow-y-auto custom-scrollbar relative">
                   {reservation.logs?.length > 0 ? (
                      <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500/50 before:via-blue-500/50 before:to-transparent">
                        {reservation.logs.map((log: any, idx: number) => {
                          const isStatus = log.action === 'STATUS_UPDATED';
                          const isEdit = log.action === 'EDITED';
                          const isCreated = log.action === 'CREATED';
                          
                          return (
                            <div key={log.id} className="relative pl-12 group transition-all">
                               <div className={`absolute left-0 top-1 h-9 w-9 rounded-xl border flex items-center justify-center z-10 transition-transform group-hover:scale-110 shadow-lg ${
                                 isCreated ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                                 isStatus ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
                                 'bg-zinc-500/10 border-zinc-500/20 text-zinc-400'
                               }`}>
                                  {isCreated && <CheckCircle2 size={16} />}
                                  {isStatus && <Clock3 size={16} />}
                                  {isEdit && <MessageSquare size={16} />}
                               </div>
                               
                               <div className="space-y-1">
                                  <div className="flex items-center justify-between">
                                     <span className={`text-[10px] font-black uppercase tracking-widest ${
                                       isCreated ? 'text-emerald-500' :
                                       isStatus ? 'text-blue-500' :
                                       'text-zinc-400'
                                     }`}>
                                       {log.action.replace('_', ' ')}
                                     </span>
                                     <span className="text-[9px] font-bold text-zinc-600 bg-zinc-900/50 px-2 py-0.5 rounded-full border border-white/5">
                                        {new Date(log.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                     </span>
                                  </div>
                                  <p className="text-sm font-bold text-zinc-100 leading-tight">
                                     {log.details}
                                  </p>
                                  <div className="flex items-center gap-2 pt-1">
                                     <div className="h-4 w-4 rounded-full bg-zinc-800 flex items-center justify-center text-[8px] font-black">
                                        {log.changedBy[0]}
                                     </div>
                                     <span className="text-[10px] font-bold text-zinc-500 italic">
                                        by {log.changedBy}
                                     </span>
                                  </div>
                               </div>
                            </div>
                          );
                        })}
                      </div>
                   ) : (
                      <div className="text-center py-20">
                         <div className="h-20 w-20 rounded-[2rem] bg-zinc-900 border border-white/5 flex items-center justify-center mx-auto mb-6 text-zinc-700">
                            <History size={32} />
                         </div>
                         <p className="text-zinc-500 font-black italic uppercase tracking-tighter text-lg">No history found</p>
                         <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-2">Activity will appear once changes are made.</p>
                      </div>
                   )}
                </div>
                
                <div className="p-6 border-t border-white/5 bg-zinc-900/20 text-center">
                   <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 italic">ForkStack Audit Engine v1.0</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <ReservationDialog 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen} 
        vendorId={vendorId}
        tables={tables}
        reservation={reservation}
      />
    </div>
  );
}
