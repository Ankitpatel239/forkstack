
'use server';

import { prisma } from '@/lib/db';
import { OrderSource, OrderStatus, PaymentStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function placeOrder(data: {
  vendorId: string;
  tableId: string;
  customerPhone: string;
  customerName?: string;
  items: { menuItemId: string; quantity: number; unitPrice: number }[];
  totalAmount: number;
  paymentMethod: string;
}) {
  // 1. Create the order
  const orderNumber = `ORD-${Math.random().toString(36).toUpperCase().substring(2, 8)}`;
  
  const order = await prisma.order.create({
    data: {
      orderNumber,
      vendorId: data.vendorId,
      tableId: data.tableId,
      customerPhone: data.customerPhone,
      customerName: data.customerName,
      orderSource: 'QR_TABLE',
      totalAmount: data.totalAmount,
      finalAmount: data.totalAmount,
      status: 'PENDING',
      items: {
        create: data.items.map(item => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.unitPrice * item.quantity
        }))
      },
      payment: {
        create: {
          vendorId: data.vendorId,
          amount: data.totalAmount,
          method: data.paymentMethod,
          status: data.paymentMethod === 'COD' ? 'PENDING' : 'COMPLETED',
        }
      }
    }
  });

  // 2. Update table status to OCCUPIED if it's not already
  await prisma.table.update({
    where: { id: data.tableId },
    data: { status: 'OCCUPIED' }
  });

  revalidatePath('/vendor/orders');
  revalidatePath('/vendor/tables');
  
  return order;
}

export async function updateTableStatus(tableId: string, status: any) {
  await prisma.table.update({
    where: { id: tableId },
    data: { status }
  });
  revalidatePath('/vendor/tables');
}
