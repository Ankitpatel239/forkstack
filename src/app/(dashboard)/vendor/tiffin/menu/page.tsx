'use client';

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Utensils, Save, Loader2, Sparkles, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { getTiffinMenu, updateTiffinMenu, getVendorByUserId } from "@/app/actions/tiffin";
import { TiffinMealType } from "@/types/tiffin";
import { toast } from "sonner";
import { format, addDays, subDays, startOfDay } from "date-fns";

export default function TiffinMenuPage() {
  const { data: session } = useSession();
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [isVendorLoading, setIsVendorLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [breakfastItems, setBreakfastItems] = useState<string[]>(["", "", "", ""]);
  const [lunchItems, setLunchItems] = useState<string[]>(["", "", "", ""]);
  const [dinnerItems, setDinnerItems] = useState<string[]>(["", "", "", ""]);
  const [breakfastDesc, setBreakfastDesc] = useState("");
  const [lunchDesc, setLunchDesc] = useState("");
  const [dinnerDesc, setDinnerDesc] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState<TiffinMealType | null>(null);

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

  const fetchMenus = useCallback(async () => {
    if (!vendorId) return;
    setIsLoading(true);
    try {
      const [breakfastData, lunchData, dinnerData] = await Promise.all([
        getTiffinMenu(vendorId, selectedDate, TiffinMealType.BREAKFAST),
        getTiffinMenu(vendorId, selectedDate, TiffinMealType.LUNCH),
        getTiffinMenu(vendorId, selectedDate, TiffinMealType.DINNER)
      ]);

      if (breakfastData) {
        setBreakfastItems(breakfastData.items.length > 0 ? breakfastData.items : ["", "", "", ""]);
        setBreakfastDesc(breakfastData.description || "");
      } else {
        setBreakfastItems(["", "", "", ""]);
        setBreakfastDesc("");
      }

      if (lunchData) {
        setLunchItems(lunchData.items.length > 0 ? lunchData.items : ["", "", "", ""]);
        setLunchDesc(lunchData.description || "");
      } else {
        setLunchItems(["", "", "", ""]);
        setLunchDesc("");
      }

      if (dinnerData) {
        setDinnerItems(dinnerData.items.length > 0 ? dinnerData.items : ["", "", "", ""]);
        setDinnerDesc(dinnerData.description || "");
      } else {
        setDinnerItems(["", "", "", ""]);
        setDinnerDesc("");
      }
    } catch (error) {
      console.error("Failed to fetch menu:", error);
      toast.error("Failed to load menus for this date");
    } finally {
      setIsLoading(false);
    }
  }, [vendorId, selectedDate]);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  const handleSaveMenu = async (mealType: TiffinMealType) => {
    if (!vendorId) return;
    
    setIsSaving(mealType);
    let items, description;
    if (mealType === TiffinMealType.BREAKFAST) {
      items = breakfastItems;
      description = breakfastDesc;
    } else if (mealType === TiffinMealType.LUNCH) {
      items = lunchItems;
      description = lunchDesc;
    } else {
      items = dinnerItems;
      description = dinnerDesc;
    }
    
    const filteredItems = items.filter(item => item.trim() !== "");

    try {
      await updateTiffinMenu({
        vendorId,
        date: selectedDate,
        mealType,
        items: filteredItems,
        description
      });
      toast.success(`${mealType.toLowerCase()} menu saved successfully!`);
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Failed to save menu");
    } finally {
      setIsSaving(null);
    }
  };

  const updateItem = (mealType: TiffinMealType, index: number, value: string) => {
    if (mealType === TiffinMealType.BREAKFAST) {
      const newItems = [...breakfastItems];
      newItems[index] = value;
      setBreakfastItems(newItems);
    } else if (mealType === TiffinMealType.LUNCH) {
      const newItems = [...lunchItems];
      newItems[index] = value;
      setLunchItems(newItems);
    } else {
      const newItems = [...dinnerItems];
      newItems[index] = value;
      setDinnerItems(newItems);
    }
  };

  const labels = ["Main Dish", "Dal / Curry", "Breads / Rice", "Side / Salad"];

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
        <Button variant="outline" className="rounded-xl border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white" onClick={() => window.location.reload()}>
           Retry Initialization
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Date Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card/30 backdrop-blur-xl p-6 rounded-3xl border border-border shadow-2xl shadow-emerald-500/5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <CalendarDays className="text-emerald-500" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">Menu Planner</h2>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Schedule Daily Tiffins</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-muted/50 p-2 rounded-2xl border border-border/50">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-xl hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors"
            onClick={() => setSelectedDate(prev => subDays(prev, 1))}
          >
            <ChevronLeft size={20} />
          </Button>
          
          <div className="flex flex-col items-center px-6 min-w-[180px]">
            <span className="text-sm font-black text-foreground">{format(selectedDate, 'EEEE')}</span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{format(selectedDate, 'dd MMM yyyy')}</span>
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-xl hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors"
            onClick={() => setSelectedDate(prev => addDays(prev, 1))}
          >
            <ChevronRight size={20} />
          </Button>
          
          <div className="h-8 w-[1px] bg-border/50 mx-2" />
          
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl font-bold text-[10px] uppercase tracking-widest h-9 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/10"
            onClick={() => setSelectedDate(startOfDay(new Date()))}
          >
            Today
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="h-96 flex flex-col items-center justify-center gap-4 bg-card/20 backdrop-blur-sm rounded-3xl border border-border border-dashed">
          <div className="relative">
            <Loader2 className="animate-spin text-emerald-500" size={48} />
            <div className="absolute inset-0 blur-2xl bg-emerald-500/20 animate-pulse" />
          </div>
          <p className="text-sm font-bold text-muted-foreground animate-pulse uppercase tracking-[0.3em]">Synchronizing Menu...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* Breakfast Menu */}
          <Card className="border-none bg-card/40 backdrop-blur-2xl shadow-2xl overflow-hidden group relative">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-150 transition-transform duration-700">
               <Sparkles size={120} className="text-amber-500" />
            </div>
            <CardHeader className="border-b border-border/50 bg-amber-500/5 pb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <Sparkles className="text-zinc-950" size={20} />
                  </div>
                  <CardTitle className="text-xl font-black">Breakfast Session</CardTitle>
                </div>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-black uppercase tracking-widest text-[10px]">
                  {breakfastItems.some(i => i.trim() !== "") ? 'Scheduled' : 'Draft'}
                </Badge>
              </div>
              <CardDescription className="font-medium text-muted-foreground uppercase tracking-widest text-[10px]">
                {format(selectedDate, 'do MMMM')} • Early Morning
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {breakfastItems.map((item, idx) => (
                  <div key={`breakfast-${idx}`} className="space-y-2 group/item">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-focus-within/item:text-amber-500 transition-colors">
                      {labels[idx] || `Item ${idx + 1}`}
                    </Label>
                    <Input 
                      value={item}
                      onChange={(e) => updateItem(TiffinMealType.BREAKFAST, idx, e.target.value)}
                      placeholder={`Enter ${labels[idx] || 'dish'}...`} 
                      className="bg-background/50 border-border/50 focus:border-amber-500/50 rounded-xl h-12 text-sm font-semibold transition-all"
                    />
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Special Description</Label>
                <Input 
                  value={breakfastDesc}
                  onChange={(e) => setBreakfastDesc(e.target.value)}
                  placeholder="e.g. Paratha special, Sprouts, etc." 
                  className="bg-background/50 border-border/50 focus:border-amber-500/50 rounded-xl h-12 text-sm font-semibold"
                />
              </div>

              <div className="pt-4">
                <Button 
                  className="w-full h-14 rounded-2xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black uppercase tracking-[0.2em] shadow-xl shadow-amber-500/20 transition-all active:scale-[0.98] group/btn"
                  onClick={() => handleSaveMenu(TiffinMealType.BREAKFAST)}
                  disabled={isSaving !== null}
                >
                  {isSaving === TiffinMealType.BREAKFAST ? (
                    <Loader2 className="animate-spin mr-2" size={20} />
                  ) : (
                    <Save className="mr-2 group-hover:scale-110 transition-transform" size={20} />
                  )}
                  Save Breakfast Plan
                </Button>
              </div>
            </CardContent>
          </Card>
          {/* Lunch Menu */}
          <Card className="border-none bg-card/40 backdrop-blur-2xl shadow-2xl overflow-hidden group relative">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-150 transition-transform duration-700">
               <Utensils size={120} />
            </div>
            <CardHeader className="border-b border-border/50 bg-emerald-500/5 pb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Utensils className="text-zinc-950" size={20} />
                  </div>
                  <CardTitle className="text-xl font-black">Lunch Session</CardTitle>
                </div>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-black uppercase tracking-widest text-[10px]">
                  {lunchItems.some(i => i.trim() !== "") ? 'Scheduled' : 'Draft'}
                </Badge>
              </div>
              <CardDescription className="font-medium text-muted-foreground uppercase tracking-widest text-[10px]">
                {format(selectedDate, 'do MMMM')} • Noon Delivery
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lunchItems.map((item, idx) => (
                  <div key={`lunch-${idx}`} className="space-y-2 group/item">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-focus-within/item:text-emerald-500 transition-colors">
                      {labels[idx] || `Item ${idx + 1}`}
                    </Label>
                    <Input 
                      value={item}
                      onChange={(e) => updateItem(TiffinMealType.LUNCH, idx, e.target.value)}
                      placeholder={`Enter ${labels[idx] || 'dish'}...`} 
                      className="bg-background/50 border-border/50 focus:border-emerald-500/50 rounded-xl h-12 text-sm font-semibold transition-all"
                    />
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Special Description</Label>
                <Input 
                  value={lunchDesc}
                  onChange={(e) => setLunchDesc(e.target.value)}
                  placeholder="e.g. Special festive menu, low spice, etc." 
                  className="bg-background/50 border-border/50 focus:border-emerald-500/50 rounded-xl h-12 text-sm font-semibold"
                />
              </div>

              <div className="pt-4">
                <Button 
                  className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98] group/btn"
                  onClick={() => handleSaveMenu(TiffinMealType.LUNCH)}
                  disabled={isSaving !== null}
                >
                  {isSaving === TiffinMealType.LUNCH ? (
                    <Loader2 className="animate-spin mr-2" size={20} />
                  ) : (
                    <Save className="mr-2 group-hover:scale-110 transition-transform" size={20} />
                  )}
                  Save Lunch Plan
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Dinner Menu */}
          <Card className="border-none bg-card/40 backdrop-blur-2xl shadow-2xl overflow-hidden group relative">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-150 transition-transform duration-700">
               <Sparkles size={120} />
            </div>
            <CardHeader className="border-b border-border/50 bg-indigo-500/5 pb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Sparkles className="text-white" size={20} />
                  </div>
                  <CardTitle className="text-xl font-black">Dinner Session</CardTitle>
                </div>
                <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20 font-black uppercase tracking-widest text-[10px]">
                  {dinnerItems.some(i => i.trim() !== "") ? 'Scheduled' : 'Draft'}
                </Badge>
              </div>
              <CardDescription className="font-medium text-muted-foreground uppercase tracking-widest text-[10px]">
                {format(selectedDate, 'do MMMM')} • Night Delivery
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dinnerItems.map((item, idx) => (
                  <div key={`dinner-${idx}`} className="space-y-2 group/item">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-focus-within/item:text-indigo-500 transition-colors">
                      {labels[idx] || `Item ${idx + 1}`}
                    </Label>
                    <Input 
                      value={item}
                      onChange={(e) => updateItem(TiffinMealType.DINNER, idx, e.target.value)}
                      placeholder={`Enter ${labels[idx] || 'dish'}...`} 
                      className="bg-background/50 border-border/50 focus:border-indigo-500/50 rounded-xl h-12 text-sm font-semibold transition-all"
                    />
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Special Description</Label>
                <Input 
                  value={dinnerDesc}
                  onChange={(e) => setDinnerDesc(e.target.value)}
                  placeholder="e.g. Special festive menu, low spice, etc." 
                  className="bg-background/50 border-border/50 focus:border-indigo-500/50 rounded-xl h-12 text-sm font-semibold"
                />
              </div>

              <div className="pt-4">
                <Button 
                  variant="secondary"
                  className="w-full h-14 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 transition-all active:scale-[0.98] group/btn"
                  onClick={() => handleSaveMenu(TiffinMealType.DINNER)}
                  disabled={isSaving !== null}
                >
                  {isSaving === TiffinMealType.DINNER ? (
                    <Loader2 className="animate-spin mr-2" size={20} />
                  ) : (
                    <Save className="mr-2 group-hover:scale-110 transition-transform" size={20} />
                  )}
                  Save Dinner Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tip Section */}
      <div className="rounded-3xl bg-muted/30 p-8 border border-border border-dashed text-center relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/5 blur-[60px]" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/5 blur-[60px]" />
        <p className="text-sm text-muted-foreground font-medium relative z-10 italic">
          Tip: You can pre-schedule menus for the entire week! Changes will be reflected instantly in the subscriber app.
        </p>
      </div>
    </div>
  );
}

