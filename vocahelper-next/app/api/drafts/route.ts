import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const id = 'draft_' + Math.random().toString(36).slice(2, 10);
  // In production, persist to a DB. Here, just echo back.
  return NextResponse.json({ id, ok: true });
}

