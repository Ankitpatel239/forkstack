'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ChefHat, 
  Loader2, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCcw,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  Flame,
  AlertCircle,
  Printer,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { getVendorByUserId } from "@/app/actions/tiffin";
import { 
  getProductionPlans, 
  generateProductionPlan, 
  updateProductionStatus, 
  updateProductionItem,
  getProductionAnalytics 
} from "@/app/actions/production";
import { TiffinMealType, ProductionStatus } from "@prisma/client";
import { format, addDays, subDays, startOfDay } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { deductStockForProduction, getInventoryAlerts } from '@/app/actions/inventory-engine';

export default function ProductionPage() {
  const { data: session } = useSession();
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [plans, setPlans] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState<TiffinMealType | null>(null);
  const [isDeducting, setIsDeducting] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!vendorId) return;
    setIsLoading(true);
    try {
      const [p, a, al] = await Promise.all([
        getProductionPlans(vendorId, selectedDate),
        getProductionAnalytics(vendorId),
        getInventoryAlerts(vendorId)
      ]);
      setPlans(p);
      setAnalytics(a);
      setAlerts(al);
    } catch (error) {
      toast.error("Failed to load production plans");
    } finally {
      setIsLoading(false);
    }
  }, [vendorId, selectedDate]);

  const handleDeductStock = async (itemId: string, quantity: number) => {
    if (quantity <= 0) return;
    setIsDeducting(itemId);
    try {
      await deductStockForProduction(itemId, quantity);
      toast.success("Inventory stock deducted based on recipe");
      fetchData();
    } catch (error) {
      toast.error("Stock deduction failed");
    } finally {
      setIsDeducting(null);
    }
  };

  useEffect(() => {
    async function fetchVendor() {
      if (session?.user?.id) {
        const vendor = await getVendorByUserId(session.user.id);
        if (vendor) setVendorId(vendor.id);
      }
    }
    fetchVendor();
  }, [session]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleGenerate = async (mealType: TiffinMealType) => {
    if (!vendorId) return;
    setIsGenerating(mealType);
    try {
      await generateProductionPlan(vendorId, selectedDate, mealType);
      toast.success(`${mealType} production plan generated!`);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to generate plan");
    } finally {
      setIsGenerating(null);
    }
  };

  const handleStatusUpdate = async (planId: string, status: ProductionStatus) => {
    try {
      await updateProductionStatus(planId, status);
      toast.success("Status updated");
      fetchData();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleItemUpdate = async (itemId: string, field: string, value: string) => {
    try {
      await updateProductionItem(itemId, { [field]: parseFloat(value) || 0 });
      // We don't toast here to avoid spamming while typing
    } catch (error) {
      toast.error("Item update failed");
    }
  };

  const getStatusColor = (status: ProductionStatus) => {
    switch (status) {
      case 'PLANNED': return 'bg-zinc-500';
      case 'PREPARING': return 'bg-orange-500';
      case 'COOKED': return 'bg-emerald-500';
      case 'PACKED': return 'bg-indigo-500';
      case 'DISPATCHED': return 'bg-blue-500';
      default: return 'bg-zinc-500';
    }
  };

  const getStatusIcon = (status: ProductionStatus) => {
    switch (status) {
      case 'PLANNED': return <Clock size={16} />;
      case 'PREPARING': return <Flame size={16} />;
      case 'COOKED': return <CheckCircle2 size={16} />;
      case 'PACKED': return <Package size={16} />;
      case 'DISPATCHED': return <Truck size={16} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card/30 backdrop-blur-xl p-6 rounded-3xl border border-border shadow-2xl shadow-orange-500/5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
            <ChefHat className="text-orange-500" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight uppercase italic">Kitchen Production</h2>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Live Prep Queue & Daily Planning</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-background/50 p-2 rounded-2xl border border-border">
          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-orange-500/10" onClick={() => setSelectedDate(prev => subDays(prev, 1))}>
            <ChevronLeft size={20} />
          </Button>
          <div className="flex flex-col items-center px-4 min-w-[140px]">
            <span className="text-sm font-black text-foreground">{format(selectedDate, 'EEEE')}</span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{format(selectedDate, 'dd MMM yyyy')}</span>
          </div>
          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-orange-500/10" onClick={() => setSelectedDate(prev => addDays(prev, 1))}>
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none bg-card/40 backdrop-blur-xl shadow-xl rounded-[2rem]">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Weekly Production</p>
              <h4 className="text-2xl font-black">{analytics?.totalProduced || 0} <span className="text-xs font-medium text-muted-foreground">Sv</span></h4>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none bg-card/40 backdrop-blur-xl shadow-xl rounded-[2rem]">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Avg Waste</p>
              <h4 className="text-2xl font-black">{analytics?.wastePercentage.toFixed(1)}%</h4>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none bg-card/40 backdrop-blur-xl shadow-xl rounded-[2rem]">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <BarChart3 size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Sessions</p>
              <h4 className="text-2xl font-black">{plans.length} / 3</h4>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none bg-card/40 backdrop-blur-xl shadow-xl rounded-[2rem]">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
              <RefreshCcw size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Load Factor</p>
              <h4 className="text-2xl font-black">High</h4>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {[TiffinMealType.BREAKFAST, TiffinMealType.LUNCH, TiffinMealType.DINNER].map(mealType => {
          const plan = plans.find(p => p.mealType === mealType);
          return (
            <Card key={mealType} className="border-none bg-card/40 backdrop-blur-2xl shadow-2xl rounded-[2.5rem] overflow-hidden group min-h-[600px] flex flex-col">
              <CardHeader className="p-8 pb-4 border-b border-border/50 bg-background/20">
                <div className="flex justify-between items-start mb-4">
                  <Badge className={`px-4 py-1 rounded-xl border-none font-black text-[9px] tracking-[0.2em] uppercase ${mealType === 'BREAKFAST' ? 'bg-amber-500 text-zinc-950' : mealType === 'LUNCH' ? 'bg-emerald-500 text-white' : 'bg-indigo-500 text-white'}`}>
                    {mealType}
                  </Badge>
                  {plan && (
                    <div className="flex gap-2">
                       <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-zinc-500/10" onClick={() => window.print()}>
                        <Printer size={16} />
                      </Button>
                    </div>
                  )}
                </div>
                
                {!plan ? (
                  <div className="py-20 text-center space-y-6 flex-grow flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-zinc-500/10 flex items-center justify-center text-zinc-400">
                      <Calendar size={32} />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">No Plan Generated</p>
                      <p className="text-[10px] font-medium text-muted-foreground mt-1 px-4">Generate production list based on active subscriptions</p>
                    </div>
                    <Button 
                      className="rounded-2xl h-12 px-6 bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-widest shadow-xl shadow-orange-500/20"
                      onClick={() => handleGenerate(mealType)}
                      disabled={isGenerating === mealType}
                    >
                      {isGenerating === mealType ? <Loader2 className="animate-spin" /> : "Initialize Plan"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <CardTitle className="text-2xl font-black uppercase italic">{mealType} Prep</CardTitle>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${getStatusColor(plan.status)}`} />
                          {plan.status}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase text-muted-foreground">Progress</p>
                        <p className="text-lg font-black">{Math.round((plan.items.filter((i: any) => i.actualPrepared >= i.estimatedServings).length / plan.items.length) * 100)}%</p>
                      </div>
                    </div>
                    <Progress value={(plan.items.filter((i: any) => i.actualPrepared >= i.estimatedServings).length / plan.items.length) * 100} className="h-2 rounded-full bg-muted shadow-inner" />
                  </div>
                )}
              </CardHeader>
              
              {plan && (
                <>
                  <CardContent className="p-8 flex-grow space-y-6 overflow-y-auto max-h-[500px]">
                    <div className="space-y-4">
                      {plan.items.map((item: any) => (
                        <div key={item.id} className="p-5 rounded-3xl bg-background/50 border border-border/50 space-y-4 hover:border-orange-500/30 transition-all">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-black text-sm uppercase italic">{item.name}</p>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Goal: {item.estimatedServings} Servings</p>
                            </div>
                            <Badge variant="outline" className="rounded-lg text-[9px] font-black border-border/50">
                              {item.tiffinItem?.category || "Main"}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <Label className="text-[9px] font-black uppercase text-muted-foreground">Prepared</Label>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-4 w-4 text-orange-500 hover:text-orange-600 p-0"
                                  onClick={() => handleDeductStock(item.id, item.actualPrepared)}
                                  disabled={isDeducting === item.id}
                                >
                                  {isDeducting === item.id ? <Loader2 className="animate-spin" size={10} /> : <Package size={10} />}
                                </Button>
                              </div>
                              <Input 
                                type="number" 
                                defaultValue={item.actualPrepared}
                                onBlur={(e) => handleItemUpdate(item.id, 'actualPrepared', e.target.value)}
                                className="h-9 rounded-xl bg-background border-border text-xs font-black" 
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[9px] font-black uppercase text-muted-foreground">Waste</Label>
                              <Input 
                                type="number" 
                                defaultValue={item.wasteQuantity}
                                onBlur={(e) => handleItemUpdate(item.id, 'wasteQuantity', e.target.value)}
                                className="h-9 rounded-xl bg-background border-border text-xs font-black" 
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  
                  <div className="p-8 border-t border-border/50 bg-background/10 mt-auto">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Advance Workflow</p>
                    <div className="flex flex-wrap gap-2">
                      {['PLANNED', 'PREPARING', 'COOKED', 'PACKED', 'DISPATCHED'].map((s: any) => (
                        <Button 
                          key={s} 
                          size="sm" 
                          variant={plan.status === s ? "default" : "outline"}
                          className={`rounded-xl text-[9px] font-black uppercase tracking-widest h-9 flex-1 gap-2 ${plan.status === s ? getStatusColor(s) : 'hover:bg-zinc-500/10'}`}
                          onClick={() => handleStatusUpdate(plan.id, s)}
                        >
                          {getStatusIcon(s)} {s}
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
