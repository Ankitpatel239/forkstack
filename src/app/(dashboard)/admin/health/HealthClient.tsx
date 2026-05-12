
'use client';

import { useState } from 'react';
import { 
  Activity, 
  Database, 
  Globe, 
  MessageSquare, 
  Cpu, 
  ShieldCheck, 
  AlertCircle, 
  Clock, 
  RefreshCw,
  Server,
  Network,
  Lock,
  Zap,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { toggleLockdownProtocol, triggerHeartbeat } from '@/app/actions/admin-health';

export function HealthClient({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [lockdownLoading, setLockdownLoading] = useState(false);

  const nodes = [
    { label: 'PostgreSQL Primary', status: 'Operational', latency: data.stats.dbLatency, uptime: '99.99%', icon: Database, color: 'emerald' },
    { label: 'WhatsApp Relay Node', status: 'Optimal', latency: '142ms', uptime: '98.50%', icon: MessageSquare, color: 'blue' },
    { label: 'S3 Asset Storage', status: 'Operational', latency: '24ms', uptime: '100%', icon: Server, color: 'emerald' },
    { label: 'Auth Middleware', status: 'Operational', latency: '5ms', uptime: '99.99%', icon: Lock, color: 'purple' },
  ];

  const handleHeartbeat = async () => {
    setLoading(true);
    try {
      const result = await triggerHeartbeat();
      if (result.success) {
        toast.success(`Global heartbeat verified at ${new Date(result.timestamp).toLocaleTimeString()}`);
      }
    } catch (e) {
      toast.error('Heartbeat transmission failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLockdown = async () => {
    const newStatus = !data.isLockdown;
    if (newStatus && !confirm('WARNING: You are about to initiate a global platform lockdown. This will deactivate all non-essential vendor nodes. Proceed?')) return;
    
    setLockdownLoading(true);
    try {
      const result = await toggleLockdownProtocol(newStatus);
      if (result.success) {
        setData({ ...data, isLockdown: newStatus });
        toast.success(newStatus ? 'PLATFORM LOCKDOWN INITIATED' : 'Platform normalized');
      } else {
        toast.error('Protocol failure');
      }
    } catch (e) {
      toast.error('Fatal security relay error');
    } finally {
      setLockdownLoading(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 italic flex items-center gap-3 uppercase">
             <Activity className="text-emerald-500 animate-pulse" size={32} /> Infrastructure Health
          </h1>
          <p className="text-zinc-500 font-medium font-sans uppercase text-[10px] tracking-[0.3em]">Real-time status of critical relay nodes and platform connectivity.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button 
            onClick={handleHeartbeat}
            disabled={loading}
            variant="outline" 
            className="rounded-2xl border-zinc-800 bg-zinc-900 h-14 px-8 text-zinc-400 font-black uppercase tracking-widest text-[10px] group transition-all shadow-xl"
           >
             {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />}
             Force Global Heartbeat
           </Button>
        </div>
      </div>

      {/* High-level status */}
      <div className="grid gap-6 md:grid-cols-4">
         {[
           { label: 'Platform Status', val: data.isLockdown ? 'LOCKED' : 'Operational', icon: ShieldCheck, color: data.isLockdown ? 'red' : 'emerald' },
           { label: 'Traffic Load', val: 'Low (12.4%)', icon: Network, color: 'blue' },
           { label: 'API Uptime', val: data.stats.apiUptime, icon: Globe, color: 'purple' },
           { label: 'Cluster Latency', val: data.stats.dbLatency, icon: Cpu, color: 'orange' },
         ].map((s: any, i: number) => (
           <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 flex items-center justify-between group overflow-hidden relative shadow-2xl">
              <div className="absolute top-0 right-0 p-3 opacity-5 -mr-2 -mt-2 group-hover:scale-125 transition-transform">
                <s.icon size={60} />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">{s.label}</p>
                 <h3 className={`text-2xl font-black italic tracking-tighter text-white uppercase`}>{s.val}</h3>
              </div>
              <div className={`h-12 w-12 rounded-2xl bg-${s.color}-500/10 flex items-center justify-center text-${s.color}-500 shadow-inner`}>
                 <s.icon size={22} />
              </div>
           </div>
         ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Node Monitoring */}
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-zinc-800 bg-zinc-950/20 flex items-center justify-between">
                 <h2 className="text-xl font-black text-white italic tracking-tight uppercase">Strategic Service Nodes</h2>
                 <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-4 py-1 font-black text-[10px] uppercase tracking-widest italic rounded-lg">All Nodes Verified</Badge>
              </div>
              <div className="p-0">
                 {nodes.map((node: any, i: number) => (
                    <div key={i} className="p-8 flex items-center justify-between border-b border-zinc-900/50 hover:bg-zinc-800/20 transition-all group last:border-b-0">
                       <div className="flex items-center gap-6">
                          <div className={`h-14 w-14 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-${node.color}-500 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                             <node.icon size={26} />
                          </div>
                          <div className="space-y-1.5">
                             <p className="text-base font-black text-white italic tracking-tight uppercase leading-none">{node.label}</p>
                             <div className="flex items-center gap-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">
                                <span className="flex items-center gap-1.5 text-emerald-500/50"><Activity size={12} /> Latency: {node.latency}</span>
                                <span>• Node Uptime: {node.uptime}</span>
                             </div>
                          </div>
                       </div>
                       <div className="flex flex-col items-end gap-2">
                          <Badge variant="outline" className={`border-${node.color}-500/20 text-${node.color}-500 bg-${node.color}-500/5 px-4 h-7 font-black tracking-widest text-[9px] uppercase italic rounded-lg`}>
                            {node.status}
                          </Badge>
                          <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest leading-none italic">Relay Optimized</span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Resource Consumption */}
           <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                 <Zap size={200} />
              </div>
              <h3 className="text-xl font-black text-white italic tracking-tight uppercase leading-none mb-10">Neural Resource Consumption</h3>
              <div className="space-y-10 relative z-10">
                 {[
                   { label: 'CPU Cluster Load', pct: '42%', color: 'blue' },
                   { label: 'Memory Allocation', pct: '68%', color: 'purple' },
                   { label: 'Disk IOPS Hub', pct: '12%', color: 'emerald' },
                 ].map((bar: any, i: number) => (
                   <div key={i} className="space-y-3">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500 leading-none px-1 italic">
                          <span>{bar.label}</span>
                          <span className={`text-${bar.color}-500 font-bold`}>{bar.pct}</span>
                       </div>
                       <div className="h-2.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/50 p-[2px]">
                          <div className={`h-full bg-${bar.color}-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-1000 rounded-full`} style={{ width: bar.pct }} />
                       </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* System Logs Area */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 space-y-10 shadow-2xl h-full flex flex-col">
              <div className="flex flex-col gap-3 border-b border-zinc-800 pb-6">
                 <h3 className="text-xl font-black text-white italic tracking-tight uppercase leading-none">Intelligence Feed</h3>
                 <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest italic">Global platform activity registry.</p>
              </div>

              <div className="space-y-8 flex-1">
                 {data.logs.map((log: any, i: number) => (
                    <div key={i} className="flex gap-5 group">
                       <div className={`mt-1.5 h-2.5 w-2.5 rounded-full shrink-0 ${log.type === 'Error' ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]' : (log.type === 'Warn' ? 'bg-orange-500' : 'bg-emerald-500')}`} />
                       <div className="space-y-2">
                          <p className={`text-xs font-bold leading-relaxed ${log.type === 'Error' ? 'text-red-400 font-black uppercase italic tracking-tighter' : 'text-zinc-400 font-sans'}`}>
                             {log.msg}
                          </p>
                          <div className="flex items-center gap-3 text-[10px] font-black text-zinc-700 uppercase tracking-widest italic">
                             <Clock size={12} /> {log.time}
                          </div>
                       </div>
                    </div>
                 ))}
              </div>

              <Button variant="outline" className="w-full border-zinc-800 bg-zinc-950 text-zinc-600 hover:text-white rounded-2xl h-14 text-[10px] font-black uppercase tracking-widest italic shadow-xl transition-all">
                 Review Security Audit history
              </Button>
           </div>
        </div>
      </div>

      {/* Emergency Lockdown */}
      <div className={`border rounded-[3rem] p-12 flex flex-col md:flex-row items-center justify-between gap-10 group transition-all duration-500 ${data.isLockdown ? 'bg-red-500 border-red-400 shadow-[0_0_50px_rgba(239,68,68,0.2)]' : 'bg-red-500/5 border-red-500/20'}`}>
         <div className="flex items-center gap-8 text-center md:text-left">
            <div className={`h-20 w-20 rounded-[2rem] flex items-center justify-center transition-all duration-500 ${data.isLockdown ? 'bg-zinc-950 text-red-500 scale-110 shadow-2xl rotate-12' : 'bg-red-500/10 text-red-500'}`}>
               {data.isLockdown ? <Lock size={40} /> : <AlertCircle size={40} />}
            </div>
            <div className="space-y-2">
               <h3 className={`text-2xl font-black italic tracking-tighter uppercase leading-none ${data.isLockdown ? 'text-zinc-950' : 'text-red-500'}`}>
                 {data.isLockdown ? 'Protocol: PLATFORM LOCKED' : 'Emergency Lockdown Protocol'}
               </h3>
               <p className={`text-[11px] font-black uppercase tracking-widest italic ${data.isLockdown ? 'text-zinc-950/60' : 'text-red-500/60'}`}>
                 {data.isLockdown ? 'Authorized administrative override active.' : 'Strategic deactivation of all non-essential vendor nodes.'}
               </p>
            </div>
         </div>
         <Button 
          onClick={handleLockdown}
          disabled={lockdownLoading}
          variant={data.isLockdown ? 'default' : 'outline'}
          className={`rounded-2xl font-black uppercase tracking-widest text-[11px] h-16 px-12 transition-all active:scale-95 shadow-2xl min-w-[250px] ${
            data.isLockdown 
            ? 'bg-zinc-950 text-white hover:bg-zinc-900' 
            : 'border-red-500/30 text-red-500 hover:bg-red-500 hover:text-zinc-950'
          }`}
         >
            {lockdownLoading ? <Loader2 size={20} className="animate-spin" /> : (data.isLockdown ? 'Deactivate Lockdown' : 'Initiate Lockdown Node')}
         </Button>
      </div>
    </div>
  );
}
