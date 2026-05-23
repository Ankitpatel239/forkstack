import { NextAuthOptions, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/db'; 

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
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
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn({ user, account }: any) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        if (!user.email) return false;
        
        // Match the email in the database
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!dbUser) {
          // Reject login if user email does not exist in backend
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }: any) {
      if (user) {
        if (account?.provider === 'google' || account?.provider === 'github') {
          // For OAuth logins, fetch the corresponding user role and id from the DB
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
          });
          if (dbUser) {
            token.role = dbUser.role;
            token.id = dbUser.id;
          }
        } else {
          // For Credentials, role and id are already on the returned user object
          token.role = user.role;
          token.id = user.id;
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session?.user && token) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
};

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}
