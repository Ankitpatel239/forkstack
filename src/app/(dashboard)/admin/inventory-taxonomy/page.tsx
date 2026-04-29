
'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Tags, 
  ChevronRight, 
  ChevronDown, 
  GripVertical,
  Save,
  Loader2,
  Layers,
  Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  getMasterCategories, 
  upsertMasterCategory, 
  deleteMasterCategory, 
  updateMasterSortOrder 
} from '@/app/actions/master-categories';
import { toast } from 'sonner';

export default function MasterTaxonomyPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCat, setNewCat] = useState({ name: '', parentId: null as string | null });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getMasterCategories();
      setCategories(data);
    } catch (e) {
      toast.error('Failed to load master taxonomy');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newCat.name) return;
    setSaving(true);
    try {
      await upsertMasterCategory({
        name: newCat.name,
        parentId: newCat.parentId,
        level: newCat.parentId ? 1 : 0 // Simple 2-level for now
      });
      setNewCat({ name: '', parentId: null });
      loadCategories();
      toast.success('Master category defined');
    } catch (e) {
      toast.error('Sync failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Purge this master node?')) return;
    try {
      await deleteMasterCategory(id);
      loadCategories();
      toast.success('Node purged');
    } catch (e) {
      toast.error('Delete failed');
    }
  };

  const renderTree = (parentId: string | null = null, level = 0) => {
    return categories
      .filter(c => c.parentId === parentId)
      .map(cat => (
        <div key={cat.id} className="space-y-2">
          <div 
            style={{ marginLeft: level * 32 }}
            className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl group hover:border-emerald-500/30 transition-all"
          >
            <GripVertical size={16} className="text-zinc-700 cursor-grab active:cursor-grabbing" />
            <div className="h-10 w-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-emerald-500">
               <Database size={20} />
            </div>
            <div className="flex-1">
               <p className="text-sm font-black italic uppercase text-white tracking-tight">{cat.name}</p>
               <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Master Node • ID: {cat.id.slice(-6)}</p>
            </div>
            <div className="flex items-center gap-2">
               {level === 0 && (
                 <button 
                   onClick={() => setNewCat({ ...newCat, parentId: cat.id })}
                   className="p-2 text-zinc-600 hover:text-emerald-500 transition-all"
                 >
                   <Plus size={16} />
                 </button>
               )}
               <button 
                 onClick={() => handleDelete(cat.id)}
                 className="p-2 text-zinc-600 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
               >
                 <Trash2 size={16} />
               </button>
            </div>
          </div>
          {renderTree(cat.id, level + 1)}
        </div>
      ));
  };

  const handleSeed = async () => {
    setSaving(true);
    try {
      const { seedMasterTaxonomy } = await import('@/app/actions/seed-master-taxonomy');
      const res = await seedMasterTaxonomy();
      toast.success(`Infrastructure updated with ${res.count} nodes`);
      loadCategories();
    } catch (e) {
      toast.error('Seed sequence failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-emerald-500" /></div>;

  return (
    <div className="p-10 space-y-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
           <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">Master Inventory Taxonomy</h1>
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Global classification engine for all vendors.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleSeed}
          disabled={saving}
          className="h-10 px-6 border-emerald-500/20 bg-emerald-500/5 text-emerald-500 font-black uppercase text-[10px] rounded-xl hover:bg-emerald-500/10"
        >
          <Layers className="mr-2 h-4 w-4" /> Seed Master Data
        </Button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-8">
         <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
               <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Category Name</Label>
               <Input 
                 value={newCat.name}
                 onChange={e => setNewCat({ ...newCat, name: e.target.value })}
                 placeholder={newCat.parentId ? "Sub-category name..." : "Main category name..."}
                 className="bg-zinc-950 border-zinc-800 h-14 px-6 rounded-2xl font-black italic text-white"
               />
            </div>
            {newCat.parentId && (
              <Button 
                variant="outline" 
                onClick={() => setNewCat({ ...newCat, parentId: null })}
                className="h-14 px-6 border-zinc-800 rounded-2xl text-[10px] font-black uppercase"
              >
                Clear Parent
              </Button>
            )}
            <Button 
              onClick={handleAdd}
              disabled={saving}
              className="h-14 px-10 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-500/10"
            >
               {saving ? <Loader2 className="animate-spin" /> : <><Plus size={20} className="mr-2" /> Register Master Node</>}
            </Button>
         </div>

         <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700 px-2">Global Hierarchy</h3>
            <div className="space-y-3">
               {renderTree(null)}
            </div>
         </div>
      </div>
      
      <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-8 flex items-center gap-6">
         <Layers className="text-emerald-500" size={32} />
         <div>
            <p className="text-sm font-black italic uppercase text-white">System Level Enforcement</p>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">These categories will be suggested to all vendors during their inventory setup.</p>
         </div>
      </div>
    </div>
  );
}
