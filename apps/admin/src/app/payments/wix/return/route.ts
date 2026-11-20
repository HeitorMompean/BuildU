import { NextResponse } from 'next/server';
// Return URL is UX signal only. Never marks payment paid.
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ status: 'return-received' });
}
