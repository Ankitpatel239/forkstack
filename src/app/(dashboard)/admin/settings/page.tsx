
import { Badge } from '@/components/ui/badge';
import { getSystemSettings } from '@/app/actions/admin-settings';
import { SettingsClient } from './SettingsClient';

export default async function AdminSettingsPage() {
  const result = await getSystemSettings();
  const initialSettings = result.success ? result.data : [];

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 italic uppercase">Global Node Settings</h1>
          <p className="text-zinc-500 font-medium font-sans uppercase text-[10px] tracking-[0.3em]">Strategic configuration for the entire ForkStack ecosystem.</p>
        </div>
        <div className="flex items-center gap-2">
           <Badge className="bg-emerald-500 text-zinc-950 px-3 h-7 text-[10px] font-black uppercase tracking-[0.2em] italic">
             Core v4.28
           </Badge>
        </div>
      </div>

      <SettingsClient initialSettings={initialSettings} />
    </div>
  );
}
