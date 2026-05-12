
'use client';

import { useState, useMemo } from 'react';
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
  Fingerprint,
  Loader2,
  Trash2,
  X,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  updateUserRole, 
  deleteUser, 
  resetUserPassword, 
  provisionUser 
} from '@/app/actions/admin';

export function TeamClient({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [provisionModal, setProvisionModal] = useState(false);
  const [roleModal, setRoleModal] = useState<any>(null);
  const [resetModal, setResetModal] = useState<any>(null);

  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: 'TEAM' as any,
    password: ''
  });

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const handleProvision = async () => {
    setLoading('provision');
    try {
      const result = await provisionUser(newUserData);
      if (result.success) {
        toast.success('Identity provisioned successfully');
        setUsers([result.data, ...users]);
        setProvisionModal(false);
        setNewUserData({ name: '', email: '', role: 'TEAM', password: '' });
      } else {
        toast.error(result.error);
      }
    } catch (e) {
      toast.error('Identity creation failed');
    } finally {
      setLoading(null);
    }
  };

  const handleUpdateRole = async (userId: string, role: string) => {
    setLoading(userId);
    try {
      const result = await updateUserRole(userId, role as any);
      if (result.success) {
        toast.success('Authorization tier updated');
        setUsers(users.map(u => u.id === userId ? { ...u, role } : u));
        setRoleModal(null);
      } else {
        toast.error(result.error);
      }
    } catch (e) {
      toast.error('Role update failed');
    } finally {
      setLoading(null);
    }
  };

  const handleResetPassword = async (userId: string) => {
    setLoading(userId);
    try {
      const result = await resetUserPassword(userId);
      if (result.success) {
        toast.success('Identity reset link generated and applied');
        setResetModal(null);
      } else {
        toast.error(result.error);
      }
    } catch (e) {
      toast.error('Identity reset failed');
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to terminate this identity? This action is irreversible.')) return;
    setLoading(userId);
    try {
      const result = await deleteUser(userId);
      if (result.success) {
        toast.success('Access terminated platform-wide');
        setUsers(users.filter(u => u.id !== userId));
      } else {
        toast.error(result.error);
      }
    } catch (e) {
      toast.error('Termination failed');
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 italic flex items-center gap-3 uppercase">
            <Fingerprint className="text-emerald-500" size={32} /> Universal Access Control
          </h1>
          <p className="text-zinc-500 font-medium font-sans uppercase text-[10px] tracking-[0.3em]">Manage permissions, roles, and administrative clearance platform-wide.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button 
            onClick={() => setProvisionModal(true)}
            className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-xs h-12 px-8 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
           >
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
           <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 group flex items-center justify-between relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-3 opacity-5 -mr-2 -mt-2 group-hover:opacity-10 transition-opacity">
                <s.icon size={60} />
              </div>
              <div className="flex-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">{s.label}</p>
                 <h3 className={`text-2xl font-black italic tracking-tighter text-white uppercase`}>{s.val}</h3>
              </div>
           </div>
         ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl px-6 h-14 w-full md:w-[500px] text-zinc-500 focus-within:border-emerald-500/50 transition-all shadow-inner">
          <Search size={20} className="text-zinc-600" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Identity, Email, or Authorization Tier..." 
            className="bg-transparent border-none focus:ring-0 text-sm flex-1 outline-none text-white font-sans font-bold" 
          />
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-2xl border-zinc-800 bg-zinc-900 shadow-xl px-8 h-14 text-zinc-400 font-black uppercase tracking-widest text-[10px] hover:text-white hover:border-zinc-700">
             <Filter className="w-4 h-4 mr-2" /> Tier Filtering
           </Button>
        </div>
      </div>

      <div className="bg-zinc-900 shadow-2xl border border-zinc-800 rounded-[2rem] overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-950/50 text-[10px] uppercase font-black tracking-[0.2em] text-zinc-700 border-b border-zinc-800">
            <tr>
              <th className="px-8 py-8 font-display">Identity Signature</th>
              <th className="px-8 py-8">Authorization Tier</th>
              <th className="px-8 py-8">Platform Lifecycle</th>
              <th className="px-8 py-8 text-right italic font-sans lowercase">Security operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center">
                   <div className="opacity-20 flex flex-col items-center gap-4">
                      <Search size={40} />
                      <p className="text-[10px] font-black uppercase tracking-widest">No matching identities found in registry</p>
                   </div>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user: any) => (
                <tr key={user.id} className="hover:bg-zinc-800/10 transition-colors group">
                  <td className="px-8 py-8">
                     <div className="flex items-center gap-5">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-800 flex items-center justify-center relative shadow-2xl overflow-hidden group-hover:scale-110 transition-all duration-300">
                           <span className="text-sm font-black text-white italic">
                              {user.name.charAt(0).toUpperCase()}
                           </span>
                           <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="space-y-1.5">
                           <p className="text-base font-black text-white italic tracking-tight uppercase leading-none">{user.name}</p>
                           <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">
                             <Mail size={12} className="text-emerald-500/30" /> {user.email}
                           </div>
                        </div>
                     </div>
                  </td>
                  <td className="px-8 py-8">
                     <Badge className={`px-4 py-1.5 border-none text-[10px] font-black uppercase tracking-widest italic rounded-lg ${
                        user.role === 'ADMIN' ? 'bg-emerald-500/10 text-emerald-500 shadow-lg shadow-emerald-500/5' : 
                        user.role === 'SUPPORT' ? 'bg-blue-500/10 text-blue-500' : 'bg-zinc-800/50 text-zinc-500'
                     }`}>
                        {user.role} CLEARANCE
                     </Badge>
                  </td>
                  <td className="px-8 py-8">
                     <div className="flex items-center gap-2.5 text-zinc-600 italic">
                        <Clock size={14} className="text-zinc-800" />
                        <span className="text-[10px] font-black font-sans uppercase tracking-widest">Registered {new Date(user.createdAt || user.joinDate).toLocaleDateString()}</span>
                     </div>
                  </td>
                  <td className="px-8 py-8 text-right">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <button className="h-12 w-12 flex items-center justify-center hover:bg-zinc-800 rounded-2xl text-zinc-700 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-xl border border-transparent hover:border-zinc-700">
                              <MoreHorizontal size={20} />
                           </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white w-64 p-3 shadow-2xl rounded-2xl">
                           <DropdownMenuLabel className="text-[10px] font-black uppercase text-zinc-600 px-3 py-2 leading-none mb-2 tracking-widest">Administrative Actions</DropdownMenuLabel>
                           <DropdownMenuSeparator className="bg-zinc-800 mx-1 mb-2" />
                           <DropdownMenuItem 
                            onClick={() => setRoleModal(user)}
                            className="focus:bg-zinc-800 px-3 py-2.5 rounded-xl cursor-pointer text-xs font-bold transition-all"
                           >
                              <UserCog className="w-4 h-4 mr-3 text-emerald-500" /> Modify Clearance Level
                           </DropdownMenuItem>
                           <DropdownMenuItem 
                            onClick={() => setResetModal(user)}
                            className="focus:bg-zinc-800 px-3 py-2.5 rounded-xl cursor-pointer text-xs font-bold transition-all"
                           >
                              <Key className="w-4 h-4 mr-3 text-blue-500" /> Force Identity Reset
                           </DropdownMenuItem>
                           <DropdownMenuSeparator className="bg-zinc-800 mx-1 my-2" />
                           <DropdownMenuItem 
                            onClick={() => handleDelete(user.id)}
                            className="focus:bg-red-500/10 px-3 py-2.5 rounded-xl cursor-pointer text-red-500 text-xs font-black transition-all"
                           >
                              <ShieldAlert className="w-4 h-4 mr-3" /> Terminate Access
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

      {/* Provision User Dialog */}
      <Dialog open={provisionModal} onOpenChange={setProvisionModal}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[500px] rounded-[3rem] p-0 overflow-hidden shadow-2xl">
           <div className="p-10 border-b border-zinc-800 bg-zinc-950/20 relative">
              <div className="absolute top-0 right-0 p-10 opacity-5">
                 <UserPlus size={100} />
              </div>
              <DialogHeader className="relative z-10">
                <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 shadow-inner">
                   <UserPlus size={32} />
                </div>
                <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Provision New Identity</DialogTitle>
                <DialogDescription className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                   Strategic entry creation for platform administrators.
                </DialogDescription>
              </DialogHeader>
           </div>
           
           <div className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Display Identity</Label>
                    <Input 
                      value={newUserData.name}
                      onChange={e => setNewUserData({...newUserData, name: e.target.value})}
                      placeholder="e.g. Neo Smith"
                      className="h-14 bg-zinc-950 border-zinc-800 rounded-2xl px-6 text-sm font-bold focus:border-emerald-500/50"
                    />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Authorization Tier</Label>
                    <Select 
                      value={newUserData.role}
                      onValueChange={val => setNewUserData({...newUserData, role: val})}
                    >
                       <SelectTrigger className="h-14 bg-zinc-950 border-zinc-800 rounded-2xl px-6 text-sm font-bold uppercase tracking-widest">
                          <SelectValue />
                       </SelectTrigger>
                       <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                          <SelectItem value="TEAM">Team</SelectItem>
                          <SelectItem value="SUPPORT">Support</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>
              </div>
              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Encryption Endpoint (Email)</Label>
                 <Input 
                   value={newUserData.email}
                   onChange={e => setNewUserData({...newUserData, email: e.target.value})}
                   placeholder="ops@forkstack.io"
                   className="h-14 bg-zinc-950 border-zinc-800 rounded-2xl px-6 text-sm font-bold focus:border-emerald-500/50"
                 />
              </div>
              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Initial Access Cipher (Password)</Label>
                 <Input 
                   type="password"
                   value={newUserData.password}
                   onChange={e => setNewUserData({...newUserData, password: e.target.value})}
                   placeholder="Minimum 8 characters"
                   className="h-14 bg-zinc-950 border-zinc-800 rounded-2xl px-6 text-sm font-bold focus:border-emerald-500/50"
                 />
              </div>
           </div>

           <div className="p-8 bg-zinc-950 border-t border-zinc-800 flex justify-end gap-4">
              <Button 
                variant="ghost" 
                onClick={() => setProvisionModal(false)}
                className="h-14 px-8 text-zinc-500 font-black uppercase tracking-widest text-[10px]"
              >
                 Abort
              </Button>
              <Button 
                onClick={handleProvision}
                disabled={loading === 'provision' || !newUserData.name || !newUserData.email}
                className="h-14 px-10 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-emerald-500/20"
              >
                 {loading === 'provision' ? <Loader2 size={18} className="animate-spin" /> : 'Authorize Identity'}
              </Button>
           </div>
        </DialogContent>
      </Dialog>

      {/* Role Update Dialog */}
      <Dialog open={!!roleModal} onOpenChange={setRoleModal}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[450px] rounded-[3rem] p-0 overflow-hidden">
           <div className="p-10 border-b border-zinc-800 bg-zinc-950/20">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Modify Clearance</DialogTitle>
                <DialogDescription className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                   Adjusting authorization tier for {roleModal?.name}
                </DialogDescription>
              </DialogHeader>
           </div>
           
           <div className="p-10 space-y-6 text-center">
              <div className="flex justify-center gap-4">
                 {['TEAM', 'SUPPORT', 'ADMIN'].map((r) => (
                   <button 
                    key={r}
                    onClick={() => handleUpdateRole(roleModal.id, r)}
                    className={`flex-1 py-6 rounded-2xl border transition-all ${
                      roleModal?.role === r 
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-xl shadow-emerald-500/5' 
                      : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                    }`}
                   >
                      {loading === roleModal?.id ? <Loader2 className="animate-spin mx-auto" /> : (
                        <p className="text-[10px] font-black uppercase tracking-widest">{r}</p>
                      )}
                   </button>
                 ))}
              </div>
           </div>

           <div className="p-8 bg-zinc-950 border-t border-zinc-800 flex justify-center">
              <Button 
                variant="ghost" 
                onClick={() => setRoleModal(null)}
                className="h-12 px-8 text-zinc-600 font-black uppercase tracking-widest text-[10px]"
              >
                 Close Node
              </Button>
           </div>
        </DialogContent>
      </Dialog>

      {/* Identity Reset Dialog */}
      <Dialog open={!!resetModal} onOpenChange={setResetModal}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[450px] rounded-[3rem] p-0 overflow-hidden text-center">
           <div className="p-10 space-y-6">
              <div className="h-20 w-20 rounded-[2rem] bg-blue-500/10 flex items-center justify-center text-blue-500 mx-auto shadow-inner">
                 <Key size={40} />
              </div>
              <div className="space-y-2">
                 <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Force Reset?</DialogTitle>
                 <DialogDescription className="text-zinc-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
                    This will invalidate the current cipher and apply a temporary security protocol for {resetModal?.name}.
                 </DialogDescription>
              </div>
           </div>

           <div className="p-8 bg-zinc-950 border-t border-zinc-800 flex flex-col gap-3">
              <Button 
                onClick={() => handleResetPassword(resetModal.id)}
                disabled={loading === resetModal?.id}
                className="h-14 bg-blue-500 hover:bg-blue-400 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl"
              >
                 {loading === resetModal?.id ? <Loader2 className="animate-spin" /> : 'Confirm Protocol Reset'}
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setResetModal(null)}
                className="h-12 text-zinc-600 font-black uppercase tracking-widest text-[10px]"
              >
                 Abort
              </Button>
           </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
