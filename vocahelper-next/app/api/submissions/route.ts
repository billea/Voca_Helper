import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const id = 'sub_' + Math.random().toString(36).slice(2, 10);
  // Simple deterministic next step based on genre
  let nextStepTarget = '/sentence-gym';
  if (body?.genre === 'narrative') nextStepTarget = '/genres/narrative/suspense';
  if (body?.genre === 'descriptive') nextStepTarget = '/genres/descriptive/setting';
  if (body?.genre === 'persuasive') nextStepTarget = '/genres/persuasive/letter';
  return NextResponse.json({ id, ok: true, nextStepTarget });
}

