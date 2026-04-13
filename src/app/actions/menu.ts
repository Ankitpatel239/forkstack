
'use server';

import { prisma } from '@/lib/db';
import { requireVendor } from '@/lib/vendor';
import { revalidatePath } from 'next/cache';

import { uploadToGoogleDrive, deleteFromGoogleDrive } from '@/lib/gdrive';

// CATEGORIES
export async function createMenuCategory(data: { name: string, parentId?: string }) {
  const vendor = await requireVendor();
  const category = await prisma.menuCategory.create({
    data: { ...data, vendorId: vendor.id }
  });
  revalidatePath('/vendor/menu/categories');
  revalidatePath('/vendor/menu/items');
  return category;
}

export async function updateMenuCategory(id: string, data: { name?: string, parentId?: string }) {
  const vendor = await requireVendor();
  const category = await prisma.menuCategory.update({
    where: { id, vendorId: vendor.id },
    data
  });
  revalidatePath('/vendor/menu/categories');
  revalidatePath('/vendor/menu/items');
  return category;
}

export async function deleteMenuCategory(id: string) {
  const vendor = await requireVendor();
  await prisma.menuCategory.delete({
    where: { id, vendorId: vendor.id }
  });
  revalidatePath('/vendor/menu/categories');
  revalidatePath('/vendor/menu/items');
  return { success: true };
}

export async function getMenuCategories() {
  const vendor = await requireVendor();
  return prisma.menuCategory.findMany({
    where: { vendorId: vendor.id },
    include: { children: true },
    orderBy: { sortOrder: 'asc' }
  });
}

// ITEMS
export async function createMenuItem(data: {
  name: string;
  price: number;
  categoryId?: string;
  description?: string;
  preparationTime?: number;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  isVegan?: boolean;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  isHalal?: boolean;
  spiciness?: number;
  allergens?: string[];
  ingredients?: string[];
  costPrice?: number;
  media?: { url: string; alt?: string; caption?: string; isMain: boolean }[];
}) {
  const vendor = await requireVendor();

  // Process Media
  const processedMedia = [];
  if (data.media && data.media.length > 0) {
    for (const m of data.media.slice(0, 8)) { // Cap at 8
      let finalUrl = m.url;
      if (m.url.startsWith('data:image')) {
        try {
          const fileName = `item_${vendor.tenantSlug}_${Date.now()}.png`;
          finalUrl = await uploadToGoogleDrive(vendor.id, m.url, fileName, 'Menu');
        } catch (e) { console.error('Gallery upload error:', e); }
      }
      processedMedia.push({ ...m, url: finalUrl });
    }
  }

  const thumbUrl = processedMedia.find(m => m.isMain)?.url || processedMedia[0]?.url || '';

  const item = await prisma.menuItem.create({
    data: {
      ...(({ media, ...rest }) => rest)(data),
      vendorId: vendor.id,
      imageUrl: thumbUrl,
      isAvailable: true,
      media: {
        create: processedMedia
      }
    }
  });

  revalidatePath('/vendor/menu/items');
  return item;
}

export async function updateMenuItem(id: string, data: {
  name?: string;
  price?: number;
  categoryId?: string;
  description?: string;
  isAvailable?: boolean;
  preparationTime?: number;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  isVegan?: boolean;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  isHalal?: boolean;
  spiciness?: number;
  allergens?: string[];
  ingredients?: string[];
  costPrice?: number;
  media?: { id?: string; url: string; alt?: string; caption?: string; isMain: boolean; delete?: boolean }[];
}) {
  const vendor = await requireVendor();

  const currentItem = await prisma.menuItem.findUnique({
    where: { id, vendorId: vendor.id },
    include: { media: true }
  });

  if (!currentItem) throw new Error('Item not found');

  const processedMedia = [];
  if (data.media) {
    for (const m of data.media) {
      if (m.delete && m.id) {
        try { await deleteFromGoogleDrive(vendor.id, m.url); } catch (e) {}
        await prisma.menuItemMedia.delete({ where: { id: m.id } });
        continue;
      }

      let finalUrl = m.url;
      if (m.url.startsWith('data:image')) {
        try {
          const fileName = `item_up_${vendor.tenantSlug}_${Date.now()}.png`;
          finalUrl = await uploadToGoogleDrive(vendor.id, m.url, fileName, 'Menu');
        } catch (e) {}
      }

      if (m.id) {
        await prisma.menuItemMedia.update({
          where: { id: m.id },
          data: { ...(({ id, url, delete: d, ...rest }) => rest)(m), url: finalUrl }
        });
      } else {
        processedMedia.push({ ...(({ url, ...rest }) => rest)(m), url: finalUrl });
      }
    }
  }

  // Determine main thumbnail
  const allMedia = await prisma.menuItemMedia.findMany({ where: { menuItemId: id } });
  const thumbUrl = allMedia.find(m => m.isMain)?.url || allMedia[0]?.url || '';

  const updatedItem = await prisma.menuItem.update({
    where: { id },
    data: {
      ...(({ media, ...rest }) => rest)(data),
      imageUrl: thumbUrl,
      media: {
        create: processedMedia
      }
    }
  });

  revalidatePath('/vendor/menu/items');
  return updatedItem;
}

export async function deleteMenuItem(id: string) {
  const vendor = await requireVendor();

  const item = await prisma.menuItem.findUnique({
    where: { id, vendorId: vendor.id }
  });

  if (item?.imageUrl) {
    try {
      await deleteFromGoogleDrive(vendor.id, item.imageUrl);
    } catch (error) {
      console.error('Failed to purge cloud asset:', error);
    }
  }

  await prisma.menuItem.delete({
    where: { 
      id,
      vendorId: vendor.id // security check
    }
  });

  revalidatePath('/vendor/menu/items');
  return { success: true };
}

export async function toggleMenuItemAvailability(id: string, currentStatus: boolean) {
  const vendor = await requireVendor();

  await prisma.menuItem.update({
    where: { 
      id,
      vendorId: vendor.id 
    },
    data: { isAvailable: !currentStatus }
  });

  revalidatePath('/vendor/menu/items');
}
