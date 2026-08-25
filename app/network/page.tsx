import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "部室ネットワーク",
  description:
    "SIGINT が設計・運用している部室ネットワークの構成、機材、将来のAS運用・ピアリング方針を紹介します。",
};

export default function NetworkPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold">部室ネットワーク</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        SIGINT では、学びの成果を実際に使うネットワークとして部室ネットワークを
        自分たちで設計・運用しています。
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">構成図</h2>
        <div className="mt-2 rounded border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700">
          TODO(sigint): 部室ネットワークの構成図（マルチVLAN構成、VyOSルータ、
          デュアルWAN、監視系統など）をここに掲載する。
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">主な構成要素</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-600 dark:text-zinc-400">
          <li>マルチVLANによるセグメント分割</li>
          <li>VyOSによるルーティング・デュアルWAN構成</li>
          <li>SNMPによる機材の死活・トラフィック監視</li>
          <li>NetBoxによるIPAM・機材資産管理</li>
          <li>Asteriskによる部室内線</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">機材</h2>
        <p className="mt-2 text-sm text-zinc-500">
          TODO(sigint): 実際に部室で稼働している機材（型番・台数）の一覧を
          確認のうえ掲載する。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">将来のAS運用・ピアリング方針</h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          将来的に自律システム（AS）を運用し、IXでのピアリングを行うことを
          見据えて検討を進めています。詳細は
          {" "}
          <Link
            className="underline-offset-4 hover:underline"
            href="/blog?tag=AS運用"
          >
            AS運用タグの記事
          </Link>
          で随時発信しています。
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          TODO(sigint): AS番号・想定するアップストリーム／IXなど、確定した
          事実のみをここに追記する。未確定の間は本文に記載しない。
        </p>
      </section>
    </div>
  );
}
