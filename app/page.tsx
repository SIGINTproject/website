import Link from "next/link";

import { getContentPage } from "@/lib/content";

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
      <section className="border-b border-zinc-200 px-4 py-20 sm:px-6 dark:border-zinc-800">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">
            ネットワーク研究会 SIGINT
          </h1>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            芝浦工業大学のネットワーク研究会です。未経験の1年生から実機を触りながら学び、
            部室ネットワークの設計・運用を自分たちの手で行っています。
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/join"
              className="rounded bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
            >
              入部案内を見る
            </Link>
            <Link
              href="/about"
              className="rounded border border-zinc-300 px-5 py-2.5 text-sm font-medium dark:border-zinc-700"
            >
              私たちについて
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-bold">活動の3本柱</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded border border-zinc-200 p-5 dark:border-zinc-800"
              >
                <h3 className="font-semibold">{pillar.title}</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-200 px-4 py-16 sm:px-6 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl grid gap-12 sm:grid-cols-2">
          <div>
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-bold">最新の活動記録</h2>
              <Link href="/activities" className="text-sm underline-offset-4 hover:underline">
                すべて見る
              </Link>
            </div>
            <ul className="mt-4 flex flex-col gap-4">
              {latestActivities.items.map((entry) => (
                <li key={entry.slug}>
                  <Link
                    href={`/activities/${entry.slug}`}
                    className="font-medium underline-offset-4 hover:underline"
                  >
                    {entry.frontmatter.title}
                  </Link>
                  <p className="text-xs text-zinc-500">{entry.frontmatter.date}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-bold">最新の技術ブログ</h2>
              <Link href="/blog" className="text-sm underline-offset-4 hover:underline">
                すべて見る
              </Link>
            </div>
            <ul className="mt-4 flex flex-col gap-4">
              {latestBlog.items.map((entry) => (
                <li key={entry.slug}>
                  <Link
                    href={`/blog/${entry.slug}`}
                    className="font-medium underline-offset-4 hover:underline"
                  >
                    {entry.frontmatter.title}
                  </Link>
                  <p className="text-xs text-zinc-500">{entry.frontmatter.date}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
