// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * POST /api/auth/logout
 * Clears the authentication cookies, effectively logging the user out.
 * This can be called after a database change (e.g., password reset) to ensure
 * the current session is invalidated on the client side.
 */
export async function POST(request: Request) {
  // Ensure we have a valid session (optional, you may log the user ID)
  const session = await getServerSession(authOptions);
  // Prepare a response that clears NextAuth cookies
  const response = NextResponse.json({ ok: true, message: "Logged out" });

  // Remove the session token cookie (default name: next-auth.session-token)
  response.cookies.delete({ name: "next-auth.session-token" });
  // Remove the CSRF token cookie (if used)
  response.cookies.delete({ name: "next-auth.csrf-token" });
  // Remove the JWT token cookie for older versions (optional)
  response.cookies.delete({ name: "next-auth.jwt" });

  // Optionally log which user was logged out for debugging
  if (session?.user?.email) {
    console.log(`User ${session.user.email} logged out via API`);
  }
  return response;
}

// Also support GET for convenience (e.g., a simple link)
export async function GET(request: Request) {
  return await POST(request);
}
