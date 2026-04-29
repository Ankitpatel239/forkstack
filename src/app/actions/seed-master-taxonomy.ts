
'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

const MASTER_TAXONOMY = [
  {
    name: "Raw Materials",
    children: [
      "Metals", "Polymers", "Textiles", "Chemicals", "Minerals", "Timber", "Leather", "Ores"
    ]
  },
  {
    name: "Food & Beverages",
    children: [
      "Grains", "Vegetables", "Fruits", "Dairy", "Meat & Poultry", "Seafood", "Beverages", "Spices", "Frozen Foods", "Bakery"
    ]
  },
  {
    name: "Consumer Electronics",
    children: [
      "Smartphones", "Laptops", "Tablets", "Audio Systems", "Cameras", "Wearables", "Gaming", "Accessories"
    ]
  },
  {
    name: "Construction Supplies",
    children: [
      "Cement", "Steel Bars", "Bricks", "Sand & Gravel", "Paints", "Electrical Wiring", "Plumbing", "Roofing"
    ]
  },
  {
    name: "Automotive Parts",
    children: [
      "Engine Components", "Braking Systems", "Suspension", "Tires & Wheels", "Lighting", "Interior Trims", "Transmission"
    ]
  },
  {
    name: "Pharmaceuticals",
    children: [
      "Antibiotics", "Analgesics", "Vaccines", "Vitamins", "Surgical Tools", "Diagnostics", "First Aid"
    ]
  },
  {
    name: "Industrial Machinery",
    children: [
      "Hydraulics", "Pneumatics", "Power Tools", "Conveyors", "Robotics", "HVAC Systems", "Generators"
    ]
  },
  {
    name: "Office & Stationary",
    children: [
      "Paper Products", "Writing Tools", "Adhesives", "Furniture", "Binding Supplies", "Storage Units"
    ]
  },
  {
    name: "Safety & PPE",
    children: [
      "Helmets", "Safety Boots", "Gloves", "High-Vis Vests", "Eye Protection", "Respiratory Masks", "Fall Protection"
    ]
  },
  {
    name: "FMCG (Household)",
    children: [
      "Detergents", "Toiletries", "Cleaning Agents", "Baby Care", "Pet Supplies", "Personal Hygiene"
    ]
  },
  {
    name: "Agriculture",
    children: [
      "Seeds", "Fertilizers", "Pesticides", "Irrigation Tools", "Harvesting Tools", "Animal Feed"
    ]
  },
  {
    name: "Energy & Fuels",
    children: [
      "Solar Panels", "Batteries", "Lubricants", "Natural Gas", "Propane", "Renewables"
    ]
  }
];

export async function seedMasterTaxonomy() {
  console.log("Starting Master Taxonomy Seed...");
  let count = 0;

  for (let i = 0; i < MASTER_TAXONOMY.length; i++) {
    const parentData = MASTER_TAXONOMY[i];
    
    // Create or find parent
    const parent = await prisma.masterCategory.upsert({
      where: { name: parentData.name },
      update: {},
      create: {
        name: parentData.name,
        level: 0,
        sortOrder: i
      }
    });
    count++;

    // Create children
    for (let j = 0; j < parentData.children.length; j++) {
      const childName = parentData.children[j];
      await prisma.masterCategory.upsert({
        where: { name: childName },
        update: { parentId: parent.id },
        create: {
          name: childName,
          parentId: parent.id,
          level: 1,
          sortOrder: j
        }
      });
      count++;
    }
  }

  // Adding more random niche categories to hit 100+
  const nicheCategories = [
    "Nano-particles", "Rare Earth Elements", "Graphene Sheets", "Superconductors", 
    "Fiber Optics", "Space-grade Alloys", "Cryogenic Fluids", "Isotopes",
    "Smart Sensors", "IoT Modules", "Quantum Processors", "Neural Links",
    "Biodegradable Plastics", "Recycled Polymers", "Eco-fibers", "Organic Dyes",
    "Hydraulic Seals", "Carbon Brushes", "Ball Bearings", "Drive Belts",
    "Surgical Robots", "MRI Components", "Ventilators", "Prosthetics",
    "Defense Systems", "Aerospace Composites", "Avionics", "Thrusters",
    "Marine Propulsion", "Navigation Buoys", "Dredging Tools", "Sonar Units",
    "Micro-chips", "Wafer Silicon", "Etching Gases", "Cleanroom Apparel"
  ];

  // Put them under a "Specialized Materials" parent
  const specializedParent = await prisma.masterCategory.upsert({
    where: { name: "Specialized Materials & Components" },
    update: {},
    create: { name: "Specialized Materials & Components", level: 0, sortOrder: 99 }
  });
  count++;

  for (let k = 0; k < nicheCategories.length; k++) {
    await prisma.masterCategory.upsert({
      where: { name: nicheCategories[k] },
      update: { parentId: specializedParent.id },
      create: {
        name: nicheCategories[k],
        parentId: specializedParent.id,
        level: 1,
        sortOrder: k
      }
    });
    count++;
  }

  console.log(`Seeding complete. Total Master Categories: ${count}`);
  return { success: true, count };
}
