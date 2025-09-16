import * as React from 'react';

/**
 * Pill — compact label chip used for small metadata.
 */
export function Pill(
  props: React.PropsWithChildren<{ className?: string; color?: 'default' | 'brand' }>
) {
  const { className, color = 'default', children } = props;
  const styles =
    color === 'brand'
      ? 'bg-brand/10 text-brand border-brand/30'
      : 'bg-slate-50 text-slate-700 border-slate-200';
  return (
    <span
      className={
        `inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${styles} ` +
        (className || '')
      }
    >
      {children}
    </span>
  );
}

