
'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getMasterCategories() {
  return await prisma.masterCategory.findMany({
    include: {
      children: true
    },
    orderBy: { sortOrder: 'asc' }
  });
}

export async function upsertMasterCategory(data: {
  id?: string;
  name: string;
  parentId?: string | null;
  level?: number;
  sortOrder?: number;
}) {
  const { id, ...rest } = data;
  
  if (id) {
    const updated = await prisma.masterCategory.update({
      where: { id },
      data: {
        ...rest,
        parentId: rest.parentId || null
      }
    });
    return updated;
  }
  
  const created = await prisma.masterCategory.create({
    data: {
      ...rest,
      parentId: rest.parentId || null
    }
  });
  return created;
}

export async function deleteMasterCategory(id: string) {
  await prisma.masterCategory.delete({ where: { id } });
  return { success: true };
}

export async function updateMasterSortOrder(items: { id: string, sortOrder: number, parentId: string | null }[]) {
  for (const item of items) {
    await prisma.masterCategory.update({
      where: { id: item.id },
      data: { 
        sortOrder: item.sortOrder,
        parentId: item.parentId
      }
    });
  }
  return { success: true };
}
