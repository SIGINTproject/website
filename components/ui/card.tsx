import type { HTMLAttributes, ReactNode } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <article
      className={`border-t border-line bg-surface px-5 py-6 sm:px-6 ${className}`}
      {...props}
    />
  );
}

export function CardLabel({ children }: { children: ReactNode }) {
  return (
    <p className="font-label text-xs font-semibold uppercase tracking-[0.14em] text-muted">
      {children}
    </p>
  );
}
