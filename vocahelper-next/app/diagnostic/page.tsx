"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Timer } from '@/components/ui/Timer';

type Answer = { qid: string; answer: string | string[] };

const QUIZ = [
  {
    qid: 'combine-1',
    type: 'multi',
    prompt: 'Combine the pair to make a clear sentence:',
    stem: 'It was late. The window creaked.',
    options: [
      'It was late, and the window creaked.',
      'It was late; the window creaked.',
      'It was late the window creaked.',
      'It was late: the window creaked.'
    ],
    acceptable: [0,1,3]
  },
  {
    qid: 'combine-2',
    type: 'multi',
    prompt: 'Combine the pair to vary rhythm:',
    stem: 'I heard a noise. I froze.',
    options: [
      'Hearing a noise, I froze.',
      'I heard a noise I froze.',
      'I heard a noise; I froze.',
      'I heard a noise: I froze.'
    ],
    acceptable: [0,2,3]
  },
  {
    qid: 'punct-1',
    type: 'single',
    prompt: 'Choose the best punctuation for control:',
    stem: 'The corridor was silent — I held my breath',
    options: ['.', '!', '…', '?'],
    acceptable: 0
  },
  {
    qid: 'punct-2',
    type: 'single',
    prompt: 'Choose the best punctuation:',
    stem: 'Footsteps stopped outside my door',
    options: ['.', '—', '…', '!'],
    acceptable: 0
  },
  {
    qid: 'opener-1',
    type: 'single',
    prompt: 'Choose the stronger opener:',
    options: [
      'I walked down the stairs.',
      'Down the stairs, I crept.'
    ],
    acceptable: 1
  },
  {
    qid: 'opener-2',
    type: 'single',
    prompt: 'Choose the stronger opener:',
    options: [
      'It was really very dark outside.',
      'Outside, the dark pressed against the windows.'
    ],
    acceptable: 1
  }
] as const;

export default function DiagnosticPage() {
  const router = useRouter();
  const [draft, setDraft] = React.useState('');
  const [started, setStarted] = React.useState(false);
  const [remaining, setRemaining] = React.useState(10*60);
  const [answers, setAnswers] = React.useState<Record<string, string | string[]>>({});
  const words = (draft.trim().match(/\b\w+\b/g) || []).length;
  const canSubmit = started && words >= 80;

  function updateAnswer(qid: string, value: string, multi = false) {
    setAnswers((prev) => {
      if (!multi) return { ...prev, [qid]: value };
      const current = new Set<string>(Array.isArray(prev[qid]) ? (prev[qid] as string[]) : []);
      if (current.has(value)) current.delete(value); else current.add(value);
      return { ...prev, [qid]: Array.from(current) };
    });
  }

  async function onSubmit() {
    const payload = {
      writingDraft: draft,
      quizAnswers: Object.entries(answers).map(([qid, answer]) => ({ qid, answer })) as Answer[],
      durationSec: 10*60 - remaining,
    };
    const res = await fetch('/api/diagnostic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    sessionStorage.setItem('diag_result_v1', JSON.stringify(data));
    router.push('/diagnostic/result');
  }

  return (
    <div className="space-y-8">
      <SectionTitle>Baseline Diagnostic</SectionTitle>

      {/* 1) Intro */}
      <Card title="What’s assessed" description="A short writing task and a quick sentence skills check help us personalise your path.">
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
          <li>10‑minute narrative opening (ideas, vocabulary, control)</li>
          <li>6‑item sentence skills micro‑quiz</li>
        </ul>
      </Card>

      {/* 2) Baseline writing task */}
      <Card>
        <h3 className="font-semibold">Timed baseline writing task</h3>
        <p className="mt-1 text-sm text-slate-600">Prompt (10 min): Write the opening of a story where a character hears a strange noise at night.</p>
        <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto] md:items-start">
          <label className="sr-only" htmlFor="draft">Your draft</label>
          <textarea
            id="draft"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="min-h-[180px] w-full resize-vertical rounded-md border border-slate-300 p-3 text-sm focus-ring"
            placeholder="Type your opening here…"
            aria-describedby="draft-help"
          />
          <div className="flex flex-col gap-2">
            <Timer
              initialMinutes={10}
              onStart={() => setStarted(true)}
              onChange={(rem) => setRemaining(rem)}
            />
            <div id="draft-help" className="text-xs text-slate-500">
              {words} words • {draft.length} chars
            </div>
          </div>
        </div>
      </Card>

      {/* 3) Sentence skills micro‑quiz */}
      <Card title="Sentence skills micro‑quiz (6 items)">
        <div className="space-y-5">
          {QUIZ.map((q) => (
            <fieldset key={q.qid} className="rounded-md border border-slate-200 p-3">
              <legend className="font-medium text-sm text-slate-800">{q.prompt}</legend>
              {q.stem && <p className="mt-1 text-sm text-slate-600">{q.stem}</p>}
              <div className="mt-2 grid gap-2">
                {q.options.map((opt, idx) => {
                  const id = `${q.qid}-${idx}`;
                  const multi = q.type === 'multi';
                  const name = q.qid;
                  const isChecked = Array.isArray(answers[q.qid])
                    ? (answers[q.qid] as string[]).includes(String(idx))
                    : answers[q.qid] === String(idx);
                  return (
                    <label key={id} htmlFor={id} className="flex items-center gap-2 text-sm">
                      <input
                        id={id}
                        name={name}
                        type={multi ? 'checkbox' : 'radio'}
                        value={String(idx)}
                        checked={!!isChecked}
                        onChange={() => updateAnswer(q.qid, String(idx), multi)}
                        className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
                        aria-checked={isChecked}
                      />
                      <span>{opt}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>
      </Card>

      {/* 4) Submit */}
      <div className="flex justify-end">
        <button
          disabled={!canSubmit}
          onClick={onSubmit}
          className="focus-ring inline-flex items-center rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          aria-disabled={!canSubmit}
          aria-label="Submit diagnostic"
        >
          Submit Diagnostic
        </button>
      </div>
    </div>
  );
}

