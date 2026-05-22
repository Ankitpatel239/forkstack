'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
   Store,
   User,
   Mail,
   MapPin,
   BadgeCheck,
   ShieldAlert,
   MoreVertical,
   Search,
   ArrowUpRight,
   Filter,
   Plus,
   Zap,
   Calendar,
   Loader2,
   ChevronRight,
   Pencil,
   Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VendorFormModal } from '@/components/admin/VendorForms';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { updateVendorSubscription, suspendVendor, deleteVendor } from '@/app/actions/admin-vendors';

export function VendorsClient({ initialVendors, availablePlans }: { initialVendors: any[], availablePlans: any[] }) {
   const router = useRouter();
   const [vendors, setVendors] = useState(initialVendors);
   const [search, setSearch] = useState('');
   const [loading, setLoading] = useState<string | null>(null);
   const [selectedVendor, setSelectedVendor] = useState<any>(null);
   const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
   
   // Add/Edit Modals state
   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
   const [editingVendor, setEditingVendor] = useState<any>(null);

   // Delete modal state
   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const [vendorToDelete, setVendorToDelete] = useState<any>(null);

   const [planForm, setPlanForm] = useState({
      plan: 'BASIC',
      status: 'ACTIVE',
      expiryDate: ''
   });

   const filteredVendors = vendors.filter(v =>
      v.businessName.toLowerCase().includes(search.toLowerCase()) ||
      v.tenantSlug.toLowerCase().includes(search.toLowerCase()) ||
      v.owner?.name?.toLowerCase().includes(search.toLowerCase())
   );

   const handleOpenPlanModal = (vendor: any) => {
      setSelectedVendor(vendor);
      setPlanForm({
         plan: vendor.subscriptionPlan,
         status: vendor.subscriptionStatus,
         expiryDate: new Date(vendor.subscriptionEnd).toISOString().split('T')[0]
      });
      setIsPlanModalOpen(true);
   };

   const handleOpenEditModal = (vendor: any) => {
      setEditingVendor(vendor);
      setIsEditModalOpen(true);
   };

   const handleOpenDeleteModal = (vendor: any) => {
      setVendorToDelete(vendor);
      setIsDeleteModalOpen(true);
   };

   const handleUpdatePlan = async () => {
      setLoading(selectedVendor.id);
      try {
         const result = await updateVendorSubscription(selectedVendor.id, {
            plan: planForm.plan,
            status: planForm.status,
            expiryDate: new Date(planForm.expiryDate)
         });

         if (result.success) {
            toast.success('Partner subscription synchronized');
            setVendors(vendors.map(v => v.id === selectedVendor.id ? {
               ...v,
               subscriptionPlan: planForm.plan,
               subscriptionStatus: planForm.status,
               subscriptionEnd: new Date(planForm.expiryDate)
            } : v));
            setIsPlanModalOpen(false);
         } else {
            toast.error(result.error);
         }
      } catch (e) {
         toast.error('Fatal synchronization error');
      } finally {
         setLoading(null);
      }
   };

   const handleToggleSuspend = async (vendor: any) => {
      const isSuspended = vendor.subscriptionStatus === 'SUSPENDED';
      setLoading(vendor.id);
      try {
         const result = await suspendVendor(vendor.id, !isSuspended);
         if (result.success) {
            toast.success(isSuspended ? 'Account activated successfully' : 'Account suspended successfully');
            setVendors(vendors.map(v => v.id === vendor.id ? {
               ...v,
               subscriptionStatus: isSuspended ? 'ACTIVE' : 'SUSPENDED'
            } : v));
         } else {
            toast.error(result.error || 'Failed to toggle account suspension');
         }
      } catch (error) {
         toast.error('Fatal network error');
      } finally {
         setLoading(null);
      }
   };

   const handleDeleteVendor = async () => {
      if (!vendorToDelete) return;
      setLoading(vendorToDelete.id);
      try {
         const result = await deleteVendor(vendorToDelete.id);
         if (result.success) {
            toast.success('Vendor successfully deleted');
            setVendors(vendors.filter(v => v.id !== vendorToDelete.id));
            setIsDeleteModalOpen(false);
            setVendorToDelete(null);
         } else {
            toast.error(result.error || 'Failed to delete vendor account');
         }
      } catch (error) {
         toast.error('Fatal error during deletion');
      } finally {
         setLoading(null);
      }
   };

   return (
      <div className="space-y-10 pb-20">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
               <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 italic uppercase">Vendors List</h1>
               <p className="text-zinc-500 font-medium font-sans uppercase text-[10px] tracking-[0.3em]">Manage all vendor accounts on the platform.</p>
            </div>
            <div className="flex items-center gap-3">
               <Button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-[10px] h-12 px-8 shadow-xl shadow-emerald-500/20"
               >
                  <Plus className="w-5 h-5 mr-1" /> Add New Vendor
               </Button>
            </div>
         </div>

         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl px-5 h-14 w-full md:w-[450px] text-zinc-500 focus-within:border-emerald-500/50 transition-all shadow-xl">
               <Search size={20} />
               <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by Brand, Owner or Slug..."
                  className="bg-transparent border-none focus:ring-0 text-xs flex-1 outline-none text-white font-bold tracking-widest uppercase"
               />
            </div>
         </div>

         <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl overflow-x-auto">
            <table className="w-full text-left text-sm">
               <thead className="bg-zinc-950/50 text-[10px] uppercase font-black tracking-[0.2em] text-zinc-600 border-b border-zinc-900">
                  <tr>
                     <th className="px-8 py-8">Vendor Info</th>
                     <th className="px-8 py-8">Subscription</th>
                     <th className="px-8 py-8">Activity</th>
                     <th className="px-8 py-8">Status</th>
                     <th className="px-8 py-8 text-right italic font-black">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-zinc-900">
                  {filteredVendors.length === 0 ? (
                     <tr>
                        <td colSpan={5} className="py-32 text-center">
                           <div className="flex flex-col items-center gap-6 text-zinc-800">
                              <Store size={64} className="opacity-10" />
                              <p className="font-black uppercase tracking-[0.4em] text-xs">No vendors found</p>
                           </div>
                        </td>
                     </tr>
                  ) : (
                     filteredVendors.map((vendor: any) => (
                        <tr key={vendor.id} className="hover:bg-zinc-800/20 transition-all group">
                           <td className="px-8 py-8">
                              <div className="flex items-center gap-6">
                                 <div className="h-16 w-16 rounded-3xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform overflow-hidden relative">
                                    {vendor.logoUrl ? (
                                       <img src={vendor.logoUrl} className="w-full h-full object-cover" />
                                    ) : (
                                       <Store size={28} className="text-zinc-700" />
                                    )}
                                    <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors" />
                                 </div>
                                 <div className="space-y-1.5">
                                    <div className="flex items-center gap-3">
                                       <p className="text-lg font-black text-white italic tracking-tighter uppercase">{vendor.businessName}</p>
                                       <Badge className="bg-zinc-950 text-zinc-600 border-zinc-800 text-[8px] px-2 py-0">Slug: {vendor.tenantSlug}</Badge>
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2 italic">
                                       <User size={12} className="text-emerald-500/50" /> {vendor.owner?.name || 'Unassigned'} ({vendor.businessEmail})
                                    </p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-8">
                              <div className="space-y-2">
                                 <Badge className={`px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] border-none italic rounded-lg ${vendor.subscriptionPlan === 'VENDOR_ALL_ACCESS' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20 animate-pulse' :
                                       vendor.subscriptionPlan === 'ENTERPRISE' ? 'bg-purple-500/10 text-purple-500' :
                                       vendor.subscriptionPlan === 'PRO' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'
                                    }`}>
                                    {vendor.subscriptionPlan === 'VENDOR_ALL_ACCESS' ? 'ALL ACCESS' : vendor.subscriptionPlan} Plan
                                 </Badge>
                                 <p suppressHydrationWarning className="text-[10px] font-black text-zinc-700 uppercase tracking-tighter italic flex items-center gap-2">
                                    <Calendar size={12} /> Expiry: {new Date(vendor.subscriptionEnd).toLocaleDateString()}
                                 </p>
                              </div>
                           </td>
                           <td className="px-8 py-8">
                              <div className="flex items-center gap-6">
                                 <div className="text-center group/stat shrink-0">
                                    <p className="text-lg font-black text-white italic leading-none group-hover/stat:text-emerald-500 transition-colors">{vendor._count.menuItems}</p>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-zinc-700 mt-2 italic">Items</p>
                                 </div>
                                 <div className="h-8 w-[1px] bg-zinc-800 shrink-0" />
                                 <div className="text-center group/stat shrink-0">
                                    <p className="text-lg font-black text-white italic leading-none group-hover/stat:text-emerald-500 transition-colors">{vendor._count.orders}</p>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-zinc-700 mt-2 italic">Orders</p>
                                 </div>
                                 <div className="h-8 w-[1px] bg-zinc-800 shrink-0" />
                                 <div className="text-center group/stat shrink-0">
                                    <p className="text-lg font-black text-white italic leading-none group-hover/stat:text-emerald-500 transition-colors">{vendor._count.staff || 0}</p>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-zinc-700 mt-2 italic">Staff</p>
                                 </div>
                                 <div className="h-8 w-[1px] bg-zinc-800 shrink-0" />
                                 <div className="text-center group/stat shrink-0">
                                    <p className="text-lg font-black text-white italic leading-none group-hover/stat:text-emerald-500 transition-colors">{vendor._count.tables || 0}</p>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-zinc-700 mt-2 italic">Tables</p>
                                 </div>
                                 <div className="h-8 w-[1px] bg-zinc-800 shrink-0" />
                                 <div className="text-center group/stat shrink-0">
                                    <p className="text-lg font-black text-white italic leading-none group-hover/stat:text-emerald-500 transition-colors">{vendor._count.tiffin || 0}</p>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-zinc-700 mt-2 italic">Tiffin</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-8">
                              <div className="flex items-center gap-3">
                                 <div className={`h-2.5 w-2.5 rounded-full ${vendor.subscriptionStatus === 'ACTIVE' ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`} />
                                 <span className={`text-[11px] font-black uppercase tracking-widest italic ${vendor.subscriptionStatus === 'ACTIVE' ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {vendor.subscriptionStatus}
                                 </span>
                              </div>
                           </td>
                           <td className="px-8 py-8 text-right">
                              <DropdownMenu>
                                 <DropdownMenuTrigger asChild>
                                    <button className="h-12 w-12 flex items-center justify-center hover:bg-zinc-800 border border-transparent hover:border-zinc-700 rounded-2xl text-zinc-500 transition-all opacity-0 group-hover:opacity-100 shadow-xl">
                                       <MoreVertical size={20} />
                                    </button>
                                 </DropdownMenuTrigger>
                                 <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white w-64 p-3 rounded-2xl shadow-2xl">
                                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-3 py-2 leading-none italic">Manage Vendor</DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-zinc-800" />
                                    <DropdownMenuItem onClick={() => handleOpenEditModal(vendor)} className="focus:bg-zinc-800 px-3 py-3 rounded-xl cursor-pointer text-[10px] font-black uppercase tracking-widest italic">
                                       <Pencil size={16} className="mr-3 text-blue-500" /> Edit Vendor Info
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleOpenPlanModal(vendor)} className="focus:bg-zinc-800 px-3 py-3 rounded-xl cursor-pointer text-[10px] font-black uppercase tracking-widest italic">
                                       <Zap size={16} className="mr-3 text-emerald-500" /> Update Subscription
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleToggleSuspend(vendor)} className="focus:bg-zinc-800 px-3 py-3 rounded-xl cursor-pointer text-[10px] font-black uppercase tracking-widest italic text-amber-500 focus:text-amber-500">
                                       <ShieldAlert className="w-4 h-4 mr-3 text-amber-500" /> {vendor.subscriptionStatus === 'SUSPENDED' ? 'Activate Account' : 'Suspend Account'}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-zinc-800" />
                                    <DropdownMenuItem onClick={() => handleOpenDeleteModal(vendor)} className="focus:bg-red-500/10 px-3 py-3 rounded-xl cursor-pointer text-red-500 text-[10px] font-black uppercase tracking-widest italic">
                                       <Trash2 className="w-4 h-4 mr-3" /> Delete Account
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

         {/* Subscription Override Modal */}
         <Dialog open={isPlanModalOpen} onOpenChange={setIsPlanModalOpen}>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-white rounded-[3rem] p-0 overflow-hidden max-w-[500px]">
               <div className="p-10 space-y-8">
                  <DialogHeader className="p-0 text-left">
                     <div className="flex items-center gap-6 mb-8">
                        <div className="h-16 w-16 rounded-[1.5rem] bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner">
                           <Zap size={32} />
                        </div>
                        <div>
                           <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter leading-none mb-2">Update Subscription</DialogTitle>
                           <DialogDescription className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Change plan for {selectedVendor?.businessName}</DialogDescription>
                        </div>
                     </div>
                  </DialogHeader>

                  <div className="space-y-6">
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 italic">Select Plan</Label>
                        <Select
                           value={planForm.plan}
                           onValueChange={v => setPlanForm({ ...planForm, plan: v })}
                        >
                           <SelectTrigger className="bg-zinc-950 border-zinc-800 h-14 rounded-2xl px-6 font-black italic uppercase text-xs focus:ring-0">
                              <SelectValue />
                           </SelectTrigger>
                           <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                              {availablePlans.map((plan: any) => (
                                 <SelectItem key={plan.id} value={plan.name} className="focus:bg-zinc-800 uppercase font-black text-[10px] italic tracking-widest">{plan.displayName}</SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>

                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 italic">Account Status</Label>
                        <Select
                           value={planForm.status}
                           onValueChange={v => setPlanForm({ ...planForm, status: v })}
                        >
                           <SelectTrigger className="bg-zinc-950 border-zinc-800 h-14 rounded-2xl px-6 font-black italic uppercase text-xs focus:ring-0">
                              <SelectValue />
                           </SelectTrigger>
                           <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                              <SelectItem value="ACTIVE" className="focus:bg-zinc-800 uppercase font-black text-[10px] italic tracking-widest text-emerald-500">ACTIVE</SelectItem>
                              <SelectItem value="SUSPENDED" className="focus:bg-zinc-800 uppercase font-black text-[10px] italic tracking-widest text-orange-500">SUSPENDED</SelectItem>
                              <SelectItem value="CANCELLED" className="focus:bg-zinc-800 uppercase font-black text-[10px] italic tracking-widest text-red-500">CANCELLED</SelectItem>
                           </SelectContent>
                        </Select>
                     </div>

                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 italic">Expiry Date</Label>
                        <Input
                           type="date"
                           value={planForm.expiryDate}
                           onChange={e => setPlanForm({ ...planForm, expiryDate: e.target.value })}
                           className="bg-zinc-950 border-zinc-800 h-14 rounded-2xl px-6 font-black text-white italic"
                        />
                     </div>
                  </div>

                  <div className="pt-6 flex gap-4">
                     <Button onClick={() => setIsPlanModalOpen(false)} variant="ghost" className="h-14 flex-1 text-[10px] font-black uppercase tracking-widest italic text-zinc-600 hover:text-white">Cancel</Button>
                     <Button
                        onClick={handleUpdatePlan}
                        disabled={!!loading}
                        className="h-14 flex-1 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-emerald-500/20"
                     >
                        {loading ? <Loader2 className="animate-spin" /> : 'Save Changes'}
                     </Button>
                  </div>
               </div>
            </DialogContent>
         </Dialog>

         {/* Delete Confirmation Dialog */}
         <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-white rounded-[2.5rem] max-w-[450px] p-8">
               <DialogHeader className="text-left space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                     <Trash2 size={24} />
                  </div>
                  <div>
                     <DialogTitle className="text-xl font-black uppercase italic tracking-tighter mb-2 text-white">Delete Vendor Account?</DialogTitle>
                     <DialogDescription className="text-xs font-bold text-zinc-500 leading-relaxed font-sans">
                        Are you sure you want to delete <span className="text-white font-extrabold">{vendorToDelete?.businessName}</span>? This action is permanent and will delete all connected menus, items, orders, tables, and system assignments for this vendor.
                     </DialogDescription>
                  </div>
               </DialogHeader>
               <DialogFooter className="pt-6 flex gap-3">
                  <Button 
                     onClick={() => setIsDeleteModalOpen(false)} 
                     variant="ghost" 
                     className="flex-1 text-[10px] font-black uppercase tracking-widest italic text-zinc-500 hover:text-white"
                  >
                     Cancel
                  </Button>
                  <Button
                     onClick={handleDeleteVendor}
                     disabled={!!loading}
                     className="flex-1 bg-red-500 hover:bg-red-400 text-white font-black uppercase tracking-widest text-[10px] rounded-xl h-12 shadow-xl shadow-red-500/20"
                  >
                     {loading ? <Loader2 className="animate-spin text-white" size={16} /> : 'Delete Vendor'}
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>

         {/* Add Vendor Form Modal */}
         <VendorFormModal 
            isOpen={isAddModalOpen} 
            onClose={() => setIsAddModalOpen(false)} 
            availablePlans={availablePlans}
            onSuccess={() => {
               router.refresh();
            }}
         />

         {/* Edit Vendor Form Modal */}
         <VendorFormModal 
            isOpen={isEditModalOpen} 
            onClose={() => {
               setIsEditModalOpen(false);
               setEditingVendor(null);
            }} 
            initialData={editingVendor}
            availablePlans={availablePlans}
            onSuccess={(updatedVendor) => {
               setVendors(vendors.map(v => v.id === updatedVendor.id ? { ...v, ...updatedVendor } : v));
               router.refresh();
            }}
         />
      </div>
   );
}
