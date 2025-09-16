"use client";
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Timer } from '@/components/ui/Timer';
import { useToast } from '@/components/ui/Toast';

export type StudioProps = {
  breadcrumb: string[]; // [Home, Genre Studios, Genre, Lesson]
  title: string;
  prompt: string;
  strongExample: string;
  strongPoints: string[];
  weakExample: string;
  weakPoints: string[];
  checklist: string[];
  criteria: string[];
  genre: string;
  lesson: string;
};

/** Compute quick hints from the draft string. */
function computeHints(text: string): string[] {
  const hints: string[] = [];
  const trimmed = text.trim();
  const words = (trimmed.match(/\b\w+\b/g) || []).length;
  const sentences = (trimmed.match(/[.!?]+\s|\n/g) || []).length + (trimmed ? 1 : 0);

  // Heuristic: many 'The ' sentence starters
  const theStarters = (trimmed.match(/(?:^|[.!?]\s+)The\s+/g) || []).length;
  if (theStarters >= 3) hints.push('Try varied openers (‑ing/‑ed/adverbial/dialogue).');

  // Punctuation variety
  if (!/[,:;—–]/.test(trimmed)) hints.push('Add punctuation variety (comma/colon/dash).');

  // Suspense lexicon
  if (!/(creak|shadow|footsteps|heartbeat)/i.test(trimmed)) hints.push('Add 1–2 suspense words (e.g., “creak”, “shadow”, “footsteps”).');

  // Sentence ending punctuation
  if (!/[.!?]/.test(trimmed)) hints.push('Add full stops to control meaning.');

  // Basic development guard
  if (words < 120) hints.push('Develop ideas: aim for 120–400 words.');

  return hints;
}

export function StudioLayout(props: StudioProps) {
  const { breadcrumb, title, prompt, strongExample, strongPoints, weakExample, weakPoints, checklist, criteria, genre, lesson } = props;
  const [minutes, setMinutes] = React.useState(10);
  const [started, setStarted] = React.useState(false);
  const [remaining, setRemaining] = React.useState(minutes * 60);
  const [draft, setDraft] = React.useState('');
  const [checked, setChecked] = React.useState<Record<number, boolean>>({});
  const [customChecklist, setCustomChecklist] = React.useState<string[]>([]);
  const toast = useToast();
  const router = useRouter();
  const [isSavingLocal, setIsSavingLocal] = React.useState(false);
  const lastToastAtRef = React.useRef<number>(0);
  const words = (draft.trim().match(/\b\w+\b/g) || []).length;
  const canSubmit = words >= 120 && words <= 400; // client guard

  const liveRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (liveRef.current) liveRef.current.textContent = `Words: ${words}`;
  }, [words]);

  const durationSec = minutes * 60 - remaining;

  // Load/save draft from localStorage per-lesson
  const storageKey = `vh_draft_${genre}_${lesson}`;
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setDraft(raw);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Debounced local autosave of draft with timestamp
  React.useEffect(() => {
    const handle = setTimeout(() => {
      try {
        setIsSavingLocal(true);
        localStorage.setItem(storageKey, draft);
        const now = Date.now();
        // throttle autosaved toast to at most once every 20s
        if (now - lastToastAtRef.current > 20000) {
          toast.show('Autosaved', { type: 'info' });
          lastToastAtRef.current = now;
        }
      } catch {}
      setIsSavingLocal(false);
    }, 800);
    return () => clearTimeout(handle);
  }, [draft, storageKey, toast]);
  React.useEffect(() => {
    // Offer recovery on mount if draft exists and local editor is empty
    try {
      const raw = localStorage.getItem(storageKey);
      if (!draft && raw && raw.length > 0) {
        // Simple confirm for recovery
        const ok = window.confirm('Recover locally saved draft for this lesson?');
        if (ok) {
          setDraft(raw);
          toast.show('Recovered local draft', { type: 'success' });
        }
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // load custom checklist
  const ckKey = `vh_ck_${genre}_${lesson}`;
  React.useEffect(() => {
    try{ const raw = localStorage.getItem(ckKey); if(raw) setCustomChecklist(JSON.parse(raw)); }catch{}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(()=>{ try{ localStorage.setItem(ckKey, JSON.stringify(customChecklist)); }catch{} },[customChecklist, ckKey]);

  async function saveDraft() {
    const payload = { genre, lesson, content: draft, wordCount: words, durationSec };
    let authHeader: Record<string, string> = { 'Content-Type': 'application/json' };
    const sb = (await import('@/lib/supabase')).getSupabase();
    if (sb) {
      const { data } = await sb.auth.getSession();
      const token = data.session?.access_token;
      if (token) authHeader = { ...authHeader, Authorization: `Bearer ${token}` };
    }
    const res = await fetch('/api/drafts', { method: 'POST', headers: authHeader, body: JSON.stringify(payload) });
    const data = await res.json();
    toast.show('Draft saved', { type: 'success' });
  }
  async function submitDraft() {
    if (!canSubmit) return;
    const payload = { genre, lesson, content: draft, wordCount: words, durationSec };
    let authHeader: Record<string, string> = { 'Content-Type': 'application/json' };
    const sb = (await import('@/lib/supabase')).getSupabase();
    if (sb) {
      const { data } = await sb.auth.getSession();
      const token = data.session?.access_token;
      if (token) authHeader = { ...authHeader, Authorization: `Bearer ${token}` };
    }
    const res = await fetch('/api/submissions', { method: 'POST', headers: authHeader, body: JSON.stringify(payload) });
    const data = await res.json();
    toast.show('Submission sent', { type: 'success' });
    if (data?.nextStepTarget) {
      router.push(String(data.nextStepTarget));
    }
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500">
        Home / Genre Studios / <span className="text-slate-700 font-medium">{breadcrumb[2]}</span> / <span className="text-slate-900 font-semibold">{breadcrumb[3]}</span>
      </nav>

      <SectionTitle>{title}</SectionTitle>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left 2/3 */}
        <div className="md:col-span-2 space-y-4">
          <Card title="Mini‑lesson">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="text-xs font-semibold text-slate-600">Strong example</div>
                <div className="mt-2 rounded-md bg-slate-50 p-3 text-sm text-slate-800">{strongExample}</div>
                <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
                  {strongPoints.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-600">Weaker (for contrast)</div>
                <div className="mt-2 rounded-md bg-slate-50 p-3 text-sm text-slate-800">{weakExample}</div>
                <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
                  {weakPoints.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </div>
            </div>
          </Card>

          <Card title="Your prompt">
            <p className="text-sm text-slate-600">{prompt}</p>
            <ExportedPlanHelper onInsert={(t)=> setDraft(d => (d ? d + "\n\n" + t : t))} />
            <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto] md:items-start">
              <label htmlFor="studio-draft" className="sr-only">Your draft</label>
              <textarea
                id="studio-draft"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="min-h-[200px] w-full resize-vertical rounded-md border border-slate-300 p-3 text-sm focus-ring"
                placeholder="Type your response…"
                aria-describedby="studio-draft-meta"
              />
              <div className="flex flex-col gap-2">
                <label htmlFor="time-preset" className="text-xs font-medium text-slate-700">Timer preset</label>
                <select
                  id="time-preset"
                  value={minutes}
                  onChange={(e) => { const m = Number(e.target.value); setMinutes(m); setRemaining(m*60); }}
                  className="rounded-md border border-slate-300 px-2 py-2 text-sm focus-ring"
                >
                  <option value={10}>10 minutes</option>
                  <option value={20}>20 minutes</option>
                  <option value={30}>30 minutes</option>
                </select>
                <Timer
                  key={minutes}
                  initialMinutes={minutes}
                  onStart={() => setStarted(true)}
                  onChange={(rem) => setRemaining(rem)}
                />
                <div id="studio-draft-meta" className="text-xs text-slate-500">
                  Words: {words} • {draft.length} chars
                </div>
                <div className="sr-only" aria-live="polite" ref={liveRef} />
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={saveDraft} className="focus-ring rounded-md border border-slate-300 px-3 py-2 text-sm font-medium">Save Draft</button>
              <button disabled={!canSubmit} onClick={submitDraft} aria-disabled={!canSubmit} className="focus-ring rounded-md bg-brand px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">Submit</button>
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
              <span>Submit requires 120–400 words.</span>
              <span className="ml-auto">{isSavingLocal ? 'Saving…' : ''}</span>
            </div>
          </Card>
        </div>

        {/* Right 1/3 */}
        <aside className="space-y-4">
          <Card title="SRSD Checklist">
            <ul className="space-y-2">
              {[...checklist, ...customChecklist].map((item, idx) => {
                const id = `ck-${idx}`;
                const on = !!checked[idx];
                return (
                  <li key={id}>
                    <label htmlFor={id} className="flex items-center gap-2 text-sm">
                      <input
                        id={id}
                        type="checkbox"
                        checked={on}
                        onChange={() => setChecked((s) => ({ ...s, [idx]: !on }))}
                        className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
                      />
                      <span>{item}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                aria-label="Add checklist item"
                placeholder="Add checklist item"
                className="min-w-0 flex-1 rounded-md border border-slate-300 px-2 py-2 text-sm focus-ring"
                onKeyDown={(e) => {
                  const target = e.target as HTMLInputElement;
                  if (e.key === 'Enter' && target.value.trim()) {
                    const v = target.value.trim();
                    setCustomChecklist((arr)=> [...arr, v]);
                    target.value = '';
                    toast.show('Checklist item added', { type: 'info' });
                  }
                }}
              />
            </div>
          </Card>

          <Card title="Instant Hints">
            {draft.trim().length === 0 ? (
              <p className="text-sm text-slate-600">Start typing to see instant hints.</p>
            ) : (
              <ul className="list-disc pl-5 text-sm text-slate-700">
                {computeHints(draft).map((h) => <li key={h}>{h}</li>)}
              </ul>
            )}
          </Card>

          <Card title="Success Criteria">
            <ul className="list-disc pl-5 text-sm text-slate-700">
              {criteria.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function ExportedPlanHelper({ onInsert }:{ onInsert:(text:string)=>void }){
  const [plan, setPlan] = React.useState<string | null>(null);
  React.useEffect(()=>{
    try{
      const raw = localStorage.getItem('vocahelper:export_plan');
      if (raw){ const data = JSON.parse(raw); const b = data.board; const text = `Ideas:\n- ${b.ideas.map((x:any)=>x.text).join('\n- ')}\n\nOrder:\n- ${b.order.map((x:any)=>x.text).join('\n- ')}\n\nLanguage Moves:\n- ${b.moves.map((x:any)=>x.text).join('\n- ')}`; setPlan(text); }
    }catch{}
  },[]);
  if (!plan) return null;
  return (
    <div className="mt-2 rounded-md border border-slate-200 p-2 text-xs bg-slate-50">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-slate-700">Imported Plan</span>
        <div className="flex gap-2">
          <button className="focus-ring rounded-md border border-slate-300 px-2 py-1" onClick={()=> onInsert(plan)}>Insert outline</button>
          <button className="focus-ring rounded-md border border-slate-300 px-2 py-1" onClick={()=>{ try{ localStorage.removeItem('vocahelper:export_plan'); }catch{}; setPlan(null);} }>Dismiss</button>
        </div>
      </div>
      <pre className="mt-1 whitespace-pre-wrap text-slate-700">{plan}</pre>
    </div>
  );
}
