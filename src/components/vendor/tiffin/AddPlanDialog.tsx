'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Save, Utensils, Truck, Settings, Wallet, Info, X, Check } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createTiffinPlan, getTiffinInclusions, getTiffinAreas, getTiffinDietTypes, getTiffinSpiceLevels } from "@/app/actions/tiffin";
import { TiffinMealType } from "@prisma/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface AddPlanDialogProps {
  vendorId: string;
}

export function AddPlanDialog({ vendorId }: AddPlanDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    mealCount: "",
    mealTypes: [TiffinMealType.LUNCH] as TiffinMealType[],
    validityDays: "30",
    description: "",
    inclusions: [] as string[],
    timeSlot: "",
    areas: [] as string[],
    deliveryRadiusKm: "",
    customStartAllowed: true,
    pauseAllowed: true,
    maxSkips: "5",
    dietType: "VEG",
    spiceLevel: "MEDIUM",
    paymentType: "PREPAID",
    autoRenew: false,
    maxSubscribers: "",
    tags: [] as string[],
    planType: "B2C"
  });

  const [areaInput, setAreaInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [availableInclusions, setAvailableInclusions] = useState<any[]>([]);
  const [availableAreas, setAvailableAreas] = useState<any[]>([]);
  const [availableDiets, setAvailableDiets] = useState<any[]>([]);
  const [availableSpices, setAvailableSpices] = useState<any[]>([]);

  React.useEffect(() => {
    async function fetchMasters() {
      const [inc, ars, diets, spices] = await Promise.all([
        getTiffinInclusions(vendorId),
        getTiffinAreas(vendorId),
        getTiffinDietTypes(vendorId),
        getTiffinSpiceLevels(vendorId)
      ]);
      setAvailableInclusions(inc);
      setAvailableAreas(ars);
      setAvailableDiets(diets);
      setAvailableSpices(spices);
    }
    if (vendorId && open) fetchMasters();
  }, [vendorId, open]);

  const addTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput] });
      setTagInput("");
    }
  };

  const toggleMealType = (type: TiffinMealType) => {
    setFormData(prev => {
      if (prev.mealTypes.includes(type)) {
        if (prev.mealTypes.length === 1) return prev; 
        return { ...prev, mealTypes: prev.mealTypes.filter(t => t !== type) };
      } else {
        return { ...prev, mealTypes: [...prev.mealTypes, type] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createTiffinPlan({
        ...formData,
        vendorId,
        price: parseFloat(formData.price),
        mealCount: parseInt(formData.mealCount),
        validityDays: parseInt(formData.validityDays),
        deliveryRadiusKm: formData.deliveryRadiusKm ? parseFloat(formData.deliveryRadiusKm) : null,
        maxSkips: parseInt(formData.maxSkips),
        maxSubscribers: formData.maxSubscribers ? parseInt(formData.maxSubscribers) : null,
        tags: [...formData.tags, formData.planType],
      });
      toast.success("Tiffin plan created successfully!");
      setOpen(false);
      setFormData({
        name: "",
        price: "",
        mealCount: "",
        mealTypes: [TiffinMealType.LUNCH],
        validityDays: "30",
        description: "",
        inclusions: [],
        timeSlot: "",
        areas: [],
        deliveryRadiusKm: "",
        customStartAllowed: true,
        pauseAllowed: true,
        maxSkips: "5",
        dietType: "VEG",
        spiceLevel: "MEDIUM",
        paymentType: "PREPAID",
        autoRenew: false,
        maxSubscribers: "",
        tags: [],
        planType: "B2C"
      });
      router.refresh();
    } catch (error) {
      toast.error("Failed to create tiffin plan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-16 px-8 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:scale-[1.02] transition-all font-black uppercase tracking-widest text-xs shadow-2xl">
          <Plus className="mr-2 h-5 w-5" /> New Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-[2.5rem] border-border/50 bg-background/95 backdrop-blur-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col h-[85vh]">
          <DialogHeader className="p-8 pb-0">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Utensils className="text-emerald-500" size={24} />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black tracking-tight">Create Tiffin Plan</DialogTitle>
                <DialogDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Configure your new subscription model</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <Tabs defaultValue="basic" className="flex-1 flex flex-col min-h-0">
            <TabsList className="bg-transparent px-8 gap-6 border-b border-border/50 rounded-none h-14">
              <TabsTrigger value="basic" className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent px-0 font-bold text-[10px] uppercase tracking-widest gap-2 flex-1">
                <Info size={14} /> Basic
              </TabsTrigger>
              <TabsTrigger value="delivery" className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent px-0 font-bold text-[10px] uppercase tracking-widest gap-2 flex-1">
                <Truck size={14} /> Logistics
              </TabsTrigger>
              <TabsTrigger value="meal" className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent px-0 font-bold text-[10px] uppercase tracking-widest gap-2 flex-1">
                <Settings size={14} /> Preferences
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-6">
              <TabsContent value="basic" className="space-y-4 m-0">
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Plan Name</Label>
                  <Input required placeholder="e.g. Premium Veg Monthly" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-12 rounded-xl bg-background/50" />
                </div>
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Subscription Nature</Label>
                  <div className="flex gap-4">
                    {['B2C', 'B2B'].map(type => (
                      <div 
                        key={type}
                        onClick={() => setFormData({...formData, planType: type})}
                        className={`flex-1 p-4 rounded-2xl border cursor-pointer transition-all ${formData.planType === type ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500' : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-black uppercase tracking-widest ${formData.planType === type ? 'text-emerald-500' : 'text-zinc-500'}`}>{type}</span>
                          {formData.planType === type && <Check className="text-emerald-500" size={14} />}
                        </div>
                        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">
                          {type === 'B2C' ? 'Individual / Household' : 'Corporate / Bulk / Office'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Price (₹)</Label>
                    <Input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="h-12 rounded-xl bg-background/50" />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Meal Count</Label>
                    <Input required type="number" value={formData.mealCount} onChange={e => setFormData({...formData, mealCount: e.target.value})} className="h-12 rounded-xl bg-background/50" />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Meal Sessions</Label>
                    <div className="flex gap-2">
                       {[TiffinMealType.BREAKFAST, TiffinMealType.LUNCH, TiffinMealType.DINNER].map(type => (
                         <Button
                           key={type}
                           type="button"
                           variant={formData.mealTypes.includes(type) ? "default" : "outline"}
                           className={`flex-1 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest ${formData.mealTypes.includes(type) ? 'bg-emerald-500 hover:bg-emerald-600' : ''}`}
                           onClick={() => toggleMealType(type)}
                         >
                           {type}
                         </Button>
                       ))}
                    </div>
                </div>
              </TabsContent>

              <TabsContent value="delivery" className="space-y-4 m-0">
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Service Areas (From Master)</Label>
                  <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-background/50 border border-border/50">
                    {availableAreas.length === 0 ? (
                      <p className="text-[10px] font-bold text-muted-foreground italic">No areas defined in Masters.</p>
                    ) : (
                      availableAreas.map(area => {
                        const isSelected = formData.areas.includes(area.name);
                        return (
                          <Badge 
                            key={area.id} 
                            onClick={() => {
                              if (isSelected) {
                                setFormData({...formData, areas: formData.areas.filter(a => a !== area.name)});
                              } else {
                                setFormData({...formData, areas: [...formData.areas, area.name]});
                              }
                            }}
                            className={`cursor-pointer px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                              isSelected ? 'bg-indigo-500 text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                          >
                            {area.name}
                          </Badge>
                        );
                      })
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Max Skips</Label>
                    <Input type="number" value={formData.maxSkips} onChange={e => setFormData({...formData, maxSkips: e.target.value})} className="h-12 rounded-xl bg-background/50" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="meal" className="space-y-4 m-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Diet Type</Label>
                    <Select value={formData.dietType} onValueChange={v => setFormData({...formData, dietType: v})}>
                      <SelectTrigger className="h-12 rounded-xl bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDiets.length > 0 ? availableDiets.map(d => (
                           <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                        )) : (
                          <>
                            <SelectItem value="VEG">Pure Veg</SelectItem>
                            <SelectItem value="NON-VEG">Non-Veg</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Spice Level</Label>
                    <Select value={formData.spiceLevel} onValueChange={v => setFormData({...formData, spiceLevel: v})}>
                      <SelectTrigger className="h-12 rounded-xl bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSpices.length > 0 ? availableSpices.map(s => (
                           <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                        )) : (
                          <>
                            <SelectItem value="MILD">Mild</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="SPICY">Spicy</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Master Inclusions</Label>
                  <div className="flex flex-wrap gap-2">
                    {availableInclusions.map(inc => (
                      <Badge 
                        key={inc.id}
                        variant={formData.inclusions.includes(inc.name) ? "default" : "outline"}
                        className={`cursor-pointer px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${formData.inclusions.includes(inc.name) ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-muted/50 hover:bg-muted'}`}
                        onClick={() => {
                          if (formData.inclusions.includes(inc.name)) {
                            setFormData({...formData, inclusions: formData.inclusions.filter(i => i !== inc.name)});
                          } else {
                            setFormData({...formData, inclusions: [...formData.inclusions, inc.name]});
                          }
                        }}
                      >
                        {inc.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </div>

            <DialogFooter className="p-8 pt-0">
               <Button type="submit" disabled={isLoading} className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 transition-all">
                  {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Save className="mr-2" size={20} />}
                  Create Plan Configuration
               </Button>
            </DialogFooter>
          </Tabs>
        </form>
      </DialogContent>
    </Dialog>
  );
}
