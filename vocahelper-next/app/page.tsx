import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Stat } from '@/components/ui/Stat';
import { Timer } from '@/components/ui/Timer';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <header className="grid gap-6 md:grid-cols-2 items-start">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
            Boost Your 11+ Writing — the smart, kid‑friendly way
          </h1>
          <p className="text-slate-600">
            Short, focused sessions that mirror grammar and independent school exam tasks. Built on SRSD strategies, sentence‑combining drills, worked examples, and spaced practice.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Pill>11+ Narrative</Pill>
            <Pill>Descriptive</Pill>
            <Pill>Persuasive</Pill>
            <Pill>Letters</Pill>
          </div>
        </div>
        <Card aria-labelledby="plan-title">
          <div className="flex items-center justify-between">
            <SectionTitle id="plan-title">Today’s Plan</SectionTitle>
            <span className="text-xs text-slate-500">Under 25 minutes</span>
          </div>
          <div className="mt-3 space-y-3">
            <ProgressBar label="Sentence Gym" value={25} max={100} hint="3–5 mins" />
            <ProgressBar label="Mini‑lesson: Suspense Openings" value={0} max={100} hint="5 mins" />
            <ProgressBar label="Timed Writing" value={0} max={100} hint="10–12 mins" />
            <ProgressBar label="Self‑check & Edit" value={0} max={100} hint="2–3 mins" />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <Stat label="Genres Covered" value="2/4" />
            <Stat label="Writing Streak" value="5 days" />
            <Stat label="Focus" value="Sentence Variety" />
          </div>
        </Card>
      </header>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Start Diagnostic" description="10‑minute baseline test to create your plan." />
        <Card title="Genre Studios" description="Narrative, Descriptive, Persuasive, Letters." />
        <Card title="Sentence Gym" description="Daily 5–10 minute drills for sentence power." />
        <Card title="Timed Practice" description="Exam‑mode tasks: 10, 20, 30 minutes." />
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <Card title="Timer (10m demo)">
          <Timer initialMinutes={10} />
        </Card>
        <Card title="Notes">
          <p className="text-sm text-slate-600">Accessible, mobile‑first components built with Tailwind and TypeScript.</p>
        </Card>
      </section>
    </div>
  );
}

