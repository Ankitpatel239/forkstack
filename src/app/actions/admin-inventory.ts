
'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getAllInventoryItems() {
  return await prisma.inventoryItem.findMany({
    include: {
      vendor: {
        select: {
          businessName: true,
          tenantSlug: true
        }
      },
      inventoryCategory: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function adminUpdateStock(id: string, newQuantity: number, reason: string) {
  const item = await prisma.inventoryItem.findUnique({ where: { id } });
  if (!item) throw new Error("Item not found");

  const prevStock = item.quantity;
  
  const updated = await prisma.inventoryItem.update({
    where: { id },
    data: { quantity: newQuantity }
  });

  await prisma.stockHistory.create({
    data: {
      inventoryItemId: id,
      type: 'CORRECTION',
      quantity: newQuantity - prevStock,
      previousStock: prevStock,
      newStock: newQuantity,
      reason: `ADMIN CORRECTION: ${reason}`
    }
  });

  revalidatePath('/admin/inventory');
  return updated;
}

export async function adminDeleteInventoryItem(id: string) {
  await prisma.inventoryItem.delete({ where: { id } });
  revalidatePath('/admin/inventory');
  return { success: true };
}
