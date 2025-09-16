import * as React from 'react';

/**
 * ProgressBar — labeled progress with accessible semantics.
 * - Uses role="progressbar" with aria-valuenow/min/max and aria-labelledby.
 */
export function ProgressBar({
  label,
  value,
  max = 100,
  hint,
  id
}: {
  /** Visible label for the progress bar. */
  label: string;
  /** Current value. */
  value: number;
  /** Max value. Defaults to 100. */
  max?: number;
  /** Optional small hint to the right. */
  hint?: string;
  /** Optional id base used to derive aria-labelledby. */
  id?: string;
}) {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  const labelId = (id || label.replace(/\s+/g, '-').toLowerCase()) + '-label';
  return (
    <div>
      <div className="flex items-center justify-between">
        <span id={labelId} className="text-sm font-medium text-slate-800">
          {label}
        </span>
        {hint && <span className="text-xs text-slate-500">{hint}</span>}
      </div>
      <div
        role="progressbar"
        aria-labelledby={labelId}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="mt-1 h-2 w-full rounded-full bg-slate-100"
      >
        <div
          className="h-2 rounded-full bg-brand transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

