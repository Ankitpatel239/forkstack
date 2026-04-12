'use client';

import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  CheckCircle2, 
  Globe, 
  Copy, 
  Eye, 
  Trash2,
  Zap,
  ZapOff,
  Star,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function AdminMarketingPage() {
  const templates = [
    { id: 'T1', name: 'Order Confirmation', channel: 'WhatsApp', category: 'Transactional', status: 'Approved', language: 'en_US' },
    { id: 'T2', name: 'Ready for Pickup', channel: 'WhatsApp', category: 'Transactional', status: 'Approved', language: 'en_US' },
    { id: 'T3', name: 'Promotional Welcome', channel: 'WhatsApp', category: 'Marketing', status: 'Pending Review', language: 'en_US' },
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 italic flex items-center gap-3">
             <MessageSquare className="text-emerald-500" size={32} /> Marketing Registry
          </h1>
          <p className="text-zinc-500 font-medium font-sans">Strategic control of cross-platform communication templates and relay assets.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-xs h-12 px-8 shadow-xl shadow-emerald-500/20">
             <Plus className="w-5 h-5 mr-1" /> Architect New Template
           </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
         {[
           { label: 'Cloud Templates', val: '24 Active', icon: Globe, color: 'blue' },
           { label: 'Relay Approval', val: '98%', icon: CheckCircle2, color: 'emerald' },
           { label: 'Marketing Reach', val: '124.8k', icon: Star, color: 'purple' },
           { label: 'API Relay Node', val: 'Operational', icon: Zap, color: 'orange' },
         ].map((s, i) => (
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

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 h-12 w-full md:w-96 text-zinc-500 focus-within:border-emerald-500/50 transition-colors">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search Template name, language or ID..." 
            className="bg-transparent border-none focus:ring-0 text-sm flex-1 outline-none text-white font-sans" 
          />
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-xl border-zinc-800 bg-zinc-900 h-12 px-6 text-zinc-400 font-black uppercase tracking-widest text-[10px]">
             <Filter className="w-4 h-4 mr-2" /> Global Channels
           </Button>
        </div>
      </div>

      <div className="bg-zinc-900 shadow-2xl border border-zinc-800 rounded-3xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-950/50 text-[10px] uppercase font-black tracking-[0.2em] text-zinc-700 border-b border-zinc-800">
            <tr>
              <th className="px-8 py-6 font-display">Communication Node</th>
              <th className="px-8 py-6">Category</th>
              <th className="px-8 py-6">Relay Status</th>
              <th className="px-8 py-6 text-right italic font-sans lowercase italic">Architecture control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
             {templates.map((t) => (
                <tr key={t.id} className="hover:bg-zinc-800/10 transition-colors group">
                   <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                         <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-emerald-500 group-hover:text-zinc-950 transition-all">
                            <MessageSquare size={18} />
                         </div>
                         <div className="space-y-1">
                            <p className="text-base font-black text-white italic tracking-tight uppercase leading-none">{t.name}</p>
                            <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                               <Globe size={10} className="text-blue-500/50" /> {t.language} • {t.channel}
                            </div>
                         </div>
                      </div>
                   </td>
                   <td className="px-8 py-6">
                      <Badge className="bg-zinc-800 text-zinc-400 border-none text-[9px] font-black uppercase tracking-[0.2em] italic px-3 h-6">
                         {t.category}
                      </Badge>
                   </td>
                   <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                         <div className={`h-2 h-2 rounded-full ${t.status === 'Approved' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-orange-500'}`} />
                         <span className={`text-[11px] font-black uppercase tracking-tighter ${t.status === 'Approved' ? 'text-emerald-500' : 'text-orange-500'}`}>
                            {t.status}
                         </span>
                      </div>
                   </td>
                   <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="h-9 w-9 flex items-center justify-center hover:bg-zinc-800 rounded-xl text-zinc-600 hover:text-white transition-all">
                            <Eye size={16} />
                         </button>
                         <button className="h-9 w-9 flex items-center justify-center hover:bg-zinc-800 rounded-xl text-zinc-600 hover:text-white transition-all">
                            <Copy size={16} />
                         </button>
                         <button className="h-9 w-9 flex items-center justify-center hover:bg-zinc-800 rounded-xl text-zinc-600 hover:text-white transition-all">
                            <MoreHorizontal size={18} />
                         </button>
                      </div>
                   </td>
                </tr>
             ))}
          </tbody>
        </table>
      </div>

      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-10 group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-transform duration-700">
             <Star size={100} className="text-emerald-500" />
          </div>
          <div className="flex items-start gap-6 relative z-10">
             <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <BadgeCheck size={32} />
             </div>
             <div className="space-y-1">
                <h3 className="text-xl font-black text-white italic tracking-tight uppercase leading-none">Global Template Synchronization</h3>
                <p className="text-xs text-zinc-500 font-medium leading-relaxed max-w-[460px] uppercase tracking-tighter">Your current relay nodes are 100% synchronized with the WhatsApp Business Cloud API. New templates are propagated in less than 2 minutes platform-wide.</p>
             </div>
          </div>
          <Button className="rounded-2xl bg-zinc-950 border border-zinc-800 px-10 h-14 text-white font-black uppercase tracking-[0.2em] text-[10px] hover:bg-zinc-900 transition-all shadow-xl relative z-10">
             Initiate Global Relay Pulse
          </Button>
      </div>
    </div>
  );
}

function BadgeCheck({ size, className }: any) {
  return <CheckCircle2 size={size} className={className} />;
}
