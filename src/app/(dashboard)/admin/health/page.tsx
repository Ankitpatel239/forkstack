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
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function AdminHealthPage() {
  const nodes = [
    { label: 'PostgreSQL Primary', status: 'Operational', latency: '12ms', uptime: '99.99%', icon: Database, color: 'emerald' },
    { label: 'WhatsApp Relay Node', status: 'Optimal', latency: '142ms', uptime: '98.50%', icon: MessageSquare, color: 'blue' },
    { label: 'S3 Asset Storage', status: 'Operational', latency: '24ms', uptime: '100%', icon: Server, color: 'emerald' },
    { label: 'Auth Middleware', status: 'Operational', latency: '5ms', uptime: '99.99%', icon: Lock, color: 'purple' },
  ];

  const logs = [
    { type: 'Info', msg: 'System background audit completed', time: '2 mins ago' },
    { type: 'Warn', msg: 'Increased latency in ap-south-1 region', time: '14 mins ago' },
    { type: 'Error', msg: 'Vendor webhook retry failed: sweetbakery', time: '1 hour ago' },
    { type: 'Info', msg: 'New administrative clearance granted: ops-admin', time: '4 hours ago' },
  ];

  return (
    <div className="space-y-12 pb-20 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 italic flex items-center gap-3">
             <Activity className="text-emerald-500 animate-pulse" size={32} /> Infrastructure Health
          </h1>
          <p className="text-zinc-500 font-medium">Real-time status of critical relay nodes and platform connectivity.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-xl border-zinc-800 bg-zinc-900 h-12 px-6 text-zinc-400 font-black uppercase tracking-widest text-[10px] group transition-all">
             <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" /> Force Global Heartbeat
           </Button>
        </div>
      </div>

      {/* High-level status */}
      <div className="grid gap-6 md:grid-cols-4">
         {[
           { label: 'Platform Status', val: 'Operational', icon: ShieldCheck, color: 'emerald' },
           { label: 'Traffic Load', val: 'Low (12.4%)', icon: Network, color: 'blue' },
           { label: 'API Uptime', val: '99.98%', icon: Globe, color: 'purple' },
           { label: 'Hardware Latency', val: '18ms', icon: Cpu, color: 'orange' },
         ].map((s: any, i: number) => (
           <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-3 opacity-5 -mr-2 -mt-2 group-hover:scale-125 transition-transform">
                <s.icon size={60} />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">{s.label}</p>
                 <h3 className={`text-2xl font-black italic tracking-tighter text-white uppercase`}>{s.val}</h3>
              </div>
              <div className={`h-10 w-10 rounded-xl bg-${s.color}-500/10 flex items-center justify-center text-${s.color}-500 shadow-inner`}>
                 <s.icon size={18} />
              </div>
           </div>
         ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Node Monitoring */}
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-zinc-800 bg-zinc-950/20 flex items-center justify-between">
                 <h2 className="text-xl font-black text-white italic tracking-tight uppercase">Service Nodes</h2>
                 <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-3 font-black text-[10px] uppercase">All Nodes Healthy</Badge>
              </div>
              <div className="p-0">
                 {nodes.map((node: any, i: number) => (
                    <div key={i} className="p-6 flex items-center justify-between border-b border-zinc-900/50 hover:bg-zinc-800/20 transition-all group last:border-b-0">
                       <div className="flex items-center gap-5">
                          <div className={`h-12 w-12 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-${node.color}-500 shadow-inner group-hover:scale-105 transition-transform`}>
                             <node.icon size={22} />
                          </div>
                          <div className="space-y-1">
                             <p className="text-sm font-black text-white italic tracking-tight uppercase leading-none">{node.label}</p>
                             <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                               <span className="flex items-center gap-1 text-emerald-500/80"><Activity size={10} /> Latency: {node.latency}</span>
                               <span>• Uptime: {node.uptime}</span>
                             </div>
                          </div>
                       </div>
                       <div className="flex flex-col items-end gap-1">
                          <Badge variant="outline" className={`border-${node.color}-500/20 text-${node.color}-500 bg-${node.color}-500/5 px-3 font-black tracking-widest text-[9px] uppercase italic`}>
                            {node.status}
                          </Badge>
                          <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest leading-none">Global Sync Active</span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Performance Distribution */}
           <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-transform duration-1000">
                 <Zap size={150} />
              </div>
              <h3 className="text-xl font-black text-white italic tracking-tight uppercase leading-none mb-8">Resource Consumption</h3>
              <div className="space-y-8 relative z-10">
                 {[
                   { label: 'CPU Cluster Load', pct: '42%', color: 'blue' },
                   { label: 'Memory Allocation', pct: '68%', color: 'purple' },
                   { label: 'Disk IOPS', pct: '12%', color: 'emerald' },
                 ].map((bar: any, i: number) => (
                   <div key={i} className="space-y-2">
                       <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-zinc-500 leading-none px-1">
                          <span>{bar.label}</span>
                          <span className={`text-${bar.color}-500 italic`}>{bar.pct}</span>
                       </div>
                       <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/50">
                          <div className={`h-full bg-${bar.color}-500 shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-700`} style={{ width: bar.pct }} />
                       </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* System Logs Area */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-8 shadow-2xl h-full flex flex-col">
              <div className="flex flex-col gap-2 border-b border-zinc-800 pb-4">
                 <h3 className="text-lg font-black text-white italic tracking-tight uppercase leading-none">Live Audit Feed</h3>
                 <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Global platform activity registry.</p>
              </div>

              <div className="space-y-6 flex-1">
                 {logs.map((log: any, i: number) => (
                    <div key={i} className="flex gap-4 group">
                       <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${log.type === 'Error' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : (log.type === 'Warn' ? 'bg-orange-500' : 'bg-emerald-500')}`} />
                       <div className="space-y-1">
                          <p className={`text-[11px] font-bold leading-relaxed line-clamp-2 ${log.type === 'Error' ? 'text-red-400 font-black' : 'text-zinc-400 font-sans'}`}>
                             {log.msg}
                          </p>
                          <div className="flex items-center gap-2 text-[9px] font-black text-zinc-600 uppercase tracking-widest italic">
                             <Clock size={10} /> {log.time}
                          </div>
                       </div>
                    </div>
                 ))}
              </div>

              <Button variant="outline" className="w-full border-zinc-800 bg-zinc-950 text-zinc-500 hover:text-white rounded-2xl h-12 text-[10px] font-black uppercase tracking-widest italic">
                 Explore Detailed Security Audit History
              </Button>
           </div>
        </div>
      </div>

      {/* Emergency Lockdown */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-10 group">
         <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-zinc-950 transition-all duration-300">
               <AlertCircle size={32} />
            </div>
            <div className="space-y-1">
               <h3 className="text-xl font-black text-red-500 italic tracking-tight uppercase leading-none">Emergency Platform Lockdown</h3>
               <p className="text-xs text-red-500/60 font-medium font-sans">Strategic deactivation of all non-essential vendor nodes in case of security breach.</p>
            </div>
         </div>
         <Button variant="outline" className="rounded-2xl border-red-500/30 text-red-500 font-black uppercase tracking-widest text-[11px] h-14 px-10 hover:bg-red-500 transition-all active:scale-95 group-hover:border-red-500">
            Initiate Lockdown Protocol 
         </Button>
      </div>
    </div>
  );
}
