
import { prisma } from '@/lib/db';
import { requireVendor } from '@/lib/vendor';
import { OrdersClient } from './OrdersClient';

export default async function OrdersPage() {
  const vendor = await requireVendor();
  
  // Verify if the current plan supports order orchestration
  const plan = await (prisma as any).platformPlan.findUnique({
    where: { name: vendor.subscriptionPlan },
    include: { features: true }
  });

  const hasOrderNode = plan?.features.some((f: any) => 
    ['QR_ORDERING', 'DIGITAL_MENU', 'AUTO_RENEWAL', 'DIET_PREFERENCES'].includes(f.key)
  );

  if (!hasOrderNode && vendor.subscriptionPlan !== 'ENTERPRISE') {
    const { redirect } = await import('next/navigation');
    redirect('/vendor/subscription?reason=feature_locked');
  }

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
      <OrdersClient 
        initialOrders={orders as any[]} 
        vendorId={vendor.id}
      />
    </div>
  );
}
