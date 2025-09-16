import { NextResponse } from 'next/server';
import { addSubmission } from '@/lib/devStore';
import { getSupabase } from '@/lib/supabase';

export async function POST(request: Request) {
  const body = await request.json();
  let nextStepTarget = '/sentence-gym';
  if (body?.genre === 'narrative') nextStepTarget = '/genres/narrative/suspense';
  if (body?.genre === 'descriptive') nextStepTarget = '/genres/descriptive/setting';
  if (body?.genre === 'persuasive') nextStepTarget = '/genres/persuasive/letter';
  const payload = {
    genre: String(body.genre || ''),
    lesson: String(body.lesson || ''),
    content: String(body.content || ''),
    word_count: Number(body.wordCount || 0),
    duration_sec: Number(body.durationSec || 0),
    next_step_target: nextStepTarget,
  };

  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb.from('submissions').insert(payload).select('id').single();
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ id: data?.id, ok: true, nextStepTarget, source: 'supabase' });
  }
  const sub = await addSubmission({
    genre: payload.genre,
    lesson: payload.lesson,
    content: payload.content,
    wordCount: payload.word_count,
    durationSec: payload.duration_sec,
    nextStepTarget,
  });
  return NextResponse.json({ id: sub.id, ok: true, nextStepTarget, source: 'file' });
}
