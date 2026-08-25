import type { Metadata } from "next";
import { ContentRails, PageHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "私たちについて",
  description:
    "SIGINT のミッション、活動内容、年間スケジュールについて",
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
          学んだ技術をもとに実際のネットワークで検証、運用することを目指しています。
        </p>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="text-2xl">活動内容</h2>
        <ul className="mt-4 list-square space-y-2 pl-5 text-muted marker:text-signal">
          <li>ネットワーク勉強会</li>
          <li>実機を用いたネットワーク実験</li>
          <li>部室ネットワークの設計・運用</li>
          <li>サーバ構築</li>
          <li>(予定)学内イベントにおけるWiFi支援</li>
          <li>将来的なAS運用・ピアリングに向けた検討</li>
          <li>etc...</li>
        </ul>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="text-2xl">年間スケジュール</h2>
        <p className="mt-4 border-l-2 border-signal pl-4 text-sm text-muted">
         未定
        </p>
      </section>
      </ContentRails>
    </div>
  );
}
