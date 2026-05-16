require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ 
  connectionString,
  ssl: process.env.NODE_ENV === 'production' && !connectionString?.includes('localhost') && !connectionString?.includes('127.0.0.1')
    ? { rejectUnauthorized: false } 
    : false
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Seed Categories
  const categories = [
    { name: 'MENU', label: 'Menu Management', description: 'Core digital menu and QR ordering systems.', icon: 'LayoutGrid' },
    { name: 'POS', label: 'Point of Sale', description: 'Point of Sale and billing systems.', icon: 'CreditCard' },
    { name: 'ORDER', label: 'Order Management', description: 'Complete order management.', icon: 'ShoppingCart' },
    { name: 'TIFFIN', label: 'Tiffin Service', description: 'Subscription based meal delivery orchestration.', icon: 'Package' },
    { name: 'HYBRID', label: 'Hybrid Stack', description: 'Complete restaurant and delivery management suite.', icon: 'Zap' },
    { name: 'ENTERPRISE', label: 'Enterprise', description: 'Custom infrastructure for large hospitality groups.', icon: 'ShieldCheck' },
  ];

  console.log('Seeding platform categories...');
  for (const cat of categories) {
    await prisma.platformCategory.upsert({
      where: { name: cat.name },
      update: cat,
      create: cat,
    });
  }

  // 2. Seed Limits
  const limits = [
    { key: 'menuItems', label: 'Menu Items', unit: 'Items', description: 'Max items in digital menu' },
    { key: 'staff', label: 'Staff Accounts', unit: 'Users', description: 'Number of team members allowed' },
    { key: 'whatsapp', label: 'WhatsApp Alerts', unit: 'Msgs', description: 'Monthly WhatsApp quota' },
    { key: 'posTable', label: 'POS Tables', unit: 'Tables', description: 'Active tables supported' },
  ];

  console.log('Seeding platform limits...');
  for (const limit of limits) {
    await prisma.platformLimit.upsert({
      where: { key: limit.key },
      update: limit,
      create: limit,
    });
  }

  // 3. Seed Features
  const features = [
    { key: 'QR_ORDERING', label: 'QR Table Ordering', categoryName: 'MENU', description: 'Self-service ordering via QR codes' },
    { key: 'DIGITAL_MENU', label: 'Digital Menu', categoryName: 'MENU', description: 'Interactive mobile-friendly menu' },
    { key: 'AUTO_RENEWAL', label: 'Auto-Renewal', categoryName: 'TIFFIN', description: 'Auto subscription management' },
  ];

  console.log('Seeding platform features...');
  for (const feature of features) {
    await prisma.platformFeature.upsert({
      where: { key: feature.key },
      update: feature,
      create: feature,
    });
  }

  // 4. Seed Plans
  const platformPlans = [
    {
      name: 'BASIC',
      categoryName: 'MENU',
      displayName: 'Essential Starter',
      description: 'Perfect for small cafes and bootstrap eateries.',
      price: 29.00,
      features: ['DIGITAL_MENU'],
      limits: { menuItems: 50, staff: 2, posTable: 5 },
    },
    {
      name: 'PRO',
      categoryName: 'MENU',
      displayName: 'Business Professional',
      description: 'Advanced features for growing restaurants.',
      price: 99.00,
      features: ['DIGITAL_MENU', 'QR_ORDERING'],
      limits: { menuItems: 200, staff: 10, posTable: 20 },
    }
  ];

  console.log('Seeding platform subscription plans...');
  for (const planData of platformPlans) {
    const { features, limits, ...baseData } = planData;
    await prisma.platformPlan.upsert({
      where: { name: baseData.name },
      update: {
        ...baseData,
        features: { set: features.map(f => ({ key: f })) },
        limits: {
          deleteMany: {},
          create: Object.entries(limits).map(([key, value]) => ({
            limitKey: key,
            value: value
          }))
        }
      },
      create: {
        ...baseData,
        features: { connect: features.map(f => ({ key: f })) },
        limits: {
          create: Object.entries(limits).map(([key, value]) => ({
            limitKey: key,
            value: value
          }))
        }
      },
    });
  }

  // Seed Tiffin Plans for the first vendor
  const vendor = await prisma.vendorProfile.findFirst();
  if (vendor) {
    console.log(`Seeding tiffin plans for vendor: ${vendor.businessName}`);
    
    const tiffinPlans = [
      {
        vendorId: vendor.id,
        name: 'Executive Veg Thali',
        description: 'Daily fresh vegetables, dal, rice, 4 rotis, salad and pickle.',
        price: 2500,
        mealCount: 20,
        mealTypes: ['LUNCH'],
        validityDays: 30,
        inclusions: ['Salad', 'Pickle', 'Papad'],
        timeSlot: '12:30 PM - 1:30 PM',
        areas: ['MP Nagar', 'Arera Colony'],
        dietType: 'VEG',
        spiceLevel: 'MEDIUM',
        tags: ['POPULAR', 'VEG'],
        isActive: true
      },
      {
        vendorId: vendor.id,
        name: 'Corporate Non-Veg Special',
        description: 'Premium chicken/egg curry, dal, rice, 4 butter rotis and dessert.',
        price: 3500,
        mealCount: 20,
        mealTypes: ['LUNCH'],
        validityDays: 30,
        inclusions: ['Dessert', 'Raita'],
        timeSlot: '1:00 PM - 2:00 PM',
        areas: ['MP Nagar', 'Indrapuri'],
        dietType: 'NON-VEG',
        spiceLevel: 'SPICY',
        tags: ['PREMIUM'],
        isActive: true
      },
      {
        vendorId: vendor.id,
        name: 'Student Budget Mini',
        description: 'Dal, one seasonal veg, rice and 3 rotis. Pocket friendly!',
        price: 1800,
        mealCount: 20,
        mealTypes: ['LUNCH'],
        validityDays: 30,
        inclusions: ['Pickle'],
        timeSlot: '12:00 PM - 1:00 PM',
        areas: ['Ayodhya Nagar', 'Piplani'],
        dietType: 'VEG',
        spiceLevel: 'MEDIUM',
        tags: ['BUDGET'],
        isActive: true
      },
      {
        vendorId: vendor.id,
        name: 'Family Dinner Combo',
        description: 'Homestyle dinner with variety of curries and phulkas.',
        price: 4500,
        mealCount: 26,
        mealTypes: ['DINNER'],
        validityDays: 30,
        inclusions: ['Sweet', 'Salad'],
        timeSlot: '8:00 PM - 9:00 PM',
        areas: ['Arera Colony', 'Bawadiya Kalan'],
        dietType: 'VEG',
        spiceLevel: 'LOW',
        tags: ['FAMILY'],
        isActive: true
      },
      {
        vendorId: vendor.id,
        name: 'Health Freak Salad Box',
        description: 'Protein rich sprouts, paneer/chicken salad with dressing.',
        price: 3000,
        mealCount: 20,
        mealTypes: ['LUNCH'],
        validityDays: 30,
        inclusions: ['Fruit bowl'],
        timeSlot: '1:00 PM - 2:00 PM',
        areas: ['MP Nagar', 'Gulmohar'],
        dietType: 'VEG',
        spiceLevel: 'NONE',
        tags: ['HEALTHY', 'LOW_CARB'],
        isActive: true
      },
      {
        vendorId: vendor.id,
        name: 'Breakfast Energy Pack',
        description: 'Poha/Upma/Paratha with tea or buttermilk.',
        price: 1200,
        mealCount: 24,
        mealTypes: ['BREAKFAST'],
        validityDays: 30,
        inclusions: ['Tea', 'Curd'],
        timeSlot: '8:00 AM - 9:00 AM',
        areas: ['MP Nagar', 'Zone 1'],
        dietType: 'VEG',
        spiceLevel: 'MEDIUM',
        tags: ['QUICK'],
        isActive: true
      }
    ];

    for (const planData of tiffinPlans) {
      // Check if plan already exists for this vendor with same name
      const existing = await prisma.tiffinPlan.findFirst({
        where: { vendorId: vendor.id, name: planData.name }
      });

      if (existing) {
        await prisma.tiffinPlan.update({
          where: { id: existing.id },
          data: planData
        });
        console.log(`- Updated plan: ${planData.name}`);
      } else {
        await prisma.tiffinPlan.create({
          data: planData
        });
        console.log(`- Created plan: ${planData.name}`);
      }
    }
  }

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
