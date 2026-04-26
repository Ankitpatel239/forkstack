'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Save } from "lucide-react";
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
import { createTiffinPlan } from "@/app/actions/tiffin";
import { TiffinMealType } from "@/types/tiffin";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AddPlanDialogProps {
  vendorId: string;
}

export function AddPlanDialog({ vendorId }: AddPlanDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState<{
    name: string;
    price: string;
    mealCount: string;
    mealType: TiffinMealType;
    validityDays: string;
    description: string;
  }>({
    name: "",
    price: "",
    mealCount: "",
    mealType: TiffinMealType.LUNCH,
    validityDays: "30",
    description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorId) return;

    setIsLoading(true);
    try {
      await createTiffinPlan({
        vendorId,
        name: formData.name,
        price: parseFloat(formData.price),
        mealCount: parseInt(formData.mealCount),
        mealType: formData.mealType,
        validityDays: parseInt(formData.validityDays),
        description: formData.description
      });
      
      toast.success("Tiffin plan created successfully!");
      setOpen(false);
      setFormData({
        name: "",
        price: "",
        mealCount: "",
        mealType: TiffinMealType.LUNCH,
        validityDays: "30",
        description: ""
      });
      router.refresh();
    } catch (error) {
      console.error("Create plan failed:", error);
      toast.error("Failed to create tiffin plan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
          <Plus className="mr-2 h-4 w-4" /> Add New Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] bg-card/95 backdrop-blur-2xl border-border shadow-2xl rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight">Create Tiffin Plan</DialogTitle>
          <DialogDescription className="font-medium text-muted-foreground">
            Define a new subscription package for your customers.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Plan Name</Label>
              <Input 
                id="name" 
                required
                placeholder="e.g. Premium Veg Monthly" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="rounded-xl bg-background/50 border-border/50 focus:border-emerald-500/50 h-11"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Price (₹)</Label>
                <Input 
                  id="price" 
                  type="number" 
                  required
                  placeholder="2500" 
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="rounded-xl bg-background/50 border-border/50 focus:border-emerald-500/50 h-11"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="meals" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Total Meals</Label>
                <Input 
                  id="meals" 
                  type="number" 
                  required
                  placeholder="20" 
                  value={formData.mealCount}
                  onChange={(e) => setFormData({...formData, mealCount: e.target.value})}
                  className="rounded-xl bg-background/50 border-border/50 focus:border-emerald-500/50 h-11"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Meal Type</Label>
                <Select 
                  value={formData.mealType}
                  onValueChange={(value: TiffinMealType) => setFormData({...formData, mealType: value})}
                >
                  <SelectTrigger className="rounded-xl bg-background/50 border-border/50 focus:border-emerald-500/50 h-11">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border bg-card/95 backdrop-blur-xl">
                    <SelectItem value="LUNCH">Lunch Only</SelectItem>
                    <SelectItem value="DINNER">Dinner Only</SelectItem>
                    <SelectItem value="BOTH">Both (L & D)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="validity" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Validity (Days)</Label>
                <Input 
                  id="validity" 
                  type="number" 
                  required
                  placeholder="30" 
                  value={formData.validityDays}
                  onChange={(e) => setFormData({...formData, validityDays: e.target.value})}
                  className="rounded-xl bg-background/50 border-border/50 focus:border-emerald-500/50 h-11"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Description</Label>
              <Textarea 
                id="description" 
                placeholder="What's included in this plan?" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="rounded-xl bg-background/50 border-border/50 focus:border-emerald-500/50 min-h-[80px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20"
            >
              {isLoading ? (
                <Loader2 className="animate-spin mr-2" size={18} />
              ) : (
                <Save className="mr-2" size={18} />
              )}
              Create Plan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
