import type { ReactNode } from "react";
import { VlanTrunkLine } from "./vlan-trunk-line";

export function PageHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-line pb-10 sm:pb-12">
      <p className="font-label text-xs font-semibold uppercase tracking-[0.16em] text-signal">{eyebrow}</p>
      <h1 className="mt-4 text-title">{title}</h1>
      {children && <div className="mt-5 max-w-reading text-base text-muted sm:text-lg">{children}</div>}
      <div className="mt-8 max-w-xl"><VlanTrunkLine label="ACCESS" /></div>
    </header>
  );
}
