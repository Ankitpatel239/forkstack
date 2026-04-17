import { prisma } from '@/lib/db';
import { 
  ShieldCheck, 
  UserPlus, 
  Search, 
  MoreHorizontal, 
  Key, 
  Mail, 
  ShieldAlert, 
  Activity,
  UserCog,
  Lock,
  Clock,
  Filter,
  User,

  Fingerprint
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

export default async function AdminAccessPage() {
  // Fetch ALL users for full access control
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100
  });

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 italic flex items-center gap-3">
            <Fingerprint className="text-emerald-500" size={32} /> Universal Access Control
          </h1>
          <p className="text-zinc-500 font-medium">Manage permissions, roles, and administrative clearance platform-wide.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-xs h-12 px-8 shadow-xl shadow-emerald-500/20">
             <UserPlus className="w-5 h-5 mr-1" /> Provision User
           </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
         {[
           { label: 'Cloud Identity Node', val: 'Operational', icon: Activity, color: 'emerald' },
           { label: 'Global Registry', val: users.length, icon: User, color: 'blue' },
           { label: 'Admin clearance', val: users.filter((u: any) => u.role === 'ADMIN').length, icon: ShieldCheck, color: 'purple' },
           { label: 'Active Sessions', val: '24', icon: Lock, color: 'orange' }
         ].map((s: any, i: any) => (
           <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 group flex items-center justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-5 -mr-2 -mt-2 group-hover:opacity-10 transition-opacity">
                <s.icon size={60} />
              </div>
              <div className="flex-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">{s.label}</p>
                 <h3 className={`text-2xl font-black italic tracking-tighter text-white`}>{s.val}</h3>
              </div>
           </div>
         ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 h-12 w-full md:w-96 text-zinc-500 focus-within:border-emerald-500/50 transition-colors">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search by ID, Email, Name or Role..." 
            className="bg-transparent border-none focus:ring-0 text-sm flex-1 outline-none text-white font-sans" 
          />
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-xl border-zinc-800 bg-zinc-900 shadow-lg px-6 h-12 text-zinc-400 font-black uppercase tracking-widest text-[10px]">
             <Filter className="w-4 h-4 mr-2" /> Global Role Filter
           </Button>
        </div>
      </div>

      <div className="bg-zinc-900 shadow-2xl border border-zinc-800 rounded-3xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-950/50 text-[10px] uppercase font-black tracking-[0.2em] text-zinc-700 border-b border-zinc-800">
            <tr>
              <th className="px-6 py-6 font-display">Identity</th>
              <th className="px-6 py-6">Authorization Tier</th>
              <th className="px-6 py-6">Platform Lifecycle</th>
              <th className="px-6 py-6 text-right italic font-sans lowercase">Security operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {users.map((user: any) => (
              <tr key={user.id} className="hover:bg-zinc-800/10 transition-colors group">
                <td className="px-6 py-6">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-800 flex items-center justify-center relative shadow-xl overflow-hidden group-hover:scale-105 transition-all">
                         <span className="text-xs font-black text-white italic">
                            {user.name.charAt(0).toUpperCase()}
                         </span>
                         <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="space-y-1">
                         <p className="text-sm font-black text-white italic tracking-tight">{user.name}</p>
                         <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">
                           <Mail size={10} className="text-emerald-500/50" /> {user.email}
                         </div>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-6">
                   <Badge className={`px-3 py-1 border-none text-[10px] font-black uppercase tracking-widest italic ${
                      user.role === 'ADMIN' ? 'bg-emerald-500/10 text-emerald-500' : 
                      user.role === 'SUPPORT' ? 'bg-blue-500/10 text-blue-500' : 'bg-zinc-800/50 text-zinc-500'
                   }`}>
                      {user.role} PERMISSIONS
                   </Badge>
                </td>
                <td className="px-6 py-6">
                   <div className="flex items-center gap-2 text-zinc-600 italic">
                      <Clock size={12} className="text-zinc-800" />
                      <span className="text-[10px] font-bold font-sans uppercase tracking-tighter">Registered {new Date(user.joinDate).toLocaleDateString()}</span>
                   </div>
                </td>
                <td className="px-6 py-6 text-right">
                   <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                         <button className="h-10 w-10 flex items-center justify-center hover:bg-zinc-800 rounded-xl text-zinc-700 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                            <MoreHorizontal size={18} />
                         </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white w-56 p-2 shadow-2xl">
                         <DropdownMenuLabel className="text-[10px] font-black uppercase text-zinc-600 px-2 py-1.5 leading-none mb-1">Administrative Actions</DropdownMenuLabel>
                         <DropdownMenuSeparator className="bg-zinc-800" />
                         <DropdownMenuItem className="focus:bg-zinc-800 px-2 py-2 rounded-lg cursor-pointer text-xs font-bold">
                            <UserCog className="w-4 h-4 mr-2 text-emerald-500" /> Elevate/Demote Role
                         </DropdownMenuItem>
                         <DropdownMenuItem className="focus:bg-zinc-800 px-2 py-2 rounded-lg cursor-pointer text-xs font-bold">
                            <Key className="w-4 h-4 mr-2" /> Force Reset Identity
                         </DropdownMenuItem>
                         <DropdownMenuSeparator className="bg-zinc-800" />
                         <DropdownMenuItem className="focus:bg-red-500/10 px-2 py-2 rounded-lg cursor-pointer text-red-500 text-xs font-bold font-sans">
                            <ShieldAlert className="w-4 h-4 mr-2" /> Terminate Access
                         </DropdownMenuItem>
                      </DropdownMenuContent>
                   </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
