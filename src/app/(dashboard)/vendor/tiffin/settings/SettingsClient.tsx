'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Save, Settings2, Loader2, Utensils, Clock, Flame, Leaf } from 'lucide-react';
import { updateVendorTiffinSettings } from '@/app/actions/tiffin';
import { toast } from 'sonner';

interface SettingsClientProps {
  initialSettings: any;
  vendorId: string;
}

const ConfigSection = ({ title, description, icon: Icon, colorClass, list, onAdd, onRemove, newValue, setNewValue, placeholder }: any) => (
  <Card className="rounded-[2rem] border-none shadow-xl bg-white dark:bg-zinc-900 overflow-hidden">
    <CardHeader className="p-8">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-xl ${colorClass}`}>
          <Icon size={20} />
        </div>
        <CardTitle className="text-xl font-black uppercase tracking-tight">{title}</CardTitle>
      </div>
      <CardDescription className="text-xs font-medium">{description}</CardDescription>
    </CardHeader>
    <CardContent className="p-8 pt-0 space-y-6">
      <div className="flex gap-2">
        <Input 
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), onAdd())}
          placeholder={placeholder}
          className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border-border/50 font-bold"
        />
        <Button 
          onClick={onAdd}
          className={`h-12 w-12 rounded-xl text-zinc-950 p-0 ${colorClass.split(' ')[1] || 'bg-zinc-200'}`}
        >
          <Plus size={20} />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 min-h-[80px] p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-dashed border-border">
        {list.length === 0 ? (
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center w-full mt-6">Not defined</p>
        ) : (
          list.map((item: string, idx: number) => (
            <Badge key={idx} variant="secondary" className="pl-3 pr-1 py-1 h-8 rounded-lg bg-white dark:bg-zinc-900 border-border/50 text-xs font-bold gap-2">
              {item}
              <button onClick={() => onRemove(item)} className="hover:text-red-500 transition-colors p-1">
                <X size={12} />
              </button>
            </Badge>
          ))
        )}
      </div>
    </CardContent>
  </Card>
);

export default function SettingsClient({ initialSettings, vendorId }: SettingsClientProps) {
  const [inclusions, setInclusions] = useState<string[]>(initialSettings?.tiffinInclusions || []);
  const [timeSlots, setTimeSlots] = useState<string[]>(initialSettings?.tiffinTimeSlots || []);
  const [dietTypes, setDietTypes] = useState<string[]>(initialSettings?.tiffinDietTypes || []);
  const [spiceLevels, setSpiceLevels] = useState<string[]>(initialSettings?.tiffinSpiceLevels || []);

  const [newInclusion, setNewInclusion] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [newDietType, setNewDietType] = useState('');
  const [newSpiceLevel, setNewSpiceLevel] = useState('');

  const [isSaving, setIsSaving] = useState(false);

  const handleAddItem = (list: string[], setList: (val: string[]) => void, value: string, setValue: (val: string) => void) => {
    if (!value.trim()) return;
    if (list.includes(value.trim())) {
      toast.error("Already exists");
      return;
    }
    setList([...list, value.trim()]);
    setValue('');
  };

  const handleRemoveItem = (list: string[], setList: (val: string[]) => void, item: string) => {
    setList(list.filter(i => i !== item));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateVendorTiffinSettings(vendorId, {
        tiffinInclusions: inclusions,
        tiffinTimeSlots: timeSlots,
        tiffinDietTypes: dietTypes,
        tiffinSpiceLevels: spiceLevels
      });
      toast.success("Settings updated successfully!");
    } catch (err) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h2 className="text-3xl font-black uppercase italic tracking-tight">Service Configuration</h2>
          <p className="text-muted-foreground font-medium text-sm">Define global selectable options for your tiffin plans.</p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="h-14 px-8 rounded-2xl bg-emerald-500 text-zinc-950 hover:bg-emerald-400 font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-500/20"
        >
          {isSaving ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
          Publish Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ConfigSection 
          title="Inclusion Library"
          description="Free add-ons (Papad, Salad, etc.) available for your plans."
          icon={Utensils}
          colorClass="bg-emerald-500/10 text-emerald-500"
          list={inclusions}
          onAdd={() => handleAddItem(inclusions, setInclusions, newInclusion, setNewInclusion)}
          onRemove={(item: string) => handleRemoveItem(inclusions, setInclusions, item)}
          newValue={newInclusion}
          setNewValue={setNewInclusion}
          placeholder="e.g. Papad, Pickle, Salad"
        />

        <ConfigSection 
          title="Delivery Time Slots"
          description="Selectable time windows for meal deliveries."
          icon={Clock}
          colorClass="bg-blue-500/10 text-blue-500"
          list={timeSlots}
          onAdd={() => handleAddItem(timeSlots, setTimeSlots, newTimeSlot, setNewTimeSlot)}
          onRemove={(item: string) => handleRemoveItem(timeSlots, setTimeSlots, item)}
          newValue={newTimeSlot}
          setNewValue={setNewTimeSlot}
          placeholder="e.g. 12:30-1:00 PM"
        />

        <ConfigSection 
          title="Dietary Preferences"
          description="Diet types available for subscribers."
          icon={Leaf}
          colorClass="bg-amber-500/10 text-amber-500"
          list={dietTypes}
          onAdd={() => handleAddItem(dietTypes, setDietTypes, newDietType, setNewDietType)}
          onRemove={(item: string) => handleRemoveItem(dietTypes, setDietTypes, item)}
          newValue={newDietType}
          setNewValue={setNewDietType}
          placeholder="e.g. VEG, NON-VEG, JAIN"
        />

        <ConfigSection 
          title="Spice Levels"
          description="Spice intensity options for the meals."
          icon={Flame}
          colorClass="bg-red-500/10 text-red-500"
          list={spiceLevels}
          onAdd={() => handleAddItem(spiceLevels, setSpiceLevels, newSpiceLevel, setNewSpiceLevel)}
          onRemove={(item: string) => handleRemoveItem(spiceLevels, setSpiceLevels, item)}
          newValue={newSpiceLevel}
          setNewValue={setNewSpiceLevel}
          placeholder="e.g. Medium, Spicy, Low Spice"
        />
      </div>

      <Card className="rounded-[2rem] border-none shadow-xl bg-zinc-900 text-white overflow-hidden">
        <CardContent className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white/10 text-white">
              <Settings2 size={24} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-emerald-400 italic">ForkStack Configuration Protocol</p>
              <p className="text-xs text-zinc-400 font-medium italic mt-1">Changes are live immediately for new subscriptions. Active subscriptions remain on their snapshot versions.</p>
            </div>
          </div>
          <div className="text-right">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">System Ready</span>
             <div className="h-1 w-24 bg-emerald-500 mt-2 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
