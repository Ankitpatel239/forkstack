
'use server';

import { prisma } from '@/lib/db';
import { requireVendor } from '@/lib/vendor';
import { revalidatePath } from 'next/cache';

export async function submitFeatureRequest(data: {
  title: string;
  description: string;
  priority: string;
}) {
  try {
    const vendor = await requireVendor();
    
    const request = await (prisma as any).featureRequest.create({
      data: {
        ...data,
        vendorId: vendor.id,
        status: 'PENDING'
      }
    });
    
    revalidatePath('/vendor/requests');
    return { success: true, data: request };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getVendorRequests() {
  try {
    const vendor = await requireVendor();
    const requests = await (prisma as any).featureRequest.findMany({
      where: { vendorId: vendor.id },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: requests };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAllFeatureRequests() {
  try {
    const requests = await (prisma as any).featureRequest.findMany({
      include: {
        vendor: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: requests };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateRequestStatus(id: string, status: string, adminNotes?: string) {
  try {
    await (prisma as any).featureRequest.update({
      where: { id },
      data: { status, adminNotes }
    });
    revalidatePath('/admin/requests');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
