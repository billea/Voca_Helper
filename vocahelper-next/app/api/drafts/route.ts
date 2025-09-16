import { NextResponse } from 'next/server';
import { addDraft } from '@/lib/devStore';
import { getSupabase } from '@/lib/supabase';

export async function POST(request: Request) {
  const body = await request.json();
  const payload = {
    genre: String(body.genre || ''),
    lesson: String(body.lesson || ''),
    content: String(body.content || ''),
    word_count: Number(body.wordCount || 0),
    duration_sec: Number(body.durationSec || 0),
  };

  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb.from('drafts').insert(payload).select('id').single();
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ id: data?.id, ok: true, source: 'supabase' });
  }
  // Fallback to local dev store if Supabase not configured
  const local = await addDraft({
    genre: payload.genre,
    lesson: payload.lesson,
    content: payload.content,
    wordCount: payload.word_count,
    durationSec: payload.duration_sec,
  });
  return NextResponse.json({ id: local.id, ok: true, source: 'file' });
}
