import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  DollarSign, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  QrCode,
  Zap,
  MoreVertical,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function VendorDashboard() {
  const stats = [
    { title: 'Gross Revenue', value: '$12,482.00', change: '+14%', icon: DollarSign, color: 'emerald' },
    { title: 'Total Orders', value: '842', change: '+22%', icon: ShoppingBag, color: 'blue' },
    { title: 'Avg. Ticket', value: '$14.80', change: '+5%', icon: Zap, color: 'orange' },
    { title: 'New Customers', value: '124', change: '+18%', icon: Users, color: 'purple' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Morning, Chef!</h1>
          <p className="text-zinc-500 font-medium flex items-center gap-2">
            <Calendar size={14} /> Here's what's happening at your venue today.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
          <Button variant="ghost" size="sm" className="rounded-lg text-xs font-bold bg-zinc-800 text-white">Today</Button>
          <Button variant="ghost" size="sm" className="rounded-lg text-xs font-bold text-zinc-500">7 Days</Button>
          <Button variant="ghost" size="sm" className="rounded-lg text-xs font-bold text-zinc-500">30 Days</Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat: any, i: any) => (
          <Card key={i} className="bg-zinc-900/40 border-zinc-800 shadow-xl relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-4 opacity-5 -mr-4 -mt-4 text-${stat.color}-500 group-hover:opacity-10 transition-opacity`}>
              <stat.icon size={80} />
            </div>
            <CardHeader className="pb-2">
              <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center justify-between">
                {stat.title}
                <stat.icon size={14} className={`text-${stat.color}-500`} />
              </CardDescription>
              <CardTitle className="text-3xl font-black text-white">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-500/10 text-emerald-500 border-none h-5 text-[10px] px-1.5">
                  <ArrowUpRight size={10} className="mr-0.5" /> {stat.change}
                </Badge>
                <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight">vs yesterday</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Sales Performance */}
        <Card className="lg:col-span-8 bg-zinc-900/40 border-zinc-800 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-8">
            <div>
              <CardTitle className="text-lg font-bold">Sales Performance</CardTitle>
              <CardDescription>Live hourly revenue tracking.</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="rounded-lg border-zinc-800 h-8 text-[10px] font-black uppercase tracking-widest">
              Full Analytics
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-end justify-between gap-1 md:gap-3 px-2">
              {[30, 45, 25, 60, 85, 40, 55, 95, 70, 45, 30, 20, 15, 40, 60, 80, 55].map((h: any, i: any) => (
                <div key={i} className="flex-1 group relative h-full flex flex-col justify-end">
                  <div 
                    className={`w-full transition-all rounded-t-sm ${i === 7 ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-zinc-800 group-hover:bg-zinc-700'}`} 
                    style={{ height: `${h}%` }}
                  />
                  {i % 4 === 0 && <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-zinc-600">{i+8}h</span>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Orders Mini-Feed */}
        <Card className="lg:col-span-4 bg-zinc-900/40 border-zinc-800 shadow-2xl overflow-hidden flex flex-col">
          <CardHeader className="border-b border-zinc-800/50 pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <CardTitle className="text-lg font-bold">Live Orders</CardTitle>
              </div>
              <Badge variant="outline" className="text-[10px] border-zinc-800 text-zinc-500">8 Active</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto custom-scrollbar">
            <div className="divide-y divide-zinc-800/50">
              {[
                { table: '04', items: 3, time: '2m', status: 'preparing', price: '$42.10' },
                { table: '12', items: 5, time: '5m', status: 'ready', price: '$89.00' },
                { table: '08', items: 2, time: '8m', status: 'preparing', price: '$18.50' },
                { table: '02', items: 1, time: '12m', status: 'preparing', price: '$9.20' },
                { table: '15', items: 4, time: '15m', status: 'preparing', price: '$56.40' },
              ].map((order, i) => (
                <div key={i} className="px-6 py-4 hover:bg-zinc-800/30 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-black text-xs">
                      T{order.table}
                    </div>
                    <div>
                      <h6 className="text-sm font-bold text-zinc-100">{order.items} Items</h6>
                      <p className="text-[10px] text-zinc-500 font-medium flex items-center gap-1 uppercase tracking-tighter">
                        <Clock size={10} /> {order.time} ago • <span className={order.status === 'ready' ? 'text-emerald-500' : 'text-orange-500'}>{order.status}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-white mb-1">{order.price}</p>
                    <button className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-white transition-all">
                      <MoreVertical size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <div className="p-4 border-t border-zinc-800/50 bg-zinc-950/30">
            <Button variant="ghost" className="w-full text-xs font-bold text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/5 h-8">
              Open Kitchen KDS
            </Button>
          </div>
        </Card>
      </div>

      {/* Quick Actions / Integration */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-700 border-none shadow-xl group cursor-pointer overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
            <QrCode size={120} />
          </div>
          <CardContent className="p-8 pt-12 relative z-10 text-zinc-950">
            <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <QrCode size={20} />
            </div>
            <h4 className="text-xl font-black tracking-tight mb-2">Generate QR Menu</h4>
            <p className="text-zinc-900/60 text-sm font-bold leading-snug">Instant link for customers to browse & order from their phone.</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 shadow-xl transition-all cursor-pointer group">
          <CardContent className="p-8">
            <div className="bg-emerald-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-emerald-500">
              <AlertCircle size={20} />
            </div>
            <h4 className="text-xl font-black tracking-tight text-white mb-2">Inventory Alert</h4>
            <p className="text-zinc-500 text-sm font-medium leading-snug">
              <span className="text-emerald-500 font-bold">4 items</span> are running low on stock. Update your inventory now.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 shadow-xl transition-all cursor-pointer group">
          <CardContent className="p-8">
            <div className="bg-blue-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-blue-500">
              <CheckCircle2 size={20} />
            </div>
            <h4 className="text-xl font-black tracking-tight text-white mb-2">Staff Attendance</h4>
            <p className="text-zinc-500 text-sm font-medium leading-snug">
              <span className="text-blue-500 font-bold">12/12 members</span> are clocked in and active for this shift.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

