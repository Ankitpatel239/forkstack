import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import React from 'react';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { Toaster } from '@/components/ui/sonner';
import { PageLoader } from '@/components/PageLoader';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ForkStack – Professional QR Ordering & Vendor Platform',
  description: 'High-performance vendor management system with WhatsApp integration.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <QueryProvider>
              <React.Suspense>
                <PageLoader />
              </React.Suspense>
              {children}
              <Toaster />
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}