
'use client';

import { useState } from 'react';
import { 
  Zap, 
  Check, 
  Package, 
  Star,
  ShieldCheck,
  CreditCard,
  Timer,
  ChevronRight,
  Loader2,
  Calendar,
  Activity,
  User2Icon,
  LayoutGrid,
  Sparkles,
  Infinity,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { subscribeToPlan } from '@/app/actions/vendor-subscription';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function SubscriptionClient({ 
  currentVendor, 
  availablePlans,
  allFeatures,
  allLimits
}: { 
  currentVendor: any, 
  availablePlans: any[],
  allFeatures: any[],
  allLimits: any[]
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleSubscribe = async (plan: any) => {
    if (plan.name === currentVendor.subscriptionPlan && currentVendor.subscriptionStatus === 'ACTIVE') {
      toast.info('You are already on this plan');
      return;
    }
    setSelectedPlan(plan);
    setIsConfirmModalOpen(true);
  };

  const confirmSubscription = async () => {
    if (!selectedPlan) return;
    setLoading(selectedPlan.name);
    try {
      const result = await subscribeToPlan(selectedPlan.name);
      if (result.success) {
        toast.success(`Successfully subscribed to ${selectedPlan.displayName}`);
        window.location.reload(); // Refresh to update session and UI
      } else {
        toast.error(result.error);
      }
    } catch (e) {
      toast.error('Fatal synchronization error');
    } finally {
      setLoading(null);
      setIsConfirmModalOpen(false);
    }
  };

  const currentPlanDetails = availablePlans.find(p => p.name === currentVendor.subscriptionPlan);

  return (
    <div className="space-y-12 pb-20">
      {/* Header & Current Status */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner">
                 <CreditCard size={20} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white italic uppercase">Subscription Core</h1>
           </div>
           <p className="text-zinc-500 font-medium font-sans uppercase text-[10px] tracking-[0.3em]">Manage your partner tier and infrastructure capabilities.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-6 sm:gap-8 shadow-2xl relative overflow-hidden group w-full lg:w-auto">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform">
              <Activity size={80} />
           </div>
           <div className="space-y-1 relative z-10 flex-1 sm:flex-none">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">Current Node</p>
              <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">{currentVendor.subscriptionPlan} Tier</h3>
           </div>
           <div className="h-10 w-[1px] bg-zinc-800 hidden sm:block" />
           <div className="h-[1px] w-full bg-zinc-800/50 sm:hidden" />
           <div className="space-y-1 relative z-10 flex-1 sm:flex-none">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">Account Status</p>
              <div className="flex items-center gap-2">
                 <div className={`h-2 w-2 rounded-full ${currentVendor.subscriptionStatus === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                 <span className={`text-xs font-black uppercase tracking-widest italic ${currentVendor.subscriptionStatus === 'ACTIVE' ? 'text-emerald-500' : 'text-red-500'}`}>{currentVendor.subscriptionStatus}</span>
              </div>
           </div>
           <div className="h-10 w-[1px] bg-zinc-800 hidden sm:block" />
           <div className="h-[1px] w-full bg-zinc-800/50 sm:hidden" />
           <div className="space-y-1 relative z-10 flex-1 sm:flex-none">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">Cycle Reset</p>
              <p suppressHydrationWarning className="text-xs font-black text-zinc-400 italic uppercase tracking-widest flex items-center gap-2">
                 <Calendar size={12} className="text-emerald-500/50" /> {new Date(currentVendor.subscriptionEnd).toLocaleDateString()}
              </p>
           </div>
        </div>
      </div>

      {/* Available Plans Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {availablePlans.map((plan: any) => {
          const isCurrent = plan.name === currentVendor.subscriptionPlan;
          const isPro = plan.name.includes('PRO') || plan.displayName.toLowerCase().includes('pro');
          const isEnterprise = plan.name.includes('ENTERPRISE') || plan.displayName.toLowerCase().includes('enterprise');

          return (
            <div 
              key={plan.id} 
              className={`bg-zinc-900 border ${isCurrent ? 'border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.1)]' : 'border-zinc-800'} rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl relative group hover:scale-[1.02] transition-all flex flex-col`}
            >
              {isCurrent && (
                <div className="absolute top-6 right-8">
                   <Badge className="bg-emerald-500 text-zinc-950 font-black uppercase text-[8px] px-3 py-1 italic tracking-widest">Active Plan</Badge>
                </div>
              )}
              
              <div className={`p-6 sm:p-10 ${isCurrent ? 'bg-emerald-500/5' : 'bg-zinc-950/20'} border-b border-zinc-800/50`}>
                 <div className={`h-14 w-14 rounded-[1.25rem] ${isEnterprise ? 'bg-purple-500/10 text-purple-500' : isPro ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'} flex items-center justify-center mb-8 shadow-inner`}>
                    {isEnterprise ? <ShieldCheck size={28} /> : isPro ? <Sparkles size={28} /> : <Zap size={28} />}
                 </div>
                 
                 <div className="space-y-2">
                    <div className="flex items-center gap-2">
                       <Badge variant="outline" className="text-[7px] font-black uppercase tracking-tighter border-zinc-800 text-zinc-500 px-2 h-4 italic">Platform Node</Badge>
                       <Badge variant="outline" className="text-[7px] font-black uppercase tracking-tighter border-zinc-800 text-emerald-500 px-2 h-4 italic">{plan.category?.label || 'Global'}</Badge>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white italic tracking-tighter uppercase leading-none">{plan.displayName}</h3>
                    <p className="text-[10px] font-medium text-zinc-500 tracking-wide line-clamp-2">{plan.description || 'Essential infrastructure for your business node.'}</p>
                 </div>

                 <div className="mt-8 flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-white italic tracking-tighter">₹{plan.price}</span>
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">/ Billing Cycle</span>
                 </div>
              </div>

              <div className="p-6 sm:p-10 space-y-8 sm:space-y-10 flex-1">
                 <div className="space-y-5">
                    <div className="flex items-center justify-between">
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 italic">Access Nodes</p>
                       <Badge variant="ghost" className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">{plan.features.length} Enabled</Badge>
                    </div>
                    <div className="space-y-5">
                        {(plan.features || []).map((feature: any) => {
                          return (
                            <div key={feature.id} className="group/feature flex flex-col gap-1">
                               <div className="flex items-center gap-4 text-[12px] font-black text-zinc-200 uppercase tracking-tighter italic group-hover/feature:text-white transition-colors">
                                 <div className={`h-5 w-5 rounded-lg ${isCurrent ? 'bg-emerald-500' : 'bg-zinc-800'} flex items-center justify-center text-zinc-950 shrink-0 transition-colors group-hover/feature:bg-emerald-500`}>
                                   <Check size={12} strokeWidth={4} />
                                 </div>
                                 {feature.label}
                               </div>
                               {feature.description && (
                                 <p className="text-[9px] font-medium text-zinc-600 pl-9 line-clamp-1 group-hover/feature:text-zinc-500 transition-colors">{feature.description}</p>
                               )}
                            </div>
                          );
                        })}
                    </div>
                 </div>

                 <div className="space-y-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 italic">Operational Logic</p>
                    <div className="grid grid-cols-2 gap-4">
                        {(plan.limits || []).map((l: any) => {
                          const limitKey = l.limitKey.toLowerCase();
                          const Icon = limitKey.includes('staff') ? User2Icon : 
                                       limitKey.includes('menu') ? LayoutGrid :
                                       limitKey.includes('whatsapp') ? MessageSquare :
                                       limitKey.includes('radius') ? Activity : Package;

                          return (
                            <div key={l.id} className="bg-zinc-950/50 p-4 rounded-3xl border border-zinc-800/50 hover:border-zinc-700 transition-colors group/limit">
                               <div className="flex items-center gap-2 mb-2">
                                  <div className="h-5 w-5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 group-hover/limit:text-emerald-500 transition-colors">
                                     <Icon size={10} />
                                  </div>
                                  <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{l.limit?.label || l.limitKey}</p>
                               </div>
                               <div className="flex items-end gap-1">
                                  {l.value === 0 ? <Infinity size={18} className="text-emerald-500" /> : <p className="text-xl font-black text-white italic leading-none">{l.value}</p>}
                                  {l.limit?.unit && <span className="text-[8px] font-black text-zinc-700 uppercase tracking-tighter mb-0.5">{l.limit.unit}</span>}
                               </div>
                            </div>
                          );
                        })}
                    </div>
                 </div>
              </div>

              <div className="p-6 sm:p-10 pt-0 mt-auto">
                 <Button 
                   disabled={isCurrent || !!loading}
                   onClick={() => handleSubscribe(plan)}
                   className={`w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-xs italic transition-all active:scale-95 ${
                     isCurrent 
                       ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                       : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-xl shadow-emerald-500/20'
                   }`}
                 >
                    {loading === plan.name ? <Loader2 className="animate-spin" /> : isCurrent ? 'Active Subscription' : 'Upgrade Infrastructure'}
                 </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Support Section */}
      <div className="bg-zinc-900/40 border border-zinc-800 border-dashed rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
         <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
            <div className="h-16 w-16 rounded-[1.5rem] md:rounded-[2rem] bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-600 shrink-0">
               <HelpCircle size={32} />
            </div>
            <div className="space-y-1">
               <h4 className="text-lg md:text-xl font-black text-white italic uppercase tracking-tighter mb-1">Need a custom node?</h4>
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic max-w-md leading-relaxed">Contact our platform engineering team for high-throughput enterprise solutions.</p>
            </div>
         </div>
         <Button variant="outline" className="h-12 md:h-14 w-full lg:w-auto px-8 md:px-10 rounded-[1.25rem] md:rounded-2xl border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 font-black uppercase tracking-widest text-[10px] italic">
            Request Engineering Sync
         </Button>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white rounded-[2rem] md:rounded-[3rem] p-0 overflow-hidden w-[95vw] sm:max-w-[500px] max-h-[90vh] flex flex-col">
           <div className="p-6 md:p-10 space-y-6 md:space-y-8 text-center overflow-y-auto custom-scrollbar flex-1">
              <div className="h-16 w-16 md:h-20 md:w-20 rounded-xl md:rounded-[2rem] bg-emerald-500/10 flex items-center justify-center text-emerald-500 mx-auto shadow-inner mb-2 shrink-0">
                 <Zap size={32} className="md:w-10 md:h-10" />
              </div>
              <DialogHeader className="p-0 text-center">
                 <DialogTitle className="text-xl md:text-2xl font-black italic uppercase tracking-tighter leading-none mb-3 md:mb-4">Confirm Synchronization</DialogTitle>
                 <DialogDescription className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-zinc-500 italic max-w-[300px] mx-auto leading-relaxed">
                    You are about to upgrade to the <span className="text-white">{selectedPlan?.displayName}</span> tier. This will immediately expand your platform capabilities.
                 </DialogDescription>
              </DialogHeader>

              <div className="pt-2 md:pt-4 flex flex-col gap-3">
                 <Button 
                   onClick={confirmSubscription}
                   disabled={!!loading}
                   className="h-12 md:h-14 w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-[10px] rounded-xl md:rounded-2xl shadow-xl shadow-emerald-500/20"
                 >
                    {loading ? <Loader2 className="animate-spin" /> : 'Execute Synchronization'}
                 </Button>
                 <Button 
                   onClick={() => setIsConfirmModalOpen(false)}
                   variant="ghost" 
                   className="h-12 md:h-14 w-full text-[10px] font-black uppercase tracking-widest italic text-zinc-600 hover:text-white"
                 >
                    Abort Operation
                 </Button>
              </div>
           </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
