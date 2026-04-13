
'use client';

import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, UserPlus } from 'lucide-react';
import { recruitStaff } from '@/app/actions/workforce';
import { toast } from 'sonner';

export function RecruitStaffDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    role: 'WAITER'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await recruitStaff(formData.email, formData.role);
      toast.success('Staff member onboarded to workforce');
      setFormData({ email: '', role: 'WAITER' });
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Onboarding failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[450px] rounded-3xl p-8">
        <DialogHeader className="mb-6">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4">
             <UserPlus size={24} />
          </div>
          <DialogTitle className="text-xl font-black italic uppercase tracking-tight">Onboard New Operator</DialogTitle>
          <DialogDescription className="text-zinc-500 font-medium font-sans">
            Connect a registered user to your workforce command node.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Registered Email Address</Label>
            <Input 
              type="email"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              placeholder="operator@forkstack.com" 
              className="bg-zinc-950 border-zinc-800 h-12 px-4 font-bold text-sm" 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Designation / Role</Label>
            <Select 
              value={formData.role} 
              onValueChange={v => setFormData({...formData, role: v})}
            >
              <SelectTrigger className="bg-zinc-950 border-zinc-800 h-12 text-sm font-bold">
                <SelectValue placeholder="Select Designation" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-white font-bold">
                <SelectItem value="MANAGER">MANAGER</SelectItem>
                <SelectItem value="KITCHEN">KITCHEN</SelectItem>
                <SelectItem value="CASHIER">CASHIER</SelectItem>
                <SelectItem value="WAITER">WAITER</SelectItem>
                <SelectItem value="DELIVERY">DELIVERY</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4">
            <Button 
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-[10px] h-14 rounded-2xl shadow-xl shadow-emerald-500/10"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Authorize Onboarding'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
