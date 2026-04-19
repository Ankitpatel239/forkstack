require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const plans = [
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

  console.log('Seeding subscription plans...');

  for (const plan of plans) {
    const upsertedPlan = await prisma.platformPlan.upsert({
      where: { name: plan.name },
      update: plan,
      create: plan,
    });
    console.log(`- Upserted plan: ${upsertedPlan.name}`);
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
  });
