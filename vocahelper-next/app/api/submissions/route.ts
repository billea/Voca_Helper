import { NextResponse } from 'next/server';
import { addSubmission } from '@/lib/devStore';

export async function POST(request: Request) {
  const body = await request.json();
  let nextStepTarget = '/sentence-gym';
  if (body?.genre === 'narrative') nextStepTarget = '/genres/narrative/suspense';
  if (body?.genre === 'descriptive') nextStepTarget = '/genres/descriptive/setting';
  if (body?.genre === 'persuasive') nextStepTarget = '/genres/persuasive/letter';
  const sub = await addSubmission({
    genre: String(body.genre || ''),
    lesson: String(body.lesson || ''),
    content: String(body.content || ''),
    wordCount: Number(body.wordCount || 0),
    durationSec: Number(body.durationSec || 0),
    nextStepTarget,
  });
  return NextResponse.json({ id: sub.id, ok: true, nextStepTarget });
}
