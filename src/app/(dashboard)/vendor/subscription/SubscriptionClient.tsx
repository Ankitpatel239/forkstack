
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
  HelpCircle
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
              <h1 className="text-3xl font-extrabold tracking-tight text-white italic uppercase">Subscription Core</h1>
           </div>
           <p className="text-zinc-500 font-medium font-sans uppercase text-[10px] tracking-[0.3em]">Manage your partner tier and infrastructure capabilities.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex items-center gap-8 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform">
              <Activity size={80} />
           </div>
           <div className="space-y-1 relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">Current Node</p>
              <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">{currentVendor.subscriptionPlan} Tier</h3>
           </div>
           <div className="h-10 w-[1px] bg-zinc-800" />
           <div className="space-y-1 relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">Account Status</p>
              <div className="flex items-center gap-2">
                 <div className={`h-2 w-2 rounded-full ${currentVendor.subscriptionStatus === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                 <span className={`text-xs font-black uppercase tracking-widest italic ${currentVendor.subscriptionStatus === 'ACTIVE' ? 'text-emerald-500' : 'text-red-500'}`}>{currentVendor.subscriptionStatus}</span>
              </div>
           </div>
           <div className="h-10 w-[1px] bg-zinc-800" />
           <div className="space-y-1 relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">Cycle Reset</p>
              <p suppressHydrationWarning className="text-xs font-black text-zinc-400 italic uppercase tracking-widest flex items-center gap-2">
                 <Calendar size={12} className="text-emerald-500/50" /> {new Date(currentVendor.subscriptionEnd).toLocaleDateString()}
              </p>
           </div>
        </div>
      </div>

      {/* Available Plans Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {availablePlans.map((plan: any) => {
          const isCurrent = plan.name === currentVendor.subscriptionPlan;
          const isPro = plan.name === 'PRO' || plan.displayName.toLowerCase().includes('pro');
          const isEnterprise = plan.name === 'ENTERPRISE' || plan.displayName.toLowerCase().includes('enterprise');

          return (
            <div 
              key={plan.id} 
              className={`bg-zinc-900 border ${isCurrent ? 'border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.1)]' : 'border-zinc-800'} rounded-[3rem] overflow-hidden shadow-2xl relative group hover:scale-[1.02] transition-all flex flex-col`}
            >
              {isCurrent && (
                <div className="absolute top-6 right-8">
                   <Badge className="bg-emerald-500 text-zinc-950 font-black uppercase text-[8px] px-3 py-1 italic tracking-widest">Active Plan</Badge>
                </div>
              )}
              
              <div className={`p-10 ${isCurrent ? 'bg-emerald-500/5' : 'bg-zinc-950/20'} border-b border-zinc-800/50`}>
                 <div className={`h-14 w-14 rounded-[1.25rem] ${isEnterprise ? 'bg-purple-500/10 text-purple-500' : isPro ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'} flex items-center justify-center mb-8 shadow-inner`}>
                    {isEnterprise ? <ShieldCheck size={28} /> : isPro ? <Sparkles size={28} /> : <Zap size={28} />}
                 </div>
                 
                 <div className="space-y-1">
                    <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">{plan.displayName}</h3>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">{plan.category?.label || 'Global service domain'}</p>
                 </div>

                 <div className="mt-8 flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white italic tracking-tighter">₹{plan.price}</span>
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">/ Month</span>
                 </div>
              </div>

              <div className="p-10 space-y-8 flex-1">
                 <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 italic">Provisioned Capabilities</p>
                    <div className="space-y-4">
                       {plan.features.map((fKey: string) => {
                         const feature = allFeatures.find(f => f.key === fKey);
                         return (
                           <div key={fKey} className="flex items-center gap-4 text-[11px] font-black text-zinc-400 uppercase tracking-tighter italic group/feature">
                             <div className={`h-5 w-5 rounded-lg ${isCurrent ? 'bg-emerald-500' : 'bg-zinc-800'} flex items-center justify-center text-zinc-950 shrink-0 transition-colors group-hover/feature:bg-emerald-500`}>
                               <Check size={12} strokeWidth={4} />
                             </div>
                             {feature?.label || fKey}
                           </div>
                         );
                       })}
                    </div>
                 </div>

                 <div className="space-y-4 pt-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 italic">Operational Constraints</p>
                    <div className="grid grid-cols-2 gap-4">
                       {Object.entries(plan.limits || {}).map(([key, val]: [string, any]) => {
                         const limit = allLimits.find(l => l.key === key);
                         return (
                           <div key={key} className="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                              <p className="text-[8px] font-black text-zinc-600 uppercase mb-1 tracking-widest">{limit?.label || key}</p>
                              <div className="flex items-center gap-1">
                                 {val === 0 ? <Infinity size={14} className="text-emerald-500" /> : <p className="text-sm font-black text-white italic">{val}</p>}
                                 {limit?.unit && <span className="text-[8px] font-black text-zinc-700 uppercase">{limit.unit}</span>}
                              </div>
                           </div>
                         );
                       })}
                    </div>
                 </div>
              </div>

              <div className="p-10 pt-0 mt-auto">
                 <Button 
                   disabled={isCurrent || !!loading}
                   onClick={() => handleSubscribe(plan)}
                   className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs italic transition-all active:scale-95 ${
                     isCurrent 
                       ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                       : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-xl shadow-emerald-500/20'
                   }`}
                 >
                    {loading === plan.name ? <Loader2 className="animate-spin" /> : isCurrent ? 'Active Subscription' : 'Synchronize Node'}
                 </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Support Section */}
      <div className="bg-zinc-900/40 border border-zinc-800 border-dashed rounded-[3rem] p-12 flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-[2rem] bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-600">
               <HelpCircle size={32} />
            </div>
            <div>
               <h4 className="text-xl font-black text-white italic uppercase tracking-tighter mb-1">Need a custom node?</h4>
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">Contact our platform engineering team for high-throughput enterprise solutions.</p>
            </div>
         </div>
         <Button variant="outline" className="h-14 px-10 rounded-2xl border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 font-black uppercase tracking-widest text-[10px] italic">
            Request Engineering Sync
         </Button>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white rounded-[3rem] p-0 overflow-hidden max-w-[500px]">
           <div className="p-10 space-y-8 text-center">
              <div className="h-20 w-20 rounded-[2rem] bg-emerald-500/10 flex items-center justify-center text-emerald-500 mx-auto shadow-inner mb-2">
                 <Zap size={40} />
              </div>
              <DialogHeader className="p-0 text-center">
                 <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter leading-none mb-4">Confirm Synchronization</DialogTitle>
                 <DialogDescription className="text-xs font-bold uppercase tracking-widest text-zinc-500 italic max-w-[300px] mx-auto">
                    You are about to upgrade to the <span className="text-white">{selectedPlan?.displayName}</span> tier. This will immediately expand your platform capabilities.
                 </DialogDescription>
              </DialogHeader>

              <div className="pt-4 flex flex-col gap-3">
                 <Button 
                   onClick={confirmSubscription}
                   disabled={!!loading}
                   className="h-14 w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-emerald-500/20"
                 >
                    {loading ? <Loader2 className="animate-spin" /> : 'Execute Synchronization'}
                 </Button>
                 <Button 
                   onClick={() => setIsConfirmModalOpen(false)}
                   variant="ghost" 
                   className="h-14 w-full text-[10px] font-black uppercase tracking-widest italic text-zinc-600 hover:text-white"
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
