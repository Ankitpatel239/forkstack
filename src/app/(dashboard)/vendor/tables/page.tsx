
import { prisma } from '@/lib/db';
import { requireVendor } from '@/lib/vendor';
import { 
  Users, 
  MapPin, 
  QrCode,
  Plus,
  Search,
  Grid2X2,
  Table as TableIcon
} from 'lucide-react';
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

  const totalCapacity = tables.reduce((acc, t) => acc + t.capacity, 0);
  const occupiedCount = tables.filter(t => t.status === 'OCCUPIED').length;

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 italic uppercase">Dining Space</h1>
          <p className="text-zinc-500 font-medium">Manage your tables, capacity, and QR ordering points.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
           <div className="flex items-center gap-6 px-6 py-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Total Capacity</p>
                 <div className="flex items-center gap-2">
                    <Users size={14} className="text-emerald-500" />
                    <span className="text-lg font-black text-white">{totalCapacity}</span>
                 </div>
              </div>
              <div className="w-px h-8 bg-zinc-800" />
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Live Status</p>
                 <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-lg font-black text-white">{occupiedCount}/{tables.length}</span>
                 </div>
              </div>
           </div>
           <TableActions />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tables.length === 0 ? (
          <div className="col-span-full py-32 flex flex-col items-center justify-center text-center bg-zinc-900/20 border-2 border-dashed border-zinc-900 rounded-[3rem]">
             <div className="h-20 w-20 rounded-3xl bg-zinc-900 flex items-center justify-center mb-6 text-zinc-700">
                <Grid2X2 size={40} />
             </div>
             <h3 className="text-xl font-black italic uppercase text-zinc-400 mb-2">No Tables Configured</h3>
             <p className="text-sm text-zinc-600 font-bold max-w-xs">Start by adding your first dining table to generate a unique QR code.</p>
          </div>
        ) : (
          tables.map((table) => (
            <TableCard key={table.id} table={table} vendorSlug={vendor.tenantSlug} />
          ))
        )}
      </div>
    </div>
  );
}
