import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback_secret_key_123';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    if (!decoded || !decoded.id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const bodyText = await req.text();
    if (!bodyText) {
      return NextResponse.json({ error: 'Empty body' }, { status: 400 });
    }

    const { items, purpose, paymentDetails } = JSON.parse(bodyText);
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    const vendor = await prisma.vendorProfile.findFirst({
      where: {
        OR: [
          { ownerId: decoded.id },
          { staffAssignments: { some: { userId: decoded.id } } }
        ]
      }
    });

    const vendorId = vendor?.id;

    if (!vendorId) {
      return NextResponse.json({ error: 'Vendor profile not found' }, { status: 403 });
    }

    // 1. Create the Order first if paymentDetails are provided
    let orderId = null;
    if (paymentDetails) {
      const order = await prisma.order.create({
        data: {
          vendorId,
          orderNumber: `MOB-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          totalAmount: paymentDetails.subtotal,
          discount: paymentDetails.discount,
          tax: 0,
          finalAmount: paymentDetails.finalAmount,
          customerPhone: paymentDetails.customerPhone || 'WALK-IN',
          status: paymentDetails.isPending ? 'PENDING' : 'DELIVERED',
          orderSource: 'API',
          notes: `Mobile Checkout: ${purpose || 'POS'}`,
          payment: {
            create: {
              vendorId,
              amount: paymentDetails.finalAmount,
              method: paymentDetails.method.toLowerCase(),
              status: paymentDetails.paidAmount >= paymentDetails.finalAmount ? 'COMPLETED' : (paymentDetails.paidAmount > 0 ? 'PARTIAL' : 'PENDING'),
              paidAmount: paymentDetails.paidAmount,
              paidAt: paymentDetails.paidAmount > 0 ? new Date() : null,
            }
          }
        }
      });
      orderId = order.id;
    }

    const results = [];

    // Process checkout for each item
    for (const reqItem of items) {
      const { id, quantity, price } = reqItem;
      const change = -Math.abs(quantity);

      const currentItem = await prisma.inventoryItem.findUnique({
        where: { id, vendorId },
        include: { batches: true }
      });

      if (!currentItem) continue;

      // Create OrderItem if we have an order
      if (orderId) {
        await prisma.orderItem.create({
          data: {
            orderId,
            inventoryItemId: id,
            quantity: Math.abs(quantity),
            unitPrice: price || currentItem.price || 0,
            totalPrice: (price || currentItem.price || 0) * Math.abs(quantity)
          }
        });
      }

      const prevStock = currentItem.quantity;
      let amountToDeduct = Math.abs(change);

      const sortedBatches = currentItem.batches
        .filter((b: any) => !b.isSoldOut && b.quantity > 0)
        .sort((a: any, b: any) => a.receivedDate.getTime() - b.receivedDate.getTime());

      for (const batch of sortedBatches) {
        if (amountToDeduct <= 0) break;
        const deduct = Math.min(batch.quantity, amountToDeduct);
        await prisma.stockBatch.update({
          where: { id: batch.id },
          data: { 
            quantity: batch.quantity - deduct,
            isSoldOut: batch.quantity - deduct <= 0
          }
        });
        amountToDeduct -= deduct;
      }

      // Re-fetch to calculate new totals
      const updatedItemData = await prisma.inventoryItem.findUnique({
        where: { id },
        include: { batches: { where: { isSoldOut: false, quantity: { gt: 0 } } } }
      });

      const totalQty = updatedItemData?.batches.reduce((acc: any, b: any) => acc + b.quantity, 0) || 0;
      const totalValue = updatedItemData?.batches.reduce((acc: any, b: any) => acc + (b.quantity * b.costPrice), 0) || 0;
      const avgCost = totalQty > 0 ? (totalValue / totalQty) : (currentItem.costPrice || 0);

      await prisma.inventoryItem.update({
        where: { id },
        data: { quantity: totalQty, costPrice: avgCost }
      });

      await prisma.stockHistory.create({
        data: {
          inventoryItemId: id,
          type: 'OUT',
          quantity: change,
          previousStock: prevStock,
          newStock: totalQty,
          reason: `Mobile Scanner Checkout: ${purpose || 'Sale'}${orderId ? ` (Order #${orderId})` : ''}`
        }
      });

      results.push({ id, status: 'success', newStock: totalQty });
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Mobile Checkout API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
