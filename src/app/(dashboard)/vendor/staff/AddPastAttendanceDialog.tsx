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
import { Loader2, CalendarClock } from 'lucide-react';
import { logPastAttendance } from '@/app/actions/workforce';
import { toast } from 'sonner';

export function AddPastAttendanceDialog({ open, onOpenChange, staff }: { open: boolean, onOpenChange: (open: boolean) => void, staff: any[] }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    date: '',
    status: 'PRESENT' as 'PRESENT' | 'ABSENT' | 'LEAVE'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userId || !formData.date) {
      toast.error('Please select a staff member and date');
      return;
    }
    
    setLoading(true);
    try {
      await logPastAttendance(formData.userId, formData.date, formData.status);
      toast.success('Past attendance recorded successfully');
      setFormData({ userId: '', date: '', status: 'PRESENT' });
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to record attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white w-[95vw] sm:max-w-[450px] rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader className="mb-6">
          <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-500 mb-4">
             <CalendarClock size={24} />
          </div>
          <DialogTitle className="text-xl font-black italic uppercase tracking-tight">Add Past Attendance</DialogTitle>
          <DialogDescription className="text-zinc-500 font-medium font-sans">
            Record attendance manually for previous dates.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-600 px-1">Staff Member</Label>
            <Select 
              value={formData.userId} 
              onValueChange={v => setFormData({...formData, userId: v})}
            >
              <SelectTrigger className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 h-12 text-sm font-bold text-zinc-900 dark:text-white">
                <SelectValue placeholder="Select Staff Member" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-bold">
                {staff.map(s => (
                  <SelectItem key={s.id} value={s.userId}>{s.user?.name || s.user?.email}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-600 px-1">Date</Label>
            <Input 
              type="date"
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
              max={new Date().toISOString().split('T')[0]}
              className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 h-12 px-4 font-bold text-sm text-zinc-900 dark:text-white" 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-600 px-1">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(v: any) => setFormData({...formData, status: v})}
            >
              <SelectTrigger className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 h-12 text-sm font-bold text-zinc-900 dark:text-white">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-bold">
                <SelectItem value="PRESENT">Present</SelectItem>
                <SelectItem value="ABSENT">Absent</SelectItem>
                <SelectItem value="LEAVE">Leave</SelectItem>
                <SelectItem value="HALF_DAY">Half Day</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4">
            <Button 
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 dark:hover:bg-orange-400 text-white dark:text-zinc-950 font-black uppercase tracking-widest text-[10px] h-14 rounded-2xl shadow-xl shadow-orange-500/10"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Save Record'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
