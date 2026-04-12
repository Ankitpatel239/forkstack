'use client';

import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Award, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ArrowUpRight, 
  Target,
  Gift,
  Handshake,
  ExternalLink,
  ChevronRight,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function AdminAffiliatesPage() {
  const partners = [
    { id: '1', name: 'Global Tech Solutions', tier: 'Gold', activeVendors: 142, lifetimeComm: '$14,280', status: 'Active' },
    { id: '2', name: 'Digital Growth Agency', tier: 'Silver', activeVendors: 58, lifetimeComm: '$4,120', status: 'Active' },
    { id: '3', name: 'Indie Dev Referral', tier: 'Bronze', activeVendors: 12, lifetimeComm: '$840', status: 'Active' },
  ];

  return (
    <div className="space-y-10 pb-20 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 italic flex items-center gap-3">
             <Handshake className="text-emerald-500" size={32} /> Referral Network
          </h1>
          <p className="text-zinc-500 font-medium">Coordinate your growth ecosystem and manage strategic affiliate partnerships.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-xs h-12 px-8 shadow-xl shadow-emerald-500/20">
             <UserPlus className="w-5 h-5 mr-1" /> Onboard Partner
           </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
         {[
           { label: 'Network Reach', val: '224 Partners', icon: Users, color: 'blue' },
           { label: 'Commission Payout', val: '$28,400', icon: DollarSign, color: 'emerald' },
           { label: 'Conversion Lift', val: '+18.4%', icon: TrendingUp, color: 'purple' },
         ].map((s, i) => (
           <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 group flex items-center justify-between relative overflow-hidden transition-all hover:bg-zinc-800/40">
              <div className="absolute top-0 right-0 p-3 opacity-5 -mr-2 -mt-2 group-hover:scale-125 transition-transform">
                <s.icon size={80} />
              </div>
              <div className="flex-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">{s.label}</p>
                 <h3 className={`text-2xl font-black italic tracking-tighter text-white uppercase`}>{s.val}</h3>
              </div>
           </div>
         ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 h-12 w-full md:w-96 text-zinc-500 focus-within:border-emerald-500/50 transition-colors">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search Partner name or ID..." 
            className="bg-transparent border-none focus:ring-0 text-sm flex-1 outline-none text-white" 
          />
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-xl border-zinc-800 bg-zinc-900 shadow-lg px-6 h-12 text-zinc-400 font-black uppercase tracking-widest text-[10px]">
             <Target className="w-4 h-4 mr-2" /> Tier Goals
           </Button>
        </div>
      </div>

      <div className="bg-zinc-900 shadow-2xl border border-zinc-800 rounded-3xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-950/50 text-[10px] uppercase font-black tracking-[0.2em] text-zinc-700 border-b border-zinc-800">
            <tr>
              <th className="px-8 py-6 font-display">Affiliate Partner</th>
              <th className="px-8 py-6">Tier Level</th>
              <th className="px-8 py-6">Portfolio Strength</th>
              <th className="px-8 py-6">Fiscal impact</th>
              <th className="px-8 py-6 text-right italic font-sans lowercase italic">Network control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
             {partners.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-800/10 transition-all group">
                   <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                         <div className="h-10 w-10 rounded-xl bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-emerald-500 group-hover:text-zinc-950 transition-all">
                            <Handshake size={18} />
                         </div>
                         <div className="space-y-1">
                            <p className="text-base font-black text-white italic tracking-tight uppercase leading-none">{p.name}</p>
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Partner ID: PRT-{p.id.padStart(3, '0')}</p>
                         </div>
                      </div>
                   </td>
                   <td className="px-8 py-6">
                      <Badge className={`bg-zinc-800 border-none text-[9px] font-black uppercase tracking-[0.2em] italic px-3 h-6 ${
                        p.tier === 'Gold' ? 'text-orange-400' : (p.tier === 'Silver' ? 'text-zinc-300' : 'text-orange-800')
                      }`}>
                         {p.tier} Node
                      </Badge>
                   </td>
                   <td className="px-8 py-6">
                      <div className="space-y-1">
                         <div className="flex items-center gap-2">
                            <span className="text-base font-black text-zinc-300 tracking-tighter italic">{p.activeVendors}</span>
                            <span className="text-[10px] font-black uppercase text-zinc-600">Active Licenses</span>
                         </div>
                         <div className="h-1 w-24 bg-zinc-950 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${(p.activeVendors / 200) * 100}%` }} />
                         </div>
                      </div>
                   </td>
                   <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-emerald-500 font-black italic tracking-tighter">
                         <ArrowUpRight size={14} className="text-zinc-700" /> {p.lifetimeComm}
                      </div>
                   </td>
                   <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="h-9 w-9 flex items-center justify-center hover:bg-zinc-800 rounded-xl text-zinc-600 hover:text-white transition-all underline">
                            Audit
                         </button>
                         <button className="h-9 w-9 flex items-center justify-center hover:bg-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-all">
                            <MoreHorizontal size={20} />
                         </button>
                      </div>
                   </td>
                </tr>
             ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
         <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6 shadow-xl">
            <h4 className="text-lg font-black text-white italic bg-zinc-950/50 w-fit px-4 py-1 rounded-lg uppercase">Strategic Growth Bonus</h4>
            <div className="space-y-4">
               {[
                 { label: 'Enterprise Referral', reward: '$100.00', status: 'Ready' },
                 { label: 'Market Expansion Wave', reward: '5% Multiplier', status: 'Locked' },
                 { label: 'Retention Milestone', reward: '$50.00', status: 'Active' },
               ].map((b, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800 hover:border-emerald-500/20 transition-all group">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-700 group-hover:text-emerald-500">
                           <Gift size={20} />
                        </div>
                        <div className="space-y-0.5">
                           <p className="text-sm font-bold text-zinc-300">{b.label}</p>
                           <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">{b.status}</p>
                        </div>
                     </div>
                     <span className="text-lg font-black italic text-emerald-500 tracking-tighter">{b.reward}</span>
                  </div>
               ))}
            </div>
         </div>

         <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 rounded-3xl p-10 flex flex-col justify-center gap-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-transform duration-1000 text-white">
               <Award size={150} />
            </div>
            <h3 className="text-2xl font-black text-white italic tracking-tight uppercase leading-none">Affiliate Knowledge Base</h3>
            <p className="text-zinc-500 text-sm font-bold leading-relaxed uppercase tracking-tighter max-w-[340px]">Access comprehensive training materials and strategic assets to empower your tier-one referral nodes.</p>
            <Button className="w-fit bg-emerald-500 text-zinc-950 hover:bg-emerald-400 px-8 rounded-xl h-12 font-black uppercase tracking-widest text-[10px] shadow-xl">
              Explore Partner Resources <ChevronRight size={16} className="ml-2" />
            </Button>
         </div>
      </div>
    </div>
  );
}
