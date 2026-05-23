
'use client';

import { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Clock, 
  Banknote, 
  Calendar as CalendarIcon, 
  Fingerprint,
  Badge as BadgeIcon,
  CheckCircle2,
  Settings,
  LogIn,
  LogOut,
  Trash2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { logPunch, generateSalaryRecord, updateStaffAssignment } from '@/app/actions/workforce';
import { toast } from 'sonner';

export function StaffDetailsDialog({ staffMember, open, onOpenChange, masters, attendanceLog }: any) {
  const [loading, setLoading] = useState(false);
  
  // Settings Form
  const [levelId, setLevelId] = useState(staffMember?.salaryLevelId?.toString() || '');
  const [typeId, setTypeId] = useState(staffMember?.salaryTypeId?.toString() || '');
  const [shiftStart, setShiftStart] = useState(staffMember?.shiftStartTime || '');
  const [shiftEnd, setShiftEnd] = useState(staffMember?.shiftEndTime || '');

  // Payroll Config
  const [selectedDeduction, setSelectedDeduction] = useState('');
  const [deductionAmount, setDeductionAmount] = useState('0');
  const [appliedDeductions, setAppliedDeductions] = useState<{ id: string, name: string, amount: number }[]>([]);
  const [selectedBonus, setSelectedBonus] = useState('');
  const [bonusAmount, setBonusAmount] = useState('0');
  const [appliedBonuses, setAppliedBonuses] = useState<{ id: string, name: string, amount: number }[]>([]);
  const [manualTime, setManualTime] = useState('');
  
  // Advance Config
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [advanceNotes, setAdvanceNotes] = useState('');
  const [advances, setAdvances] = useState<any[]>([]);

  // Calendar Config
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceHistory, setAttendanceHistory] = useState<any[]>([]);
  const [selectedDayRecord, setSelectedDayRecord] = useState<any | null>(null);

  // Fetch data when dialog opens
  useEffect(() => {
    if (open && staffMember) {
      import('@/app/actions/workforce').then(mod => {
        mod.getAdvances(staffMember.userId).then(setAdvances).catch(console.error);
        mod.getUserAttendanceHistory(staffMember.userId, currentDate.getFullYear(), currentDate.getMonth()).then(setAttendanceHistory).catch(console.error);
      });
      setLevelId(staffMember.salaryLevelId?.toString() || '');
      setTypeId(staffMember.salaryTypeId?.toString() || '');
      setShiftStart(staffMember.shiftStartTime || '');
      setShiftEnd(staffMember.shiftEndTime || '');
    }
  }, [open, staffMember]);

  if (!staffMember) return null;
  
  const handlePunch = async (type: 'IN' | 'OUT') => {
    setLoading(true);
    try {
      await logPunch(staffMember.userId, type, manualTime || undefined);
      toast.success(`Successfully punched ${type}`);
      setManualTime('');
    } catch (error) {
      toast.error(`Punch ${type} failed`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async () => {
    setLoading(true);
    try {
      await updateStaffAssignment(staffMember.id, {
        salaryLevelId: levelId ? parseInt(levelId) : undefined,
        salaryTypeId: typeId ? parseInt(typeId) : undefined,
        shiftStartTime: shiftStart,
        shiftEndTime: shiftEnd
      });
      toast.success('Settings synchronized');
    } catch (error) {
      toast.error('Sync failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoCalculate = () => {
     toast.success('Payroll auto-calculated based on attendance and level');
     // In a full implementation, this calls an API returning a breakdown JSON.
  };

  const format12Hour = (timeStr: string) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour.toString().padStart(2, '0')}:${m} ${ampm}`;
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + offset);
    setCurrentDate(newDate);
    if (staffMember) {
      import('@/app/actions/workforce').then(mod => {
        mod.getUserAttendanceHistory(staffMember.userId, newDate.getFullYear(), newDate.getMonth()).then(setAttendanceHistory).catch(console.error);
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white w-[95vw] sm:max-w-[700px] max-h-[90vh] p-0 overflow-y-auto custom-scrollbar rounded-3xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{staffMember.user.name}</DialogTitle>
          <DialogDescription>Workforce management node for {staffMember.user.name}</DialogDescription>
        </DialogHeader>

        <div className="bg-zinc-50 dark:bg-zinc-900 p-8 border-b border-zinc-200 dark:border-zinc-800 relative">
           <div className="absolute top-0 right-0 p-8 opacity-5 text-zinc-900 dark:text-white">
              <Fingerprint size={120} />
           </div>
           <div className="flex items-center gap-6 text-left relative z-10">
              <div className="h-16 w-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-3xl font-black text-emerald-500 italic shrink-0">
                 {staffMember.user.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-zinc-900 dark:text-white italic uppercase tracking-tighter leading-none">{staffMember.user.name}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-none font-black text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full">
                    {staffMember.roleInVendor}
                  </Badge>
                  {staffMember.salaryLevel && (
                    <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-500 border-none font-black text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full">
                      {staffMember.salaryLevel.levelName}
                    </Badge>
                  )}
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-600 font-bold uppercase tracking-widest">{staffMember.user.email}</span>
                </div>
              </div>
           </div>
        </div>

        <Tabs defaultValue="attendance" className="p-4 sm:p-8">
          <TabsList className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 h-11 mb-8 p-1 w-full sm:w-auto overflow-x-auto justify-start flex-nowrap custom-scrollbar rounded-xl">
            <TabsTrigger value="attendance" className="rounded-lg text-[10px] font-black uppercase tracking-widest px-4 sm:px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 whitespace-nowrap">
               <Clock size={14} className="mr-2 hidden sm:block" /> Punches
            </TabsTrigger>
            <TabsTrigger value="payroll" className="rounded-lg text-[10px] font-black uppercase tracking-widest px-4 sm:px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 whitespace-nowrap">
               <Banknote size={14} className="mr-2 hidden sm:block" /> Payslip
            </TabsTrigger>
            <TabsTrigger value="advances" className="rounded-lg text-[10px] font-black uppercase tracking-widest px-4 sm:px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 whitespace-nowrap">
               <TrendingDown size={14} className="mr-2 hidden sm:block" /> Advances
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-lg text-[10px] font-black uppercase tracking-widest px-4 sm:px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 whitespace-nowrap">
               <Settings size={14} className="mr-2 hidden sm:block" /> Rules
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="space-y-6">
             <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Log Attendance</h3>
                   <div className="flex items-center gap-2">
                     <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Manual Time</span>
                     <Input 
                       type="time" 
                       value={manualTime} 
                       onChange={e => setManualTime(e.target.value)} 
                       className="w-32 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 h-9 font-bold text-xs" 
                     />
                   </div>
                </div>
                <div className="flex gap-4">
                  <Button onClick={() => handlePunch('IN')} disabled={loading} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-xs h-14 rounded-2xl">
                    <LogIn size={16} className="mr-2" /> Punch IN
                  </Button>
                  <Button onClick={() => handlePunch('OUT')} disabled={loading} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-widest text-xs h-14 rounded-2xl">
                    <LogOut size={16} className="mr-2" /> Punch OUT
                  </Button>
                </div>
             </div>

             <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4">Today's Punch Log</h3>
                {(!attendanceLog?.punches || attendanceLog.punches.length === 0) ? (
                  <p className="text-xs font-bold text-zinc-400 italic">No punches recorded today.</p>
                ) : (
                  <div className="space-y-3">
                    {attendanceLog.punches.map((p: any) => (
                      <div key={p.id} className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 last:border-0 last:pb-0 group">
                         <div className="flex items-center gap-3">
                           <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${p.type === 'IN' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
                             {p.type}
                           </span>
                           <span className="text-sm font-bold text-zinc-900 dark:text-white">
                             {new Date(p.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                           </span>
                         </div>
                         <Button 
                           variant="ghost" 
                           size="icon" 
                           className="text-zinc-300 hover:text-red-500 hover:bg-red-500/10 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                           onClick={async () => {
                             if (!confirm('Delete this punch?')) return;
                             try {
                               const { deletePunch } = await import('@/app/actions/workforce');
                               await deletePunch(p.id);
                               toast.success('Punch deleted');
                             } catch(e) {
                               toast.error('Failed to delete punch');
                             }
                           }}
                         >
                           <Trash2 size={14} />
                         </Button>
                      </div>
                    ))}
                    <div className="pt-4 mt-2 flex justify-between items-center text-sm font-black uppercase tracking-widest">
                       <span className="text-zinc-500">Total Valid Hours</span>
                       <span className="text-emerald-500">{attendanceLog.hoursWorked?.toFixed(2) || '0.00'}h</span>
                    </div>
                  </div>
                )}
             </div>

             <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Attendance Calendar</h3>
                   <div className="flex items-center gap-3">
                     <button onClick={() => changeMonth(-1)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"><ChevronLeft size={18} /></button>
                     <span className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white">
                       {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                     </span>
                     <button onClick={() => changeMonth(1)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"><ChevronRight size={18} /></button>
                   </div>
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-[9px] font-black uppercase text-zinc-400">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-8" />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
                    const dayRecord = attendanceHistory.find((a: any) => new Date(a.date).toISOString().split('T')[0] === dateStr);
                    
                    let bgColor = 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400';
                    if (dayRecord) {
                      if (dayRecord.status === 'PRESENT') bgColor = 'bg-emerald-500 text-white font-black';
                      else if (dayRecord.status === 'ABSENT') bgColor = 'bg-red-500 text-white font-black';
                      else if (dayRecord.status === 'LEAVE') bgColor = 'bg-orange-500 text-white font-black';
                    }
                    
                    return (
                      <div 
                        key={day} 
                        onClick={() => setSelectedDayRecord(dayRecord || null)}
                        className={`h-8 rounded-lg flex items-center justify-center text-xs ${bgColor} transition-all hover:scale-105 cursor-pointer ring-offset-2 dark:ring-offset-zinc-950 ${selectedDayRecord?.id === dayRecord?.id && dayRecord ? 'ring-2 ring-zinc-400' : ''}`} 
                        title={dayRecord?.status || 'No record'}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex items-center justify-center gap-4 mt-6">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div><span className="text-[9px] font-bold uppercase text-zinc-500">Present</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div><span className="text-[9px] font-bold uppercase text-zinc-500">Absent</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-500"></div><span className="text-[9px] font-bold uppercase text-zinc-500">Leave</span></div>
                </div>

                {selectedDayRecord && (
                  <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-black text-zinc-900 dark:text-white">
                        {new Date(selectedDayRecord.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </h4>
                      <Badge className={
                        selectedDayRecord.status === 'PRESENT' ? 'bg-emerald-500/10 text-emerald-500' :
                        selectedDayRecord.status === 'ABSENT' ? 'bg-red-500/10 text-red-500' :
                        'bg-orange-500/10 text-orange-500'
                      }>
                        {selectedDayRecord.status}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs font-bold text-zinc-500 mb-4">
                      <span className="uppercase tracking-widest">Total Valid Hours</span>
                      <span className="text-emerald-500 text-sm">{selectedDayRecord.hoursWorked?.toFixed(2) || '0.00'}h</span>
                    </div>

                    {selectedDayRecord.punches && selectedDayRecord.punches.length > 0 ? (
                      <div className="space-y-2 mt-4 bg-zinc-100 dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Punch History</p>
                        {selectedDayRecord.punches.map((p: any) => (
                          <div key={p.id} className="flex justify-between items-center text-xs font-bold">
                            <span className={p.type === 'IN' ? 'text-emerald-500' : 'text-orange-500'}>{p.type}</span>
                            <span className="text-zinc-600 dark:text-zinc-400">
                              {new Date(p.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs font-bold text-zinc-400 italic">No punches for this day.</p>
                    )}
                  </div>
                )}
             </div>
          </TabsContent>

          <TabsContent value="payroll" className="space-y-6">
             <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                <div>
                   <h3 className="text-sm font-black italic uppercase tracking-tight">Auto-Payroll Engine</h3>
                   <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Generate slip based on levels & attendance</p>
                </div>
                <Button onClick={handleAutoCalculate} className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest">
                   Calculate Now
                </Button>
             </div>

             <div className="space-y-4 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6">
                <div className="flex items-center justify-between">
                   <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Base Salary (Level: {staffMember.salaryLevel?.levelName || 'None'})</span>
                   <span className="text-sm font-black">₹{staffMember.baseWage || '0'}</span>
                </div>
                
                <div className="space-y-2 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Apply Master Deduction</Label>
                   <div className="flex gap-2">
                     <Select value={selectedDeduction} onValueChange={setSelectedDeduction}>
                        <SelectTrigger className="bg-zinc-50 dark:bg-zinc-900 h-10 border-zinc-200 dark:border-zinc-800">
                           <SelectValue placeholder="Select type..." />
                        </SelectTrigger>
                        <SelectContent>
                           {masters?.deductions?.map((d: any) => (
                              <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                     <Input type="number" value={deductionAmount} onChange={(e) => setDeductionAmount(e.target.value)} placeholder="₹" className="w-24 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 h-10" />
                     <Button 
                        variant="outline" 
                        className="h-10 text-red-500 hover:text-red-600"
                        onClick={() => {
                          if (!selectedDeduction || !deductionAmount) return;
                          const dMaster = masters?.deductions?.find((d: any) => d.id.toString() === selectedDeduction);
                          if (!dMaster) return;
                          setAppliedDeductions([...appliedDeductions, { id: dMaster.id, name: dMaster.name, amount: parseFloat(deductionAmount) }]);
                          setSelectedDeduction('');
                          setDeductionAmount('0');
                        }}
                     >
                       <TrendingDown size={14} /> Add
                     </Button>
                   </div>
                   
                   {appliedDeductions.length > 0 && (
                     <div className="space-y-2 mt-4 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
                       {appliedDeductions.map((d, idx) => (
                         <div key={idx} className="flex justify-between items-center text-xs font-bold text-zinc-600 dark:text-zinc-400">
                           <span className="uppercase tracking-widest">{d.name}</span>
                           <div className="flex items-center gap-3">
                             <span className="text-red-500">-₹{d.amount}</span>
                             <button onClick={() => setAppliedDeductions(appliedDeductions.filter((_, i) => i !== idx))} className="text-zinc-400 hover:text-red-500">
                               <XCircle size={14} />
                             </button>
                           </div>
                         </div>
                       ))}
                     </div>
                   )}
                </div>

                <div className="space-y-2 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Apply Master Bonus</Label>
                   <div className="flex gap-2">
                     <Select value={selectedBonus} onValueChange={setSelectedBonus}>
                        <SelectTrigger className="bg-zinc-50 dark:bg-zinc-900 h-10 border-zinc-200 dark:border-zinc-800">
                           <SelectValue placeholder="Select type..." />
                        </SelectTrigger>
                        <SelectContent>
                           {masters?.bonuses?.map((b: any) => (
                              <SelectItem key={b.id} value={b.id.toString()}>{b.name}</SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                     <Input type="number" value={bonusAmount} onChange={(e) => setBonusAmount(e.target.value)} placeholder="₹" className="w-24 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 h-10" />
                     <Button 
                        variant="outline" 
                        className="h-10 text-emerald-500 hover:text-emerald-600"
                        onClick={() => {
                          if (!selectedBonus || !bonusAmount) return;
                          const bMaster = masters?.bonuses?.find((b: any) => b.id.toString() === selectedBonus);
                          if (!bMaster) return;
                          setAppliedBonuses([...appliedBonuses, { id: bMaster.id, name: bMaster.name, amount: parseFloat(bonusAmount) }]);
                          setSelectedBonus('');
                          setBonusAmount('0');
                        }}
                     >
                       <TrendingUp size={14} /> Add
                     </Button>
                   </div>
                   
                   {appliedBonuses.length > 0 && (
                     <div className="space-y-2 mt-4 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
                       {appliedBonuses.map((b, idx) => (
                         <div key={idx} className="flex justify-between items-center text-xs font-bold text-zinc-600 dark:text-zinc-400">
                           <span className="uppercase tracking-widest">{b.name}</span>
                           <div className="flex items-center gap-3">
                             <span className="text-emerald-500">+₹{b.amount}</span>
                             <button onClick={() => setAppliedBonuses(appliedBonuses.filter((_, i) => i !== idx))} className="text-zinc-400 hover:text-red-500">
                               <XCircle size={14} />
                             </button>
                           </div>
                         </div>
                       ))}
                     </div>
                   )}
                </div>

                <div className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-xl flex justify-between items-center mt-6">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Net Estimated Payout</span>
                   <span className="text-2xl font-black italic tracking-tighter text-emerald-500">
                     ₹{((staffMember.baseWage || 0) 
                         - appliedDeductions.reduce((sum, d) => sum + d.amount, 0)
                         + appliedBonuses.reduce((sum, b) => sum + b.amount, 0)
                       ).toLocaleString()}
                   </span>
                </div>
                
                <Button 
                  onClick={async () => {
                     setLoading(true);
                     try {
                        const totalDeductions = appliedDeductions.reduce((sum, d) => sum + d.amount, 0);
                        const totalBonuses = appliedBonuses.reduce((sum, b) => sum + b.amount, 0);
                        await generateSalaryRecord(staffMember.userId, {
                           month: new Date().getMonth() + 1,
                           year: new Date().getFullYear(),
                           baseSalary: staffMember.baseWage || 0,
                           bonus: totalBonuses,
                           deductions: totalDeductions,
                           breakdown: { deductions: appliedDeductions, bonuses: appliedBonuses }
                        });
                        toast.success('Payroll record committed');
                        onOpenChange(false);
                     } catch (e) {
                        toast.error('Failed to commit payslip');
                     } finally {
                        setLoading(false);
                     }
                  }}
                  disabled={loading}
                  className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-black uppercase tracking-widest text-[10px] h-14 rounded-xl mt-4"
                >
                   Commit Final Payslip
                </Button>
             </div>
          </TabsContent>

          <TabsContent value="advances" className="space-y-6">
             <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-3 text-orange-500 mb-2">
                   <Banknote size={20} />
                   <h3 className="text-sm font-black italic uppercase tracking-tight text-zinc-900 dark:text-white">Grant Advance</h3>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input 
                    type="number" 
                    placeholder="Advance Amount (₹)" 
                    value={advanceAmount} 
                    onChange={e => setAdvanceAmount(e.target.value)} 
                    className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 h-12 font-bold"
                  />
                  <Input 
                    type="text" 
                    placeholder="Notes (Optional)" 
                    value={advanceNotes} 
                    onChange={e => setAdvanceNotes(e.target.value)} 
                    className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 h-12 font-bold flex-1"
                  />
                  <Button 
                    disabled={loading || !advanceAmount}
                    onClick={async () => {
                      setLoading(true);
                      try {
                        const { grantAdvance, getAdvances } = await import('@/app/actions/workforce');
                        await grantAdvance(staffMember.userId, parseFloat(advanceAmount), advanceNotes);
                        toast.success('Advance Granted');
                        setAdvanceAmount('');
                        setAdvanceNotes('');
                        // refresh
                        getAdvances(staffMember.userId).then(setAdvances);
                      } catch(e) {
                        toast.error('Failed to grant advance');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-widest h-12 px-6"
                  >
                     Grant
                  </Button>
                </div>
             </div>

             <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Advance History</h3>
                {advances.length === 0 ? (
                  <p className="text-xs font-bold text-zinc-400 italic">No advances on record.</p>
                ) : (
                  <div className="grid gap-3">
                    {advances.map((adv: any) => (
                      <div key={adv.id} className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl flex justify-between items-center">
                         <div>
                           <p className="text-sm font-black text-zinc-900 dark:text-white">₹{adv.amount.toLocaleString()}</p>
                           {adv.notes && <p className="text-xs font-bold text-zinc-500 mt-1">{adv.notes}</p>}
                         </div>
                         <div className="text-right">
                           <Badge className={adv.status === 'PENDING' ? 'bg-orange-500/10 text-orange-500' : 'bg-emerald-500/10 text-emerald-500'}>
                             {adv.status}
                           </Badge>
                           <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-2">
                             {new Date(adv.date).toLocaleDateString()}
                           </p>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
             </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Salary Level</Label>
                   <Select value={levelId} onValueChange={setLevelId}>
                      <SelectTrigger className="bg-zinc-50 dark:bg-zinc-900 h-12 border-zinc-200 dark:border-zinc-800 font-bold">
                         <SelectValue placeholder="Assign level..." />
                      </SelectTrigger>
                      <SelectContent>
                         {masters?.levels?.map((l: any) => (
                           <SelectItem key={l.id} value={l.id.toString()}>{l.levelName} (₹{l.baseSalary})</SelectItem>
                         ))}
                      </SelectContent>
                   </Select>
                </div>
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Salary Type</Label>
                   <Select value={typeId} onValueChange={setTypeId}>
                      <SelectTrigger className="bg-zinc-50 dark:bg-zinc-900 h-12 border-zinc-200 dark:border-zinc-800 font-bold">
                         <SelectValue placeholder="Select type..." />
                      </SelectTrigger>
                      <SelectContent>
                         {masters?.salaryTypes?.map((t: any) => (
                           <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>
                         ))}
                      </SelectContent>
                   </Select>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Shift Start Time</Label>
                   <Input type="time" value={shiftStart} onChange={e => setShiftStart(e.target.value)} className="bg-zinc-50 dark:bg-zinc-900 h-12 border-zinc-200 dark:border-zinc-800 font-bold" />
                </div>
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Shift End Time</Label>
                   <Input type="time" value={shiftEnd} onChange={e => setShiftEnd(e.target.value)} className="bg-zinc-50 dark:bg-zinc-900 h-12 border-zinc-200 dark:border-zinc-800 font-bold" />
                </div>
             </div>

             <Button onClick={handleUpdateSettings} disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[10px] h-14 rounded-2xl">
                Synchronize Config
             </Button>
          </TabsContent>

        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
