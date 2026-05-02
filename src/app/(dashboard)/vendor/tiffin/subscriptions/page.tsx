import React from "react";
import { getTiffinSubscriptions, getVendorByUserId } from "@/app/actions/tiffin";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, UserCheck, MapPin, Phone, Filter, MoreVertical, CreditCard, Calendar, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SubscriptionWithDetails } from "@/types/tiffin";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

import { SubscriptionActions } from "./subscription-actions";

export default async function TiffinSubscriptionsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const vendor = await getVendorByUserId(user.id);
  if (!vendor) return <div className="p-10 text-center">No vendor profile found.</div>;

  const subscriptions = await getTiffinSubscriptions(vendor.id);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card/30 backdrop-blur-xl p-8 rounded-3xl border border-border shadow-2xl shadow-emerald-500/5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <Users className="text-indigo-500" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">Active Subscribers</h2>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Manage your customer base</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" size={16} />
            <Input
              placeholder="Search subscribers..."
              className="pl-10 h-11 w-72 rounded-xl bg-background/50 border-border/50 focus:border-emerald-500/50 transition-all shadow-sm"
            />
          </div>
          <Button variant="outline" className="rounded-xl border-border/50 h-11 px-4 text-muted-foreground hover:text-foreground">
             <Filter className="mr-2" size={16} /> Filter
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-card/40 backdrop-blur-2xl rounded-[2rem] border border-border shadow-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em]">Customer</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em]">Active Plan</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em]">Meal Balance</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em]">Status</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em]">Next Dispatch</TableHead>
              <TableHead className="text-right px-8 text-[10px] font-black uppercase tracking-[0.2em]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-32">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center opacity-20">
                      <UserCheck className="h-10 w-10" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-bold">No subscribers found</p>
                      <p className="text-sm text-muted-foreground">Active subscriptions will appear here.</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              subscriptions.map((sub) => (
                <TableRow key={sub.id} className="hover:bg-muted/20 border-border/50 transition-colors group">
                  <TableCell className="py-6 px-8">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 rounded-2xl border-2 border-background shadow-lg">
                        <AvatarFallback className="bg-indigo-500 text-white font-black text-lg">
                          {sub.customer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="text-sm font-black text-foreground group-hover:text-emerald-500 transition-colors">{sub.customer.name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
                          <Phone className="h-3 w-3 text-indigo-500" /> {sub.customer.phone}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CreditCard size={12} className="text-indigo-500" />
                        <p className="text-sm font-bold">{sub.planNameSnapshot || sub.plan.name}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {sub.plan.mealTypes.map((type) => (
                          <Badge key={type} className={`text-[8px] h-4 px-1 border-none font-bold uppercase tracking-widest ${
                            type === 'BREAKFAST' ? 'bg-amber-500 text-zinc-950' : 
                            type === 'LUNCH' ? 'bg-emerald-500 text-white' : 
                            type === 'DINNER' ? 'bg-indigo-500 text-white' : 'bg-zinc-500 text-white'
                          }`}>
                            {type}
                          </Badge>
                        ))}
                        <Badge variant="secondary" className="text-[8px] h-4 px-1 bg-indigo-500/10 text-indigo-500 border-none font-bold uppercase">
                          {sub.dietTypeSnapshot || sub.plan.dietType || 'VEG'}
                        </Badge>
                        {sub.timeSlotSnapshot && (
                          <span className="text-[9px] font-black text-muted-foreground/60 uppercase">
                            {sub.timeSlotSnapshot}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between max-w-[120px]">
                        <span className="text-xs font-black">{sub.remainingMeals} <span className="text-muted-foreground font-medium">/ {sub.plan.mealCount}</span></span>
                        <span className="text-[9px] font-black text-emerald-500">{Math.round((sub.remainingMeals / sub.plan.mealCount) * 100)}%</span>
                      </div>
                      <div className="w-32 h-1.5 bg-muted rounded-full overflow-hidden border border-border/30">
                        <div 
                          className={`h-full transition-all duration-1000 ${sub.remainingMeals < 5 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} 
                          style={{ width: `${(sub.remainingMeals / sub.plan.mealCount) * 100}%` }} 
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`font-black uppercase tracking-widest text-[9px] px-2 py-1 rounded-lg ${sub.status === "ACTIVE" ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                      {sub.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                         <Calendar size={12} className="text-indigo-500" />
                         <p className="text-sm font-bold">Today, 12:30 PM</p>
                         {sub.latitude && (
                           <Badge variant="outline" className="h-4 px-1 rounded bg-emerald-500/5 text-emerald-500 border-emerald-500/20 animate-pulse text-[8px] font-black">
                             GPS
                           </Badge>
                         )}
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-wider truncate max-w-[150px]">
                        <MapPin className="h-3 w-3" /> {sub.address || "No address set"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right px-8">
                    <SubscriptionActions 
                      subscriptionId={sub.id} 
                      currentStatus={sub.status} 
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary Footer */}
      {subscriptions.length > 0 && (
        <div className="flex justify-between items-center bg-muted/20 p-6 rounded-3xl border border-border border-dashed">
          <p className="text-xs text-muted-foreground font-medium">Showing {subscriptions.length} active subscribers</p>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active: {subscriptions.filter(s => s.status === 'ACTIVE').length}</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Paused: {subscriptions.filter(s => s.status !== 'ACTIVE').length}</span>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
