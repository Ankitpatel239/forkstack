import React from 'react';
import { getTiffinPlan, getVendorByUserId, getVendorTiffinSettings } from '@/app/actions/tiffin';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { CheckoutForm } from './CheckoutForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ShieldCheck, Clock, Truck, UtensilsCrossed } from 'lucide-react';

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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 transition-colors duration-500 selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto">
        {/* Progress Header */}
        <div className="mb-12 text-center space-y-2">
          <Badge variant="outline" className="rounded-full px-6 py-1 border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-[0.2em] text-[10px]">
            Secure Checkout
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white uppercase italic">
            Finalize <span className="text-emerald-500">Subscription</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl mx-auto">
            You're just one step away from fresh, home-cooked meals delivered daily.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT COLUMN: Plan Summary (Sticky on Desktop) */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-12">
            <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-white dark:bg-zinc-900/40 backdrop-blur-3xl border border-zinc-200/50 dark:border-white/5">
              <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500" />
              
              <CardHeader className="p-10 pb-6">
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={`border-none font-black px-4 py-1.5 rounded-xl text-[10px] uppercase tracking-widest ${
                      plan.mealTypes[0] === 'BREAKFAST' ? 'bg-amber-500 text-zinc-950' : 
                      plan.mealTypes[0] === 'LUNCH' ? 'bg-emerald-500 text-white' : 
                      plan.mealTypes[0] === 'DINNER' ? 'bg-indigo-500 text-white' : 'bg-zinc-500 text-white'
                    }`}>
                      {plan.mealTypes.join(" + ")}
                    </Badge>
                    {plan.tags && plan.tags.map(tag => (
                      <Badge key={tag} className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-none font-bold px-4 py-1.5 rounded-xl text-[9px] uppercase tracking-widest italic">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <CardTitle className="text-4xl font-black text-zinc-900 dark:text-white leading-tight">
                      {plan.name}
                    </CardTitle>
                    {plan.description && (
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium italic leading-relaxed">
                        {plan.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-4 pt-2">
                      <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 font-bold text-[10px] uppercase tracking-wider">
                        <Clock size={14} className="text-emerald-500" />
                        Window: {plan.timeSlot || 'Standard Delivery'}
                      </div>
                      {plan.dietType && (
                        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 font-bold text-[10px] uppercase tracking-wider">
                          <Badge variant="outline" className="h-4 border-emerald-500/30 text-[8px]">{plan.dietType}</Badge>
                        </div>
                      )}
                      {plan.spiceLevel && (
                        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 font-bold text-[10px] uppercase tracking-wider">
                          <Badge variant="outline" className="h-4 border-orange-500/30 text-[8px]">{plan.spiceLevel} SPICE</Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-zinc-100 dark:border-white/5 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">Price Per Cycle</p>
                      <div className="text-5xl font-black text-emerald-500 tracking-tighter">
                        ₹{plan.price}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">Duration</p>
                      <div className="text-xl font-bold text-zinc-900 dark:text-white">{plan.validityDays} Days</div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-10 pt-0 space-y-10">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Meals</p>
                    <p className="text-lg font-black text-zinc-900 dark:text-white">{plan.mealCount}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Max Skips</p>
                    <p className="text-lg font-black text-zinc-900 dark:text-white">{plan.maxSkips}</p>
                  </div>
                </div>

                {plan.areas && plan.areas.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Service Coverage</p>
                    <div className="flex flex-wrap gap-2">
                      {plan.areas.map(area => (
                        <Badge key={area} variant="outline" className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-[10px] px-3">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {plan.inclusions && plan.inclusions.length > 0 && (
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                      <UtensilsCrossed size={12} /> Standard Inclusions
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {plan.inclusions.map((item, idx) => (
                        <div key={idx} className="px-3 py-1.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-8 border-t border-zinc-100 dark:border-white/5">
                  <div className="bg-zinc-50 dark:bg-zinc-950/50 p-6 rounded-[2rem] border border-zinc-200/50 dark:border-white/5 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-500">
                      <ShieldCheck size={18} />
                      <span className="text-[10px] font-black uppercase tracking-widest italic">Consumer Protection Protocol</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed italic">
                      "This subscription includes automatic meal credit rollover. {plan.pauseAllowed ? 'You can pause your service at any time.' : ''} Quality is guaranteed by {vendor.businessName}."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="px-10 py-6 rounded-[2.5rem] bg-zinc-950 text-white flex items-center justify-between group cursor-help transition-all hover:scale-[1.02]">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-emerald-400">
                  <Check size={20} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-black uppercase tracking-widest">Verified Vendor</p>
                  <p className="text-[10px] text-zinc-400 font-medium">Licensed Tiffin Provider</p>
                </div>
              </div>
              <ShieldCheck className="text-emerald-500 opacity-20 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* RIGHT COLUMN: Checkout Form */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-zinc-900/40 p-8 md:p-14 rounded-[3.5rem] shadow-2xl border border-zinc-100 dark:border-white/5 relative overflow-hidden backdrop-blur-3xl">
              <div className="absolute top-0 right-0 p-12 opacity-5 dark:opacity-10 pointer-events-none -mr-8 -mt-8">
                <Truck size={200} className="rotate-12" />
              </div>
              
              <div className="relative z-10">
                <CheckoutForm 
                  vendorId={vendor.id} 
                  planId={planId} 
                  availableOptions={{
                    timeSlots: settings?.timeSlots || [],
                    dietTypes: settings?.dietTypes || [],
                    spiceLevels: settings?.spiceLevels || []
                  }}
                />
              </div>
            </div>

            {/* Support/Trust Footer */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
              <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                <ShieldCheck size={14} /> PCI Compliant
              </div>
              <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                <Check size={14} /> Verified Logistics
              </div>
              <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                <Clock size={14} /> 24/7 Support
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
