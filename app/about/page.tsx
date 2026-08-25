import type { Metadata } from "next";
import Link from "next/link";
import { ContentRails, PageHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "私たちについて",
  description:
    "SIGINT のミッション、活動内容、年間スケジュール、部室設備について紹介します。",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-site px-5 py-12 sm:px-8 lg:px-12 lg:py-20">
      <PageHeading eyebrow="01 / ABOUT" title="私たちについて" />
      <ContentRails className="max-w-reading mx-auto">

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="text-2xl">ミッション</h2>
        <p className="mt-4 text-muted">
          ネットワーク未経験の学生でも実機に触れながら基礎から学べる環境をつくり、
          学んだ技術を部室ネットワークという実際の運用の場で活かすことを目指しています。
        </p>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="text-2xl">活動内容</h2>
        <ul className="mt-4 list-square space-y-2 pl-5 text-muted marker:text-signal">
          <li>実機を用いたネットワーク基礎カリキュラム（1年生向け）</li>
          <li>
            部室ネットワークの設計・運用（マルチVLAN、VyOSによるルーティング、
            デュアルWAN、SNMP監視、NetBoxによるIPAM・資産管理、Asteriskによる内線）
          </li>
          <li>学内イベントにおけるWiFi支援</li>
          <li>将来的なAS運用・ピアリングに向けた検討</li>
        </ul>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="text-2xl">年間スケジュール</h2>
        <p className="mt-4 border-l-2 border-signal pl-4 text-sm text-muted">
          TODO(sigint): 実際の年間スケジュール（新歓期・カリキュラムの時期・
          学園祭対応・成果発表など）を確認のうえ表形式でまとめる。
        </p>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="text-2xl">部室設備</h2>
        <p className="mt-4 border-l-2 border-signal pl-4 text-sm text-muted">
          TODO(sigint): 部室に常設している機材（スイッチ・ルータ・サーバ等）の
          一覧を確認のうえ掲載する。構成の詳細は
          <Link href="/network" className="text-signal underline underline-offset-4">
            部室ネットワーク紹介
          </Link>
          ページも参照。
        </p>
      </section>
      </ContentRails>
    </div>
  );
}
