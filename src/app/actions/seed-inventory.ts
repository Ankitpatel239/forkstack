
'use server';

import { prisma } from '@/lib/db';
import { requireVendor } from '@/lib/vendor';
import { createInventoryItem } from './inventory';

export async function seedVendorInventory() {
  const vendor = await requireVendor();
  
  const items = [
    // Electronics / Reseller
    { name: 'iPhone 15 Pro 256GB', category: 'Electronics', quantity: 15, unit: 'Pcs', lowStockThreshold: 3, costPrice: 95000, supplier: 'Apple India', brand: 'Apple', location: 'Section A-1' },
    { name: 'Samsung Galaxy S24', category: 'Electronics', quantity: 10, unit: 'Pcs', lowStockThreshold: 2, costPrice: 72000, supplier: 'Samsung Direct', brand: 'Samsung', location: 'Section A-2' },
    
    // Industrial / Raw Materials (Godown)
    { name: 'Cement PPC (50kg)', category: 'Raw Materials', quantity: 500, unit: 'Bags', lowStockThreshold: 100, costPrice: 380, supplier: 'UltraTech', brand: 'UltraTech', location: 'Godown 1 / Floor 0' },
    { name: 'Steel TMT Bars (12mm)', category: 'Raw Materials', quantity: 2000, unit: 'Kg', lowStockThreshold: 500, costPrice: 65, supplier: 'Tata Steel', brand: 'Tata', location: 'Godown 2 / Yard' },
    
    // FMCG / Reseller
    { name: 'Refined Oil (1L)', category: 'FMCG', quantity: 240, unit: 'Bottles', lowStockThreshold: 48, costPrice: 145, supplier: 'Fortune Dist.', brand: 'Fortune', location: 'Shelf C-5' },
    { name: 'Premium Basmati Rice', category: 'FMCG', quantity: 50, unit: 'Kg', lowStockThreshold: 10, costPrice: 180, supplier: 'India Gate', brand: 'India Gate', location: 'Shelf C-8' },

    // Office Supplies / Warehouse
    { name: 'A4 Paper Rim (500s)', category: 'Office Supplies', quantity: 100, unit: 'Rims', lowStockThreshold: 20, costPrice: 280, supplier: 'JK Paper', brand: 'JK', location: 'Office Stock Room' },
    { name: 'Ergonomic Office Chair', category: 'Furniture', quantity: 12, unit: 'Units', lowStockThreshold: 2, costPrice: 4500, supplier: 'Featherlite', brand: 'Featherlite', location: 'Warehouse B' },
    
    // Packaging
    { name: 'Corrugated Boxes (L)', category: 'Packaging', quantity: 1000, unit: 'Pcs', lowStockThreshold: 200, costPrice: 14, supplier: 'Local Pack', brand: 'Generic', location: 'Packing Zone' },
  ];

  for (const item of items) {
    // Check if exists
    const exists = await prisma.inventoryItem.findFirst({
        where: { vendorId: vendor.id, name: item.name }
    });
    
    if (!exists) {
        await createInventoryItem(item as any);
    }
  }

  return { success: true, count: items.length };
}
