import { NextResponse } from 'next/server';
import { requireVendor } from '@/lib/vendor';

export async function GET(req: Request) {
  try {
    // Ensure user is authenticated as a vendor before starting the flow
    await requireVendor();

    const clientId = process.env.FACEBOOK_CLIENT_ID;
    const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/marketing/callback`;

    if (!clientId) {
      return NextResponse.json({ error: 'Facebook Client ID is not configured' }, { status: 500 });
    }

    // Facebook OAuth URL with required scopes for pages and instagram
    const fbLoginUrl = new URL('https://www.facebook.com/v20.0/dialog/oauth');
    fbLoginUrl.searchParams.append('client_id', clientId);
    fbLoginUrl.searchParams.append('redirect_uri', redirectUri);
    // Request permissions to read pages, manage pages, publish posts, and instagram access
    fbLoginUrl.searchParams.append('scope', 'pages_show_list,pages_read_engagement,pages_manage_posts,instagram_basic,instagram_content_publish');
    fbLoginUrl.searchParams.append('response_type', 'code');
    // Using display=popup so it looks nice if opened in a popup, though standard redirect also works
    fbLoginUrl.searchParams.append('display', 'popup');

    // Redirect the user to Facebook for authentication
    return NextResponse.redirect(fbLoginUrl.toString());
  } catch (error) {
    console.error('Facebook Auth Error:', error);
    return NextResponse.json({ error: 'Unauthorized or invalid request' }, { status: 401 });
  }
}
