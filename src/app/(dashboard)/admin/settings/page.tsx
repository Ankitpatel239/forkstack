import { 
  Settings, 
  Globe, 
  Bell, 
  Lock, 
  CreditCard, 
  Database, 
  ShieldCheck, 
  Zap,
  Save,
  MessageSquare,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

export default function AdminSettingsPage() {
  const sections = [
    { label: 'Global Platform', icon: Globe, active: true },
    { label: 'Connectivity & API', icon: Zap, active: false },
    { label: 'Cloud Infrastructure', icon: Database, active: false },
    { label: 'Notifications', icon: Bell, active: false },
    { label: 'Platform Security', icon: Lock, active: false },
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 italic">Global Node Settings</h1>
          <p className="text-zinc-500 font-medium font-sans">Strategic configuration for the entire ForkStack ecosystem.</p>
        </div>
        <div className="flex items-center gap-2">
           <Badge className="bg-emerald-500 text-zinc-950 px-3 h-7 text-[10px] font-black uppercase tracking-[0.2em] italic">
             Core v4.28
           </Badge>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-12">
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 space-y-2">
           {sections.map((item: any, i: any) => (
             <button 
               key={i} 
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${item.active ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20 shadow-lg shadow-emerald-500/5' : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50'}`}
             >
                <item.icon size={18} className={item.active ? 'text-emerald-500' : 'text-zinc-600'} />
                <span className="text-xs font-black uppercase tracking-widest leading-none">{item.label}</span>
             </button>
           ))}
        </div>

        {/* Form Area */}
        <div className="lg:col-span-9 space-y-8">
           <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-zinc-800 bg-zinc-950/20">
                 <h2 className="text-xl font-black text-white italic tracking-tight uppercase">Master Configuration</h2>
                 <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mt-1 italic">High-level platform parameters.</p>
              </div>
              
              <div className="p-8 space-y-10">
                 <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-1">Application Hub Name</Label>
                       <Input className="bg-zinc-950 border-zinc-800 h-12 text-zinc-100 font-bold font-sans" defaultValue="ForkStack Operations" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-1">Global Support Node</Label>
                       <Input className="bg-zinc-950 border-zinc-800 h-12 text-zinc-100 font-bold font-sans" defaultValue="ops@forkstack.io" />
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-600 italic border-b border-zinc-900 pb-2">Active Service Relays</h3>
                    
                    {[
                      { label: 'WhatsApp QR Engine', desc: 'Allows vendors to link business accounts.', icon: MessageSquare, active: true },
                      { label: 'Mobile Table POS', desc: 'Enables customer-facing QR menu ordering.', icon: Smartphone, active: true },
                      { label: 'Automated Fiscal Audit', desc: 'Monthly revenue snapshot generation.', icon: Database, active: false }
                    ].map((service: any, i: any) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors group">
                        <div className="flex items-center gap-4">
                           <div className={`h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center ${service.active ? 'text-emerald-500' : 'text-zinc-700'}`}>
                              <service.icon size={18} />
                           </div>
                           <div className="space-y-0.5">
                              <p className="text-sm font-bold text-zinc-300">{service.label}</p>
                              <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-tighter">{service.desc}</p>
                           </div>
                        </div>
                        <Switch checked={service.active} />
                      </div>
                    ))}
                 </div>

                 <div className="pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-3 text-emerald-500">
                       <ShieldCheck size={20} />
                       <span className="text-[10px] font-black uppercase tracking-widest italic animate-pulse">Global Security Node: STANDBY</span>
                    </div>
                    <Button className="rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-xs h-14 px-10 shadow-xl shadow-emerald-500/20 group transition-all active:scale-95">
                       <Save size={18} className="mr-3 group-hover:rotate-12 transition-transform" /> Deploy Configurations
                    </Button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
