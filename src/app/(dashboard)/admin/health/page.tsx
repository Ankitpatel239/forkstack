
import { getPlatformHealth } from '@/app/actions/admin-health';
import { HealthClient } from './HealthClient';

export default async function AdminHealthPage() {
  const result = await getPlatformHealth();
  const initialData = result.success ? result.data : {
    stats: { dbLatency: '0ms', apiUptime: '0%', hardwareLoad: '0%', activeSessions: '0' },
    logs: [],
    isLockdown: false
  };

  return (
    <div className="space-y-12 pb-20">
      <HealthClient initialData={initialData} />
    </div>
  );
}
