import type { Metadata } from "next";
import Link from "next/link";
import { ContentRails, PageHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "入部案内",
  description:
    "SIGINT への入部案内。未経験歓迎、活動日、見学方法、よくある質問をまとめています。",
};

const FAQ = [
  {
    q: "ネットワークの知識が全くありませんが大丈夫ですか？",
    a: "大丈夫です。ネットワークの知識だけでなくプログラミング等の知識も不問です。一緒に勉強しましょう！",
  },
  {
    q: "他学科・他学年でも入部できますか？",
    a: "はい。学科・学年を問わず参加できます。",
  },
  {
    q: "見学だけでも可能ですか？",
    a: "可能です。下記の見学方法からご連絡ください。",
  },
];

export default function JoinPage() {
  return (
    <div className="mx-auto w-full max-w-site px-5 py-12 sm:px-8 lg:px-12 lg:py-20">
      <PageHeading eyebrow="05 / JOIN" title="入部案内">
      <p>
        SIGINT はネットワーク未経験の方を歓迎しています。実機に触れながら
        基礎から学べる環境があります。
      </p>
      </PageHeading>
      <ContentRails className="max-w-reading mx-auto">

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="text-2xl">活動日</h2>
        <p className="mt-4 border-l-2 border-signal pl-4 text-sm text-muted">
          自由
        </p>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="text-2xl">見学方法</h2>
        <p className="mt-4 border-l-2 border-signal pl-4 text-sm text-muted">
          XのアカウントへのDM、または
          <Link href="/contact" className="text-signal underline underline-offset-4">
            お問い合わせ
          </Link>
          ページからご連絡ください。
        </p>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="text-2xl">よくある質問</h2>
        <dl className="mt-6 border-b border-line">
          {FAQ.map(({ q, a }) => (
            <div key={q} className="border-t border-line py-5">
              <dt className="font-semibold">Q. {q}</dt>
              <dd className="mt-2 pl-6 text-sm leading-7 text-muted">
                {a}
              </dd>
            </div>
          ))}
        </dl>
      </section>
      </ContentRails>
    </div>
  );
}
