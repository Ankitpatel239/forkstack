
'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';

export async function getCategories() {
  try {
    const categories = await (prisma as any).platformCategory.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: categories };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function upsertCategory(data: {
  id?: string;
  name: string;
  label: string;
  description?: string;
  icon?: string;
}) {
  try {
    const category = await (prisma as any).platformCategory.upsert({
      where: { name: data.name },
      update: data,
      create: data,
    });
    revalidatePath('/admin/plans');
    return { success: true, data: category };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCategory(id: string) {
  try {
    await (prisma as any).platformCategory.delete({ where: { id } });
    revalidatePath('/admin/plans');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
