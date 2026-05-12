
import { prisma } from '@/lib/db';
import { TeamClient } from './TeamClient';

export default async function AdminAccessPage() {
  // Fetch ALL users for full access control
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100
  });

  return (
    <div className="space-y-12 pb-20">
      <TeamClient initialUsers={users} />
    </div>
  );
}
