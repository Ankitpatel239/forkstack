'use client';

import { 
  Zap, 
  Brain, 
  Terminal, 
  Play, 
  Pause, 
  Settings2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Database,
  Search,
  History,
  Sparkles,
  Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';

export default function AdminAutomationPage() {
  const scripts = [
    { id: '1', name: 'Smart Order Router', desc: 'Predictive routing for delivery parcels.', status: 'Active', load: 45, icon: Zap },
    { id: '2', name: 'Inventory Auto-Restock', desc: 'Auto-generates POs for low stock items.', status: 'Standby', load: 12, icon: Database },
    { id: '3', name: 'Fraud Detection Node', desc: 'Real-time payment risk assessment.', status: 'Active', load: 88, icon: ShieldCheck },
  ];

  return (
    <div className="space-y-12 pb-20 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 italic flex items-center gap-3">
             <Brain className="text-emerald-500" size={32} /> Automation Core
          </h1>
          <p className="text-zinc-500 font-medium">Coordinate autonomous platform scripts and predictive AI relay nodes.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-xs h-12 px-8 shadow-xl shadow-emerald-500/20 group">
             <Sparkles size={16} className="mr-2 group-hover:rotate-12 transition-transform" /> Deploy AI Model v2
           </Button>
        </div>
      </div>

      {/* Control Nodes */}
      <div className="grid gap-6 md:grid-cols-4">
         {[
           { label: 'Neural Relay', val: 'Operational', icon: Brain, color: 'emerald' },
           { label: 'Automation Depth', val: '84%', icon: Zap, color: 'blue' },
           { label: 'Active Scripts', val: '12 Active', icon: Terminal, color: 'purple' },
           { label: 'Compute Power', val: '4.8 PFLOPS', icon: Cpu, color: 'orange' },
         ].map((s: any, i: number) => (
           <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 group flex items-center justify-between relative overflow-hidden transition-all hover:bg-zinc-800/40">
              <div className="absolute top-0 right-0 p-3 opacity-5 -mr-2 -mt-2 group-hover:opacity-10 transition-opacity">
                <s.icon size={60} />
              </div>
              <div className="flex-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">{s.label}</p>
                 <h3 className={`text-xl font-black text-white italic tracking-tighter`}>{s.val}</h3>
              </div>
           </div>
         ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-12">
        {/* Script Management */}
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="p-8 border-b border-zinc-800 bg-zinc-950/20 flex items-center justify-between">
                 <div>
                    <h2 className="text-xl font-black text-white italic tracking-tight uppercase">Script Registry</h2>
                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mt-1">Status of scheduled background operations.</p>
                 </div>
                 <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl px-3 h-10 w-48 text-zinc-500">
                    <Search size={14} />
                    <input type="text" placeholder="Search Node..." className="bg-transparent border-none outline-none text-[10px] ml-2 w-full text-white font-sans uppercase tracking-[0.2em] font-black" />
                 </div>
              </div>
              
              <div className="divide-y divide-zinc-900/50">
                 {scripts.map((script: any) => (
                    <div key={script.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-zinc-800/20 transition-all group">
                       <div className="flex items-start gap-4 flex-1">
                          <div className={`h-12 w-12 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center ${script.status === 'Active' ? 'text-emerald-500' : 'text-zinc-700'}`}>
                             <script.icon size={22} className={script.status === 'Active' ? 'animate-pulse' : ''} />
                          </div>
                          <div className="space-y-1">
                             <div className="flex items-center gap-2">
                                <h4 className="text-base font-black text-zinc-200 group-hover:text-emerald-400 transition-colors uppercase italic">{script.name}</h4>
                                <Badge className={`text-[8px] border-none px-2 h-4 font-black uppercase tracking-widest ${script.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-600'}`}>
                                   {script.status}
                                </Badge>
                             </div>
                             <p className="text-xs text-zinc-600 font-medium leading-none">{script.desc}</p>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-6">
                          <div className="space-y-1 w-32 hidden sm:block">
                             <div className="flex justify-between text-[9px] font-black uppercase text-zinc-700">
                                <span>Compute Load</span>
                                <span>{script.load}%</span>
                             </div>
                             <div className="h-1 w-full bg-zinc-950 rounded-full overflow-hidden">
                                <div className={`h-full ${script.load > 80 ? 'bg-red-500' : 'bg-blue-500'} transition-all duration-1000`} style={{ width: `${script.load}%` }} />
                             </div>
                          </div>
                          <div className="flex items-center gap-2">
                             <button className="h-10 w-10 flex items-center justify-center bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-500 hover:text-white hover:border-zinc-700 transition-all">
                                {script.status === 'Active' ? <Pause size={18} /> : <Play size={18} />}
                             </button>
                             <button className="h-10 w-10 flex items-center justify-center bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-500 hover:text-white hover:border-zinc-700 transition-all">
                                <Settings2 size={18} />
                             </button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* AI Insight Card */}
           <div className="bg-emerald-500 border-none rounded-3xl p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-700 text-zinc-950">
                 <Brain size={180} />
              </div>
              <div className="relative z-10 space-y-6">
                 <Badge className="bg-zinc-950 text-emerald-500 border-none font-black uppercase tracking-widest italic px-4 py-1">AI Growth Diagnostic</Badge>
                 <h3 className="text-3xl font-black text-zinc-950 italic tracking-tight leading-none max-w-md uppercase">The platform is operating at 92% efficiency.</h3>
                 <p className="text-zinc-950/70 text-sm font-bold max-w-lg leading-relaxed uppercase tracking-tighter">AI Analysis suggests provisioning 12% more relay capacity in the Indian market to handle the projected weekend traffic surge.</p>
                 <Button className="bg-zinc-950 text-white hover:bg-zinc-900 rounded-2xl h-12 px-8 font-black uppercase tracking-widest text-[10px] mt-4 shadow-2xl">Execute Scaling Protocol</Button>
              </div>
           </div>
        </div>

        {/* Global Rules Panel */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-8 shadow-xl flex flex-col h-full">
              <div className="flex flex-col gap-2 border-b border-zinc-800 pb-4">
                 <h3 className="text-lg font-black text-white italic tracking-tight uppercase leading-none">Global Logic Rules</h3>
                 <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Master triggers for autonomous platform behavior.</p>
              </div>

              <div className="space-y-8 flex-1">
                 {[
                   { label: 'Auto-Suspend Defaulting Vendors', active: true },
                   { label: 'Enforce SLA Latency Buffer', active: true },
                   { label: 'Allow Dynamic Tier Scaling', active: false },
                   { label: 'Propagate Global SEO Updates', active: true },
                   { label: 'Simulate High-Traffic Nodes', active: false },
                 ].map((rule: any, i: number) => (
                    <div key={i} className="flex items-center justify-between group">
                       <span className={`text-[11px] font-black uppercase tracking-widest leading-relaxed transition-colors ${rule.active ? 'text-zinc-400' : 'text-zinc-600'}`}>
                          {rule.label}
                       </span>
                       <Switch checked={rule.active} />
                    </div>
                 ))}
              </div>

              <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-6 text-center">
                 <AlertCircle size={24} className="text-zinc-800 mx-auto mb-3" />
                 <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed">
                   Changes to global logic rules propagate across all vendor nodes in under 30 seconds. Use extreme caution.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function ShieldCheck({ size, className }: any) {
  return <CheckCircle2 size={size} className={className} />;
}
