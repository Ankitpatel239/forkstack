import React from "react";
import { getTiffinPlans, getVendorByUserId } from "@/app/actions/tiffin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit, Calendar, Clock, CreditCard, Sparkles, ChefHat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TiffinPlan } from "@/types/tiffin";
import { AddPlanDialog } from "@/components/vendor/tiffin/AddPlanDialog";
import { DeletePlanButton } from "@/components/vendor/tiffin/DeletePlanButton";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TiffinPlansPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const vendor = await getVendorByUserId(user.id);
  if (!vendor) return <div className="p-10 text-center">No vendor profile found.</div>;

  const plans = await getTiffinPlans(vendor.id);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card/30 backdrop-blur-xl p-8 rounded-3xl border border-border shadow-2xl shadow-emerald-500/5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <ChefHat className="text-emerald-500" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">Active Plans</h2>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Subscription Packages</p>
          </div>
        </div>
        
        <AddPlanDialog vendorId={vendor.id} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 bg-muted/20 border-2 border-dashed border-border rounded-[2rem] text-muted-foreground group">
            <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <Sparkles className="h-10 w-10 opacity-20" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No tiffin plans created yet</h3>
            <p className="text-sm max-w-[250px] text-center mb-6">Create your first subscription plan to start accepting monthly customers.</p>
            <AddPlanDialog vendorId={vendor.id} />
          </div>
        ) : (
          plans.map((plan: TiffinPlan) => (
            <Card key={plan.id} className="border-none bg-card/40 backdrop-blur-2xl shadow-2xl overflow-hidden group relative transition-all hover:scale-[1.02] hover:shadow-emerald-500/10">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
              
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl font-black">{plan.name}</CardTitle>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-black uppercase tracking-widest text-[10px]">
                    {plan.mealType}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2 min-h-[40px] font-medium text-muted-foreground">
                  {plan.description || "No description provided."}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6 pt-2">
                <div className="flex items-baseline gap-1 bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60">Starting at</span>
                  <span className="text-3xl font-black text-emerald-500">₹{plan.price}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60">/ cycle</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50">
                    <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center border border-border shadow-sm">
                      <Clock size={14} className="text-muted-foreground" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground">Meals</span>
                      <span className="text-sm font-bold">{plan.mealCount}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50">
                    <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center border border-border shadow-sm">
                      <Calendar size={14} className="text-muted-foreground" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground">Days</span>
                      <span className="text-sm font-bold">{plan.validityDays}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end gap-3 border-t border-border/50 pt-6 mt-2 bg-muted/20">
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-emerald-500/10 hover:text-emerald-500 transition-all active:scale-90">
                  <Edit className="h-4 w-4" />
                </Button>
                <DeletePlanButton planId={plan.id} />
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
