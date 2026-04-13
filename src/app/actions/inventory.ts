
'use server';

import { prisma } from '@/lib/db';
import { requireVendor } from '@/lib/vendor';
import { revalidatePath } from 'next/cache';

export async function createInventoryItem(data: {
  name: string;
  sku?: string;
  category?: string;
  quantity: number;
  unit: string;
  lowStockThreshold: number;
  price: number;
}) {
  const vendor = await requireVendor();

  const item = await prisma.inventoryItem.create({
    data: {
      ...data,
      vendorId: vendor.id
    }
  });

  revalidatePath('/vendor/inventory');
  revalidatePath('/'); // in case dashboard stats use it
  return item;
}

export async function updateInventoryItem(id: string, data: {
  name?: string;
  sku?: string;
  category?: string;
  quantity?: number;
  unit?: string;
  lowStockThreshold?: number;
  price?: number;
}) {
  const vendor = await requireVendor();

  const item = await prisma.inventoryItem.update({
    where: { 
      id,
      vendorId: vendor.id 
    },
    data
  });

  revalidatePath('/vendor/inventory');
  return item;
}

export async function deleteInventoryItem(id: string) {
  const vendor = await requireVendor();

  await prisma.inventoryItem.delete({
    where: { 
      id,
      vendorId: vendor.id 
    }
  });

  revalidatePath('/vendor/inventory');
  return { success: true };
}

export async function adjustQuantity(id: string, amount: number) {
  const vendor = await requireVendor();

  const item = await prisma.inventoryItem.update({
    where: { 
      id,
      vendorId: vendor.id 
    },
    data: {
      quantity: {
        increment: amount
      }
    }
  });

  revalidatePath('/vendor/inventory');
  return item;
}
