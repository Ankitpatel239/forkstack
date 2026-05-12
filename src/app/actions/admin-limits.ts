
'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getLimits() {
  try {
    const limits = await (prisma as any).platformLimit.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: limits };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function upsertLimit(data: {
  id?: string;
  key: string;
  label: string;
  unit?: string;
  description?: string;
}) {
  try {
    const limit = await (prisma as any).platformLimit.upsert({
      where: { key: data.key },
      update: data,
      create: data,
    });
    revalidatePath('/admin/plans');
    return { success: true, data: limit };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteLimit(id: string) {
  try {
    await (prisma as any).platformLimit.delete({ where: { id } });
    revalidatePath('/admin/plans');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
