import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "私たちについて",
  description:
    "SIGINT のミッション、活動内容、年間スケジュール、部室設備について紹介します。",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold">私たちについて</h1>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">ミッション</h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          ネットワーク未経験の学生でも実機に触れながら基礎から学べる環境をつくり、
          学んだ技術を部室ネットワークという実際の運用の場で活かすことを目指しています。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">活動内容</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-600 dark:text-zinc-400">
          <li>実機を用いたネットワーク基礎カリキュラム（1年生向け）</li>
          <li>
            部室ネットワークの設計・運用（マルチVLAN、VyOSによるルーティング、
            デュアルWAN、SNMP監視、NetBoxによるIPAM・資産管理、Asteriskによる内線）
          </li>
          <li>学内イベントにおけるWiFi支援</li>
          <li>将来的なAS運用・ピアリングに向けた検討</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">年間スケジュール</h2>
        <p className="mt-2 text-sm text-zinc-500">
          TODO(sigint): 実際の年間スケジュール（新歓期・カリキュラムの時期・
          学園祭対応・成果発表など）を確認のうえ表形式でまとめる。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">部室設備</h2>
        <p className="mt-2 text-sm text-zinc-500">
          TODO(sigint): 部室に常設している機材（スイッチ・ルータ・サーバ等）の
          一覧を確認のうえ掲載する。構成の詳細は
          <Link href="/network" className="underline-offset-4 hover:underline">
            部室ネットワーク紹介
          </Link>
          ページも参照。
        </p>
      </section>
    </div>
  );
}
