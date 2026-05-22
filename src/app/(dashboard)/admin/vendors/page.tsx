
import { prisma } from '@/lib/db';
import { VendorsClient } from './VendorsClient';

export default async function AdminVendorsPage() {
  // Using raw SQL to bypass stale enum validation for subscriptionPlan
  const vendorsRaw = await prisma.$queryRawUnsafe<any[]>(`
    SELECT 
      v.*,
      u.id as "owner_id",
      u.name as "owner_name",
      u.email as "owner_email",
      (SELECT COUNT(*)::int FROM "MenuItem" WHERE "vendorId" = v.id) as "menuItems_count",
      (SELECT COUNT(*)::int FROM "Order" WHERE "vendorId" = v.id) as "orders_count",
      (SELECT COUNT(*)::int FROM "UserVendorAssignment" WHERE "vendorId" = v.id) as "staff_count",
      (SELECT COUNT(*)::int FROM "Table" WHERE "vendorId" = v.id) as "tables_count",
      (SELECT COUNT(*)::int FROM "TiffinSubscription" WHERE "vendorId" = v.id) as "tiffin_count"
    FROM "VendorProfile" v
    LEFT JOIN "User" u ON v."ownerId" = u.id
    ORDER BY v."createdAt" DESC
  `);

  const vendors = vendorsRaw.map(v => ({
    ...v,
    owner: v.owner_id ? { id: v.owner_id, name: v.owner_name, email: v.owner_email } : null,
    _count: { 
      menuItems: v.menuItems_count, 
      orders: v.orders_count, 
      staff: v.staff_count, 
      tables: v.tables_count,
      tiffin: v.tiffin_count 
    }
  }));

  const availablePlans = await (prisma as any).platformPlan.findMany({
    where: { isActive: true },
    orderBy: { price: 'asc' }
  });

  return <VendorsClient initialVendors={vendors} availablePlans={availablePlans} />;
}
