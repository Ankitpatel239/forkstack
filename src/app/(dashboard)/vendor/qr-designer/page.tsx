
import { prisma } from '@/lib/db';
import { requireVendor } from '@/lib/vendor';
import { QRDesignerClient } from './QRDesignerClient';

export default async function QRDesignerPage() {
  const vendor = await requireVendor();
  const tables = await prisma.table.findMany({
    where: { vendorId: vendor.id },
    orderBy: { tableNumber: 'asc' }
  });

  return (
    <QRDesignerClient 
      vendor={vendor} 
      tables={tables} 
    />
  );
}
