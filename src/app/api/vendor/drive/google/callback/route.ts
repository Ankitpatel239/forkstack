
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireVendor } from '@/lib/vendor';

export async function GET(req: Request) {
  const { searchParams, origin: baseUrl } = new URL(req.url);

  try {
    const code = searchParams.get('code');
    const stateStr = searchParams.get('state') || '{}';
    const state = JSON.parse(decodeURIComponent(stateStr));
    
    if (!code) return NextResponse.redirect(`${baseUrl}/vendor/settings?error=no_code`);

    const vendor = await requireVendor();

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${baseUrl}/api/vendor/drive/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();
    
    if (tokens.error) {
      console.error('Token Exchange Error:', tokens);
      return NextResponse.redirect(`${baseUrl}/vendor/settings?error=token_exchange_failed`);
    }

    // Fetch user Gmail
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const userInfo = await userResponse.json();

    // Create Storage Node
    await prisma.connectedDrive.create({
      data: {
        name: state.name || `Drive (${userInfo.email})`,
        type: 'GOOGLE',
        googleEmail: userInfo.email,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        vendorId: vendor.id,
        status: 'ACTIVE',
        capacity: 15
      }
    });

    return NextResponse.redirect(`${baseUrl}/vendor/settings?success=drive_connected`);
  } catch (error) {
    console.error('OAuth Callback Error:', error);
    return NextResponse.redirect(`${baseUrl}/vendor/settings?error=callback_error`);
  }
}
