'use server';

import { prisma } from '@/lib/db';
import { requireVendor } from '@/lib/vendor';
import { revalidatePath } from 'next/cache';

// ========== MARKETING SETTINGS & ACCOUNTS ==========

export async function connectSocialAccount(data: {
  platform: string; // 'FACEBOOK' | 'INSTAGRAM'
  accountId: string;
  accountName: string;
  accessToken: string;
}) {
  const vendor = await requireVendor();

  const existing = await prisma.socialAccount.findFirst({
    where: {
      vendorId: vendor.id,
      platform: data.platform,
      accountId: data.accountId
    }
  });

  if (existing) {
    await prisma.socialAccount.update({
      where: { id: existing.id },
      data: {
        accountName: data.accountName,
        accessToken: data.accessToken,
        isActive: true
      }
    });
  } else {
    await prisma.socialAccount.create({
      data: {
        vendorId: vendor.id,
        platform: data.platform,
        accountId: data.accountId,
        accountName: data.accountName,
        accessToken: data.accessToken,
        isActive: true
      }
    });
  }

  revalidatePath('/vendor/marketing');
}

export async function getSocialAccounts() {
  const vendor = await requireVendor();
  return await prisma.socialAccount.findMany({
    where: { vendorId: vendor.id },
    orderBy: { createdAt: 'asc' }
  });
}

export async function disconnectSocialAccount(accountId: string) {
  const vendor = await requireVendor();
  
  await prisma.socialAccount.delete({
    where: { 
      id: accountId,
      vendorId: vendor.id 
    }
  });

  revalidatePath('/vendor/marketing');
}

// ========== MARKETING POSTS ==========

export async function createMarketingPost(data: {
  content: string;
  mediaUrls: string[];
  mediaType: string; // 'IMAGE' | 'VIDEO' | 'CAROUSEL'
  platforms: string[];
  status: string; // 'DRAFT' | 'SCHEDULED' | 'PUBLISHED'
  scheduledFor?: Date;
}) {
  const vendor = await requireVendor();

  const post = await prisma.marketingPost.create({
    data: {
      vendorId: vendor.id,
      content: data.content,
      mediaUrls: data.mediaUrls,
      mediaType: data.mediaType,
      platforms: data.platforms,
      status: data.status,
      scheduledFor: data.scheduledFor
    }
  });

  revalidatePath('/vendor/marketing');
  return post;
}

export async function getMarketingPosts() {
  const vendor = await requireVendor();
  return await prisma.marketingPost.findMany({
    where: { vendorId: vendor.id },
    orderBy: { createdAt: 'desc' }
  });
}

export async function deleteMarketingPost(postId: string) {
  const vendor = await requireVendor();
  await prisma.marketingPost.delete({
    where: { 
      id: postId,
      vendorId: vendor.id
    }
  });
  revalidatePath('/vendor/marketing');
}
