import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

const styles = {
  primary:
    "border-signal bg-signal text-signal-contrast hover:bg-[color-mix(in_srgb,var(--signal)_86%,var(--ink))]",
  secondary:
    "border-line bg-transparent text-ink hover:border-signal hover:text-signal",
  quiet: "border-transparent text-signal hover:border-line",
};

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-control border px-5 py-2 text-sm font-semibold leading-6 transition-colors disabled:cursor-not-allowed disabled:opacity-50";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof styles;
}) {
  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  ...props
}: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children: ReactNode;
  variant?: keyof typeof styles;
}) {
  return (
    <Link href={href} className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </Link>
  );
}
