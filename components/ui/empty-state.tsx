import type { ReactNode } from "react";

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="border-y border-line py-12 text-center text-sm text-muted">
      <span aria-hidden="true" className="mx-auto mb-5 block h-px w-16 bg-signal" />
      <p>{children}</p>
    </div>
  );
}
