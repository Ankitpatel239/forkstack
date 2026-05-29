import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback_secret_key_123';

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    console.log('Mobile Login API received body:', bodyText);
    
    if (!bodyText) {
      return NextResponse.json({ error: 'Request body is empty' }, { status: 400 });
    }

    const { email, password } = JSON.parse(bodyText);

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Find the user in the ForkStack database
    const user = await prisma.user.findUnique({ 
      where: { email },
      select: { id: true, email: true, password: true, name: true, role: true }
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Find the vendor profile to get the vendorId
    const vendor = await prisma.vendorProfile.findFirst({
      where: {
        OR: [
          { ownerId: user.id },
          { staffAssignments: { some: { userId: user.id } } }
        ]
      }
    });

    // Create a JWT token for the mobile app session
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Return the token and user data to the React Native app
    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || user.email.split('@')[0],
        role: user.role,
        vendorId: vendor?.id || null,
      }
    });

  } catch (error) {
    console.error('Mobile Login API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
