import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const usersToCreate = [
    { email: 'admin@forkstack.test', role: 'ADMIN', name: 'Admin User' },
    { email: 'owner1@forkstack.test', role: 'VENDOR_OWNER', name: 'Owner One' },
    { email: 'owner2@forkstack.test', role: 'VENDOR_OWNER', name: 'Owner Two' },
    { email: 'team1@forkstack.test', role: 'TEAM', name: 'Team One' },
    { email: 'team2@forkstack.test', role: 'TEAM', name: 'Team Two' },
    { email: 'team3@forkstack.test', role: 'TEAM', name: 'Team Three' },
    { email: 'support1@forkstack.test', role: 'SUPPORT', name: 'Support One' },
    { email: 'support2@forkstack.test', role: 'SUPPORT', name: 'Support Two' },
    { email: 'test1@forkstack.test', role: 'TEAM', name: 'Test User One' },
    { email: 'test2@forkstack.test', role: 'TEAM', name: 'Test User Two' },
  ];

  const hashedPassword = await bcrypt.hash('password123', 10);

  console.log('Seeding temporary users...');

  for (const user of usersToCreate) {
    try {
      const createdUser = await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          email: user.email,
          name: user.name,
          role: user.role,
          password: hashedPassword,
        },
      });
      console.log(`- Created user: ${createdUser.email} (${createdUser.role})`);
    } catch (error) {
      console.error(`- Failed to create user ${user.email}:`, error);
    }
  }

  console.log('Done seeding users.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
