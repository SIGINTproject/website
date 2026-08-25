import Link from "next/link";
import type { ReactNode } from "react";

const tagClass =
  "inline-flex min-h-8 items-center gap-1 border px-3 py-1 text-xs font-medium leading-5 transition-colors";

export function Tag({ children }: { children: ReactNode }) {
  return <span className={`${tagClass} border-line text-muted`}>{children}</span>;
}

export function TagLink({
  href,
  children,
  selected = false,
}: {
  href: string;
  children: ReactNode;
  selected?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={selected ? "true" : undefined}
      className={`${tagClass} ${selected ? "border-signal bg-signal text-signal-contrast" : "border-line text-ink hover:border-signal hover:text-signal"}`}
    >
      {children}
    </Link>
  );
}
