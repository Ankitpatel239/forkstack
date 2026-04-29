// src/app/api/auth/session/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  return NextResponse.json(session ?? null);
}

export async function POST(request: Request) {
  // For compatibility, delegate to NextAuth handler if needed
  const { handler } = await import("../[...nextauth]/route");
  // @ts-ignore – handler expects NextAuth request handling
  return handler(request);
}
