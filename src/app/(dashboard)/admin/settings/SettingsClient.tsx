
'use client';

import { useState } from 'react';
import { 
  Globe, 
  Bell, 
  Lock, 
  Database, 
  Zap,
  Save,
  MessageSquare,
  Smartphone,
  ShieldCheck,
  Loader2,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { updateSystemSettings } from '@/app/actions/admin-settings';

export function SettingsClient({ initialSettings }: { initialSettings: any[] }) {
  const [activeTab, setActiveTab] = useState('Global Platform');
  const [loading, setLoading] = useState(false);

  // Initialize state from DB settings or defaults
  const findSetting = (key: string, defaultValue: string) => 
    initialSettings.find(s => s.key === key)?.value || defaultValue;

  const [formData, setFormData] = useState({
    hubName: findSetting('HUB_NAME', 'ForkStack Operations'),
    supportEmail: findSetting('SUPPORT_EMAIL', 'ops@forkstack.io'),
    whatsappEnabled: findSetting('WHATSAPP_ENABLED', 'true') === 'true',
    mobilePosEnabled: findSetting('MOBILE_POS_ENABLED', 'true') === 'true',
    fiscalAuditEnabled: findSetting('FISCAL_AUDIT_ENABLED', 'false') === 'true',
  });

  const sections = [
    { label: 'Global Platform', icon: Globe },
    { label: 'Connectivity & API', icon: Zap },
    { label: 'Cloud Infrastructure', icon: Database },
    { label: 'Notifications', icon: Bell },
    { label: 'Platform Security', icon: Lock },
  ];

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = [
        { key: 'HUB_NAME', value: formData.hubName, group: 'GENERAL' },
        { key: 'SUPPORT_EMAIL', value: formData.supportEmail, group: 'GENERAL' },
        { key: 'WHATSAPP_ENABLED', value: formData.whatsappEnabled.toString(), group: 'CONNECTIVITY' },
        { key: 'MOBILE_POS_ENABLED', value: formData.mobilePosEnabled.toString(), group: 'CONNECTIVITY' },
        { key: 'FISCAL_AUDIT_ENABLED', value: formData.fiscalAuditEnabled.toString(), group: 'INFRASTRUCTURE' },
      ];

      const result = await updateSystemSettings(payload);
      if (result.success) {
        toast.success('Platform configurations deployed successfully');
      } else {
        toast.error(result.error || 'Configuration deployment failed');
      }
    } catch (e) {
      toast.error('Strategic relay failure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      {/* Sidebar Nav */}
      <div className="lg:col-span-3 space-y-2">
         {sections.map((item, i) => (
           <button 
             key={i} 
             onClick={() => setActiveTab(item.label)}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === item.label ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20 shadow-lg shadow-emerald-500/5' : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50'}`}
           >
              <item.icon size={18} className={activeTab === item.label ? 'text-emerald-500' : 'text-zinc-600'} />
              <span className="text-xs font-black uppercase tracking-widest leading-none">{item.label}</span>
           </button>
         ))}
      </div>

      {/* Form Area */}
      <div className="lg:col-span-9 space-y-8">
         <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-zinc-800 bg-zinc-950/20">
               <h2 className="text-xl font-black text-white italic tracking-tight uppercase">{activeTab} Configuration</h2>
               <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mt-1 italic">Strategizing platform parameters for {activeTab}.</p>
            </div>
            
            <div className="p-8 space-y-10">
               {activeTab === 'Global Platform' && (
                 <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-1">Application Hub Name</Label>
                       <Input 
                        value={formData.hubName}
                        onChange={(e) => setFormData({...formData, hubName: e.target.value})}
                        className="bg-zinc-950 border-zinc-800 h-12 text-zinc-100 font-bold font-sans rounded-xl focus:border-emerald-500/50" 
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-1">Global Support Node</Label>
                       <Input 
                        value={formData.supportEmail}
                        onChange={(e) => setFormData({...formData, supportEmail: e.target.value})}
                        className="bg-zinc-950 border-zinc-800 h-12 text-zinc-100 font-bold font-sans rounded-xl focus:border-emerald-500/50" 
                       />
                    </div>
                 </div>
               )}

               {activeTab === 'Connectivity & API' && (
                  <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-600 italic border-b border-zinc-900 pb-2">Active Service Relays</h3>
                    
                    {[
                      { 
                        id: 'whatsappEnabled', 
                        label: 'WhatsApp QR Engine', 
                        desc: 'Allows vendors to link business accounts.', 
                        icon: MessageSquare 
                      },
                      { 
                        id: 'mobilePosEnabled', 
                        label: 'Mobile Table POS', 
                        desc: 'Enables customer-facing QR menu ordering.', 
                        icon: Smartphone 
                      },
                      { 
                        id: 'fiscalAuditEnabled', 
                        label: 'Automated Fiscal Audit', 
                        desc: 'Monthly revenue snapshot generation.', 
                        icon: Database 
                      }
                    ].map((service: any, i: any) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors group">
                        <div className="flex items-center gap-4">
                           <div className={`h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center ${(formData as any)[service.id] ? 'text-emerald-500' : 'text-zinc-700'}`}>
                              <service.icon size={18} />
                           </div>
                           <div className="space-y-0.5">
                              <p className="text-sm font-bold text-zinc-300">{service.label}</p>
                              <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-tighter">{service.desc}</p>
                           </div>
                        </div>
                        <Switch 
                          checked={(formData as any)[service.id]} 
                          onCheckedChange={(checked) => setFormData({...formData, [service.id]: checked})}
                        />
                      </div>
                    ))}
                  </div>
               )}

               {activeTab !== 'Global Platform' && activeTab !== 'Connectivity & API' && (
                  <div className="py-20 text-center space-y-4 opacity-30">
                     <Settings size={48} className="mx-auto" />
                     <p className="text-[10px] font-black uppercase tracking-[0.3em]">Module optimization in progress...</p>
                  </div>
               )}

               <div className="pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-3 text-emerald-500">
                     <ShieldCheck size={20} />
                     <span className="text-[10px] font-black uppercase tracking-widest italic animate-pulse">Global Security Node: ACTIVE</span>
                  </div>
                  <Button 
                    onClick={handleSave}
                    disabled={loading}
                    className="rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-xs h-14 px-10 shadow-xl shadow-emerald-500/20 group transition-all active:scale-95 min-w-[200px]"
                  >
                     {loading ? <Loader2 size={18} className="animate-spin mr-3" /> : <Save size={18} className="mr-3 group-hover:rotate-12 transition-transform" />}
                     Deploy Configurations
                  </Button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
