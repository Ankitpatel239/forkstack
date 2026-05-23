
import { prisma } from '@/lib/db';
import { TeamClient } from './TeamClient';

export default async function AdminAccessPage() {
  // Fetch ALL users for full access control
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      ownedVendor: { select: { businessName: true } },
      vendorAssignments: {
        include: {
          vendor: { select: { businessName: true } }
        }
      }
    }
  });

  // Fetch all vendors to allow assignment
  const vendors = await prisma.vendorProfile.findMany({
    orderBy: { businessName: 'asc' },
    select: { id: true, businessName: true }
  });

  return (
    <div className="space-y-12 pb-20">
      <TeamClient initialUsers={users} vendors={vendors} />
    </div>
  );
}
