import { getAll } from '@/lib/devStore';
import { getSupabase } from '@/lib/supabase';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DraftsPage() {
  const sb = getSupabase();
  let drafts: any[] = [];
  let submissions: any[] = [];
  if (sb) {
    const { data: d } = await sb.from('drafts').select('*').order('created_at', { ascending: false });
    const { data: s } = await sb.from('submissions').select('*').order('created_at', { ascending: false });
    drafts = d || [];
    submissions = s || [];
  } else {
    const data = await getAll();
    drafts = data.drafts.map((x) => ({
      ...x,
      created_at: x.createdAt,
      word_count: x.wordCount,
      duration_sec: x.durationSec,
    }));
    submissions = data.submissions.map((x) => ({
      ...x,
      created_at: x.createdAt,
      word_count: x.wordCount,
      duration_sec: x.durationSec,
      next_step_target: x.nextStepTarget,
    }));
  }
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">My Drafts</h1>
      <section aria-labelledby="drafts-title" className="space-y-2">
        <h2 id="drafts-title" className="text-lg font-bold">Saved drafts</h2>
        {drafts.length === 0 ? (
          <p className="text-sm text-slate-600">No drafts yet. Visit a lesson to write and save.</p>
        ) : (
          <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200">
            {drafts.map((d) => (
              <li key={d.id} className="p-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">{d.genre}/{d.lesson}</span>
                  <span className="text-slate-700">{new Date(d.created_at).toLocaleString()}</span>
                  <span className="ml-auto text-slate-500">{d.word_count} words • {Math.round((d.duration_sec||0)/60)} min</span>
                </div>
                <div className="mt-1 line-clamp-2 text-slate-700">{d.content}</div>
                <div className="mt-2">
                  <Link href={`/genres/${d.genre}/${d.lesson}`} className="focus-ring inline-flex rounded-md border border-slate-300 px-2 py-1 text-xs">Open lesson</Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="subs-title" className="space-y-2">
        <h2 id="subs-title" className="text-lg font-bold">Submissions</h2>
        {submissions.length === 0 ? (
          <p className="text-sm text-slate-600">No submissions yet.</p>
        ) : (
          <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200">
            {submissions.map((s) => (
              <li key={s.id} className="p-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">submitted</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">{s.genre}/{s.lesson}</span>
                  <span className="text-slate-700">{new Date(s.created_at).toLocaleString()}</span>
                  <span className="ml-auto text-slate-500">{s.word_count} words • {Math.round((s.duration_sec||0)/60)} min</span>
                </div>
                <div className="mt-1 line-clamp-2 text-slate-700">{s.content}</div>
                {s.next_step_target && (
                  <div className="mt-2">
                    <Link href={s.next_step_target} className="focus-ring inline-flex rounded-md bg-brand px-2 py-1 text-xs font-semibold text-white">Go to next step</Link>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
