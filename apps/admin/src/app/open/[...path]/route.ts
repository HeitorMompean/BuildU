import { NextResponse } from 'next/server';
// Public links hostname routes to this same Next.js service.
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ status: 'not-implemented' }, { status: 501 });
}
