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
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AdminReportsPage() {
  const channelData = [
    { label: 'QR Ordering', value: '$84,200', change: '+22.4%', color: 'emerald' },
    { label: 'Direct Parcel', value: '$25,120', change: '+4.2%', color: 'blue' },
    { label: 'Platform Fees', value: '$15,272', change: '+12.8%', color: 'purple' }
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 italic">Platform Fiscal Intelligence</h1>
          <p className="text-zinc-500 font-medium">Deep-dive into multi-tier revenue streams and growth vectors.</p>
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

      <div className="grid gap-6 md:grid-cols-3">
         {channelData.map((channel: any, i: any) => (
           <Card key={i} className="bg-zinc-900/40 border-zinc-800 shadow-2xl relative overflow-hidden group">
              <div className={`absolute top-0 right-0 p-6 opacity-5 -mr-4 -mt-4 text-${channel.color}-500 transform group-hover:scale-125 transition-transform`}>
                 <Zap size={100} />
              </div>
              <CardHeader className="pb-2">
                 <CardDescription className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">Channel performance</CardDescription>
                 <CardTitle className="text-sm font-bold text-white">{channel.label}</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="flex items-end gap-3">
                   <h3 className="text-3xl font-black text-white">{channel.value}</h3>
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
        <Card className="lg:col-span-8 bg-zinc-900 border-zinc-800 shadow-2xl overflow-hidden">
           <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-900 pb-8 bg-zinc-950/20">
              <div>
                 <CardTitle className="text-lg font-extrabold italic">Global Revenue Trajectory</CardTitle>
                 <CardDescription className="text-[10px] font-bold uppercase tracking-tighter">Aggregated performance across 1,284 vendors.</CardDescription>
              </div>
              <div className="flex gap-2">
                 <Badge variant="outline" className="h-6 border-zinc-800 text-zinc-500">Volume</Badge>
                 <Badge className="h-6 bg-emerald-500/10 text-emerald-500 border-none">Profit</Badge>
              </div>
           </CardHeader>
           <CardContent className="pt-10">
              <div className="h-[300px] w-full flex items-end justify-between gap-1 px-4 relative">
                 {/* Decorative Grid Lines */}
                 <div className="absolute inset-x-0 top-0 h-full flex flex-col justify-between opacity-10 pointer-events-none px-4">
                    <div className="w-full border-t border-zinc-600" />
                    <div className="w-full border-t border-zinc-600" />
                    <div className="w-full border-t border-zinc-600" />
                    <div className="w-full border-t border-zinc-600" />
                 </div>

                 {[45, 60, 50, 85, 95, 75, 55, 60, 85, 100, 90, 80].map((h: any, i: any) => (
                   <div key={i} className="flex-1 group relative h-full flex flex-col justify-end">
                      <div className="absolute bottom-0 w-full h-full bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors rounded-t-lg" />
                      <div 
                        className={`w-[60%] mx-auto transition-all rounded-t-md relative z-10 ${i === 9 ? 'bg-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.3)]' : 'bg-emerald-500/30 group-hover:bg-emerald-500/50'}`} 
                        style={{ height: `${h}%` }}
                      >
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            <Badge className="bg-zinc-950 border-zinc-800 text-white text-[9px] font-black">${(h*1.2).toFixed(1)}k</Badge>
                         </div>
                      </div>
                      <span className="text-[9px] font-black text-zinc-600 uppercase tracking-tighter text-center mt-3">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
                   </div>
                 ))}
              </div>
           </CardContent>
        </Card>

        {/* Breakdown Panel */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="bg-zinc-900 border-zinc-800 shadow-2xl">
              <CardHeader className="pb-4">
                 <div className="flex items-center gap-2 mb-1">
                    <PieChart size={16} className="text-blue-500" />
                    <CardTitle className="text-sm font-bold tracking-tight">Tier Distribution</CardTitle>
                 </div>
                 <CardDescription className="text-[10px] font-bold uppercase italic leading-none">Market share by plan type.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 {[
                   { label: 'Basic', val: '542', pct: '42%', color: 'emerald' },
                   { label: 'Pro', val: '412', pct: '32%', color: 'blue' },
                   { label: 'Enterprise', val: '330', pct: '26%', color: 'purple' }
                 ].map((tier: any, i: any) => (
                   <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-zinc-500">
                         <span>{tier.label}</span>
                         <span className={`text-${tier.color}-500 italic`}>{tier.pct}</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden">
                         <div className={`h-full bg-${tier.color}-500 shadow-[0_0_10px_rgba(59,130,246,0.2)]`} style={{ width: tier.pct }} />
                      </div>
                   </div>
                 ))}
              </CardContent>
           </Card>

           <Card className="bg-gradient-to-br from-emerald-500 to-emerald-700 border-none shadow-xl cursor-help group">
              <CardContent className="p-6">
                 <div className="bg-zinc-950/20 w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-12">
                    <Target size={20} className="text-zinc-950" />
                 </div>
                 <h4 className="text-lg font-black text-zinc-950 italic leading-none mb-2">Platform Milestone</h4>
                 <p className="text-zinc-950/60 text-xs font-bold leading-relaxed uppercase tracking-tighter">Your platform is 8% ahead of the monthly strategic target. Deploy the next enterprise expansion wave.</p>
                 <Button className="w-full mt-6 bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl font-black uppercase tracking-widest text-[9px] h-10">Review Strategy</Button>
              </CardContent>
           </Card>
        </div>
      </div>

      {/* Audit Feed */}
      <Card className="bg-zinc-900 border-zinc-800 shadow-2xl overflow-hidden">
         <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-800 pb-6">
            <div>
               <CardTitle className="text-lg font-extrabold italic">Recent Logged Sessions</CardTitle>
               <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Platform-wide activity log.</CardDescription>
            </div>
            <div className="flex items-center gap-3">
               <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl px-3 h-10 w-64 text-zinc-500 font-sans">
                  <Search size={14} />
                  <input type="text" placeholder="Search audit logs..." className="bg-transparent border-none outline-none text-[11px] ml-2 w-full text-white" />
               </div>
            </div>
         </CardHeader>
         <CardContent className="p-0">
            <div className="divide-y divide-zinc-800 text-[11px]">
               {[1, 2, 3, 4, 5].map((i: any) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-zinc-800/10 transition-colors group">
                     <div className="flex items-center gap-4">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                        <span className="font-sans text-zinc-500">Today, 10:2{i} AM</span>
                        <span className="font-black uppercase tracking-widest text-zinc-300">Revenue Settlement</span>
                        <span className="text-zinc-500 italic">#{Math.random().toString(36).substring(7).toUpperCase()}</span>
                     </div>
                     <div className="flex items-center gap-4">
                        <span className="text-emerald-500 font-black italic tracking-widest">+$4,28{i}.00</span>
                        <button className="p-1 text-zinc-700 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                           <Download size={14} />
                        </button>
                     </div>
                  </div>
               ))}
            </div>
            <div className="p-4 bg-zinc-950/30 border-t border-zinc-800 text-center">
               <Button variant="link" className="text-zinc-600 hover:text-white text-[10px] font-black uppercase tracking-widest italic no-underline">
                  Load Full platform Audit History
               </Button>
            </div>
         </CardContent>
      </Card>
    </div>
  );
}
