import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * VocaHelper — 11+ Writing Mockups
 * - Homepage wireframe
 * - Sample Lesson screen layout (Narrative Studio → Suspense Writing)
 *
 * Notes for integration:
 * 1) Drop this component anywhere in your app (e.g., /mockups route) to preview UX.
 * 2) Replace placeholders (Lorem and "+") with real data from your backend.
 * 3) TailwindCSS classes are used for styling. Ensure Tailwind is enabled.
 */

const SectionTitle: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="flex flex-col gap-1">
    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h2>
    {subtitle && <p className="text-sm md:text-base text-slate-600">{subtitle}</p>}
  </div>
);

const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  role?: string;
  ariaLabel?: string;
}> = ({ children, className = "", onClick, role, ariaLabel }) => (
  <div
    role={role}
    aria-label={ariaLabel}
    tabIndex={0}
    onClick={onClick}
    className={`rounded-2xl shadow-sm border border-slate-200 bg-white hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 ${className}`}
  >
    {children}
  </div>
);

const Pill: React.FC<{ children: React.ReactNode }>=({ children }) => (
  <span className="px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-700">{children}</span>
);

const NavButton: React.FC<{ active?: boolean; onClick: () => void; children: React.ReactNode }>=({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-3 md:px-4 py-2 rounded-xl text-sm md:text-base transition font-medium ${active ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 hover:bg-slate-50"}`}
  >
    {children}
  </button>
);

const ProgressBar: React.FC<{ value: number }>=({ value }) => (
  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
    <div className="h-full bg-indigo-600" style={{ width: `${value}%` }} />
  </div>
);

const Stat: React.FC<{ label: string; value: string }>=({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-sm text-slate-500">{label}</span>
    <span className="text-lg md:text-xl font-semibold">{value}</span>
  </div>
);

const CheckItem: React.FC<{ label: string; checked: boolean; onToggle: () => void }>=({ label, checked, onToggle }) => (
  <label className="flex items-center gap-3 cursor-pointer select-none">
    <input type="checkbox" checked={checked} onChange={onToggle} className="w-4 h-4 rounded" />
    <span className="text-sm text-slate-700">{label}</span>
  </label>
);

const Timer: React.FC<{ seconds: number; running: boolean; onDone?: () => void }>=({ seconds, running, onDone }) => {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    if (!running) return;
    if (remaining <= 0) { onDone && onDone(); return; }
    const id = setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => clearTimeout(id);
  }, [running, remaining, onDone]);
  const m = Math.floor(remaining / 60).toString().padStart(2, "0");
  const s = (remaining % 60).toString().padStart(2, "0");
  return (
    <div className="text-2xl font-semibold tabular-nums" aria-live="polite">{m}:{s}</div>
  );
};

const Homepage: React.FC<{ onStartDiagnostic: () => void; onOpenLesson: () => void }>=({ onStartDiagnostic, onOpenLesson }) => (
  <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
    {/* Hero */}
    <div className="grid md:grid-cols-2 gap-6 items-center">
      <div className="space-y-5">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">Boost Your 11+ Writing — the smart, kid-friendly way</h1>
        <p className="text-slate-600 md:text-lg">VocaHelper guides 9–11 year olds through short, focused sessions that mirror grammar & independent school exam tasks. Built on SRSD strategies, sentence-combining drills, worked examples, and spaced practice.</p>
        <div className="flex gap-3">
          <button onClick={onStartDiagnostic} className="px-5 py-3 rounded-2xl bg-indigo-600 text-white font-semibold shadow hover:shadow-md">Start Free Diagnostic</button>
          <button onClick={onOpenLesson} className="px-5 py-3 rounded-2xl bg-white border border-slate-200 font-semibold hover:bg-slate-50">Preview a Lesson</button>
        </div>
        <div className="flex gap-2 items-center pt-1">
          <Pill>11+ Narrative</Pill>
          <Pill>Descriptive</Pill>
          <Pill>Persuasive</Pill>
          <Pill>Letters</Pill>
        </div>
      </div>
      <Card className="p-6 md:p-8">
        <SectionTitle title="Today’s Plan" subtitle="Fast, focused practice in under 25 minutes" />
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Sentence Gym</span>
            <span className="text-sm text-slate-500">3–5 mins</span>
          </div>
          <ProgressBar value={20} />
          <div className="flex items-center justify-between">
            <span className="font-medium">Mini-lesson: Suspense Openings</span>
            <span className="text-sm text-slate-500">5 mins</span>
          </div>
          <ProgressBar value={0} />
          <div className="flex items-center justify-between">
            <span className="font-medium">Timed Writing</span>
            <span className="text-sm text-slate-500">10–12 mins</span>
          </div>
          <ProgressBar value={0} />
          <div className="flex items-center justify-between">
            <span className="font-medium">Self-check & Edit</span>
            <span className="text-sm text-slate-500">2–3 mins</span>
          </div>
          <ProgressBar value={0} />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <Stat label="Genres Covered" value="2/4" />
          <Stat label="Writing Streak" value="5 days" />
          <Stat label="Focus" value="Sentence Variety" />
        </div>
      </Card>
    </div>

    {/* Quick links */}
    <div className="mt-12 grid md:grid-cols-4 gap-4">
      {[
        { title: "Start Diagnostic", desc: "10-minute baseline test to create your plan.", action: onStartDiagnostic },
        { title: "Genre Studios", desc: "Narrative, Descriptive, Persuasive, Letters.", action: onOpenLesson },
        { title: "Sentence Gym", desc: "Daily 5–10 minute drills for sentence power.", action: onOpenLesson },
        { title: "Timed Practice", desc: "Exam-mode tasks: 10, 20, 30 minutes.", action: onOpenLesson },
      ].map((x, i) => (
        <Card key={i} className="p-5" onClick={x.action} role="button" ariaLabel={x.title}>
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-lg">{x.title}</h3>
            <p className="text-sm text-slate-600">{x.desc}</p>
          </div>
        </Card>
      ))}
    </div>

    {/* Testimonials / Trust */}
    <div className="mt-12 grid md:grid-cols-3 gap-4">
      {["My child finally enjoys writing!", "The timed tasks feel just like the real exam.", "We love the simple feedback and targets."].map((q, i) => (
        <Card key={i} className="p-5">
          <p className="text-slate-700">“{q}”</p>
          <div className="mt-3 text-sm text-slate-500">— Parent, Year 5</div>
        </Card>
      ))}
    </div>
  </div>
);

const LessonScreen: React.FC = () => {
  const [running, setRunning] = useState(false);
  const [checklist, setChecklist] = useState([false, false, false]);
  const [draft, setDraft] = useState("");
  const seconds = 10 * 60; // 10-minute demo

  const toggle = (idx: number) => setChecklist(cs => cs.map((c, i) => (i === idx ? !c : c)));

  const scoreHints = useMemo(() => {
    const hints = [] as string[];
    const longRun = draft.split(" ").length > 120;
    const repeatedThe = (draft.match(/\bthe\b/gi) || []).length > 8;
    if (!/[\.!?]/.test(draft)) hints.push("Try finishing some sentences with full stops for control.");
    if (repeatedThe) hints.push("You use ‘the’ a lot — try varied openers (adverbials, -ing, -ed, dialogue).");
    if (!/,|;|:|—|-/.test(draft)) hints.push("Experiment with commas, colons or dashes to vary rhythm.");
    if (!/(whisper|creak|footsteps|shadow|heartbeat)/i.test(draft)) hints.push("Add 1–2 suspense words (e.g., ‘creak’, ‘shadow’, ‘heartbeat’).");
    if (!/(I |my |we |our )/.test(draft) && longRun) hints.push("Zoom in on sensations (what can the narrator hear/feel/see?).");
    return hints;
  }, [draft]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10">
      {/* Breadcrumb */}
      <div className="text-sm text-slate-500 mb-4">Home / Genre Studios / <span className="text-slate-700 font-medium">Narrative</span> / Suspense Opening</div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-semibold">Suspense Writing — Opening a Story</h1>
          <p className="text-slate-600 max-w-2xl">Goal: craft a tense opening using short sentences, sensory detail, and a question or cliffhanger.
          </p>
        </div>
        <Card className="p-4 md:min-w-[260px]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Timer</span>
            <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">10 min</span>
          </div>
          <div className="mt-2 flex items-center gap-4">
            <Timer seconds={seconds} running={running} />
            <button
              onClick={() => setRunning(r => !r)}
              className={`px-3 py-2 rounded-xl text-sm font-medium ${running ? "bg-rose-600 text-white" : "bg-indigo-600 text-white"}`}
            >
              {running ? "Pause" : "Start"}
            </button>
          </div>
        </Card>
      </div>

      {/* Grid */}
      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        {/* Left: Lesson + Prompt */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5">
            <SectionTitle title="Mini-lesson" subtitle="Watch the model and steal the moves" />
            <div className="mt-3 grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-slate-700">Strong opening example:</p>
                <div className="p-3 bg-slate-50 rounded-xl text-sm">
                  The corridor was too quiet. A door <em>clicked</em>. Then—silence. I held my breath and listened: <em>footsteps</em>, somewhere close.
                </div>
                <ul className="text-sm text-slate-600 list-disc pl-5">
                  <li>Short sentences quicken pace</li>
                  <li>Sensory detail (sound: click, footsteps)</li>
                  <li>Colon for emphasis</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-700">Weaker opening (for contrast):</p>
                <div className="p-3 bg-slate-50 rounded-xl text-sm">
                  The corridor was long and it had many doors and I was walking and it was dark and scary and I felt worried.
                </div>
                <ul className="text-sm text-slate-600 list-disc pl-5">
                  <li>Run-on sentence → hard to feel tension</li>
                  <li>Vague adjectives (dark, scary)</li>
                  <li>No specific detail or rhythm changes</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle title="Your prompt" subtitle="Write a tense opening (8–12 sentences)" />
            <div className="mt-3 p-3 bg-slate-50 rounded-xl text-sm">
              It is late. A strange noise wakes you. You step onto the landing and the house feels different tonight…
            </div>
            <textarea
              aria-label="Writing area"
              placeholder="Start your opening here…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="mt-4 w-full min-h-[220px] rounded-xl border border-slate-200 p-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <div className="mt-3 flex items-center justify-end gap-3">
              <button className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50">Save Draft</button>
              <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white">Submit for Feedback</button>
            </div>
          </Card>
        </div>

        {/* Right: Checklist + Hints */}
        <div className="space-y-6">
          <Card className="p-5">
            <SectionTitle title="Checklist" subtitle="Tick as you write (SRSD)" />
            <div className="mt-3 flex flex-col gap-3">
              <CheckItem label="Used at least 2 short sentences for tension" checked={checklist[0]} onToggle={() => toggle(0)} />
              <CheckItem label="Added sensory detail (sound/feel/sight)" checked={checklist[1]} onToggle={() => toggle(1)} />
              <CheckItem label="Ended with a hook (question/ellipsis/cliffhanger)" checked={checklist[2]} onToggle={() => toggle(2)} />
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle title="Instant Hints" subtitle="Auto checks based on your draft" />
            <ul className="mt-3 list-disc pl-5 text-sm text-slate-700">
              {scoreHints.length === 0 ? <li>Looking good — keep going!</li> : scoreHints.map((h, i) => <li key={i}>{h}</li>)}
            </ul>
          </Card>

          <Card className="p-5">
            <SectionTitle title="Success Criteria" subtitle="What examiners want to see" />
            <ul className="mt-3 list-disc pl-5 text-sm text-slate-700">
              <li>Clear control of sentence length and punctuation</li>
              <li>Precise vocabulary (avoid vague fillers)</li>
              <li>Cohesion across sentences (pronouns, connectives)</li>
              <li>Audience & purpose awareness (tone fits suspense)</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

const TopNav: React.FC<{ view: string; setView: (v: string) => void }>=({ view, setView }) => (
  <div className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 grid place-content-center rounded-xl bg-indigo-600 text-white font-bold">V</div>
        <div className="leading-tight">
          <div className="font-semibold">VocaHelper</div>
          <div className="text-xs text-slate-500">11+ Writing</div>
        </div>
      </div>

      <div className="flex gap-2">
        <NavButton active={view === "home"} onClick={() => setView("home")}>Homepage</NavButton>
        <NavButton active={view === "lesson"} onClick={() => setView("lesson")}>Sample Lesson</NavButton>
      </div>
    </div>
  </div>
);

const Shell: React.FC<{ children: React.ReactNode }>=({ children }) => (
  <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">{children}</div>
);

const ViewSwitch: React.FC = () => {
  const [view, setView] = useState<"home" | "lesson">("home");
  return (
    <Shell>
      <TopNav view={view} setView={setView} />
      <AnimatePresence mode="wait">
        {view === "home" ? (
          <motion.div key="home" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
            <Homepage onStartDiagnostic={() => setView("lesson")} onOpenLesson={() => setView("lesson")} />
          </motion.div>
        ) : (
          <motion.div key="lesson" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
            <LessonScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </Shell>
  );
};

export default function VocaHelper11PlusMockups(){
  return <ViewSwitch />;
}
