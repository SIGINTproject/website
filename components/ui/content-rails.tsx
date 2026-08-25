import type { ReactNode } from "react";

/**
 * Flanks a narrow, centered content column with a pair of thin decorative
 * rails, so the wide gutters either side of it (from the page's much wider
 * max-w-site container) read as intentional framing rather than dead space.
 * Purely visual: aria-hidden, hidden below `lg` where there's no gutter to
 * fill in the first place.
 */
export function ContentRails({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`relative ${className}`}>
      <span
        aria-hidden="true"
        className="absolute inset-y-0 -left-8 hidden w-px bg-line lg:block xl:-left-14"
      >
        <span className="absolute left-1/2 top-12 size-2 -translate-x-1/2 border border-signal bg-paper" />
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-y-0 -right-8 hidden w-px bg-line lg:block xl:-right-14"
      >
        <span className="absolute left-1/2 top-12 size-2 -translate-x-1/2 border border-signal bg-paper" />
      </span>
      {children}
    </div>
  );
}
