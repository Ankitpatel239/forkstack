'use client';

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Utensils, 
  Save, 
  Loader2, 
  Sparkles, 
  CalendarDays,
  Plus,
  Trash2,
  Check,
  Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { 
  getTiffinMenu, 
  updateTiffinMenu, 
  getVendorByUserId,
  getTiffinMenuSets,
  createTiffinMenuSet,
  deleteTiffinMenuSet,
  getTiffinWeeklySchedule,
  updateTiffinWeeklySchedule,
  getTiffinMealRequests,
  getTiffinItems
} from "@/app/actions/tiffin";
import { TiffinMealType } from "@prisma/client";
import { toast } from "sonner";
import { format, addDays, subDays, startOfDay } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecipeManagement from "@/components/vendor/tiffin/RecipeManagement";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function MenuSetForm({ vendorId, onSuccess }: { vendorId: string, onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [mealType, setMealType] = useState<TiffinMealType>(TiffinMealType.LUNCH);
  const [items, setItems] = useState<string[]>(["", "", "", ""]);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name || items.every(i => !i.trim())) {
      toast.error("Please provide a name and at least one item.");
      return;
    }
    setIsSubmitting(true);
    try {
      await createTiffinMenuSet({
        vendorId,
        name,
        mealType,
        items: items.filter(i => i.trim()),
        description
      });
      toast.success("Menu template created!");
      onSuccess();
    } catch (e) {
      toast.error("Failed to create template");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pt-4">
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Template Identity</Label>
        <Input 
          placeholder="e.g. Standard North Indian" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          className="rounded-2xl h-14 bg-zinc-50 dark:bg-zinc-950 border-none font-bold" 
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Meal Session</Label>
        <Select value={mealType} onValueChange={(val: any) => setMealType(val)}>
          <SelectTrigger className="rounded-2xl h-14 bg-zinc-50 dark:bg-zinc-950 border-none font-bold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
             <SelectItem value={TiffinMealType.BREAKFAST} className="font-bold">BREAKFAST</SelectItem>
             <SelectItem value={TiffinMealType.LUNCH} className="font-bold">LUNCH</SelectItem>
             <SelectItem value={TiffinMealType.DINNER} className="font-bold">DINNER</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {items.map((item, i) => (
          <div key={i} className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Component {i+1}</Label>
            <Input 
              value={item} 
              onChange={e => {
                const ni = [...items];
                ni[i] = e.target.value;
                setItems(ni);
              }} 
              className="rounded-xl h-11 bg-zinc-50 dark:bg-zinc-950 border-none font-bold" 
            />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Internal Blueprint Notes</Label>
        <Input 
          placeholder="Optional..." 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          className="rounded-2xl h-14 bg-zinc-50 dark:bg-zinc-950 border-none" 
        />
      </div>

      <Button 
        className="w-full h-16 rounded-[1.5rem] bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20" 
        onClick={handleSubmit} 
        disabled={isSubmitting}
      >
        {isSubmitting ? <Loader2 className="animate-spin" /> : "Save Master Template"}
      </Button>
    </div>
  );
}

export default function TiffinMenuPage() {
  const { data: session } = useSession();
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [isVendorLoading, setIsVendorLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [activeTab, setActiveTab] = useState("daily");

  const [breakfastItems, setBreakfastItems] = useState<string[]>(["", "", "", ""]);
  const [lunchItems, setLunchItems] = useState<string[]>(["", "", "", ""]);
  const [dinnerItems, setDinnerItems] = useState<string[]>(["", "", "", ""]);
  const [breakfastDesc, setBreakfastDesc] = useState("");
  const [lunchDesc, setLunchDesc] = useState("");
  const [dinnerDesc, setDinnerDesc] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState<TiffinMealType | null>(null);
  const [menuSets, setMenuSets] = useState<any[]>([]);
  const [weeklySchedules, setWeeklySchedules] = useState<any[]>([]);
  const [masterItems, setMasterItems] = useState<any[]>([]);

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

  const fetchData = useCallback(async () => {
    if (!vendorId) return;
    setIsLoading(true);
    try {
      const [breakfastData, lunchData, dinnerData, setsData, scheduleData, requestsData, masterItemsData] = await Promise.all([
        getTiffinMenu(vendorId, selectedDate, TiffinMealType.BREAKFAST),
        getTiffinMenu(vendorId, selectedDate, TiffinMealType.LUNCH),
        getTiffinMenu(vendorId, selectedDate, TiffinMealType.DINNER),
        getTiffinMenuSets(vendorId),
        getTiffinWeeklySchedule(vendorId),
        getTiffinMealRequests(vendorId, selectedDate),
        getTiffinItems(vendorId)
      ]);

      setBreakfastItems(breakfastData?.items.length ? breakfastData.items : ["", "", "", ""]);
      setBreakfastDesc(breakfastData?.description || "");
      setLunchItems(lunchData?.items.length ? lunchData.items : ["", "", "", ""]);
      setLunchDesc(lunchData?.description || "");
      setDinnerItems(dinnerData?.items.length ? dinnerData.items : ["", "", "", ""]);
      setDinnerDesc(dinnerData?.description || "");

      setMenuSets(setsData);
      setWeeklySchedules(scheduleData);
      setMasterItems(masterItemsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load menus");
    } finally {
      setIsLoading(false);
    }
  }, [vendorId, selectedDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveMenu = async (mealType: TiffinMealType) => {
    if (!vendorId) return;
    setIsSaving(mealType);
    let items, description;
    if (mealType === TiffinMealType.BREAKFAST) { items = breakfastItems; description = breakfastDesc; }
    else if (mealType === TiffinMealType.LUNCH) { items = lunchItems; description = lunchDesc; }
    else { items = dinnerItems; description = dinnerDesc; }
    
    try {
      await updateTiffinMenu({
        vendorId,
        date: selectedDate,
        mealType,
        items: items.filter(i => i.trim()),
        description
      });
      toast.success(`${mealType} menu saved!`);
    } catch (error) {
      toast.error("Save failed");
    } finally {
      setIsSaving(null);
    }
  };

  const applyTemplate = (mealType: TiffinMealType, set: any) => {
    if (mealType === TiffinMealType.BREAKFAST) { setBreakfastItems(set.items); setBreakfastDesc(set.description || ""); }
    else if (mealType === TiffinMealType.LUNCH) { setLunchItems(set.items); setLunchDesc(set.description || ""); }
    else { setDinnerItems(set.items); setDinnerDesc(set.description || ""); }
    toast.success("Template applied!");
  };

  const applyWeeklySchedule = () => {
    const dayOfWeek = selectedDate.getDay();
    const daySchedules = weeklySchedules.filter(s => s.dayOfWeek === dayOfWeek);
    if (!daySchedules.length) { toast.info("No schedule for today"); return; }
    daySchedules.forEach(s => applyTemplate(s.mealType, s.menuSet));
    toast.success("Schedule applied!");
  };

  const updateItem = (mealType: TiffinMealType, index: number, value: string) => {
    if (mealType === TiffinMealType.BREAKFAST) { const ni = [...breakfastItems]; ni[index] = value; setBreakfastItems(ni); }
    else if (mealType === TiffinMealType.LUNCH) { const ni = [...lunchItems]; ni[index] = value; setLunchItems(ni); }
    else { const ni = [...dinnerItems]; ni[index] = value; setDinnerItems(ni); }
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card/30 backdrop-blur-xl p-6 rounded-3xl border border-border shadow-2xl shadow-emerald-500/5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <Utensils className="text-emerald-500" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">Tiffin Management</h2>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Menus, Templates & Operations</p>
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-muted/50 p-1 rounded-2xl border border-border/50">
          <TabsList className="bg-transparent border-none">
            <TabsTrigger value="daily" className="rounded-xl px-6 data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all font-bold text-xs uppercase tracking-widest">Planner</TabsTrigger>
            <TabsTrigger value="sets" className="rounded-xl px-6 data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all font-bold text-xs uppercase tracking-widest">Sets</TabsTrigger>
            <TabsTrigger value="schedule" className="rounded-xl px-6 data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all font-bold text-xs uppercase tracking-widest">Weekly</TabsTrigger>
            <TabsTrigger value="recipes" className="rounded-xl px-6 data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all font-bold text-xs uppercase tracking-widest">Recipes</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs value={activeTab} className="w-full">
        <TabsContent value="daily" className="space-y-8 mt-0 outline-none">
          <div className="flex flex-col xl:flex-row gap-6">
             <div className="flex-1 space-y-6">
                <div className="flex items-center gap-3 bg-card/30 backdrop-blur-xl p-4 rounded-3xl border border-border w-fit mx-auto lg:mx-0">
                  <Button variant="ghost" size="icon" className="rounded-xl hover:bg-emerald-500/10" onClick={() => setSelectedDate(prev => subDays(prev, 1))}>
                    <ChevronLeft size={20} />
                  </Button>
                  <div className="flex flex-col items-center px-6 min-w-[180px]">
                    <span className="text-sm font-black text-foreground">{format(selectedDate, 'EEEE')}</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{format(selectedDate, 'dd MMM yyyy')}</span>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-xl hover:bg-emerald-500/10" onClick={() => setSelectedDate(prev => addDays(prev, 1))}>
                    <ChevronRight size={20} />
                  </Button>
                  <div className="h-8 w-[1px] bg-border/50 mx-2" />
                  <Button variant="outline" size="sm" className="rounded-xl font-bold text-[10px] uppercase tracking-widest h-9 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 transition-all" onClick={applyWeeklySchedule}>
                    <CalendarIcon className="mr-2 h-3 w-3" /> Apply Schedule
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {[
                    { type: TiffinMealType.BREAKFAST, items: breakfastItems, setter: setBreakfastItems, desc: breakfastDesc, setDesc: setBreakfastDesc, color: 'amber' },
                    { type: TiffinMealType.LUNCH, items: lunchItems, setter: setLunchItems, desc: lunchDesc, setDesc: setLunchDesc, color: 'emerald' },
                    { type: TiffinMealType.DINNER, items: dinnerItems, setter: setDinnerItems, desc: dinnerDesc, setDesc: setDinnerDesc, color: 'indigo' }
                  ].map((meal) => (
                    <Card key={meal.type} className="border-none bg-card/40 backdrop-blur-2xl shadow-2xl overflow-hidden group">
                      <CardHeader className={`border-b border-border/50 bg-${meal.color}-500/5 pb-6`}>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-${meal.color}-500 flex items-center justify-center shadow-lg shadow-${meal.color}-500/20`}>
                              <Sparkles className={meal.color === 'amber' ? 'text-zinc-950' : 'text-white'} size={20} />
                            </div>
                            <CardTitle className="text-xl font-black">{meal.type}</CardTitle>
                          </div>
                          <Select onValueChange={(setId) => {
                            const set = menuSets.find(s => s.id === setId);
                            if (set) applyTemplate(meal.type, set);
                          }}>
                            <SelectTrigger className="w-fit border-none bg-transparent h-6 text-[10px] font-black uppercase p-0 gap-1 ring-0 outline-none focus:ring-0">
                               <SelectValue placeholder="APPLY SET" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-border bg-background/95 backdrop-blur-xl">
                              {menuSets.filter(s => s.mealType === meal.type).map(set => (
                                <SelectItem key={set.id} value={set.id} className="text-xs font-bold rounded-xl">{set.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-8 space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                          {meal.items.map((item, idx) => (
                            <div key={`${meal.type}-${idx}`} className="space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{labels[idx]}</Label>
                              <div className="relative group/input">
                                <Input list={`master-dishes-${meal.type}-${idx}`} value={item} onChange={(e) => updateItem(meal.type, idx, e.target.value)} placeholder={`Enter dish...`} className="bg-background/50 border-border/50 focus:border-emerald-500/50 rounded-xl h-12 text-sm font-semibold transition-all" />
                                <datalist id={`master-dishes-${meal.type}-${idx}`}>
                                  {masterItems.map(mi => <option key={mi.id} value={mi.name} />)}
                                </datalist>
                                {masterItems.find(mi => mi.name === item) && (
                                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Internal Notes</Label>
                          <Input value={meal.desc} onChange={(e) => meal.setDesc(e.target.value)} placeholder="Optional notes..." className="bg-background/50 border-border/50 focus:border-emerald-500/50 rounded-xl h-12 text-sm font-semibold" />
                        </div>
                        <Button className={`w-full h-14 rounded-2xl bg-${meal.color}-500 hover:bg-${meal.color}-600 ${meal.color === 'amber' ? 'text-zinc-950' : 'text-white'} font-black uppercase tracking-[0.2em] shadow-xl shadow-${meal.color}-500/20 transition-all`} onClick={() => handleSaveMenu(meal.type)} disabled={isSaving !== null}>
                          {isSaving === meal.type ? <Loader2 className="animate-spin mr-2" size={20} /> : <Save className="mr-2" size={20} />} Update {meal.type}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
             </div>
          </div>
        </TabsContent>

        <TabsContent value="sets" className="mt-0 outline-none">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="h-80 rounded-[3rem] border-2 border-dashed border-zinc-200 dark:border-white/10 bg-transparent hover:bg-emerald-500/5 hover:border-emerald-500/30 transition-all group flex flex-col gap-6">
                    <div className="w-20 h-20 rounded-[2rem] bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                      <Plus size={40} />
                    </div>
                    <div className="text-center space-y-1">
                      <span className="font-black uppercase tracking-[0.3em] text-[10px] text-zinc-500 group-hover:text-emerald-500">Master Blueprint</span>
                      <p className="text-xs font-bold text-zinc-400">Create New Template</p>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-[3rem] border-zinc-100 dark:border-white/10 bg-background/95 backdrop-blur-3xl max-w-lg p-10">
                   <DialogHeader className="pb-6">
                      <DialogTitle className="text-3xl font-black tracking-tight italic uppercase">Create Template</DialogTitle>
                      <DialogDescription className="font-medium">Define a reusable meal configuration for your planner.</DialogDescription>
                   </DialogHeader>
                   <MenuSetForm vendorId={vendorId!} onSuccess={fetchData} />
                </DialogContent>
              </Dialog>
              {menuSets.map((set) => (
                <Card key={set.id} className="border-none bg-white dark:bg-zinc-900/40 shadow-2xl rounded-[3rem] overflow-hidden group flex flex-col h-full">
                  <CardHeader className="p-10 pb-6 border-b border-zinc-50 dark:border-white/5 bg-zinc-50/30 dark:bg-zinc-900/30">
                     <div className="flex justify-between items-start mb-2">
                        <Badge className={`px-4 py-1 rounded-xl border-none font-black text-[8px] tracking-[0.2em] uppercase ${set.mealType === 'BREAKFAST' ? 'bg-amber-500 text-zinc-950' : set.mealType === 'LUNCH' ? 'bg-emerald-500 text-white' : 'bg-indigo-500 text-white'}`}>{set.mealType}</Badge>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity" onClick={async () => { if (confirm("Delete this?")) { await deleteTiffinMenuSet(set.id); fetchData(); } }}>
                          <Trash2 size={18} />
                        </Button>
                     </div>
                     <CardTitle className="text-2xl font-black uppercase italic leading-tight">{set.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-10 flex-grow space-y-6">
                    <div className="space-y-4">
                       {set.items.map((item: string, i: number) => (
                         <div key={i} className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                            <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{item}</span>
                         </div>
                       ))}
                    </div>
                    {set.description && <div className="pt-6 border-t border-zinc-100 dark:border-white/5"><p className="text-[10px] text-zinc-400 font-medium leading-relaxed italic">"{set.description}"</p></div>}
                  </CardContent>
                </Card>
              ))}
           </div>
        </TabsContent>

        <TabsContent value="schedule" className="mt-0 outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6">
            {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, idx) => (
              <div key={day} className="space-y-4 group">
                <div className="bg-white dark:bg-zinc-900/40 rounded-[2.5rem] border border-zinc-100 dark:border-white/5 shadow-xl overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1 flex flex-col h-full">
                  <div className="p-6 text-center border-b border-zinc-50 dark:border-white/5 bg-zinc-50 dark:bg-zinc-900/80 text-zinc-400"><span className="text-xs font-black uppercase tracking-[0.2em]">{day}</span></div>
                  <div className="p-6 space-y-6 flex-grow">
                    {[TiffinMealType.BREAKFAST, TiffinMealType.LUNCH, TiffinMealType.DINNER].map((meal) => {
                      const schedule = weeklySchedules.find(s => s.dayOfWeek === idx && s.mealType === meal);
                      return (
                        <div key={meal} className="space-y-2">
                          <div className="flex items-center justify-between px-1">
                            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{meal}</span>
                            {schedule && <Check size={10} className="text-emerald-500" />}
                          </div>
                          <Select value={schedule?.menuSetId || "none"} onValueChange={async (val) => { if (!vendorId || val === "none") return; await updateTiffinWeeklySchedule({ vendorId, dayOfWeek: idx, mealType: meal as any, menuSetId: val }); fetchData(); }}>
                            <SelectTrigger className={`h-11 rounded-xl text-[10px] font-black border-none transition-all ${schedule ? 'bg-emerald-500/10 text-emerald-600' : 'bg-zinc-50 dark:bg-zinc-950 text-zinc-400'}`}><SelectValue placeholder="No Set" /></SelectTrigger>
                            <SelectContent className="rounded-2xl border-zinc-100 dark:border-white/10 bg-white dark:bg-zinc-900">
                               <SelectItem value="none" className="text-[10px] font-black uppercase">Unassigned</SelectItem>
                               {menuSets.filter(s => s.mealType === meal).map(s => <SelectItem key={s.id} value={s.id} className="text-[10px] font-black uppercase">{s.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recipes" className="mt-0 outline-none">
          <RecipeManagement vendorId={vendorId!} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
