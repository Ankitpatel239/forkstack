const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  const vendor = await prisma.vendorProfile.findFirst();
  
  if (!vendor) {
    console.log('No vendor found to seed plans for.');
    return;
  }

  console.log(`Seeding plans for vendor: ${vendor.businessName} (${vendor.id})`);

  const tiffinPlans = [
    {
      vendorId: vendor.id,
      name: 'Executive Veg Thali',
      description: 'Daily fresh vegetables, dal, rice, 4 rotis, salad and pickle.',
      price: 2500,
      mealCount: 20,
      mealType: 'LUNCH',
      validityDays: 30,
      inclusions: ['Salad', 'Pickle', 'Papad'],
      timeSlot: '12:30 PM - 1:30 PM',
      areas: ['MP Nagar', 'Arera Colony', 'Gulmohar'],
      dietType: 'VEG',
      spiceLevel: 'MEDIUM',
      isActive: true,
      tags: ['POPULAR', 'VEG'],
    },
    {
      vendorId: vendor.id,
      name: 'Corporate Non-Veg Special',
      description: 'Premium chicken/egg curry, dal, rice, 4 butter rotis and dessert.',
      price: 3500,
      mealCount: 20,
      mealType: 'LUNCH',
      validityDays: 30,
      inclusions: ['Dessert', 'Raita'],
      timeSlot: '1:00 PM - 2:00 PM',
      areas: ['MP Nagar', 'Indrapuri'],
      dietType: 'NON-VEG',
      spiceLevel: 'SPICY',
      isActive: true,
      tags: ['PREMIUM'],
    },
    {
      vendorId: vendor.id,
      name: 'Student Budget Mini',
      description: 'Dal, one seasonal veg, rice and 3 rotis. Pocket friendly!',
      price: 1800,
      mealCount: 20,
      mealType: 'LUNCH',
      validityDays: 30,
      inclusions: ['Pickle'],
      timeSlot: '12:00 PM - 1:00 PM',
      areas: ['Ayodhya Nagar', 'Piplani'],
      dietType: 'VEG',
      spiceLevel: 'MEDIUM',
      isActive: true,
      tags: ['BUDGET'],
    },
    {
      vendorId: vendor.id,
      name: 'Family Dinner Combo',
      description: 'Homestyle dinner with variety of curries and phulkas.',
      price: 4500,
      mealCount: 26,
      mealType: 'DINNER',
      validityDays: 30,
      inclusions: ['Sweet', 'Salad'],
      timeSlot: '8:00 PM - 9:00 PM',
      areas: ['Arera Colony', 'Bawadiya Kalan'],
      dietType: 'VEG',
      spiceLevel: 'LOW',
      isActive: true,
      tags: ['FAMILY'],
    },
    {
      vendorId: vendor.id,
      name: 'Health Freak Salad Box',
      description: 'Protein rich sprouts, paneer/chicken salad with dressing.',
      price: 3000,
      mealCount: 20,
      mealType: 'LUNCH',
      validityDays: 30,
      inclusions: ['Fruit bowl'],
      timeSlot: '1:00 PM - 2:00 PM',
      areas: ['MP Nagar', 'Gulmohar'],
      dietType: 'VEG',
      spiceLevel: 'NONE',
      isActive: true,
      tags: ['HEALTHY', 'LOW_CARB'],
    },
    {
      vendorId: vendor.id,
      name: 'Breakfast Energy Pack',
      description: 'Poha/Upma/Paratha with tea or buttermilk.',
      price: 1200,
      mealCount: 24,
      mealType: 'BREAKFAST',
      validityDays: 30,
      inclusions: ['Tea', 'Curd'],
      timeSlot: '8:00 AM - 9:00 AM',
      areas: ['MP Nagar', 'Zone 1'],
      dietType: 'VEG',
      spiceLevel: 'MEDIUM',
      isActive: true,
      tags: ['QUICK'],
    }
  ];

  for (const planData of tiffinPlans) {
    const plan = await prisma.tiffinPlan.create({
      data: planData
    });
    console.log(`Created plan: ${plan.name} (ID: ${plan.id})`);
  }

  console.log('Seeding finished.');
}

seed()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
