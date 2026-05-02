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
  const platformPlans = [
    {
      name: 'BASIC',
      displayName: 'Essential Starter',
      description: 'Perfect for small cafes and bootstrap eateries.',
      price: 29.00,
      features: [
        '50 Menu Items',
        'Basic Analytics',
        'Standard Support',
        'QR Table Ordering',
        'Digital Menu'
      ],
      isActive: true,
    },
    {
      name: 'PRO',
      displayName: 'Business Professional',
      description: 'Advanced features for growing restaurants and professional kitchens.',
      price: 99.00,
      features: [
        'Unlimited Menu Items',
        'Advanced Analytics',
        'Priority Support',
        'WhatsApp Integration',
        'Custom Domain',
        'Inventory Management',
        'Staff Roles'
      ],
      isActive: true,
    },
    {
      name: 'ENTERPRISE',
      displayName: 'Platform Scaler',
      description: 'Enterprise grade infrastructure for large hospitality groups.',
      price: 299.00,
      features: [
        'Multi-store Support',
        'Dedicated Manager',
        'SLA Guarantee',
        'API Access',
        'Whitelabeling',
        'Advanced Marketing automation',
        'AI Insights'
      ],
      isActive: true,
    }
  ];

  console.log('Seeding platform subscription plans...');
  for (const plan of platformPlans) {
    await prisma.platformPlan.upsert({
      where: { name: plan.name },
      update: plan,
      create: plan,
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
