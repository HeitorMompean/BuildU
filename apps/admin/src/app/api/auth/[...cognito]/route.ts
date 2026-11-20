import { NextResponse } from 'next/server';
// Cognito admin auth handler shell. Round 3 implements code exchange server-side.
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ status: 'not-implemented' }, { status: 501 });
}
