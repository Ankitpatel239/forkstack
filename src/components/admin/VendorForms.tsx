'use client';

import { useState, useEffect } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { createVendor, updateVendor } from '@/app/actions/admin-vendors';

// Form Schemas
const vendorSchema = z.object({
  businessName: z.string().min(2, "Name too short"),
  businessEmail: z.string().email("Invalid email"),
  businessPhone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "HQ address is required"),
  tenantSlug: z.string().min(2, "Slug too short").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  subscriptionPlan: z.string(),
  isPubliclyListed: z.boolean().optional(),
});

export function VendorFormModal({
  isOpen,
  onClose,
  initialData,
  availablePlans,
  onSuccess
}: {
  isOpen: boolean,
  onClose: () => void,
  initialData?: any,
  availablePlans?: any[],
  onSuccess?: (vendor: any) => void
}) {
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      businessName: '',
      tenantSlug: '',
      businessEmail: '',
      businessPhone: '',
      address: '',
      subscriptionPlan: 'BASIC',
    }
  });

  const selectedPlan = watch("subscriptionPlan") || "BASIC";

  // Reset form with initial data when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          businessName: initialData.businessName || '',
          tenantSlug: initialData.tenantSlug || '',
          businessEmail: initialData.businessEmail || '',
          businessPhone: initialData.businessPhone || '',
          address: initialData.address || '',
          subscriptionPlan: initialData.subscriptionPlan || 'BASIC',
          isPubliclyListed: initialData.isPubliclyListed || false,
        });
      } else {
        reset({
          businessName: '',
          tenantSlug: '',
          businessEmail: '',
          businessPhone: '',
          address: '',
          subscriptionPlan: 'BASIC',
          isPubliclyListed: false,
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      let result;
      if (initialData?.id) {
        result = await updateVendor(initialData.id, data);
      } else {
        result = await createVendor(data);
      }

      if (result.success) {
        toast.success(initialData ? "Vendor details updated successfully" : "Vendor created successfully");
        if (onSuccess) {
          onSuccess({ ...initialData, ...data });
        }
        onClose();
        reset();
      } else {
        toast.error(result.error || "Operation failed");
      }
    } catch (error) {
      toast.error("Operation failed due to a system error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white w-[95vw] max-w-lg sm:max-w-[600px] rounded-[2.5rem] p-6 sm:p-8 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter text-zinc-900 dark:text-white">
            {initialData ? 'Update Vendor Account' : 'Add New Vendor'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-600 px-1">Business Name</Label>
              <Input 
                {...register("businessName")} 
                className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 h-12 rounded-xl text-xs font-bold text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-700 focus:border-emerald-500/50" 
                placeholder="e.g. Skyline Cafe" 
              />
              {errors.businessName && <p className="text-[10px] text-red-500 font-bold uppercase px-1">{errors.businessName.message as string}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-600 px-1">Tenant Slug</Label>
              <Input 
                {...register("tenantSlug")} 
                className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 h-12 rounded-xl text-xs font-bold text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-700 focus:border-emerald-500/50" 
                placeholder="skyline-cafe" 
              />
              {errors.tenantSlug && <p className="text-[10px] text-red-500 font-bold uppercase px-1">{errors.tenantSlug.message as string}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-600 px-1">Contact Email</Label>
              <Input 
                {...register("businessEmail")} 
                className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 h-12 rounded-xl text-xs font-bold text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-700 focus:border-emerald-500/50" 
                placeholder="owner@brand.com" 
              />
              {errors.businessEmail && <p className="text-[10px] text-red-500 font-bold uppercase px-1">{errors.businessEmail.message as string}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-600 px-1">Support Phone</Label>
              <Input 
                {...register("businessPhone")} 
                className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 h-12 rounded-xl text-xs font-bold text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-700 focus:border-emerald-500/50" 
                placeholder="+1 234..." 
              />
              {errors.businessPhone && <p className="text-[10px] text-red-500 font-bold uppercase px-1">{errors.businessPhone.message as string}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-600 px-1">Subscription Tier</Label>
            <Select 
              value={selectedPlan} 
              onValueChange={(v) => setValue("subscriptionPlan", v)}
            >
              <SelectTrigger className="w-full bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 h-12 rounded-xl text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-widest focus:ring-0 focus:border-emerald-500/50">
                <SelectValue placeholder="Select Plan" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white rounded-xl">
                {availablePlans && availablePlans.length > 0 ? (
                  availablePlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.name} className="focus:bg-zinc-100 dark:focus:bg-zinc-800 uppercase font-black text-[10px] italic tracking-widest">
                      {plan.displayName}
                    </SelectItem>
                  ))
                ) : (
                  <>
                    <SelectItem value="BASIC" className="focus:bg-zinc-100 dark:focus:bg-zinc-800 uppercase font-black text-[10px] italic tracking-widest">Basic Node</SelectItem>
                    <SelectItem value="PRO" className="focus:bg-zinc-100 dark:focus:bg-zinc-800 uppercase font-black text-[10px] italic tracking-widest">Professional Relay</SelectItem>
                    <SelectItem value="ENTERPRISE" className="focus:bg-zinc-100 dark:focus:bg-zinc-800 uppercase font-black text-[10px] italic tracking-widest">Enterprise Grade</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-600 px-1">Physical Venue HQ</Label>
            <Input 
              {...register("address")} 
              className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 h-12 rounded-xl text-xs font-bold text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-700 focus:border-emerald-500/50" 
              placeholder="Enter full address..." 
            />
            {errors.address && <p className="text-[10px] text-red-500 font-bold uppercase px-1">{errors.address.message as string}</p>}
          </div>

          {initialData && (
            <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl">
              <div>
                <Label className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white">Public Directory</Label>
                <p className="text-[10px] font-bold text-zinc-500 uppercase mt-1">Force toggle vendor visibility in the explore page</p>
              </div>
              <Switch 
                checked={watch("isPubliclyListed")}
                onCheckedChange={(checked) => setValue("isPubliclyListed", checked)}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>
          )}

          <DialogFooter className="pt-4 flex flex-col-reverse sm:flex-row gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1 text-[10px] font-black uppercase tracking-widest italic text-zinc-500 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white font-black uppercase tracking-widest text-xs h-12 rounded-xl shadow-xl shadow-emerald-500/10"
            >
              {loading ? <Loader2 className="animate-spin text-white" size={18} /> : (initialData ? 'Update Vendor' : 'Add New Vendor')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
