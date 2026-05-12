
'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateFeatureRequest(id: string, data: {
  status?: string;
  adminNotes?: string;
  priority?: string;
}) {
  try {
    const request = await prisma.featureRequest.update({
      where: { id },
      data
    });
    revalidatePath('/admin/requests');
    return { success: true, data: request };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteFeatureRequest(id: string) {
  try {
    await prisma.featureRequest.delete({ where: { id } });
    revalidatePath('/admin/requests');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
