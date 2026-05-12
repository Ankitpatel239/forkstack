'use client';

import { useState, useEffect } from 'react';
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
  X,
  LayoutGrid,
  ListChecks,
  Infinity,
  ChevronRight,
  Database,
  Coffee,
  Globe,
  Activity,
  User2Icon
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { upsertPlan, deletePlan } from '@/app/actions/admin';
import { upsertFeature, deleteFeature, getFeatures } from '@/app/actions/admin-features';
import { upsertCategory, deleteCategory } from '@/app/actions/admin-categories';
import { upsertLimit, deleteLimit } from '@/app/actions/admin-limits';
import { 
  seedPlatformCategories, 
  seedPlatformFeatures, 
  seedPlatformLimits, 
  seedDemoPlans 
} from '@/app/actions/admin-seed';
import { toast } from 'sonner';

export function PlansClient({ initialPlans, initialFeatures, initialCategories, initialLimits }: { initialPlans: any[], initialFeatures: any[], initialCategories: any[], initialLimits: any[] }) {
  const [plans, setPlans] = useState(initialPlans);
  const [features, setFeatures] = useState(initialFeatures);
  const [categories, setCategories] = useState(initialCategories);
  const [limitsMaster, setLimitsMaster] = useState(initialLimits);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [editingFeature, setEditingFeature] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editingLimit, setEditingLimit] = useState<any>(null);

  const [planForm, setPlanForm] = useState({
    name: '',
    categoryName: categories[0]?.name || '',
    displayName: '',
    description: '',
    price: 0,
    features: [] as string[],
    limits: {} as Record<string, number>
  });

  const [featureForm, setFeatureForm] = useState({
    key: '',
    label: '',
    categoryName: categories[0]?.name || '',
    description: ''
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    label: '',
    description: '',
    icon: 'Package'
  });

  const [limitForm, setLimitForm] = useState({
    key: '',
    label: '',
    unit: '',
    description: ''
  });

  const handleOpenPlanModal = (plan?: any) => {
    if (plan) {
      setEditingPlan(plan);
      setPlanForm({
        name: plan.name,
        categoryName: plan.categoryName,
        displayName: plan.displayName,
        description: plan.description || '',
        price: plan.price,
        features: plan.features,
        limits: plan.limits || {}
      });
    } else {
      setEditingPlan(null);
      const defaultLimits: Record<string, number> = {};
      limitsMaster.forEach(l => defaultLimits[l.key] = 0);
      setPlanForm({
        name: '',
        categoryName: categories[0]?.name || '',
        displayName: '',
        description: '',
        price: 0,
        features: [],
        limits: defaultLimits
      });
    }
    setIsPlanModalOpen(true);
  };

  const handleOpenFeatureModal = (feature?: any) => {
    if (feature) {
      setEditingFeature(feature);
      setFeatureForm({
        key: feature.key,
        label: feature.label,
        categoryName: feature.categoryName,
        description: feature.description || ''
      });
    } else {
      setEditingFeature(null);
      setFeatureForm({
        key: '',
        label: '',
        categoryName: categories[0]?.name || '',
        description: ''
      });
    }
    setIsFeatureModalOpen(true);
  };

  const handleOpenCategoryModal = (category?: any) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name,
        label: category.label,
        description: category.description || '',
        icon: category.icon || 'Package'
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({
        name: '',
        label: '',
        description: '',
        icon: 'Package'
      });
    }
    setIsCategoryModalOpen(true);
  };

  const handleOpenLimitModal = (limit?: any) => {
    if (limit) {
      setEditingLimit(limit);
      setLimitForm({
        key: limit.key,
        label: limit.label,
        unit: limit.unit || '',
        description: limit.description || ''
      });
    } else {
      setEditingLimit(null);
      setLimitForm({
        key: '',
        label: '',
        unit: '',
        description: ''
      });
    }
    setIsLimitModalOpen(true);
  };

  const handleFeatureToggle = (featureKey: string) => {
    const current = planForm.features;
    if (current.includes(featureKey)) {
      setPlanForm({ ...planForm, features: current.filter(k => k !== featureKey) });
    } else {
      setPlanForm({ ...planForm, features: [...current, featureKey] });
    }
  };

  const handlePlanSubmit = async () => {
    if (!planForm.name || !planForm.displayName) {
      toast.error('Please fill required fields');
      return;
    }
    setLoading(true);
    try {
      const result = await upsertPlan(planForm);
      if (result.success) {
        toast.success(editingPlan ? 'Plan synchronized' : 'New plan orchestrated');
        setIsPlanModalOpen(false);
        if (editingPlan) {
          setPlans(plans.map(p => p.id === result.data.id ? { ...result.data, vendorCount: p.vendorCount } : p));
        } else {
          setPlans([...plans, { ...result.data, vendorCount: 0 }]);
        }
      } else {
        toast.error(result.error);
      }
    } catch (e) {
      toast.error('Fatal orchestration error');
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureSubmit = async () => {
    if (!featureForm.key || !featureForm.label) {
      toast.error('Please fill required fields');
      return;
    }
    setLoading(true);
    try {
      const result = await upsertFeature(featureForm);
      if (result.success) {
        toast.success(editingFeature ? 'Feature synchronized' : 'Feature registered in master');
        setIsFeatureModalOpen(false);
        if (editingFeature) {
          setFeatures(features.map(f => f.id === result.data.id ? result.data : f));
        } else {
          setFeatures([...features, result.data]);
        }
      } else {
        toast.error(result.error);
      }
    } catch (e) {
      toast.error('Feature registration failure');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (plan: any) => {
    if (plan.vendorCount > 0) {
      toast.error(`Cannot retire plan: ${plan.vendorCount} active subscriptions.`);
      return;
    }
    if (!confirm('Retire this commercial tier?')) return;
    setDeleting(plan.id);
    try {
      const result = await deletePlan(plan.id);
      if (result.success) {
        toast.success('Commercial tier retired');
        setPlans(plans.filter(p => p.id !== plan.id));
      }
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteFeature = async (featureId: string) => {
    if (!confirm('Delete feature from master? Plans using this key will lose reference.')) return;
    setLoading(true);
    try {
      const result = await deleteFeature(featureId);
      if (result.success) {
        toast.success('Feature purged from master');
        setFeatures(features.filter(f => f.id !== featureId));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async () => {
    if (!categoryForm.name || !categoryForm.label) {
      toast.error('Please fill required fields');
      return;
    }
    setLoading(true);
    try {
      const result = await upsertCategory(categoryForm);
      if (result.success) {
        toast.success(editingCategory ? 'Category synchronized' : 'Category registered');
        setIsCategoryModalOpen(false);
        if (editingCategory) {
          setCategories(categories.map(c => c.id === result.data.id ? result.data : c));
        } else {
          setCategories([...categories, result.data]);
        }
      } else {
        toast.error(result.error);
      }
    } catch (e) {
      toast.error('Category registration failure');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Retire this category master? Subscriptions and features using this domain will lose reference.')) return;
    setLoading(true);
    try {
      const result = await deleteCategory(id);
      if (result.success) {
        toast.success('Category retired');
        setCategories(categories.filter(c => c.id !== id));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLimitSubmit = async () => {
    if (!limitForm.key || !limitForm.label) {
      toast.error('Please fill required fields');
      return;
    }
    setLoading(true);
    try {
      const result = await upsertLimit(limitForm);
      if (result.success) {
        toast.success(editingLimit ? 'Limit synchronized' : 'Limit registered');
        setIsLimitModalOpen(false);
        if (editingLimit) {
          setLimitsMaster(limitsMaster.map(l => l.id === result.data.id ? result.data : l));
        } else {
          setLimitsMaster([...limitsMaster, result.data]);
        }
      } else {
        toast.error(result.error);
      }
    } catch (e) {
      toast.error('Limit registration failure');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLimit = async (id: string) => {
    if (!confirm('Retire this limit master? Plans using this constraint will lose reference.')) return;
    setLoading(true);
    try {
      const result = await deleteLimit(id);
      if (result.success) {
        toast.success('Limit retired');
        setLimitsMaster(limitsMaster.filter(l => l.id !== id));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 italic uppercase">Subscription Plans</h1>
          <p className="text-zinc-500 font-medium font-sans uppercase text-[10px] tracking-[0.3em]">Manage your pricing plans and features for vendors.</p>
        </div>
        <Button 
          onClick={async () => {
            setLoading(true);
            try {
              await seedPlatformCategories();
              await seedPlatformLimits();
              await seedPlatformFeatures();
              await seedDemoPlans();
              toast.success('All platform masters and plans seeded');
              window.location.reload();
            } catch (e: any) {
              toast.error(e.message);
            } finally {
              setLoading(false);
            }
          }}
          className="rounded-xl bg-white hover:bg-zinc-200 text-black font-black uppercase tracking-widest text-[10px] h-12 px-8 shadow-xl"
          disabled={loading}
        >
          <Database className="w-4 h-4 mr-2" /> Seed All Masters & Plans
        </Button>
      </div>

      <Tabs defaultValue="plans" className="w-full">
        <TabsList className="bg-zinc-950 border border-zinc-900 h-14 p-1.5 rounded-2xl mb-8">
          <TabsTrigger value="plans" className="rounded-xl data-[state=active]:bg-zinc-900 data-[state=active]:text-emerald-500 px-8 font-black uppercase tracking-widest text-[10px] h-full flex items-center gap-2">
            <LayoutGrid size={14} /> Subscription Plans
          </TabsTrigger>
          <TabsTrigger value="master" className="rounded-xl data-[state=active]:bg-zinc-900 data-[state=active]:text-blue-500 px-8 font-black uppercase tracking-widest text-[10px] h-full flex items-center gap-2">
            <ListChecks size={14} /> Feature Master
          </TabsTrigger>
          <TabsTrigger value="categories" className="rounded-xl data-[state=active]:bg-zinc-900 data-[state=active]:text-orange-500 px-8 font-black uppercase tracking-widest text-[10px] h-full flex items-center gap-2">
            <Settings2 size={14} /> Category Master
          </TabsTrigger>
          <TabsTrigger value="limits" className="rounded-xl data-[state=active]:bg-zinc-900 data-[state=active]:text-purple-500 px-8 font-black uppercase tracking-widest text-[10px] h-full flex items-center gap-2">
            <Infinity size={14} /> Limit Master
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-8 outline-none">
          <div className="flex justify-end gap-4">
            <Button 
              onClick={async () => {
                setLoading(true);
                const res = await seedDemoPlans();
                setLoading(false);
                if (res.success) {
                  toast.success('Demo plans orchestrated successfully');
                  window.location.reload(); // Refresh to get new data including vendor counts
                } else {
                  toast.error(res.error);
                }
              }}
              variant="outline"
              className="rounded-xl border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-emerald-500 font-black uppercase tracking-widest text-[10px] h-12 px-8 shadow-xl"
              disabled={loading}
            >
              <Database className="w-4 h-4 mr-2" /> Seed Demo Plans
            </Button>
            <Button 
              onClick={() => handleOpenPlanModal()}
              className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-[10px] h-12 px-8 shadow-xl shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4 mr-2" /> Create New Plan
            </Button>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan: any) => (
              <div key={plan.id} className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative group hover:border-emerald-500/30 transition-all">
                <div className="p-8 border-b border-zinc-800 bg-zinc-950/20">
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-500 shadow-inner">
                       <Package size={24} />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-zinc-500 hover:text-white transition-colors h-10 w-10 flex items-center justify-center rounded-xl hover:bg-zinc-800">
                          <MoreVertical size={20} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white w-56 p-2 rounded-2xl">
                        <DropdownMenuItem onClick={() => handleOpenPlanModal(plan)} className="focus:bg-zinc-800 px-3 py-3 rounded-xl cursor-pointer text-[10px] font-black uppercase tracking-widest italic">
                          <Edit className="w-4 h-4 mr-3" /> Edit Plan
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-zinc-800" />
                        <DropdownMenuItem disabled={deleting === plan.id} onClick={() => handleDeletePlan(plan)} className="focus:bg-red-500/10 px-3 py-3 rounded-xl cursor-pointer text-red-500 text-[10px] font-black uppercase tracking-widest italic">
                          {deleting === plan.id ? <Loader2 size={16} className="animate-spin mr-3" /> : <Trash2 className="w-4 h-4 mr-3" />} Delete Plan
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="space-y-1">
                    <Badge className="bg-zinc-950 text-zinc-500 border-zinc-800 text-[8px] font-black uppercase tracking-[0.2em] mb-2 px-3">{plan.categoryName} NODE</Badge>
                    <h3 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">{plan.displayName}</h3>
                    <div className="flex items-baseline gap-1 pt-3">
                      <span className="text-3xl font-black text-white italic">₹{plan.price}</span>
                      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">/ Per Month</span>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Included Features:</p>
                    <div className="space-y-3">
                      {plan.features.slice(0, 4).map((fKey: string) => {
                        const feature = features.find(f => f.key === fKey);
                        return (
                          <div key={fKey} className="flex items-center gap-3 text-[10px] font-bold text-zinc-400 uppercase tracking-tighter italic">
                            <div className="h-5 w-5 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                              <Check size={12} strokeWidth={4} />
                            </div>
                            {feature?.label || fKey}
                          </div>
                        );
                      })}
                      {plan.features.length > 4 && (
                        <p className="text-[10px] font-black text-zinc-600 pl-8">+{plan.features.length - 4} More Features</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 grid grid-cols-2 gap-4">
                    {Object.entries(plan.limits || {}).slice(0, 4).map(([key, val]: [string, any]) => {
                      const limit = limitsMaster.find(l => l.key === key);
                      return (
                        <div key={key} className="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/50">
                           <p className="text-[9px] font-black text-zinc-600 uppercase mb-1 truncate">{limit?.label || key}</p>
                           <p className="text-xs font-black text-white italic">{val === 0 ? '∞' : val}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-6 bg-zinc-950/40 border-t border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Global Sync Active</span>
                  </div>
                  <div className="text-[10px] font-black text-zinc-700 uppercase tracking-tighter italic">
                    {plan.vendorCount || 0} Entities Attached
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="master" className="space-y-8 outline-none">
          <div className="flex justify-end gap-4">
            <Button 
              onClick={async () => {
                setLoading(true);
                const res = await seedPlatformFeatures();
                setLoading(false);
                if (res.success) {
                  toast.success('Feature master seeded');
                  window.location.reload();
                } else {
                  toast.error(res.error);
                }
              }}
              variant="outline"
              className="rounded-xl border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-blue-500 font-black uppercase tracking-widest text-[10px] h-12 px-8 shadow-xl"
              disabled={loading}
            >
              <Database className="w-4 h-4 mr-2" /> Seed Features
            </Button>
            <Button 
              onClick={() => handleOpenFeatureModal()}
              className="rounded-xl bg-blue-500 hover:bg-blue-400 text-zinc-950 font-black uppercase tracking-widest text-[10px] h-12 px-8 shadow-xl shadow-blue-500/20"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Feature
            </Button>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-950/40 border-b border-zinc-800">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Feature Name</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Category</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Feature ID</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 italic text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {features.map((feature: any) => (
                  <tr key={feature.id} className="hover:bg-zinc-800/20 transition-all group">
                    <td className="p-6">
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-blue-500 shadow-inner group-hover:scale-110 transition-transform">
                             <Zap size={16} />
                          </div>
                          <div>
                             <p className="text-xs font-black text-white italic uppercase tracking-tighter leading-none mb-1">{feature.label}</p>
                             <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest line-clamp-1">{feature.description || 'No description provided.'}</p>
                          </div>
                       </div>
                    </td>
                    <td className="p-6">
                       <Badge className="bg-zinc-950 text-zinc-500 border-zinc-800 text-[8px] font-black uppercase italic">{feature.categoryName}</Badge>
                    </td>
                    <td className="p-6">
                       <code className="bg-zinc-950 px-3 py-1 rounded-lg text-[10px] font-black text-emerald-500/70 border border-emerald-500/10 italic">
                          {feature.key}
                       </code>
                    </td>
                    <td className="p-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <Button onClick={() => handleOpenFeatureModal(feature)} variant="ghost" className="h-10 w-10 p-0 hover:bg-zinc-800 text-zinc-500 hover:text-white rounded-xl">
                             <Edit size={16} />
                          </Button>
                          <Button onClick={() => handleDeleteFeature(feature.id)} variant="ghost" className="h-10 w-10 p-0 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 rounded-xl">
                             <Trash2 size={16} />
                          </Button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-8 outline-none">
          <div className="flex justify-end gap-4">
            <Button 
              onClick={async () => {
                setLoading(true);
                const res = await seedPlatformCategories();
                setLoading(false);
                if (res.success) {
                  toast.success('Category master seeded');
                  window.location.reload();
                } else {
                  toast.error(res.error);
                }
              }}
              variant="outline"
              className="rounded-xl border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-orange-500 font-black uppercase tracking-widest text-[10px] h-12 px-8 shadow-xl"
              disabled={loading}
            >
              <Database className="w-4 h-4 mr-2" /> Seed Categories
            </Button>
            <Button 
              onClick={() => handleOpenCategoryModal()}
              className="rounded-xl bg-orange-500 hover:bg-orange-400 text-zinc-950 font-black uppercase tracking-widest text-[10px] h-12 px-8 shadow-xl shadow-orange-500/20"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Category
            </Button>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-950/40 border-b border-zinc-800">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Category Name</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Description</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">System Name</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 italic text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {categories.map((cat: any) => (
                  <tr key={cat.id} className="hover:bg-zinc-800/20 transition-all group">
                    <td className="p-6">
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-orange-500 shadow-inner group-hover:scale-110 transition-transform">
                             <Package size={16} />
                          </div>
                          <p className="text-xs font-black text-white italic uppercase tracking-tighter leading-none">{cat.label}</p>
                       </div>
                    </td>
                    <td className="p-6">
                       <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest line-clamp-1">{cat.description || 'Global service domain.'}</p>
                    </td>
                    <td className="p-6">
                       <code className="bg-zinc-950 px-3 py-1 rounded-lg text-[10px] font-black text-orange-500/70 border border-orange-500/10 italic">
                          {cat.name}
                       </code>
                    </td>
                    <td className="p-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <Button onClick={() => handleOpenCategoryModal(cat)} variant="ghost" className="h-10 w-10 p-0 hover:bg-zinc-800 text-zinc-500 hover:text-white rounded-xl">
                             <Edit size={16} />
                          </Button>
                          <Button onClick={() => handleDeleteCategory(cat.id)} variant="ghost" className="h-10 w-10 p-0 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 rounded-xl">
                             <Trash2 size={16} />
                          </Button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="limits" className="space-y-8 outline-none">
          <div className="flex justify-end gap-4">
            <Button 
              onClick={async () => {
                setLoading(true);
                const res = await seedPlatformLimits();
                setLoading(false);
                if (res.success) {
                  toast.success('Limit master seeded');
                  window.location.reload();
                } else {
                  toast.error(res.error);
                }
              }}
              variant="outline"
              className="rounded-xl border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-purple-500 font-black uppercase tracking-widest text-[10px] h-12 px-8 shadow-xl"
              disabled={loading}
            >
              <Database className="w-4 h-4 mr-2" /> Seed Limits
            </Button>
            <Button 
              onClick={() => handleOpenLimitModal()}
              className="rounded-xl bg-purple-500 hover:bg-purple-400 text-zinc-950 font-black uppercase tracking-widest text-[10px] h-12 px-8 shadow-xl shadow-purple-500/20"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Limit Key
            </Button>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-950/40 border-b border-zinc-800">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Limit Label</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Unit</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">System Key</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 italic text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {limitsMaster.map((limit: any) => (
                  <tr key={limit.id} className="hover:bg-zinc-800/20 transition-all group">
                    <td className="p-6">
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-purple-500 shadow-inner group-hover:scale-110 transition-transform">
                             <Infinity size={16} />
                          </div>
                          <div>
                             <p className="text-xs font-black text-white italic uppercase tracking-tighter leading-none mb-1">{limit.label}</p>
                             <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest line-clamp-1">{limit.description || 'Core operational constraint.'}</p>
                          </div>
                       </div>
                    </td>
                    <td className="p-6">
                       <Badge className="bg-zinc-950 text-zinc-500 border-zinc-800 text-[8px] font-black uppercase italic">{limit.unit || 'UNITS'}</Badge>
                    </td>
                    <td className="p-6">
                       <code className="bg-zinc-950 px-3 py-1 rounded-lg text-[10px] font-black text-purple-500/70 border border-purple-500/10 italic">
                          {limit.key}
                       </code>
                    </td>
                    <td className="p-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <Button onClick={() => handleOpenLimitModal(limit)} variant="ghost" className="h-10 w-10 p-0 hover:bg-zinc-800 text-zinc-500 hover:text-white rounded-xl">
                             <Edit size={16} />
                          </Button>
                          <Button onClick={() => handleDeleteLimit(limit.id)} variant="ghost" className="h-10 w-10 p-0 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 rounded-xl">
                             <Trash2 size={16} />
                          </Button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Plan Orchestration Modal */}
      <Dialog open={isPlanModalOpen} onOpenChange={setIsPlanModalOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[1000px] w-[95vw] rounded-[3rem] p-0 overflow-hidden shadow-2xl focus:outline-none">
           <div className="grid md:grid-cols-12 h-full">
              <div className="md:col-span-4 bg-gradient-to-br from-zinc-900 to-zinc-950 p-10 border-r border-zinc-800 relative hidden md:flex flex-col">
                 <div className="absolute top-0 left-0 p-10 opacity-5">
                    <ShieldCheck size={150} />
                 </div>
                 <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-8 shadow-inner">
                    <Zap size={32} />
                 </div>
                 
                 <DialogHeader className="p-0 text-left">
                    <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter text-white mb-4 leading-none">Plan<br/>Details</DialogTitle>
                    <DialogDescription className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed mb-10 italic">Set the price and basic details for this subscription plan.</DialogDescription>
                 </DialogHeader>
                 
                 <div className="space-y-6">
                    <div className="bg-zinc-950/50 p-6 rounded-3xl border border-zinc-800/50 shadow-inner">
                       <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-4 italic flex items-center gap-2"><Settings2 size={12} /> Domain Overview</p>
                       <div className="space-y-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                          {categories.map(c => (
                            <p key={c.id} className={planForm.categoryName === c.name ? 'text-white italic' : ''}>• {c.label}</p>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>

              <div className="md:col-span-8 p-12 space-y-8 max-h-[85vh] overflow-y-auto custom-scrollbar bg-zinc-900/50">
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 italic">Service Category</Label>
                       <Select 
                        value={planForm.categoryName} 
                        onValueChange={v => setPlanForm({...planForm, categoryName: v})}
                       >
                          <SelectTrigger className="bg-zinc-950 border-zinc-800 h-14 px-6 rounded-2xl font-black italic uppercase text-xs focus:ring-0">
                             <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                             {categories.map(c => (
                               <SelectItem key={c.id} value={c.name} className="focus:bg-zinc-800 uppercase font-black text-[10px] italic tracking-widest">
                                 {c.label}
                               </SelectItem>
                             ))}
                          </SelectContent>
                       </Select>
                    </div>
                 </div>
                 <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 italic">Internal Identifier</Label>
                       <Input 
                        value={planForm.name}
                        onChange={e => setPlanForm({...planForm, name: e.target.value.toUpperCase()})}
                        placeholder="e.g., PLATINUM_V1"
                        disabled={!!editingPlan}
                        className="bg-zinc-950 border-zinc-800 h-14 px-6 font-black italic tracking-widest rounded-2xl uppercase text-[11px] shadow-inner"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 italic">Plan Name & Price</Label>
                    <div className="grid grid-cols-12 gap-4">
                       <div className="col-span-8">
                          <Input 
                           value={planForm.displayName}
                           onChange={e => setPlanForm({...planForm, displayName: e.target.value})}
                           className="bg-zinc-950 border-zinc-800 h-14 px-6 font-black italic text-xs rounded-2xl placeholder:text-zinc-700 shadow-inner"
                           placeholder="e.g., Ultimate Plan"
                          />
                       </div>
                       <div className="col-span-4 relative">
                          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500 font-black italic">₹</span>
                           <Input 
                            type="number"
                            value={isNaN(planForm.price) ? '' : planForm.price}
                            onChange={e => setPlanForm({...planForm, price: e.target.value === '' ? 0 : parseFloat(e.target.value)})}
                            className="bg-zinc-950 border-zinc-800 h-14 pl-10 pr-4 font-black italic text-lg rounded-2xl text-emerald-500 text-center shadow-inner"
                           />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">Capability selection master</Label>
                       <Badge variant="outline" className="text-[8px] font-black border-zinc-800 text-zinc-500 uppercase">{planForm.features.length} Nodes Enabled</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 bg-zinc-950/50 p-6 rounded-[2.5rem] border border-zinc-800/50 shadow-inner max-h-[300px] overflow-y-auto custom-scrollbar">
                       {features.map(f => (
                          <div key={f.id} className="flex items-center space-x-4 group cursor-pointer p-2.5 hover:bg-zinc-900/50 rounded-xl transition-colors border border-transparent hover:border-zinc-800/50" onClick={() => handleFeatureToggle(f.key)}>
                             <Checkbox 
                               checked={planForm.features.includes(f.key)}
                               onCheckedChange={() => handleFeatureToggle(f.key)}
                               className="h-5 w-5 border-zinc-700 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 rounded-lg transition-all" 
                             />
                             <div className="space-y-0.5">
                                <p className={`text-[10px] font-black uppercase tracking-tighter italic transition-colors ${planForm.features.includes(f.key) ? 'text-white' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
                                   {f.label}
                                </p>
                                <p className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest">{f.categoryName}</p>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 italic">Operational Constraints (0 = ∞)</Label>
                    <div className="grid grid-cols-2 gap-6 bg-zinc-950/30 p-8 rounded-[2.5rem] border border-zinc-800/30 border-dashed shadow-inner max-h-[300px] overflow-y-auto custom-scrollbar">
                       {limitsMaster.map((limit: any) => (
                          <div key={limit.id} className="space-y-2 group">
                             <div className="flex items-center gap-2 px-1">
                                <Infinity size={10} className="text-zinc-600 group-hover:text-purple-400 transition-colors" />
                                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest group-hover:text-zinc-400 transition-colors">{limit.label}</p>
                             </div>
                              <Input 
                               type="number"
                               value={isNaN(planForm.limits[limit.key]) ? '' : planForm.limits[limit.key]}
                               onChange={e => setPlanForm({
                                 ...planForm, 
                                 limits: {
                                   ...planForm.limits,
                                   [limit.key]: e.target.value === '' ? 0 : parseInt(e.target.value)
                                 }
                               })}
                               className="bg-zinc-950 border-zinc-800 h-12 px-5 font-black italic rounded-xl focus:border-purple-500/50 text-white shadow-inner"
                               placeholder={`e.g., 50 ${limit.unit || 'Units'}`}
                              />
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="pt-8 flex justify-end gap-5 border-t border-zinc-800">
                    <Button onClick={() => setIsPlanModalOpen(false)} variant="ghost" className="h-14 px-8 text-[10px] font-black uppercase tracking-[0.2em] italic text-zinc-600 hover:text-white transition-all">Abort Flow</Button>
                    <Button 
                      onClick={handlePlanSubmit}
                      disabled={loading}
                      className="h-14 px-12 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-[10px] rounded-[1.25rem] shadow-2xl shadow-emerald-500/20 min-w-[220px] transition-all active:scale-95"
                    >
                       {loading ? <Loader2 className="animate-spin mr-2" /> : (editingPlan ? 'Synchronize Tier' : 'Broadcast Infrastructure')}
                    </Button>
                 </div>
              </div>
           </div>
        </DialogContent>
      </Dialog>

      {/* Feature Modal */}
      <Dialog open={isFeatureModalOpen} onOpenChange={setIsFeatureModalOpen}>
         <DialogContent className="bg-zinc-900 border-zinc-800 text-white rounded-[2.5rem] p-10 max-w-[500px] focus:outline-none">
            <DialogHeader>
               <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6">
                  <ListChecks size={24} />
               </div>
               <DialogTitle className="text-xl font-black italic uppercase tracking-tighter">Add New Feature</DialogTitle>
               <DialogDescription className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Create a new feature to use in your subscription plans.</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 pt-6">
               <div className="grid gap-4">
                  <div className="space-y-2">
                     <Label className="text-[9px] font-black text-zinc-600 uppercase px-1">Feature Name</Label>
                     <Input 
                      value={featureForm.label}
                      onChange={e => setFeatureForm({...featureForm, label: e.target.value})}
                      placeholder="e.g., Live WhatsApp Tracking"
                      className="bg-zinc-950 border-zinc-800 h-12 px-5 font-bold text-sm rounded-xl"
                     />
                  </div>
                  <div className="space-y-2">
                     <Label className="text-[9px] font-black text-zinc-600 uppercase px-1">Feature ID (Key)</Label>
                     <Input 
                      value={featureForm.key}
                      onChange={e => setFeatureForm({...featureForm, key: e.target.value.toUpperCase().replace(/\s+/g, '_')})}
                      placeholder="e.g., WHATSAPP_LIVE"
                      className="bg-zinc-950 border-zinc-800 h-12 px-5 font-black italic text-xs rounded-xl text-blue-400"
                     />
                  </div>
                  <div className="space-y-2">
                      <Label className="text-[9px] font-black text-zinc-600 uppercase px-1">Service Category</Label>
                      <Select 
                       value={featureForm.categoryName}
                       onValueChange={v => setFeatureForm({...featureForm, categoryName: v})}
                      >
                         <SelectTrigger className="bg-zinc-950 border-zinc-800 h-12 px-5 rounded-xl font-bold italic">
                            <SelectValue />
                         </SelectTrigger>
                         <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                            {categories.map(c => (
                              <SelectItem key={c.id} value={c.name} className="focus:bg-zinc-800 italic uppercase font-black text-[9px] tracking-widest">
                                {c.label}
                              </SelectItem>
                            ))}
                         </SelectContent>
                      </Select>
                   </div>
                  <div className="space-y-2">
                     <Label className="text-[9px] font-black text-zinc-600 uppercase px-1">Description</Label>
                     <Textarea 
                      value={featureForm.description}
                      onChange={e => setFeatureForm({...featureForm, description: e.target.value})}
                      className="bg-zinc-950 border-zinc-800 min-h-[80px] rounded-xl focus:ring-0 resize-none p-4 font-medium text-xs"
                     />
                  </div>
               </div>
            </div>

            <DialogFooter className="pt-10 flex gap-3">
               <Button onClick={() => setIsFeatureModalOpen(false)} variant="ghost" className="h-12 px-6 text-[10px] font-black uppercase italic text-zinc-500">Abort</Button>
               <Button onClick={handleFeatureSubmit} disabled={loading} className="h-12 flex-1 bg-blue-500 hover:bg-blue-400 text-zinc-950 font-black uppercase tracking-widest text-[10px] rounded-xl shadow-xl shadow-blue-500/10">
                  {loading ? <Loader2 className="animate-spin" /> : (editingFeature ? 'Sync Capability' : 'Register Node')}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>

      {/* Category Modal */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
         <DialogContent className="bg-zinc-900 border-zinc-800 text-white rounded-[2.5rem] p-10 max-w-[500px] focus:outline-none">
            <DialogHeader>
               <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6">
                  <Settings2 size={24} />
               </div>
               <DialogTitle className="text-xl font-black italic uppercase tracking-tighter">Category Orchestration</DialogTitle>
               <DialogDescription className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Define a new service domain for the platform ecosystem.</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 pt-6">
               <div className="grid gap-4">
                  <div className="space-y-2">
                     <Label className="text-[9px] font-black text-zinc-600 uppercase px-1">Category Label</Label>
                     <Input 
                      value={categoryForm.label}
                      onChange={e => setCategoryForm({...categoryForm, label: e.target.value})}
                      placeholder="e.g., Delivery Service"
                      className="bg-zinc-950 border-zinc-800 h-12 px-5 font-black italic text-xs rounded-xl"
                     />
                  </div>
                  <div className="space-y-2">
                     <Label className="text-[9px] font-black text-zinc-600 uppercase px-1">System Name (UPPERCASE)</Label>
                     <Input 
                      value={categoryForm.name}
                      onChange={e => setCategoryForm({...categoryForm, name: e.target.value.toUpperCase().replace(/\s+/g, '_')})}
                      placeholder="e.g., DELIVERY"
                      className="bg-zinc-950 border-zinc-800 h-12 px-5 font-black italic text-xs rounded-xl text-orange-400"
                     />
                  </div>
                  <div className="space-y-2">
                     <Label className="text-[9px] font-black text-zinc-600 uppercase px-1">Description</Label>
                     <Textarea 
                      value={categoryForm.description}
                      onChange={e => setCategoryForm({...categoryForm, description: e.target.value})}
                      placeholder="Describe the scope of this domain..."
                      className="bg-zinc-950 border-zinc-800 rounded-xl px-5 py-4 font-bold italic text-xs min-h-[100px]"
                     />
                  </div>
               </div>

               <div className="pt-6 flex gap-3">
                  <Button onClick={() => setIsCategoryModalOpen(false)} variant="ghost" className="flex-1 text-[10px] font-black uppercase tracking-widest italic text-zinc-600">Cancel</Button>
                  <Button 
                    onClick={handleCategorySubmit}
                    disabled={loading}
                    className="flex-1 bg-orange-500 hover:bg-orange-400 text-zinc-950 font-black uppercase tracking-widest text-[10px] rounded-xl shadow-xl shadow-orange-500/20"
                  >
                     {loading ? <Loader2 className="animate-spin" /> : (editingCategory ? 'Sync Domain' : 'Create Domain')}
                  </Button>
               </div>
            </div>
         </DialogContent>
      </Dialog>

      {/* Limit Modal */}
      <Dialog open={isLimitModalOpen} onOpenChange={setIsLimitModalOpen}>
         <DialogContent className="bg-zinc-900 border-zinc-800 text-white rounded-[2.5rem] p-10 max-w-[500px] focus:outline-none">
            <DialogHeader>
               <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-6">
                  <Infinity size={24} />
               </div>
               <DialogTitle className="text-xl font-black italic uppercase tracking-tighter">Limit Constraint Master</DialogTitle>
               <DialogDescription className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Register a new operational boundary for platform usage.</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 pt-6">
               <div className="grid gap-4">
                  <div className="space-y-2">
                     <Label className="text-[9px] font-black text-zinc-600 uppercase px-1">Limit Label</Label>
                     <Input 
                      value={limitForm.label}
                      onChange={e => setLimitForm({...limitForm, label: e.target.value})}
                      placeholder="e.g., Monthly Orders"
                      className="bg-zinc-950 border-zinc-800 h-12 px-5 font-black italic text-xs rounded-xl"
                     />
                  </div>
                  <div className="space-y-2">
                     <Label className="text-[9px] font-black text-zinc-600 uppercase px-1">System Key (UPPERCASE)</Label>
                     <Input 
                      value={limitForm.key}
                      onChange={e => setLimitForm({...limitForm, key: e.target.value.toUpperCase().replace(/\s+/g, '_')})}
                      placeholder="e.g., MONTHLY_ORDERS"
                      className="bg-zinc-950 border-zinc-800 h-12 px-5 font-black italic text-xs rounded-xl text-purple-400"
                     />
                  </div>
                  <div className="space-y-2">
                     <Label className="text-[9px] font-black text-zinc-600 uppercase px-1">Unit of Measurement</Label>
                     <Input 
                      value={limitForm.unit}
                      onChange={e => setLimitForm({...limitForm, unit: e.target.value})}
                      placeholder="e.g., Orders, Items, Users"
                      className="bg-zinc-950 border-zinc-800 h-12 px-5 font-bold text-xs rounded-xl"
                     />
                  </div>
                  <div className="space-y-2">
                     <Label className="text-[9px] font-black text-zinc-600 uppercase px-1">Description</Label>
                     <Textarea 
                      value={limitForm.description}
                      onChange={e => setLimitForm({...limitForm, description: e.target.value})}
                      placeholder="What does this limit control?"
                      className="bg-zinc-950 border-zinc-800 rounded-xl px-5 py-4 font-bold italic text-xs min-h-[80px]"
                     />
                  </div>
               </div>

               <div className="pt-6 flex gap-3">
                  <Button onClick={() => setIsLimitModalOpen(false)} variant="ghost" className="flex-1 text-[10px] font-black uppercase tracking-widest italic text-zinc-600">Cancel</Button>
                  <Button 
                    onClick={handleLimitSubmit}
                    disabled={loading}
                    className="flex-1 bg-purple-500 hover:bg-purple-400 text-zinc-950 font-black uppercase tracking-widest text-[10px] rounded-xl shadow-xl shadow-purple-500/20"
                  >
                     {loading ? <Loader2 className="animate-spin" /> : (editingLimit ? 'Sync Constraint' : 'Create Constraint')}
                  </Button>
               </div>
            </div>
         </DialogContent>
      </Dialog>
    </div>
  );
}
