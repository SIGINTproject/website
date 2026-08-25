import type { Metadata } from "next";
import { BIZ_UDPGothic, IBM_Plex_Sans, IBM_Plex_Sans_Condensed } from "next/font/google";

import { SiteFooter, SiteHeader } from "@/components/ui";
import "./globals.css";

const bodyJapanese = BIZ_UDPGothic({
  variable: "--font-body-ja",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const bodyLatin = IBM_Plex_Sans({
  variable: "--font-body-latin",
  subsets: ["latin"],
  display: "swap",
});

const headingLatin = IBM_Plex_Sans_Condensed({
  variable: "--font-heading-latin",
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SIGINT | ネットワーク研究会",
    template: "%s | SIGINT",
  },
  description:
    "芝浦工業大学ネットワーク研究会 SIGINT の公式サイト。実機を用いたネットワーク学習、部室ネットワークの設計・運用、対外連携について発信しています。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${bodyJapanese.variable} ${bodyLatin.variable} ${headingLatin.variable} h-full antialiased`}
      style={{ "--font-heading-ja": "var(--font-body-ja)" } as React.CSSProperties}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-black focus:px-4 focus:py-2 focus:text-white"
        >
          本文へスキップ
        </a>

        <SiteHeader />

        <main id="main-content" className="flex flex-1 flex-col">
          {children}
        </main>

        <SiteFooter />
      </body>
    </html>
  );
}
