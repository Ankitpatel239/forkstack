import { prisma } from '@/lib/db';
import { requireVendor } from '@/lib/vendor';
import { Badge } from '@/components/ui/badge';
import { SettingsClientPage } from '../SettingsClientPage';

export default async function SettingsPage({ params }: { params: Promise<{ tab: string }> }) {
  const vendor = await requireVendor();
  const awaitedParams = await params;
  const tabSlug = awaitedParams.tab || 'identity';
  
  // Fetch drives separately to ensure they are current
  const drives = await prisma.connectedDrive.findMany({
    where: { vendorId: vendor.id },
    orderBy: { createdAt: 'desc' }
  });

  const plans = await (prisma as any).platformPlan.findMany({
    where: { isActive: true },
    orderBy: { price: 'asc' }
  });

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 italic uppercase">Infrastructure Settings</h1>
          <p className="text-zinc-500 font-medium">Fine-tune your digital presence and operational parameters.</p>
        </div>
        <div className="flex items-center gap-2">
           <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-3 h-7 text-[10px] font-black uppercase tracking-widest italic animate-pulse">
             Subscription: {vendor.subscriptionPlan}
           </Badge>
        </div>
      </div>

      <SettingsClientPage vendor={vendor} initialDrives={drives} plans={plans} activeTabSlug={tabSlug} />
    </div>
  );
}
