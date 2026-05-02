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
  FileText,
  AlertCircle,
  MessageSquare
} from "lucide-react";
import { useSession } from "next-auth/react";
import { 
  getVendorByUserId, 
  getDailyDeliveries, 
  markAsDelivered,
  getTiffinMealRequests,
  getTiffinSessions
} from "@/app/actions/tiffin";
import { format, addDays, subDays, startOfDay } from "date-fns";
import { toast } from "sonner";
import { TiffinMealType } from "@/types/tiffin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TiffinDeliveriesPage() {
  const { data: session } = useSession();
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [activeMealType, setActiveMealType] = useState<TiffinMealType>(TiffinMealType.LUNCH);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [mealRequests, setMealRequests] = useState<any[]>([]);
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
          if (vendor) {
            setVendorId(vendor.id);
            const masterSessions = await getTiffinSessions(vendor.id);
            setSessions(masterSessions);
          }
        } catch (e) {
          console.error("Vendor fetch error", e);
        } finally {
          setIsVendorLoading(false);
        }
      }
    }
    fetchVendor();
  }, [session]);

  const fetchData = useCallback(async () => {
    if (!vendorId) return;
    setIsLoading(true);
    try {
      const [deliveryData, requestsData] = await Promise.all([
        getDailyDeliveries(vendorId, selectedDate),
        getTiffinMealRequests(vendorId, selectedDate)
      ]);
      setDeliveries(deliveryData);
      setMealRequests(requestsData);
    } catch (error) {
      console.error("Failed to fetch data", error);
      toast.error("Failed to load delivery data");
    } finally {
      setIsLoading(false);
    }
  }, [vendorId, selectedDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleMarkDelivered = async (subscriptionId: string) => {
    setProcessingId(`${subscriptionId}-${activeMealType}`);
    try {
      await markAsDelivered(subscriptionId, selectedDate, activeMealType);
      toast.success("Marked as delivered");
      await fetchData();
    } catch (error) {
      console.error("Delivery update failed", error);
      toast.error("Failed to update delivery status");
    } finally {
      setProcessingId(null);
    }
  };

  // Filter deliveries by meal type and search query
  const filteredDeliveries = deliveries.filter(sub => {
    const supportsMeal = sub.plan.mealTypes.includes(activeMealType);
    const matchesSearch = sub.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sub.customer.phone?.includes(searchQuery);
    return supportsMeal && matchesSearch;
  });

  const getMealRequest = (subId: string) => {
    return mealRequests.find(r => r.subscriptionId === subId && r.mealType === activeMealType);
  };

  if (isVendorLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 -mt-20">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.3em]">Resolving Vendor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header & Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-card/30 backdrop-blur-xl p-6 rounded-3xl border border-border shadow-2xl shadow-emerald-500/5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <Truck className="text-indigo-500" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">Delivery Dispatch</h2>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Session based logistics</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Tabs value={activeMealType} onValueChange={(val: any) => setActiveMealType(val)} className="bg-muted/50 p-1 rounded-2xl border border-border/50">
            <TabsList className="bg-transparent border-none">
              <TabsTrigger value={TiffinMealType.BREAKFAST} className="rounded-xl px-4 font-bold text-[10px] uppercase">Breakfast</TabsTrigger>
              <TabsTrigger value={TiffinMealType.LUNCH} className="rounded-xl px-4 font-bold text-[10px] uppercase">Lunch</TabsTrigger>
              <TabsTrigger value={TiffinMealType.DINNER} className="rounded-xl px-4 font-bold text-[10px] uppercase">Dinner</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2 px-4 py-1.5 bg-muted/50 rounded-2xl border border-border/50">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setSelectedDate(prev => subDays(prev, 1))}>
              <ChevronLeft size={16} />
            </Button>
            <span className="text-[10px] font-black uppercase tracking-widest min-w-[100px] text-center">{format(selectedDate, 'dd MMM')}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setSelectedDate(prev => addDays(prev, 1))}>
              <ChevronRight size={16} />
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
            <input 
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background/50 border-none h-10 pl-9 pr-4 rounded-xl text-[10px] font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none w-[150px]"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="h-96 flex flex-col items-center justify-center gap-4 bg-card/20 backdrop-blur-sm rounded-3xl border border-border border-dashed">
          <Loader2 className="animate-spin text-indigo-500" size={48} />
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em]">Loading Deliveries...</p>
        </div>
      ) : filteredDeliveries.length === 0 ? (
        <div className="h-96 flex flex-col items-center justify-center gap-4 bg-card/20 backdrop-blur-sm rounded-3xl border border-border border-dashed text-center px-6">
           <AlertCircle className="h-12 w-12 text-muted-foreground opacity-20" />
           <h3 className="text-xl font-black uppercase tracking-tight">No {activeMealType} Tasks</h3>
           <p className="text-sm text-muted-foreground">No active subscriptions for this session on this date.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
          {filteredDeliveries.map((sub) => {
            const delivery = sub.deliveries.find((d: any) => d.mealType === activeMealType);
            const isDelivered = delivery?.status === "DELIVERED";
            const request = getMealRequest(sub.id);
            const isSkipped = request?.type === 'SKIP';

            return (
              <Card key={sub.id} className={`border-none bg-card/40 backdrop-blur-2xl shadow-2xl overflow-hidden group relative transition-all ${isDelivered || isSkipped ? 'opacity-60 grayscale-[0.3]' : 'hover:scale-[1.01]'}`}>
                <div className={`absolute top-0 left-0 w-full h-1.5 ${isDelivered ? 'bg-emerald-500' : isSkipped ? 'bg-red-500' : 'bg-indigo-500'}`} />
                
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
                    <Badge variant="outline" className={`font-black uppercase tracking-widest text-[9px] px-2 py-1 rounded-lg ${isDelivered ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : isSkipped ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'}`}>
                      {isDelivered ? 'Delivered' : isSkipped ? 'Skipped' : 'Pending'}
                    </Badge>
                  </div>

                  {request && (
                    <div className={`p-3 rounded-xl border mb-4 flex items-center gap-3 ${request.type === 'SKIP' ? 'bg-red-500/5 border-red-500/20' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
                       <MessageSquare size={16} className={request.type === 'SKIP' ? 'text-red-500' : 'text-emerald-500'} />
                       <div>
                          <p className={`text-[10px] font-black uppercase ${request.type === 'SKIP' ? 'text-red-500' : 'text-emerald-500'}`}>Customer Request: {request.type}</p>
                          <p className="text-[10px] font-bold text-muted-foreground italic">"{request.notes || 'No notes'}"</p>
                       </div>
                    </div>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-6 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <MapPin size={14} className="text-indigo-500 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-muted-foreground">Address</span>
                        <p className="text-[10px] font-bold leading-relaxed line-clamp-2 mt-1">
                          {sub.address || "No address set"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock size={14} className="text-indigo-500 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-muted-foreground">Slot</span>
                        <p className="text-[10px] font-bold mt-1">
                          {sub.timeSlotSnapshot || (
                            (() => {
                              const s = sessions.find(s => s.mealType === activeMealType);
                              return s ? `${s.startTime} - ${s.endTime}` : "Standard";
                            })()
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    {isDelivered ? (
                      <div className="flex items-center justify-center gap-2 h-14 w-full rounded-2xl bg-emerald-500/10 text-emerald-500 font-black uppercase tracking-widest text-xs">
                        <CheckCircle2 size={18} /> Delivered
                      </div>
                    ) : isSkipped ? (
                      <div className="flex items-center justify-center gap-2 h-14 w-full rounded-2xl bg-red-500/10 text-red-500 font-black uppercase tracking-widest text-xs">
                        <AlertCircle size={18} /> User Skipped
                      </div>
                    ) : (
                      <Button 
                        className="w-full h-14 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-black uppercase tracking-[0.15em] shadow-xl shadow-indigo-500/20 transition-all active:scale-[0.98]"
                        onClick={() => handleMarkDelivered(sub.id)}
                        disabled={processingId === `${sub.id}-${activeMealType}`}
                      >
                        {processingId === `${sub.id}-${activeMealType}` ? (
                          <Loader2 className="animate-spin mr-2" size={20} />
                        ) : (
                          <CheckCircle2 className="mr-2" size={20} />
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
    </div>
  );
}
