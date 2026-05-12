'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  X, 
  Save, 
  Loader2, 
  Utensils, 
  Clock, 
  MapPin, 
  Trash2, 
  PlusCircle, 
  Coffee, 
  Sun, 
  Moon,
  Database,
  ChefHat,
  Search,
  Filter,
  Settings,
  Flame,
  Leaf
} from 'lucide-react';
import { 
  createTiffinItem, 
  updateTiffinItem, 
  deleteTiffinItem,
  updateTiffinSession,
  createTiffinInclusion,
  deleteTiffinInclusion,
  createTiffinArea,
  deleteTiffinArea,
  createTiffinDietType,
  deleteTiffinDietType,
  createTiffinSpiceLevel,
  deleteTiffinSpiceLevel
} from '@/app/actions/tiffin';
import { TiffinMealType } from '@prisma/client';
import { toast } from 'sonner';

interface MastersClientProps {
  vendorId: string;
  initialItems: any[];
  initialSessions: any[];
  initialInclusions: any[];
  initialAreas: any[];
  initialDietTypes: any[];
  initialSpiceLevels: any[];
}

export default function MastersClient({ 
  vendorId, 
  initialItems, 
  initialSessions, 
  initialInclusions, 
  initialAreas,
  initialDietTypes,
  initialSpiceLevels
}: MastersClientProps) {
  const [items, setItems] = useState(initialItems);
  const [sessions, setSessions] = useState(initialSessions);
  const [inclusions, setInclusions] = useState(initialInclusions);
  const [areas, setAreas] = useState(initialAreas);
  const [dietTypes, setDietTypes] = useState(initialDietTypes);
  const [spiceLevels, setSpiceLevels] = useState(initialSpiceLevels);

  const [isProcessing, setIsProcessing] = useState(false);

  // Form states
  const [newItem, setNewItem] = useState({ name: '', description: '', category: 'Main Course', isVeg: true });
  const [newInclusion, setNewInclusion] = useState({ name: '', price: '0' });
  const [newArea, setNewArea] = useState({ name: '', deliveryCharge: '0' });
  const [newDietType, setNewDietType] = useState('');
  const [newSpiceLevel, setNewSpiceLevel] = useState('');

  // Session states
  const getSession = (type: TiffinMealType) => {
    const session = sessions.find(s => s.mealType === type);
    if (session) return session;
    
    // Sensible defaults if not set
    switch(type) {
      case 'BREAKFAST': return { startTime: '08:00 AM', endTime: '10:00 AM', isActive: false };
      case 'LUNCH': return { startTime: '12:00 PM', endTime: '02:00 PM', isActive: false };
      case 'DINNER': return { startTime: '07:30 PM', endTime: '09:30 PM', isActive: false };
      default: return { startTime: '08:00 AM', endTime: '10:00 AM', isActive: false };
    }
  };

  const [sessionForm, setSessionForm] = useState({
    BREAKFAST: getSession(TiffinMealType.BREAKFAST),
    LUNCH: getSession(TiffinMealType.LUNCH),
    DINNER: getSession(TiffinMealType.DINNER),
  });

  const handleUpdateSession = async (type: TiffinMealType) => {
    setIsProcessing(true);
    try {
      const data = sessionForm[type];
      await updateTiffinSession(vendorId, type, data);
      toast.success(`${type} session updated`);
    } catch (err) {
      toast.error("Failed to update session");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name) return;
    setIsProcessing(true);
    try {
      const res = await createTiffinItem(vendorId, newItem);
      setItems([res, ...items]);
      setNewItem({ name: '', description: '', category: 'Main Course', isVeg: true });
      toast.success("Dish added to master");
    } catch (err) {
      toast.error("Failed to add dish");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddInclusion = async () => {
    if (!newInclusion.name) return;
    setIsProcessing(true);
    try {
      const res = await createTiffinInclusion(vendorId, { name: newInclusion.name, price: parseFloat(newInclusion.price) });
      setInclusions([...inclusions, res]);
      setNewInclusion({ name: '', price: '0' });
      toast.success("Inclusion added");
    } catch (err) {
      toast.error("Failed to add inclusion");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddArea = async () => {
    if (!newArea.name) return;
    setIsProcessing(true);
    try {
      const res = await createTiffinArea(vendorId, { name: newArea.name, deliveryCharge: parseFloat(newArea.deliveryCharge) });
      setAreas([...areas, res]);
      setNewArea({ name: '', deliveryCharge: '0' });
      toast.success("Area added");
    } catch (err) {
      toast.error("Failed to add area");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddDietType = async () => {
    if (!newDietType) return;
    setIsProcessing(true);
    try {
      const res = await createTiffinDietType(vendorId, { name: newDietType });
      setDietTypes([...dietTypes, res]);
      setNewDietType('');
      toast.success("Diet type added");
    } catch (err) {
      toast.error("Failed to add diet type");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddSpiceLevel = async () => {
    if (!newSpiceLevel) return;
    setIsProcessing(true);
    try {
      const res = await createTiffinSpiceLevel(vendorId, { name: newSpiceLevel });
      setSpiceLevels([...spiceLevels, res]);
      setNewSpiceLevel('');
      toast.success("Spice level added");
    } catch (err) {
      toast.error("Failed to add spice level");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card/30 backdrop-blur-xl p-10 rounded-[3rem] border border-border/50 shadow-2xl">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-inner">
             <Database className="text-emerald-500" size={32} />
           </div>
           <div>
             <h2 className="text-4xl font-black tracking-tight uppercase italic text-emerald-500">Master Data Hub</h2>
             <p className="text-sm text-muted-foreground font-bold uppercase tracking-[0.2em] mt-1">Dynamic system configuration</p>
           </div>
        </div>
        <div className="flex items-center gap-3 bg-zinc-950/5 dark:bg-white/5 px-6 py-3 rounded-2xl border border-border/50">
           <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
           <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Global Sync Active</span>
        </div>
      </div>

      <Tabs defaultValue="sessions" className="space-y-8">
        <TabsList className="bg-muted/50 p-2 rounded-[2rem] h-auto flex flex-wrap gap-2 border border-border/50">
          <TabsTrigger value="sessions" className="rounded-2xl px-8 py-3 font-black text-xs uppercase tracking-widest gap-2 data-[state=active]:bg-indigo-500 data-[state=active]:text-white transition-all">
            <Clock size={16} /> Delivery Sessions
          </TabsTrigger>
          <TabsTrigger value="dishes" className="rounded-2xl px-8 py-3 font-black text-xs uppercase tracking-widest gap-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all">
            <ChefHat size={16} /> Dish Master
          </TabsTrigger>
          <TabsTrigger value="inclusions" className="rounded-2xl px-8 py-3 font-black text-xs uppercase tracking-widest gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white transition-all">
            <PlusCircle size={16} /> Inclusions
          </TabsTrigger>
          <TabsTrigger value="areas" className="rounded-2xl px-8 py-3 font-black text-xs uppercase tracking-widest gap-2 data-[state=active]:bg-rose-500 data-[state=active]:text-white transition-all">
            <MapPin size={16} /> Service Areas
          </TabsTrigger>
          <TabsTrigger value="preferences" className="rounded-2xl px-8 py-3 font-black text-xs uppercase tracking-widest gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white transition-all">
            <Settings size={16} /> Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="animate-in slide-in-from-left-4 duration-500">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[
                { type: TiffinMealType.BREAKFAST, icon: Coffee, color: 'amber' },
                { type: TiffinMealType.LUNCH, icon: Sun, color: 'emerald' },
                { type: TiffinMealType.DINNER, icon: Moon, color: 'indigo' }
              ].map(({ type, icon: Icon, color }) => (
                <Card key={type} className={`rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-${color}-500/5 border border-${color}-500/20`}>
                  <CardHeader className="p-8 pb-4">
                    <div className="flex items-center justify-between mb-2">
                       <div className={`p-3 rounded-2xl bg-${color}-500/10 text-${color}-500`}>
                         <Icon size={24} />
                       </div>
                       <div className="flex items-center gap-2">
                         <span className={`text-[10px] font-black uppercase tracking-widest ${sessionForm[type].isActive ? `text-${color}-500` : 'text-muted-foreground'}`}>
                           {sessionForm[type].isActive ? 'Active' : 'Disabled'}
                         </span>
                         <button 
                            onClick={() => setSessionForm({...sessionForm, [type]: {...sessionForm[type], isActive: !sessionForm[type].isActive}})}
                            className={`w-10 h-6 rounded-full p-1 transition-all ${sessionForm[type].isActive ? `bg-${color}-500` : 'bg-muted'}`}
                         >
                            <div className={`w-4 h-4 rounded-full bg-white transition-all ${sessionForm[type].isActive ? 'ml-4' : 'ml-0'}`} />
                         </button>
                       </div>
                    </div>
                    <CardTitle className="text-2xl font-black uppercase tracking-tight">{type}</CardTitle>
                    <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60">Delivery Window</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 pt-4 space-y-6">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-60">Start Time</label>
                           <Input 
                              value={sessionForm[type].startTime}
                              onChange={e => setSessionForm({...sessionForm, [type]: {...sessionForm[type], startTime: e.target.value}})}
                              className="h-12 rounded-xl bg-background/50 font-bold border-none"
                              placeholder="08:00 AM"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-60">End Time</label>
                           <Input 
                              value={sessionForm[type].endTime}
                              onChange={e => setSessionForm({...sessionForm, [type]: {...sessionForm[type], endTime: e.target.value}})}
                              className="h-12 rounded-xl bg-background/50 font-bold border-none"
                              placeholder="10:00 AM"
                           />
                        </div>
                     </div>
                     <Button 
                        onClick={() => handleUpdateSession(type)}
                        disabled={isProcessing}
                        className={`w-full h-12 rounded-xl bg-${color}-500 hover:bg-${color}-600 text-white font-black uppercase tracking-widest text-[10px]`}
                     >
                        Save {type} Window
                     </Button>
                  </CardContent>
                </Card>
              ))}
           </div>
        </TabsContent>

        <TabsContent value="dishes" className="animate-in slide-in-from-left-4 duration-500">
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <Card className="lg:col-span-1 rounded-[2.5rem] border-none shadow-2xl bg-emerald-500/5 border border-emerald-500/20">
                <CardHeader className="p-8">
                  <CardTitle className="text-2xl font-black uppercase tracking-tight">Add Dish</CardTitle>
                  <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60">Master Menu Item</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest ml-1">Dish Name</label>
                    <Input 
                      value={newItem.name}
                      onChange={e => setNewItem({...newItem, name: e.target.value})}
                      className="h-12 rounded-xl bg-background/50 font-bold"
                      placeholder="e.g. Paneer Butter Masala"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest ml-1">Category</label>
                    <Input 
                      value={newItem.category}
                      onChange={e => setNewItem({...newItem, category: e.target.value})}
                      className="h-12 rounded-xl bg-background/50 font-bold"
                      placeholder="e.g. Main Course"
                    />
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-background/50 border border-border/50">
                     <span className="text-[10px] font-black uppercase tracking-widest flex-1">Vegetarian?</span>
                     <button 
                        onClick={() => setNewItem({...newItem, isVeg: !newItem.isVeg})}
                        className={`w-10 h-6 rounded-full p-1 transition-all ${newItem.isVeg ? 'bg-emerald-500' : 'bg-muted'}`}
                     >
                        <div className={`w-4 h-4 rounded-full bg-white transition-all ${newItem.isVeg ? 'ml-4' : 'ml-0'}`} />
                     </button>
                  </div>
                  <Button 
                    onClick={handleAddItem}
                    disabled={isProcessing}
                    className="w-full h-14 rounded-xl bg-zinc-950 text-white font-black uppercase tracking-widest text-[10px] mt-4"
                  >
                    Add to Master
                  </Button>
                </CardContent>
              </Card>

              <div className="lg:col-span-3 space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
                    {items.map(item => (
                      <div key={item.id} className="p-6 rounded-3xl bg-card/30 border border-border/50 hover:border-emerald-500/30 transition-all group flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className={`w-3 h-3 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-red-500'} shadow-[0_0_8px_rgba(16,185,129,0.3)]`} />
                            <div>
                               <h4 className="font-black text-sm uppercase">{item.name}</h4>
                               <p className="text-[10px] font-bold text-muted-foreground uppercase">{item.category}</p>
                            </div>
                         </div>
                         <Button 
                            variant="ghost" 
                            size="icon" 
                            className="rounded-xl hover:bg-red-500/10 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            onClick={async () => {
                              await deleteTiffinItem(item.id);
                              setItems(items.filter(i => i.id !== item.id));
                              toast.success("Item removed");
                            }}
                         >
                            <Trash2 size={16} />
                         </Button>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </TabsContent>

        <TabsContent value="inclusions" className="animate-in slide-in-from-left-4 duration-500">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="rounded-[2.5rem] border-none shadow-2xl bg-amber-500/5 border border-amber-500/20">
                <CardHeader className="p-8">
                  <CardTitle className="text-2xl font-black uppercase tracking-tight">Master Inclusions</CardTitle>
                  <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60">Universal Plan Add-ons</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-6">
                   <div className="flex gap-2">
                      <Input 
                        value={newInclusion.name}
                        onChange={e => setNewInclusion({...newInclusion, name: e.target.value})}
                        className="h-12 rounded-xl bg-background/50 font-bold"
                        placeholder="e.g. Roasted Papad"
                      />
                      <Button onClick={handleAddInclusion} className="h-12 w-12 rounded-xl bg-amber-500 text-white"><Plus /></Button>
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                      {inclusions.map(inc => (
                        <div key={inc.id} className="flex items-center justify-between p-4 rounded-xl bg-card/50 border border-border/50">
                           <span className="text-[10px] font-black uppercase tracking-widest">{inc.name}</span>
                           <button 
                              onClick={async () => {
                                await deleteTiffinInclusion(inc.id);
                                setInclusions(inclusions.filter(i => i.id !== inc.id));
                              }}
                              className="text-muted-foreground hover:text-red-500"
                           >
                              <X size={14} />
                           </button>
                        </div>
                      ))}
                   </div>
                </CardContent>
              </Card>
           </div>
        </TabsContent>

        <TabsContent value="areas" className="animate-in slide-in-from-left-4 duration-500">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="rounded-[2.5rem] border-none shadow-2xl bg-rose-500/5 border border-rose-500/20">
                <CardHeader className="p-8">
                  <CardTitle className="text-2xl font-black uppercase tracking-tight">Service Master</CardTitle>
                  <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60">Delivery Zone Management</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-6">
                   <div className="flex gap-2">
                      <Input 
                        value={newArea.name}
                        onChange={e => setNewArea({...newArea, name: e.target.value})}
                        className="h-12 rounded-xl bg-background/50 font-bold"
                        placeholder="e.g. Arera Colony"
                      />
                      <Button onClick={handleAddArea} className="h-12 w-12 rounded-xl bg-rose-500 text-white"><Plus /></Button>
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                      {areas.map(area => (
                        <div key={area.id} className="flex items-center justify-between p-4 rounded-xl bg-card/50 border border-border/50">
                           <span className="text-[10px] font-black uppercase tracking-widest">{area.name}</span>
                           <button 
                              onClick={async () => {
                                await deleteTiffinArea(area.id);
                                setAreas(areas.filter(i => i.id !== area.id));
                              }}
                              className="text-muted-foreground hover:text-red-500"
                           >
                              <X size={14} />
                           </button>
                        </div>
                      ))}
                   </div>
                </CardContent>
              </Card>
           </div>
        </TabsContent>

        <TabsContent value="preferences" className="animate-in slide-in-from-left-4 duration-500">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="rounded-[2.5rem] border-none shadow-2xl bg-purple-500/5 border border-purple-500/20">
                <CardHeader className="p-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                      <Leaf size={20} />
                    </div>
                    <CardTitle className="text-2xl font-black uppercase tracking-tight">Dietary Master</CardTitle>
                  </div>
                  <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60">Dynamic Diet Options</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-6">
                   <div className="flex gap-2">
                      <Input 
                        value={newDietType}
                        onChange={e => setNewDietType(e.target.value)}
                        className="h-12 rounded-xl bg-background/50 font-bold"
                        placeholder="e.g. VEG, NON-VEG, JAIN"
                      />
                      <Button onClick={handleAddDietType} className="h-12 w-12 rounded-xl bg-purple-500 text-white"><Plus /></Button>
                   </div>
                   <div className="flex flex-wrap gap-2">
                      {dietTypes.map(diet => (
                        <Badge key={diet.id} variant="secondary" className="px-4 py-2 rounded-xl bg-card border border-border/50 font-bold gap-2 group">
                           {diet.name}
                           <button 
                             onClick={async () => {
                               await deleteTiffinDietType(diet.id);
                               setDietTypes(dietTypes.filter(d => d.id !== diet.id));
                             }}
                             className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                           >
                             <X size={12} />
                           </button>
                        </Badge>
                      ))}
                   </div>
                </CardContent>
              </Card>

              <Card className="rounded-[2.5rem] border-none shadow-2xl bg-red-500/5 border border-red-500/20">
                <CardHeader className="p-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
                      <Flame size={20} />
                    </div>
                    <CardTitle className="text-2xl font-black uppercase tracking-tight">Spice Master</CardTitle>
                  </div>
                  <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60">Spice Intensity Levels</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-6">
                   <div className="flex gap-2">
                      <Input 
                        value={newSpiceLevel}
                        onChange={e => setNewSpiceLevel(e.target.value)}
                        className="h-12 rounded-xl bg-background/50 font-bold"
                        placeholder="e.g. MILD, MEDIUM, SPICY"
                      />
                      <Button onClick={handleAddSpiceLevel} className="h-12 w-12 rounded-xl bg-red-500 text-white"><Plus /></Button>
                   </div>
                   <div className="flex flex-wrap gap-2">
                      {spiceLevels.map(spice => (
                        <Badge key={spice.id} variant="secondary" className="px-4 py-2 rounded-xl bg-card border border-border/50 font-bold gap-2 group">
                           {spice.name}
                           <button 
                             onClick={async () => {
                               await deleteTiffinSpiceLevel(spice.id);
                               setSpiceLevels(spiceLevels.filter(s => s.id !== spice.id));
                             }}
                             className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                           >
                             <X size={12} />
                           </button>
                        </Badge>
                      ))}
                   </div>
                </CardContent>
              </Card>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
