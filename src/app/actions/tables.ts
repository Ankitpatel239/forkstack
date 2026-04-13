
'use server';

import { prisma } from '@/lib/db';
import { requireVendor } from '@/lib/vendor';
import { revalidatePath } from 'next/cache';
import { TableStatus } from '@prisma/client';

export async function createTable(data: {
  tableNumber: string;
  capacity: number;
  chairCount: number;
  location?: string;
}) {
  const vendor = await requireVendor();
  
  const table = await prisma.table.create({
    data: {
      ...data,
      vendorId: vendor.id,
      status: 'AVAILABLE'
    }
  });

  revalidatePath('/vendor/tables');
  return table;
}

export async function updateTable(id: string, data: {
  tableNumber?: string;
  capacity?: number;
  chairCount?: number;
  location?: string;
  status?: TableStatus;
  isActive?: boolean;
}) {
  const vendor = await requireVendor();

  const table = await prisma.table.update({
    where: { id, vendorId: vendor.id },
    data
  });

  revalidatePath('/vendor/tables');
  return table;
}

export async function deleteTable(id: string) {
  const vendor = await requireVendor();
  
  await prisma.table.delete({
    where: { id, vendorId: vendor.id }
  });

  revalidatePath('/vendor/tables');
  return { success: true };
}

export async function getTables() {
  const vendor = await requireVendor();
  return prisma.table.findMany({
    where: { vendorId: vendor.id },
    orderBy: { tableNumber: 'asc' }
  });
}
