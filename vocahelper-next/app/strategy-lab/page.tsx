"use client";
import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { LESSON_REGISTRY } from '@/content/lessons';
import { useToast } from '@/components/ui/Toast';

type ColumnId = 'ideas' | 'order' | 'moves';
type PlanItem = { id: string; text: string };
type PlanBoard = Record<ColumnId, PlanItem[]>;
type StrategyId = 'narrative' | 'persuasive' | 'descriptive';

const DEFAULT_BOARDS: Record<StrategyId, PlanBoard> = {
  narrative: { ideas: [], order: [], moves: [] },
  persuasive: { ideas: [], order: [], moves: [] },
  descriptive: { ideas: [], order: [], moves: [] },
};

const SR_KEY = 'vocahelper:plans';

function loadPlans(): Record<string, PlanBoard> {
  try { return JSON.parse(localStorage.getItem(SR_KEY) || '{}'); } catch { return {}; }
}
function savePlans(plans: Record<string, PlanBoard>) {
  try { localStorage.setItem(SR_KEY, JSON.stringify(plans)); } catch {}
}

export default function StrategyLabPage() {
  const toast = useToast();
  const [plans, setPlans] = React.useState<Record<string, PlanBoard>>({});
  const [expanded, setExpanded] = React.useState<Record<StrategyId, boolean>>({ narrative: true, persuasive: false, descriptive: false });
  const [target, setTarget] = React.useState<{ genre: string; lesson: string }>({ genre: 'narrative', lesson: 'suspense' });

  React.useEffect(() => { setPlans({ ...DEFAULT_BOARDS, ...loadPlans() }); }, []);
  React.useEffect(() => { if (Object.keys(plans).length) savePlans(plans); }, [plans]);

  const lessons = Object.entries(LESSON_REGISTRY).flatMap(([genre, ls]) => Object.keys(ls).map(lesson => ({ genre, lesson })));

  function update(strategy: StrategyId, board: PlanBoard) { setPlans(p => ({ ...p, [strategy]: board })); }

  function exportPlan(strategy: StrategyId) {
    const board = plans[strategy] || DEFAULT_BOARDS[strategy];
    const payload = { strategy, board, exportedAt: new Date().toISOString(), target };
    try {
      // Per-lesson key
      localStorage.setItem(`vocahelper:export_plan:${target.genre}:${target.lesson}`, JSON.stringify(payload));
      // Back-compat shared key
      localStorage.setItem('vocahelper:export_plan', JSON.stringify(payload));
    } catch {}
    toast.show('Plan exported to lesson', { type: 'success' });
  }

  function printPlan(strategy: StrategyId) {
    const board = plans[strategy] || DEFAULT_BOARDS[strategy];
    const html = `<!doctype html><title>Plan</title><body style="font-family:ui-sans-serif;padding:16px">
      <h1>Strategy Plan: ${strategy}</h1>
      <h2>Ideas</h2><ul>${board.ideas.map(i=>`<li>${i.text}</li>`).join('')}</ul>
      <h2>Order</h2><ol>${board.order.map(i=>`<li>${i.text}</li>`).join('')}</ol>
      <h2>Language Moves</h2><ul>${board.moves.map(i=>`<li>${i.text}</li>`).join('')}</ul>
      <script>window.print()</script>
    </body>`;
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); }
  }

  return (
    <div className="space-y-6">
      <SectionTitle>Strategy Lab (SRSD)</SectionTitle>
      <p className="text-slate-600 text-sm">Reusable planning strategies. Build your plan, export to a lesson, or print.</p>

      <div className="flex flex-wrap gap-2 items-end">
        <label className="text-xs text-slate-600">Export target</label>
        <select className="rounded-md border border-slate-300 px-2 py-2 text-sm focus-ring" value={`${target.genre}/${target.lesson}`} onChange={(e)=>{ const [g,l]=e.target.value.split('/'); setTarget({ genre:g, lesson:l }); }}>
          {lessons.map(({genre, lesson})=> <option key={`${genre}/${lesson}`} value={`${genre}/${lesson}`}>{genre} / {lesson}</option>)}
        </select>
        <Link href={`/genres/${target.genre}/${target.lesson}`} className="focus-ring rounded-md border border-slate-300 px-3 py-2 text-sm">Go to Lesson</Link>
      </div>

      <SelfRegulation />

      <div className="grid gap-4 md:grid-cols-3">
        <StrategyCard
          title="Narrative Plan" expanded={expanded.narrative}
          onToggle={()=> setExpanded(s=> ({...s, narrative: !s.narrative}))}
          board={plans.narrative || DEFAULT_BOARDS.narrative}
          onChange={(b)=> update('narrative', b)}
          preset={() => ({
            ideas: [i('mystery sound'), i('setting detail'), i('reaction')],
            order: [i('hook'), i('build tension'), i('cliffhanger')],
            moves: [i('short sentence'), i('sensory sound'), i('dash/colon')],
          })}
          onExport={()=> exportPlan('narrative')}
          onPrint={()=> printPlan('narrative')}
        />
        <StrategyCard
          title="Persuasive Plan (TREE)" expanded={expanded.persuasive}
          onToggle={()=> setExpanded(s=> ({...s, persuasive: !s.persuasive}))}
          board={plans.persuasive || DEFAULT_BOARDS.persuasive}
          onChange={(b)=> update('persuasive', b)}
          preset={() => ({
            ideas: [i('Topic sentence'), i('Reason 1 + example'), i('Reason 2 + example')],
            order: [i('T'), i('R'), i('E'), i('E')],
            moves: [i('formal tone'), i('modal verbs'), i('call to action')],
          })}
          onExport={()=> exportPlan('persuasive')}
          onPrint={()=> printPlan('persuasive')}
        />
        <StrategyCard
          title="Descriptive Plan" expanded={expanded.descriptive}
          onToggle={()=> setExpanded(s=> ({...s, descriptive: !s.descriptive}))}
          board={plans.descriptive || DEFAULT_BOARDS.descriptive}
          onChange={(b)=> update('descriptive', b)}
          preset={() => ({
            ideas: [i('3 precise nouns'), i('one personification'), i('sound image')],
            order: [i('wide to close'), i('contrast detail'), i('final image')],
            moves: [i('adjective-noun pairs'), i('varied sentence length'), i('figurative language')],
          })}
          onExport={()=> exportPlan('descriptive')}
          onPrint={()=> printPlan('descriptive')}
        />
      </div>
    </div>
  );
}

function SelfRegulation() {
  const [goal, setGoal] = React.useState(false);
  const [talk, setTalk] = React.useState(false);
  const [monitor, setMonitor] = React.useState(false);
  return (
    <Card title="Self‑regulation checklist">
      <ul className="grid gap-2 sm:grid-cols-3 text-sm">
        <li>
          <label className="flex items-center gap-2"><input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand" checked={goal} onChange={()=> setGoal(v=>!v)} /> Goal setting</label>
        </li>
        <li>
          <label className="flex items-center gap-2"><input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand" checked={talk} onChange={()=> setTalk(v=>!v)} /> Self-talk</label>
        </li>
        <li>
          <label className="flex items-center gap-2"><input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand" checked={monitor} onChange={()=> setMonitor(v=>!v)} /> Self‑monitoring</label>
        </li>
      </ul>
    </Card>
  );
}

function i(text:string){ return { id: Math.random().toString(36).slice(2,9), text }; }

function StrategyCard({ title, expanded, onToggle, board, onChange, onExport, onPrint, preset }:{ title:string; expanded:boolean; onToggle:()=>void; board:PlanBoard; onChange:(b:PlanBoard)=>void; onExport:()=>void; onPrint:()=>void; preset:()=>PlanBoard }){
  const [text, setText] = React.useState('');
  // local history stacks (undo/redo)
  const undoRef = React.useRef<PlanBoard[]>([]);
  const redoRef = React.useRef<PlanBoard[]>([]);
  const snapshot = (b: PlanBoard) => JSON.parse(JSON.stringify(b)) as PlanBoard;
  const columns: { id: ColumnId; title: string }[] = [
    { id:'ideas', title:'Ideas' },
    { id:'order', title:'Order' },
    { id:'moves', title:'Language Moves' },
  ];

  function commit(next: PlanBoard){ undoRef.current.push(snapshot(board)); redoRef.current = []; onChange(next); }

  function addTo(col: ColumnId){ if(!text.trim()) return; const item: PlanItem = { id: Math.random().toString(36).slice(2,9), text: text.trim() }; commit({ ...board, [col]: [...board[col], item] }); setText(''); }
  function move(col: ColumnId, index: number, dir: 'up'|'down'|'left'|'right'){
    const cols: ColumnId[] = ['ideas','order','moves'];
    const ci = cols.indexOf(col);
    const nextCol = dir==='left'? cols[Math.max(0,ci-1)] : dir==='right'? cols[Math.min(cols.length-1,ci+1)] : col;
    const clone: PlanBoard = snapshot(board);
    const arr = clone[col];
    const [item] = arr.splice(index,1);
    if(dir==='up' && index>0){ arr.splice(index-1,0,item); }
    else if(dir==='down' && index < arr.length){ arr.splice(index+1,0,item); }
    else if(dir==='left' || dir==='right') { (clone[nextCol] as PlanItem[]).splice((clone[nextCol] as PlanItem[]).length, 0, item); }
    commit(clone);
  }
  function remove(col: ColumnId, index:number){ const clone: PlanBoard = snapshot(board); (clone[col] as PlanItem[]).splice(index,1); commit(clone); }
  function loadPreset(){ const p = preset(); commit(p); }
  function undo(){ const prev = undoRef.current.pop(); if(prev){ redoRef.current.push(snapshot(board)); onChange(prev); } }
  function redo(){ const next = redoRef.current.pop(); if(next){ undoRef.current.push(snapshot(board)); onChange(next); } }

  return (
    <Card>
      <button className="w-full text-left" onClick={onToggle} aria-expanded={expanded}><div className="flex items-center justify-between"><div className="font-semibold">{title}</div><span>{expanded? '▾' : '▸'}</span></div></button>
      {expanded && (
        <div className="mt-3 space-y-3">
          <div className="flex gap-2">
            <input value={text} onChange={(e)=> setText(e.target.value)} placeholder="Add item" className="min-w-0 flex-1 rounded-md border border-slate-300 px-2 py-2 text-sm focus-ring" />
            {columns.map(c=> <button key={c.id} className="focus-ring rounded-md border border-slate-300 px-2 py-2 text-xs" onClick={()=> addTo(c.id)} aria-label={`Add to ${c.title}`}>+ {c.title}</button>)}
          </div>
          <div className="flex gap-2">
            <button className="focus-ring rounded-md border border-slate-300 px-2 py-1 text-xs" onClick={loadPreset} aria-label="Load preset">Load preset</button>
            <button className="focus-ring rounded-md border border-slate-300 px-2 py-1 text-xs" onClick={undo} aria-label="Undo">Undo</button>
            <button className="focus-ring rounded-md border border-slate-300 px-2 py-1 text-xs" onClick={redo} aria-label="Redo">Redo</button>
          </div>
          <div className="grid gap-3 grid-cols-3">
            {columns.map(c=> (
              <div key={c.id}>
                <div className="text-xs font-semibold text-slate-600">{c.title}</div>
                <ul className="mt-1 space-y-2">
                  {(board[c.id] || []).map((it, i)=> (
                    <li key={it.id} className="rounded border border-slate-200 p-2 text-sm">
                      <div>{it.text}</div>
                      <div className="mt-1 flex gap-1">
                        <button className="focus-ring rounded border border-slate-300 px-2 py-1 text-xs" onClick={()=> move(c.id, i, 'up')} aria-label="Move up">↑</button>
                        <button className="focus-ring rounded border border-slate-300 px-2 py-1 text-xs" onClick={()=> move(c.id, i, 'down')} aria-label="Move down">↓</button>
                        <button className="focus-ring rounded border border-slate-300 px-2 py-1 text-xs" onClick={()=> move(c.id, i, 'left')} aria-label="Move left">←</button>
                        <button className="focus-ring rounded border border-slate-300 px-2 py-1 text-xs" onClick={()=> move(c.id, i, 'right')} aria-label="Move right">→</button>
                        <button className="focus-ring rounded border border-slate-300 px-2 py-1 text-xs" onClick={()=> remove(c.id, i)} aria-label="Delete">✕</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="focus-ring rounded-md border border-slate-300 px-3 py-2 text-sm" onClick={onExport}>Export plan to lesson</button>
            <button className="focus-ring rounded-md border border-slate-300 px-3 py-2 text-sm" onClick={onPrint}>Print</button>
          </div>
        </div>
      )}
    </Card>
  );
}
