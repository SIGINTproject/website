import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "SIGINT へのお問い合わせ方法について。",
};

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold">お問い合わせ</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        入部・見学・取材・技術的な連携についてのお問い合わせは、以下の方法で
        受け付けています。
      </p>

      <section className="mt-8 rounded border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700">
        TODO(sigint): お問い合わせフォームは外部サービス（Google フォーム等）
        に委譲する方針。フォームのURL確定後、ここに埋め込みリンクを設置する。
        代替の連絡先（メールアドレス・SNSアカウント等）があれば併記する。
      </section>
    </div>
  );
}
