
'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getSystemSettings() {
  try {
    const settings = await (prisma as any).systemSetting.findMany();
    return { success: true, data: settings };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateSystemSettings(settings: { key: string, value: string, group?: string }[]) {
  try {
    for (const setting of settings) {
      await (prisma as any).systemSetting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: { 
          key: setting.key, 
          value: setting.value,
          group: setting.group || 'GENERAL'
        }
      });
    }
    revalidatePath('/admin/settings');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
