import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin only
    if (path.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
    // Vendor only
    if (
      path.startsWith('/vendor') &&
      token?.role !== 'VENDOR_OWNER' &&
      token?.role !== 'TEAM'
    ) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
    // Team only (kitchen)
    if (
      path.startsWith('/team') &&
      token?.role !== 'TEAM' &&
      token?.role !== 'ADMIN'
    ) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: { authorized: ({ token }) => !!token },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/vendor/:path*', '/team/:path*'],
};
