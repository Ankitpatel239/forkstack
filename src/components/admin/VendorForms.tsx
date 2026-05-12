'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

// Form Schemas
const vendorSchema = z.object({
  businessName: z.string().min(2, "Name too short"),
  businessEmail: z.string().email("Invalid email"),
  businessPhone: z.string(),
  address: z.string(),
  tenantSlug: z.string(),
  subscriptionPlan: z.string(),
});

export function VendorFormModal({
  isOpen,
  onClose,
  initialData,
  availablePlans
}: {
  isOpen: boolean,
  onClose: () => void,
  initialData?: any,
  availablePlans?: any[]
}) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(vendorSchema),
    defaultValues: initialData || {
      subscriptionPlan: "BASIC"
    }
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      // In a real app: await createOrUpdateVendor(data);
      console.log("Submitting vendor data:", data);
      await new Promise(r => setTimeout(r, 1000));
      toast.success(initialData ? "Vendor updated" : "Vendor provisioned successfully");
      onClose();
      reset();
    } catch (error) {
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black italic">{initialData ? 'Update Account' : 'Provision Partner Account'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Business Name</Label>
              <Input {...register("businessName")} className="bg-zinc-950 border-zinc-800 h-11" placeholder="e.g. Skyline Cafe" />
              {errors.businessName && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.businessName.message as string}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Tenant Slug</Label>
              <Input {...register("tenantSlug")} className="bg-zinc-950 border-zinc-800 h-11" placeholder="skyline-cafe" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Contact Email</Label>
              <Input {...register("businessEmail")} className="bg-zinc-950 border-zinc-800 h-11" placeholder="owner@brand.com" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Support Phone</Label>
              <Input {...register("businessPhone")} className="bg-zinc-950 border-zinc-800 h-11" placeholder="+1 234..." />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Subscription Tier</Label>
            <Select defaultValue={initialData?.subscriptionPlan || "BASIC"} onValueChange={(v) => reset({ ...initialData, subscriptionPlan: v })}>
              <SelectTrigger className="grow bg-zinc-950 border-zinc-800 h-11">
                <SelectValue placeholder="Select Plan" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                {availablePlans && availablePlans.length > 0 ? (
                  availablePlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.name}>{plan.displayName}</SelectItem>
                  ))
                ) : (
                  <>
                    <SelectItem value="BASIC">Basic Node</SelectItem>
                    <SelectItem value="PRO">Professional Relay</SelectItem>
                    <SelectItem value="ENTERPRISE">Enterprise Grade</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Physical Venue HQ</Label>
            <Input {...register("address")} className="bg-zinc-950 border-zinc-800 h-11" placeholder="Enter full address..." />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-xs h-12 shadow-xl shadow-emerald-500/10"
            >
              {loading ? <Loader2 className="animate-spin" /> : (initialData ? 'Update Vendor Node' : 'Initialize Business Unit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
