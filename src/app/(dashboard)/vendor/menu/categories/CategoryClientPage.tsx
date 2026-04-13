
'use client';

import { useState } from 'react';
import { 
  Plus, 
  FolderTree, 
  ChevronRight, 
  ChevronDown, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Layers, 
  MoveRight,
  Loader2,
  GitBranch,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { createMenuCategory, updateMenuCategory, deleteMenuCategory } from '@/app/actions/menu';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  parentId: string | null;
  children?: Category[];
}

export default function CategoryClientPage({ initialCategories }: { initialCategories: any[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [parentCategory, setParentCategory] = useState<Category | null>(null);
  const [newName, setNewName] = useState('');

  const handleCreateOrUpdate = async () => {
    if (!newName) return;
    setLoading(true);
    try {
      if (editingCategory) {
        await updateMenuCategory(editingCategory.id, { name: newName });
        toast.success('Category updated');
      } else {
        await createMenuCategory({ name: newName, parentId: parentCategory?.id });
        toast.success('New category added');
      }
      window.location.reload(); // Refresh to get tree
    } catch (error) {
      toast.error('Sync failure');
    } finally {
      setLoading(false);
      setIsDialogOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This will delete this category and all its sub-categories.')) return;
    try {
      await deleteMenuCategory(id);
      toast.success('Category deleted');
      window.location.reload();
    } catch (error) {
      toast.error('Deletion failure');
    }
  };

  const buildTree = (cats: any[], parentId: string | null = null): any[] => {
    return cats
      .filter(c => c.parentId === parentId)
      .map(c => ({
        ...c,
        children: buildTree(cats, c.id)
      }));
  };

  const categoryTree = buildTree(categories);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
      <div className="space-y-6">
        <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
            <GitBranch size={200} />
          </div>
          
          <div className="flex items-center justify-between mb-10 relative z-10">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-3">
              <FolderTree className="text-emerald-500" /> All Categories
            </h2>
            <Button 
              onClick={() => { setEditingCategory(null); setParentCategory(null); setNewName(''); setIsDialogOpen(true); }}
              className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-[10px] h-12 rounded-2xl"
            >
              <Plus size={16} className="mr-2" /> Add Category
            </Button>
          </div>

          <div className="space-y-4 relative z-10">
            {categoryTree.map(category => (
              <CategoryNode 
                key={category.id} 
                category={category} 
                onEdit={(c) => { setEditingCategory(c); setParentCategory(null); setNewName(c.name); setIsDialogOpen(true); }}
                onAddSub={(p) => { setEditingCategory(null); setParentCategory(p); setNewName(''); setIsDialogOpen(true); }}
                onDelete={handleDelete}
              />
            ))}
            {categoryTree.length === 0 && (
              <div className="py-20 text-center border-2 border-dashed border-zinc-900 rounded-[2rem] opacity-20">
                <Layers className="mx-auto mb-4" size={48} />
                <p className="text-[10px] font-black uppercase tracking-widest">No Categories Yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-br from-emerald-500/10 to-zinc-900 border border-emerald-500/20 rounded-[3rem] p-10 shadow-xl">
          <GitBranch size={40} className="text-emerald-500 mb-6" />
          <h3 className="text-xl font-black italic uppercase tracking-tighter mb-4 text-emerald-500">How it works</h3>
          <p className="text-zinc-400 text-xs font-bold leading-relaxed mb-6">
            Categories help you organize your menu. You can create main categories like 'Pizza' and add sub-categories like 'Veg Pizza' inside them.
          </p>
          <div className="space-y-3">
            {[
              { label: 'Easy to Organize', icon: Check },
              { label: 'Sub-category Support', icon: Check },
              { label: 'Instant Updates', icon: Check },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                <item.icon size={14} className="text-emerald-500" /> {item.label}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10">
           <Layers size={32} className="text-zinc-700 mb-4" />
           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">Quick Stats</p>
           <div className="text-3xl font-black italic uppercase tracking-tighter text-white">
              {categories.length} Categories
           </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-900 text-white sm:max-w-[500px] rounded-[3rem] p-10 shadow-[0_0_50px_-12px_rgba(16,185,129,0.2)]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">
              {editingCategory ? 'Update Category' : parentCategory ? `Add Sub-category to: ${parentCategory.name}` : 'Add Main Category'}
            </DialogTitle>
            <DialogDescription className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest">
               Enter the name for your menu category.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Category Name</Label>
              <Input 
                value={newName} 
                onChange={e => setNewName(e.target.value)}
                placeholder="e.g., Veg Pizza" 
                className="bg-zinc-900 border-zinc-800 h-14 font-black italic rounded-2xl focus:border-emerald-500/50" 
              />
            </div>
            {parentCategory && !editingCategory && (
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center gap-3">
                 <GitBranch size={16} className="text-emerald-500" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500/70">Adding under: {parentCategory.name}</span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button 
              onClick={handleCreateOrUpdate}
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-[11px] h-14 rounded-3xl shadow-xl shadow-emerald-500/10"
            >
              {loading ? <Loader2 className="animate-spin" /> : editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CategoryNode({ category, onEdit, onAddSub, onDelete, depth = 0 }: { category: Category, onEdit: (c: any) => void, onAddSub: (c: any) => void, onDelete: (id: string) => void, depth?: number }) {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div className="space-y-2">
      <div className="group flex items-center justify-between p-4 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl transition-all h-16">
        <div className="flex items-center gap-4 flex-1">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className={`p-1 hover:bg-zinc-800 rounded-lg transition-colors ${hasChildren ? 'opacity-100' : 'opacity-0'}`}
          >
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-black italic text-zinc-500">
                {depth}
             </div>
             <span className="text-sm font-black italic tracking-tight">{category.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <Button variant="ghost" size="icon" onClick={() => onAddSub(category)} className="h-8 w-8 hover:bg-emerald-500/10 hover:text-emerald-500 rounded-lg">
             <Plus size={16} />
           </Button>
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-zinc-800 rounded-lg"><MoreVertical size={16} /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-900 border-zinc-800 text-white font-bold text-xs uppercase italic">
                 <DropdownMenuItem onClick={() => onEdit(category)} className="focus:bg-zinc-800 cursor-pointer p-3">
                    <Edit size={14} className="mr-2" /> Edit Category
                 </DropdownMenuItem>
                 <DropdownMenuItem onClick={() => onDelete(category.id)} className="focus:bg-red-500/10 text-red-500 cursor-pointer p-3">
                    <Trash2 size={14} className="mr-2" /> Delete Category
                 </DropdownMenuItem>
              </DropdownMenuContent>
           </DropdownMenu>
        </div>
      </div>

      {isOpen && hasChildren && (
        <div className="pl-12 border-l border-zinc-900 space-y-2 mt-2 ml-6">
          {category.children!.map(child => (
            <CategoryNode 
              key={child.id} 
              category={child} 
              onEdit={onEdit} 
              onAddSub={onAddSub} 
              onDelete={onDelete} 
              depth={depth + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
