
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Store, 
  Zap, 
  Bell, 
  Lock, 
  CreditCard, 
  ChevronRight, 
  Save, 
  Loader2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  ShieldCheck,
  ImageIcon,
  Tags,
  Search,
  Key,
  Eye,
  EyeOff,
  Database,
  Plus,
  Trash2,
  HardDrive,
  Cloud,
  Server,
  Activity,
  Box,
  Badge,
  Check,
  GripVertical,
  ChevronDown,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { updateVendorSettings, addConnectedDrive, deleteConnectedDrive } from '@/app/actions/settings';
import { toast } from 'sonner';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { 
  getInventoryCategories, 
  upsertInventoryCategory, 
  deleteInventoryCategory 
} from '@/app/actions/inventory';

import { subscribeToPlan } from '@/app/actions/billing';
import { getVendorRoles, createVendorRole, deleteVendorRole } from '@/app/actions/roles';

export function SettingsClientPage({ 
  vendor, 
  initialDrives = [], 
  plans = [],
  activeTabSlug = 'identity'
}: { 
  vendor: any, 
  initialDrives: any[], 
  plans: any[],
  activeTabSlug?: string
}) {
  const searchParams = useSearchParams();

  const tabs = [
    { label: 'Business Identity', slug: 'identity', icon: Store, sub: 'Public profile & SEO' },
    { label: 'Connected Drives', slug: 'drives', icon: Database, sub: 'Cloud & media storage' },
    { label: 'Platform Config', slug: 'config', icon: Zap, sub: 'System parameters' },
    { label: 'Notifications', slug: 'notifications', icon: Bell, sub: 'Alert nodes' },
    { label: 'Security & Access', slug: 'security', icon: Lock, sub: 'Encryption & locks' },
    { label: 'Inventory Catalog', slug: 'inventory', icon: Box, sub: 'Categories & Units' },
    { label: 'Billing & Tiers', slug: 'billing', icon: CreditCard, sub: 'Fiscal cycles' },
  ];

  const activeTab = tabs.find(t => t.slug === activeTabSlug)?.label || 'Business Identity';

  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');
    if (success === 'drive_connected') toast.success('Google Drive Node authorized and active');
    if (error) toast.error(`Authorization Failed: ${error}`);
  }, [searchParams]);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [drives, setDrives] = useState(initialDrives);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [driveLoading, setDriveLoading] = useState(false);
  const [subLoading, setSubLoading] = useState<string | null>(null);

  const handleSubscribe = async (planName: string) => {
    setSubLoading(planName);
    try {
      const res = await subscribeToPlan(planName);
      if (res.success) {
        toast.success(`Successfully migrated to ${planName} tier`);
        window.location.reload(); // Refresh to update all context
      } else {
        toast.error(res.error || 'Subscription failed');
      }
    } catch (e) {
      toast.error('Critical payment node failure');
    } finally {
      setSubLoading(null);
    }
  };

  const [newDrive, setNewDrive] = useState({
    name: '',
    type: 'S3',
    bucket: '',
    region: 'ap-south-1',
    accessKey: '',
    secretKey: '',
    endpoint: '',
    capacity: 5
  });

  const [formData, setFormData] = useState({
    businessName: vendor.businessName || '',
    businessEmail: vendor.businessEmail || '',
    businessPhone: vendor.businessPhone || '',
    address: vendor.address || '',
    description: vendor.description || '',
    metaTags: vendor.metaTags || '',
    isLocked: vendor.isLocked || false,
    lockPassword: vendor.lockPassword || '',
    logoUrl: vendor.logoUrl || ''
  });

  const [inventoryCategories, setInventoryCategories] = useState<any[]>([]);
  const [masterCategories, setMasterCategories] = useState<any[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [catLoading, setCatLoading] = useState(false);
  const [selectedMasterId, setSelectedMasterId] = useState<string | 'NONE'>('NONE');

  const [vendorRoles, setVendorRoles] = useState<any[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');

  const loadRoles = async () => {
    try {
      const roles = await getVendorRoles();
      setVendorRoles(roles);
    } catch (e) {
      toast.error('Failed to load roles');
    }
  };

  useEffect(() => {
    if (activeTab === 'Security & Access') {
      loadRoles();
    }
  }, [activeTab]);

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return;
    setRolesLoading(true);
    try {
      await createVendorRole(newRoleName, newRoleDesc);
      toast.success('Custom operator role activated');
      setNewRoleName('');
      setNewRoleDesc('');
      loadRoles();
    } catch (e: any) {
      toast.error(e.message || 'Failed to create role');
    } finally {
      setRolesLoading(false);
    }
  };

  const handleDeleteRole = async (id: string) => {
    try {
      await deleteVendorRole(id);
      toast.success('Role purged');
      loadRoles();
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete role');
    }
  };

  useEffect(() => {
    if (activeTab === 'Inventory Catalog') {
      loadCategories();
      loadMasterCategories();
    }
  }, [activeTab]);

  const loadCategories = async () => {
    const cats = await getInventoryCategories();
    setInventoryCategories(cats);
  };

  const loadMasterCategories = async () => {
    const { getMasterCategories } = await import('@/app/actions/master-categories');
    const masters = await getMasterCategories();
    setMasterCategories(masters);
  };

  const getFlattenedMasterCategories = (parentId: string | null = null, level = 0, result: any[] = []) => {
    masterCategories
      .filter(c => c.parentId === parentId)
      .forEach(cat => {
        result.push({ ...cat, level });
        getFlattenedMasterCategories(cat.id, level + 1, result);
      });
    return result;
  };

  const [selectedParent, setSelectedParent] = useState<string | 'NONE'>('NONE');

  const handleAddCategory = async () => {
    if (!newCatName) return;
    setCatLoading(true);
    try {
      await upsertInventoryCategory(
        newCatName, 
        selectedParent === 'NONE' ? undefined : selectedParent,
        selectedMasterId === 'NONE' ? undefined : selectedMasterId
      );
      setNewCatName('');
      setSelectedParent('NONE');
      setSelectedMasterId('NONE');
      loadCategories();
      toast.success('Category registered');
    } catch (e) {
      toast.error('Failed to create category');
    } finally {
      setCatLoading(false);
    }
  };

  const handleUpdateOrder = async (items: any[]) => {
    const { updateCategoryOrder } = await import('@/app/actions/inventory');
    await updateCategoryOrder(items.map((it, idx) => ({
      id: it.id,
      sortOrder: idx,
      parentId: it.parentId
    })));
    loadCategories();
  };

  // Helper to render nested categories
  const renderCategoryTree = (parentId: string | null = null, level = 0) => {
    return inventoryCategories
      .filter(cat => cat.parentId === parentId)
      .map((cat: any) => (
        <div key={cat.id} className="space-y-2">
          <div 
            style={{ marginLeft: level * 16 }}
            className={`bg-zinc-950 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between group hover:border-emerald-500/30 transition-all ${level > 0 ? 'bg-zinc-950/40 opacity-90' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className={`h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center transition-colors ${level > 0 ? 'text-zinc-700' : 'text-emerald-500'}`}>
                <Tags size={14} />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-tight text-white">{cat.name}</span>
                {cat._count?.items > 0 && (
                  <span className="text-[8px] font-bold text-zinc-500 ml-2 uppercase">{cat._count.items} Items</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
               <button 
                  onClick={() => { setSelectedParent(cat.id); window.scrollTo({ top: 500, behavior: 'smooth' }); }}
                  className="opacity-0 group-hover:opacity-100 p-2 text-zinc-700 hover:text-emerald-500 transition-all"
                  title="Add Sub-category"
               >
                  <Plus size={14} />
               </button>
               <button 
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-zinc-700 hover:text-red-500 transition-all"
               >
                  <Trash2 size={14} />
               </button>
            </div>
          </div>
          {renderCategoryTree(cat.id, level + 1)}
        </div>
      ));
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteInventoryCategory(id);
      loadCategories();
      toast.success('Category purged');
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateVendorSettings(formData);
      toast.success('Infrastructure parameters synchronized');
    } catch (error) {
      toast.error('Sync failed');
    } finally {
      setLoading(false);
    }
  };

  // Tabs are defined at the top to support URL dynamic routing

  const handleAddDrive = async () => {
    setDriveLoading(true);
    try {
      await addConnectedDrive(newDrive);
      toast.success('Storage node connected successfully');
      setDrives([{ ...newDrive, id: Math.random().toString(), status: 'ACTIVE', usage: 0 }, ...drives]);
      setIsDriveModalOpen(false);
      setNewDrive({
        name: '',
        type: 'S3',
        bucket: '',
        region: 'ap-south-1',
        accessKey: '',
        secretKey: '',
        endpoint: '',
        capacity: 5
      });
    } catch (error) {
      toast.error('Failed to bind storage node');
    } finally {
      setDriveLoading(false);
    }
  };

  const handleDeleteDrive = async (id: string) => {
    if (!confirm('Are you sure you want to decommission this storage node?')) return;
    try {
      await deleteConnectedDrive(id);
      setDrives(drives.filter((d: any) => d.id !== id));
      toast.success('Storage node decommissioned');
    } catch (e) {
      toast.error('Failed to sever connection');
    }
  };

  return (
    <div className="grid gap-6 lg:gap-10 lg:grid-cols-12">
      {/* Sidebar Nav */}
      <div className="lg:col-span-3 flex flex-row overflow-x-auto lg:flex-col lg:overflow-x-visible gap-3 pb-4 lg:pb-0 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
         {tabs.map((item: any, i: number) => {
           const isActive = activeTabSlug === item.slug;
           return (
             <Link 
               key={i} 
               href={`/vendor/settings/${item.slug}`}
               className={`group transition-all duration-300 shrink-0 lg:w-full ${isActive ? 'scale-[1.02]' : ''}`}
             >
                <div className={`flex items-center justify-between px-4 py-3 lg:px-5 lg:py-4 rounded-xl lg:rounded-2xl border transition-all ${
                  isActive 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-xl shadow-emerald-500/5' 
                  : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:bg-zinc-900 hover:border-zinc-700 hover:text-white'
                }`}>
                  <div className="flex items-center gap-3 lg:gap-4">
                     <div className={`p-1.5 lg:p-2 rounded-lg lg:rounded-xl transition-all ${isActive ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-950 text-zinc-600 group-hover:text-zinc-400'}`}>
                        <item.icon size={16} className="lg:w-[18px] lg:h-[18px]" />
                     </div>
                     <div>
                        <span className="text-[10px] lg:text-[11px] font-black uppercase tracking-widest leading-none block">{item.label}</span>
                        <span className="hidden lg:block text-[9px] font-bold text-zinc-600 mt-1 uppercase tracking-tighter">{item.sub}</span>
                     </div>
                  </div>
                  {isActive && <ChevronRight size={14} className="hidden lg:block animate-pulse" />}
                </div>
             </Link>
           );
         })}
      </div>

      {/* Form Area */}
      <div className="lg:col-span-9 space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
         {activeTab === 'Business Identity' && (
            <div className="bg-zinc-900 shadow-2xl border border-zinc-800 rounded-3xl overflow-hidden">
               <div className="p-6 md:p-10 border-b border-zinc-800 bg-zinc-950/20">
                  <h2 className="text-xl md:text-2xl font-black text-white italic uppercase tracking-tighter">Business Identity Node</h2>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Configure your public-facing metadata and brand presence.</p>
               </div>
               
               <div className="p-6 md:p-10 space-y-8 md:space-y-12">
                  <div className="flex flex-col md:flex-row gap-12 items-start">
                     <div className="relative group self-center md:self-start">
                        <input 
                          type="file" 
                          id="logo-upload"
                          className="hidden" 
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setFormData({...formData, logoUrl: reader.result as string});
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <div 
                          className="h-40 w-40 rounded-[2.5rem] bg-zinc-950 border-2 border-dashed border-zinc-800 flex items-center justify-center overflow-hidden transition-all group-hover:border-emerald-500/50 relative"
                        >
                           {formData.logoUrl ? (
                             <img src={formData.logoUrl} className="w-full h-full object-cover group-hover:opacity-60 transition-opacity" />
                           ) : (
                             <div className="flex flex-col items-center gap-2 text-zinc-700 group-hover:text-zinc-500">
                                <ImageIcon size={40} strokeWidth={1} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Upload Disk</span>
                             </div>
                           )}
                        </div>
                        <label 
                          htmlFor="logo-upload"
                          className="absolute -bottom-3 -right-3 h-12 w-12 rounded-2xl bg-emerald-500 text-zinc-950 flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 active:scale-95 transition-all outline outline-4 outline-zinc-900"
                        >
                           <ImageIcon size={20} />
                        </label>
                     </div>
                     <div className="space-y-6 flex-1 w-full">
                        <div className="space-y-2">
                           <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-1">Brand Designation</Label>
                           <Input 
                             value={formData.businessName}
                             onChange={e => setFormData({...formData, businessName: e.target.value})}
                             className="bg-zinc-950 border-zinc-800 h-14 text-zinc-100 font-black italic text-lg px-6 rounded-2xl focus:border-emerald-500/50" 
                           />
                        </div>
                        <div className="space-y-2">
                           <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-1">Global Routing Slug</Label>
                           <div className="flex gap-2">
                              <div className="flex-1 bg-zinc-800/20 border border-zinc-800 rounded-2xl h-14 px-6 flex items-center text-zinc-500 text-sm font-black italic leading-none select-none">
                                 forkstack.com/{vendor.tenantSlug}
                              </div>
                              <Button variant="outline" className="h-14 w-14 border-zinc-800 bg-zinc-950 rounded-2xl hover:bg-zinc-800 group">
                                 <Globe size={20} className="group-hover:text-emerald-500 transition-colors" />
                              </Button>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-1 flex items-center gap-2">
                        <Search size={12} /> SEO Description
                     </Label>
                     <Textarea 
                       value={formData.description}
                       onChange={e => setFormData({...formData, description: e.target.value})}
                       placeholder="Craft a compelling narrative for search engines..."
                       className="bg-zinc-950 border-zinc-800 min-h-[120px] rounded-2xl p-6 text-sm font-bold resize-none focus:border-emerald-500/50" 
                     />
                  </div>

                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-1 flex items-center gap-2">
                        <Tags size={12} /> Meta Registry (Keywords)
                     </Label>
                     <Input 
                       value={formData.metaTags}
                       onChange={e => setFormData({...formData, metaTags: e.target.value})}
                       placeholder="restaurant, hospitality, ordering, food, delhi"
                       className="bg-zinc-950 border-zinc-800 h-14 text-zinc-100 font-bold px-6 rounded-2xl" 
                     />
                  </div>

                  <div className="grid gap-8 md:grid-cols-2">
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-1">Comms Email</Label>
                        <div className="relative">
                           <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
                           <Input 
                             value={formData.businessEmail}
                             onChange={e => setFormData({...formData, businessEmail: e.target.value})}
                             className="bg-zinc-950 border-zinc-800 h-14 pl-14 text-zinc-100 font-bold rounded-2xl" 
                           />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-1">Hotline Vector</Label>
                        <div className="relative">
                           <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
                           <Input 
                             value={formData.businessPhone}
                             onChange={e => setFormData({...formData, businessPhone: e.target.value})}
                             className="bg-zinc-950 border-zinc-800 h-14 pl-14 text-zinc-100 font-bold rounded-2xl" 
                           />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-1">Geo-Location / Physical Node</Label>
                     <div className="relative">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
                        <Input 
                          value={formData.address}
                          onChange={e => setFormData({...formData, address: e.target.value})}
                          className="bg-zinc-950 border-zinc-800 h-14 pl-14 text-zinc-100 font-bold rounded-2xl" 
                          placeholder="Full address coordinates..." 
                        />
                     </div>
                  </div>

                  <div className="pt-8 md:pt-10 border-t border-zinc-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-8">
                     <div className="flex items-center gap-4 text-emerald-500 bg-emerald-500/5 px-5 py-3 rounded-2xl border border-emerald-500/10 w-full sm:w-auto justify-center sm:justify-start">
                        <ShieldCheck size={20} className="animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest italic">Encrypted Connection Active</span>
                     </div>
                     <Button 
                       onClick={handleSave}
                       disabled={loading}
                       className="w-full sm:w-auto rounded-xl sm:rounded-[2rem] bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-xs h-14 sm:h-16 px-10 sm:px-12 shadow-2xl shadow-emerald-500/20 group transition-all active:scale-95"
                     >
                        {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} className="mr-2 sm:mr-3 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" /> Sync Infrastructure</>}
                     </Button>
                  </div>
               </div>
            </div>
         )}

         {activeTab === 'Connected Drives' && (
            <div className="space-y-8">
               <div className="bg-zinc-900 shadow-2xl border border-zinc-800 rounded-3xl overflow-hidden">
                  <div className="p-6 md:p-10 border-b border-zinc-800 bg-zinc-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                     <div>
                        <h2 className="text-xl md:text-2xl font-black text-white italic uppercase tracking-tighter">Storage Infrastructure</h2>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Manage connected media drives and cloud storage endpoints.</p>
                     </div>
                     <Button 
                       onClick={() => setIsDriveModalOpen(true)}
                       className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-[10px] h-11 sm:h-12 px-5 sm:px-6 rounded-xl sm:rounded-2xl shadow-lg shadow-emerald-500/10"
                     >
                        <Plus size={16} className="mr-2 sm:w-[18px] sm:h-[18px]" /> Connect Node
                     </Button>
                  </div>
                  
                  <div className="p-6 md:p-10">
                     <div className="grid gap-6 md:grid-cols-2">
                        {drives.length === 0 ? (
                          <div className="md:col-span-2 py-20 text-center border-2 border-dashed border-zinc-800 rounded-[2.5rem]">
                             <div className="flex flex-col items-center gap-6 opacity-20">
                                <HardDrive size={64} />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em]">No active storage vectors detected.</p>
                             </div>
                          </div>
                        ) : (
                          drives.map((drive: any) => (
                            <div key={drive.id} className="bg-zinc-950 border border-zinc-800 p-8 rounded-[2rem] group hover:border-emerald-500/30 transition-all relative overflow-hidden">
                               <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                  {drive.type === 'S3' ? <Cloud size={80} /> : <HardDrive size={80} />}
                               </div>
                               <div className="flex items-start justify-between relative z-10">
                                  <div className="space-y-4">
                                     <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-500">
                                           {drive.type === 'S3' ? <Cloud size={20} /> : <Server size={20} />}
                                        </div>
                                        <div>
                                           <h4 className="text-lg font-black text-white uppercase italic tracking-tighter leading-none">{drive.name}</h4>
                                           <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[8px] font-black uppercase tracking-widest mt-1">
                                              {drive.type} • {drive.status}
                                           </Badge>
                                        </div>
                                     </div>
                                     <div className="space-y-2">
                                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                                           <span>Usage Control</span>
                                           <span className="text-zinc-400">{((drive.usage / drive.capacity) * 100).toFixed(1)}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                                           <div 
                                             className="h-full bg-emerald-500 transition-all duration-1000" 
                                             style={{ width: `${(drive.usage / drive.capacity) * 100}%` }} 
                                           />
                                        </div>
                                        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-zinc-700">
                                           <span>{drive.usage} GB Used</span>
                                           <span>{drive.capacity} GB Total</span>
                                        </div>
                                     </div>
                                  </div>
                                  <button 
                                    onClick={() => handleDeleteDrive(drive.id)}
                                    className="p-3 text-zinc-700 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                  >
                                     <Trash2 size={18} />
                                  </button>
                               </div>
                            </div>
                          ))
                        )}
                     </div>
                  </div>
               </div>

               <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-6 md:p-10 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-8">
                  <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                     <Activity size={32} />
                  </div>
                  <div>
                     <h4 className="text-lg font-black text-white italic uppercase tracking-tighter">Automatic Load Balancing</h4>
                     <p className="text-xs text-zinc-500 font-medium leading-relaxed">ForkStack will automatically distribute your media across all active storage nodes to ensure optimal delivery speed.</p>
                  </div>
               </div>
            </div>
         )}

         {activeTab === 'Security & Access' && (
            <div className="bg-zinc-900 shadow-2xl border border-zinc-800 rounded-3xl overflow-hidden p-6 md:p-10 space-y-8 md:space-y-10">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-zinc-950/40 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-zinc-800/50 group hover:border-emerald-500/30 transition-all">
                  <div className="space-y-2">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                           <Lock size={28} />
                        </div>
                        <div>
                           <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Stealth Lock Protocol</h3>
                           <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Prevent unauthorized guest browsing without logging out.</p>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${formData.isLocked ? 'text-emerald-500' : 'text-zinc-700'}`}>
                        {formData.isLocked ? 'Active' : 'Disabled'}
                     </span>
                     <Switch 
                       checked={formData.isLocked}
                       onCheckedChange={v => setFormData({...formData, isLocked: v})}
                       className="data-[state=checked]:bg-emerald-500"
                     />
                  </div>
               </div>

               {formData.isLocked && (
                  <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                     <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-6">Set Stealth Access Key (Lock Password)</Label>
                     <div className="relative group max-w-md px-4">
                        <Key className="absolute left-9 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-emerald-500 transition-colors" size={20} />
                        <Input 
                          type={showPassword ? 'text' : 'password'}
                          value={formData.lockPassword}
                          onChange={e => setFormData({...formData, lockPassword: e.target.value})}
                          placeholder="Enter secure node key..."
                          className="bg-zinc-950 border-zinc-800 h-16 pl-14 pr-16 text-zinc-100 font-black tracking-widest text-lg rounded-[1.5rem] focus:border-emerald-500/50" 
                        />
                        <button 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-9 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                        >
                           {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                     </div>
                  </div>
               )}

               <div className="pt-8 flex justify-end">
                  <Button 
                    onClick={handleSave}
                    disabled={loading}
                    className="rounded-2xl bg-white hover:bg-zinc-200 text-zinc-950 font-black uppercase tracking-widest text-[10px] h-14 px-10 shadow-xl active:scale-95 transition-all"
                  >
                     {loading ? <Loader2 className="animate-spin" /> : 'Commit Security Node'}
                  </Button>
               </div>
               <div className="pt-8 border-t border-zinc-800/50 space-y-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Role Master / Access Nodes</h3>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Define custom designations for your workforce.</p>
                     </div>
                  </div>

                  <div className="bg-zinc-950/40 p-6 rounded-[2rem] border border-zinc-800/50 space-y-4">
                     <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                           <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Role Designation</Label>
                           <Input 
                             value={newRoleName}
                             onChange={e => setNewRoleName(e.target.value)}
                             placeholder="e.g., HEAD CHEF" 
                             className="bg-zinc-950 border-zinc-800 h-12 px-4 font-bold text-sm rounded-xl focus:border-emerald-500/50" 
                           />
                        </div>
                        <div className="space-y-2">
                           <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Clearance Description</Label>
                           <div className="flex gap-2">
                              <Input 
                                value={newRoleDesc}
                                onChange={e => setNewRoleDesc(e.target.value)}
                                placeholder="Access capabilities..." 
                                className="bg-zinc-950 border-zinc-800 h-12 px-4 font-bold text-sm rounded-xl focus:border-emerald-500/50 flex-1" 
                              />
                              <Button 
                                onClick={handleCreateRole}
                                disabled={rolesLoading || !newRoleName}
                                className="h-12 w-12 shrink-0 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl"
                              >
                                 {rolesLoading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={20} />}
                              </Button>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                     {vendorRoles.map(role => (
                        <div key={role.id} className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between group hover:border-emerald-500/30 transition-all">
                           <div>
                              <div className="flex items-center justify-between mb-2">
                                 <Badge className="bg-zinc-900 text-emerald-500 border-none text-[8px] font-black uppercase tracking-widest">
                                    ID: {role.id.slice(-6).toUpperCase()}
                                 </Badge>
                                 <button 
                                   onClick={() => handleDeleteRole(role.id)}
                                   className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                   title="Decommission Role"
                                 >
                                    <Trash2 size={14} />
                                 </button>
                              </div>
                              <h4 className="text-sm font-black text-white italic uppercase tracking-wider">{role.name}</h4>
                              {role.description && (
                                <p className="text-[10px] text-zinc-500 font-bold mt-1 line-clamp-2">{role.description}</p>
                              )}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         )}

         {activeTab === 'Inventory Catalog' && (
            <div className="bg-zinc-900 shadow-2xl border border-zinc-800 rounded-3xl overflow-hidden">
               <div className="p-6 md:p-10 border-b border-zinc-800 bg-zinc-950/20">
                  <h2 className="text-xl md:text-2xl font-black text-white italic uppercase tracking-tighter">Inventory Taxonomy</h2>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Manage classifications for your batch integrity and stock portfolio.</p>
               </div>
               
              <div className="bg-zinc-950/40 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-zinc-800/50 space-y-6">
                 <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Category Label</Label>
                       <div className="relative group">
                          <Tags className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-emerald-500 transition-colors" size={18} />
                          <Input 
                            value={newCatName}
                            onChange={e => setNewCatName(e.target.value)}
                            placeholder="e.g., Raw Materials..."
                            className="bg-zinc-950 border-zinc-800 h-14 pl-14 text-zinc-100 font-black italic rounded-2xl focus:border-emerald-500/50" 
                          />
                       </div>
                    </div>
                    
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Parent Node</Label>
                       <Select value={selectedParent} onValueChange={v => setSelectedParent(v)}>
                          <SelectTrigger className="bg-zinc-950 border-zinc-800 h-14 rounded-2xl text-zinc-400 font-bold">
                             <SelectValue placeholder="Select Parent" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                             <SelectItem value="NONE" className="font-bold uppercase tracking-widest text-[10px]">None (Root)</SelectItem>
                             {inventoryCategories.filter(c => !c.parentId).map((cat: any) => (
                                <SelectItem key={cat.id} value={cat.id} className="font-bold">{cat.name}</SelectItem>
                             ))}
                          </SelectContent>
                       </Select>
                    </div>

                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Master Link (Global)</Label>
                       <Select value={selectedMasterId} onValueChange={v => setSelectedMasterId(v)}>
                          <SelectTrigger className="bg-zinc-950 border-zinc-800 h-14 rounded-2xl text-zinc-400 font-bold">
                             <SelectValue placeholder="Link to Master" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-zinc-800 text-white max-h-[300px]">
                             <SelectItem value="NONE" className="font-bold uppercase tracking-widest text-[10px]">Independent Category</SelectItem>
                             {getFlattenedMasterCategories().map((m: any) => (
                                <SelectItem key={m.id} value={m.id} className="text-xs py-2">
                                   {'\u00A0'.repeat(m.level * 4)}{m.name}
                                </SelectItem>
                             ))}
                          </SelectContent>
                       </Select>
                    </div>
                 </div>

                 <Button 
                    onClick={handleAddCategory}
                    disabled={catLoading}
                    className="w-full h-12 sm:h-14 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest rounded-xl sm:rounded-2xl shadow-lg transition-all active:scale-95 text-xs sm:text-sm"
                  >
                    {catLoading ? <Loader2 className="animate-spin" /> : <><Plus size={18} className="mr-2 sm:w-5 sm:h-5" /> Bind Taxonomy Class</>}
                  </Button>
              </div>

              <div className="space-y-4">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700 px-2 mb-4 flex items-center gap-2">
                    <Database size={12} /> Active Taxonomy Tree (Drag to Sort)
                 </h3>
                 {inventoryCategories.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-zinc-800 rounded-[2.5rem] opacity-20">
                       <Box size={48} className="mx-auto mb-4" />
                       <p className="text-[10px] font-black uppercase tracking-widest">No taxonomy nodes detected.</p>
                    </div>
                 ) : (
                    <div className="grid gap-3">
                       {inventoryCategories
                         .filter(cat => !cat.parentId)
                         .sort((a, b) => a.sortOrder - b.sortOrder)
                         .map((cat, idx) => (
                           <DraggableCategory 
                              key={cat.id} 
                              cat={cat} 
                              level={0} 
                              allCategories={inventoryCategories}
                              onDelete={handleDeleteCategory}
                              onAddSub={setSelectedParent}
                              onReorder={handleUpdateOrder}
                           />
                         ))
                       }
                    </div>
                 )}
              </div>
            </div>
          )}

         {activeTab === 'Billing & Tiers' && (
            <div className="space-y-8 md:space-y-10">
               <div className="bg-zinc-900 shadow-2xl border border-zinc-800 rounded-3xl overflow-hidden p-6 md:p-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-10">
                     <div className="space-y-2">
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[10px] font-black uppercase tracking-widest mb-2">Current Lifecycle</Badge>
                        <h3 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter">
                           {plans.find((p: any) => p.name === vendor.subscriptionPlan)?.displayName || vendor.subscriptionPlan} Tier
                        </h3>
                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
                           Expires on {new Date(vendor.subscriptionEnd).toLocaleDateString()} • {vendor.subscriptionStatus}
                        </p>
                     </div>
                     <div className="flex items-center gap-6 justify-between border-t border-zinc-800/50 pt-4 md:border-none md:pt-0">
                        <div className="text-right">
                           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Renewal Node</p>
                           <p className="text-xl font-black text-white italic">Automatic</p>
                        </div>
                        <div className="h-14 w-[1px] bg-zinc-800" />
                        <div className="text-right">
                           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Member Since</p>
                           <p className="text-xl font-black text-white italic">{new Date(vendor.subscriptionStart).getFullYear()}</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {plans.map((plan: any) => {
                    const isCurrent = vendor.subscriptionPlan === plan.name;
                    return (
                      <div key={plan.id} className={`bg-zinc-900 border rounded-3xl overflow-hidden shadow-2xl relative transition-all duration-500 ${isCurrent ? 'border-emerald-500 lg:scale-[1.05] z-10 shadow-emerald-500/10' : 'border-zinc-800 opacity-80 hover:opacity-100 hover:border-zinc-700'}`}>
                         {isCurrent && (
                           <div className="absolute top-0 right-0 p-4">
                              <ShieldCheck className="text-emerald-500" size={24} />
                           </div>
                         )}
                         <div className="p-8 border-b border-zinc-800 bg-zinc-950/20">
                            <Badge className={`border-none text-[9px] font-black uppercase tracking-widest mb-3 ${isCurrent ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-500'}`}>
                               {plan.name} {isCurrent && '• Active Node'}
                            </Badge>
                            <h4 className="text-xl font-black text-white italic uppercase leading-none">{plan.displayName}</h4>
                             {plan.description && (
                               <p className="text-[10px] font-medium text-zinc-500 mt-2 leading-relaxed line-clamp-2 italic">
                                 {plan.description}
                               </p>
                             )}
                            <div className="flex items-baseline gap-1 mt-4">
                               <span className="text-3xl font-black text-white">₹{plan.price}</span>
                               <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">/ monthly</span>
                            </div>
                         </div>
                         <div className="p-8 space-y-4">
                            {(plan.features || []).map((feature: string, i: number) => (
                               <div key={i} className="flex items-center gap-3 text-[11px] font-bold text-zinc-400">
                                  <Check size={14} className="text-emerald-500 shrink-0" />
                                  {feature}
                               </div>
                            ))}
                         </div>
                         <div className="p-8 pt-0">
                            <Button 
                              disabled={isCurrent || !!subLoading}
                              onClick={() => handleSubscribe(plan.name)}
                              className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${isCurrent ? 'bg-zinc-800 text-zinc-500' : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-xl shadow-emerald-500/10'}`}
                            >
                               {subLoading === plan.name ? <Loader2 className="animate-spin" /> : (isCurrent ? 'Current Tier' : 'Upgrade Node')}
                            </Button>
                         </div>
                      </div>
                    );
                  })}
               </div>

               <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
                  <div className="p-6 md:p-10 border-b border-zinc-800 bg-zinc-950/20 flex items-center justify-between">
                     <div>
                        <h4 className="text-lg md:text-xl font-black text-white italic uppercase leading-none">Global Ledger History</h4>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-2">Audit your platform subscription payments and fiscal cycles.</p>
                     </div>
                     <div className="h-12 w-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-emerald-500 shrink-0">
                        <CreditCard size={20} />
                     </div>
                  </div>
                  
                  <div className="divide-y divide-zinc-800">
                     {(!vendor.subscriptionPayments || vendor.subscriptionPayments.length === 0) ? (
                        <div className="p-20 text-center text-zinc-600">
                           <div className="flex flex-col items-center gap-4 opacity-20">
                              <History size={40} />
                              <p className="text-[10px] font-black uppercase tracking-widest">No transaction history detected.</p>
                           </div>
                        </div>
                     ) : (
                        vendor.subscriptionPayments.map((p: any) => (
                           <div key={p.id} className="p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-zinc-950/40 transition-all">
                              <div className="flex items-center gap-4 sm:gap-6">
                                 <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                                    <Check size={18} className="sm:w-5 sm:h-5" />
                                 </div>
                                 <div>
                                    <p className="text-xs font-black text-white uppercase italic tracking-widest leading-none">{p.plan} Subscription</p>
                                    <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-2">
                                       {new Date(p.createdAt).toLocaleDateString()} • Ref: #{p.id.slice(-8).toUpperCase()}
                                    </p>
                                 </div>
                              </div>
                              <div className="text-left sm:text-right w-full sm:w-auto pl-15 sm:pl-0">
                                 <p className="text-base sm:text-lg font-black text-white italic">₹{p.amount}</p>
                                 <div className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mt-1">SUCCESS</div>
                              </div>
                           </div>
                        ))
                     )}
                  </div>
               </div>
            </div>
         )}

         {['Platform Config', 'Notifications'].includes(activeTab) && (
            <div className="bg-zinc-950/20 border-2 border-dashed border-zinc-900 rounded-[3rem] py-32 text-center">
               <div className="flex flex-col items-center gap-6">
                  <div className="h-20 w-20 rounded-full bg-zinc-900/50 flex items-center justify-center text-zinc-800">
                     <Lock size={40} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-black text-zinc-700 italic uppercase">Advanced Core Required</h4>
                    <p className="text-[10px] text-zinc-800 font-bold uppercase tracking-[0.2em]">Contact platform admin to unlock {activeTab} parameters.</p>
                  </div>
               </div>
            </div>
         )}
      </div>

      {/* Connect Drive Modal */}
      <Dialog open={isDriveModalOpen} onOpenChange={setIsDriveModalOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[550px] rounded-[2.5rem] p-0 overflow-hidden">
          <div className="bg-linear-to-br from-zinc-900 to-zinc-950 p-10 border-b border-zinc-800 relative">
             <div className="absolute top-0 right-0 p-10 opacity-5">
                <Database size={100} />
             </div>
             <DialogHeader className="relative z-10">
               <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6">
                  <Plus size={28} />
               </div>
               <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Authorize Storage Node</DialogTitle>
               <DialogDescription className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Bind a new storage vector to your media infrastructure.</DialogDescription>
             </DialogHeader>
          </div>

          <div className="p-10 space-y-8">
             <div className="space-y-6">
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Drive Reference Name</Label>
                   <Input 
                     value={newDrive.name}
                     onChange={e => setNewDrive({...newDrive, name: e.target.value})}
                     placeholder="e.g., My Personal Backup" 
                     className="bg-zinc-950 border-zinc-800 h-14 px-6 font-bold text-sm rounded-2xl" 
                   />
                </div>
                
                <div className="p-10 border-2 border-dashed border-zinc-800 rounded-[2.5rem] bg-zinc-950/50 text-center space-y-6 group hover:border-emerald-500/30 transition-all">
                   <div className="flex justify-center">
                      <div className="h-20 w-20 rounded-3xl bg-white flex items-center justify-center text-zinc-950 shadow-2xl">
                         <Cloud size={40} />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <h4 className="text-xl font-black text-white italic uppercase">Google Drive Authorization</h4>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest max-w-[250px] mx-auto">Click below to authorize ForkStack to access your Google Workspace storage.</p>
                   </div>
                   
                   <Button 
                     onClick={() => {
                        if (!newDrive.name) return toast.error('Please assign a node name first');
                        const state = encodeURIComponent(JSON.stringify({ name: newDrive.name }));
                        window.location.href = `/api/vendor/drive/google/auth?state=${state}`;
                     }}
                     className="h-14 w-full bg-white hover:bg-zinc-200 text-zinc-950 font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl flex items-center justify-center gap-3"
                   >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Sign in with Google
                   </Button>
                </div>
             </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DraggableCategory({ cat, level, allCategories, onDelete, onAddSub, onReorder }: any) {
  const [isExpanded, setIsExpanded] = useState(level === 0); // Default expand only root level
  const children = allCategories.filter((c: any) => c.parentId === cat.id).sort((a: any, b: any) => a.sortOrder - b.sortOrder);
  
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', cat.id);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId === cat.id) return;

    const items = [...allCategories];
    const draggedIdx = items.findIndex(i => i.id === draggedId);
    const targetIdx = items.findIndex(i => i.id === cat.id);
    
    const draggedItem = items.splice(draggedIdx, 1)[0];
    items.splice(targetIdx, 0, draggedItem);
    
    onReorder(items.filter(i => i.parentId === cat.parentId));
  };

  return (
    <div 
      draggable 
      onDragStart={handleDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="space-y-2"
    >
      <div 
        style={{ marginLeft: level * 32 }}
        className={`bg-zinc-950 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between group hover:border-emerald-500/30 transition-all ${level > 0 ? 'bg-zinc-950/40 opacity-90' : ''}`}
      >
        <div className="flex items-center gap-3">
          {children.length > 0 ? (
            <button onClick={() => setIsExpanded(!isExpanded)} className="p-1 hover:bg-zinc-900 rounded transition-colors">
              {isExpanded ? <ChevronDown size={14} className="text-zinc-500" /> : <ChevronRight size={14} className="text-zinc-500" />}
            </button>
          ) : (
            <div className="w-6" /> // Spacer for alignment
          )}
          <GripVertical size={14} className="text-zinc-800 cursor-grab active:cursor-grabbing" />
          <div className={`h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center transition-colors ${level > 0 ? 'text-zinc-700' : 'text-emerald-500'}`}>
            <Tags size={14} />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-tight text-white">{cat.name}</span>
            {cat.masterCategory && (
              <span className="text-[7px] font-black text-emerald-500 ml-2 border border-emerald-500/20 px-1 rounded uppercase">Master: {cat.masterCategory.name}</span>
            )}
            {children.length > 0 && !isExpanded && (
              <span className="text-[7px] font-bold text-zinc-600 ml-2 uppercase">({children.length} sub-nodes)</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button 
              onClick={() => { onAddSub(cat.id); setIsExpanded(true); window.scrollTo({ top: 500, behavior: 'smooth' }); }}
              className="opacity-0 group-hover:opacity-100 p-2 text-zinc-700 hover:text-emerald-500 transition-all"
           >
              <Plus size={14} />
           </button>
           <button 
              onClick={() => onDelete(cat.id)}
              className="opacity-0 group-hover:opacity-100 p-2 text-zinc-700 hover:text-red-500 transition-all"
           >
              <Trash2 size={14} />
           </button>
        </div>
      </div>
      {isExpanded && children.map((child: any) => (
        <DraggableCategory 
          key={child.id} 
          cat={child} 
          level={level + 1} 
          allCategories={allCategories}
          onDelete={onDelete}
          onAddSub={onAddSub}
          onReorder={onReorder}
        />
      ))}
    </div>
  );
}
