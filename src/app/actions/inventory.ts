
'use server';

import { prisma } from '@/lib/db';
import { requireVendor } from '@/lib/vendor';
import { revalidatePath } from 'next/cache';

export async function createInventoryItem(data: {
  name: string;
  sku?: string;
  barcode?: string;
  category: string;
  quantity: number;
  unit: string;
  lowStockThreshold: number;
  costPrice?: number;
  price?: number;
  supplier?: string;
  brand?: string;
  location?: string;
  expiryDate?: Date;
}) {
  const vendor = await requireVendor();

  let finalSku = data.sku;
  if (!finalSku) {
    const prefix = (data.category || 'ITEM').substring(0, 3).toUpperCase();
    const count = await prisma.inventoryItem.count({ 
      where: { vendorId: vendor.id, category: data.category } 
    });
    finalSku = `${prefix}-${100 + count + 1}`;
  }

  const item = await prisma.inventoryItem.create({
    data: {
      name: data.name,
      sku: finalSku,
      barcode: data.barcode,
      category: data.category,
      quantity: Number(data.quantity) || 0,
      unit: data.unit,
      lowStockThreshold: Number(data.lowStockThreshold) || 0,
      costPrice: data.costPrice !== undefined ? (Number(data.costPrice) || 0) : undefined,
      price: data.price !== undefined ? (Number(data.price) || 0) : 0,
      supplier: data.supplier,
      brand: data.brand,
      location: data.location,
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
      vendorId: vendor.id,
      batches: (Number(data.quantity) || 0) > 0 ? {
        create: {
          quantity: Number(data.quantity) || 0,
          costPrice: data.costPrice !== undefined ? (Number(data.costPrice) || 0) : 0,
          receivedDate: new Date(),
          expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
          location: data.location,
          batchNumber: `BAT-${Date.now().toString().slice(-6)}`
        }
      } : undefined
    }
  });

  if (data.quantity > 0) {
    await prisma.stockHistory.create({
      data: {
        inventoryItemId: item.id,
        type: 'IN',
        quantity: data.quantity,
        previousStock: 0,
        newStock: data.quantity,
        reason: 'Initial Product Cataloging'
      }
    });
  }

  revalidatePath('/vendor/inventory');
  return item;
}

/**
 * Recalculates the total quantity and average cost price of an item based on its active batches.
 */
async function syncItemTotals(id: string) {
  const latestItem = await prisma.inventoryItem.findUnique({
    where: { id },
    include: { batches: { where: { isSoldOut: false, quantity: { gt: 0 } } } }
  });

  if (!latestItem) return;

  const totalQty = latestItem.batches.reduce((acc, b) => acc + b.quantity, 0);
  const totalValue = latestItem.batches.reduce((acc, b) => acc + (b.quantity * b.costPrice), 0);
  const avgCost = totalQty > 0 ? (totalValue / totalQty) : (latestItem.costPrice || 0);

  await prisma.inventoryItem.update({
    where: { id },
    data: { 
      quantity: totalQty,
      costPrice: avgCost
    }
  });
}

export async function logStockChange(
  id: string, 
  change: number, 
  type: 'IN' | 'OUT' | 'WASTE' | 'CORRECTION',
  reason: string,
  newCostPrice?: number 
) {
  const vendor = await requireVendor();

  const currentItem = await prisma.inventoryItem.findUnique({
    where: { id, vendorId: vendor.id },
    include: { batches: true }
  });

  if (!currentItem) throw new Error("Item not found");

  const prevStock = currentItem.quantity;
  
  if (type === 'IN' && change > 0) {
    await prisma.stockBatch.create({
      data: {
        inventoryItemId: id,
        quantity: change,
        costPrice: newCostPrice ?? currentItem.costPrice ?? 0,
        receivedDate: new Date(),
        batchNumber: `BAT-${Date.now().toString().slice(-6)}`
      }
    });
  } 
  else if ((type === 'OUT' || type === 'WASTE' || (type === 'CORRECTION' && change < 0))) {
    let amountToDeduct = Math.abs(change);
    const sortedBatches = currentItem.batches
      .filter(b => !b.isSoldOut && b.quantity > 0)
      .sort((a, b) => a.receivedDate.getTime() - b.receivedDate.getTime());

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
  }

  // Recalculate totals from batches to ensure consistency
  await syncItemTotals(id);
  
  const updatedItem = await prisma.inventoryItem.findUnique({ where: { id } });

  await prisma.stockHistory.create({
    data: {
      inventoryItemId: id,
      type,
      quantity: change,
      previousStock: prevStock,
      newStock: updatedItem?.quantity || 0,
      reason
    }
  });

  revalidatePath('/vendor/inventory');
  return updatedItem;
}

export async function updateStockBatch(batchId: string, newQuantity: number, reason: string) {
  const vendor = await requireVendor();

  const batch = await prisma.stockBatch.findUnique({
    where: { id: batchId },
    include: { inventoryItem: true }
  });

  if (!batch || batch.inventoryItem.vendorId !== vendor.id) {
    throw new Error("Batch not found or unauthorized");
  }

  const oldTotal = batch.inventoryItem.quantity;

  await prisma.stockBatch.update({
    where: { id: batchId },
    data: { 
      quantity: newQuantity,
      isSoldOut: newQuantity <= 0
    }
  });

  // Re-sync item totals
  await syncItemTotals(batch.inventoryItemId);

  const updatedItem = await prisma.inventoryItem.findUnique({ where: { id: batch.inventoryItemId } });

  await prisma.stockHistory.create({
    data: {
      inventoryItemId: batch.inventoryItemId,
      type: 'CORRECTION',
      quantity: newQuantity - batch.quantity,
      previousStock: oldTotal,
      newStock: updatedItem?.quantity || 0,
      reason: `Manual Batch Correction (${batch.batchNumber}): ${reason}`
    }
  });

  revalidatePath('/vendor/inventory');
  return { success: true };
}

export async function archiveInventoryItem(id: string) {
  const vendor = await requireVendor();
  await prisma.inventoryItem.update({
    where: { id, vendorId: vendor.id },
    data: { isArchived: true }
  });
  revalidatePath('/vendor/inventory');
  return { success: true };
}

export async function updateInventoryItem(id: string, data: {
  name: string;
  sku?: string;
  barcode?: string;
  category: string;
  unit: string;
  lowStockThreshold: number;
  costPrice?: number;
  price?: number;
  supplier?: string;
  brand?: string;
  location?: string;
  expiryDate?: Date;
}) {
  const vendor = await requireVendor();

  const item = await prisma.inventoryItem.update({
    where: { id, vendorId: vendor.id },
    data: {
      name: data.name,
      sku: data.sku,
      barcode: data.barcode,
      category: data.category,
      unit: data.unit,
      lowStockThreshold: Number(data.lowStockThreshold) || 0,
      costPrice: data.costPrice !== undefined ? (Number(data.costPrice) || 0) : undefined,
      price: data.price !== undefined ? (Number(data.price) || 0) : undefined,
      supplier: data.supplier,
      brand: data.brand,
      location: data.location,
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined
    }
  });

  revalidatePath('/vendor/inventory');
  return item;
}

export async function deleteInventoryItem(id: string) {
  const vendor = await requireVendor();
  await prisma.inventoryItem.delete({
    where: { id, vendorId: vendor.id }
  });
  revalidatePath('/vendor/inventory');
  return { success: true };
}

export async function getItemHistory(id: string) {
  const vendor = await requireVendor();
  return await prisma.stockHistory.findMany({
    where: { 
      inventoryItemId: id,
      inventoryItem: { vendorId: vendor.id }
    },
    orderBy: { createdAt: 'desc' },
    take: 50
  });
}

export async function getInventoryItemByBarcode(barcode: string) {
  const vendor = await requireVendor();
  return await prisma.inventoryItem.findFirst({
    where: { barcode, vendorId: vendor.id },
    include: { batches: true }
  });
}

export async function checkoutItems(itemsToDeduct: { id: string, quantity: number }[]) {
  const vendor = await requireVendor();
  for (const entry of itemsToDeduct) {
    await logStockChange(
      entry.id,
      -entry.quantity,
      'OUT',
      'POS Sale / Checkout'
    );
  }
  revalidatePath('/vendor/inventory');
  return { success: true };
}
