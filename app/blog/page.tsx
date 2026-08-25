import type { Metadata } from "next";

import { ContentList } from "@/app/_components/content-list";
import { getAllTags, getContentPage } from "@/lib/content";
import { PageHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "技術ブログ",
  description:
    "SIGINT の技術ブログ一覧。ネットワーク技術の解説や、活動を通じて得た知見を発信しています。",
};

export default async function BlogPage({
  searchParams,
}: PageProps<"/blog">) {
  const params = await searchParams;
  const tag = typeof params.tag === "string" ? params.tag : null;
  const page = Number.parseInt(
    typeof params.page === "string" ? params.page : "1",
    10,
  );

  const data = getContentPage({ collection: "blog", page, tag });
  const allTags = getAllTags("blog");

  return (
    <div className="mx-auto w-full max-w-site px-5 py-12 sm:px-8 lg:px-12 lg:py-20">
      <PageHeading eyebrow="03 / BLOG" title="技術ブログ">
      <p>
        ネットワーク技術の解説記事や、活動の中で得た知見をまとめています。
      </p>
      </PageHeading>
      <div className="mt-10 max-w-4xl lg:ml-auto lg:mt-14">
        <ContentList collection="blog" data={data} allTags={allTags} />
      </div>
    </div>
  );
}
