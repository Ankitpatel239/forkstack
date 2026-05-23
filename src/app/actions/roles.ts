'use server';

import { prisma } from '@/lib/db';
import { requireVendor } from '@/lib/vendor';
import { revalidatePath } from 'next/cache';

const DEFAULT_ROLES = [
  { name: 'MANAGER', description: 'Full access to vendor dashboard and operations.' },
  { name: 'KITCHEN', description: 'Access to kitchen display system and production.' },
  { name: 'CASHIER', description: 'Access to POS and billing operations.' },
  { name: 'WAITER', description: 'Access to QR ordering and table management.' },
  { name: 'DELIVERY', description: 'Access to delivery tracking and dispatch.' }
];

export async function getVendorRoles() {
  const vendor = await requireVendor();

  let roles = await prisma.vendorRole.findMany({
    where: { vendorId: vendor.id },
    orderBy: { createdAt: 'asc' }
  });

  if (roles.length === 0) {
    // Auto-create default roles
    await prisma.vendorRole.createMany({
      data: DEFAULT_ROLES.map(r => ({
        vendorId: vendor.id,
        name: r.name,
        description: r.description
      }))
    });

    roles = await prisma.vendorRole.findMany({
      where: { vendorId: vendor.id },
      orderBy: { createdAt: 'asc' }
    });
  }

  return roles;
}

export async function createVendorRole(name: string, description?: string) {
  const vendor = await requireVendor();
  
  if (!name.trim()) throw new Error('Role name is required');
  const cleanName = name.trim().toUpperCase();

  const existing = await prisma.vendorRole.findFirst({
    where: { vendorId: vendor.id, name: cleanName }
  });

  if (existing) {
    throw new Error('Role already exists');
  }

  const role = await prisma.vendorRole.create({
    data: {
      vendorId: vendor.id,
      name: cleanName,
      description
    }
  });

  revalidatePath('/vendor/staff');
  revalidatePath('/vendor/settings');
  return role;
}

export async function deleteVendorRole(id: string) {
  const vendor = await requireVendor();

  // First check if role is assigned to any user
  const role = await prisma.vendorRole.findUnique({
    where: { id }
  });

  if (!role || role.vendorId !== vendor.id) {
    throw new Error('Role not found');
  }

  const assignedUsers = await prisma.userVendorAssignment.count({
    where: {
      vendorId: vendor.id,
      roleInVendor: role.name
    }
  });

  if (assignedUsers > 0) {
    throw new Error(`Cannot delete role. It is assigned to ${assignedUsers} active staff members.`);
  }

  await prisma.vendorRole.delete({
    where: { id }
  });

  revalidatePath('/vendor/staff');
  revalidatePath('/vendor/settings');
}
