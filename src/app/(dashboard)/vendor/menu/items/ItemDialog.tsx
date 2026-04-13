import { 
  Box,
  ChefHat, 
  Clock, 
  Flame, 
  Globe, 
  ImageIcon, 
  Info, 
  Leaf, 
  Loader2, 
  Plus, 
  Save, 
  Scale, 
  ShieldAlert, 
  Soup, 
  Utensils, 
  Zap 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { createMenuItem, updateMenuItem } from '@/app/actions/menu';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import { MenuItem, MenuCategory, MenuItemMedia } from '@/types/menu';

interface ItemDialogProps {
  item?: MenuItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: MenuCategory[];
}

export function ItemDialog({ item, open, onOpenChange, categories }: ItemDialogProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  const [formData, setFormData] = useState({
    name: item?.name || '',
    price: item?.price?.toString() || '',
    categoryId: item?.categoryId || '',
    description: item?.description || '',
    preparationTime: item?.preparationTime?.toString() || '15',
    calories: item?.calories?.toString() || '',
    protein: item?.protein?.toString() || '',
    carbs: item?.carbs?.toString() || '',
    fats: item?.fats?.toString() || '',
    isVegan: item?.isVegan || false,
    isVegetarian: item?.isVegetarian || false,
    isGlutenFree: item?.isGlutenFree || false,
    isHalal: item?.isHalal || false,
    spiciness: item?.spiciness?.toString() || '0',
    costPrice: item?.costPrice?.toString() || '',
    allergens: item?.allergens?.join(', ') || '',
    ingredients: item?.ingredients?.join(', ') || '',
    media: item?.media || []
  });

  useEffect(() => {
    if (open) {
      setFormData({
        name: item?.name || '',
        price: item?.price?.toString() || '',
        categoryId: item?.categoryId || '',
        description: item?.description || '',
        preparationTime: item?.preparationTime?.toString() || '15',
        calories: item?.calories?.toString() || '',
        protein: item?.protein?.toString() || '',
        carbs: item?.carbs?.toString() || '',
        fats: item?.fats?.toString() || '',
        isVegan: item?.isVegan || false,
        isVegetarian: item?.isVegetarian || false,
        isGlutenFree: item?.isGlutenFree || false,
        isHalal: item?.isHalal || false,
        spiciness: item?.spiciness?.toString() || '0',
        costPrice: item?.costPrice?.toString() || '',
        allergens: item?.allergens?.join(', ') || '',
        ingredients: item?.ingredients?.join(', ') || '',
        media: item?.media || []
      });
    }
  }, [item, open]);

  const buildTree = (cats: any[], parentId: string | null = null): any[] => {
    return cats
      .filter(c => c.parentId === parentId)
      .map(c => ({
        ...c,
        children: buildTree(cats, c.id)
      }));
  };

  const flattenedCategories: any[] = [];
  const treeFlatten = (cats: any[], depth = 0) => {
    cats.forEach(c => {
      flattenedCategories.push({ ...c, depth });
      if (c.children) treeFlatten(c.children, depth + 1);
    });
  };
  
  const categoryTree = buildTree(categories);
  treeFlatten(categoryTree);

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const remainingSlots = 8 - formData.media.length;
      Array.from(files).slice(0, remainingSlots).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            media: [...prev.media, { 
              url: reader.result as string, 
              isMain: prev.media.length === 0, 
              caption: '',
              alt: ''
            }]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const setMainImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.map((m: any, i: number) => ({ ...m, isMain: i === index }))
    }));
  };

  const removeMedia = (index: number) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.map((m: any, i: number) => i === index ? { ...m, delete: true } : m)
                         .filter((m: any) => !m.delete || (m.delete && m.id))
    }));
  };

  const updateMediaInfo = (index: number, fields: Partial<MenuItemMedia>) => {
    setFormData(prev => ({
       ...prev,
       media: prev.media.map((m: any, i: number) => i === index ? { ...m, ...fields } : m)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        preparationTime: parseInt(formData.preparationTime),
        calories: formData.calories ? parseInt(formData.calories) : undefined,
        protein: formData.protein ? parseFloat(formData.protein) : undefined,
        carbs: formData.carbs ? parseFloat(formData.carbs) : undefined,
        fats: formData.fats ? parseFloat(formData.fats) : undefined,
        spiciness: parseInt(formData.spiciness),
        costPrice: formData.costPrice ? parseFloat(formData.costPrice) : undefined,
        allergens: formData.allergens.split(',').map(s => s.trim()).filter(s => s),
        ingredients: formData.ingredients.split(',').map(s => s.trim()).filter(s => s),
      };

      if (item) {
        await updateMenuItem(item.id, payload);
        toast.success('Menu item updated');
      } else {
        await createMenuItem(payload);
        toast.success('New menu item created');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950 border-zinc-900 text-white sm:max-w-[850px] rounded-[3rem] p-0 overflow-hidden shadow-[0_0_50px_-12px_rgba(16,185,129,0.15)] outline-none">
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-10 border-b border-zinc-900 relative">
           <div className="absolute top-0 right-0 p-10 opacity-5">
              <ImageIcon size={120} />
           </div>
           <DialogHeader className="relative z-10">
             <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 overflow-hidden">
                   {formData.media.find((m) => m.isMain && !m.delete)?.url ? (
                     <img src={formData.media.find((m) => m.isMain && !m.delete)?.url} className="h-full w-full object-cover rounded-3xl" />
                   ) : (
                     <ChefHat size={32} />
                   )}
                </div>
                <div>
                  <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter">
                    {item ? 'Update Menu Item' : 'New Menu Item'}
                  </DialogTitle>
                  <DialogDescription className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest mt-1">
                    Manage the details and photos for your menu item.
                  </DialogDescription>
                </div>
             </div>
           </DialogHeader>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-10 py-4 bg-zinc-900/50 border-b border-zinc-900">
               <TabsList className="bg-transparent gap-8 h-auto p-0 border-none justify-start">
                  <TabsTrigger value="general" className="data-[state=active]:bg-transparent data-[state=active]:text-emerald-500 px-0 h-10 border-b-2 border-transparent data-[state=active]:border-emerald-500 rounded-none text-[10px] font-black uppercase tracking-widest transition-all">Basic Info</TabsTrigger>
                  <TabsTrigger value="gallery" className="data-[state=active]:bg-transparent data-[state=active]:text-emerald-500 px-0 h-10 border-b-2 border-transparent data-[state=active]:border-emerald-500 rounded-none text-[10px] font-black uppercase tracking-widest transition-all">Item Photos</TabsTrigger>
                  <TabsTrigger value="nutrition" className="data-[state=active]:bg-transparent data-[state=active]:text-emerald-500 px-0 h-10 border-b-2 border-transparent data-[state=active]:border-emerald-500 rounded-none text-[10px] font-black uppercase tracking-widest transition-all">Nutrition Info</TabsTrigger>
                  <TabsTrigger value="dietary" className="data-[state=active]:bg-transparent data-[state=active]:text-emerald-500 px-0 h-10 border-b-2 border-transparent data-[state=active]:border-emerald-500 rounded-none text-[10px] font-black uppercase tracking-widest transition-all">Dietary Details</TabsTrigger>
               </TabsList>
            </div>

            <div className="p-10 max-h-[50vh] overflow-y-auto custom-scrollbar">
               <TabsContent value="general" className="mt-0 space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                  <div className="grid gap-8 md:grid-cols-2">
                     <div className="space-y-4">
                        <div className="space-y-2">
                           <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Item Name</Label>
                           <div className="relative">
                              <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
                              <Input 
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                placeholder="e.g., Cheese Pizza" 
                                className="bg-zinc-900 border-zinc-800 h-14 pl-12 font-black italic text-sm rounded-2xl focus:border-emerald-500/50" 
                                required 
                              />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Price (₹)</Label>
                           <div className="relative">
                              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700 font-black text-xs">₹</span>
                              <Input 
                                type="number" step="0.01" 
                                value={formData.price}
                                onChange={e => setFormData({...formData, price: e.target.value})}
                                className="bg-zinc-900 border-zinc-800 h-14 pl-10 text-lg font-black italic rounded-2xl" 
                                required 
                              />
                           </div>
                        </div>
                     </div>

                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Menu Category</Label>
                        <Select value={formData.categoryId} onValueChange={v => setFormData({...formData, categoryId: v})}>
                           <SelectTrigger className="bg-zinc-900 border-zinc-800 h-14 text-sm font-black italic rounded-2xl">
                              <SelectValue placeholder="Choose Category" />
                           </SelectTrigger>
                           <SelectContent className="bg-zinc-900 border-zinc-800 text-white font-black italic">
                              {flattenedCategories.map(c => (
                                <SelectItem key={c.id} value={c.id}>
                                   {'\u00A0'.repeat(c.depth * 4)}{c.depth > 0 ? '↳ ' : ''}{c.name}
                                </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>
                  </div>

                  <div className="grid gap-8 md:grid-cols-2">
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Preparation Time (Mins)</Label>
                        <div className="relative">
                           <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
                           <Input 
                             type="number"
                             value={formData.preparationTime}
                             onChange={e => setFormData({...formData, preparationTime: e.target.value})}
                             className="bg-zinc-900 border-zinc-800 h-14 pl-14 font-black italic rounded-2xl" 
                           />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Spiciness Level</Label>
                        <div className="flex gap-2">
                           {[0, 1, 2, 3].map(lvl => (
                              <button 
                                key={lvl} 
                                type="button" 
                                onClick={() => setFormData({...formData, spiciness: lvl.toString()})}
                                className={`h-14 flex-1 rounded-2xl border transition-all text-[10px] font-black ${
                                  formData.spiciness === lvl.toString() ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                                }`}
                              >
                                {lvl === 0 ? 'MILD' : '🌶️'.repeat(lvl)}
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Item Description</Label>
                     <textarea 
                       rows={4}
                       value={formData.description}
                       onChange={e => setFormData({...formData, description: e.target.value})}
                       className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-sm font-bold resize-none focus:border-emerald-500/50 transition-colors text-white"
                       placeholder="Describe the taste and ingredients of this item..."
                     />
                  </div>
               </TabsContent>

               <TabsContent value="gallery" className="mt-0 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between gap-4">
                     <div>
                        <h3 className="text-xl font-black italic uppercase tracking-tighter">Item Photos</h3>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Add up to 8 images for this item.</p>
                     </div>
                     <Label className="h-12 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-[9px] flex items-center justify-center cursor-pointer shadow-lg shadow-emerald-500/10 transition-all">
                        <Plus size={16} className="mr-2" /> Upload Photos
                        <input type="file" multiple className="hidden" onChange={handleGalleryUpload} accept="image/*" />
                     </Label>
                  </div>

                  <div className="grid gap-6">
                     {formData.media.filter((m: any) => !m.delete).map((med: any, idx: number) => ( med && (
                       <div key={idx} className={`p-6 bg-zinc-900/40 border-2 rounded-[2rem] transition-all flex flex-col md:flex-row gap-8 relative overflow-hidden group ${med.isMain ? 'border-emerald-500/50' : 'border-zinc-900 hover:border-zinc-800'}`}>
                          <div className="h-32 w-32 rounded-3xl overflow-hidden shrink-0 border-2 border-zinc-900 relative">
                             <img src={med.url} className="h-full w-full object-cover" />
                             {med.isMain && (
                                <div className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-500 text-zinc-950 font-black text-[7px] uppercase tracking-widest rounded-full shadow-lg">Main</div>
                             )}
                          </div>
                          
                          <div className="flex-1 space-y-4">
                             <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-1">
                                   <Label className="text-[8px] font-black uppercase tracking-widest text-zinc-700 px-1">Display Caption</Label>
                                   <Input 
                                      value={med.caption || ''} 
                                      onChange={e => updateMediaInfo(idx, { caption: e.target.value })}
                                      className="bg-zinc-950 border-zinc-900 h-10 px-4 text-xs font-bold rounded-xl" 
                                      placeholder="e.g., Crispy golden crust detail"
                                   />
                                </div>
                                <div className="space-y-1">
                                   <Label className="text-[8px] font-black uppercase tracking-widest text-zinc-700 px-1">Accessibility Alt Text</Label>
                                   <Input 
                                      value={med.alt || ''} 
                                      onChange={e => updateMediaInfo(idx, { alt: e.target.value })}
                                      className="bg-zinc-950 border-zinc-900 h-10 px-4 text-xs font-bold rounded-xl" 
                                      placeholder="Alt description for screen readers"
                                   />
                                </div>
                             </div>
                             
                             <div className="flex items-center gap-4 pt-2">
                                {!med.isMain && (
                                  <Button 
                                    type="button" 
                                    onClick={() => setMainImage(idx)}
                                    className="bg-zinc-950 hover:bg-emerald-500/10 text-zinc-600 hover:text-emerald-500 border border-zinc-800 h-10 px-4 text-[9px] font-black uppercase rounded-xl"
                                  >
                                    Use as Main
                                  </Button>
                                )}
                                <Button 
                                  type="button" 
                                  onClick={() => removeMedia(idx)}
                                  className="bg-zinc-950 hover:bg-red-500/10 text-zinc-600 hover:text-red-500 border border-zinc-800 h-10 px-4 text-[9px] font-black uppercase rounded-xl"
                                >
                                  Remove Photo
                                </Button>
                             </div>
                          </div>
                       </div>
                     )))}
                     
                     {formData.media.filter((m: any) => !m.delete).length === 0 && (
                        <div className="py-20 text-center border-2 border-dashed border-zinc-900 rounded-[3rem] opacity-20">
                           <ImageIcon className="mx-auto mb-4" size={48} />
                           <p className="text-[10px] font-black uppercase tracking-[0.3em]">No photos added yet</p>
                        </div>
                     )}
                  </div>
               </TabsContent>

               <TabsContent value="nutrition" className="mt-0 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="grid gap-6 md:grid-cols-2">
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-2 flex items-center gap-2">
                           <Flame size={12} className="text-orange-500" /> Calories (Kcal)
                        </Label>
                        <Input 
                          type="number"
                          value={formData.calories}
                          onChange={e => setFormData({...formData, calories: e.target.value})}
                          placeholder="0.00" 
                          className="bg-zinc-900 border-zinc-800 h-14 px-6 font-black italic text-lg rounded-2xl text-orange-500" 
                        />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-2 flex items-center gap-2">
                           <Zap size={12} className="text-blue-500" /> Item Cost (₹)
                        </Label>
                        <Input 
                          type="number"
                          value={formData.costPrice}
                          onChange={e => setFormData({...formData, costPrice: e.target.value})}
                          placeholder="Internal Cost" 
                          className="bg-zinc-900 border-zinc-800 h-14 px-6 font-black italic text-lg rounded-2xl" 
                        />
                     </div>
                  </div>

                  <div className="p-8 border-2 border-dashed border-zinc-900 rounded-[2.5rem] bg-zinc-900/30">
                     <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700 mb-8 text-center italic">Nutrition Details</h4>
                     <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-2 text-center">
                           <Label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Protein</Label>
                           <Input 
                             value={formData.protein}
                             onChange={e => setFormData({...formData, protein: e.target.value})}
                             className="text-center font-black rounded-xl bg-zinc-900 border-zinc-800" 
                             placeholder="0g"
                           />
                        </div>
                        <div className="space-y-2 text-center">
                           <Label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Carbs</Label>
                           <Input 
                             value={formData.carbs}
                             onChange={e => setFormData({...formData, carbs: e.target.value})}
                             className="text-center font-black rounded-xl bg-zinc-900 border-zinc-800" 
                             placeholder="0g"
                           />
                        </div>
                        <div className="space-y-2 text-center">
                           <Label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Fats</Label>
                           <Input 
                             value={formData.fats}
                             onChange={e => setFormData({...formData, fats: e.target.value})}
                             className="text-center font-black rounded-xl bg-zinc-900 border-zinc-800"
                             placeholder="0g"
                           />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Ingredients</Label>
                     <Textarea 
                       value={formData.ingredients}
                       onChange={e => setFormData({...formData, ingredients: e.target.value})}
                       placeholder="Flour, Yeast, Water, Olive Oil..."
                       className="bg-zinc-900 border-zinc-800 rounded-2xl min-h-[100px] font-bold"
                     />
                  </div>
               </TabsContent>

               <TabsContent value="dietary" className="mt-0 space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="grid gap-6 grid-cols-2">
                     {[
                        { label: 'Vegan', state: 'isVegan', icon: Leaf, color: 'text-emerald-500' },
                        { label: 'Vegetarian', state: 'isVegetarian', icon: Soup, color: 'text-green-500' },
                        { label: 'Gluten-Free', state: 'isGlutenFree', icon: Scale, color: 'text-amber-500' },
                        { label: 'Halal', state: 'isHalal', icon: Globe, color: 'text-blue-500' },
                     ].map((diet) => (
                        <div key={diet.state} className="flex items-center justify-between bg-zinc-900/40 p-5 rounded-2xl border border-zinc-900 hover:border-zinc-800 transition-all">
                           <div className="flex items-center gap-3">
                              <diet.icon size={16} className={diet.color} />
                              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">{diet.label}</span>
                           </div>
                           <Switch 
                             checked={(formData as any)[diet.state]} 
                             onCheckedChange={v => setFormData({...formData, [diet.state]: v})}
                             className="data-[state=checked]:bg-emerald-500"
                           />
                        </div>
                     ))}
                  </div>

                  <div className="space-y-4 pt-4 border-t border-zinc-900">
                     <div className="flex items-center gap-2 mb-2">
                        <Flame size={14} className="text-red-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Spiciness Level</span>
                     </div>
                     <div className="flex gap-4">
                        {[0, 1, 2, 3].map((level) => (
                          <button 
                            key={level}
                            type="button"
                            onClick={() => setFormData({...formData, spiciness: level.toString()})}
                            className={`flex-1 h-14 rounded-2xl border transition-all flex items-center justify-center gap-2 ${
                              formData.spiciness === level.toString()
                              ? 'bg-red-500/10 border-red-500/50 text-red-500 shadow-lg shadow-red-500/5'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-600 hover:border-zinc-700'
                            }`}
                          >
                             <Flame size={16} />
                             <span className="text-xs font-black italic">{level === 0 ? 'MILD' : '🌶️'.repeat(level)}</span>
                          </button>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-2 pt-4">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2">
                        <ShieldAlert size={14} className="text-amber-500" /> Allergens
                     </Label>
                     <Input 
                       value={formData.allergens}
                       onChange={e => setFormData({...formData, allergens: e.target.value})}
                       placeholder="Peanuts, Shellfish, Soy..." 
                       className="bg-zinc-900 border-zinc-800 h-14 font-bold rounded-2xl border-amber-500/20"
                     />
                  </div>
               </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="p-10 bg-zinc-950/50 border-t border-zinc-900 gap-4 flex-row items-center sm:justify-between">
            <div className="hidden md:flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-800">
               <Info size={14} /> Menu Management
            </div>
            <Button 
               type="submit" 
               disabled={loading}
               className="w-full sm:w-auto min-w-[220px] bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-[10px] h-14 rounded-[2rem] shadow-[0_10px_30px_-10px_rgba(16,185,129,0.3)] group transition-all active:scale-95"
            >
               {loading ? <Loader2 className="animate-spin" /> : (
                 <>
                   <Save size={18} className="mr-3 group-hover:rotate-12 transition-transform" /> 
                   {item ? 'Save Item' : 'Create Item'}
                 </>
               )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
