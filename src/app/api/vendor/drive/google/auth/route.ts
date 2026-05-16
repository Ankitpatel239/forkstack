
import { NextResponse } from 'next/server';
import { requireVendor } from '@/lib/vendor';

export async function GET(req: Request) {
  const { origin: baseUrl, searchParams } = new URL(req.url);
  try {
    const state = searchParams.get('state') || '';
    
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = `${baseUrl}/api/vendor/drive/google/callback`;
    
    if (!clientId) {
      return NextResponse.json({ error: 'Google Client ID not configured' }, { status: 500 });
    }

    const scopes = [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/userinfo.email'
    ].join(' ');

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + 
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scopes)}&` +
      `access_type=offline&` +
      `prompt=consent&` +
      `state=${state}`;

    return NextResponse.redirect(authUrl);
  } catch (error) {
    return NextResponse.json({ error: 'Authorization Initialization Failed' }, { status: 500 });
  }
}
