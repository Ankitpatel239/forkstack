import { prisma } from '@/lib/db';
import { requireVendor } from '@/lib/vendor';
import { 
  Plus, 
  Search, 
  Users, 
  UserPlus, 
  Calendar, 
  Wallet, 
  MoreVertical,
  Mail,
  ShieldCheck,
  Zap,
  Clock,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default async function StaffPage() {
  const vendor = await requireVendor();
  
  const staff = await prisma.userVendorAssignment.findMany({
    where: { vendorId: vendor.id },
    include: {
      user: {
        include: {
          attendance: {
            orderBy: { date: 'desc' },
            take: 1
          }
        }
      }
    }
  });

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 font-display">Workforce Command</h1>
          <p className="text-zinc-500 font-medium">Coordinate your team, payroll, and real-time attendance tracking.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-xs h-11 px-6 shadow-lg shadow-emerald-500/20 transition-all">
             <UserPlus className="w-5 h-5 mr-1" /> Hire Staff
           </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
         {[
           { label: 'Total active', val: staff.length, icon: Users, color: 'emerald' },
           { label: 'On Shift Now', val: '8', icon: Clock, color: 'blue' },
           { label: 'Payroll (Mo)', val: '$4,280', icon: Wallet, color: 'orange' },
           { label: 'Retention', val: '98%', icon: Zap, color: 'purple' },
         ].map((s, i) => (
           <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 group flex items-center justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-5 -mr-2 -mt-2 group-hover:opacity-10 transition-opacity">
                <s.icon size={60} />
              </div>
              <div className="flex-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{s.label}</p>
                 <h3 className="text-2xl font-black text-white italic tracking-tighter">{s.val}</h3>
              </div>
              <div className={`h-10 w-10 rounded-xl bg-${s.color}-500/10 flex items-center justify-center text-${s.color}-500 shrink-0`}>
                 <s.icon size={18} />
              </div>
           </div>
         ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 h-12 w-full md:w-96 text-zinc-500 focus-within:border-emerald-500/50 transition-colors">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search team members..." 
            className="bg-transparent border-none focus:ring-0 text-sm flex-1 outline-none text-white" 
          />
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-950/50 text-[10px] uppercase font-black tracking-[0.2em] text-zinc-600 border-b border-zinc-900">
              <tr>
                <th className="px-6 py-5">Team Member</th>
                <th className="px-6 py-5 border-l border-zinc-900/50">Core Role</th>
                <th className="px-6 py-5">Daily Status</th>
                <th className="px-6 py-5 font-center">Commitment</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/50">
              {staff.length === 0 ? (
                <tr>
                   <td colSpan={5} className="py-32 text-center text-zinc-600">
                      <div className="flex flex-col items-center gap-4">
                        <Users size={48} className="opacity-10" />
                        <p className="font-bold text-zinc-400 italic">No workforce assigned to this vendor.</p>
                        <Button className="rounded-xl border-zinc-800 bg-zinc-900/50 h-10 px-6 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800">Initiate Recruiting</Button>
                      </div>
                   </td>
                </tr>
              ) : (
                staff.map((assignment) => (
                  <tr key={assignment.id} className="hover:bg-zinc-800/20 transition-colors group">
                    <td className="px-6 py-6 border-l-4 border-l-transparent group-hover:border-l-emerald-500 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-400 font-black text-xs shadow-inner">
                             {assignment.user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="space-y-0.5">
                             <p className="font-bold text-white tracking-tight">{assignment.user.name}</p>
                             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-zinc-600">
                               <Mail size={10} className="text-blue-500/50" /> {assignment.user.email}
                             </div>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-6 border-l border-zinc-900/50">
                       < Badge variant="outline" className="border-emerald-500/20 text-emerald-500 bg-emerald-500/5 px-3 h-6 text-[9px] font-black uppercase tracking-widest italic">
                         {assignment.roleInVendor}
                       </ Badge>
                    </td>
                    <td className="px-6 py-6">
                       <div className="flex items-center gap-2">
                          <div className={`h-2.5 w-2.5 rounded-full ${assignment.user.attendance[0]?.status === 'PRESENT' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-zinc-800'}`} />
                          <span className={`text-[11px] font-black uppercase tracking-tighter ${assignment.user.attendance[0]?.status === 'PRESENT' ? 'text-emerald-500' : 'text-zinc-600'}`}>
                            {assignment.user.attendance[0]?.status || 'OFF-SHIFT'}
                          </span>
                       </div>
                    </td>
                    <td className="px-6 py-6 text-zinc-500 font-bold text-xs uppercase tracking-tighter italic">
                       {new Date(assignment.assignedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-6 text-right">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                             <button className="p-2.5 hover:bg-zinc-800 rounded-xl text-zinc-600 hover:text-white transition-all">
                                <MoreVertical size={18} />
                             </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white w-52 p-2">
                             <DropdownMenuLabel className="text-[10px] font-black uppercase text-zinc-600 px-2 py-1.5">Staff Management</DropdownMenuLabel>
                             <DropdownMenuItem className="focus:bg-zinc-800 cursor-pointer text-xs font-bold py-2 px-2 rounded-lg">
                                < ShieldCheck className="w-4 h-4 mr-2 text-emerald-500" /> Adjust Permissions
                             </DropdownMenuItem>
                             <DropdownMenuItem className="focus:bg-zinc-800 cursor-pointer text-xs font-bold py-2 px-2 rounded-lg">
                                < Clock className="w-4 h-4 mr-2 text-blue-500" /> Attendance History
                             </DropdownMenuItem>
                             <DropdownMenuItem className="focus:bg-zinc-800 cursor-pointer text-xs font-bold py-2 px-2 rounded-lg">
                                < Wallet className="w-4 h-4 mr-2 text-orange-500" /> Payroll Details
                             </DropdownMenuItem>
                             <DropdownMenuSeparator className="bg-zinc-800 my-1" />
                             <DropdownMenuItem className="focus:bg-red-500/10 cursor-pointer text-red-500 text-xs font-bold py-2 px-2 rounded-lg">
                                < Settings className="w-4 h-4 mr-2" /> Revoke Access
                             </DropdownMenuItem>
                          </DropdownMenuContent>
                       </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
