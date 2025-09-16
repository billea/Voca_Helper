import * as React from 'react';

/**
 * SectionTitle — semantic section heading with consistent styling.
 * @param props.id Optional id to link with aria-labelledby.
 */
export function SectionTitle(
  props: React.PropsWithChildren<{ id?: string; className?: string }>
) {
  const { id, className, children } = props;
  return (
    <h2 id={id} className={"text-lg font-bold text-slate-900 " + (className || "")}>{children}</h2>
  );
}

