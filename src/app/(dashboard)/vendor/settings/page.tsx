import { prisma } from '@/lib/db';
import { requireVendor } from '@/lib/vendor';
import { 
  Store, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Globe, 
  ShieldCheck, 
  Save,
  Image as ImageIcon,
  ChevronRight,
  Bell,
  Lock,
  CreditCard,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default async function SettingsPage() {
  const vendor = await requireVendor();

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 italic">Infrastructure Settings</h1>
          <p className="text-zinc-500 font-medium">Fine-tune your digital presence and operational parameters.</p>
        </div>
        <div className="flex items-center gap-2">
           <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-3 h-7 text-[10px] font-black uppercase tracking-widest italic animate-pulse">
             Subscription: {vendor.subscriptionPlan}
           </Badge>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-12">
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 space-y-2">
           {[
             { label: 'Business Identity', icon: Store, active: true },
             { label: 'Platform Config', icon: Zap, active: false },
             { label: 'Notifications', icon: Bell, active: false },
             { label: 'Security & Access', icon: Lock, active: false },
             { label: 'Billing & Tiers', icon: CreditCard, active: false },
           ].map((item, i) => (
             <button 
               key={i} 
               className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${item.active ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20 shadow-lg' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}`}
             >
                <div className="flex items-center gap-3">
                   <item.icon size={18} className={item.active ? 'text-emerald-500' : 'text-zinc-600 group-hover:text-zinc-400'} />
                   <span className="text-xs font-black uppercase tracking-widest leading-none">{item.label}</span>
                </div>
                {item.active && <ChevronRight size={14} />}
             </button>
           ))}
        </div>

        {/* Form Area */}
        <div className="lg:col-span-9 space-y-8">
           <div className="bg-zinc-900 shadow-2xl border border-zinc-800 rounded-3xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="p-8 border-b border-zinc-800 bg-zinc-950/20">
                 <h2 className="text-xl font-black text-white italic tracking-tight">Public Identity</h2>
                 <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Information displayed to your customers.</p>
              </div>
              
              <div className="p-8 space-y-12">
                 {/* Logo & Branding */}
                 <div className="flex flex-col md:flex-row gap-10 items-start md:items-center">
                    <div className="relative group">
                       <div className="h-32 w-32 rounded-3xl bg-zinc-950 border-2 border-dashed border-zinc-800 flex items-center justify-center overflow-hidden transition-all group-hover:border-emerald-500/50">
                          {vendor.logoUrl ? (
                            <img src={vendor.logoUrl} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-zinc-700 group-hover:text-zinc-500">
                               <ImageIcon size={32} />
                               <span className="text-[10px] font-black uppercase">Upload</span>
                            </div>
                          )}
                       </div>
                       <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-xl bg-emerald-500 text-zinc-950 flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 transition-transform">
                          <ImageIcon size={18} />
                       </div>
                    </div>
                    <div className="space-y-4 flex-1 max-w-md">
                       <div className="space-y-1">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-1">Brand Name</Label>
                          <Input className="bg-zinc-950 border-zinc-800 h-12 text-zinc-100 font-bold px-4" defaultValue={vendor.businessName} />
                       </div>
                       <div className="space-y-1">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-1">Tenant Subdomain (Permanent)</Label>
                          <div className="flex gap-2">
                             <div className="flex-1 bg-zinc-800/30 border border-zinc-800 rounded-lg h-10 px-4 flex items-center text-zinc-500 text-xs font-bold leading-none select-none">
                                forkstack.com/{vendor.tenantSlug}
                             </div>
                             <Button variant="outline" size="sm" className="h-10 border-zinc-800 text-zinc-400 group">
                                <Globe size={14} className="group-hover:text-emerald-500" />
                             </Button>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-1">
                       <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-1">Customer Support Email</Label>
                       <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
                          <Input className="bg-zinc-950 border-zinc-800 h-12 pl-12 text-zinc-100 font-bold" defaultValue={vendor.businessEmail} />
                       </div>
                    </div>
                    <div className="space-y-1">
                       <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-1">Business Hotline</Label>
                       <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
                          <Input className="bg-zinc-950 border-zinc-800 h-12 pl-12 text-zinc-100 font-bold" defaultValue={vendor.businessPhone} />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-1">Physical Venue Address</Label>
                    <div className="relative">
                       <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
                       <Input className="bg-zinc-950 border-zinc-800 h-12 pl-12 text-zinc-100 font-bold" defaultValue={vendor.address} placeholder="Enter your full business address..." />
                    </div>
                 </div>

                 <div className="pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-3 text-emerald-500">
                       <ShieldCheck size={20} className="animate-pulse" />
                       <span className="text-[10px] font-black uppercase tracking-widest italic">Encrypted Connection Active</span>
                    </div>
                    <Button className="rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-xs h-14 px-10 shadow-xl shadow-emerald-500/20 group transition-all active:scale-95">
                       <Save size={18} className="mr-3 group-hover:rotate-12 transition-transform" /> Commit Changes
                    </Button>
                 </div>
              </div>
           </div>

           <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group">
              <div className="space-y-1">
                 <h4 className="text-lg font-black text-red-500 italic uppercase leading-none">Danger Protocol</h4>
                 <p className="text-xs text-red-500/60 font-medium">Decommissioning this vendor will permanently erase all catalog and history data.</p>
              </div>
              <Button variant="outline" className="rounded-2xl border-red-500/30 text-red-500 font-black uppercase tracking-widest text-[10px] h-12 px-6 hover:bg-red-500/10 transition-all group-hover:border-red-500">
                 Deactivate Venue
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
}
