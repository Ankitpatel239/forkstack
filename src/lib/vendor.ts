import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';

export async function getCurrentVendor() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return null;
  }

  const vendor = await prisma.vendorProfile.findFirst({
    where: {
      OR: [
        { ownerId: (session.user as any).id },
        { staffAssignments: { some: { userId: (session.user as any).id } } }
      ]
    }
  });

  return vendor;
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
  return prisma.vendorProfile.findUnique({
    where: { tenantSlug: slug }
  });
}
