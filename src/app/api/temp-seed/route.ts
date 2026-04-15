import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function GET() {
  try {
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
    const results = [];

    for (const user of usersToCreate) {
      const createdUser = await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          email: user.email,
          name: user.name,
          role: user.role as any, // casting due to prisma enum typing in route handlers sometimes being picky
          password: hashedPassword,
        },
      });
      results.push(`Created: ${createdUser.email}`);
    }

    return NextResponse.json({ message: 'Success', results });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
