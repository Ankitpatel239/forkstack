import { NextAuthOptions, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/db'; 

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        isRegister: { label: 'isRegister', type: 'text' },
        name: { label: 'Name', type: 'text' },
        phone: { label: 'Phone', type: 'text' },
        businessName: { label: 'Business Name', type: 'text' },
        role: { label: 'Role', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        // Handle Registration
        if (credentials.isRegister === 'true') {
          const exists = await prisma.user.findUnique({ where: { email: credentials.email } });
          if (exists) throw new Error('Email already registered');
          
          const hashedPassword = await bcrypt.hash(credentials.password, 12);
          
          const user = await prisma.user.create({
            data: {
              email: credentials.email,
              password: hashedPassword,
              name: credentials.name || '',
              phone: credentials.phone || '',
              role: (credentials.role || 'VENDOR_OWNER') as any,
            }
          });

          if (credentials.role === 'VENDOR_OWNER' && credentials.businessName) {
            const tenantSlug = credentials.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-');
            await prisma.vendorProfile.create({
              data: {
                ownerId: user.id,
                businessName: credentials.businessName,
                businessPhone: credentials.phone || '',
                businessEmail: credentials.email,
                address: '',
                tenantSlug: tenantSlug + '-' + Math.random().toString(36).substring(2, 6),
                subscriptionEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
              }
            });
          }

          return { id: user.id, email: user.email, role: user.role, name: user.name } as any;
        }

        // Handle Login
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.password) throw new Error('Invalid credentials');
        
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error('Invalid credentials');
        
        return { id: user.id, email: user.email, role: user.role, name: user.name } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
};

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

