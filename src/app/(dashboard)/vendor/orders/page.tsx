
import { prisma } from '@/lib/db';
import { requireVendor } from '@/lib/vendor';
import { OrdersClient } from './OrdersClient';

export default async function OrdersPage() {
  const vendor = await requireVendor();
  
  const orders = await prisma.order.findMany({
    where: { 
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
    },
    orderBy: { 
      orderDate: 'desc' 
    },
    take: 100
  });

  return (
    <div className="min-h-screen">
      <OrdersClient initialOrders={orders as any[]} />
    </div>
  );
}
