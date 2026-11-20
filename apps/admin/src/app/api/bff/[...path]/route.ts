import { NextResponse } from 'next/server';
// BFF proxy shell. Never exposes admin tokens to browser JS.
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ status: 'not-implemented' }, { status: 501 });
}
export async function POST(): Promise<NextResponse> {
  return NextResponse.json({ status: 'not-implemented' }, { status: 501 });
}
