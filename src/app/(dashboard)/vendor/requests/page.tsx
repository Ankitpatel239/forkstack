
import { prisma } from '@/lib/db';
import { requireVendor } from '@/lib/vendor';
import { RequestsClient } from './RequestsClient';

export default async function VendorRequestsPage() {
  const vendor = await requireVendor();
  const requests = await (prisma as any).featureRequest.findMany({
    where: { vendorId: vendor.id },
    orderBy: { createdAt: 'desc' }
  });

  return <RequestsClient initialRequests={requests} />;
}
