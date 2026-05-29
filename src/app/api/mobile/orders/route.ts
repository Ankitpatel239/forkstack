import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyMobileAuth } from '@/lib/mobile-auth';

export async function GET(req: Request) {
  try {
    const auth = await verifyMobileAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const vendorId = auth.vendor!.id;

    const orders = await prisma.order.findMany({
      where: { vendorId },
      orderBy: { orderDate: 'desc' },
      include: {
        items: {
          include: {
            menuItem: true,
            inventoryItem: true
          }
        },
        payment: true,
        table: true
      },
      take: 50 // Limit to last 50 orders
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Mobile Orders API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await verifyMobileAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const vendorId = auth.vendor!.id;

    const body = await req.json();
    const { customerName, customerPhone, items, totalAmount, paymentMethod, tableId } = body;

    // items should be [{ menuItemId: string, quantity: number, unitPrice: number }]
    const orderNumber = `ORD-${Math.random().toString(36).toUpperCase().substring(2, 8)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        vendor: { connect: { id: vendorId } },
        ...(tableId ? { table: { connect: { id: tableId } } } : {}),
        customerName: customerName || null,
        customerPhone: customerPhone || null,
        orderSource: 'VENDOR_DASHBOARD',
        totalAmount,
        finalAmount: totalAmount,
        status: 'PENDING',
        items: {
          create: items.map((item: any) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice * item.quantity
          }))
        },
          payment: {
            create: {
              vendor: { connect: { id: vendorId } },
              amount: totalAmount,
              method: paymentMethod || 'CASH',
              status: 'PENDING',
            }
          }
      },
      include: {
        items: {
          include: { menuItem: true }
        },
        payment: true
      }
    });

    // Emit real-time update
    try {
      const { emitNewOrder } = await import('@/lib/socket-server');
      emitNewOrder(vendorId, order);
    } catch (e) {
      console.error('Failed to emit socket event:', e);
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Mobile Orders POST API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
