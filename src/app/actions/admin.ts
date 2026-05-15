'use server';

import { prisma } from '@/lib/db';
import { Role, SubscriptionStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

// ========== VENDOR ACTIONS ==========

export async function createVendor(data: {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  address: string;
  tenantSlug: string;
  subscriptionPlan: string;
  ownerId?: string;
}) {
  try {
    const vendor = await prisma.vendorProfile.create({
      data: {
        ...(data as any),
        subscriptionStatus: 'ACTIVE',
        subscriptionEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year default
      }
    });
    revalidatePath('/admin/vendors');
    return { success: true, data: vendor };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateVendor(id: string, data: any) {
  try {
    const vendor = await prisma.vendorProfile.update({
      where: { id },
      data: data as any
    });
    revalidatePath('/admin/vendors');
    return { success: true, data: vendor };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteVendor(id: string) {
  try {
    await prisma.vendorProfile.delete({ where: { id } });
    revalidatePath('/admin/vendors');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ========== USER / ACCESS ACTIONS ==========

export async function updateUserRole(userId: string, role: Role) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role }
    });
    revalidatePath('/admin/team');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleUserStatus(userId: string, isActive: boolean) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isActive }
    });
    revalidatePath('/admin/team');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

import bcrypt from 'bcrypt';

export async function provisionUser(data: {
  name: string;
  email: string;
  role: Role;
  password?: string;
}) {
  try {
    const hashedPassword = await bcrypt.hash(data.password || 'ForkStack2024!', 10);
    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      }
    });
    revalidatePath('/admin/team');
    return { success: true, data: user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function resetUserPassword(userId: string, newPassword?: string) {
  try {
    const hashedPassword = await bcrypt.hash(newPassword || 'Reset@123!', 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteUser(userId: string) {
  try {
    await prisma.user.delete({ where: { id: userId } });
    revalidatePath('/admin/team');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ========== PLAN ACTIONS ==========

export async function upsertPlan(data: {
  name: string;
  categoryName: string;
  displayName: string;
  description?: string;
  price: number;
  features: string[];
  limits?: any;
}) {
  try {
    const plan = await (prisma as any).platformPlan.upsert({
      where: { name: data.name },
      update: data,
      create: data,
    });
    revalidatePath('/admin/plans');
    return { success: true, data: plan };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deletePlan(id: string) {
  try {
    await (prisma as any).platformPlan.delete({ where: { id } });
    revalidatePath('/admin/plans');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
