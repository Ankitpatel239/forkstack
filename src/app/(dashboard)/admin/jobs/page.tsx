'use client';

import { 
  Calendar, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Timer,
  Hash,
  Database,
  Cpu,
  History,
  Settings2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function AdminJobsPage() {
  const jobs = [
    { id: 'JOB-102', name: 'Vendor Payout Sync', schedule: 'Every 24h', lastRun: '2h ago', status: 'Success', dur: '45s', type: 'Finance' },
    { id: 'JOB-101', name: 'Database Optimization', schedule: 'Weekly (Sun)', lastRun: '4d ago', status: 'Success', dur: '12m', type: 'Maintenance' },
    { id: 'JOB-100', name: 'WhatsApp Webhook Retry', schedule: 'Every 5m', lastRun: '3m ago', status: 'Warning', dur: '1s', type: 'Relay' },
    { id: 'JOB-099', name: 'Analytics Snapshot', schedule: 'Hourly', lastRun: '12m ago', status: 'Active', dur: 'N/A', type: 'Data' },
  ];

  return (
    <div className="space-y-12 pb-20 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 italic flex items-center gap-3">
             <Timer className="text-emerald-500" size={32} /> Platform Cron Jobs
          </h1>
          <p className="text-zinc-500 font-medium font-sans">Strategic management of background workers and recurring platform tasks.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-xs h-12 px-8 shadow-xl shadow-emerald-500/20">
             <Play className="w-4 h-4 mr-2" /> Manual Job Trigger
           </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
         {[
           { label: 'Uptime', val: '99.99%', icon: Clock, color: 'emerald' },
           { label: 'Task Throughput', val: '1.2k/hr', icon: Hash, color: 'blue' },
           { label: 'Active Workers', val: '8 Nodes', icon: Cpu, color: 'purple' },
           { label: 'Storage Used', val: '42.4 GB', icon: Database, color: 'orange' },
         ].map((s, i) => (
           <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between group overflow-hidden relative transition-all hover:bg-zinc-800/40">
              <div className="absolute top-0 right-0 p-3 opacity-5 -mr-2 -mt-2 group-hover:opacity-10 transition-opacity">
                <s.icon size={60} />
              </div>
              <div className="flex-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">{s.label}</p>
                 <h3 className={`text-xl font-black text-white italic tracking-tighter uppercase`}>{s.val}</h3>
              </div>
           </div>
         ))}
      </div>

      <div className="bg-zinc-900 shadow-2xl border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="p-8 border-b border-zinc-800 bg-zinc-950/20 flex items-center justify-between">
           <div>
              <h2 className="text-xl font-black text-white italic tracking-tight uppercase leading-none">Job Master Registry</h2>
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mt-1">Status of system-level background processes.</p>
           </div>
           <Button variant="outline" className="rounded-xl border-zinc-800 bg-zinc-950 h-10 px-4 text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-widest italic">
              <RotateCcw className="w-3 h-3 mr-2" /> Reload Ledger
           </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-950/50 text-[10px] uppercase font-black tracking-[0.2em] text-zinc-700 border-b border-zinc-800">
              <tr>
                <th className="px-8 py-5">Job Identifier</th>
                <th className="px-8 py-5">Recurrence</th>
                <th className="px-8 py-5">Last Execution</th>
                <th className="px-8 py-5">Impact Status</th>
                <th className="px-8 py-5 text-right font-sans lowercase italic">Architecture control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
               {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-zinc-800/10 transition-all group">
                     <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                           <div className={`h-10 w-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center ${job.status === 'Active' ? 'text-emerald-500' : 'text-zinc-500'}`}>
                              <Settings2 size={18} className={job.status === 'Active' ? 'animate-spin-slow' : ''} />
                           </div>
                           <div className="space-y-0.5">
                              <p className="text-base font-black text-white italic tracking-tight uppercase leading-none">{job.name}</p>
                              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{job.id} • {job.type}</p>
                           </div>
                        </div>
                     </td>
                     <td className="px-8 py-6 text-zinc-400 font-bold uppercase tracking-tighter text-xs">
                        {job.schedule}
                     </td>
                     <td className="px-8 py-6">
                        <div className="flex flex-col">
                           <span className="text-xs font-bold text-zinc-200 uppercase">{job.lastRun}</span>
                           <span className={`text-[10px] font-black uppercase italic ${job.status === 'Warning' ? 'text-orange-500' : 'text-zinc-600'}`}>Dur: {job.dur}</span>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <Badge className={`px-3 py-1 border-none text-[9px] font-black uppercase tracking-widest italic ${
                           job.status === 'Success' ? 'bg-emerald-500/10 text-emerald-500' :
                           job.status === 'Warning' ? 'bg-orange-500/10 text-orange-500' :
                           'bg-blue-500/10 text-blue-500 animate-pulse'
                        }`}>
                           {job.status}
                        </Badge>
                     </td>
                     <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="h-9 w-9 flex items-center justify-center hover:bg-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-all">
                              <Play size={16} />
                           </button>
                           <button className="h-9 w-9 flex items-center justify-center hover:bg-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-all">
                              <Pause size={16} />
                           </button>
                           <button className="h-9 w-9 flex items-center justify-center hover:bg-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-all">
                              <MoreVertical size={18} />
                           </button>
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
         {/* Live Performance Chart Mockup */}
         <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-8 shadow-xl">
            <div className="flex items-center justify-between">
               <h3 className="text-lg font-black text-white italic tracking-tight uppercase">Worker Velocity</h3>
               <Badge className="bg-blue-500/10 text-blue-500 border-none font-black text-[9px]">Live Cluster Feed</Badge>
            </div>
            <div className="h-48 flex items-end justify-between gap-1 px-4">
               {[20, 45, 30, 80, 60, 90, 70, 40, 50, 85, 95, 65].map((h, i) => (
                  <div key={i} className="flex-1 group relative h-full flex items-end">
                     <div 
                        className={`w-full transition-all rounded-t-sm ${i % 3 === 0 ? 'bg-emerald-500/40 group-hover:bg-emerald-500' : 'bg-zinc-800 group-hover:bg-zinc-700'}`} 
                        style={{ height: `${h}%` }}
                     />
                  </div>
               ))}
            </div>
         </div>

         {/* Job History Alert */}
         <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 flex flex-col justify-center gap-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-transform duration-1000 text-white">
               <History size={150} />
            </div>
            <div className="space-y-4 relative z-10">
               <div className="h-14 w-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <AlertCircle size={32} />
               </div>
               <h3 className="text-2xl font-black text-white italic tracking-tight uppercase leading-none">Job Retries Detected</h3>
               <p className="text-zinc-500 text-sm font-bold leading-relaxed uppercase tracking-tighter max-w-[340px]">Platform Job #JOB-100 failed 4 times in the last 15 minutes. Strategic investigation of the WhatsApp relay node is recommended.</p>
               <Button className="w-fit bg-zinc-950 text-white hover:bg-zinc-900 px-8 rounded-xl h-12 font-black uppercase tracking-widest text-[10px] shadow-xl border border-zinc-800">
                 Investigate Node Logs
               </Button>
            </div>
         </div>
      </div>
    </div>
  );
}
