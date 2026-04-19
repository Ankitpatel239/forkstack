import { prisma } from '@/lib/db';
import { PlansClient } from './PlansClient';

export default async function AdminPlansPage() {
  const plans = await (prisma as any).platformPlan.findMany({
    orderBy: { price: 'asc' }
  });

  return <PlansClient initialPlans={plans} />;
}
