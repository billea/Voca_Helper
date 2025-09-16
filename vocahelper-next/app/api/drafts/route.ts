import { NextResponse } from 'next/server';
import { addDraft } from '@/lib/devStore';

export async function POST(request: Request) {
  const body = await request.json();
  const draft = await addDraft({
    genre: String(body.genre || ''),
    lesson: String(body.lesson || ''),
    content: String(body.content || ''),
    wordCount: Number(body.wordCount || 0),
    durationSec: Number(body.durationSec || 0),
  });
  return NextResponse.json({ id: draft.id, ok: true });
}
