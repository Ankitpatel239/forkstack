import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';

export async function getCurrentVendor() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return null;
  }

  const userId = (session.user as any).id;

  // Using raw SQL to bypass stale enum validation in the generated Prisma client
  const vendorsRaw = await prisma.$queryRawUnsafe<any[]>(
    `SELECT v.* FROM "VendorProfile" v 
     LEFT JOIN "UserVendorAssignment" uva ON v.id = uva."vendorId"
     WHERE v."ownerId" = $1 OR uva."userId" = $1
     LIMIT 1`,
    userId
  );
  
  const vendor = vendorsRaw[0];

  if (vendor) {
    // Attach subscription history - using raw SQL to avoid enum parsing errors
    vendor.subscriptionPayments = await prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM "SubscriptionPayment" WHERE "vendorId" = $1 ORDER BY "createdAt" DESC`,
      vendor.id
    );
  }

  return vendor || null;
}

export async function requireVendor() {
  const vendor = await getCurrentVendor();
  if (!vendor) {
    redirect('/login');
  }
  return vendor;
}

export async function getVendorBySlug(slug: string) {
  if (!slug) return null;
  
  const vendorsRaw = await prisma.$queryRawUnsafe<any[]>(
    `SELECT * FROM "VendorProfile" WHERE "tenantSlug" = $1 LIMIT 1`,
    slug
  );
  
  return vendorsRaw[0] || null;
}
