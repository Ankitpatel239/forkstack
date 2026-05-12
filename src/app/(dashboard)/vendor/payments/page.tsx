
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Banknote,
  MoreHorizontal,
  History,
  TrendingUp,
  Download,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { redirect } from 'next/navigation';
import { PayoutRequestButton } from '@/components/vendor/PayoutRequestButton';
import { ExportLedgerButton } from '@/components/vendor/ExportLedgerButton';

export default async function VendorPaymentsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'VENDOR_OWNER') {
    redirect('/auth/login');
  }

  // Using raw SQL to bypass stale enum validation for subscriptionPlan
  const vendorsRaw = await prisma.$queryRawUnsafe<any[]>(
    `SELECT * FROM "VendorProfile" WHERE "ownerId" = $1 LIMIT 1`,
    user.id
  );
  const vendorRaw = vendorsRaw[0];

  if (!vendorRaw) {
    return <div>Vendor profile not found.</div>;
  }

  const [payments, payouts, subscriptionPayments] = await Promise.all([
    prisma.payment.findMany({
      where: { vendorId: vendorRaw.id },
      orderBy: { createdAt: 'desc' },
      take: 10
    }),
    prisma.payout.findMany({
      where: { vendorId: vendorRaw.id },
      orderBy: { requestedAt: 'desc' }
    }),
    prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM "SubscriptionPayment" WHERE "vendorId" = $1 ORDER BY "createdAt" DESC`,
      vendorRaw.id
    )
  ]);

  const vendor = {
    ...vendorRaw,
    payments,
    payouts,
    subscriptionPayments
  };

  if (!vendor) {
    return <div>Vendor profile not found.</div>;
  }

  // Calculate Balances
  const totalRevenue = await prisma.payment.aggregate({
    where: { vendorId: vendor.id, status: 'COMPLETED' },
    _sum: { amount: true }
  }).then((res: any) => res._sum.amount || 0);

  const totalWithdrawn = await prisma.payout.aggregate({
    where: { vendorId: vendor.id, status: 'COMPLETED' },
    _sum: { amount: true }
  }).then((res: any) => res._sum.amount || 0);

  const pendingPayouts = await prisma.payout.aggregate({
    where: { 
      vendorId: vendor.id, 
      status: { in: ['PENDING', 'APPROVED', 'PROCESSING'] } 
    },
    _sum: { amount: true }
  }).then((res: any) => res._sum.amount || 0);

  const availableBalance = totalRevenue - totalWithdrawn - pendingPayouts;
  
  // Calculate subscription remaining days
  const daysRemaining = vendorRaw.subscriptionEnd 
    ? Math.max(0, Math.ceil((new Date(vendorRaw.subscriptionEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 italic uppercase">Financial Dashboard</h1>
          <p className="text-zinc-500 font-medium">Track your revenue, manage payouts, and analyze fiscal growth.</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportLedgerButton 
            payments={payments} 
            payouts={payouts} 
            subscriptionPayments={subscriptionPayments} 
          />
          <PayoutRequestButton vendorId={vendor.id} availableBalance={availableBalance} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-5">
        {[
          { label: 'Available Balance', val: `₹${availableBalance.toLocaleString()}`, icon: Wallet, color: 'emerald' },
          { label: 'Total Revenue', val: `₹${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'blue' },
          { label: 'Pending Payouts', val: `₹${pendingPayouts.toLocaleString()}`, icon: Clock, color: 'orange' },
          { label: 'Total Withdrawn', val: `₹${totalWithdrawn.toLocaleString()}`, icon: History, color: 'zinc' },
          { label: 'Subscription Pulse', val: `${daysRemaining} Days Left`, icon: Zap, color: 'purple' },
        ].map((s: any, i: number) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
              <s.icon size={60} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">{s.label}</p>
            <h3 className="text-xl font-black text-white italic tracking-tighter">{s.val}</h3>
          </div>
        ))}
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Recent Transactions */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-zinc-800 bg-zinc-950/20 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-white italic tracking-widest uppercase">Direct Revenue</h2>
              <p className="text-[9px] text-zinc-600 font-black uppercase tracking-tighter">Last 10 customer payments</p>
            </div>
            <ArrowUpRight className="text-emerald-500" size={20} />
          </div>
          <div className="divide-y divide-zinc-800">
            {vendor.payments.length === 0 ? (
              <div className="p-10 text-center text-zinc-500 text-[10px] font-black uppercase tracking-widest">No transactions yet</div>
            ) : (
              vendor.payments.map((p: any) => (
                <div key={p.id} className="p-5 flex items-center justify-between hover:bg-zinc-800/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <ArrowDownRight size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white italic uppercase tracking-tight">#{p.id.slice(-8).toUpperCase()}</p>
                      <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{new Date(p.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-emerald-500 italic">₹{p.amount.toFixed(2)}</p>
                    <Badge variant="outline" className="text-[8px] h-4 border-emerald-500/30 text-emerald-500 font-black px-1">{p.status}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Payout History */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-zinc-800 bg-zinc-950/20 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-white italic tracking-widest uppercase">Payout Requests</h2>
              <p className="text-[9px] text-zinc-600 font-black uppercase tracking-tighter">Settlement history and status</p>
            </div>
            <Banknote className="text-orange-500" size={20} />
          </div>
          <div className="divide-y divide-zinc-800">
            {vendor.payouts.length === 0 ? (
              <div className="p-10 text-center text-zinc-500 text-[10px] font-black uppercase tracking-widest">No payout requests found</div>
            ) : (
              vendor.payouts.map((p: any) => (
                <div key={p.id} className="p-5 flex items-center justify-between hover:bg-zinc-800/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                      p.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500' : 
                      p.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'
                    }`}>
                      {p.status === 'COMPLETED' ? <CheckCircle2 size={18} /> : 
                       p.status === 'REJECTED' ? <XCircle size={18} /> : <Clock size={18} />}
                    </div>
                    <div>
                      <p className="text-xs font-black text-white italic uppercase tracking-tight">Request #{p.id.slice(-6).toUpperCase()}</p>
                      <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{new Date(p.requestedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-white italic">₹{p.amount.toFixed(2)}</p>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${
                      p.status === 'COMPLETED' ? 'text-emerald-500' : 
                      p.status === 'REJECTED' ? 'text-red-500' : 'text-orange-400'
                    }`}>{p.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Subscription History */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-10 border-b border-zinc-800 bg-zinc-950/20 flex items-center justify-between">
           <div>
              <h4 className="text-xl font-black text-white italic uppercase leading-none">Platform Subscription Ledger</h4>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-2">Audit your platform usage fees and membership cycles.</p>
           </div>
           <div className="h-12 w-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-emerald-500">
              <History size={20} />
           </div>
        </div>
        
        <div className="divide-y divide-zinc-800">
           {(!vendor.subscriptionPayments || vendor.subscriptionPayments.length === 0) ? (
              <div className="p-20 text-center text-zinc-600">
                 <div className="flex flex-col items-center gap-4 opacity-20">
                    <History size={40} />
                    <p className="text-[10px] font-black uppercase tracking-widest">No subscription history detected.</p>
                 </div>
              </div>
           ) : (
              vendor.subscriptionPayments.map((p: any) => (
                 <div key={p.id} className="p-8 flex items-center justify-between hover:bg-zinc-950/40 transition-all">
                    <div className="flex items-center gap-6">
                       <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                          <CheckCircle2 size={20} />
                       </div>
                       <div>
                          <p className="text-xs font-black text-white uppercase italic tracking-widest leading-none">{p.plan} Membership</p>
                          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-2">
                             {new Date(p.createdAt).toLocaleDateString()} • Ref: #{p.id.slice(-8).toUpperCase()}
                          </p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-lg font-black text-white italic">₹{p.amount}</p>
                       <div className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mt-1">SUCCESS</div>
                    </div>
                 </div>
              ))
           )}
        </div>
      </div>
    </div>
  );
}
