'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function seedPlatformCategories() {
  const categories = [
    { name: 'MENU', label: 'Menu Management', description: 'Core digital menu and QR ordering systems.', icon: 'LayoutGrid' },
    { name: 'POS', label: 'Point of Sale', description: 'Point of Sale and billing systems.', icon: 'CreditCard' },
    { name: 'ORDER', label: 'Order Management', description: 'Complete order management.', icon: 'ShoppingCart' },
    
    { name: 'TIFFIN', label: 'Tiffin Service', description: 'Subscription based meal delivery orchestration.', icon: 'Package' },
    { name: 'HYBRID', label: 'Hybrid Stack', description: 'Complete restaurant and delivery management suite.', icon: 'Zap' },
    { name: 'ENTERPRISE', label: 'Enterprise', description: 'Custom infrastructure for large hospitality groups.', icon: 'ShieldCheck' },
  ];

  try {
    for (const cat of categories) {
      await (prisma as any).platformCategory.upsert({
        where: { name: cat.name },
        update: cat,
        create: cat,
      });
    }
    revalidatePath('/admin/plans');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function seedPlatformLimits() {
  const limits = [
    { key: 'menuItems', label: 'Menu Items', unit: 'Items', description: 'Maximum number of items in digital menu' },
    { key: 'staff', label: 'Staff Accounts', unit: 'Users', description: 'Number of team members allowed' },
    { key: 'whatsapp', label: 'WhatsApp Alerts', unit: 'Msgs', description: 'Monthly WhatsApp notification quota' },
    { key: 'storage', label: 'Cloud Storage', unit: 'GB', description: 'Storage for media and documents' },
    { key: 'posTable', label: 'POS Tables', unit: 'Tables', description: 'Number of active tables supported' },
    { key: 'deliveryRadius', label: 'Delivery Radius', unit: 'KM', description: 'Supported delivery distance' },
  ];

  try {
    for (const limit of limits) {
      await (prisma as any).platformLimit.upsert({
        where: { key: limit.key },
        update: limit,
        create: limit,
      });
    }
    revalidatePath('/admin/plans');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function seedPlatformFeatures() {
  const features = [
    // MENU
    { key: 'QR_ORDERING', label: 'QR Table Ordering', categoryName: 'MENU', description: 'Self-service ordering via QR codes' },
    { key: 'DIGITAL_MENU', label: 'Digital Menu', categoryName: 'MENU', description: 'Interactive mobile-friendly menu' },
    { key: 'BASIC_ANALYTICS', label: 'Basic Analytics', categoryName: 'MENU', description: 'Daily sales and order reports' },
    
    // TIFFIN
    { key: 'AUTO_RENEWAL', label: 'Auto-Renewal', categoryName: 'TIFFIN', description: 'Automatic subscription renewal management' },
    { key: 'DIET_PREFERENCES', label: 'Dietary Mapping', categoryName: 'TIFFIN', description: 'Advanced diet and spice level tracking' },
    { key: 'DELIVERY_TRACKING', label: 'Rider App Access', categoryName: 'TIFFIN', description: 'Real-time delivery management for riders' },
    
    // HYBRID
    { key: 'INVENTORY_SYNC', label: 'Inventory Engine', categoryName: 'HYBRID', description: 'Real-time stock tracking and alerts' },
    { key: 'ADVANCED_REPORTS', label: 'Financial Matrix', categoryName: 'HYBRID', description: 'Deep-dive financial and usage analytics' },
    { key: 'MULTI_VENDOR', label: 'Multi-Store Support', categoryName: 'HYBRID', description: 'Manage multiple branches from one dashboard' },
    
    // ENTERPRISE
    { key: 'WHITE_LABEL', label: 'White Labeling', categoryName: 'ENTERPRISE', description: 'Full custom branding and domain support' },
    { key: 'API_ACCESS', label: 'External API Access', categoryName: 'ENTERPRISE', description: 'Connect third-party apps to your data' },
    { key: 'CUSTOM_CONTRACTS', label: 'Custom Contracts', categoryName: 'ENTERPRISE', description: 'Tailored billing and SLA terms' },
    
    // GLOBAL / CORE
    { key: 'TEAM_MANAGEMENT', label: 'Staff & Roles', categoryName: 'HYBRID', description: 'Manage team members and granular permissions' },
  ];

  try {
    for (const feature of features) {
      await (prisma as any).platformFeature.upsert({
        where: { key: feature.key },
        update: feature,
        create: feature,
      });
    }
    revalidatePath('/admin/plans');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function seedDemoPlans() {
  const plans = [
    // MENU PLANS
    {
      name: 'MENU_BASIC',
      categoryName: 'MENU',
      displayName: 'Digital Starter',
      description: 'Essential digital presence for small cafes.',
      price: 999,
      features: ['DIGITAL_MENU', 'BASIC_ANALYTICS'],
      limits: { menuItems: 50, staff: 2, whatsapp: 100, posTable: 5 },
    },
    {
      name: 'MENU_PRO',
      categoryName: 'MENU',
      displayName: 'Smart Dining',
      description: 'Full QR ordering and advanced management.',
      price: 2499,
      features: ['DIGITAL_MENU', 'QR_ORDERING', 'BASIC_ANALYTICS', 'TEAM_MANAGEMENT'],
      limits: { menuItems: 200, staff: 5, whatsapp: 1000, posTable: 20 },
    },
    {
      name: 'MENU_ELITE',
      categoryName: 'MENU',
      displayName: 'Ultimate Menu',
      description: 'High-volume dining with priority support.',
      price: 4999,
      features: ['DIGITAL_MENU', 'QR_ORDERING', 'BASIC_ANALYTICS', 'ADVANCED_REPORTS', 'TEAM_MANAGEMENT'],
      limits: { menuItems: 0, staff: 15, whatsapp: 5000, posTable: 0 },
    },

    // TIFFIN PLANS
    {
      name: 'TIFFIN_CORE',
      categoryName: 'TIFFIN',
      displayName: 'Tiffin Basic',
      description: 'Organize your daily meal deliveries.',
      price: 1499,
      features: ['AUTO_RENEWAL', 'DIET_PREFERENCES'],
      limits: { staff: 3, whatsapp: 500, deliveryRadius: 5 },
    },
    {
      name: 'TIFFIN_PRO',
      categoryName: 'TIFFIN',
      displayName: 'Delivery Pro',
      description: 'Scale your catering business with ease.',
      price: 3999,
      features: ['AUTO_RENEWAL', 'DIET_PREFERENCES', 'DELIVERY_TRACKING', 'TEAM_MANAGEMENT'],
      limits: { staff: 10, whatsapp: 3000, deliveryRadius: 15 },
    },
    {
      name: 'TIFFIN_UNLIMITED',
      categoryName: 'TIFFIN',
      displayName: 'Catering Giant',
      description: 'Enterprise grade delivery orchestration.',
      price: 8999,
      features: ['AUTO_RENEWAL', 'DIET_PREFERENCES', 'DELIVERY_TRACKING', 'INVENTORY_SYNC', 'TEAM_MANAGEMENT'],
      limits: { staff: 0, whatsapp: 10000, deliveryRadius: 50 },
    },

    // HYBRID PLANS
    {
      name: 'HYBRID_SYNC',
      categoryName: 'MENU',
      displayName: 'Hybrid Standard',
      description: 'Combined power of dine-in and inventory tracking.',
      price: 5999,
      features: ['DIGITAL_MENU', 'QR_ORDERING', 'INVENTORY_SYNC', 'TEAM_MANAGEMENT'],
      limits: { menuItems: 500, staff: 20, whatsapp: 5000, posTable: 50 },
    },

    // ENTERPRISE
    {
      name: 'ENTERPRISE_CUSTOM',
      categoryName: 'ENTERPRISE',
      displayName: 'Platform Scaler',
      description: 'The definitive solution for hospitality chains.',
      price: 19999,
      features: ['WHITE_LABEL', 'API_ACCESS', 'MULTI_VENDOR', 'CUSTOM_CONTRACTS', 'TEAM_MANAGEMENT'],
      limits: { menuItems: 0, staff: 0, whatsapp: 0, storage: 100, posTable: 0 },
    },
    // VENDOR ALL ACCESS
    {
      name: 'VENDOR_ALL_ACCESS',
      categoryName: 'HYBRID',
      displayName: 'Vendor All Access',
      description: 'Supercharged master plan unlocking all digital menu, POS, tiffin, and hybrid backend services with absolutely zero limits.',
      price: 0,
      features: [
        'QR_ORDERING', 'DIGITAL_MENU', 'BASIC_ANALYTICS', 
        'AUTO_RENEWAL', 'DIET_PREFERENCES', 'DELIVERY_TRACKING', 
        'INVENTORY_SYNC', 'ADVANCED_REPORTS', 'MULTI_VENDOR', 
        'WHITE_LABEL', 'API_ACCESS', 'CUSTOM_CONTRACTS', 'TEAM_MANAGEMENT'
      ],
      limits: { menuItems: 0, staff: 0, whatsapp: 0, storage: 0, posTable: 0, deliveryRadius: 0 },
    },
  ];

  try {
    for (const planData of plans) {
      const { features, limits, ...baseData } = planData;
      
      await (prisma as any).platformPlan.upsert({
        where: { name: baseData.name },
        update: {
          ...baseData,
          features: {
            set: features.map((f: string) => ({ key: f }))
          },
          limits: {
            deleteMany: {},
            create: Object.entries(limits).map(([key, value]) => ({
              limitKey: key,
              value: value as number
            }))
          }
        },
        create: {
          ...baseData,
          features: {
            connect: features.map((f: string) => ({ key: f }))
          },
          limits: {
            create: Object.entries(limits).map(([key, value]) => ({
              limitKey: key,
              value: value as number
            }))
          }
        },
      });
    }
    revalidatePath('/admin/plans');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
