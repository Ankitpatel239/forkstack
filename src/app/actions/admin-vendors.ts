'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateVendorSubscription(vendorId: string, data: {
  plan: any;
  status: any;
  expiryDate: Date;
}) {
  try {
    // Using raw SQL to bypass stale enum validation in the generated Prisma client
    await prisma.$executeRawUnsafe(
      `UPDATE "VendorProfile" SET "subscriptionPlan" = $1, "subscriptionStatus" = $2::"SubscriptionStatus", "subscriptionEnd" = $3 WHERE "id" = $4`,
      data.plan,
      data.status,
      data.expiryDate,
      vendorId
    );
    revalidatePath('/admin/vendors');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createVendor(data: {
  businessName: string;
  tenantSlug: string;
  businessEmail: string;
  businessPhone: string;
  subscriptionPlan: string;
  address: string;
}) {
  try {
    // 1. Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: data.businessEmail },
    });

    if (!user) {
      // Create the user with VENDOR_OWNER role
      user = await prisma.user.create({
        data: {
          email: data.businessEmail,
          name: data.businessName + ' Owner',
          role: 'VENDOR_OWNER',
          isActive: true,
        },
      });
    }

    // 2. Check if slug already exists
    const existingVendor = await prisma.vendorProfile.findUnique({
      where: { tenantSlug: data.tenantSlug },
    });
    if (existingVendor) {
      return { success: false, error: 'Tenant slug already exists' };
    }

    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    // 3. Create the vendor profile
    await prisma.vendorProfile.create({
      data: {
        ownerId: user.id,
        businessName: data.businessName,
        businessPhone: data.businessPhone,
        businessEmail: data.businessEmail,
        address: data.address,
        tenantSlug: data.tenantSlug,
        subscriptionPlan: data.subscriptionPlan,
        subscriptionStatus: 'ACTIVE' as any,
        subscriptionEnd: oneYearFromNow,
      }
    });

    revalidatePath('/admin/vendors');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateVendor(vendorId: string, data: {
  businessName: string;
  tenantSlug: string;
  businessEmail: string;
  businessPhone: string;
  subscriptionPlan: string;
  address: string;
}) {
  try {
    // 1. Check if slug exists on a different vendor
    const existingSlug = await prisma.vendorProfile.findFirst({
      where: {
        tenantSlug: data.tenantSlug,
        NOT: { id: vendorId }
      }
    });
    if (existingSlug) {
      return { success: false, error: 'Tenant slug is already in use' };
    }

    // 2. Update the vendor profile
    await prisma.vendorProfile.update({
      where: { id: vendorId },
      data: {
        businessName: data.businessName,
        tenantSlug: data.tenantSlug,
        businessEmail: data.businessEmail,
        businessPhone: data.businessPhone,
        subscriptionPlan: data.subscriptionPlan,
        address: data.address,
      }
    });

    revalidatePath('/admin/vendors');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function suspendVendor(vendorId: string, suspend: boolean) {
  try {
    await prisma.vendorProfile.update({
      where: { id: vendorId },
      data: {
        subscriptionStatus: (suspend ? 'SUSPENDED' : 'ACTIVE') as any
      }
    });
    revalidatePath('/admin/vendors');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteVendor(vendorId: string) {
  try {
    // Delete cascading and dependent records manually to prevent foreign key errors
    await prisma.userVendorAssignment.deleteMany({ where: { vendorId } });
    await prisma.menuItem.deleteMany({ where: { vendorId } });
    await prisma.menuCategory.deleteMany({ where: { vendorId } });
    await prisma.inventoryItem.deleteMany({ where: { vendorId } });
    await prisma.order.deleteMany({ where: { vendorId } });
    await prisma.payment.deleteMany({ where: { vendorId } });
    await prisma.table.deleteMany({ where: { vendorId } });
    
    // Finally, delete the vendor
    await prisma.vendorProfile.delete({
      where: { id: vendorId }
    });
    revalidatePath('/admin/vendors');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
