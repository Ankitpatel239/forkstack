
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
// import { OrderDetailClient } from './OrderDetailClient';
import { getCurrentVendor } from '@/lib/vendor';
import { OrderDetailClient } from './OrderDetailClient';

export default async function OrderPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const vendor = await getCurrentVendor();
  if (!vendor) notFound();

  const order = await prisma.order.findUnique({
    where: { 
      id,
      vendorId: vendor.id 
    },
    include: {
      items: {
        include: {
          menuItem: true
        }
      },
      table: true,
      payment: true
    }
  });

  if (!order) notFound();

  // Fetch all menu items for the "Add Item" feature
  const menuItems = await prisma.menuItem.findMany({
    where: { 
      vendorId: vendor.id,
      isAvailable: true 
    },
    orderBy: { name: 'asc' }
  });

  // Fetch all tables for table reassignment
  const tables = await prisma.table.findMany({
    where: { vendorId: vendor.id, isActive: true },
    orderBy: { tableNumber: 'asc' }
  });

  return (
    <OrderDetailClient 
      order={order as any} 
      vendor={vendor as any}
      menuItems={menuItems as any} 
      tables={tables as any}
    />
  );
}
