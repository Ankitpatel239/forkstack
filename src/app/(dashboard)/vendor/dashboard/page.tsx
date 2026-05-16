'use client';

import { useState, useEffect } from 'react';
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
  Calendar,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getVendorFeatures } from '@/app/actions/vendor-subscription';

export default function VendorDashboard() {
  const [features, setFeatures] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatures() {
      const result = await getVendorFeatures();
      if (result.success && result.data) {
        setFeatures(result.data.features || []);
      }
      setLoading(false);
    }
    loadFeatures();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Synchronizing Dashboard Nodes...</p>
      </div>
    );
  }

  const hasOrders = features.some(f => ['QR_ORDERING', 'DIGITAL_MENU', 'AUTO_RENEWAL', 'DIET_PREFERENCES'].includes(f));
  const hasAnalytics = features.includes('BASIC_ANALYTICS') || features.includes('ADVANCED_REPORTS');
  const hasInventory = features.includes('INVENTORY_SYNC');

  const stats = [
    { title: 'Gross Revenue', value: '$12,482.00', change: '+14%', icon: DollarSign, color: 'emerald', show: true },
    { title: 'Total Orders', value: '842', change: '+22%', icon: ShoppingBag, color: 'blue', show: hasOrders },
    { title: 'Avg. Ticket', value: '$14.80', change: '+5%', icon: Zap, color: 'orange', show: hasOrders },
    { title: 'New Customers', value: '124', change: '+18%', icon: Users, color: 'purple', show: true },
  ].filter(s => s.show);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2 italic uppercase">Morning, Chef!</h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2 text-xs uppercase tracking-wider">
            <Calendar size={14} className="text-emerald-500" /> Here's what's happening at your venue today.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-muted border border-border p-1 rounded-xl">
          <Button variant="ghost" size="sm" className="rounded-lg text-[10px] font-black uppercase bg-background text-foreground shadow-sm px-4">Today</Button>
          <Button variant="ghost" size="sm" className="rounded-lg text-[10px] font-black uppercase text-muted-foreground hover:text-foreground px-4">7 Days</Button>
          <Button variant="ghost" size="sm" className="rounded-lg text-[10px] font-black uppercase text-muted-foreground hover:text-foreground px-4">30 Days</Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat: any, i: any) => (
          <Card key={i} className="bg-card border-border shadow-lg relative overflow-hidden group hover:border-emerald-500/20 transition-all rounded-[2.5rem]">
            <div className={`absolute top-0 right-0 p-4 opacity-5 -mr-4 -mt-4 text-${stat.color}-500 group-hover:opacity-10 transition-opacity`}>
              <stat.icon size={80} />
            </div>
            <CardHeader className="pb-2 p-8">
              <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center justify-between mb-2">
                {stat.title}
                <stat.icon size={14} className={`text-${stat.color}-500`} />
              </CardDescription>
              <CardTitle className="text-3xl font-black text-foreground italic">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-500/10 text-emerald-500 border-none h-5 text-[10px] px-2 font-black italic">
                   {stat.change}
                </Badge>
                <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest italic">vs yesterday</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Sales Performance */}
        {hasAnalytics && (
          <Card className="lg:col-span-8 bg-card border-border shadow-xl rounded-[2.5rem]">
            <CardHeader className="flex flex-row items-center justify-between pb-8 p-10">
              <div>
                <CardTitle className="text-lg font-black uppercase italic tracking-tighter">Sales Performance</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Live hourly revenue tracking.</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl border-border h-10 px-6 text-[10px] font-black uppercase tracking-widest hover:bg-muted italic">
                Full Analytics
              </Button>
            </CardHeader>
            <CardContent className="p-10 pt-0">
              <div className="h-[250px] w-full flex items-end justify-between gap-1 md:gap-3 px-2">
                {[30, 45, 25, 60, 85, 40, 55, 95, 70, 45, 30, 20, 15, 40, 60, 80, 55].map((h: any, i: any) => (
                  <div key={i} className="flex-1 group relative h-full flex flex-col justify-end">
                    <div 
                      className={`w-full transition-all rounded-t-lg ${i === 7 ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-muted group-hover:bg-muted-foreground/20'}`} 
                      style={{ height: `${h}%` }}
                    />
                    {i % 4 === 0 && <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-black text-muted-foreground uppercase italic">{i+8}h</span>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Live Orders Mini-Feed */}
        {hasOrders ? (
          <Card className={`lg:col-span-4 bg-card border-border shadow-xl overflow-hidden flex flex-col rounded-[2.5rem] ${!hasAnalytics ? 'lg:col-span-12' : ''}`}>
            <CardHeader className="border-b border-border pb-6 p-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <CardTitle className="text-lg font-black uppercase italic tracking-tighter">Live Orders</CardTitle>
                </div>
                <Badge variant="outline" className="text-[9px] font-black border-border text-muted-foreground px-3 uppercase tracking-widest italic">8 Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto custom-scrollbar max-h-[400px]">
              <div className="divide-y divide-border">
                {[
                  { table: '04', items: 3, time: '2m', status: 'preparing', price: '₹1,240' },
                  { table: '12', items: 5, time: '5m', status: 'ready', price: '₹4,890' },
                  { table: '08', items: 2, time: '8m', status: 'preparing', price: '₹850' },
                  { table: '02', items: 1, time: '12m', status: 'preparing', price: '₹420' },
                  { table: '15', items: 4, time: '15m', status: 'preparing', price: '₹2,640' },
                ].map((order, i) => (
                  <div key={i} className="px-10 py-5 hover:bg-muted/50 transition-colors flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center font-black text-xs text-foreground italic shadow-inner">
                        T{order.table}
                      </div>
                      <div>
                        <h6 className="text-sm font-black text-foreground italic uppercase">{order.items} Items</h6>
                        <p className="text-[9px] text-muted-foreground font-bold flex items-center gap-1 uppercase tracking-widest mt-1">
                          <Clock size={10} className="text-zinc-600" /> {order.time} ago • <span className={order.status === 'ready' ? 'text-emerald-500 font-black' : 'text-orange-500 animate-pulse font-black'}>{order.status}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-foreground mb-1 italic">{order.price}</p>
                      <button className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-all">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="p-8 border-t border-border bg-muted/30">
              <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/5 h-12 rounded-xl italic">
                Kitchen Command Hub
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="lg:col-span-4 bg-zinc-900/30 border-border border-dashed shadow-xl rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center group">
            <div className="h-16 w-16 rounded-[2rem] bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-700 mb-6 group-hover:scale-110 transition-transform">
               <Zap size={32} />
            </div>
            <h4 className="text-lg font-black text-white italic uppercase tracking-tighter mb-2">Order Node Offline</h4>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest italic max-w-[200px]">Upgrade your subscription to activate live order orchestration.</p>
            <Button variant="outline" className="mt-8 h-12 px-8 rounded-xl border-zinc-800 text-zinc-500 hover:text-emerald-500 font-black uppercase text-[10px] tracking-widest italic">
              View Plans
            </Button>
          </Card>
        )}
      </div>

      {/* Strategy & Alerts */}
      <div className="grid gap-6 md:grid-cols-3">
        {features.includes('QR_ORDERING') && (
          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-700 border-none shadow-xl group cursor-pointer overflow-hidden relative rounded-[2.5rem]">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
              <QrCode size={120} />
            </div>
            <CardContent className="p-10 pt-12 relative z-10 text-white">
              <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center mb-6">
                <QrCode size={20} />
              </div>
              <h4 className="text-xl font-black tracking-tight mb-2 italic uppercase">QR Campaign Manager</h4>
              <p className="text-white/70 text-[10px] font-black uppercase tracking-widest leading-relaxed italic">Generate smart QR codes for tables or takeaway marketing.</p>
            </CardContent>
          </Card>
        )}

        {hasInventory && (
          <Card className="bg-card border-border hover:border-emerald-500/30 shadow-xl transition-all cursor-pointer group rounded-[2.5rem]">
            <CardContent className="p-10">
              <div className="bg-emerald-500/10 w-10 h-10 rounded-xl flex items-center justify-center mb-6 text-emerald-500">
                <AlertCircle size={20} />
              </div>
              <h4 className="text-xl font-black tracking-tight text-foreground mb-2 italic uppercase">Inventory Pulse</h4>
              <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest leading-relaxed italic">
                <span className="text-emerald-500">4 active alerts</span>. Some items are below critical buffer levels.
              </p>
            </CardContent>
          </Card>
        )}

        {features.includes('TEAM_MANAGEMENT') && (
          <Card className="bg-card border-border hover:border-blue-500/30 shadow-xl transition-all cursor-pointer group rounded-[2.5rem]">
            <CardContent className="p-10">
              <div className="bg-blue-500/10 w-10 h-10 rounded-xl flex items-center justify-center mb-6 text-blue-500">
                <CheckCircle2 size={20} />
              </div>
              <h4 className="text-xl font-black tracking-tight text-foreground mb-2 italic uppercase">Operation Sync</h4>
              <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest leading-relaxed italic">
                <span className="text-blue-500">12/12 staff members</span> are currently synced with the kitchen node.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Trending Items Section */}
      {hasOrders && (
        <Card className="bg-card border-border shadow-xl rounded-[2.5rem]">
          <CardHeader className="p-10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-black uppercase italic tracking-tighter">Trending This Week</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Highest velocity items in your catalog.</CardDescription>
              </div>
              <TrendingUp size={24} className="text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent className="p-10 pt-0">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { name: 'Truffle Mushroom Risotto', orders: 142, revenue: '₹42,600', trend: '+12%' },
                { name: 'Spiced Paneer Tikka', orders: 208, revenue: '₹31,200', trend: '+28%' },
                { name: 'Classic Mojito', orders: 85, revenue: '₹12,750', trend: '-5%' },
                { name: 'Belgian Chocolate Waffle', orders: 114, revenue: '₹17,100', trend: '+15%' },
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-[2rem] bg-zinc-950/50 border border-border group hover:bg-emerald-500/5 transition-all cursor-pointer">
                  <p className="text-[8px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-2">Performance Node</p>
                  <h5 className="font-black text-sm mb-4 truncate text-foreground italic uppercase tracking-tighter">{item.name}</h5>
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-black text-foreground italic uppercase tracking-widest">{item.orders} Sold</div>
                    <Badge variant="ghost" className={`text-[10px] font-black italic ${item.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                      {item.trend}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

