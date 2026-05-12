
'use client';

import { useState, useMemo, useEffect } from 'react';
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
  Calendar as CalendarIcon,
  Zap,
  Activity,
  ArrowRight,
  ChevronRight,
  Layers,
  Search,
  ArrowDownCircle,
  ArrowUpCircle,
  AlertTriangle,
  Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getGlobalInventoryHistory } from '@/app/actions/inventory';
import { format, subDays, startOfDay, endOfDay, eachDayOfInterval } from 'date-fns';
import { toast } from 'sonner';

interface GlobalAnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalAnalysisDialog({ open, onOpenChange }: GlobalAnalysisDialogProps) {
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 7),
    to: new Date()
  });
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadHistory();
    }
  }, [open, dateRange]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await getGlobalInventoryHistory(dateRange.from, dateRange.to);
      setHistory(data);
    } catch (error) {
      toast.error("Failed to fetch global logs");
    } finally {
      setLoading(false);
    }
  };

  const metrics = useMemo(() => {
    const sales = history.filter((h: any) => h.type === 'OUT').reduce((acc: any, h: any) => acc + Math.abs(h.quantity), 0);
    const intake = history.filter((h: any) => h.type === 'IN').reduce((acc: any, h: any) => acc + Math.abs(h.quantity), 0);
    const waste = history.filter((h: any) => h.type === 'WASTE').reduce((acc: any, h: any) => acc + Math.abs(h.quantity), 0);
    
    // Day-wise grouping for charts
    const intervals = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });
    const dailyData = intervals.map((day: any) => {
       const key = format(day, 'MMM dd');
       const dayLogs = history.filter((h: any) => format(new Date(h.createdAt), 'MMM dd') === key);
       return {
         day: key,
         sales: dayLogs.filter((h: any) => h.type === 'OUT').reduce((acc: any, h: any) => acc + Math.abs(h.quantity), 0),
         waste: dayLogs.filter((h: any) => h.type === 'WASTE').reduce((acc: any, h: any) => acc + Math.abs(h.quantity), 0)
       };
    });

    return { sales, intake, waste, dailyData };
  }, [history, dateRange]);

  const SimpleBarChart = ({ data }: { data: any[] }) => {
    const max = Math.max(...data.map((d: any) => d.sales), 1);
    return (
      <TooltipProvider>
      <div className="flex items-end gap-1.5 h-32 w-full pt-6">
        {data.map((d: any, i: any) => (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <div className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                <div 
                  className="w-full bg-emerald-500/10 border-x border-t border-emerald-500/20 group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all rounded-t-lg relative"
                  style={{ height: `${(d.sales / max) * 100}%`, minHeight: '2px' }}
                >
                   {d.sales > 0 && (
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-emerald-500 text-zinc-950 text-[8px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                        {d.sales}
                     </div>
                   )}
                </div>
                <span className="text-[7px] font-black text-muted-foreground/40 uppercase tracking-tighter group-hover:text-emerald-500 transition-colors">{d.day.split(' ')[1]}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-card border-border text-[10px] p-3 rounded-xl shadow-2xl">
               <p className="font-black italic uppercase tracking-tighter text-emerald-500 mb-1">{d.day}</p>
               <div className="flex items-center justify-between gap-8">
                  <span className="text-muted-foreground/40 font-bold uppercase text-[8px]">Total Outflow</span>
                  <span className="font-black text-foreground">{d.sales} Units</span>
               </div>
               {d.waste > 0 && (
                  <div className="flex items-center justify-between gap-8 mt-1">
                     <span className="text-red-500/50 font-bold uppercase text-[8px]">Loss Recorded</span>
                     <span className="font-black text-red-500">{d.waste} Units</span>
                  </div>
               )}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      </TooltipProvider>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-border text-foreground sm:max-w-[700px] max-h-[95vh] p-0 overflow-hidden rounded-[2.5rem] shadow-2xl outline-none">
        <div className="grid md:grid-cols-5 h-full">
           {/* Sidebar Info */}
           <div className="md:col-span-2 bg-muted/30 border-r border-border p-8 space-y-8 overflow-y-auto custom-scrollbar">
              <div>
                 <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-4">
                    <BarChart3 size={24} />
                 </div>
                 <h2 className="text-2xl font-black italic uppercase tracking-tighter leading-none text-foreground">Portfolio<br />Intel Node</h2>
                 <p className="text-[9px] text-muted-foreground/40 font-black uppercase tracking-widest mt-2 px-1">Global audit & velocity tracking</p>
              </div>

              <div className="space-y-4">
                 <div className="p-4 rounded-2xl bg-card/50 border border-border/50 space-y-1">
                    <p className="text-[8px] font-black uppercase text-muted-foreground/60">Period Sales</p>
                    <div className="flex items-baseline gap-2">
                       <h3 className="text-2xl font-black italic text-foreground leading-none">{metrics.sales}</h3>
                       <span className="text-[10px] text-emerald-500 font-bold uppercase">Units</span>
                    </div>
                 </div>
                 <div className="p-4 rounded-2xl bg-card/50 border border-border/50 space-y-1">
                    <p className="text-[8px] font-black uppercase text-muted-foreground/60">Material Intake</p>
                    <div className="flex items-baseline gap-2">
                       <h3 className="text-2xl font-black italic text-blue-500 leading-none">{metrics.intake}</h3>
                       <span className="text-[10px] text-blue-500/50 font-bold uppercase font-black tracking-widest leading-none block">{((metrics.intake / (metrics.intake + metrics.sales || 1)) * 100).toFixed(0)}% Fill</span>
                    </div>
                 </div>
                 <div className="p-4 rounded-2xl bg-card/50 border border-border/50 space-y-1 group">
                    <p className="text-[8px] font-black uppercase text-muted-foreground/60">Loss / Waste Vector</p>
                    <div className="flex items-baseline gap-2">
                       <h3 className="text-2xl font-black italic text-red-500 leading-none">{metrics.waste}</h3>
                       {metrics.waste > 0 && <span className="text-[8px] py-0.5 px-1.5 bg-red-500/10 text-red-500 rounded font-black animate-pulse uppercase">Leakage Detected</span>}
                    </div>
                 </div>
              </div>

              <div className="pt-4 border-t border-border/50">
                 <div className="flex items-center gap-2 text-muted-foreground/40 hover:text-foreground transition-colors cursor-help">
                    <Flame size={14} className="text-emerald-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest italic">Efficiency Index: 92.4%</span>
                 </div>
              </div>
           </div>

           {/* Main Content */}
           <div className="md:col-span-3 flex flex-col h-full max-h-[95vh] overflow-hidden">
              <div className="p-8 border-b border-border bg-card flex flex-col gap-4">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 flex items-center gap-2">
                       <CalendarIcon size={12} /> Temporal Range
                    </span>
                    <Badge variant="outline" className="text-[8px] font-black uppercase border-border text-muted-foreground/40">Nodes Synchronized</Badge>
                 </div>
                 <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setDateRange({ from: subDays(new Date(), 7), to: new Date() })}
                      className="flex-1 h-10 border-border bg-muted p-0 text-[10px] font-black uppercase rounded-xl hover:bg-emerald-500 hover:text-foreground transition-all active:scale-95"
                    >
                      7 Nodes
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setDateRange({ from: subDays(new Date(), 30), to: new Date() })}
                      className="flex-1 h-10 border-border bg-muted p-0 text-[10px] font-black uppercase rounded-xl hover:bg-emerald-500 hover:text-foreground transition-all active:scale-95"
                    >
                      30 Nodes
                    </Button>
                 </div>

                 <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                       <label className="text-[7px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 px-1">Source Node Date</label>
                       <input 
                         type="date"
                         value={format(dateRange.from, 'yyyy-MM-dd')}
                         onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value ? new Date(e.target.value) : prev.from }))}
                         className="w-full bg-muted border border-border rounded-xl h-10 px-3 text-[10px] font-bold text-foreground focus:border-emerald-500/50 outline-none transition-all"
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[7px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 px-1">Terminal Node Date</label>
                       <input 
                         type="date"
                         value={format(dateRange.to, 'yyyy-MM-dd')}
                         onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value ? new Date(e.target.value) : prev.to }))}
                         className="w-full bg-muted border border-border rounded-xl h-10 px-3 text-[10px] font-bold text-foreground focus:border-emerald-500/50 outline-none transition-all"
                       />
                    </div>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                 <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 flex items-center gap-2">
                       <Activity size={12} /> Velocity Distribution
                    </p>
                    <div className="bg-muted/40 border border-border/50 p-6 rounded-[2rem]">
                       <SimpleBarChart data={metrics.dailyData} />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 flex items-center gap-2">
                          <History size={12} /> Temporal Feed
                       </p>
                       <span className="text-[8px] font-bold text-muted-foreground/40">{history.length} operations</span>
                    </div>

                    <div className="space-y-3">
                       {loading ? (
                          <div className="flex items-center justify-center py-10 opacity-20"><Zap size={24} className="animate-pulse" /></div>
                       ) : history.length === 0 ? (
                          <p className="text-center py-10 text-[10px] font-black text-muted-foreground/20 uppercase tracking-widest border border-dashed border-border rounded-2xl leading-none block">Null feed in range.</p>
                       ) : (
                           history.slice(0, 10).map((log: any, idx: any) => (
                             <div key={idx} className="flex items-center justify-between p-4 bg-muted/20 border border-border/30 rounded-2xl group hover:border-emerald-500/20 transition-all">
                                <div className="flex items-center gap-3">
                                   <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${log.type === 'IN' ? 'bg-blue-500/10 text-blue-500' : log.type === 'WASTE' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                      {log.type === 'IN' ? <ArrowDownCircle size={14} /> : log.type === 'WASTE' ? <AlertTriangle size={14} /> : <ArrowUpCircle size={14} />}
                                   </div>
                                   <div>
                                      <p className="text-[11px] font-black uppercase tracking-tight text-foreground">{log.inventoryItem.name}</p>
                                      <p className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest">{format(new Date(log.createdAt), 'HH:mm • MMM dd')}</p>
                                   </div>
                                </div>
                                <div className="text-right">
                                   <p className={`text-sm font-black italic ${log.type === 'IN' ? 'text-blue-500' : log.type === 'WASTE' ? 'text-red-500' : 'text-emerald-500'}`}>
                                      {log.type === 'IN' ? '+' : '-'}{Math.abs(log.quantity)}
                                   </p>
                                   <p className="text-[8px] font-bold text-muted-foreground/20 uppercase tracking-widest">{log.type}</p>
                                </div>
                             </div>
                          ))
                       )}
                       {history.length > 10 && (
                         <div className="text-center">
                            <span className="text-[8px] font-black text-muted-foreground/20 uppercase tracking-widest">+{history.length - 10} more operations</span>
                         </div>
                       )}
                    </div>
                 </div>
              </div>

              <div className="p-8 bg-card border-t border-border">
                 <Button 
                   onClick={() => onOpenChange(false)}
                   className="w-full bg-foreground text-background hover:bg-foreground/90 font-black uppercase tracking-[0.2em] text-[10px] h-14 rounded-2xl shadow-xl active:scale-95 transition-all"
                 >
                    Terminate Session
                 </Button>
              </div>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function History(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}
