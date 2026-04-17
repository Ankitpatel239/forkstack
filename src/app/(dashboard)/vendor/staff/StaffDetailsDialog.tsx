
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  Banknote, 
  Calendar as CalendarIcon, 
  History, 
  TrendingDown, 
  TrendingUp,
  Fingerprint,
  Badge,
  CheckCircle2
} from 'lucide-react';
import { logAttendance, generateSalaryRecord } from '@/app/actions/workforce';
import { toast } from 'sonner';

export function StaffDetailsDialog({ staffMember, open, onOpenChange }: any) {
  if (!staffMember) return null;

  const [loading, setLoading] = useState(false);
  
  // Attendance Form
  const [attStatus, setAttStatus] = useState('PRESENT');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  // Salary Form
  const [baseSalary, setBaseSalary] = useState('0');
  const [deductions, setDeductions] = useState('0');
  const [bonus, setBonus] = useState('0');

  const handleAttSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await logAttendance(
        staffMember.userId, 
        attStatus as any, 
        checkIn ? new Date(`${new Date().toISOString().split('T')[0]}T${checkIn}`) : undefined,
        checkOut ? new Date(`${new Date().toISOString().split('T')[0]}T${checkOut}`) : undefined
      );
      toast.success('Attendance node synchronized');
      onOpenChange(false);
    } catch (error) {
      toast.error('Sync failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSalarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await generateSalaryRecord(staffMember.userId, {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        baseSalary: parseFloat(baseSalary),
        bonus: parseFloat(bonus),
        deductions: parseFloat(deductions)
      });
      toast.success('Payroll record committed');
      onOpenChange(false);
    } catch (error) {
      toast.error('Commit failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-[650px] p-0 overflow-hidden rounded-3xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{staffMember.user.name}</DialogTitle>
          <DialogDescription>Workforce management node for {staffMember.user.name}</DialogDescription>
        </DialogHeader>

        <div className="bg-zinc-900 p-8 border-b border-zinc-800 relative">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <Fingerprint size={120} />
           </div>
           <div className="flex items-center gap-6 text-left">
              <div className="h-16 w-16 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-3xl font-black text-emerald-500 italic">
                 {staffMember.user.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">{staffMember.user.name}</h2>
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full">
                    {staffMember.roleInVendor}
                  </Badge>
                  <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{staffMember.user.email}</span>
                </div>
              </div>
           </div>
        </div>

        <Tabs defaultValue="attendance" className="p-8">
          <TabsList className="bg-zinc-900 border border-zinc-800 h-11 mb-8 p-1">
            <TabsTrigger value="attendance" className="text-[10px] font-black uppercase tracking-widest px-6 data-[state=active]:bg-zinc-800">
               <Clock size={14} className="mr-2" /> Daily Log
            </TabsTrigger>
            <TabsTrigger value="payroll" className="text-[10px] font-black uppercase tracking-widest px-6 data-[state=active]:bg-zinc-800">
               <Banknote size={14} className="mr-2" /> Salary Node
            </TabsTrigger>
            <TabsTrigger value="calendar" className="text-[10px] font-black uppercase tracking-widest px-6 data-[state=active]:bg-zinc-800">
               <CalendarIcon size={14} className="mr-2" /> Lifecycle
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attendance">
             <form onSubmit={handleAttSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Entry Time (Clock In)</Label>
                      <Input 
                        type="time" 
                        value={checkIn}
                        onChange={e => setCheckIn(e.target.value)}
                        className="bg-zinc-900 border-zinc-800 h-12 font-bold" 
                      />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Exit Time (Clock Out)</Label>
                      <Input 
                        type="time" 
                        value={checkOut}
                        onChange={e => setCheckOut(e.target.value)}
                        className="bg-zinc-900 border-zinc-800 h-12 font-bold" 
                      />
                   </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                   {['PRESENT', 'ABSENT', 'LEAVE'].map((s: string) => (
                     <button
                       key={s}
                       type="button"
                       onClick={() => setAttStatus(s)}
                       className={`h-12 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all ${
                         attStatus === s ? 'bg-emerald-500 border-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20' : 'bg-transparent border-zinc-800 text-zinc-600 hover:border-zinc-700'
                       }`}
                     >
                       {s}
                     </button>
                   ))}
                </div>
                <Button disabled={loading} className="w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 h-12 font-black uppercase tracking-widest text-[10px] text-white rounded-xl">
                   Synchronize Attendance
                </Button>
             </form>
          </TabsContent>

          <TabsContent value="payroll">
             <form onSubmit={handleSalarySubmit} className="space-y-6">
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Base Allocated Salary (₹)</Label>
                   <Input 
                     type="number" 
                     value={baseSalary}
                     onChange={e => setBaseSalary(e.target.value)}
                     className="bg-zinc-900 border-zinc-800 h-14 text-lg font-black italic tracking-tighter" 
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-red-500 flex items-center gap-2">
                         <TrendingDown size={12} /> Deductions (₹)
                      </Label>
                      <Input 
                        type="number" 
                        value={deductions}
                        onChange={e => setDeductions(e.target.value)}
                        className="bg-zinc-900 border-zinc-800 h-12 font-bold text-red-500" 
                      />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                        <TrendingUp size={12} /> Bonus/Incentive (₹)
                      </Label>
                      <Input 
                        type="number" 
                        value={bonus}
                        onChange={e => setBonus(e.target.value)}
                        className="bg-zinc-900 border-zinc-800 h-12 font-bold text-emerald-500" 
                      />
                   </div>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-900 flex items-center justify-between">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Predicted Net Payout</p>
                   <h4 className="text-2xl font-black text-white italic tracking-widest">₹{(parseFloat(baseSalary) + parseFloat(bonus) - parseFloat(deductions)).toLocaleString()}</h4>
                </div>
                <Button disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-[10px] h-14 rounded-2xl shadow-xl shadow-emerald-500/10">
                   Generate & Commit Payroll Node
                </Button>
             </form>
          </TabsContent>

          <TabsContent value="calendar">
             <div className="space-y-6">
                <div className="grid grid-cols-7 gap-1">
                   {[...Array(31)].map((_: any, i: number) => (
                     <div key={i} className={`aspect-square rounded-lg border border-zinc-900 flex flex-col items-center justify-center gap-1 ${i < 5 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-zinc-950'}`}>
                        <span className="text-[8px] font-bold text-zinc-700">{i + 1}</span>
                        {i < 5 && <CheckCircle2 size={10} className="text-emerald-500" />}
                     </div>
                   ))}
                </div>
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">
                   <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-emerald-500" /> Present </div>
                   <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-red-500" /> Absent </div>
                   <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-orange-500" /> Leave </div>
                </div>
             </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
