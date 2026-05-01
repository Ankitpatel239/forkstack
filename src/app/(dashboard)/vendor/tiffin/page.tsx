import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Utensils, 
  Truck, 
  TrendingUp, 
  Calendar, 
  Plus, 
  ArrowRight,
  MoreVertical,
  CheckCircle2,
  Clock,
  Share2,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getVendorByUserId, getTiffinStats, getTiffinMenu, getTiffinSubscriptions } from '@/app/actions/tiffin';
import { TiffinMealType } from '@/types/tiffin';
import { startOfDay } from 'date-fns';
import { AddSubscriptionDialog } from '@/components/vendor/tiffin/AddSubscriptionDialog';
import { ShareShopButton } from '@/components/vendor/tiffin/ShareShopButton';

export default async function TiffinOverviewPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const vendor = await getVendorByUserId(user.id);
  if (!vendor) return <div>No vendor profile found.</div>;

  const statsData = await getTiffinStats(vendor.id);
  const today = startOfDay(new Date());
  
  const [lunchMenu, dinnerMenu, subscriptions] = await Promise.all([
    getTiffinMenu(vendor.id, today, TiffinMealType.LUNCH),
    getTiffinMenu(vendor.id, today, TiffinMealType.DINNER),
    getTiffinSubscriptions(vendor.id)
  ]);

  const stats = [
    { title: 'Active Subscribers', value: statsData.activeSubs, change: '+12%', icon: <Users className="h-5 w-5" />, color: 'emerald' },
    { title: 'Deliveries Today', value: `${statsData.completedToday}/${statsData.deliveriesToday}`, change: 'Live progress', icon: <Truck className="h-5 w-5" />, color: 'blue' },
    { title: 'GPS Coverage', value: `${Math.round((subscriptions.filter(s => s.latitude).length / (subscriptions.length || 1)) * 100)}%`, change: 'Pinned locations', icon: <MapPin className="h-5 w-5" />, color: 'purple' },
    { title: 'Active Plans', value: statsData.totalPlans, change: 'Plans live', icon: <Utensils className="h-5 w-5" />, color: 'amber' },
  ];

  const recentSubscriptions = subscriptions.slice(0, 3).map(sub => ({
    id: sub.id,
    customer: sub.customer.name,
    plan: sub.planNameSnapshot || sub.plan.name,
    date: 'Recent',
    status: sub.status
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="glass border-border/50 hover:border-emerald-500/50 transition-all group overflow-hidden relative">
             <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-${stat.color}-500/5 rounded-full blur-2xl group-hover:bg-${stat.color}-500/10 transition-all`} />
             <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{stat.title}</CardTitle>
              <div className={`p-2 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-500 ring-1 ring-${stat.color}-500/20`}>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tighter">{stat.value}</div>
              <p className="text-xs font-bold text-emerald-500 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Menu Section */}
        <Card className="lg:col-span-2 glass border-border/50 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-black tracking-tight">Today's Menu</CardTitle>
              <CardDescription className="font-bold flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4" />
                {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild className="rounded-xl font-bold">
              <Link href="/vendor/tiffin/menu">Edit Menu</Link>
            </Button>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 relative overflow-hidden group">
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity text-emerald-500">
                <Clock className="h-12 w-12" />
              </div>
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-emerald-500 text-zinc-950 font-black">LUNCH SESSION</Badge>
                {lunchMenu && (
                   <Button variant="ghost" size="sm" className="h-7 text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:bg-emerald-500/10 gap-2 rounded-lg">
                     <Share2 className="h-3 w-3" /> Broadcast
                   </Button>
                )}
              </div>
              <ul className="space-y-3">
                {lunchMenu?.items.length ? lunchMenu.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-bold text-foreground/80">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    {item}
                  </li>
                )) : (
                  <li className="text-muted-foreground font-bold italic py-4">No menu scheduled for today's lunch.</li>
                )}
              </ul>
            </div>

            <div className="p-6 rounded-[2rem] bg-blue-500/5 border border-blue-500/10 relative overflow-hidden group">
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity text-blue-500">
                <Clock className="h-12 w-12" />
              </div>
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-blue-500 text-white font-black">DINNER SESSION</Badge>
                {dinnerMenu && (
                   <Button variant="ghost" size="sm" className="h-7 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:bg-blue-500/10 gap-2 rounded-lg">
                     <Share2 className="h-3 w-3" /> Broadcast
                   </Button>
                )}
              </div>
              <ul className="space-y-3">
                {dinnerMenu?.items.length ? dinnerMenu.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-bold text-foreground/80">
                    <CheckCircle2 className="h-4 w-4 text-blue-500" />
                    {item}
                  </li>
                )) : (
                  <li className="text-muted-foreground font-bold italic py-4">No menu scheduled for today's dinner.</li>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Recent Subs */}
        <div className="space-y-6">
          <Card className="glass border-border/50 bg-emerald-500/5 overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-black">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2">
              <AddSubscriptionDialog vendorId={vendor.id} />
              <ShareShopButton slug={vendor.tenantSlug} businessName={vendor.businessName} />
              <Button variant="ghost" asChild className="w-full justify-start gap-3 h-12 rounded-xl font-bold text-muted-foreground hover:bg-muted">
                <Link href="/vendor/tiffin/deliveries">
                  <Truck className="h-5 w-5" /> Daily Dispatch List
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 h-12 rounded-xl font-bold bg-background/50 border-border/50 hover:bg-muted">
                <Utensils className="h-5 w-5" /> Bulk Menu Update
              </Button>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-black">New Subscribers</CardTitle>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentSubscriptions.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between group cursor-pointer p-2 hover:bg-muted/50 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center font-black text-emerald-500">
                      {sub.customer.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-black tracking-tight">{sub.customer}</div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase">{sub.plan}</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-black text-muted-foreground text-right">
                    {sub.date}
                    <ArrowRight className="h-3 w-3 mt-1 ml-auto group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-xs font-black uppercase tracking-widest text-emerald-500 hover:bg-emerald-500/5">
                View All Subscribers
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
