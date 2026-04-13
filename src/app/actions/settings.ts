
'use server';

import { prisma } from '@/lib/db';
import { requireVendor } from '@/lib/vendor';
import { revalidatePath } from 'next/cache';

import { uploadToGoogleDrive, deleteFromGoogleDrive } from '@/lib/gdrive';

export async function updateVendorSettings(data: {
  businessName?: string;
  businessEmail?: string;
  businessPhone?: string;
  address?: string;
  description?: string;
  metaTags?: string;
  isLocked?: boolean;
  lockPassword?: string;
  logoUrl?: string;
}) {
  const vendor = await requireVendor();

  // If logoUrl is a Base64 string, upload to Google Drive
  let finalData = { ...data };
  if (data.logoUrl?.startsWith('data:image')) {
    try {
      // Purge old logo if it exists on drive
      if (vendor.logoUrl?.includes('drive.google.com')) {
        await deleteFromGoogleDrive(vendor.id, vendor.logoUrl);
      }

      const fileName = `logo_${vendor.tenantSlug}_${Date.now()}.png`;
      const driveUrl = await uploadToGoogleDrive(vendor.id, data.logoUrl, fileName, 'Branding');
      finalData.logoUrl = driveUrl;
    } catch (error) {
      console.error('Logo rotate on drive failed:', error);
    }
  }

  await prisma.vendorProfile.update({
    where: { id: vendor.id },
    data: finalData
  });

  revalidatePath('/vendor/settings');
  revalidatePath('/(dashboard)/vendor/layout'); // In case header depends on it
  return { success: true };
}

export async function addConnectedDrive(data: {
  name: string;
  type: string;
  bucket?: string;
  region?: string;
  accessKey?: string;
  secretKey?: string;
  endpoint?: string;
  capacity?: number;
}) {
  const vendor = await requireVendor();

  await prisma.connectedDrive.create({
    data: {
      ...data,
      vendorId: vendor.id
    }
  });

  revalidatePath('/vendor/settings');
  return { success: true };
}

export async function deleteConnectedDrive(id: string) {
  const vendor = await requireVendor();

  await prisma.connectedDrive.delete({
    where: { 
      id,
      vendorId: vendor.id // Ensure owner
    }
  });

  revalidatePath('/vendor/settings');
  return { success: true };
}
