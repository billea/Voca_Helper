import { NextResponse } from 'next/server';
import { getAll } from '@/lib/devStore';

export async function GET() {
  const data = await getAll();
  return NextResponse.json(data);
}

