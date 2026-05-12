
import { 
  Download, 
  Calendar 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPlatformReports } from '@/app/actions/admin-reports';
import { ReportsClient } from './ReportsClient';

export default async function AdminReportsPage() {
  const result = await getPlatformReports();
  const reports = result.success ? result.data : {
    distribution: { BASIC: 0, PRO: 0, ENTERPRISE: 0, total: 0 },
    revenue: { subscriptions: 0, orders: 0, platformFees: 0 },
    monthlyData: Array(12).fill({ month: '', value: 0 }),
    recentTransactions: []
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 italic uppercase">Platform Fiscal Intelligence</h1>
          <p className="text-zinc-500 font-medium font-sans uppercase text-[10px] tracking-[0.3em]">Deep-dive into multi-tier revenue streams and growth vectors.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-xl border-zinc-800 bg-zinc-900 shadow-lg px-6 h-12 text-zinc-400 font-black uppercase tracking-widest text-[10px]">
             <Download className="w-4 h-4 mr-2" /> Global Audit Export
           </Button>
           <Button className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-xs h-12 px-8 shadow-xl shadow-emerald-500/20">
             <Calendar className="w-4 h-4 mr-2" /> Fiscal Year 2026
           </Button>
        </div>
      </div>

      <ReportsClient reports={reports} />
    </div>
  );
}
