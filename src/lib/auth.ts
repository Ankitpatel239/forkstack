import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { PrismaAdapter } from '@auth/prisma-adapter';
// import { prisma } from '@/lib/db'; 

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma), // uncomment when prisma client is generated
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
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        // Placeholder implementation
        // const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        // if (!user || !user.password) return null;
        // const isValid = await bcrypt.compare(credentials.password, user.password);
        // if (!isValid) return null;
        
        // return { id: user.id, email: user.email, role: user.role };
        
        return { id: "test", email: credentials.email, role: "VENDOR_OWNER" } as any;
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
