
import { prisma } from '@/lib/db';
import { requireVendor } from '@/lib/vendor';
import { 
  Calendar, 
  Users, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock3,
  Search,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReservationStatusAction } from './ReservationStatusAction';
import { ReservationActions } from './ReservationActions';
import { getReservations } from '@/app/actions/reservations';
import { ReservationCard } from './ReservationCard';

export default async function ReservationsPage() {
  const vendor = await requireVendor();
  
  const reservations = await getReservations();

  const tables = await prisma.table.findMany({
    where: { vendorId: vendor.id, isActive: true },
    orderBy: { tableNumber: 'asc' }
  });

  const pendingCount = reservations.filter((r:any) => r.status === 'PENDING').length;
  const todayCount = reservations.filter((r: any) => {
    const today = new Date();
    return new Date(r.reservationDate).toDateString() === today.toDateString();
  }).length;

  return (
    <div className="space-y-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-2 border-b border-border/50">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-3 italic uppercase drop-shadow-sm">Reservations</h1>
          <p className="text-muted-foreground font-semibold flex items-center gap-2">
            <Calendar size={16} className="text-emerald-500" /> Manage your table bookings and guest requests.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
           <div className="flex items-center gap-4 px-4 py-2 bg-card/50 dark:bg-card/30 backdrop-blur-md border border-border/50 rounded-3xl shadow-lg">
              <div className="space-y-1.5">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">Pending Requests</p>
                 <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                       <Clock3 size={18} className="text-amber-500" />
                    </div>
                    <span className="text-2xl font-black text-foreground">{pendingCount}</span>
                 </div>
              </div>
              <div className="w-px h-12 bg-border/50" />
              <div className="space-y-1.5">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">Today's Bookings</p>
                 <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                       <CheckCircle2 size={18} className="text-emerald-500" />
                    </div>
                    <span className="text-2xl font-black text-foreground">{todayCount}</span>
                 </div>
              </div>
           </div>
           <ReservationActions 
             vendorSlug={vendor.tenantSlug} 
             vendorId={vendor.id} 
             tables={tables} 
           />
        </div>
      </div>

      <div className="grid gap-6">
        {reservations.length === 0 ? (
          <div className="py-40 flex flex-col items-center justify-center text-center bg-muted/5 border-4 border-dashed border-border/50 rounded-[4rem]">
             <div className="h-24 w-24 rounded-[2rem] bg-card border border-border flex items-center justify-center mb-8 text-muted-foreground/20 shadow-xl">
                <Calendar size={48} />
             </div>
             <h3 className="text-2xl font-black italic uppercase text-muted-foreground mb-3 tracking-tight">No Bookings Yet</h3>
             <p className="text-sm text-muted-foreground/50 font-bold max-w-xs leading-relaxed">
               When customers book tables from your public portal, they will appear here.
             </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((res: any) => (
              <ReservationCard 
                key={res.id} 
                reservation={res} 
                tables={tables} 
                vendorId={vendor.id} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
