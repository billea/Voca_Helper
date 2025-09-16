import * as React from 'react';

/**
 * Card — a simple container with padding and border.
 * @remarks
 * - Keyboard and screen-reader friendly. Title is rendered as an h3 by default.
 */
export function Card(
  props: React.PropsWithChildren<{
    /** Optional accessible title rendered in the header. */
    title?: string;
    /** Optional description below the title. */
    description?: string;
    /** Pass an id for aria-labelledby targeting. */
    id?: string;
    className?: string;
    /** Override title element. Defaults to h3. */
    titleAs?: keyof JSX.IntrinsicElements;
    /** Attach custom ARIA role when needed. */
    role?: React.AriaRole;
  }>
) {
  const { title, description, id, className, titleAs = 'h3', role, children } = props;
  const TitleTag = titleAs as any;
  const titleId = id ? `${id}-title` : undefined;

  return (
    <section
      role={role}
      aria-labelledby={title ? titleId : undefined}
      className={
        'rounded-xl border border-slate-200 bg-white p-4 shadow-sm ' + (className || '')
      }
    >
      {title && (
        <div className="mb-2">
          <TitleTag id={titleId} className="font-semibold text-slate-900">
            {title}
          </TitleTag>
          {description && (
            <p className="text-sm text-slate-600">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

