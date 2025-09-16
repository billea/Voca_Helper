"use client";
import * as React from 'react';

/**
 * Timer — keyboard accessible countdown timer.
 * @remarks
 * - ArrowRight/Left to add/subtract 10s when focused.
 * - Space/Enter toggles start/pause.
 * - Provides live region updates and role="timer".
 */
export function Timer({
  initialMinutes = 10,
  onStart,
  onPause,
  onReset,
  onChange,
}: {
  initialMinutes?: number;
  /** Called when timer starts */
  onStart?: () => void;
  /** Called when timer pauses */
  onPause?: () => void;
  /** Called when timer resets */
  onReset?: () => void;
  /** Called whenever remaining seconds change */
  onChange?: (remainingSec: number, running: boolean) => void;
}) {
  const total = initialMinutes * 60;
  const [remaining, setRemaining] = React.useState(total);
  const [running, setRunning] = React.useState(false);
  const raf = React.useRef<number | null>(null);
  const last = React.useRef<number | null>(null);
  const liveRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!running) return;
    const step = (t: number) => {
      if (last.current == null) last.current = t;
      const delta = (t - last.current) / 1000;
      last.current = t;
      setRemaining((r) => Math.max(0, r - delta));
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = null;
      last.current = null;
    };
  }, [running]);

  React.useEffect(() => {
    // Announce every 10s and when finished
    const s = Math.round(remaining);
    if (liveRef.current && (s % 10 === 0 || s === 0)) {
      const m = Math.floor(s / 60).toString().padStart(2, '0');
      const ss = Math.floor(s % 60).toString().padStart(2, '0');
      liveRef.current.textContent = `Timer ${m}:${ss}`;
    }
    onChange?.(Math.max(0, Math.round(remaining)), running);
  }, [remaining]);

  const toggle = () => setRunning((v) => {
    const next = !v;
    if (next) onStart?.(); else onPause?.();
    return next;
  });
  const reset = () => { setRunning(false); setRemaining(total); onReset?.(); };
  const add = (secs: number) => setRemaining((r) => Math.max(0, Math.min(total, r + secs)));

  const minutes = Math.floor(remaining / 60).toString().padStart(2, '0');
  const seconds = Math.floor(remaining % 60).toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-3">
      <div
        role="timer"
        aria-live="polite"
        aria-atomic="true"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); }
          if (e.key === 'ArrowRight') add(10);
          if (e.key === 'ArrowLeft') add(-10);
        }}
        className="rounded-md border border-slate-200 px-3 py-2 font-mono text-lg focus-ring"
      >
        {minutes}:{seconds}
      </div>
      <div className="flex gap-2">
        <button className="focus-ring rounded-md bg-brand px-3 py-2 text-sm font-medium text-white" onClick={toggle}>
          {running ? 'Pause' : 'Start'}
        </button>
        <button className="focus-ring rounded-md border border-slate-300 px-3 py-2 text-sm" onClick={reset}>
          Reset
        </button>
      </div>
      <div className="sr-only" aria-live="polite" ref={liveRef} />
    </div>
  );
}
