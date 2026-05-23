'use client';

import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, Plus, Trash2, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toggleMasterActive, deleteMaster, createMaster } from '@/app/actions/workforce';
import { toast } from 'sonner';

export function HRSettingsDialog({ open, onOpenChange, masters }: any) {
  const [loading, setLoading] = useState(false);
  const [activeForm, setActiveForm] = useState<'NONE' | 'SalaryLevel' | 'Deduction' | 'Bonus'>('NONE');
  
  const [formData, setFormData] = useState({ name: '', amount: '' });

  const handleToggle = async (model: 'SalaryLevel' | 'Deduction' | 'Bonus' | 'SalaryType', id: number, isActive: boolean) => {
    try {
      await toggleMasterActive(model, id, isActive);
      toast.success('Status updated');
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (model: 'SalaryLevel' | 'Deduction' | 'Bonus' | 'SalaryType', id: number) => {
    if (!confirm('Are you sure you want to delete this master configuration?')) return;
    try {
      await deleteMaster(model, id);
      toast.success('Successfully deleted');
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete');
    }
  };

  const handleCreate = async (model: 'SalaryLevel' | 'Deduction' | 'Bonus') => {
    if (!formData.name) return;
    setLoading(true);
    try {
      await createMaster(model, {
        name: formData.name,
        amount: parseFloat(formData.amount || '0')
      });
      toast.success('Master configuration added');
      setActiveForm('NONE');
      setFormData({ name: '', amount: '' });
    } catch (e) {
      toast.error('Failed to add configuration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white w-[95vw] sm:max-w-[700px] rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader className="mb-6">
          <div className="h-12 w-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 mb-4">
             <Settings size={24} />
          </div>
          <DialogTitle className="text-xl font-black italic uppercase tracking-tight">HR Master Configurations</DialogTitle>
          <DialogDescription className="text-zinc-500 font-medium font-sans">
            Manage your dynamic salary levels, deductions, and bonus structures.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="levels" className="space-y-6" onValueChange={() => { setActiveForm('NONE'); setFormData({ name: '', amount: '' }); }}>
          <TabsList className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 p-1 flex flex-wrap gap-1 rounded-xl h-auto">
            <TabsTrigger value="levels" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 font-bold px-4 py-2">Salary Levels</TabsTrigger>
            <TabsTrigger value="deductions" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 font-bold px-4 py-2">Deductions</TabsTrigger>
            <TabsTrigger value="bonuses" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 font-bold px-4 py-2">Bonuses</TabsTrigger>
          </TabsList>

          <TabsContent value="levels" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500">Active Salary Levels</h3>
              <Button onClick={() => setActiveForm('SalaryLevel')} size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg h-8 text-[10px] font-black uppercase tracking-widest"><Plus size={14} className="mr-1" /> Add Level</Button>
            </div>
            {activeForm === 'SalaryLevel' && (
              <div className="flex flex-col sm:flex-row gap-2 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-emerald-500/30">
                <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Level Name (e.g. L1 - Junior)" className="h-10 text-xs font-bold" />
                <Input value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} type="number" placeholder="Base Salary (₹)" className="h-10 text-xs font-bold sm:w-32" />
                <Button onClick={() => handleCreate('SalaryLevel')} disabled={loading || !formData.name} className="h-10 bg-emerald-500 text-white w-full sm:w-auto">
                   {loading ? <Loader2 className="animate-spin" size={16} /> : 'Save'}
                </Button>
              </div>
            )}
            <div className="grid gap-3">
              {masters?.levels?.map((lvl: any) => (
                <div key={lvl.id} className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl flex items-center justify-between">
                   <div>
                     <h4 className="font-black italic uppercase text-sm">{lvl.levelName}</h4>
                     <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Base Wage: ₹{lvl.baseSalary.toLocaleString()}</p>
                   </div>
                   <div className="flex items-center gap-3">
                     <Switch checked={lvl.isActive} onCheckedChange={(v) => handleToggle('SalaryLevel', lvl.id, v)} />
                     <Button onClick={() => handleDelete('SalaryLevel', lvl.id)} variant="ghost" size="icon" className="text-red-500 hover:bg-red-500/10 hover:text-red-600 rounded-xl h-8 w-8"><Trash2 size={14} /></Button>
                   </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="deductions" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500">Deduction Masters</h3>
              <Button onClick={() => setActiveForm('Deduction')} size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg h-8 text-[10px] font-black uppercase tracking-widest"><Plus size={14} className="mr-1" /> Add Deduction</Button>
            </div>
            {activeForm === 'Deduction' && (
              <div className="flex gap-2 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-emerald-500/30">
                <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Deduction Name" className="h-10 text-xs font-bold flex-1" />
                <Button onClick={() => handleCreate('Deduction')} disabled={loading || !formData.name} className="h-10 bg-emerald-500 text-white">
                   {loading ? <Loader2 className="animate-spin" size={16} /> : 'Save'}
                </Button>
              </div>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              {masters?.deductions?.map((d: any) => (
                <div key={d.id} className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl flex items-center justify-between">
                   <h4 className="font-black italic uppercase text-sm">{d.name}</h4>
                   <div className="flex items-center gap-3">
                     <Switch checked={d.isActive} onCheckedChange={(v) => handleToggle('Deduction', d.id, v)} />
                     <Button onClick={() => handleDelete('Deduction', d.id)} variant="ghost" size="icon" className="text-red-500 hover:bg-red-500/10 hover:text-red-600 rounded-xl h-8 w-8"><Trash2 size={14} /></Button>
                   </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bonuses" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500">Bonus Masters</h3>
              <Button onClick={() => setActiveForm('Bonus')} size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg h-8 text-[10px] font-black uppercase tracking-widest"><Plus size={14} className="mr-1" /> Add Bonus</Button>
            </div>
            {activeForm === 'Bonus' && (
              <div className="flex gap-2 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-emerald-500/30">
                <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Bonus Name" className="h-10 text-xs font-bold flex-1" />
                <Button onClick={() => handleCreate('Bonus')} disabled={loading || !formData.name} className="h-10 bg-emerald-500 text-white">
                   {loading ? <Loader2 className="animate-spin" size={16} /> : 'Save'}
                </Button>
              </div>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              {masters?.bonuses?.map((b: any) => (
                <div key={b.id} className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl flex items-center justify-between">
                   <h4 className="font-black italic uppercase text-sm">{b.name}</h4>
                   <div className="flex items-center gap-3">
                     <Switch checked={b.isActive} onCheckedChange={(v) => handleToggle('Bonus', b.id, v)} />
                     <Button onClick={() => handleDelete('Bonus', b.id)} variant="ghost" size="icon" className="text-red-500 hover:bg-red-500/10 hover:text-red-600 rounded-xl h-8 w-8"><Trash2 size={14} /></Button>
                   </div>
                </div>
              ))}
            </div>
          </TabsContent>

        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
