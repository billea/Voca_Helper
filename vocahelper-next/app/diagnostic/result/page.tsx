"use client";
import React from 'react';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';
import Link from 'next/link';

type Result = {
  words: number;
  sentences: number;
  durationSec: number;
  strengths: string[];
  focusAreas: string[];
};

export default function DiagnosticResultPage() {
  const [result, setResult] = React.useState<Result | null>(null);
  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem('diag_result_v1');
      if (raw) setResult(JSON.parse(raw));
    } catch { /* noop */ }
  }, []);

  const mins = result ? Math.round(result.durationSec / 60) : 0;

  return (
    <div className="space-y-8">
      <SectionTitle>Diagnostic Result</SectionTitle>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Overview">
          {result ? (
            <ul className="text-sm text-slate-700 space-y-1">
              <li>Words: <strong>{result.words}</strong></li>
              <li>Sentences: <strong>{result.sentences}</strong></li>
              <li>Time: <strong>{mins} min</strong></li>
            </ul>
          ) : (
            <p className="text-sm text-slate-600">No data. Please run the diagnostic.</p>
          )}
        </Card>

        <Card title="Strengths">
          <ul className="text-sm text-slate-700 list-disc pl-5">
            {(result?.strengths || ['Ideas', 'Vocabulary']).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Card>

        <Card title="Focus Areas (2–3)">
          <ul className="text-sm text-slate-700 list-disc pl-5">
            {(result?.focusAreas || ['Sentence variety', 'Punctuation for control']).map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="Recommended Path">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          <div className="rounded-lg border border-slate-200 p-3">
            <div className="font-semibold">Narrative → Suspense</div>
            <p className="text-slate-600">Work on tension and control in openings.</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <div className="font-semibold">Sentence Gym → Combining</div>
            <p className="text-slate-600">Daily 5–10 minute drills for sentence power.</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <div className="font-semibold">Strategy Lab → TREE</div>
            <p className="text-slate-600">Plan ideas using topic, reasons, evidence, ending.</p>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <Link href="/genres/narrative/suspense" className="focus-ring rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white">Start Suspense Lesson</Link>
          <Link href="/sentence-gym" className="focus-ring rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold">Go to Sentence Gym</Link>
        </div>
      </Card>
    </div>
  );
}

