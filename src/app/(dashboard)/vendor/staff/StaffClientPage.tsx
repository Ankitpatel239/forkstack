
'use client';

import { useState } from 'react';
import { 
  Users, 
  Clock, 
  Banknote, 
  Calendar, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  Clock3,
  Download,
  UserPlus,
  UserCheck,
  UserMinus,
  Timer
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { StaffDetailsDialog } from '@/app/(dashboard)/vendor/staff/StaffDetailsDialog';
import { RecruitStaffDialog } from '@/app/(dashboard)/vendor/staff/RecruitStaffDialog';

export function StaffClientPage({ staff, attendance, salaries }: any) {
  const [activeTab, setActiveTab] = useState('roster');
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRecruitOpen, setIsRecruitOpen] = useState(false);

  const manageStaff = (member: any) => {
    setSelectedStaff(member);
    setIsDetailsOpen(true);
  };

  const stats = [
    { label: 'Active Force', val: staff.length, icon: Users, color: 'emerald', sub: 'Nodes Online' },
    { label: 'On-Duty Now', val: attendance.filter((a: any) => a.status === 'PRESENT' && !a.checkOut).length, icon: UserCheck, color: 'blue', sub: 'Clocked In' },
    { label: 'Absent/Leave', val: attendance.filter((a: any) => a.status === 'ABSENT' || a.status === 'LEAVE').length, icon: UserMinus, color: 'red', sub: 'Today' },
    { label: 'Avg Shift', val: '8.4h', icon: Timer, color: 'orange', sub: 'Daily average' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 italic uppercase">Workforce Command</h1>
          <p className="text-zinc-500 font-medium">Coordinate your team, payroll, and real-time attendance tracking.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setIsRecruitOpen(true)}
            className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-xs h-11 px-6 shadow-lg shadow-emerald-500/20"
          >
            <UserPlus className="w-5 h-5 mr-1" /> Recruit Staff
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 group relative overflow-hidden shadow-xl">
            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-${s.color}-500`}>
              <s.icon size={60} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">{s.label}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-white italic tracking-tighter">{s.val}</h3>
              <p className="text-[9px] font-bold text-zinc-500 uppercase">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="roster" className="space-y-8" onValueChange={setActiveTab}>
      <div className="flex items-center justify-between gap-4">
        <TabsList className="bg-zinc-900 border border-zinc-800 p-1 h-12 rounded-xl">
          <TabsTrigger value="roster" className="rounded-lg data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-500 font-bold px-6">
            <Users size={16} className="mr-2" /> Team Roster
          </TabsTrigger>
          <TabsTrigger value="attendance" className="rounded-lg data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-500 font-bold px-6">
            <Clock size={16} className="mr-2" /> Daily Log
          </TabsTrigger>
          <TabsTrigger value="payroll" className="rounded-lg data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-500 font-bold px-6">
            <Banknote size={16} className="mr-2" /> Payroll
          </TabsTrigger>
        </TabsList>

        <div className="hidden md:flex items-center gap-3 bg-zinc-950 border border-zinc-900 rounded-xl px-4 h-11 text-zinc-600 focus-within:border-emerald-500/50 transition-all">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search team members..." 
            className="bg-transparent border-none focus:ring-0 text-xs font-bold outline-none text-white w-48"
          />
        </div>
      </div>

      <TabsContent value="roster">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-950/50 text-[10px] uppercase font-black tracking-[0.2em] text-zinc-600 border-b border-zinc-800">
              <tr>
                <th className="px-8 py-6">Operator Details</th>
                <th className="px-8 py-6">Designation</th>
                <th className="px-8 py-6">Contact Node</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {staff.map((s: any) => (
                <tr key={s.id} onClick={() => manageStaff(s)} className="hover:bg-zinc-800/20 transition-all group cursor-pointer">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-black text-emerald-500">
                        {s.user.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-black text-white italic tracking-tight uppercase">{s.user.name}</p>
                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest leading-none">ID: {s.user.id.slice(-6).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 uppercase font-black text-zinc-400 text-[11px] tracking-tight italic">
                    {s.roleInVendor}
                  </td>
                  <td className="px-8 py-6 text-zinc-500 font-bold text-xs uppercase tracking-tight">
                    {s.user.email}
                  </td>
                  <td className="px-8 py-6">
                    <Badge variant="outline" className={`border-zinc-800 font-black uppercase text-[8px] tracking-[0.15em] px-2 py-0.5 rounded-full ${s.isActive ? 'text-emerald-500 bg-emerald-500/5' : 'text-red-500 bg-red-500/5'}`}>
                      {s.isActive ? 'Active' : 'Offline'}
                    </Badge>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-600 hover:text-white transition-all">
                        <MoreVertical size={18} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white w-48 p-2 rounded-xl shadow-2xl">
                        <DropdownMenuLabel className="text-[10px] font-black uppercase text-zinc-600 px-3 py-2">Profile Actions</DropdownMenuLabel>
                        <DropdownMenuItem className="focus:bg-zinc-800 cursor-pointer text-[11px] font-black uppercase tracking-widest py-3 px-3 rounded-lg"><Edit size={14} className="mr-3" /> Edit Profile</DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-zinc-800 cursor-pointer text-[11px] font-black uppercase tracking-widest py-3 px-3 rounded-lg"><Calendar size={14} className="mr-3" /> Leave Records</DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-zinc-800 my-1 mx-2" />
                        <DropdownMenuItem className="focus:bg-red-500/10 cursor-pointer text-red-500 text-[11px] font-black uppercase tracking-widest py-3 px-3 rounded-lg"><Trash2 size={14} className="mr-3" /> Suspend Access</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsContent>

      <TabsContent value="attendance">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
           <div className="p-8 border-b border-zinc-800 bg-zinc-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-white italic uppercase tracking-[0.1em]">Daily Attendance Matrix</h2>
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Real-time status of all active operators for {new Date().toDateString()}</p>
              </div>
              <Button variant="outline" className="border-zinc-800 bg-zinc-900 h-10 px-4 rounded-xl font-bold uppercase tracking-widest text-[9px] text-zinc-400">
                <Download size={14} className="mr-2" /> Export Log
              </Button>
           </div>
           <table className="w-full text-left text-sm">
            <thead className="bg-zinc-950/50 text-[10px] uppercase font-black tracking-[0.2em] text-zinc-600 border-b border-zinc-800">
              <tr>
                <th className="px-8 py-6">Team Member</th>
                <th className="px-8 py-6">Check In</th>
                <th className="px-8 py-6">Check Out</th>
                <th className="px-8 py-6">Hours</th>
                <th className="px-8 py-6 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {staff.map((s: any) => {
                const att = attendance.find((a: any) => a.userId === s.userId);
                return (
                  <tr key={s.id} onClick={() => manageStaff(s)} className="hover:bg-zinc-800/20 transition-all cursor-pointer">
                    <td className="px-8 py-6 font-black text-white italic text-[13px] uppercase tracking-tight">
                      {s.user.name}
                    </td>
                    <td className="px-8 py-6 font-bold text-emerald-500 font-sans">
                      {att?.checkIn ? new Date(att.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </td>
                    <td className="px-8 py-6 font-bold text-orange-500 font-sans">
                      {att?.checkOut ? new Date(att.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </td>
                    <td className="px-8 py-6">
                      <Badge className="bg-zinc-950 text-zinc-400 border border-zinc-800 rounded-lg px-3 py-1 font-black text-[10px]">
                        {att?.hoursWorked ? `${att.hoursWorked.toFixed(1)}h` : '0.0h'}
                      </Badge>
                    </td>
                    <td className="px-8 py-6 text-right">
                       {att?.status === 'PRESENT' ? (
                         <div className="flex items-center justify-end gap-2 text-emerald-500">
                            <span className="text-[9px] font-black uppercase tracking-widest">Verified</span>
                            <CheckCircle2 size={16} />
                         </div>
                       ) : (
                         <div className="flex items-center justify-end gap-2 text-zinc-700">
                            <span className="text-[9px] font-black uppercase tracking-widest">Awaiting Log</span>
                            <Clock3 size={16} />
                         </div>
                       )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </TabsContent>

      <TabsContent value="payroll">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
           <div className="p-8 border-b border-zinc-800 bg-zinc-950/20 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white italic uppercase tracking-[0.1em]">Payroll Ledger</h2>
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Financial distribution and deduction records</p>
              </div>
              <Button className="bg-orange-500 hover:bg-orange-400 text-zinc-950 font-black uppercase tracking-widest text-[9px] h-10 px-6 rounded-xl">
                 Generate Monthly Payroll
              </Button>
           </div>
           <table className="w-full text-left text-sm">
            <thead className="bg-zinc-950/50 text-[10px] uppercase font-black tracking-[0.2em] text-zinc-600 border-b border-zinc-800">
              <tr>
                <th className="px-8 py-6">Recipient</th>
                <th className="px-8 py-6">Cycle</th>
                <th className="px-8 py-6">Base Units</th>
                <th className="px-8 py-6">Deductions</th>
                <th className="px-8 py-6 text-right">Net Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {salaries.length === 0 ? (
                <tr>
                   <td colSpan={5} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-4 text-zinc-700">
                        <Banknote size={48} className="opacity-20" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">No payroll cycles registered in this node.</p>
                      </div>
                   </td>
                </tr>
              ) : (
                salaries.map((s: any) => (
                  <tr key={s.id} className="hover:bg-zinc-800/20 transition-all font-sans font-bold">
                    <td className="px-8 py-6 font-black text-white italic uppercase font-serif tracking-tight">{staff.find((st: any) => st.userId === s.userId)?.user.name}</td>
                    <td className="px-8 py-6 text-zinc-500 uppercase text-[10px]">{s.month}/{s.year}</td>
                    <td className="px-8 py-6 text-white text-[13px]">₹{s.baseSalary.toLocaleString()}</td>
                    <td className="px-8 py-6 text-red-500 text-[13px]">-₹{s.deductions.toLocaleString()}</td>
                    <td className="px-8 py-6 text-right font-black text-emerald-500 text-base italic">₹{s.netSalary.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </TabsContent>

      <StaffDetailsDialog 
        staffMember={selectedStaff} 
        open={isDetailsOpen} 
        onOpenChange={setIsDetailsOpen} 
      />

      <RecruitStaffDialog 
        open={isRecruitOpen}
        onOpenChange={setIsRecruitOpen}
      />
    </Tabs>
    </div>
  );
}
