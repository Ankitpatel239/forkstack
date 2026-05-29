import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyMobileAuth } from '@/lib/mobile-auth';

export async function GET(req: Request, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const auth = await verifyMobileAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const vendorId = auth.vendor!.id;
    const { orderId } = await params;

    const order = await prisma.order.findFirst({
      where: { id: orderId, vendorId },
      include: {
        items: {
          include: {
            menuItem: true,
            inventoryItem: true
          }
        },
        payment: true,
        table: true
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Mobile Order GET API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const auth = await verifyMobileAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const vendorId = auth.vendor!.id;
    const { orderId } = await params;

    const body = await req.json();
    const { status, paymentStatus, paymentMethod, addItems, removeItems, updateItems } = body;

    const order = await prisma.order.findFirst({
      where: { id: orderId, vendorId },
      include: { items: true, payment: true }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Process item changes if any
    let itemsChanged = false;

    if (removeItems && removeItems.length > 0) {
      await prisma.orderItem.deleteMany({
        where: { id: { in: removeItems }, orderId }
      });
      itemsChanged = true;
    }

    if (updateItems && updateItems.length > 0) {
      for (const item of updateItems) {
        await prisma.orderItem.update({
          where: { id: item.id },
          data: {
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice
          }
        });
      }
      itemsChanged = true;
    }

    if (addItems && addItems.length > 0) {
      await prisma.orderItem.createMany({
        data: addItems.map((item: any) => ({
          orderId,
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.quantity * item.unitPrice
        }))
      });
      itemsChanged = true;
    }

    let newTotalAmount = order.totalAmount;

    if (itemsChanged) {
      // Recalculate total
      const updatedItems = await prisma.orderItem.findMany({ where: { orderId } });
      newTotalAmount = updatedItems.reduce((acc, item) => acc + item.totalPrice, 0);

      await prisma.order.update({
        where: { id: orderId },
        data: {
          totalAmount: newTotalAmount,
          finalAmount: newTotalAmount - order.discount + order.tax
        }
      });
    }

    // Re-fetch the updated order before payment logic to get fresh amounts
    const refreshedOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true }
    });

    const currentFinalAmount = refreshedOrder!.finalAmount;

    const updateData: any = {};
    if (status) updateData.status = status;

    if (paymentStatus || paymentMethod || itemsChanged) {
      const paymentUpdate: any = {};
      if (paymentStatus) {
        paymentUpdate.status = paymentStatus;
        if (paymentStatus === 'COMPLETED') {
          paymentUpdate.paidAt = new Date();
          paymentUpdate.paidAmount = currentFinalAmount;
        }
      }
      if (paymentMethod) paymentUpdate.method = paymentMethod;
      if (itemsChanged) paymentUpdate.amount = currentFinalAmount; // Update payment amount if items changed
      
      updateData.payment = {
        upsert: {
          create: {
            vendor: { connect: { id: vendorId } },
            amount: currentFinalAmount,
            method: paymentMethod || order.payment?.method || 'CASH',
            status: paymentStatus || order.payment?.status || 'PENDING',
            paidAmount: (paymentStatus || order.payment?.status) === 'COMPLETED' ? currentFinalAmount : 0,
            paidAt: (paymentStatus || order.payment?.status) === 'COMPLETED' ? new Date() : null,
          },
          update: paymentUpdate
        }
      };
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        items: {
          include: { menuItem: true, inventoryItem: true }
        },
        payment: true,
        table: true
      }
    });

    // Emit real-time update if possible
    try {
      const { emitOrderUpdate } = await import('@/lib/socket-server');
      emitOrderUpdate(vendorId, updatedOrder);
    } catch (e) {
      console.error('Failed to emit socket event:', e);
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('Mobile Order PATCH API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
