import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function POST(request: Request) {
  const body = await request.json();
  const payload = {
    mode: String(body.mode || ''),
    genre: String(body.genre || ''),
    prompt: String(body.prompt || ''),
    content: String(body.content || ''),
    improved: !!body.improved,
    duration_sec: Number(body.durationSec || 0),
  };
  let nextStepTarget = '/sentence-gym';
  if (payload.genre === 'narrative') nextStepTarget = '/genres/narrative/suspense';
  if (payload.genre === 'descriptive') nextStepTarget = '/genres/descriptive/setting';
  if (payload.genre === 'persuasive') nextStepTarget = '/genres/persuasive/letter';
  if (payload.genre === 'letters') nextStepTarget = '/genres/persuasive/letter';

  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb.from('practice_submissions').insert({ ...payload, next_step_target: nextStepTarget }).select('id').single();
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, id: data?.id, nextStepTarget, source: 'supabase' });
  }
  // local fallback
  const dataDir = path.join(process.cwd(), 'vocahelper-next', '.data');
  const file = path.join(dataDir, 'practice.json');
  try { await fs.mkdir(dataDir, { recursive: true }); } catch {}
  let arr: any[] = [];
  try { arr = JSON.parse(await fs.readFile(file, 'utf8')); } catch { arr = []; }
  const id = 'prac_' + Math.random().toString(36).slice(2, 9);
  arr.unshift({ id, created_at: new Date().toISOString(), ...payload, next_step_target: nextStepTarget });
  await fs.writeFile(file, JSON.stringify(arr, null, 2));
  return NextResponse.json({ ok: true, id, nextStepTarget, source: 'file' });
}

