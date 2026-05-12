
'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getFeatures() {
  try {
    const features = await (prisma as any).platformFeature.findMany({
      orderBy: { category: 'asc' }
    });
    return { success: true, data: features };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function upsertFeature(data: {
  key: string;
  label: string;
  categoryName: string;
  description?: string;
}) {
  try {
    const feature = await (prisma as any).platformFeature.upsert({
      where: { key: data.key },
      update: data,
      create: data,
    });
    revalidatePath('/admin/plans');
    return { success: true, data: feature };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteFeature(id: string) {
  try {
    await (prisma as any).platformFeature.delete({ where: { id } });
    revalidatePath('/admin/plans');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
