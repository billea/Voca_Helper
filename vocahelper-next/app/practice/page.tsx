"use client";
import React from 'react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { randomPrompt, GenreKey } from '@/content/prompts';
import { Timer } from '@/components/ui/Timer';
import { useToast } from '@/components/ui/Toast';

type Mode = 'quick' | 'standard' | 'full';
const DUR: Record<Mode, number> = { quick: 10, standard: 20, full: 30 };

export default function PracticePage() {
  const [mode, setMode] = React.useState<Mode>('quick');
  const [genre, setGenre] = React.useState<GenreKey>('narrative');
  const [prompt, setPrompt] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [content, setContent] = React.useState('');
  const [monospace, setMonospace] = React.useState(false);
  const [remaining, setRemaining] = React.useState(DUR[mode]*60);
  const [started, setStarted] = React.useState(false);
  const [id, setId] = React.useState('');
  const toast = useToast();
  const liveRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(()=>{ if(open){ const id = 'prac_'+Date.now().toString(36); setId(id); setPrompt(randomPrompt(genre)); setContent(''); setStarted(false);} },[open]);

  // Auto-save every 15s
  React.useEffect(()=>{
    if(!open) return; const h = setInterval(()=>{
      try{ localStorage.setItem(`vocahelper:practice:${id}`, JSON.stringify({ mode, genre, prompt, content, updatedAt: Date.now() })); }catch{}
    }, 15000); return ()=> clearInterval(h);
  },[open, id, content, mode, genre, prompt]);

  // Before unload warning
  React.useEffect(()=>{
    const onBefore = (e: BeforeUnloadEvent)=>{ if(open){ e.preventDefault(); e.returnValue=''; } };
    window.addEventListener('beforeunload', onBefore); return ()=> window.removeEventListener('beforeunload', onBefore);
  },[open]);

  function onKey(e: React.KeyboardEvent){ if(e.key==='Escape' && open){ setOpen(false); } }

  function startSession(){ setOpen(true); }

  // Resume last session helper
  function resumeCandidate(){
    try{
      const keys = Object.keys(localStorage).filter(k => k.startsWith('vocahelper:practice:'));
      let best: any = null; let bestKey='';
      for(const k of keys){ const v = JSON.parse(localStorage.getItem(k) || 'null'); if(v && (!best || (v.updatedAt||0) > (best.updatedAt||0))){ best=v; bestKey=k; } }
      if(best){ return { key: bestKey, data: best }; }
    }catch{}
    return null;
  }
  function onResume(){
    const cand = resumeCandidate(); if(!cand) return;
    const { data } = cand; setMode(data.mode); setGenre(data.genre); setPrompt(data.prompt); setContent(data.content||''); setOpen(true); setStarted(false); setId(cand.key.split(':').pop()||('prac_'+Date.now().toString(36)));
  }

  async function submit(improved=false){
    const res = await fetch('/api/practice/submission', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ mode, genre, prompt, content, improved, durationSec: DUR[mode]*60 - remaining }) });
    const data = await res.json();
    if (data?.ok){ toast.show('Submitted', { type:'success' }); setOpen(false); setShowReview(true); setResult({ id: data.id, next: data.nextStepTarget, first: content }); }
  }

  const [showReview, setShowReview] = React.useState(false);
  const [result, setResult] = React.useState<{ id:string; next:string; first:string }|null>(null);
  const [improve, setImprove] = React.useState('');
  const [improveRemaining, setImproveRemaining] = React.useState(5*60);

  return (
    <div className="space-y-6">
      <SectionTitle>Practice Arena</SectionTitle>
      <p className="text-slate-600 text-sm">Simulate exam conditions in a focused editor. (PWA offline support — TODO)</p>

      <Card title="Set up">
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="text-xs text-slate-600" htmlFor="mode">Mode</label>
            <select id="mode" value={mode} onChange={(e)=> setMode(e.target.value as Mode)} className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm focus-ring">
              <option value="quick">Quick (10m)</option>
              <option value="standard">Standard (20m)</option>
              <option value="full">Full (30m)</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-600" htmlFor="genre">Genre</label>
            <select id="genre" value={genre} onChange={(e)=> setGenre(e.target.value as GenreKey)} className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm focus-ring">
              <option value="narrative">Narrative</option>
              <option value="descriptive">Descriptive</option>
              <option value="persuasive">Persuasive</option>
              <option value="letters">Letters</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button className="focus-ring rounded-md bg-brand px-3 py-2 text-sm font-semibold text-white" onClick={startSession}>Start</button>
            <button className="focus-ring rounded-md border border-slate-300 px-3 py-2 text-sm" onClick={onResume}>Resume last</button>
          </div>
        </div>
      </Card>

      {showReview && result && (
        <Card title="Session Review">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-xs font-semibold text-slate-600">First Draft</div>
              <div className="mt-1 whitespace-pre-wrap rounded-md border border-slate-200 p-2 text-sm">{result.first}</div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-600">Improve Draft (5 min)</div>
                <Timer initialMinutes={5} onChange={(rem)=> setImproveRemaining(rem)} />
              </div>
              <textarea value={improve} onChange={(e)=> setImprove(e.target.value)} className="mt-1 w-full min-h-[160px] rounded-md border border-slate-300 p-2 text-sm focus-ring" />
              <button className="mt-2 focus-ring rounded-md bg-brand px-3 py-2 text-sm font-semibold text-white" onClick={async ()=>{
                const r = await fetch('/api/practice/submission', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ mode, genre, prompt, content: improve, improved:true, durationSec: (5*60)-improveRemaining }) });
                if ((await r.json()).ok) toast.show('Improved draft submitted', { type: 'success' });
              }}>Submit Improved</button>
            </div>
          </div>
        </Card>
      )}

      {open && (
        <FullScreenDialog onClose={()=> setOpen(false)} onKeyDown={onKey} ariaLabel="Practice editor">
          <div className="mx-auto w-full max-w-4xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500">Mode: {mode} • Genre: {genre}</div>
                <div className="mt-1 text-sm text-slate-700">{prompt}</div>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={monospace} onChange={(e)=> setMonospace(e.target.checked)} /> Monospace</label>
                <Timer initialMinutes={DUR[mode]} onStart={()=> setStarted(true)} onChange={(rem)=>{
                  setRemaining(rem);
                  const s = Math.round(rem);
                  if (liveRef.current && (s === 60 || s === 10)) liveRef.current.textContent = `Warning: ${s} seconds left`;
                }} />
              </div>
            </div>
            <NotesEditor content={content} setContent={setContent} monospace={monospace} />
            <div className="mt-2 flex justify-end gap-2">
              <button className="focus-ring rounded-md border border-slate-300 px-3 py-2 text-sm" onClick={()=> setOpen(false)} aria-label="Close">Close</button>
              <button className="focus-ring rounded-md bg-brand px-3 py-2 text-sm font-semibold text-white" onClick={()=> submit(false)}>Submit</button>
            </div>
            <div className="sr-only" aria-live="polite" ref={liveRef} />
          </div>
        </FullScreenDialog>
      )}
    </div>
  );
}

function NotesEditor({ content, setContent, monospace }:{ content:string; setContent:(v:string)=>void; monospace:boolean }){
  const [showNotes, setShowNotes] = React.useState(false);
  const [notes, setNotes] = React.useState('');
  React.useEffect(()=>{ try{ const saved = sessionStorage.getItem('vh_practice_notes'); if(saved) setNotes(saved); }catch{} },[]);
  React.useEffect(()=>{ try{ sessionStorage.setItem('vh_practice_notes', notes); }catch{} },[notes]);
  return (
    <div>
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={showNotes} onChange={(e)=> setShowNotes(e.target.checked)} /> Show Notes panel</label>
      </div>
      {showNotes ? (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <textarea value={content} onChange={(e)=> setContent(e.target.value)} className={`h-[60vh] w-full rounded-md border border-slate-300 p-3 text-sm focus-ring ${monospace? 'font-mono leading-7' : 'leading-7'}`} placeholder="Start writing…" />
          <textarea value={notes} onChange={(e)=> setNotes(e.target.value)} className={`h-[60vh] w-full rounded-md border border-slate-300 p-3 text-sm focus-ring ${monospace? 'font-mono leading-7' : 'leading-7'}`} placeholder="Notes…" />
        </div>
      ) : (
        <textarea value={content} onChange={(e)=> setContent(e.target.value)} className={`mt-3 h-[60vh] w-full rounded-md border border-slate-300 p-3 text-sm focus-ring ${monospace? 'font-mono leading-7' : 'leading-7'}`} placeholder="Start writing…" />
      )}
    </div>
  );
}

function FullScreenDialog({ children, onClose, onKeyDown, ariaLabel }:{ children: React.ReactNode; onClose: ()=>void; onKeyDown?: (e: React.KeyboardEvent)=>void; ariaLabel: string }){
  const ref = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(()=>{
    const onKey = (e: KeyboardEvent)=>{ if(e.key==='Escape') onClose(); };
    document.addEventListener('keydown', onKey); return ()=> document.removeEventListener('keydown', onKey);
  },[onClose]);
  React.useEffect(()=>{
    const root = document.body; const prev = root.style.overflow; root.style.overflow='hidden'; return ()=>{ root.style.overflow = prev; };
  },[]);
  // focus trap
  React.useEffect(()=>{
    const dlg = ref.current; if(!dlg) return; const sel = 'a,button,input,textarea,select,[tabindex]:not([tabindex="-1"])';
    const nodes = Array.from(dlg.querySelectorAll<HTMLElement>(sel));
    const first = nodes[0]; const last = nodes[nodes.length-1];
    first?.focus();
    const handle = (e: KeyboardEvent)=>{
      if(e.key==='Tab'){
        if(nodes.length===0) return;
        if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last?.focus(); }
        else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first?.focus(); }
      }
    };
    dlg.addEventListener('keydown', handle as any); return ()=> dlg.removeEventListener('keydown', handle as any);
  },[]);

  return (
    <div role="dialog" aria-modal="true" aria-label={ariaLabel} className="fixed inset-0 z-50 bg-white text-slate-900" onKeyDown={onKeyDown}>
      <div ref={ref} className="h-full overflow-auto">
        {children}
      </div>
    </div>
  );
}
