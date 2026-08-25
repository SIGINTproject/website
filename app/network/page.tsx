import type { Metadata } from "next";
import { ContentRails, PageHeading } from "@/components/ui";

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
        自分たちで設計・運用予定です。
      </p>
      </PageHeading>
      <ContentRails className="max-w-reading mx-auto">

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="text-2xl">構成図</h2>
        <div className="mt-5 border border-dashed border-line bg-surface p-6 text-sm text-muted">
        未定
        </div>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="text-2xl">主な構成要素</h2>
        <ul className="mt-4 list-square space-y-2 pl-5 text-muted marker:text-signal">
          <li>未定</li>
        </ul>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="text-2xl">機材</h2>
        <p className="mt-4 border-l-2 border-signal pl-4 text-sm text-muted">
          未定
        </p>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="text-2xl">将来のAS運用・ピアリング方針</h2>
        <p className="mt-4 text-muted">
         未定
        </p>
        <p className="mt-5 border-l-2 border-signal pl-4 text-sm text-muted">
          未定
        </p>
      </section>
      </ContentRails>
    </div>
  );
}
