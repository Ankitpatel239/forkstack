import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Users, 
  Store, 
  DollarSign, 
  TrendingUp, 
  Activity, 
  PlusCircle, 
  MoreHorizontal,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
  const stats = [
    { name: 'Total Vendors', value: '1,284', change: '+12.5%', icon: Store, trend: 'up' },
    { name: 'Platform Revenue', value: '$124,592', change: '+18.2%', icon: DollarSign, trend: 'up' },
    { name: 'Active Subscriptions', value: '1,102', change: '+4.3%', icon: Activity, trend: 'up' },
    { name: 'Customer Retention', value: '94.2%', change: '-0.4%', icon: Users, trend: 'down' },
  ];

  const recentVendors = [
    { name: 'The Golden Crust', owner: 'John Smith', plan: 'Pro', status: 'Active', revenue: '$1,240' },
    { name: 'Skyline Sushi', owner: 'Akira Tanaka', plan: 'Enterprise', status: 'Pending', revenue: '$0' },
    { name: 'Brew & Batch', owner: 'Emma Wilson', plan: 'Basic', status: 'Active', revenue: '$480' },
    { name: 'Urban Greens', owner: 'David Chen', plan: 'Pro', status: 'Active', revenue: '$920' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">Platform Command</h1>
          <p className="text-zinc-500 font-medium">Real-time overview of your multi-vendor ecosystem.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800">
            Export Logs
          </Button>
          <Button className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold shadow-lg shadow-emerald-500/20">
            <PlusCircle className="w-4 h-4 mr-2" /> Add Vendor
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat: any, i: any) => (
          <Card key={i} className="bg-zinc-900/30 border-zinc-800 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-3 opacity-5 -mr-4 -mt-4 group-hover:opacity-10 transition-opacity">
              <stat.icon size={120} />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-zinc-500">
                {stat.name}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.trend === 'up' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                <stat.icon size={16} className={stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-bold flex items-center ${stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {stat.trend === 'up' ? <ArrowUpRight size={12} className="mr-0.5" /> : <ArrowDownRight size={12} className="mr-0.5" />}
                  {stat.change}
                </span>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">vs last week</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Main Chart Area */}
        <Card className="lg:col-span-8 bg-zinc-900/40 border-zinc-800 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Revenue Distribution</CardTitle>
              <CardDescription>Visualizing growth across various vendor tiers.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Monthly</Badge>
              <Badge variant="outline" className="border-zinc-800 text-zinc-500">Yearly</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full flex flex-col justify-end gap-2 pt-10">
              <div className="flex items-end justify-between h-full gap-2 px-2">
                {[40, 65, 45, 90, 75, 55, 85, 40, 60, 80, 50, 70].map((h: number, i: number) => (
                  <div key={i} className="flex-1 group relative">
                    <div 
                      className="w-full bg-zinc-800 group-hover:bg-emerald-500/40 transition-all rounded-t-sm" 
                      style={{ height: `${h}%` }}
                    />
                    {i === 3 && (
                      <div className="absolute bottom-0 w-full bg-emerald-500 rounded-t-sm h-[90%] shadow-[0_0_20px_rgba(16,185,129,0.3)]" />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between px-2 text-[10px] font-bold text-zinc-600 uppercase tracking-tighter mt-4">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Activity */}
        <Card className="lg:col-span-4 bg-zinc-900/40 border-zinc-800 shadow-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Platform Status</CardTitle>
            <CardDescription>Live health & service updates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-emerald-500 flex items-center justify-center text-zinc-950">
                <ShieldCheck size={20} />
              </div>
              <div className="flex-1">
                <h5 className="text-xs font-black uppercase text-emerald-500 mb-0.5">All Systems Operational</h5>
                <p className="text-[10px] text-zinc-400">Next maintenance in 12 days</p>
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Active Sessions</h5>
              {[
                 { label: 'QR Engine', val: '99.9%', color: 'emerald' },
                 { label: 'WA Relays', val: '94.2%', color: 'blue' },
                 { label: 'Auth Gate', val: '100%', color: 'emerald' }
              ].map((s: any, i: number) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                    <span className="text-zinc-400">{s.label}</span>
                    <span className={s.color === 'emerald' ? 'text-emerald-500' : 'text-blue-500'}>{s.val}</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className={`h-full bg-${s.color}-500 opacity-60`} style={{ width: s.val }} />
                  </div>
                </div>
              ))}
            </div>

            <Button variant="ghost" className="w-full rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/50 text-xs font-bold uppercase border border-dashed border-zinc-800 h-10 mt-4">
              View Detailed System Logs
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Vendor Table Area */}
      <Card className="bg-zinc-900/40 border-zinc-800 shadow-2xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-900 pb-6">
          <div>
            <CardTitle className="text-xl font-bold">Recent Vendor Pulse</CardTitle>
            <CardDescription>Direct insight into the latest partnerships.</CardDescription>
          </div>
          <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-500 w-64">
            <Search size={14} />
            <input type="text" placeholder="Search vendors..." className="bg-transparent border-none outline-none text-xs ml-2 w-full" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-950/50 text-[10px] uppercase font-black tracking-[0.2em] text-zinc-600 border-b border-zinc-900">
              <tr>
                <th className="px-6 py-4">Brand</th>
                <th className="px-6 py-4">Account Holder</th>
                <th className="px-6 py-4">Subscription</th>
                <th className="px-6 py-4">Monthly Rev</th>
                <th className="px-6 py-4 text-center">Lifecycle</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {recentVendors.map((vendor: any, i: number) => (
                <tr key={i} className="hover:bg-zinc-800/20 transition-colors group">
                  <td className="px-6 py-5 font-bold text-zinc-100">{vendor.name}</td>
                  <td className="px-6 py-5 text-zinc-400 font-medium">{vendor.owner}</td>
                  <td className="px-6 py-5 underline underline-offset-4 decoration-emerald-500/20 text-zinc-300">{vendor.plan}</td>
                  <td className="px-6 py-5 text-emerald-500 font-bold tracking-tighter">{vendor.revenue}</td>
                  <td className="px-6 py-5 text-center">
                    <Badge className={
                      vendor.status === 'Active' 
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20' 
                        : 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20 hover:bg-zinc-500/20'
                    }>
                      {vendor.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:text-white text-zinc-500 transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 border-t border-zinc-900 text-center">
             <Button variant="link" className="text-zinc-500 hover:text-emerald-400 text-xs font-bold uppercase tracking-widest no-underline">
               View All 1,284 Vendors Across Platform
             </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
