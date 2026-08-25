import type { Metadata } from "next";

import { ContentList } from "@/app/_components/content-list";
import { getAllTags, getContentPage } from "@/lib/content";

export const metadata: Metadata = {
  title: "活動記録",
  description:
    "SIGINT の活動記録一覧。部室ネットワークの構築・運用や学内イベント支援など、実際に手を動かした記録をまとめています。",
};

export default async function ActivitiesPage({
  searchParams,
}: PageProps<"/activities">) {
  const params = await searchParams;
  const tag = typeof params.tag === "string" ? params.tag : null;
  const page = Number.parseInt(
    typeof params.page === "string" ? params.page : "1",
    10,
  );

  const data = getContentPage({ collection: "activities", page, tag });
  const allTags = getAllTags("activities");

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold">活動記録</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        カリキュラム・部室ネットワークの運用・学内イベント支援など、SIGINT
        の日々の活動を記録しています。
      </p>
      <div className="mt-8">
        <ContentList collection="activities" data={data} allTags={allTags} />
      </div>
    </div>
  );
}
