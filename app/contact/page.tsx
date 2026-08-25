import type { Metadata } from "next";
import { ContentRails, PageHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "SIGINT へのお問い合わせ方法について。",
};

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-site px-5 py-12 sm:px-8 lg:px-12 lg:py-20">
      <PageHeading eyebrow="06 / CONTACT" title="お問い合わせ">
      <p>
        入部・見学・取材・技術的な連携についてのお問い合わせは、以下の方法で
        受け付けています。
      </p>
      </PageHeading>

      <ContentRails className="mt-12 max-w-reading mx-auto">
        <section className="border border-dashed border-line bg-surface p-6 text-sm text-muted">
          TODO(sigint): お問い合わせフォームは外部サービス（Google フォーム等）
          に委譲する方針。フォームのURL確定後、ここに埋め込みリンクを設置する。
          代替の連絡先（メールアドレス・SNSアカウント等）があれば併記する。
        </section>
      </ContentRails>
    </div>
  );
}
