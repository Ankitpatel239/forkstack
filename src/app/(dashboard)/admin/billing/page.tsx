import { prisma } from '@/lib/db';
export const dynamic = 'force-dynamic';
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Filter, 
  Download,
  Calendar,
  Wallet,
  BadgeCheck,
  History,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default async function AdminBillingPage() {
  const payments = await prisma.subscriptionPayment.findMany({
    include: { vendor: true },
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  const totalRevenue = payments.reduce((acc: number, p: any) => acc + (p.amount || 0), 0);

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 italic">Platform Billing Ledger</h1>
          <p className="text-zinc-500 font-medium">Global tracking of incoming subscription capital and renewal pipelines.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-xl border-zinc-800 bg-zinc-900 h-12 px-6 text-zinc-400 font-black uppercase tracking-widest text-[10px]">
             <Download className="w-4 h-4 mr-2" /> Financial Audit Export
           </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
         {[
           { label: 'Total Settled', val: `$${totalRevenue.toLocaleString()}`, icon: Wallet, color: 'emerald' },
           { label: 'Active MRR', val: '$124.5k', icon: CreditCard, color: 'blue' },
           { label: 'Renewal Rate', val: '94.2%', icon: BadgeCheck, color: 'purple' },
           { label: 'Pending Payouts', val: '$4,200', icon: History, color: 'orange' },
         ].map((s: any, i: number) => (
           <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                <s.icon size={60} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">{s.label}</p>
              <h3 className="text-2xl font-black text-white italic tracking-tighter">{s.val}</h3>
           </div>
         ))}
      </div>

      <div className="bg-zinc-900 shadow-2xl border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
         <div className="p-8 border-b border-zinc-800 bg-zinc-950/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
               <h2 className="text-xl font-black text-white italic tracking-tight uppercase">Platform Cashflow Audit</h2>
               <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest leading-none">Complete transaction history for all vendor nodes.</p>
            </div>
            <div className="flex items-center gap-3">
               <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl px-4 h-11 w-64 text-zinc-500">
                  <Search size={16} />
                  <input type="text" placeholder="Search Transaction ID..." className="bg-transparent border-none outline-none text-xs ml-2 w-full text-white font-sans" />
               </div>
               <Button variant="outline" className="rounded-xl border-zinc-800 bg-zinc-950 h-11 px-4 text-zinc-500 group">
                  <Filter size={16} className="group-hover:text-emerald-500 transition-colors" />
               </Button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
               <thead className="bg-zinc-950/40 text-[10px] uppercase font-black tracking-[0.2em] text-zinc-700 border-b border-zinc-800">
                  <tr>
                     <th className="px-8 py-5">Transaction Node</th>
                     <th className="px-8 py-5">Partner Account</th>
                     <th className="px-8 py-5">Service Tier</th>
                     <th className="px-8 py-5">Fiscal Impact</th>
                     <th className="px-8 py-5 text-right italic font-sans lowercase">Audit</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-zinc-900/50">
                  {payments.length === 0 ? (
                    <tr>
                       <td colSpan={5} className="py-24 text-center">
                          <div className="flex flex-col items-center gap-4 text-zinc-700">
                             <CreditCard size={48} className="opacity-10" />
                             <p className="font-black uppercase tracking-widest text-xs">No transactions recorded in the current ledger</p>
                          </div>
                       </td>
                    </tr>
                  ) : (
                    payments.map((p: any) => (
                       <tr key={p.id} className="hover:bg-zinc-800/10 transition-colors group">
                          <td className="px-8 py-6">
                             <div className="space-y-1">
                                <p className="text-sm font-black text-white italic tracking-tight uppercase">#{p.stripeId?.slice(-8).toUpperCase() || p.id.slice(-8).toUpperCase()}</p>
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{new Date(p.createdAt).toLocaleDateString()} • {new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-zinc-800 flex items-center justify-center text-[10px] font-black">
                                   {p.vendor.businessName.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-xs font-bold text-zinc-300">{p.vendor.businessName}</span>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <Badge className="bg-zinc-800 text-zinc-400 border-none text-[9px] font-black uppercase tracking-widest italic">{p.plan}</Badge>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-2 text-emerald-500">
                                <ArrowUpRight size={14} />
                                <span className="text-base font-black italic tracking-tighter">${p.amount.toFixed(2)}</span>
                             </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <button className="h-8 w-8 flex items-center justify-center hover:bg-zinc-800 rounded-lg text-zinc-700 hover:text-white transition-all">
                                <MoreHorizontal size={18} />
                             </button>
                          </td>
                       </tr>
                    ))
                  )}
               </tbody>
            </table>
         </div>
         
         <div className="p-6 bg-zinc-950/20 border-t border-zinc-800 text-center">
            <Button variant="link" className="text-zinc-700 hover:text-white text-[10px] font-black uppercase tracking-widest italic no-underline">
               Explore multi-year archival ledger history
            </Button>
         </div>
      </div>
    </div>
  );
}
