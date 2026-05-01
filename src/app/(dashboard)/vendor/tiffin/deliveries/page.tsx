'use client';

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Truck,
  Loader2,
  UserCheck,
  Search,
  Filter,
  FileText
} from "lucide-react";
import { useSession } from "next-auth/react";
import { getVendorByUserId, getDailyDeliveries, markAsDelivered } from "@/app/actions/tiffin";
import { format, addDays, subDays, startOfDay } from "date-fns";
import { toast } from "sonner";

export default function TiffinDeliveriesPage() {
  const { data: session } = useSession();
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVendorLoading, setIsVendorLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchVendor() {
      if (session?.user?.id) {
        setIsVendorLoading(true);
        try {
          const vendor = await getVendorByUserId(session.user.id);
          if (vendor) setVendorId(vendor.id);
        } catch (e) {
          console.error("Vendor fetch error", e);
        } finally {
          setIsVendorLoading(false);
        }
      }
    }
    fetchVendor();
  }, [session]);

  const fetchDeliveries = useCallback(async () => {
    if (!vendorId) return;
    setIsLoading(true);
    try {
      const data = await getDailyDeliveries(vendorId, selectedDate);
      setDeliveries(data);
    } catch (error) {
      console.error("Failed to fetch deliveries", error);
      toast.error("Failed to load deliveries");
    } finally {
      setIsLoading(false);
    }
  }, [vendorId, selectedDate]);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  const handleMarkDelivered = async (subscriptionId: string) => {
    setProcessingId(subscriptionId);
    try {
      await markAsDelivered(subscriptionId, selectedDate);
      toast.success("Marked as delivered");
      // Refresh local state
      await fetchDeliveries();
    } catch (error) {
      console.error("Delivery update failed", error);
      toast.error("Failed to update delivery status");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredDeliveries = deliveries.filter(item => 
    item.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.customer.phone?.includes(searchQuery)
  );

  if (isVendorLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 -mt-20">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.3em]">Resolving Vendor...</p>
      </div>
    );
  }

  if (!vendorId) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 bg-red-500/5 rounded-3xl border border-red-500/20">
        <h2 className="text-xl font-bold text-red-500">Access Denied</h2>
        <p className="text-sm text-muted-foreground">No vendor profile found for this account.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Date Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-card/30 backdrop-blur-xl p-6 rounded-3xl border border-border shadow-2xl shadow-emerald-500/5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <Truck className="text-indigo-500" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">Daily Deliveries</h2>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Manage Dispatch Logistics</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-muted/50 p-2 rounded-2xl border border-border/50">
          <div className="flex items-center gap-2 pr-4 border-r border-border/50">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-xl hover:bg-emerald-500/10 hover:text-emerald-500"
              onClick={() => setSelectedDate(prev => subDays(prev, 1))}
            >
              <ChevronLeft size={20} />
            </Button>
            <div className="flex flex-col items-center px-4 min-w-[140px]">
              <span className="text-sm font-black text-foreground">{format(selectedDate, 'EEEE')}</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{format(selectedDate, 'dd MMM yyyy')}</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-xl hover:bg-emerald-500/10 hover:text-emerald-500"
              onClick={() => setSelectedDate(prev => addDays(prev, 1))}
            >
              <ChevronRight size={20} />
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background/50 border-none h-10 pl-10 pr-4 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none w-[200px]"
            />
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl font-bold text-[10px] uppercase tracking-widest h-10 border-indigo-500/20 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all shadow-lg shadow-indigo-500/10"
            onClick={() => window.print()}
          >
            <FileText className="mr-2" size={14} /> Print Sheet
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl font-bold text-[10px] uppercase tracking-widest h-10 border-indigo-500/20 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all shadow-lg shadow-indigo-500/10"
            onClick={() => setSelectedDate(startOfDay(new Date()))}
          >
            Go To Today
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="h-96 flex flex-col items-center justify-center gap-4 bg-card/20 backdrop-blur-sm rounded-3xl border border-border border-dashed">
          <div className="relative">
            <Loader2 className="animate-spin text-indigo-500" size={48} />
            <div className="absolute inset-0 blur-2xl bg-indigo-500/20 animate-pulse" />
          </div>
          <p className="text-sm font-bold text-muted-foreground animate-pulse uppercase tracking-[0.3em]">Mapping Routes...</p>
        </div>
      ) : filteredDeliveries.length === 0 ? (
        <div className="h-96 flex flex-col items-center justify-center gap-4 bg-card/20 backdrop-blur-sm rounded-3xl border border-border border-dashed text-center px-6">
          <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mb-2">
            <UserCheck className="h-10 w-10 opacity-20" />
          </div>
          <h3 className="text-xl font-bold">No Deliveries Found</h3>
          <p className="text-sm text-muted-foreground max-w-[300px]">There are no active subscriptions scheduled for delivery on this date.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
          {filteredDeliveries.map((sub) => {
            const delivery = sub.deliveries[0];
            const isDelivered = delivery?.status === "DELIVERED";

            return (
              <Card key={sub.id} className={`border-none bg-card/40 backdrop-blur-2xl shadow-2xl overflow-hidden group relative transition-all ${isDelivered ? 'opacity-80 grayscale-[0.3]' : 'hover:scale-[1.02]'}`}>
                <div className={`absolute top-0 left-0 w-full h-1.5 ${isDelivered ? 'bg-emerald-500/50' : 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]'}`} />
                
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 rounded-2xl border-2 border-background shadow-xl">
                        <AvatarFallback className="bg-indigo-500 text-white font-black text-lg">
                          {sub.customer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg font-black">{sub.customer.name}</CardTitle>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold">
                          <Phone size={12} className="text-indigo-500" />
                          {sub.customer.phone}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className={`font-black uppercase tracking-widest text-[9px] px-2 py-1 rounded-lg ${isDelivered ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'}`}>
                      {isDelivered ? 'Delivered' : 'Pending Dispatch'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border/30">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Assigned Plan</span>
                      <span className="text-sm font-bold text-indigo-500">{sub.plan.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 block">Meals Left</span>
                      <span className="text-sm font-black">{sub.remainingMeals}</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6 pt-2">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20">
                        <MapPin size={14} className="text-indigo-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Delivery Point</span>
                        <p className="text-xs font-bold leading-relaxed line-clamp-2 mt-1">
                          {sub.address || "Main Reception, Block C, Ground Floor, Sector 62, Noida"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20">
                        <Clock size={14} className="text-indigo-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Prefered Window</span>
                        <p className="text-xs font-bold mt-1">
                          {sub.plan.mealType === 'LUNCH' ? '12:30 PM - 01:30 PM' : '07:30 PM - 08:30 PM'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    {isDelivered ? (
                      <div className="flex items-center justify-center gap-2 h-14 w-full rounded-2xl bg-emerald-500/10 text-emerald-500 font-black uppercase tracking-widest text-xs">
                        <CheckCircle2 size={18} />
                        Successfully Delivered
                      </div>
                    ) : (
                      <Button 
                        className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-black uppercase tracking-[0.15em] shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98] group/btn"
                        onClick={() => handleMarkDelivered(sub.id)}
                        disabled={processingId === sub.id}
                      >
                        {processingId === sub.id ? (
                          <Loader2 className="animate-spin mr-2" size={20} />
                        ) : (
                          <CheckCircle2 className="mr-2 group-hover:scale-110 transition-transform" size={20} />
                        )}
                        Confirm Delivery
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Stats Summary */}
      {!isLoading && filteredDeliveries.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Tasks', val: filteredDeliveries.length, color: 'indigo' },
            { label: 'Completed', val: filteredDeliveries.filter(d => d.deliveries[0]?.status === 'DELIVERED').length, color: 'emerald' },
            { label: 'Remaining', val: filteredDeliveries.filter(d => d.deliveries[0]?.status !== 'DELIVERED').length, color: 'amber' },
            { label: 'Efficiency', val: `${Math.round((filteredDeliveries.filter(d => d.deliveries[0]?.status === 'DELIVERED').length / filteredDeliveries.length) * 100)}%`, color: 'sky' }
          ].map((stat, i) => (
            <div key={i} className="bg-card/30 backdrop-blur-xl p-6 rounded-[2rem] border border-border text-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">{stat.label}</span>
              <span className={`text-2xl font-black text-${stat.color}-500`}>{stat.val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
