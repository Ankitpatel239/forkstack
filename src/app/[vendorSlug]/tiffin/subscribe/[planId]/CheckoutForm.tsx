'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Phone, 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Loader2, 
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Flame,
  Leaf
} from 'lucide-react';
import { createCustomerSubscription } from '@/app/actions/tiffin';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CheckoutFormProps {
  vendorId: string;
  planId: string;
  availableOptions: {
    timeSlots: string[];
    dietTypes: string[];
    spiceLevels: string[];
  };
}

export function CheckoutForm({ vendorId, planId, availableOptions }: CheckoutFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Custom Selection State
  const [selectedSlot, setSelectedSlot] = useState(availableOptions.timeSlots[0] || '');
  const [selectedDiet, setSelectedDiet] = useState(availableOptions.dietTypes[0] || '');
  const [selectedSpice, setSelectedSpice] = useState(availableOptions.spiceLevels[0] || '');

  // Geolocation State
  const [lat, setLat] = useState<number | undefined>();
  const [lng, setLng] = useState<number | undefined>();
  const [isLocating, setIsLocating] = useState(false);

  const getGeolocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        setIsLocating(false);
        toast.success("Location captured successfully!");
      },
      (error) => {
        setIsLocating(false);
        toast.error("Unable to retrieve your location");
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createCustomerSubscription({
        vendorId,
        planId,
        name,
        phone,
        email: email || undefined,
        address,
        startDate: new Date(startDate),
        timeSlot: selectedSlot,
        dietType: selectedDiet,
        spiceLevel: selectedSpice,
        latitude: lat,
        longitude: lng,
      });
      setIsSuccess(true);
      toast.success("Subscription placed successfully!");
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('../'); // Back to tiffin page
      }, 3000);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const ChipGroup = ({ label, options, selected, onSelect, icon: Icon, colorClass }: any) => (
    <div className="space-y-3">
      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 ml-1 flex items-center gap-2">
        <Icon size={12} className={colorClass} /> {label}
      </Label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt: string) => (
          <button
            key={opt}
            type="button"
            onClick={() => onSelect(opt)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
              selected === opt 
                ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-transparent shadow-lg" 
                : "bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-white/5 text-zinc-500 hover:border-zinc-300 dark:hover:border-white/10"
            )}
          >
            {opt}
          </button>
        ))}
        {options.length === 0 && <span className="text-[10px] text-zinc-400 italic">No options defined by vendor</span>}
      </div>
    </div>
  );

  if (isSuccess) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in duration-500">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 border-2 border-emerald-500/20">
            <CheckCircle2 size={80} className="animate-in slide-in-from-bottom-2" />
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-zinc-950 animate-bounce">
            <ShieldCheck size={20} />
          </div>
        </div>
        <div className="space-y-3">
          <h2 className="text-4xl font-black text-zinc-950 dark:text-white uppercase italic tracking-tighter">You're Subscribed!</h2>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-sm text-lg leading-relaxed">
            Your tiffin service will start on <span className="font-black text-emerald-500">{new Date(startDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>.
          </p>
        </div>
        <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-white/5 w-full">
           <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">A confirmation message has been sent to your phone.</p>
        </div>
        <Button 
          variant="outline" 
          className="rounded-2xl border-zinc-200 dark:border-white/10 h-14 px-10 font-black uppercase tracking-widest text-xs"
          onClick={() => router.push('../')}
        >
          Back to Service Plans
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
      {/* SECTION: IDENTIFICATION */}
      <div className="space-y-8">
        <div className="space-y-2 border-l-4 border-emerald-500 pl-4">
          <h3 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight uppercase italic leading-none">Identity</h3>
          <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.3em]">Subscriber Authentication</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 ml-1">Full Subscriber Name</Label>
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={22} />
              <Input 
                required 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Rahul Sharma" 
                className="h-20 rounded-[1.5rem] bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-white/5 pl-16 font-bold text-zinc-900 dark:text-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all text-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 ml-1">WhatsApp (Dispatch Contact)</Label>
              <div className="relative group">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={22} />
                <Input 
                  required 
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 00000 00000" 
                  className="h-20 rounded-[1.5rem] bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-white/5 pl-16 font-bold text-zinc-900 dark:text-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all text-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 ml-1">Email (Digital Billing)</Label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={22} />
                <Input 
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com" 
                  className="h-20 rounded-[1.5rem] bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-white/5 pl-16 font-bold text-zinc-900 dark:text-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all text-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: PREFERENCES */}
      <div className="space-y-8">
        <div className="space-y-2 border-l-4 border-emerald-500 pl-4">
          <h3 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight uppercase italic leading-none">Preferences</h3>
          <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.3em]">Personalized Configuration</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 ml-1 flex items-center gap-2">
              <Clock size={12} className="text-blue-500" /> Dispatch Window
            </Label>
            <Select value={selectedSlot} onValueChange={setSelectedSlot}>
              <SelectTrigger className="h-20 rounded-[1.5rem] bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-white/5 font-bold text-lg px-6">
                <SelectValue placeholder="Select session" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900">
                {availableOptions.timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot} className="font-bold py-4 rounded-xl focus:bg-emerald-500 focus:text-zinc-950">
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availableOptions.timeSlots.length === 0 && <p className="text-[10px] text-zinc-400 italic">Default timing applies</p>}
          </div>

          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 ml-1">Activation Date</Label>
            <div className="relative group">
              <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={22} />
              <Input 
                type="date"
                required 
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="h-20 rounded-[1.5rem] bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-white/5 pl-16 font-bold text-zinc-900 dark:text-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all text-xl"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10">
          <ChipGroup 
            label="Culinary Style" 
            options={availableOptions.dietTypes} 
            selected={selectedDiet} 
            onSelect={setSelectedDiet} 
            icon={Leaf} 
            colorClass="text-emerald-500"
          />
          <ChipGroup 
            label="Spice Tolerance" 
            options={availableOptions.spiceLevels} 
            selected={selectedSpice} 
            onSelect={setSelectedSpice} 
            icon={Flame} 
            colorClass="text-red-500"
          />
        </div>
      </div>

      {/* SECTION: LOGISTICS */}
      <div className="space-y-8">
        <div className="space-y-2 border-l-4 border-emerald-500 pl-4">
          <h3 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight uppercase italic leading-none">Logistics</h3>
          <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.3em]">Delivery Coordinates</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end mb-2 px-1">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Exact Delivery Destination</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={getGeolocation}
              disabled={isLocating}
              className={cn(
                "h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                lat ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-zinc-100 dark:bg-zinc-800 border-transparent"
              )}
            >
              {isLocating ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <MapPin className="h-3 w-3 mr-2" />}
              {lat ? "Geo-Coordinates Locked" : "Use Live Location"}
            </Button>
          </div>
          <div className="relative group">
            <MapPin className="absolute left-6 top-6 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={24} />
            <textarea 
              required 
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Flat/House No, Building Name, Landmark, Specific Instructions..." 
              className="w-full min-h-[180px] rounded-[2rem] bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-white/5 p-8 pl-16 font-bold text-zinc-900 dark:text-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 outline-none transition-all text-xl resize-none"
            />
          </div>
          {lat && (
            <div className="flex items-center gap-2 px-4 py-3 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 animate-in slide-in-from-top-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.15em]">
                Live location data embedded &bull; GPS: {lat.toFixed(4)}, {lng?.toFixed(4)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* FINAL ACTION */}
      <div className="pt-12 border-t border-zinc-100 dark:border-white/5">
        <Button 
          type="submit"
          disabled={isLoading}
          className="w-full h-24 rounded-[2rem] bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-black uppercase tracking-[0.25em] shadow-[0_20px_50px_-10px_rgba(16,185,129,0.3)] group transition-all active:scale-[0.98] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
          {isLoading ? (
            <Loader2 className="animate-spin" size={32} />
          ) : (
            <div className="flex items-center justify-center gap-4 text-xl">
              Initiate Service Cycle 
              <ArrowRight className="group-hover:translate-x-3 transition-transform" size={28} />
            </div>
          )}
        </Button>
        <div className="mt-8 text-center space-y-4">
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-black uppercase tracking-[0.3em] opacity-40">
            Encrypted Transaction &bull; ForkStack Secure Payload
          </p>
          <div className="flex items-center justify-center gap-3">
             <div className="h-1 w-1 rounded-full bg-emerald-500/20" />
             <div className="h-1 w-24 rounded-full bg-gradient-to-r from-emerald-500/20 to-transparent" />
          </div>
        </div>
      </div>
    </form>
  );
}

