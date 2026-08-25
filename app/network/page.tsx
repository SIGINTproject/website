import type { Metadata } from "next";
import Link from "next/link";
import { PageHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "部室ネットワーク",
  description:
    "SIGINT が設計・運用している部室ネットワークの構成、機材、将来のAS運用・ピアリング方針を紹介します。",
};

export default function NetworkPage() {
  return (
    <div className="mx-auto w-full max-w-site px-5 py-12 sm:px-8 lg:px-12 lg:py-20">
      <PageHeading eyebrow="04 / NETWORK" title="部室ネットワーク">
      <p>
        SIGINT では、学びの成果を実際に使うネットワークとして部室ネットワークを
        自分たちで設計・運用しています。
      </p>
      </PageHeading>
      <div className="max-w-reading lg:ml-auto">

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="text-2xl">構成図</h2>
        <div className="mt-5 border border-dashed border-line bg-surface p-6 text-sm text-muted">
          TODO(sigint): 部室ネットワークの構成図（マルチVLAN構成、VyOSルータ、
          デュアルWAN、監視系統など）をここに掲載する。
        </div>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="text-2xl">主な構成要素</h2>
        <ul className="mt-4 list-square space-y-2 pl-5 text-muted marker:text-signal">
          <li>マルチVLANによるセグメント分割</li>
          <li>VyOSによるルーティング・デュアルWAN構成</li>
          <li>SNMPによる機材の死活・トラフィック監視</li>
          <li>NetBoxによるIPAM・機材資産管理</li>
          <li>Asteriskによる部室内線</li>
        </ul>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="text-2xl">機材</h2>
        <p className="mt-4 border-l-2 border-signal pl-4 text-sm text-muted">
          TODO(sigint): 実際に部室で稼働している機材（型番・台数）の一覧を
          確認のうえ掲載する。
        </p>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="text-2xl">将来のAS運用・ピアリング方針</h2>
        <p className="mt-4 text-muted">
          将来的に自律システム（AS）を運用し、IXでのピアリングを行うことを
          見据えて検討を進めています。詳細は
          {" "}
          <Link
            className="text-signal underline underline-offset-4"
            href="/blog?tag=AS運用"
          >
            AS運用タグの記事
          </Link>
          で随時発信しています。
        </p>
        <p className="mt-5 border-l-2 border-signal pl-4 text-sm text-muted">
          TODO(sigint): AS番号・想定するアップストリーム／IXなど、確定した
          事実のみをここに追記する。未確定の間は本文に記載しない。
        </p>
      </section>
      </div>
    </div>
  );
}
