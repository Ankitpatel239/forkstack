
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
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { redirect } from 'next/navigation';
import { PayoutRequestButton } from '@/components/vendor/PayoutRequestButton';

export default async function VendorPaymentsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'VENDOR_OWNER') {
    redirect('/auth/login');
  }

  const vendor = await prisma.vendorProfile.findUnique({
    where: { ownerId: user.id },
    include: {
      payments: {
        orderBy: { createdAt: 'desc' },
        take: 10
      },
      payouts: {
        orderBy: { requestedAt: 'desc' }
      }
    }
  });

  if (!vendor) {
    return <div>Vendor profile not found.</div>;
  }

  // Calculate Balances
  const totalRevenue = await prisma.payment.aggregate({
    where: { vendorId: vendor.id, status: 'COMPLETED' },
    _sum: { amount: true }
  }).then(res => res._sum.amount || 0);

  const totalWithdrawn = await prisma.payout.aggregate({
    where: { vendorId: vendor.id, status: 'COMPLETED' },
    _sum: { amount: true }
  }).then(res => res._sum.amount || 0);

  const pendingPayouts = await prisma.payout.aggregate({
    where: { 
      vendorId: vendor.id, 
      status: { in: ['PENDING', 'APPROVED', 'PROCESSING'] } 
    },
    _sum: { amount: true }
  }).then(res => res._sum.amount || 0);

  const availableBalance = totalRevenue - totalWithdrawn - pendingPayouts;

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 italic uppercase">Financial Dashboard</h1>
          <p className="text-zinc-500 font-medium">Track your revenue, manage payouts, and analyze fiscal growth.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-zinc-800 bg-zinc-900 h-12 px-6 text-zinc-400 font-black uppercase tracking-widest text-[10px]">
            <Download className="w-4 h-4 mr-2" /> Export Ledger
          </Button>
          <PayoutRequestButton vendorId={vendor.id} availableBalance={availableBalance} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        {[
          { label: 'Available Balance', val: `₹${availableBalance.toLocaleString()}`, icon: Wallet, color: 'emerald' },
          { label: 'Total Revenue', val: `₹${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'blue' },
          { label: 'Pending Payouts', val: `₹${pendingPayouts.toLocaleString()}`, icon: Clock, color: 'orange' },
          { label: 'Total Withdrawn', val: `₹${totalWithdrawn.toLocaleString()}`, icon: History, color: 'zinc' },
        ].map((s, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
              <s.icon size={60} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">{s.label}</p>
            <h3 className="text-2xl font-black text-white italic tracking-tighter">{s.val}</h3>
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
              vendor.payments.map((p) => (
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
              vendor.payouts.map((p) => (
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
    </div>
  );
}
