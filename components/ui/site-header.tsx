"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const NAV_LINKS = [
  { href: "/about", label: "私たちについて" },
  { href: "/activities", label: "活動記録" },
  { href: "/blog", label: "技術ブログ" },
  { href: "/network", label: "部室ネットワーク" },
  { href: "/join", label: "入部案内" },
  { href: "/contact", label: "お問い合わせ" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    detailsRef.current?.removeAttribute("open");
  }, [pathname]);

  const links = NAV_LINKS.map((link) => {
    const current = pathname === link.href || pathname.startsWith(`${link.href}/`);
    return (
      <li key={link.href}>
        <Link
          href={link.href}
          aria-current={current ? "page" : undefined}
          className="block border-b border-transparent py-2 text-sm font-medium text-ink transition-colors hover:border-signal hover:text-signal aria-[current=page]:border-signal aria-[current=page]:text-signal"
        >
          {link.label}
        </Link>
      </li>
    );
  });

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex min-h-18 max-w-site items-center px-5 sm:px-8 lg:px-12">
        <Link href="/" className="group flex shrink-0 items-center gap-3" aria-label="SIGINT ホーム">
          <span aria-hidden="true" className="grid size-8 grid-cols-2 gap-1 border border-signal p-1">
            <span className="bg-signal" /><span className="border border-signal" />
            <span className="border border-signal" /><span className="bg-signal" />
          </span>
          <span className="font-label text-lg font-semibold tracking-[0.12em]">SIGINT</span>
        </Link>

        <nav aria-label="グローバルナビゲーション" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-6">{links}</ul>
        </nav>

        <details ref={detailsRef} className="group ml-auto lg:hidden">
          <summary className="flex min-h-11 cursor-pointer list-none items-center gap-3 px-2 text-sm font-semibold [&::-webkit-details-marker]:hidden">
            MENU
            <span aria-hidden="true" className="relative block h-3 w-5 border-y border-ink group-open:border-b-0 group-open:before:absolute group-open:before:left-0 group-open:before:top-1.5 group-open:before:h-px group-open:before:w-5 group-open:before:rotate-45 group-open:before:bg-ink" />
          </summary>
          <nav aria-label="モバイルナビゲーション" className="fixed inset-x-0 top-18 border-b border-line bg-paper px-5 py-5 shadow-lg sm:px-8">
            <ul className="divide-y divide-line">{links}</ul>
          </nav>
        </details>
      </div>
    </header>
  );
}
