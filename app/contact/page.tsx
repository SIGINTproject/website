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
          <p>
            お問い合わせフォームは作成中です。以下のX（DM）またはメールから
            お願いいたします。
          </p>
          <dl className="mt-4 space-y-2">
            <div className="flex gap-2">
              <dt className="font-semibold text-ink">X</dt>
              <dd>
                <a
                  href="https://x.com/sigint179"
                  className="text-signal underline underline-offset-4"
                  target="_blank"
                  rel="noreferrer"
                >
                  @sigint179
                </a>
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold text-ink">Mail</dt>
              <dd>
                <a
                  href="mailto:contact@sigint179.net"
                  className="text-signal underline underline-offset-4"
                >
                  contact@sigint179.net
                </a>
              </dd>
            </div>
          </dl>
        </section>
      </ContentRails>
    </div>
  );
}
