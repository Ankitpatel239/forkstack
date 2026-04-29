import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    const userRole = (token?.role as string)?.toUpperCase();

    // Admin only
    if (path.startsWith('/admin') && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url));
    }
    // Vendor only
    if (
      path.startsWith('/vendor') &&
      userRole !== 'VENDOR_OWNER' &&
      userRole !== 'TEAM'
    ) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    // Team only (kitchen)
    if (
      path.startsWith('/team') &&
      userRole !== 'TEAM' &&
      userRole !== 'ADMIN'
    ) {
      return NextResponse.redirect(new URL('/', req.url));
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
