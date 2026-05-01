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
import { updateTiffinPlan, getVendorTiffinInclusions } from "@/app/actions/tiffin";
import { TiffinMealType } from "@/types/tiffin";
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
    mealType: plan.mealType,
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
  const [availableInclusions, setAvailableInclusions] = useState<string[]>([]);

  useEffect(() => {
    async function fetchInclusions() {
      const inc = await getVendorTiffinInclusions(vendorId);
      setAvailableInclusions(inc);
    }
    if (vendorId && open) fetchInclusions();
  }, [vendorId, open]);

  const addArea = () => {
    if (areaInput && !formData.areas.includes(areaInput)) {
      setFormData({ ...formData, areas: [...formData.areas, areaInput] });
      setAreaInput("");
    }
  };

  const addTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput] });
      setTagInput("");
    }
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
        deliveryRadiusKm: formData.deliveryRadiusKm ? parseFloat(formData.deliveryRadiusKm) : undefined,
        maxSkips: parseInt(formData.maxSkips),
        maxSubscribers: formData.maxSubscribers ? parseInt(formData.maxSubscribers) : undefined,
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
        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-emerald-500/10 hover:text-emerald-500 transition-all active:scale-90">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col p-0 rounded-[2.5rem] bg-card/95 backdrop-blur-3xl border-border shadow-2xl">
        <DialogHeader className="p-8 pb-0">
          <DialogTitle className="text-3xl font-black tracking-tight italic uppercase text-emerald-500">Edit Plan</DialogTitle>
          <DialogDescription className="font-medium text-muted-foreground uppercase tracking-widest text-[10px]">
            Modify subscription settings and constraints.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
          <Tabs defaultValue="basic" className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="mx-8 mt-4 bg-muted/50 p-1 rounded-2xl">
              <TabsTrigger value="basic" className="rounded-xl font-bold text-[10px] uppercase tracking-widest gap-2 flex-1">
                <Utensils size={14} /> Basic
              </TabsTrigger>
              <TabsTrigger value="delivery" className="rounded-xl font-bold text-[10px] uppercase tracking-widest gap-2 flex-1">
                <Truck size={14} /> Delivery
              </TabsTrigger>
              <TabsTrigger value="meal" className="rounded-xl font-bold text-[10px] uppercase tracking-widest gap-2 flex-1">
                <Settings size={14} /> Config
              </TabsTrigger>
              <TabsTrigger value="billing" className="rounded-xl font-bold text-[10px] uppercase tracking-widest gap-2 flex-1">
                <Wallet size={14} /> Billing
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-6">
              <TabsContent value="basic" className="space-y-4 m-0">
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Plan Name</Label>
                  <Input 
                    required 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="h-12 rounded-xl bg-background/50"
                  />
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Meal Session</Label>
                    <Select value={formData.mealType} onValueChange={(v: any) => setFormData({...formData, mealType: v})}>
                      <SelectTrigger className="h-12 rounded-xl bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BREAKFAST">Breakfast</SelectItem>
                        <SelectItem value="LUNCH">Lunch</SelectItem>
                        <SelectItem value="DINNER">Dinner</SelectItem>
                        <SelectItem value="BOTH">Both (L & D)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Validity (Days)</Label>
                    <Input required type="number" value={formData.validityDays} onChange={e => setFormData({...formData, validityDays: e.target.value})} className="h-12 rounded-xl bg-background/50" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Tags</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Add tag..." 
                      value={tagInput} 
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="h-10 rounded-xl bg-background/50"
                    />
                    <Button type="button" onClick={addTag} variant="secondary" className="h-10 rounded-xl">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.tags.map((t: string) => (
                      <Badge key={t} className="bg-emerald-500/10 text-emerald-500 border-none px-2 py-0.5 rounded-lg text-[9px] font-black uppercase">
                        {t} <X size={10} className="ml-1 cursor-pointer" onClick={() => setFormData({...formData, tags: formData.tags.filter((i: string) => i !== t)})} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="delivery" className="space-y-4 m-0">
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Delivery Time Slot</Label>
                  <Input 
                    placeholder="e.g. 12:00 PM - 2:00 PM" 
                    value={formData.timeSlot}
                    onChange={e => setFormData({...formData, timeSlot: e.target.value})}
                    className="h-12 rounded-xl bg-background/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Service Areas</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Add area..." 
                      value={areaInput} 
                      onChange={e => setAreaInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addArea())}
                      className="h-10 rounded-xl bg-background/50"
                    />
                    <Button type="button" onClick={addArea} variant="secondary" className="h-10 rounded-xl">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.areas.map((a: string) => (
                      <Badge key={a} className="bg-indigo-500/10 text-indigo-500 border-none px-2 py-0.5 rounded-lg text-[9px] font-black uppercase">
                        {a} <X size={10} className="ml-1 cursor-pointer" onClick={() => setFormData({...formData, areas: formData.areas.filter((i: string) => i !== a)})} />
                      </Badge>
                    ))}
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
                        <SelectItem value="VEG">Pure Veg</SelectItem>
                        <SelectItem value="NON-VEG">Non-Veg</SelectItem>
                        <SelectItem value="EGG">Eggitarian</SelectItem>
                        <SelectItem value="JAIN">Jain Menu</SelectItem>
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
                        <SelectItem value="MILD">Mild</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="SPICY">Spicy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Free Inclusions</Label>
                  <div className="flex flex-wrap gap-2">
                    {availableInclusions.map((inc: string) => (
                      <button
                        key={inc}
                        type="button"
                        onClick={() => setFormData(p => ({
                          ...p,
                          inclusions: p.inclusions.includes(inc) ? p.inclusions.filter((i: string) => i !== inc) : [...p.inclusions, inc]
                        }))}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                          formData.inclusions.includes(inc) ? "bg-emerald-500 border-emerald-500 text-zinc-950" : "bg-background/50 border-border/50 text-muted-foreground"
                        }`}
                      >
                        {inc}
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="billing" className="space-y-4 m-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Payment Type</Label>
                    <Select value={formData.paymentType} onValueChange={v => setFormData({...formData, paymentType: v})}>
                      <SelectTrigger className="h-12 rounded-xl bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PREPAID">Prepaid Only</SelectItem>
                        <SelectItem value="POSTPAID">Postpaid Allowed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Auto-Renew</Label>
                    <div className="flex items-center gap-3 h-12 px-4 rounded-xl bg-background/50 border border-border/50">
                      <Switch checked={formData.autoRenew} onCheckedChange={v => setFormData({...formData, autoRenew: v})} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{formData.autoRenew ? "ENABLED" : "DISABLED"}</span>
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Max Subscribers (Optional)</Label>
                  <Input type="number" value={formData.maxSubscribers} onChange={e => setFormData({...formData, maxSubscribers: e.target.value})} className="h-12 rounded-xl bg-background/50" />
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="p-8 pt-4 border-t border-border/50 bg-muted/20">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-14 rounded-2xl bg-zinc-950 dark:bg-white dark:text-zinc-950 font-black uppercase tracking-widest text-[11px] shadow-2xl transition-all active:scale-95"
            >
              {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Save className="mr-2" size={20} />}
              Update Plan Details
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
