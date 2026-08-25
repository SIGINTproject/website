import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { ServiceWorkerUpdate } from "@/lib/pwa/service-worker-update";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: "SIGINT",
  manifest: "/manifest.webmanifest",
  title: {
    default: "SIGINT | ネットワーク研究会",
    template: "%s | SIGINT",
  },
  description:
    "芝浦工業大学ネットワーク研究会 SIGINT の公式サイト。実機を用いたネットワーク学習、部室ネットワークの設計・運用、対外連携について発信しています。",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "SIGINT" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#18181b" };

const NAV_LINKS = [
  { href: "/about", label: "私たちについて" },
  { href: "/activities", label: "活動記録" },
  { href: "/blog", label: "技術ブログ" },
  { href: "/network", label: "部室ネットワーク" },
  { href: "/join", label: "入部案内" },
  { href: "/contact", label: "お問い合わせ" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ServiceWorkerUpdate />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-black focus:px-4 focus:py-2 focus:text-white"
        >
          本文へスキップ
        </a>

        {/*
          TODO(design): SiteHeader is a placeholder. The design workstream
          (components/ui/) owns the final header, incl. mobile drawer nav.
        */}
        <header className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <Link href="/" className="text-lg font-bold tracking-tight">
              SIGINT
            </Link>
            <nav aria-label="グローバルナビゲーション">
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>

        <main id="main-content" className="flex flex-1 flex-col">
          {children}
        </main>

        {/* TODO(design): SiteFooter is a placeholder. */}
        <footer className="border-t border-zinc-200 py-8 text-sm text-zinc-500 dark:border-zinc-800">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <p>
              &copy; {new Date().getFullYear()} ネットワーク研究会 SIGINT
              （芝浦工業大学）
            </p>
            <p className="mt-1">
              TODO(sigint): 顧問名・正式な団体所在地・連絡先はここに追記する。
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
