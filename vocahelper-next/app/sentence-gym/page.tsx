"use client";
import React from 'react';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Timer } from '@/components/ui/Timer';
import { COMBINING_SEED, OPENERS_SEED, PUNCTUATION_SEED, VOCAB_SEED, DrillType } from '@/content/gym';
import { useToast } from '@/components/ui/Toast';

type Tab = DrillType;

export default function SentenceGymPage() {
  const toast = useToast();
  const [tab, setTab] = React.useState<Tab>('combining');
  const [idx, setIdx] = React.useState(0);
  const [attempted, setAttempted] = React.useState(0);
  const [completed, setCompleted] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [started, setStarted] = React.useState(false);

  const total = 5;
  React.useEffect(() => { setIdx(0); setAttempted(0); setCompleted(0); }, [tab]);

  function go(delta: number) {
    setIdx((i) => Math.max(0, Math.min(total - 1, i + delta)));
  }

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="space-y-6" aria-labelledby="gym-title">
      <SectionTitle id="gym-title">Sentence Gym</SectionTitle>
      <p className="text-slate-600 text-sm">Daily 5–10 minute drills. Use left/right arrows to switch items.</p>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Drill types">
        {(['combining','openers','punctuation','vocab'] as Tab[]).map(t => (
          <button key={t} role="tab" aria-selected={tab===t} className={`focus-ring rounded-md px-3 py-2 text-sm border ${tab===t? 'bg-brand text-white border-brand' : 'border-slate-300'}`} onClick={()=> setTab(t)}>
            {t[0].toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      <Card>
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-start">
          <div className="space-y-3">
            {tab === 'combining' && <Combining idx={idx} onAttempt={(c)=>{setAttempted(a=>Math.max(a, idx+1)); if(c) setCompleted(x=>x+1);}} />}
            {tab === 'openers' && <Openers idx={idx} onAttempt={(c)=>{setAttempted(a=>Math.max(a, idx+1)); if(c) setCompleted(x=>x+1);}} />}
            {tab === 'punctuation' && <Punctuation idx={idx} onAttempt={(c)=>{setAttempted(a=>Math.max(a, idx+1)); if(c) setCompleted(x=>x+1);}} />}
            {tab === 'vocab' && <Vocab idx={idx} onAttempt={(c)=>{setAttempted(a=>Math.max(a, idx+1)); if(c) setCompleted(x=>x+1);}} />}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="timer-select" className="text-xs font-medium text-slate-700">Timer preset</label>
            <select id="timer-select" className="rounded-md border border-slate-300 px-2 py-2 text-sm focus-ring" onChange={(e)=>{/* trigger re-render via key */}}>
              <option>10 minutes</option>
              <option>5 minutes</option>
            </select>
            <Timer initialMinutes={10} onStart={()=> setStarted(true)} onChange={(rem)=> setDuration((10*60)-rem)} />
            <ProgressBar label={`Progress (${completed}/${total})`} value={Math.round((completed/total)*100)} />
            <div className="flex gap-2">
              <button className="focus-ring rounded-md border border-slate-300 px-3 py-2 text-sm" onClick={()=> go(-1)} aria-label="Previous item">Prev</button>
              <button className="focus-ring rounded-md border border-slate-300 px-3 py-2 text-sm" onClick={()=> go(1)} aria-label="Next item">Next</button>
            </div>
            <button className="focus-ring rounded-md bg-brand px-3 py-2 text-sm font-semibold text-white" onClick={async ()=>{
              const res = await fetch('/api/gym/session', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ type: tab, itemsAttempted: attempted, itemsCompleted: completed, durationSec: duration }) });
              if ((await res.json()).ok) toast.show('Session saved', { type:'success' });
            }}>End Session</button>
          </div>
        </div>
      </Card>

      <ReviewCard type={tab} />
    </div>
  );
}

function bestKey(type: DrillType, id: string) { return `vh_gym_best_${type}_${id}`; }

function saveBest(type: DrillType, id: string, text: string) {
  try {
    const key = bestKey(type, id);
    const prev = localStorage.getItem(key) || '';
    if (text && text.length > prev.length) localStorage.setItem(key, text);
  } catch {}
}

function ReviewCard({ type }: { type: DrillType }) {
  const seeds = type==='combining'? COMBINING_SEED : type==='openers'? OPENERS_SEED : type==='punctuation'? PUNCTUATION_SEED : VOCAB_SEED;
  const list = seeds.slice(0,5);
  return (
    <Card title="Session Review">
      <ul className="space-y-2 text-sm">
        {list.map((it:any)=>{
          const key = bestKey(type, it.id);
          let best='';
          try{ best = localStorage.getItem(key) || ''; }catch{}
          return (
            <li key={it.id} className="rounded border border-slate-200 p-2">
              <div className="text-slate-600">Item {it.id}</div>
              <div className="mt-1 text-slate-800">{best ? best : 'No saved answer yet.'}</div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function Combining({ idx, onAttempt }:{ idx:number; onAttempt:(completed:boolean)=>void }){
  const item = COMBINING_SEED[idx];
  const [text, setText] = React.useState('');
  const submit = ()=>{
    const ok = /[,;]/.test(text) && text.trim().length>0; // simple rule: include comma/semicolon
    if (ok) saveBest('combining', item.id, text.trim());
    onAttempt(ok);
  };
  return (
    <div>
      <h3 className="font-semibold">Combining #{idx+1}</h3>
      <p className="text-sm text-slate-600">Rewrite the base sentences into 1–2 effective sentences. Aim for clarity and control.</p>
      <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
        {item.bases.map((b,i)=>(<li key={i}>{b}</li>))}
      </ul>
      <label htmlFor="comb" className="sr-only">Your rewrite</label>
      <textarea id="comb" value={text} onChange={e=> setText(e.target.value)} className="mt-2 w-full min-h-[90px] rounded-md border border-slate-300 p-2 text-sm focus-ring" placeholder="Your rewrite…" />
      <button className="mt-2 focus-ring rounded-md bg-brand px-3 py-2 text-sm font-semibold text-white" onClick={submit}>Check</button>
    </div>
  );
}

function Openers({ idx, onAttempt }:{ idx:number; onAttempt:(completed:boolean)=>void }){
  const item = OPENERS_SEED[idx];
  const [adv, setAdv] = React.useState('');
  const [ing, setIng] = React.useState('');
  const [ed, setEd] = React.useState('');
  const submit = ()=>{
    const ok = /\b\w+ly\b/.test(adv) && /^\w+ing\b/i.test(ing) && /^\w+ed\b/i.test(ed);
    if (ok) saveBest('openers', item.id, `${adv} | ${ing} | ${ed}`);
    onAttempt(ok);
  };
  return (
    <div>
      <h3 className="font-semibold">Openers #{idx+1}</h3>
      <p className="text-sm text-slate-600">Rewrite the base sentence in three ways: adverbial, -ing, -ed opener.</p>
      <div className="rounded-md bg-slate-50 p-2 text-sm text-slate-800">{item.base}</div>
      <div className="mt-2 grid gap-2 sm:grid-cols-3">
        <div>
          <label className="text-xs text-slate-600" htmlFor="op-adv">Adverbial</label>
          <input id="op-adv" value={adv} onChange={e=> setAdv(e.target.value)} className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm focus-ring" />
        </div>
        <div>
          <label className="text-xs text-slate-600" htmlFor="op-ing">-ing</label>
          <input id="op-ing" value={ing} onChange={e=> setIng(e.target.value)} className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm focus-ring" />
        </div>
        <div>
          <label className="text-xs text-slate-600" htmlFor="op-ed">-ed</label>
          <input id="op-ed" value={ed} onChange={e=> setEd(e.target.value)} className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm focus-ring" />
        </div>
      </div>
      <button className="mt-2 focus-ring rounded-md bg-brand px-3 py-2 text-sm font-semibold text-white" onClick={submit}>Check</button>
    </div>
  );
}

function Punctuation({ idx, onAttempt }:{ idx:number; onAttempt:(completed:boolean)=>void }){
  const item = PUNCTUATION_SEED[idx % PUNCTUATION_SEED.length];
  const [val, setVal] = React.useState('');
  const submit = ()=>{
    const ok = val === item.answer;
    if (ok) saveBest('punctuation', item.id, `${item.stem.replace('__', val)} (${item.explanation})`);
    onAttempt(ok);
  };
  return (
    <fieldset>
      <legend className="font-semibold">Punctuation #{idx+1}</legend>
      <p className="text-sm text-slate-800 mt-1">{item.stem.replace('__','____')}</p>
      <div className="mt-2 grid gap-2">
        {item.options.map(o=> (
          <label key={o.value} className="flex items-center gap-2 text-sm">
            <input type="radio" name={`p-${item.id}`} value={o.value} checked={val===o.value} onChange={()=> setVal(o.value)} className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand" />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
      <button className="mt-2 focus-ring rounded-md bg-brand px-3 py-2 text-sm font-semibold text-white" onClick={submit}>Check</button>
      <p className="text-xs text-slate-500 mt-1">Correct: {item.answer} — {item.explanation}</p>
    </fieldset>
  );
}

function Vocab({ idx, onAttempt }:{ idx:number; onAttempt:(completed:boolean)=>void }){
  const item = VOCAB_SEED[idx];
  const [text, setText] = React.useState('');
  const submit = ()=>{
    const used = item.bank.filter(w => new RegExp(`\\b${w}\\b`, 'i').test(text)).length;
    const ok = text.trim().length>0 && used >= 2;
    if (ok) saveBest('vocab', item.id, text.trim());
    onAttempt(ok);
  };
  return (
    <div>
      <h3 className="font-semibold">Vocab Upgrade #{idx+1}</h3>
      <p className="text-sm text-slate-600">Replace 2–3 bland words with stronger choices from the bank.</p>
      <div className="rounded-md bg-slate-50 p-2 text-sm text-slate-800">{item.bland}</div>
      <div className="mt-2 text-xs text-slate-600">Bank: {item.bank.join(', ')}</div>
      <label htmlFor="vocab" className="sr-only">Your rewrite</label>
      <textarea id="vocab" value={text} onChange={e=> setText(e.target.value)} className="mt-2 w-full min-h-[90px] rounded-md border border-slate-300 p-2 text-sm focus-ring" placeholder="Your improved sentence…" />
      <button className="mt-2 focus-ring rounded-md bg-brand px-3 py-2 text-sm font-semibold text-white" onClick={submit}>Check</button>
    </div>
  );
}

