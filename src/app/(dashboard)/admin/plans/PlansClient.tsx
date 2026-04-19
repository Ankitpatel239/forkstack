
'use client';

import { useState } from 'react';
import { 
  Plus, 
  Check, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Zap, 
  ShieldCheck, 
  Star,
  Settings2,
  Package,
  Loader2,
  X
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { upsertPlan } from '@/app/actions/admin';
import { toast } from 'sonner';

export function PlansClient({ initialPlans }: { initialPlans: any[] }) {
  const [plans, setPlans] = useState(initialPlans);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    price: 0,
    features: ['']
  });

  const handleOpenModal = (plan: any = null) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        displayName: plan.displayName,
        description: plan.description || '',
        price: plan.price,
        features: plan.features.length > 0 ? plan.features : ['']
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: '',
        displayName: '',
        description: '',
        price: 0,
        features: ['']
      });
    }
    setIsModalOpen(true);
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeatureInput = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeatureInput = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures.length > 0 ? newFeatures : [''] });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.displayName || formData.price < 0) {
      toast.error('Please fill all required fields correctly');
      return;
    }

    setLoading(true);
    try {
      const filteredFeatures = formData.features.filter(f => f.trim() !== '');
      const result = await upsertPlan({
        ...formData,
        features: filteredFeatures
      });

      if (result.success) {
        toast.success(editingPlan ? 'Plan synchronized' : 'New plan orchestrated');
        setIsModalOpen(false);
        // Refresh plans list (could also use router.refresh() but local state is faster UX)
        if (editingPlan) {
          setPlans(plans.map(p => p.id === result.data.id ? result.data : p));
        } else {
          setPlans([...plans, result.data]);
        }
      } else {
        toast.error(result.error || 'Failed to sync plan');
      }
    } catch (e) {
      toast.error('Critical failure in orchestration node');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 italic">Commercial Catalog</h1>
          <p className="text-zinc-500 font-medium">Define your platform's subscription offerings and feature entitlements.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button 
            onClick={() => handleOpenModal()}
            className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-xs h-12 px-8 shadow-xl shadow-emerald-500/20"
           >
             <Plus className="w-5 h-5 mr-1" /> Architect New Plan
           </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {plans.map((plan: any) => (
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
                         <DropdownMenuItem 
                            onClick={() => handleOpenModal(plan)}
                            className="focus:bg-zinc-800 px-2 py-2 rounded-lg cursor-pointer text-xs font-bold"
                          >
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
                   <h3 className="text-xl font-black text-white italic tracking-tight uppercase leading-none">{plan.displayName}</h3>
                   <div className="flex items-baseline gap-1 pt-2">
                      <span className="text-3xl font-black text-white">${plan.price}</span>
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-tighter">/ monthly</span>
                   </div>
                   {plan.description && (
                     <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-2 line-clamp-2 italic">
                       {plan.description}
                     </p>
                   )}
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
        <div 
          onClick={() => handleOpenModal()}
          className="border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:border-emerald-500/30 transition-all min-h-[400px]"
        >
           <div className="h-16 w-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-700 mb-6 group-hover:scale-110 transition-transform">
              <Zap size={32} />
           </div>
           <p className="text-lg font-black text-zinc-500 italic uppercase leading-none mb-2">Architect New Tier</p>
           <p className="text-xs text-zinc-700 font-bold uppercase tracking-widest leading-relaxed max-w-[200px]">Create a new value proposition for specialized market segments.</p>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[600px] rounded-[2.5rem] p-0 overflow-hidden">
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-10 border-b border-zinc-800 relative">
             <div className="absolute top-0 right-0 p-10 opacity-5">
                <ShieldCheck size={100} />
             </div>
             <DialogHeader className="relative z-10">
               <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6">
                  <Zap size={28} />
               </div>
               <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">
                {editingPlan ? 'Optimize Subscription Node' : 'Architect New Subscription Tier'}
               </DialogTitle>
               <DialogDescription className="text-zinc-500 font-bold text-xs uppercase tracking-widest">
                Configure the technical and fiscal parameters of the plan.
               </DialogDescription>
             </DialogHeader>
          </div>

          <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
             <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Internal Reference (ID)</Label>
                   <Input 
                     value={formData.name}
                     onChange={e => setFormData({...formData, name: e.target.value.toUpperCase()})}
                     placeholder="e.g., PLATINUM" 
                     className="bg-zinc-950 border-zinc-800 h-14 px-6 font-bold text-sm rounded-2xl focus:border-emerald-500/50" 
                     disabled={!!editingPlan}
                   />
                </div>
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Display Label</Label>
                   <Input 
                     value={formData.displayName}
                     onChange={e => setFormData({...formData, displayName: e.target.value})}
                     placeholder="e.g., Ultimate Scale" 
                     className="bg-zinc-950 border-zinc-800 h-14 px-6 font-bold text-sm rounded-2xl focus:border-emerald-500/50" 
                   />
                </div>
             </div>
             
             <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Plan Description</Label>
                <Textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="e.g., The ultimate package for scaling businesses..." 
                  className="bg-zinc-950 border-zinc-800 min-h-[100px] px-6 py-4 font-bold text-sm rounded-2xl focus:border-emerald-500/50 resize-none" 
                />
             </div>

             <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Monthly Cost ($)</Label>
                <Input 
                  type="number"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                  placeholder="0.00" 
                  className="bg-zinc-950 border-zinc-800 h-14 px-6 font-bold text-lg rounded-2xl focus:border-emerald-500/50 text-emerald-400" 
                />
             </div>

             <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Entitled Feature Matrix</Label>
                   <Button 
                    type="button"
                    onClick={addFeatureInput}
                    variant="ghost" 
                    className="h-6 px-2 text-[10px] font-black text-emerald-500 hover:bg-emerald-500/10 rounded-lg"
                   >
                    <Plus size={12} className="mr-1" /> Add Vector
                   </Button>
                </div>
                
                <div className="space-y-3">
                   {formData.features.map((feature, index) => (
                      <div key={index} className="flex gap-3">
                         <div className="flex-1 relative">
                            <Check size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500" />
                            <Input 
                              value={feature}
                              onChange={e => handleFeatureChange(index, e.target.value)}
                              placeholder="e.g., Priority API Access" 
                              className="bg-zinc-950 border-zinc-800 h-12 pl-12 pr-6 font-bold text-xs rounded-xl focus:border-emerald-500/50" 
                            />
                         </div>
                         <button 
                          onClick={() => removeFeatureInput(index)}
                          className="h-12 w-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                         >
                            <Trash2 size={16} />
                         </button>
                      </div>
                   ))}
                </div>
             </div>
          </div>

          <div className="p-8 bg-zinc-950 border-t border-zinc-800 flex justify-end gap-4">
             <Button 
               onClick={() => setIsModalOpen(false)}
               variant="ghost"
               className="h-14 px-8 text-zinc-500 font-black uppercase tracking-widest text-[10px]"
             >
                Abort
             </Button>
             <Button 
               onClick={handleSubmit}
               disabled={loading}
               className="h-14 px-10 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-emerald-500/10 min-w-[180px]"
             >
                {loading ? <Loader2 className="animate-spin" /> : (editingPlan ? 'Optimize Node' : 'Broadcast Plan')}
             </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
