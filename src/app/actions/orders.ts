
'use server';

import { prisma } from '@/lib/db';
import { OrderSource, OrderStatus, PaymentStatus, TableStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function placeOrder(data: {
  vendorId: string;
  tableId?: string | null;
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
      tableId: data.tableId || null,
      customerPhone: data.customerPhone,
      customerName: data.customerName,
      orderSource: data.tableId ? 'QR_TABLE' : 'VENDOR_DASHBOARD',
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
  if (data.tableId) {
    await prisma.table.update({
      where: { id: data.tableId },
      data: { status: 'OCCUPIED' }
    });
  }

  revalidatePath('/vendor/orders');
  revalidatePath('/vendor/tables');
  
  return order;
}


export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status }
  });

  // If order is delivered/completed and has a table, maybe free the table?
  // For now, keep it occupied until explicitly freed or cleared.
  
  revalidatePath(`/vendor/orders/${orderId}`);
  revalidatePath('/vendor/orders');
  return order;
}

export async function updatePaymentStatus(orderId: string, status: PaymentStatus) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payment: true }
  });

  if (!order) throw new Error('Order not found');

  if (order.payment) {
    await prisma.payment.update({
      where: { id: order.payment.id },
      data: { 
        status,
        paidAt: status === 'COMPLETED' ? new Date() : null
      }
    });
  }

  revalidatePath(`/vendor/orders/${orderId}`);
  return order;
}

export async function addOrderItems(orderId: string, items: { menuItemId: string; quantity: number; unitPrice: number }[]) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true }
  });

  if (!order) throw new Error('Order not found');

  // 1. Create new items
  await prisma.orderItem.createMany({
    data: items.map((item: any) => ({
      orderId,
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.unitPrice * item.quantity
    }))
  });

  // 2. Update order total
  const additionalTotal = items.reduce((acc: any, item: any) => acc + (item.unitPrice * item.quantity), 0);
  const newTotal = order.totalAmount + additionalTotal;

  await prisma.order.update({
    where: { id: orderId },
    data: {
      totalAmount: newTotal,
      finalAmount: newTotal
    }
  });

  // 3. Update payment amount if exists
  const payment = await prisma.payment.findUnique({
    where: { orderId }
  });

  if (payment) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { amount: newTotal }
    });
  }

  revalidatePath(`/vendor/orders/${orderId}`);
  return { success: true };
}

export async function deleteOrderItem(orderId: string, itemId: string) {
  const item = await prisma.orderItem.findUnique({
    where: { id: itemId }
  });

  if (!item) throw new Error('Item not found');

  await prisma.orderItem.delete({
    where: { id: itemId }
  });

  const order = await prisma.order.findUnique({
    where: { id: orderId }
  });

  if (order) {
    const newTotal = order.totalAmount - item.totalPrice;
    await prisma.order.update({
      where: { id: orderId },
      data: {
        totalAmount: newTotal,
        finalAmount: newTotal
      }
    });
    
    // Update payment
    await prisma.payment.update({
      where: { orderId },
      data: { amount: newTotal }
    });
  }

  revalidatePath(`/vendor/orders/${orderId}`);
  return { success: true };
}

export async function updateTableStatus(tableId: string, status: TableStatus) {
  await prisma.table.update({
    where: { id: tableId },
    data: { status }
  });
  revalidatePath('/vendor/tables');
  return { success: true };
}
