
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight, 
  Download, 
  Calendar, 
  PieChart, 
  Target,
  Users,
  Search,
  Filter,
  Zap,
  Activity,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export function ReportsClient({ reports }: { reports: any }) {
  const { distribution, revenue, monthlyData, recentTransactions } = reports;

  const channelData = [
    { label: 'Platform Subscriptions', value: `$${revenue.subscriptions.toLocaleString()}`, change: '+12.4%', color: 'emerald' },
    { label: 'Marketplace Volume', value: `$${revenue.orders.toLocaleString()}`, change: '+8.2%', color: 'blue' },
    { label: 'Settlement Fees (5%)', value: `$${revenue.platformFees.toLocaleString()}`, change: '+15.8%', color: 'purple' }
  ];

  const maxVal = Math.max(...monthlyData.map((d: any) => d.value)) || 1;

  return (
    <div className="space-y-10 pb-20">
      <div className="grid gap-6 md:grid-cols-3">
         {channelData.map((channel: any, i: any) => (
           <Card key={i} className="bg-zinc-900 border-zinc-800 shadow-2xl relative overflow-hidden group hover:border-zinc-700 transition-all">
              <div className={`absolute top-0 right-0 p-6 opacity-5 -mr-4 -mt-4 text-${channel.color}-500 transform group-hover:rotate-12 transition-transform`}>
                 <Zap size={100} />
              </div>
              <CardHeader className="pb-2">
                 <CardDescription className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">Global stream</CardDescription>
                 <CardTitle className="text-sm font-bold text-white uppercase italic">{channel.label}</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="flex items-end gap-3">
                   <h3 className="text-3xl font-black text-white italic tracking-tighter">{channel.value}</h3>
                   <span className={`text-[10px] font-black uppercase mb-1.5 flex items-center gap-1 text-${channel.color}-500`}>
                     <ArrowUpRight size={12} /> {channel.change}
                   </span>
                 </div>
              </CardContent>
           </Card>
         ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Main Growth Chart */}
        <Card className="lg:col-span-8 bg-zinc-900 border-zinc-800 shadow-2xl overflow-hidden rounded-[2.5rem]">
           <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-800 pb-8 bg-zinc-950/20 px-8 py-8">
              <div>
                 <CardTitle className="text-xl font-black italic uppercase tracking-tighter">Fiscal Trajectory</CardTitle>
                 <CardDescription className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Aggregated performance across {distribution.total} partners.</CardDescription>
              </div>
              <div className="flex gap-2">
                 <Badge variant="outline" className="h-7 border-zinc-800 text-zinc-500 font-bold px-3">Aggregated</Badge>
                 <Badge className="h-7 bg-emerald-500/10 text-emerald-500 border-none font-black px-3 italic">Live Node</Badge>
              </div>
           </CardHeader>
           <CardContent className="p-10">
              <div className="h-[350px] w-full flex items-end justify-between gap-2 px-4 relative">
                 <div className="absolute inset-x-0 top-0 h-[300px] flex flex-col justify-between opacity-5 pointer-events-none px-4">
                    <div className="w-full border-t border-zinc-500" />
                    <div className="w-full border-t border-zinc-500" />
                    <div className="w-full border-t border-zinc-500" />
                    <div className="w-full border-t border-zinc-500" />
                 </div>

                 {monthlyData.map((d: any, i: any) => {
                   const height = (d.value / maxVal) * 100;
                   return (
                    <div key={i} className="flex-1 group relative h-[300px] flex flex-col justify-end">
                        <div className="absolute bottom-0 w-full h-full bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-all rounded-t-xl" />
                        <div 
                          className={`w-[70%] mx-auto transition-all duration-700 rounded-t-lg relative z-10 ${i === 11 ? 'bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'bg-emerald-500/20 group-hover:bg-emerald-500/40'}`} 
                          style={{ height: `${Math.max(height, 5)}%` }}
                        >
                           <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-3 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 whitespace-nowrap">
                              <Badge className="bg-zinc-950 border-zinc-800 text-white text-[10px] font-black px-3 py-1 shadow-2xl">${d.value.toLocaleString()}</Badge>
                           </div>
                        </div>
                        <span className="text-[10px] font-black text-zinc-700 uppercase tracking-tighter text-center mt-4 group-hover:text-emerald-500 transition-colors">{d.month}</span>
                    </div>
                   );
                 })}
              </div>
           </CardContent>
        </Card>

        {/* Breakdown Panel */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="bg-zinc-900 border-zinc-800 shadow-2xl rounded-[2.5rem]">
              <CardHeader className="pb-6 p-8">
                 <div className="flex items-center gap-2 mb-1">
                    <PieChart size={18} className="text-blue-500" />
                    <CardTitle className="text-base font-black italic uppercase">Partner Distribution</CardTitle>
                 </div>
                 <CardDescription className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Market share by clearance level.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-8 pt-0">
                 {[
                   { label: 'Basic Node', val: distribution.BASIC, pct: `${((distribution.BASIC / (distribution.total || 1)) * 100).toFixed(0)}%`, color: 'emerald' },
                   { label: 'Pro Relay', val: distribution.PRO, pct: `${((distribution.PRO / (distribution.total || 1)) * 100).toFixed(0)}%`, color: 'blue' },
                   { label: 'Enterprise Core', val: distribution.ENTERPRISE, pct: `${((distribution.ENTERPRISE / (distribution.total || 1)) * 100).toFixed(0)}%`, color: 'purple' }
                 ].map((tier: any, i: any) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                         <span className="flex items-center gap-2"><div className={`h-1.5 w-1.5 rounded-full bg-${tier.color}-500`} /> {tier.label}</span>
                         <span className={`text-${tier.color}-500 italic`}>{tier.val} units</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-900">
                         <div className={`h-full bg-${tier.color}-500 shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-1000`} style={{ width: tier.pct }} />
                      </div>
                   </div>
                 ))}
              </CardContent>
           </Card>

           <Card className="bg-emerald-500 border-none shadow-2xl cursor-help group rounded-[2.5rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                 <Activity size={120} className="text-zinc-950" />
              </div>
              <CardContent className="p-8 relative z-10">
                 <div className="bg-zinc-950/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                    <Target size={24} className="text-zinc-950" />
                 </div>
                 <h4 className="text-xl font-black text-zinc-950 italic uppercase leading-none mb-3">Platform Apex</h4>
                 <p className="text-zinc-950/70 text-[10px] font-black leading-relaxed uppercase tracking-widest">Growth metrics indicate an 11% acceleration in node acquisition. Recommended action: Expand broadcast capacity.</p>
                 <Button className="w-full mt-8 bg-zinc-950 text-white hover:bg-zinc-900 rounded-2xl font-black uppercase tracking-widest text-[10px] h-14 shadow-2xl">Refine Growth Strategy</Button>
              </CardContent>
           </Card>
        </div>
      </div>

      {/* Audit Feed */}
      <Card className="bg-zinc-900 border-zinc-800 shadow-2xl overflow-hidden rounded-[2.5rem]">
         <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-800 pb-8 p-8 bg-zinc-950/20">
            <div>
               <CardTitle className="text-xl font-black italic uppercase tracking-tighter">Settlement Ledger</CardTitle>
               <CardDescription className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Platform-wide real-time fiscal sync.</CardDescription>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-2xl px-5 h-12 w-72 text-zinc-500 font-sans focus-within:border-emerald-500/50 transition-all">
                  <Search size={16} />
                  <input type="text" placeholder="Search settlement nodes..." className="bg-transparent border-none outline-none text-xs ml-3 w-full text-white font-bold" />
               </div>
            </div>
         </CardHeader>
         <CardContent className="p-0">
            <div className="divide-y divide-zinc-900 text-[11px]">
               {recentTransactions.length === 0 ? (
                 <div className="py-20 text-center opacity-20 flex flex-col items-center gap-4">
                    <Zap size={40} />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">No recent settlements detected.</p>
                 </div>
               ) : (
                 recentTransactions.map((tx: any, i: any) => (
                    <div key={tx.id} className="px-8 py-6 flex items-center justify-between hover:bg-zinc-800/20 transition-all group cursor-pointer">
                       <div className="flex items-center gap-6">
                          <div className="h-10 w-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-emerald-500 shadow-inner group-hover:scale-110 transition-transform">
                             <DollarSign size={18} />
                          </div>
                          <div className="space-y-1">
                             <div className="flex items-center gap-3">
                                <span className="font-black uppercase tracking-widest text-white italic">{tx.vendor.businessName}</span>
                                <Badge className="bg-zinc-950 text-zinc-500 border-zinc-800 text-[8px] font-black px-2 py-0">Tier: {tx.plan}</Badge>
                             </div>
                             <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">
                                <span className="font-sans italic">{new Date(tx.createdAt).toLocaleString()}</span>
                                <span className="opacity-30">|</span>
                                <span className="italic">Ref: {tx.id.substring(0, 12).toUpperCase()}</span>
                             </div>
                          </div>
                       </div>
                       <div className="flex items-center gap-6">
                          <span className="text-emerald-500 font-black italic tracking-widest text-lg">+${tx.amount.toLocaleString()}</span>
                          <button className="h-10 w-10 flex items-center justify-center bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-700 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                             <Download size={16} />
                          </button>
                       </div>
                    </div>
                 ))
               )}
            </div>
            <div className="p-6 bg-zinc-950/50 border-t border-zinc-800 text-center">
               <Button variant="link" className="text-zinc-600 hover:text-emerald-500 text-[10px] font-black uppercase tracking-widest italic no-underline transition-colors">
                  Load full platform audit trajectory <ChevronRight size={14} className="ml-1 inline" />
               </Button>
            </div>
         </CardContent>
      </Card>
    </div>
  );
}
