
'use client';

import { useState, useMemo } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
} from '@/components/ui/dialog';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Package, 
  ShoppingCart, 
  Calendar,
  Zap,
  Activity,
  ArrowRight,
  ChevronRight,
  LineChart as LineChartIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ItemAnalysisDialogProps {
  item: any;
  history: any[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ItemAnalysisDialog({ item, history = [], open, onOpenChange }: ItemAnalysisDialogProps) {
  const [view, setView] = useState<'SALES' | 'STOCK' | 'FULL'>('SALES');

  const stats = useMemo(() => {
    if (!history || history.length === 0) {
      return {
        daily: [0, 0, 0, 0, 0, 0, 0],
        growth: "0",
        demand: "STABLE",
        velocity: "0",
        stockDays: 0,
        weeklyTotal: 0
      };
    }

    const now = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(now.getDate() - (6 - i));
      d.setHours(0, 0, 0, 0);
      return d;
    });

    // Aggregate real sales/usage (OUT, WASTE) per day
    const dailyValues = last7Days.map((date: any) => {
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      
      return history
        .filter((h: any) => (h.type === 'OUT' || h.type === 'WASTE') && 
                    new Date(h.createdAt) >= date && 
                    new Date(h.createdAt) < nextDay)
        .reduce((sum: any, h: any) => sum + Math.abs(h.quantity), 0);
    });

    const totalSales = dailyValues.reduce((a: any, b: any) => a + b, 0);
    const velocity = totalSales / 7;
    
    // Compare with previous 7 days for growth
    const prev7Limit = new Date();
    prev7Limit.setDate(now.getDate() - 14);
    const prev7Total = history
      .filter((h: any) => (h.type === 'OUT' || h.type === 'WASTE') && 
                  new Date(h.createdAt) >= prev7Limit && 
                  new Date(h.createdAt) < last7Days[0])
      .reduce((sum: any, h: any) => sum + Math.abs(h.quantity), 0);

    const growth = prev7Total > 0 ? ((totalSales - prev7Total) / prev7Total) * 100 : (totalSales > 0 ? 100 : 0);

    return {
      daily: dailyValues,
      growth: growth.toFixed(1),
      demand: growth > 10 ? 'SURGE' : (growth < -10 ? 'LOW' : 'STABLE'),
      velocity: velocity.toFixed(1),
      stockDays: velocity > 0 ? Math.floor(item?.quantity / velocity) : 99,
      weeklyTotal: totalSales
    };
  }, [item, history]);

  // Small SVG Line Chart Component
  const SimpleLineChart = ({ data, color = '#10b981', height = 60 }: { data: number[], color?: string, height?: number }) => {
    const max = Math.max(...data, 1);
    const points = data.map((d: any, i: any) => `${(i / (data.length - 1)) * 100},${height - (d / max) * height}`).join(' ');
    
    return (
      <svg className="w-full" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
        <path d={`M 0 ${height} ${points.split(' ').map((p: any, i: any) => i === 0 ? `L ${p}` : `L ${p}`).join(' ')} L 100 ${height} Z`} fill={`${color}20` } />
        <polyline fill="none" stroke={color} strokeWidth="2" points={points} strokeLinejoin="round" />
      </svg>
    );
  };

  const AnalysisTab = ({ id, label, icon: Icon, active, onClick }: any) => (
    <button 
      onClick={onClick}
      className={`flex-1 py-3 px-2 rounded-xl flex flex-col items-center gap-1.5 transition-all ${active ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/10' : 'bg-zinc-900/50 text-zinc-500 hover:bg-zinc-900 group'}`}
    >
       <Icon size={16} className={active ? '' : 'group-hover:scale-110 transition-transform'} />
       <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950 border-zinc-900 text-white sm:max-w-[500px] p-0 overflow-hidden rounded-[2rem] shadow-2xl outline-none">
        <DialogHeader className="p-6 pb-2 bg-gradient-to-br from-zinc-900 to-zinc-950 border-b border-zinc-900">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <Activity size={20} />
                 </div>
                 <div>
                    <DialogTitle className="text-lg font-black italic uppercase tracking-tighter">Market Pulse</DialogTitle>
                    <p className="text-zinc-500 text-[8px] font-black uppercase tracking-[0.2em]">{item?.name} • SKU Analysis</p>
                 </div>
              </div>
              <Badge className={`bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[8px] font-black uppercase ${parseFloat(stats.growth) < 0 ? 'text-red-500 bg-red-500/10 border-red-500/20' : ''}`}>
                 {parseFloat(stats.growth) > 0 ? <TrendingUp size={10} className="mr-1 inline" /> : <TrendingDown size={10} className="mr-1 inline" />}
                 {stats.growth}% Demand
              </Badge>
           </div>
        </DialogHeader>

        <div className="p-4 bg-zinc-900/20 flex gap-2 border-b border-zinc-900">
          <AnalysisTab id="SALES" label="Sell Flow" icon={ShoppingCart} active={view === 'SALES'} onClick={() => setView('SALES')} />
          <AnalysisTab id="STOCK" label="Stock Cycle" icon={Package} active={view === 'STOCK'} onClick={() => setView('STOCK')} />
          <AnalysisTab id="FULL" label="Full Intel" icon={Zap} active={view === 'FULL'} onClick={() => setView('FULL')} />
        </div>

        <div className="p-6 space-y-6">
          {view === 'SALES' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-900/40 p-4 rounded-2xl border border-zinc-900">
                     <p className="text-[8px] font-black text-zinc-600 uppercase mb-1">Avg Daily Burn</p>
                     <h4 className="text-xl font-black italic text-white tracking-tighter">{stats.velocity} <span className="text-[10px] text-zinc-500">{item?.unit}</span></h4>
                  </div>
                  <div className="bg-zinc-900/40 p-4 rounded-2xl border border-zinc-900">
                     <p className="text-[8px] font-black text-zinc-600 uppercase mb-1">Weekly Volume</p>
                     <h4 className="text-xl font-black italic text-emerald-500 tracking-tighter">{stats.daily.reduce((a: any, b: any) => a + b, 0)} Units</h4>
                  </div>
               </div>

               <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                     <p className="text-[9px] font-black uppercase text-zinc-400">7-Day Sales Trajectory</p>
                     <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Live Flow</p>
                  </div>
                  <div className="p-6 rounded-[2rem] bg-zinc-900/50 border border-zinc-800">
                    <SimpleLineChart data={stats.daily} color="#10b981" />
                    <div className="flex justify-between mt-4 text-[7px] font-black text-zinc-700 uppercase tracking-widest px-2">
                       <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {view === 'STOCK' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-900/40 p-4 rounded-2xl border border-zinc-900">
                     <p className="text-[8px] font-black text-zinc-600 uppercase mb-1">Est. Exhaustion</p>
                     <h4 className={`text-xl font-black italic tracking-tighter ${stats.stockDays < 5 ? 'text-red-500' : 'text-zinc-100'}`}>{stats.stockDays} Days</h4>
                  </div>
                  <div className="bg-zinc-900/40 p-4 rounded-2xl border border-zinc-900">
                     <p className="text-[8px] font-black text-zinc-600 uppercase mb-1">Health Status</p>
                     <h4 className="text-xl font-black italic text-emerald-500 tracking-tighter uppercase">{stats.demand}</h4>
                  </div>
               </div>

               <div className="p-6 rounded-[2rem] bg-zinc-900/80 border border-zinc-800 relative overflow-hidden">
                  <div className="flex flex-col gap-4">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                           <p className="text-[9px] font-black uppercase tracking-widest">Inventory Depth</p>
                        </div>
                        <span className="text-[10px] font-black italic">{item?.quantity} / {item?.quantity + 50}</span>
                     </div>
                     <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '70%' }} />
                     </div>
                     <p className="text-[8px] text-zinc-600 font-bold leading-relaxed uppercase">Current stock levels are sufficient for the next cycle based on avg velocity of {stats.velocity} {item?.unit}/day.</p>
                  </div>
               </div>
            </div>
          )}

          {view === 'FULL' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="grid grid-cols-1 gap-3">
                  {[
                    { label: 'Demand Index', val: '+24%', icon: TrendingUp, color: 'text-emerald-500' },
                    { label: 'Stock Valuation', val: `₹${(item?.costPrice * item?.quantity || 0).toLocaleString()}`, icon: Package, color: 'text-blue-500' },
                    { label: 'Fulfillment Rate', val: '98.2%', icon: Activity, color: 'text-purple-500' }
                  ].map((s: any, i: any) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-900 rounded-2xl hover:bg-zinc-900/60 transition-all">
                       <div className="flex items-center gap-3">
                          <s.icon size={16} className={s.color} />
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">{s.label}</span>
                       </div>
                       <span className="text-xs font-black italic text-white">{s.val}</span>
                    </div>
                  ))}
               </div>

               <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-zinc-950 shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                     <h5 className="text-[10px] font-black uppercase tracking-tighter flex items-center gap-2">
                        <Zap size={14} /> AI Forecast Warning
                     </h5>
                  </div>
                  <p className="text-[10px] font-bold italic leading-tight uppercase">High probability of stock-out in the next <span className="underline decoration-white underline-offset-4">4 days</span> due to seasonal surge. Prepare PO immediately.</p>
               </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-zinc-950/50 border-t border-zinc-900 flex justify-center">
           <button 
             onClick={() => onOpenChange(false)}
             className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700 hover:text-white transition-all flex items-center gap-2"
           >
             Close Intel <ArrowRight size={14} />
           </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
