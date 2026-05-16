
import { prisma } from '@/lib/db';
import { PlansClient } from './PlansClient';

export default async function AdminPlansPage() {
  const [plans, features, categories, limits] = await Promise.all([
    (prisma as any).platformPlan.findMany({
      orderBy: { price: 'asc' },
      include: { features: true, limits: true }
    }),
    (prisma as any).platformFeature.findMany({
      orderBy: { categoryName: 'asc' }
    }),
    (prisma as any).platformCategory.findMany({
      orderBy: { name: 'asc' }
    }),
    (prisma as any).platformLimit.findMany({
      orderBy: { createdAt: 'asc' }
    })
  ]);

  // Fetch usage counts for each plan tier
  const plansWithCounts = await Promise.all(plans.map(async (plan: any) => {
    // Use raw query to bypass stale enum validation in the generated Prisma client
    const countResult = await prisma.$queryRawUnsafe<any[]>(
      `SELECT COUNT(*)::int as count FROM "VendorProfile" WHERE "subscriptionPlan" = $1`,
      plan.name
    );
    const count = countResult[0]?.count || 0;
    return { ...plan, vendorCount: count };
  }));

  return <PlansClient initialPlans={plansWithCounts} initialFeatures={features} initialCategories={categories} initialLimits={limits} />;
}
