import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback_secret_key_123';

export async function verifyMobileAuth(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Unauthorized', status: 401 };
  }
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    if (!decoded || !decoded.id) {
      return { error: 'Invalid token', status: 401 };
    }

    const vendor = await prisma.vendorProfile.findFirst({
      where: {
        OR: [
          { ownerId: decoded.id },
          { staffAssignments: { some: { userId: decoded.id } } }
        ]
      }
    });

    if (!vendor) {
      return { error: 'Vendor profile not found', status: 403 };
    }

    return { user: decoded, vendor, error: null };
  } catch (error) {
    return { error: 'Invalid or expired token', status: 401 };
  }
}
