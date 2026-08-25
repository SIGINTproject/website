import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-site px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
          <div>
            <Link href="/" className="font-label text-xl font-semibold tracking-[0.12em]">SIGINT</Link>
            <p className="mt-2 text-sm text-muted">芝浦工業大学 ネットワーク研究会</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            <nav aria-label="フッターナビゲーション">
              <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <li><Link className="hover:text-signal" href="/about">私たちについて</Link></li>
                <li><Link className="hover:text-signal" href="/activities">活動記録</Link></li>
                <li><Link className="hover:text-signal" href="/blog">技術ブログ</Link></li>
                <li><Link className="hover:text-signal" href="/network">ネットワーク</Link></li>
                <li><Link className="hover:text-signal" href="/join">入部案内</Link></li>
                <li><Link className="hover:text-signal" href="/contact">お問い合わせ</Link></li>
              </ul>
            </nav>
            <p className="text-xs leading-6 text-muted">X : SIGINT@sigint179</p>
          </div>
        </div>
        <p className="mt-10 border-t border-line pt-5 font-label text-xs tracking-wide text-muted">
          &copy; {new Date().getFullYear()} NETWORK STUDY GROUP SIGINT
        </p>
      </div>
    </footer>
  );
}
