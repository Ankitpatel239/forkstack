
import { prisma } from '@/lib/db';
import { 
  Banknote, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MoreHorizontal,
  ArrowUpRight,
  ExternalLink,
  Building2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PayoutActions } from '@/components/admin/PayoutActions';

export default async function AdminPayoutsPage() {
  const payouts = await prisma.payout.findMany({
    include: { vendor: true },
    orderBy: { requestedAt: 'desc' }
  });

  const pendingCount = payouts.filter(p => p.status === 'PENDING').length;
  const totalAmount = payouts.reduce((acc: number, p: any) => acc + (p.amount || 0), 0);

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 italic uppercase">Payout Settlement Hub</h1>
          <p className="text-zinc-500 font-medium">Global management of vendor fund disbursement and settlement pipelines.</p>
        </div>
        <div className="flex items-center gap-3">
           <Badge className="bg-orange-500/10 text-orange-500 border-none px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em]">
             {pendingCount} Pending Requests
           </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
         {[
           { label: 'Total Volume', val: `₹${totalAmount.toLocaleString()}`, icon: Banknote, color: 'blue' },
           { label: 'Pending Processing', val: pendingCount, icon: Clock, color: 'orange' },
           { label: 'System Health', val: 'Operational', icon: CheckCircle2, color: 'emerald' },
         ].map((s: any, i: number) => (
           <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                <s.icon size={60} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">{s.label}</p>
              <h3 className="text-2xl font-black text-white italic tracking-tighter">{s.val}</h3>
           </div>
         ))}
      </div>

      {/* Payout Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
         <div className="p-8 border-b border-zinc-800 bg-zinc-950/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
               <h2 className="text-xl font-black text-white italic tracking-tight uppercase">Settlement Ledger</h2>
               <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest leading-none">Audit and process all outgoing vendor payments.</p>
            </div>
            <div className="flex items-center gap-3">
               <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl px-4 h-11 w-64 text-zinc-500">
                  <Search size={16} />
                  <input type="text" placeholder="Search Vendor..." className="bg-transparent border-none outline-none text-xs ml-2 w-full text-white font-sans" />
               </div>
               <Button variant="outline" className="rounded-xl border-zinc-800 bg-zinc-950 h-11 px-4 text-zinc-500">
                  <Filter size={16} />
               </Button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
               <thead className="bg-zinc-950/40 text-[10px] uppercase font-black tracking-[0.2em] text-zinc-700 border-b border-zinc-800">
                  <tr>
                     <th className="px-8 py-5">Vendor Node</th>
                     <th className="px-8 py-5">Quantum</th>
                     <th className="px-8 py-5">Temporal Status</th>
                     <th className="px-8 py-5">Fulfillment Details</th>
                     <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-zinc-900/50">
                  {payouts.length === 0 ? (
                    <tr>
                       <td colSpan={5} className="py-24 text-center">
                          <div className="flex flex-col items-center gap-4 text-zinc-700">
                             <AlertCircle size={48} className="opacity-10" />
                             <p className="font-black uppercase tracking-widest text-xs">No payout requests in the current pipeline</p>
                          </div>
                       </td>
                    </tr>
                  ) : (
                    payouts.map((p: any) => (
                       <tr key={p.id} className="hover:bg-zinc-800/10 transition-colors group">
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center text-[10px] font-black group-hover:bg-zinc-700 transition-colors">
                                   {p.vendor.businessName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                   <p className="text-sm font-black text-white italic tracking-tight uppercase">{p.vendor.businessName}</p>
                                   <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{p.vendor.businessEmail}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="space-y-1">
                                <p className="text-base font-black text-white italic tracking-tighter">₹{p.amount.toLocaleString()}</p>
                                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">ID: #{p.id.slice(-6).toUpperCase()}</p>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${
                                  p.status === 'COMPLETED' ? 'bg-emerald-500' : 
                                  p.status === 'REJECTED' ? 'bg-red-500' : 
                                  p.status === 'PENDING' ? 'bg-orange-500 animate-pulse' : 'bg-blue-500'
                                }`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${
                                  p.status === 'COMPLETED' ? 'text-emerald-500' : 
                                  p.status === 'REJECTED' ? 'text-red-500' : 
                                  p.status === 'PENDING' ? 'text-orange-500' : 'text-blue-500'
                                }`}>{p.status}</span>
                             </div>
                             <p className="text-[9px] text-zinc-600 mt-1 font-bold">{new Date(p.requestedAt).toLocaleDateString()}</p>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-2 text-zinc-400 group-hover:text-zinc-200 transition-colors">
                                <Building2 size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Bank Details Attached</span>
                             </div>
                             {p.transactionId && (
                               <p className="text-[9px] text-zinc-600 mt-1 truncate max-w-[150px]">Ref: {p.transactionId}</p>
                             )}
                          </td>
                          <td className="px-8 py-6 text-right">
                             <div className="flex items-center justify-end gap-2">
                                <PayoutActions payoutId={p.id} currentStatus={p.status} />
                                <button className="h-8 w-8 flex items-center justify-center hover:bg-zinc-800 rounded-lg text-zinc-700 hover:text-white transition-all">
                                   <MoreHorizontal size={18} />
                                </button>
                             </div>
                          </td>
                       </tr>
                    ))
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
