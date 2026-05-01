import React from 'react';
import { getTiffinPlan, getVendorByUserId, getVendorTiffinSettings } from '@/app/actions/tiffin';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { CheckoutForm } from './CheckoutForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ShieldCheck, Clock, Truck } from 'lucide-react';

export default async function TiffinCheckoutPage({
  params
}: {
  params: Promise<{ vendorSlug: string, planId: string }>
}) {
  const { vendorSlug, planId } = await params;

  const vendor = await prisma.vendorProfile.findUnique({
    where: { tenantSlug: vendorSlug }
  });

  if (!vendor) notFound();

  const plan = await getTiffinPlan(planId);
  if (!plan || plan.vendorId !== vendor.id) notFound();

  const settings = await getVendorTiffinSettings(vendor.id);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 transition-colors duration-500">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Order Summary */}
        <div className="space-y-8 sticky top-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white uppercase italic">Complete Subscription</h1>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium text-lg">Fresh, home-cooked meals delivered daily to your doorstep.</p>
          </div>

          <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200/50 dark:border-white/5">
             <div className="h-3 bg-gradient-to-r from-emerald-500 to-teal-400" />
              <CardHeader className="p-8 pb-4">
                <div className="flex justify-between items-start">
                   <div className="space-y-2">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge className={`border-none font-black px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest ${
                          plan.mealType === 'BREAKFAST' ? 'bg-amber-500 text-zinc-950' : 
                          plan.mealType === 'LUNCH' ? 'bg-emerald-500 text-white' : 
                          plan.mealType === 'DINNER' ? 'bg-indigo-500 text-white' : 'bg-zinc-500 text-white'
                        }`}>
                          {plan.mealType}
                        </Badge>
                        {plan.tags && plan.tags.map(tag => (
                          <Badge key={tag} className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-none font-black px-3 py-1 rounded-lg text-[9px] uppercase tracking-widest italic">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      <CardTitle className="text-3xl font-black text-zinc-900 dark:text-white">{plan.name}</CardTitle>
                      {plan.timeSlot && (
                        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 font-bold text-xs">
                          <Clock size={14} className="text-emerald-500" />
                          Delivery Window: {plan.timeSlot}
                        </div>
                      )}
                   </div>
                   <div className="text-right">
                      <div className="text-3xl font-black text-emerald-500">₹{plan.price}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Total Cycle Due</div>
                   </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="flex items-center gap-4 group">
                      <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                         <Check size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">{plan.mealCount} Scheduled Meals</span>
                        <span className="text-xs text-zinc-500">{plan.dietType || 'VEG'} • {plan.spiceLevel || 'MEDIUM'} SPICE</span>
                      </div>
                   </div>

                   <div className="flex items-center gap-4 group">
                      <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 border border-blue-500/20 group-hover:scale-110 transition-transform">
                         <Clock size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">Valid for {plan.validityDays} days</span>
                        <span className="text-xs text-zinc-500">Up to {plan.maxSkips} skips allowed</span>
                      </div>
                   </div>
                </div>

                {plan.areas && plan.areas.length > 0 && (
                  <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10">
                    <div className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2 italic flex items-center gap-2">
                      <Truck size={12} /> Serviceable Areas
                    </div>
                    <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{plan.areas.join(' • ')}</p>
                  </div>
                )}

                {plan.inclusions && plan.inclusions.length > 0 && (
                  <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
                    <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-3 italic">Free Add-ons Included</div>
                    <div className="flex flex-wrap gap-2">
                       {plan.inclusions.map((item, idx) => (
                         <Badge key={idx} variant="outline" className="rounded-xl border-emerald-500/20 bg-emerald-500/5 text-emerald-500 font-bold px-3 py-1">
                           + {item}
                         </Badge>
                       ))}
                    </div>
                  </div>
                )}

                <div className="pt-8 border-t border-zinc-200 dark:border-white/5 space-y-4">
                   <div className="flex items-center gap-2 text-emerald-500">
                      <ShieldCheck size={20} />
                      <span className="text-xs font-black uppercase tracking-widest italic">ForkStack Assurance</span>
                   </div>
                   <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed italic bg-zinc-50 dark:bg-zinc-950/50 p-4 rounded-2xl border border-zinc-200/50 dark:border-white/5">
                     "Your subscription is protected. {plan.pauseAllowed ? 'Pause/Resume anytime.' : ''} {plan.paymentType === 'POSTPAID' ? 'Postpaid billing enabled.' : 'Secured via prepaid credits.'}"
                   </p>
                </div>
             </CardContent>
          </Card>
          
          <div className="p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 dark:border-emerald-500/5">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-4">Onboarding Process</h4>
             <ul className="space-y-4">
                {[
                  "Register your details and precise delivery address.",
                  "Select your starting date for the service cycle.",
                  "Receive daily menu broadcasts and enjoy fresh meals!"
                ].map((step, i) => (
                  <li key={i} className="text-xs font-bold text-zinc-600 dark:text-zinc-400 flex gap-3 items-center">
                    <span className="h-6 w-6 rounded-lg bg-emerald-500 text-zinc-950 flex items-center justify-center text-[10px] font-black shrink-0">0{i+1}</span>
                    {step}
                  </li>
                ))}
             </ul>
          </div>
        </div>

        {/* Checkout Form Container */}
        <div className="bg-white dark:bg-zinc-900/50 p-8 md:p-12 rounded-[3rem] shadow-2xl border border-zinc-100 dark:border-white/5 relative overflow-hidden transition-colors">
           <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 pointer-events-none">
              <Truck size={120} className="rotate-12" />
           </div>
           <CheckoutForm 
             vendorId={vendor.id} 
             planId={planId} 
             availableOptions={{
               timeSlots: settings?.tiffinTimeSlots || [],
               dietTypes: settings?.tiffinDietTypes || [],
               spiceLevels: settings?.tiffinSpiceLevels || []
             }}
           />
        </div>
      </div>
    </div>
  );
}
