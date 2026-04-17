import { prisma } from '@/lib/db';
import { 
  CreditCard, 
  Plus, 
  Check, 
  X, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Zap, 
  ShieldCheck, 
  Star,
  Settings2,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default async function AdminPlansPage() {
  // In a real app, this would fetch from PlatformPlan model
  // const plans = await prisma.platformPlan.findMany();
  
  const mockPlans = [
    { id: '1', name: 'BASIC', displayName: 'Essential Starter', price: 29.00, isActive: true, features: ['50 Menu Items', 'Basic Analytics', 'Standard Support', 'QR Table Ordering'] },
    { id: '2', name: 'PRO', displayName: 'Business Professional', price: 99.00, isActive: true, features: ['Unlimited Menu Items', 'Advanced SEO & Analytics', 'WhatsApp Integration', 'Priority Support', 'Custom Domain'] },
    { id: '3', name: 'ENTERPRISE', displayName: 'Platform Scaler', price: 299.00, isActive: true, features: ['Multi-store Support', 'Dedicated Account Manager', 'API Access', 'Custom White-labeling', 'SLA Guarantee'] },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 italic">Commercial Catalog</h1>
          <p className="text-zinc-500 font-medium">Define your platform's subscription offerings and feature entitlements.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-xs h-12 px-8 shadow-xl shadow-emerald-500/20">
             <Plus className="w-5 h-5 mr-1" /> Architect New Plan
           </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {mockPlans.map((plan: any) => (
          <div key={plan.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative group">
             {/* Header */}
             <div className="p-8 border-b border-zinc-800 bg-zinc-950/20">
                <div className="flex items-center justify-between mb-6">
                   <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-500 shadow-inner group-hover:scale-110 transition-transform">
                      {plan.name === 'ENTERPRISE' ? <ShieldCheck size={24} /> : (plan.name === 'PRO' ? <Star size={24} /> : <Package size={24} />)}
                   </div>
                   <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                         <button className="text-zinc-500 hover:text-white transition-colors">
                            <MoreVertical size={20} />
                         </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white w-48 p-2">
                         <DropdownMenuItem className="focus:bg-zinc-800 px-2 py-2 rounded-lg cursor-pointer text-xs font-bold">
                            <Edit className="w-4 h-4 mr-2" /> Modify Features
                         </DropdownMenuItem>
                         <DropdownMenuItem className="focus:bg-zinc-800 px-2 py-2 rounded-lg cursor-pointer text-xs font-bold">
                            <Settings2 className="w-4 h-4 mr-2" /> Global Config
                         </DropdownMenuItem>
                         <DropdownMenuSeparator className="bg-zinc-800" />
                         <DropdownMenuItem className="focus:bg-red-500/10 px-2 py-2 rounded-lg cursor-pointer text-red-500 text-xs font-bold font-sans">
                            <Trash2 className="w-4 h-4 mr-2" /> Retire Plan
                         </DropdownMenuItem>
                      </DropdownMenuContent>
                   </DropdownMenu>
                </div>
                <div className="space-y-1">
                   <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[9px] font-black uppercase tracking-[0.2em] mb-2">{plan.name}</Badge>
                   <h3 className="text-xl font-black text-white italic tracking-tight">{plan.displayName}</h3>
                   <div className="flex items-baseline gap-1 pt-2">
                      <span className="text-3xl font-black text-white">${plan.price}</span>
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-tighter">/ monthly</span>
                   </div>
                </div>
             </div>

             {/* Features */}
             <div className="p-8 space-y-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Entitlements:</p>
                <div className="space-y-3">
                   {plan.features.map((feature: any, i: any) => (
                      <div key={i} className="flex items-center gap-3 text-xs font-bold text-zinc-400">
                         <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                            <Check size={12} strokeWidth={4} />
                         </div>
                         {feature}
                      </div>
                   ))}
                </div>
             </div>

             {/* Footer Info */}
             <div className="p-6 bg-zinc-950/40 border-t border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className={`h-2 w-2 rounded-full ${plan.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                   <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{plan.isActive ? 'Active Node' : 'Suspended'}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black text-zinc-700 uppercase tracking-tighter italic">
                   424 Vendors Attached
                </div>
             </div>
          </div>
        ))}

        {/* Action Card */}
        <div className="border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:border-emerald-500/30 transition-all">
           <div className="h-16 w-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-700 mb-6 group-hover:scale-110 transition-transform">
              <Zap size={32} />
           </div>
           <p className="text-lg font-black text-zinc-500 italic uppercase leading-none mb-2">Architect New Tier</p>
           <p className="text-xs text-zinc-700 font-bold uppercase tracking-widest leading-relaxed max-w-[200px]">Create a new value proposition for specialized market segments.</p>
        </div>
      </div>

      {/* Global Entitlements Config */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-10">
         <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
               <Settings2 size={32} />
            </div>
            <div className="space-y-1">
               <h3 className="text-xl font-black text-white italic tracking-tight uppercase leading-none">Global Feature Matrix</h3>
               <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest italic">Synchronize entitlements across all active subscription instances.</p>
            </div>
         </div>
         <Button variant="outline" className="rounded-2xl border-zinc-800 bg-zinc-950 px-10 h-14 text-white font-black uppercase tracking-[0.2em] text-[10px] hover:bg-zinc-900 transition-all shadow-xl">
            Audit Feature Permissions
         </Button>
      </div>
    </div>
  );
}
