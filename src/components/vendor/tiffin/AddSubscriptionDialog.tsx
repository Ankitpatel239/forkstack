'use client';

import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Plus, UserPlus, Phone, Mail, MapPin, Calendar, Loader2 } from 'lucide-react';
import { createManualSubscription, getTiffinPlans } from '@/app/actions/tiffin';
import { toast } from 'sonner';
import { TiffinPlan } from '@/types/tiffin';

interface AddSubscriptionDialogProps {
  vendorId: string;
}

export function AddSubscriptionDialog({ vendorId }: AddSubscriptionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [plans, setPlans] = useState<TiffinPlan[]>([]);
  const [isPlansLoading, setIsPlansLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [planId, setPlanId] = useState('');
  const [address, setAddress] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [lat, setLat] = useState<number | undefined>();
  const [lng, setLng] = useState<number | undefined>();

  useEffect(() => {
    if (isOpen) {
      async function fetchPlans() {
        setIsPlansLoading(true);
        try {
          const data = await getTiffinPlans(vendorId);
          setPlans(data as any);
        } catch (e) {
          toast.error("Failed to load plans");
        } finally {
          setIsPlansLoading(false);
        }
      }
      fetchPlans();
    }
  }, [isOpen, vendorId]);

  const getGeolocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        toast.success("Location captured");
      },
      () => toast.error("Location failed")
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planId) {
      toast.error("Please select a plan");
      return;
    }

    setIsLoading(true);
    try {
      await createManualSubscription({
        vendorId,
        planId,
        customerName: name,
        customerPhone: phone,
        customerEmail: email || undefined,
        address,
        startDate: new Date(startDate),
        latitude: lat,
        longitude: lng,
      });
      toast.success("Subscription created successfully");
      setIsOpen(false);
      // Reset form
      setName('');
      setPhone('');
      setEmail('');
      setPlanId('');
      setAddress('');
      setLat(undefined);
      setLng(undefined);
    } catch (error) {
      toast.error("Failed to create subscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-600 text-zinc-950 shadow-lg shadow-emerald-500/20">
          <UserPlus size={18} /> Add New Subscriber
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-3xl border-border/50 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight">Manual Onboarding</DialogTitle>
          <DialogDescription className="font-medium">
            Add a customer manually to the tiffin service. They will be notified via SMS/WhatsApp.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name</Label>
              <Input 
                required 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="John Doe" 
                className="rounded-xl bg-muted/50 border-none h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                <Input 
                  required 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  placeholder="9876543210" 
                  className="rounded-xl bg-muted/50 border-none h-11 pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email (Optional)</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
              <Input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="customer@example.com" 
                className="rounded-xl bg-muted/50 border-none h-11 pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Plan</Label>
              <Select value={planId} onValueChange={setPlanId}>
                <SelectTrigger className="rounded-xl bg-muted/50 border-none h-11">
                  <SelectValue placeholder={isPlansLoading ? "Loading..." : "Select a plan"} />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {plans.map(plan => (
                    <SelectItem key={plan.id} value={plan.id} className="font-bold">
                      {plan.name} (₹{plan.price})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Start Date</Label>
              <Input 
                type="date" 
                required 
                value={startDate} 
                onChange={e => setStartDate(e.target.value)} 
                className="rounded-xl bg-muted/50 border-none h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Delivery Address</Label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={getGeolocation}
                className="h-6 px-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500/10 hover:text-emerald-500"
              >
                <MapPin size={10} className="mr-1" />
                {lat ? "GPS Linked" : "Get GPS"}
              </Button>
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-muted-foreground" size={14} />
              <textarea 
                required 
                value={address} 
                onChange={e => setAddress(e.target.value)} 
                placeholder="Full delivery address with landmark..." 
                className="w-full min-h-[80px] rounded-xl bg-muted/50 border-none p-3 pl-10 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 rounded-xl font-black uppercase tracking-widest bg-emerald-500 hover:bg-emerald-600 text-zinc-950 shadow-xl shadow-emerald-500/20"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Confirm Subscription"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
