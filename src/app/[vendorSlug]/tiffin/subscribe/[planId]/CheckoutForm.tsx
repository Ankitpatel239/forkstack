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
    <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
      <div className="space-y-3">
        <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight uppercase italic">Personal Details</h3>
        <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Acquisition Identification</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 ml-1">Legal Full Name</Label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
            <Input 
              required 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma" 
              className="h-16 rounded-[1.25rem] bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-white/5 pl-14 font-bold text-zinc-900 dark:text-white focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all text-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 ml-1">WhatsApp Number</Label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
              <Input 
                required 
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 00000 00000" 
                className="h-16 rounded-[1.25rem] bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-white/5 pl-14 font-bold text-zinc-900 dark:text-white focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all text-lg"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 ml-1">Email (Electronic Bill)</Label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
              <Input 
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="billing@example.com" 
                className="h-16 rounded-[1.25rem] bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-white/5 pl-14 font-bold text-zinc-900 dark:text-white focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all text-lg"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-6">
          <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight uppercase italic">Custom Preferences</h3>
          <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Personalize your meal experience</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 ml-1 flex items-center gap-2">
              <Clock size={12} className="text-blue-500" /> Delivery Slot
            </Label>
            <Select value={selectedSlot} onValueChange={setSelectedSlot}>
              <SelectTrigger className="h-16 rounded-[1.25rem] bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-white/5 font-bold text-lg">
                <SelectValue placeholder="Select a slot" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900">
                {availableOptions.timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot} className="font-bold py-3 rounded-xl focus:bg-emerald-500 focus:text-zinc-950">
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availableOptions.timeSlots.length === 0 && <p className="text-[10px] text-zinc-400 italic">No slots defined by vendor</p>}
          </div>

          <ChipGroup 
            label="Dietary Type" 
            options={availableOptions.dietTypes} 
            selected={selectedDiet} 
            onSelect={setSelectedDiet} 
            icon={Leaf} 
            colorClass="text-emerald-500"
          />
          <ChipGroup 
            label="Spice Intensity" 
            options={availableOptions.spiceLevels} 
            selected={selectedSpice} 
            onSelect={setSelectedSpice} 
            icon={Flame} 
            colorClass="text-red-500"
          />
          
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 ml-1">Cycle Commencement Date</Label>
            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
              <Input 
                type="date"
                required 
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="h-16 rounded-[1.25rem] bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-white/5 pl-14 font-bold text-zinc-900 dark:text-white focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all text-lg"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-6">
          <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight uppercase italic">Logistics</h3>
          <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Service Dispatch Configuration</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-end ml-1">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Precise Delivery Address</Label>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={getGeolocation}
              disabled={isLocating}
              className="h-8 rounded-lg text-[9px] font-black uppercase tracking-tighter hover:bg-emerald-500/10 hover:text-emerald-500"
            >
              {isLocating ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <MapPin className="h-3 w-3 mr-1" />}
              {lat ? "Location Captured" : "Get My Location"}
            </Button>
          </div>
          <div className="relative group">
            <MapPin className="absolute left-4 top-5 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
            <textarea 
              required 
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Building No, Flat/Office, Landmark, Specific Instructions..." 
              className="w-full min-h-[140px] rounded-[1.25rem] bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-white/5 p-5 pl-14 font-bold text-zinc-900 dark:text-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/50 outline-none transition-all text-lg"
            />
          </div>
          {lat && (
            <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest ml-1 animate-pulse">
              Geolocation embedded in subscription for faster delivery
            </p>
          )}
        </div>
      </div>

      <div className="pt-8">
        <Button 
          type="submit"
          disabled={isLoading}
          className="w-full h-20 rounded-[1.5rem] bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-black uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/20 group transition-all active:scale-[0.98]"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={28} />
          ) : (
            <div className="flex items-center gap-3">
              Authorize Subscription 
              <ArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
            </div>
          )}
        </Button>
        <p className="text-center text-[10px] text-zinc-500 dark:text-zinc-400 mt-6 font-bold uppercase tracking-widest opacity-60">
          Encrypted Secure Checkout &middot; ForkStack Protocol v2.4
        </p>
      </div>
    </form>
  );
}
