import Link from "next/link";

import { getContentPage } from "@/lib/content";
import { ButtonLink, Card, CardLabel } from "@/components/ui";

const PILLARS = [
  {
    title: "実機で学ぶネットワーク基礎",
    body: "座学だけでなく、実際のスイッチ・ルータに触れながらネットワークの基礎を学ぶカリキュラムを1年生向けに実施しています。",
  },
  {
    title: "部室ネットワークの設計・運用",
    body: "マルチVLAN、VyOSによるルーティング、デュアルWAN、SNMP監視、NetBoxによるIPAM・資産管理、Asteriskによる内線など、実運用のネットワークを自分たちで設計・運用しています。",
  },
  {
    title: "対外連携・将来のAS運用",
    body: "学内イベントのWiFi支援や、他大学・社会人との技術的な交流に加え、将来的なAS運用・ピアリングも見据えて活動しています。",
  },
];

export default async function HomePage() {
  const latestActivities = getContentPage({
    collection: "activities",
    page: 1,
    pageSize: 3,
  });
  const latestBlog = getContentPage({ collection: "blog", page: 1, pageSize: 3 });

  return (
    <div>
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-site lg:grid-cols-[18rem_1fr]">
          <div className="border-b border-line px-5 py-8 sm:px-8 lg:border-b-0 lg:border-r lg:px-12 lg:py-24">
            <p className="font-label text-xs font-semibold tracking-[0.16em] text-signal">01 / OVERVIEW</p>
          </div>
          <div className="px-5 py-14 sm:px-8 sm:py-20 lg:px-16 lg:py-24">
          <p className="font-label text-xs font-semibold uppercase tracking-[0.16em] text-muted">Network Study Group</p>
          <h1 className="mt-5 max-w-4xl text-display">ネットワークを、<br />自分たちの手で。</h1>
          <p className="mt-8 max-w-reading text-base leading-8 text-muted sm:text-lg">
            芝浦工業大学のネットワーク研究会です。未経験の1年生から実機を触りながら学び、
            部室ネットワークの設計・運用を自分たちの手で行っています。
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/join">入部案内を見る <span aria-hidden="true">→</span></ButtonLink>
            <ButtonLink href="/about" variant="secondary">私たちについて</ButtonLink>
          </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto grid max-w-site lg:grid-cols-[18rem_1fr]">
          <div className="border-b border-line px-5 py-8 sm:px-8 lg:border-b-0 lg:border-r lg:px-12 lg:py-20">
            <p className="font-label text-xs font-semibold tracking-[0.16em] text-signal">02 / ACTIVITY</p>
            <h2 className="mt-4 text-2xl">活動の3本柱</h2>
          </div>
          <div className="grid sm:grid-cols-3 lg:px-8 lg:py-12">
            {PILLARS.map((pillar, index) => (
              <Card
                key={pillar.title}
                className="sm:border-l sm:border-t-0 sm:first:border-l-0 lg:min-h-72"
              >
                <CardLabel>0{index + 1} / ACCESS</CardLabel>
                <h3 className="mt-5 text-lg">{pillar.title}</h3>
                <p className="mt-4 text-sm leading-7 text-muted">
                  {pillar.body}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-site gap-16 lg:grid-cols-2">
          <div>
            <div className="flex items-baseline justify-between">
              <h2 className="text-2xl">最新の活動記録</h2>
              <Link href="/activities" className="text-sm text-signal underline-offset-4 hover:underline">
                すべて見る
              </Link>
            </div>
            <ul className="mt-6 border-b border-line">
              {latestActivities.items.map((entry) => (
                <li key={entry.slug} className="border-t border-line py-5">
                  <Link
                    href={`/activities/${entry.slug}`}
                    className="font-semibold transition-colors hover:text-signal"
                  >
                    {entry.frontmatter.title}
                  </Link>
                  <p className="mt-1 font-label text-xs text-muted">{entry.frontmatter.date}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <h2 className="text-2xl">最新の技術ブログ</h2>
              <Link href="/blog" className="text-sm text-signal underline-offset-4 hover:underline">
                すべて見る
              </Link>
            </div>
            <ul className="mt-6 border-b border-line">
              {latestBlog.items.map((entry) => (
                <li key={entry.slug} className="border-t border-line py-5">
                  <Link
                    href={`/blog/${entry.slug}`}
                    className="font-semibold transition-colors hover:text-signal"
                  >
                    {entry.frontmatter.title}
                  </Link>
                  <p className="mt-1 font-label text-xs text-muted">{entry.frontmatter.date}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
