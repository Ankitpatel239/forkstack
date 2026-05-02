'use client';

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Loader2, Save, Utensils, Truck, Settings, Wallet, X } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import {  getTiffinAreas, getTiffinDietTypes, getTiffinInclusions, getTiffinSpiceLevels, updateTiffinPlan } from "@/app/actions/tiffin";
import { TiffinMealType } from "@prisma/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface EditPlanDialogProps {
  plan: any; // Using any for simplicity
  vendorId: string;
}

export function EditPlanDialog({ plan, vendorId }: EditPlanDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: plan.name,
    price: plan.price.toString(),
    mealCount: plan.mealCount.toString(),
    mealTypes: plan.mealTypes || [plan.mealType] || [TiffinMealType.LUNCH],
    validityDays: plan.validityDays.toString(),
    description: plan.description || "",
    inclusions: plan.inclusions || [] as string[],
    timeSlot: plan.timeSlot || "",
    areas: plan.areas || [] as string[],
    deliveryRadiusKm: plan.deliveryRadiusKm?.toString() || "",
    customStartAllowed: plan.customStartAllowed ?? true,
    pauseAllowed: plan.pauseAllowed ?? true,
    maxSkips: plan.maxSkips?.toString() || "5",
    dietType: plan.dietType || "VEG",
    spiceLevel: plan.spiceLevel || "MEDIUM",
    paymentType: plan.paymentType || "PREPAID",
    autoRenew: plan.autoRenew ?? false,
    maxSubscribers: plan.maxSubscribers?.toString() || "",
    tags: plan.tags || [] as string[]
  });

  const [areaInput, setAreaInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [availableInclusions, setAvailableInclusions] = useState<any[]>([]);
  const [availableAreas, setAvailableAreas] = useState<any[]>([]);
  const [availableDiets, setAvailableDiets] = useState<any[]>([]);
  const [availableSpices, setAvailableSpices] = useState<any[]>([]);

  useEffect(() => {
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
        return { ...prev, mealTypes: prev.mealTypes.filter((t: TiffinMealType) => t !== type) };
      } else {
        return { ...prev, mealTypes: [...prev.mealTypes, type] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateTiffinPlan(plan.id, {
        ...formData,
        price: parseFloat(formData.price),
        mealCount: parseInt(formData.mealCount),
        validityDays: parseInt(formData.validityDays),
        deliveryRadiusKm: formData.deliveryRadiusKm ? parseFloat(formData.deliveryRadiusKm) : null,
        maxSkips: parseInt(formData.maxSkips),
        maxSubscribers: formData.maxSubscribers ? parseInt(formData.maxSubscribers) : null,
      });
      toast.success("Plan updated successfully!");
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update plan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-500 transition-all">
          <Edit size={16} />
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
                <DialogTitle className="text-2xl font-black tracking-tight">Edit Tiffin Plan</DialogTitle>
                <DialogDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Adjust your service offering</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <Tabs defaultValue="basic" className="flex-1 flex flex-col min-h-0">
            <TabsList className="bg-transparent px-8 gap-6 border-b border-border/50 rounded-none h-14">
              <TabsTrigger value="basic" className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent px-0 font-bold text-[10px] uppercase tracking-widest gap-2">
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="delivery" className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent px-0 font-bold text-[10px] uppercase tracking-widest gap-2">
                Logistics
              </TabsTrigger>
              <TabsTrigger value="meal" className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent px-0 font-bold text-[10px] uppercase tracking-widest gap-2">
                Preferences
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-6">
              <TabsContent value="basic" className="space-y-4 m-0">
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Plan Name</Label>
                  <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-12 rounded-xl bg-background/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Price (₹)</Label>
                    <Input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="h-12 rounded-xl bg-background/50" />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Meal Count</Label>
                    <Input required type="number" value={formData.mealCount} onChange={e => setFormData({...formData, mealCount: e.target.value})} className="h-12 rounded-xl bg-background/50" />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Meal Sessions</Label>
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
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Service Areas (From Master)</Label>
                  <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-background/50 border border-border/50">
                    {availableAreas.map(area => {
                      const isSelected = formData.areas.includes(area.name);
                      return (
                        <Badge 
                          key={area.id} 
                          onClick={() => {
                            if (isSelected) {
                              setFormData({...formData, areas: formData.areas.filter((a: string) => a !== area.name)});
                            } else {
                              setFormData({...formData, areas: [...formData.areas, area.name]});
                            }
                          }}
                          className={`cursor-pointer px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${isSelected ? 'bg-indigo-500 text-white' : 'bg-muted text-muted-foreground'}`}
                        >
                          {area.name}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Pause Allowed</Label>
                    <div className="flex items-center gap-3 h-12 px-4 rounded-xl bg-background/50 border border-border/50">
                      <Switch checked={formData.pauseAllowed} onCheckedChange={v => setFormData({...formData, pauseAllowed: v})} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{formData.pauseAllowed ? "YES" : "NO"}</span>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Max Skips</Label>
                    <Input type="number" value={formData.maxSkips} onChange={e => setFormData({...formData, maxSkips: e.target.value})} className="h-12 rounded-xl bg-background/50" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="meal" className="space-y-4 m-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Diet Type</Label>
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
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Spice Level</Label>
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
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Master Inclusions</Label>
                  <div className="flex flex-wrap gap-2">
                    {availableInclusions.map(inc => (
                      <Badge 
                        key={inc.id}
                        variant={formData.inclusions.includes(inc.name) ? "default" : "outline"}
                        className={`cursor-pointer px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${formData.inclusions.includes(inc.name) ? 'bg-emerald-500' : 'bg-muted/50'}`}
                        onClick={() => {
                          if (formData.inclusions.includes(inc.name)) {
                            setFormData({...formData, inclusions: formData.inclusions.filter((i: string) => i !== inc.name)});
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
                  Update Plan Configuration
               </Button>
            </DialogFooter>
          </Tabs>
        </form>
      </DialogContent>
    </Dialog>
  );
}
