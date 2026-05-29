import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { status: 'ok', message: 'Pong', timestamp: new Date().toISOString() },
    { status: 200 }
  );
}
