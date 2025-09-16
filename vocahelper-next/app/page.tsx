import Link from 'next/link';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Stat } from '@/components/ui/Stat';

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <header className="grid items-start gap-8 md:grid-cols-2">
        <div className="space-y-5">
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">
            Boost Your 11+ Writing Skills
          </h1>
          <p className="text-slate-600">
            Short, focused sessions that mirror grammar and independent school exam tasks.
            Built on SRSD strategies, sentence‑combining drills, worked examples, and spaced practice.
          </p>
          <div className="flex flex-wrap gap-2">
            <Pill>11+ Narrative</Pill>
            <Pill>Descriptive</Pill>
            <Pill>Persuasive</Pill>
            <Pill>Letters</Pill>
          </div>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/diagnostic"
              data-testid="cta-diagnostic"
              className="focus-ring inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white"
              aria-label="Start Free Diagnostic"
            >
              Start Free Diagnostic
            </Link>
            <Link
              href="/genres/narrative/suspense"
              data-testid="cta-lesson"
              className="focus-ring inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              aria-label="Preview a Lesson"
            >
              Preview a Lesson
            </Link>
          </div>
        </div>

        {/* Today’s Plan */}
        <Card aria-labelledby="plan-title">
          <div className="flex items-center justify-between">
            <SectionTitle id="plan-title">Today’s Plan</SectionTitle>
            <span className="text-xs text-slate-500">20–25 minutes</span>
          </div>
          <div className="mt-4 space-y-3">
            <ProgressBar label="Sentence Gym" value={25} max={100} hint="3–5 mins" />
            <ProgressBar label="Mini‑lesson: Suspense Openings" value={0} max={100} hint="5 mins" />
            <ProgressBar label="Timed Writing" value={0} max={100} hint="10–12 mins" />
            <ProgressBar label="Self‑check & Edit" value={0} max={100} hint="2–3 mins" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Stat label="Genres Covered" value="2/4" />
            <Stat label="Writing Streak" value="5 days" />
            <Stat label="Focus" value="Sentence Variety" />
          </div>
        </Card>
      </header>

      {/* Quick Links */}
      <section aria-labelledby="quick-links-title" className="space-y-3">
        <SectionTitle id="quick-links-title">Quick Links</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <Link href="/diagnostic" className="focus-ring block rounded-md p-2" aria-label="Go to Diagnostic">
              <h3 className="font-semibold">Start Diagnostic</h3>
              <p className="text-sm text-slate-600">10‑minute baseline test to create your plan.</p>
            </Link>
          </Card>
          <Card>
            <Link href="/genres" className="focus-ring block rounded-md p-2" aria-label="Explore Genre Studios">
              <h3 className="font-semibold">Genre Studios</h3>
              <p className="text-sm text-slate-600">Narrative, Descriptive, Persuasive, Letters.</p>
            </Link>
          </Card>
          <Card>
            <Link href="/sentence-gym" className="focus-ring block rounded-md p-2" aria-label="Open Sentence Gym">
              <h3 className="font-semibold">Sentence Gym</h3>
              <p className="text-sm text-slate-600">Daily 5–10 minute drills for sentence power.</p>
            </Link>
          </Card>
          <Card>
            <Link href="/practice" className="focus-ring block rounded-md p-2" aria-label="Timed Practice">
              <h3 className="font-semibold">Timed Practice</h3>
              <p className="text-sm text-slate-600">Exam‑mode tasks: 10, 20, 30 minutes.</p>
            </Link>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section aria-labelledby="testimonials-title" className="space-y-3">
        <SectionTitle id="testimonials-title">What Parents Say</SectionTitle>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <p className="text-sm text-slate-700">“My child finally enjoys writing!”</p>
            <p className="mt-1 text-xs text-slate-500">— Parent, Year 5</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-700">“The timed tasks feel just like the real exam.”</p>
            <p className="mt-1 text-xs text-slate-500">— Parent, Year 5</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-700">“We love the simple feedback and targets.”</p>
            <p className="mt-1 text-xs text-slate-500">— Parent, Year 5</p>
          </Card>
        </div>
      </section>
    </div>
  );
}
