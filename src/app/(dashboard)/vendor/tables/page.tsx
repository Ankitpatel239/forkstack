
import { prisma } from '@/lib/db';
import { requireVendor } from '@/lib/vendor';
import { 
  Users, 
  MapPin, 
  QrCode,
  Plus,
  Search,
  Grid2X2,
  Table as TableIcon,
  Palette
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TableCard } from './TableCard';
import { TableActions } from './TableActions';

export default async function TablesPage() {
  const vendor = await requireVendor();
  
  const tables = await prisma.table.findMany({
    where: { vendorId: vendor.id },
    orderBy: { tableNumber: 'asc' }
  });

  const totalCapacity = tables.reduce((acc: any, t: any) => acc + t.capacity, 0);
  const occupiedCount = tables.filter((t: any) => t.status === 'OCCUPIED').length;

  return (
    <div className="space-y-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-border/50">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-3 italic uppercase drop-shadow-sm">Dining Space</h1>
          <p className="text-muted-foreground font-semibold flex items-center gap-2">
            <MapPin size={16} className="text-emerald-500" /> Optimize your floor plan and digital ordering points.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
           <div className="flex items-center gap-8 px-8 py-4 bg-card/50 dark:bg-card/30 backdrop-blur-md border border-border/50 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="space-y-1.5">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">Total Capacity</p>
                 <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                       <Users size={18} className="text-emerald-500" />
                    </div>
                    <span className="text-2xl font-black text-foreground">{totalCapacity} <span className="text-[10px] text-muted-foreground uppercase tracking-widest ml-1 font-bold">Heads</span></span>
                 </div>
              </div>
              <div className="w-px h-12 bg-border/50" />
              <div className="space-y-1.5">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">Live Status</p>
                 <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center relative">
                       <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </div>
                    <span className="text-2xl font-black text-foreground">{occupiedCount}<span className="text-muted-foreground/30 mx-1">/</span><span className="text-muted-foreground/50">{tables.length}</span></span>
                 </div>
              </div>
           </div>
           <Link href="/vendor/qr-designer">
             <Button variant="outline" className="h-14 px-8 rounded-2xl border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-all shadow-lg hover:shadow-emerald-500/10">
               <Palette className="w-4 h-4 mr-2" /> Design QR Assets
             </Button>
           </Link>
           <TableActions />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tables.length === 0 ? (
          <div className="col-span-full py-40 flex flex-col items-center justify-center text-center bg-muted/5 dark:bg-muted/1 border-4 border-dashed border-border/50 rounded-[4rem] group hover:border-emerald-500/20 transition-all duration-500">
             <div className="h-24 w-24 rounded-[2rem] bg-card border border-border flex items-center justify-center mb-8 text-muted-foreground/20 group-hover:scale-110 group-hover:text-emerald-500 group-hover:border-emerald-500/20 transition-all duration-500 shadow-xl">
                <Grid2X2 size={48} />
             </div>
             <h3 className="text-2xl font-black italic uppercase text-muted-foreground mb-3 tracking-tight">Zero Floor Data</h3>
             <p className="text-sm text-muted-foreground/50 font-bold max-w-xs leading-relaxed">
               Construct your digital floor plan. Add tables to generate unique QR identification codes.
             </p>
          </div>
        ) : (
          tables.map((table: any) => (
            <TableCard key={table.id} table={table} vendorSlug={vendor.tenantSlug} />
          ))
        )}
      </div>
    </div>
  );
}
