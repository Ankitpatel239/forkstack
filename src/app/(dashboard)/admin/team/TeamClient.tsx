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
  CheckCircle2,
  Store,
  Crown
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
  provisionUser,
  adminAssignUserToVendor,
  adminRemoveUserFromVendor,
  adminAssignOwnerToVendor,
  adminRemoveOwnerFromVendor
} from '@/app/actions/admin';

export function TeamClient({ initialUsers, vendors = [] }: { initialUsers: any[], vendors?: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [provisionModal, setProvisionModal] = useState(false);
  const [roleModal, setRoleModal] = useState<any>(null);
  const [resetModal, setResetModal] = useState<any>(null);
  const [vendorAssignModal, setVendorAssignModal] = useState<any>(null);
  const [ownerAssignModal, setOwnerAssignModal] = useState<any>(null);

  const [assignData, setAssignData] = useState({ vendorId: '', role: 'WAITER' });
  const [assignOwnerData, setAssignOwnerData] = useState({ vendorId: '' });

  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: 'TEAM' as any,
    password: ''
  });

  const filteredUsers = useMemo(() => {
    return users.filter((u: any) => 
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
        toast.success('User created successfully');
        setUsers([result.data, ...users]);
        setProvisionModal(false);
        setNewUserData({ name: '', email: '', role: 'TEAM', password: '' });
      } else {
        toast.error(result.error);
      }
    } catch (e) {
      toast.error('User creation failed');
    } finally {
      setLoading(null);
    }
  };

  const handleUpdateRole = async (userId: string, role: string) => {
    setLoading(userId);
    try {
      const result = await updateUserRole(userId, role as any);
      if (result.success) {
        toast.success('System role updated');
        setUsers(users.map((u: any) => u.id === userId ? { ...u, role } : u));
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

  const handleAssignToVendor = async () => {
    if (!vendorAssignModal || !assignData.vendorId || !assignData.role) return;
    setLoading('assign');
    try {
      const result = await adminAssignUserToVendor(vendorAssignModal.id, assignData.vendorId, assignData.role);
      if (result.success) {
        toast.success('User successfully assigned to vendor shop');
        
        // Optimistically update the vendor assignments in state
        const vendorObj = vendors.find(v => v.id === assignData.vendorId);
        setUsers(users.map((u: any) => {
          if (u.id === vendorAssignModal.id) {
            const newAssignment = {
              id: Date.now().toString(), // temp ID
              vendorId: assignData.vendorId,
              roleInVendor: assignData.role,
              vendor: { businessName: vendorObj?.businessName || 'Unknown Shop' }
            };
            return {
              ...u,
              vendorAssignments: [...(u.vendorAssignments || []), newAssignment]
            };
          }
          return u;
        }));

        setVendorAssignModal(null);
        setAssignData({ vendorId: '', role: 'WAITER' });
      } else {
        toast.error(result.error || 'Assignment failed');
      }
    } catch (e) {
      toast.error('Assignment request failed');
    } finally {
      setLoading(null);
    }
  };

  const handleRemoveFromVendor = async (userId: string, vendorId: string) => {
    if (!confirm('Are you sure you want to remove this user from this shop?')) return;
    setLoading(`remove-${userId}-${vendorId}`);
    try {
      const result = await adminRemoveUserFromVendor(userId, vendorId);
      if (result.success) {
        toast.success('User removed from vendor shop');
        setUsers(users.map((u: any) => {
          if (u.id === userId) {
            return {
              ...u,
              vendorAssignments: u.vendorAssignments.filter((a: any) => a.vendorId !== vendorId)
            };
          }
          return u;
        }));
      } else {
        toast.error(result.error || 'Failed to remove user');
      }
    } catch (e) {
      toast.error('Failed to remove user');
    } finally {
      setLoading(null);
    }
  };

  const handleAssignOwner = async () => {
    if (!ownerAssignModal || !assignOwnerData.vendorId) return;
    setLoading('assign-owner');
    try {
      const result = await adminAssignOwnerToVendor(ownerAssignModal.id, assignOwnerData.vendorId);
      if (result.success) {
        toast.success('User successfully assigned as vendor owner');
        const vendorObj = vendors.find(v => v.id === assignOwnerData.vendorId);
        setUsers(users.map((u: any) => {
          if (u.id === ownerAssignModal.id) {
            return {
              ...u,
              ownedVendor: { id: assignOwnerData.vendorId, businessName: vendorObj?.businessName || 'Unknown Shop' }
            };
          }
          return u;
        }));
        setOwnerAssignModal(null);
        setAssignOwnerData({ vendorId: '' });
      } else {
        toast.error(result.error || 'Assignment failed');
      }
    } catch (e) {
      toast.error('Assignment request failed');
    } finally {
      setLoading(null);
    }
  };

  const handleRemoveOwner = async (userId: string, vendorId: string) => {
    if (!confirm('Are you sure you want to remove this user as shop owner?')) return;
    setLoading(`remove-owner-${vendorId}`);
    try {
      const result = await adminRemoveOwnerFromVendor(vendorId);
      if (result.success) {
        toast.success('Ownership removed successfully');
        setUsers(users.map((u: any) => {
          if (u.id === userId) {
            return {
              ...u,
              ownedVendor: null
            };
          }
          return u;
        }));
      } else {
        toast.error(result.error || 'Failed to remove owner');
      }
    } catch (e) {
      toast.error('Failed to remove owner');
    } finally {
      setLoading(null);
    }
  };

  const handleResetPassword = async (userId: string) => {
    setLoading(userId);
    try {
      const result = await resetUserPassword(userId);
      if (result.success) {
        toast.success('Password reset successfully');
        setResetModal(null);
      } else {
        toast.error(result.error);
      }
    } catch (e) {
      toast.error('Password reset failed');
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    setLoading(userId);
    try {
      const result = await deleteUser(userId);
      if (result.success) {
        toast.success('User deleted');
        setUsers(users.filter((u: any) => u.id !== userId));
      } else {
        toast.error(result.error);
      }
    } catch (e) {
      toast.error('Deletion failed');
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-2 italic flex items-center gap-3 uppercase">
            <Fingerprint className="text-emerald-500" size={32} /> User Management
          </h1>
          <p className="text-zinc-500 font-medium font-sans uppercase text-[10px] tracking-[0.3em]">Manage system users, roles, and permissions.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button 
            onClick={() => setProvisionModal(true)}
            className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-black uppercase tracking-widest text-xs h-12 px-8 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
           >
             <UserPlus className="w-5 h-5 mr-1" /> Add New User
           </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
         {[
           { label: 'System Status', val: 'Online', icon: Activity, color: 'emerald' },
           { label: 'Total Users', val: users.length, icon: User, color: 'blue' },
           { label: 'Total Admins', val: users.filter((u: any) => u.role === 'ADMIN').length, icon: ShieldCheck, color: 'purple' },
           { label: 'Active Sessions', val: '24', icon: Lock, color: 'orange' }
         ].map((s: any, i: any) => (
           <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 group flex items-center justify-between relative overflow-hidden shadow-sm dark:shadow-2xl">
              <div className="absolute top-0 right-0 p-3 opacity-5 -mr-2 -mt-2 group-hover:opacity-10 transition-opacity">
                <s.icon size={60} />
              </div>
              <div className="flex-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{s.label}</p>
                 <h3 className={`text-2xl font-black italic tracking-tighter text-zinc-900 dark:text-white uppercase`}>{s.val}</h3>
              </div>
           </div>
         ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 h-14 w-full md:w-[500px] text-zinc-500 focus-within:border-emerald-500/50 transition-all shadow-sm dark:shadow-inner">
          <Search size={20} className="text-zinc-400" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or role..." 
            className="bg-transparent border-none focus:ring-0 text-sm flex-1 outline-none text-zinc-900 dark:text-white font-sans font-bold" 
          />
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm dark:shadow-xl px-8 h-14 text-zinc-500 dark:text-zinc-400 font-black uppercase tracking-widest text-[10px] hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700">
             <Filter className="w-4 h-4 mr-2" /> Filter Roles
           </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 shadow-sm dark:shadow-2xl border border-zinc-200 dark:border-zinc-800 rounded-[2rem] overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-950/50 text-[10px] uppercase font-black tracking-[0.2em] text-zinc-500 dark:text-zinc-700 border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              <th className="px-8 py-8 font-display">User Details</th>
              <th className="px-8 py-8">System Role</th>
              <th className="px-8 py-8">Assigned Shops</th>
              <th className="px-8 py-8">Joined Date</th>
              <th className="px-8 py-8 text-right italic font-sans lowercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center">
                   <div className="opacity-20 flex flex-col items-center gap-4 text-zinc-500">
                      <Search size={40} />
                      <p className="text-[10px] font-black uppercase tracking-widest">No users found</p>
                   </div>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user: any) => (
                <tr key={user.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/10 transition-colors group">
                  <td className="px-8 py-8">
                     <div className="flex items-center gap-5">
                        <div className="h-14 w-14 rounded-2xl bg-zinc-100 dark:bg-gradient-to-br dark:from-zinc-800 dark:to-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center relative shadow-sm dark:shadow-2xl overflow-hidden group-hover:scale-110 transition-all duration-300">
                           <span className="text-sm font-black text-zinc-700 dark:text-white italic">
                              {user.name.charAt(0).toUpperCase()}
                           </span>
                           <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="space-y-1.5">
                           <p className="text-base font-black text-zinc-900 dark:text-white italic tracking-tight uppercase leading-none">{user.name}</p>
                           <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 dark:text-zinc-600 uppercase tracking-widest leading-none">
                             <Mail size={12} className="text-emerald-500/30" /> {user.email}
                           </div>
                        </div>
                     </div>
                  </td>
                  <td className="px-8 py-8">
                     <Badge className={`px-4 py-1.5 border-none text-[10px] font-black uppercase tracking-widest italic rounded-lg ${
                        user.role === 'ADMIN' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-500' : 
                        user.role === 'SUPPORT' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-500' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-500'
                     }`}>
                        {user.role}
                     </Badge>
                  </td>
                  <td className="px-8 py-8">
                     {(user.vendorAssignments && user.vendorAssignments.length > 0) || user.ownedVendor ? (
                        <div className="flex flex-col gap-2">
                           {user.ownedVendor && (
                              <div className="flex flex-col gap-1 bg-emerald-50 dark:bg-emerald-950/20 p-2 rounded-lg border border-emerald-100 dark:border-emerald-800/50 relative group/assignment">
                                 <div className="flex justify-between items-start">
                                    <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 italic">{user.ownedVendor.businessName}</span>
                                    <button 
                                      onClick={() => handleRemoveOwner(user.id, user.ownedVendor.id)}
                                      disabled={loading === `remove-owner-${user.ownedVendor.id}`}
                                      className="text-red-400 hover:text-red-600 opacity-0 group-hover/assignment:opacity-100 transition-opacity"
                                      title="Remove from shop owner"
                                    >
                                      {loading === `remove-owner-${user.ownedVendor.id}` ? (
                                        <Loader2 className="animate-spin w-3 h-3" />
                                      ) : (
                                        <X className="w-3 h-3" />
                                      )}
                                    </button>
                                 </div>
                                 <div>
                                   <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-500 text-[8px] px-2 py-0 uppercase tracking-widest border-none">
                                      OWNER
                                   </Badge>
                                 </div>
                              </div>
                           )}
                           {user.vendorAssignments?.map((assignment: any) => (
                              <div key={assignment.id} className="flex flex-col gap-1 bg-zinc-50 dark:bg-zinc-950 p-2 rounded-lg border border-zinc-100 dark:border-zinc-800/50 relative group/assignment">
                                 <div className="flex justify-between items-start">
                                    <span className="text-xs font-black text-zinc-700 dark:text-zinc-300 italic">{assignment.vendor?.businessName || 'Unknown Shop'}</span>
                                    <button 
                                      onClick={() => handleRemoveFromVendor(user.id, assignment.vendorId)}
                                      disabled={loading === `remove-${user.id}-${assignment.vendorId}`}
                                      className="text-red-400 hover:text-red-600 opacity-0 group-hover/assignment:opacity-100 transition-opacity"
                                      title="Remove from shop"
                                    >
                                      {loading === `remove-${user.id}-${assignment.vendorId}` ? (
                                        <Loader2 className="animate-spin w-3 h-3" />
                                      ) : (
                                        <X className="w-3 h-3" />
                                      )}
                                    </button>
                                 </div>
                                 <div>
                                   <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-500 text-[8px] px-2 py-0 uppercase tracking-widest border-none">
                                      {assignment.roleInVendor}
                                   </Badge>
                                 </div>
                              </div>
                           ))}
                        </div>
                     ) : (
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-600 font-bold uppercase tracking-widest italic">No Vendor Roles</span>
                     )}
                  </td>
                  <td className="px-8 py-8">
                     <div className="flex items-center gap-2.5 text-zinc-500 dark:text-zinc-600 italic">
                        <Clock size={14} className="text-zinc-400 dark:text-zinc-800" />
                        <span className="text-[10px] font-black font-sans uppercase tracking-widest">Joined {new Date(user.createdAt || user.joinDate).toLocaleDateString()}</span>
                     </div>
                  </td>
                  <td className="px-8 py-8 text-right">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <button className="h-12 w-12 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl text-zinc-400 dark:text-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-all opacity-0 group-hover:opacity-100 border border-transparent dark:hover:border-zinc-700">
                              <MoreHorizontal size={20} />
                           </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white w-64 p-3 shadow-xl dark:shadow-2xl rounded-2xl">
                           <DropdownMenuLabel className="text-[10px] font-black uppercase text-zinc-500 dark:text-zinc-600 px-3 py-2 leading-none mb-2 tracking-widest">User Actions</DropdownMenuLabel>
                           <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800 mx-1 mb-2" />
                           <DropdownMenuItem 
                            onClick={() => setRoleModal(user)}
                            className="focus:bg-zinc-100 dark:focus:bg-zinc-800 px-3 py-2.5 rounded-xl cursor-pointer text-xs font-bold transition-all"
                           >
                              <UserCog className="w-4 h-4 mr-3 text-emerald-500" /> Change System Role
                           </DropdownMenuItem>
                           <DropdownMenuItem 
                            onClick={() => setVendorAssignModal(user)}
                            className="focus:bg-zinc-100 dark:focus:bg-zinc-800 px-3 py-2.5 rounded-xl cursor-pointer text-xs font-bold transition-all"
                           >
                              <Store className="w-4 h-4 mr-3 text-purple-500" /> Assign Vendor Role
                           </DropdownMenuItem>
                           <DropdownMenuItem 
                            onClick={() => setOwnerAssignModal(user)}
                            className="focus:bg-zinc-100 dark:focus:bg-zinc-800 px-3 py-2.5 rounded-xl cursor-pointer text-xs font-bold transition-all"
                           >
                              <Crown className="w-4 h-4 mr-3 text-amber-500" /> Make Shop Owner
                           </DropdownMenuItem>
                           <DropdownMenuItem 
                            onClick={() => setResetModal(user)}
                            className="focus:bg-zinc-100 dark:focus:bg-zinc-800 px-3 py-2.5 rounded-xl cursor-pointer text-xs font-bold transition-all"
                           >
                              <Key className="w-4 h-4 mr-3 text-blue-500" /> Reset Password
                           </DropdownMenuItem>
                           <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800 mx-1 my-2" />
                           <DropdownMenuItem 
                            onClick={() => handleDelete(user.id)}
                            className="focus:bg-red-50 dark:focus:bg-red-500/10 px-3 py-2.5 rounded-xl cursor-pointer text-red-600 dark:text-red-500 text-xs font-black transition-all"
                           >
                              <ShieldAlert className="w-4 h-4 mr-3" /> Delete User
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
        <DialogContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white w-[95vw] max-w-md sm:max-w-[500px] rounded-[3rem] p-0 overflow-hidden shadow-2xl">
           <div className="p-10 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/20 relative">
              <div className="absolute top-0 right-0 p-10 opacity-5">
                 <UserPlus size={100} />
              </div>
              <DialogHeader className="relative z-10">
                <div className="h-16 w-16 rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-500 mb-6 shadow-inner">
                   <UserPlus size={32} />
                </div>
                <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Create New User</DialogTitle>
                <DialogDescription className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                   Add a new user to the platform.
                </DialogDescription>
              </DialogHeader>
           </div>
           
           <div className="p-6 sm:p-10 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-600 ml-1">Full Name</Label>
                    <Input 
                      value={newUserData.name}
                      onChange={e => setNewUserData({...newUserData, name: e.target.value})}
                      placeholder="e.g. John Smith"
                      className="h-14 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 text-sm font-bold focus:border-emerald-500/50"
                    />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-600 ml-1">System Role</Label>
                    <Select 
                      value={newUserData.role}
                      onValueChange={val => setNewUserData({...newUserData, role: val})}
                    >
                       <SelectTrigger className="h-14 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 text-sm font-bold uppercase tracking-widest">
                          <SelectValue />
                       </SelectTrigger>
                       <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white">
                          <SelectItem value="TEAM">Team</SelectItem>
                          <SelectItem value="SUPPORT">Support</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>
              </div>
              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-600 ml-1">Email Address</Label>
                 <Input 
                   value={newUserData.email}
                   onChange={e => setNewUserData({...newUserData, email: e.target.value})}
                   placeholder="user@example.com"
                   className="h-14 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 text-sm font-bold focus:border-emerald-500/50"
                 />
              </div>
              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-600 ml-1">Password</Label>
                 <Input 
                   type="password"
                   value={newUserData.password}
                   onChange={e => setNewUserData({...newUserData, password: e.target.value})}
                   placeholder="Minimum 8 characters"
                   className="h-14 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 text-sm font-bold focus:border-emerald-500/50"
                 />
              </div>
           </div>

           <div className="p-6 sm:p-8 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
              <Button 
                variant="ghost" 
                onClick={() => setProvisionModal(false)}
                className="h-14 px-8 text-zinc-500 font-black uppercase tracking-widest text-[10px]"
              >
                 Cancel
              </Button>
              <Button 
                onClick={handleProvision}
                disabled={loading === 'provision' || !newUserData.name || !newUserData.email}
                className="h-14 px-10 bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-emerald-500/20"
              >
                 {loading === 'provision' ? <Loader2 size={18} className="animate-spin" /> : 'Create User'}
              </Button>
           </div>
        </DialogContent>
      </Dialog>

      {/* Role Update Dialog */}
      <Dialog open={!!roleModal} onOpenChange={setRoleModal}>
        <DialogContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white w-[95vw] max-w-md sm:max-w-[450px] rounded-[3rem] p-0 overflow-hidden">
           <div className="p-10 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/20">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Change System Role</DialogTitle>
                <DialogDescription className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                   Update the platform role for {roleModal?.name}
                </DialogDescription>
              </DialogHeader>
           </div>
           
           <div className="p-6 sm:p-10 space-y-6 text-center">
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                 {['TEAM', 'SUPPORT', 'ADMIN'].map((r) => (
                   <button 
                    key={r}
                    onClick={() => handleUpdateRole(roleModal.id, r)}
                    className={`flex-1 py-6 rounded-2xl border transition-all ${
                      roleModal?.role === r 
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-500 shadow-xl shadow-emerald-500/5' 
                      : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                   >
                      {loading === roleModal?.id ? <Loader2 className="animate-spin mx-auto" /> : (
                        <p className="text-[10px] font-black uppercase tracking-widest">{r}</p>
                      )}
                   </button>
                 ))}
              </div>
           </div>

           <div className="p-8 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex justify-center">
              <Button 
                variant="ghost" 
                onClick={() => setRoleModal(null)}
                className="h-12 px-8 text-zinc-500 dark:text-zinc-600 font-black uppercase tracking-widest text-[10px]"
              >
                 Close
              </Button>
           </div>
        </DialogContent>
      </Dialog>

      {/* Identity Reset Dialog */}
      <Dialog open={!!resetModal} onOpenChange={setResetModal}>
        <DialogContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white w-[95vw] max-w-md sm:max-w-[450px] rounded-[3rem] p-0 overflow-hidden text-center">
           <div className="p-10 space-y-6">
              <div className="h-20 w-20 rounded-[2rem] bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-500 mx-auto shadow-inner">
                 <Key size={40} />
              </div>
              <div className="space-y-2">
                 <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Reset Password?</DialogTitle>
                 <DialogDescription className="text-zinc-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
                    This will reset the password to a temporary default for {resetModal?.name}.
                 </DialogDescription>
              </div>
           </div>

           <div className="p-8 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-3">
              <Button 
                onClick={() => handleResetPassword(resetModal.id)}
                disabled={loading === resetModal?.id}
                className="h-14 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl"
              >
                 {loading === resetModal?.id ? <Loader2 className="animate-spin" /> : 'Reset Password'}
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setResetModal(null)}
                className="h-12 text-zinc-500 dark:text-zinc-600 font-black uppercase tracking-widest text-[10px]"
              >
                 Cancel
              </Button>
           </div>
        </DialogContent>
      </Dialog>

      {/* Vendor Assign Dialog */}
      <Dialog open={!!vendorAssignModal} onOpenChange={setVendorAssignModal}>
        <DialogContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white w-[95vw] max-w-md sm:max-w-[500px] rounded-[3rem] p-0 overflow-hidden shadow-2xl">
           <div className="p-10 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/20 relative">
              <div className="absolute top-0 right-0 p-10 opacity-5">
                 <Store size={100} />
              </div>
              <DialogHeader className="relative z-10">
                <div className="h-16 w-16 rounded-2xl bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-500 mb-6 shadow-inner">
                   <Store size={32} />
                </div>
                <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Assign Vendor Role</DialogTitle>
                <DialogDescription className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                   Connect {vendorAssignModal?.name} to a specific vendor shop and assign a shop role.
                </DialogDescription>
              </DialogHeader>
           </div>
           
           <div className="p-10 space-y-6">
              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-600 ml-1">Vendor Shop</Label>
                 <Select 
                   value={assignData.vendorId}
                   onValueChange={val => setAssignData({...assignData, vendorId: val})}
                 >
                    <SelectTrigger className="h-14 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 text-sm font-bold tracking-widest">
                       <SelectValue placeholder="Select a vendor shop" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white max-h-60">
                       {vendors?.map(v => (
                         <SelectItem key={v.id} value={v.id} className="focus:bg-zinc-100 dark:focus:bg-zinc-800 uppercase font-black text-[10px] italic tracking-widest">{v.businessName}</SelectItem>
                       ))}
                    </SelectContent>
                 </Select>
              </div>
              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-600 ml-1">Role in Vendor</Label>
                 <Input 
                   value={assignData.role}
                   onChange={e => setAssignData({...assignData, role: e.target.value})}
                   placeholder="e.g. WAITER, KITCHEN, MANAGER"
                   className="h-14 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 text-sm font-bold focus:border-purple-500/50 uppercase"
                 />
              </div>
           </div>

           <div className="p-6 sm:p-8 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
              <Button 
                variant="ghost" 
                onClick={() => setVendorAssignModal(null)}
                className="h-14 px-8 text-zinc-500 font-black uppercase tracking-widest text-[10px]"
              >
                 Cancel
              </Button>
              <Button 
                onClick={handleAssignToVendor}
                disabled={loading === 'assign' || !assignData.vendorId || !assignData.role}
                className="h-14 px-10 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-400 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-purple-500/20"
              >
                 {loading === 'assign' ? <Loader2 size={18} className="animate-spin" /> : 'Confirm Assignment'}
              </Button>
           </div>
        </DialogContent>
      </Dialog>

      {/* Owner Assign Dialog */}
      <Dialog open={!!ownerAssignModal} onOpenChange={setOwnerAssignModal}>
        <DialogContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white w-[95vw] max-w-md sm:max-w-[500px] rounded-[3rem] p-0 overflow-hidden shadow-2xl">
           <div className="p-10 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/20 relative">
              <div className="absolute top-0 right-0 p-10 opacity-5">
                 <Crown size={100} />
              </div>
              <DialogHeader className="relative z-10">
                <div className="h-16 w-16 rounded-2xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-500 mb-6 shadow-inner">
                   <Crown size={32} />
                </div>
                <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Assign Shop Owner</DialogTitle>
                <DialogDescription className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                   Make {ownerAssignModal?.name} the owner of a vendor shop. A shop can only have one owner.
                </DialogDescription>
              </DialogHeader>
           </div>
           
           <div className="p-10 space-y-6">
              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-600 ml-1">Vendor Shop</Label>
                 <Select 
                   value={assignOwnerData.vendorId}
                   onValueChange={val => setAssignOwnerData({...assignOwnerData, vendorId: val})}
                 >
                    <SelectTrigger className="h-14 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 text-sm font-bold tracking-widest">
                       <SelectValue placeholder="Select a vendor shop" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white max-h-60">
                       {vendors?.map(v => (
                         <SelectItem key={v.id} value={v.id} className="focus:bg-zinc-100 dark:focus:bg-zinc-800 uppercase font-black text-[10px] italic tracking-widest">{v.businessName}</SelectItem>
                       ))}
                    </SelectContent>
                 </Select>
              </div>
           </div>

           <div className="p-6 sm:p-8 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
              <Button 
                variant="ghost" 
                onClick={() => setOwnerAssignModal(null)}
                className="h-14 px-8 text-zinc-500 font-black uppercase tracking-widest text-[10px]"
              >
                 Cancel
              </Button>
              <Button 
                onClick={handleAssignOwner}
                disabled={loading === 'assign-owner' || !assignOwnerData.vendorId}
                className="h-14 px-10 bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-amber-500/20"
              >
                 {loading === 'assign-owner' ? <Loader2 size={18} className="animate-spin" /> : 'Confirm Ownership'}
              </Button>
           </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
