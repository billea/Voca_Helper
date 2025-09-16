import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { getAll } from '@/lib/devStore';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function POST(request: Request) {
  const body = await request.json();
  const payload = {
    type: String(body.type || ''),
    items_attempted: Number(body.itemsAttempted || 0),
    items_completed: Number(body.itemsCompleted || 0),
    duration_sec: Number(body.durationSec || 0),
  };
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb.from('gym_sessions').insert(payload).select('id').single();
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, id: data?.id, source: 'supabase' });
  }
  // fallback: append to a local json file under .data
  const dataDir = path.join(process.cwd(), 'vocahelper-next', '.data');
  const file = path.join(dataDir, 'gym_sessions.json');
  try { await fs.mkdir(dataDir, { recursive: true }); } catch {}
  let arr: any[] = [];
  try { arr = JSON.parse(await fs.readFile(file, 'utf8')); } catch { arr = []; }
  const id = 'gym_' + Math.random().toString(36).slice(2, 9);
  arr.unshift({ id, created_at: new Date().toISOString(), ...payload });
  await fs.writeFile(file, JSON.stringify(arr, null, 2));
  return NextResponse.json({ ok: true, id, source: 'file' });
}

