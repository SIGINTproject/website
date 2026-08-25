import type { Metadata } from "next";

import { ContentDetail, getDetailEntry } from "@/app/_components/content-detail";
import { getAllSlugs } from "@/lib/content";

export function generateStaticParams() {
  return getAllSlugs("blog").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const entry = getDetailEntry("blog", slug);
  return {
    title: entry.frontmatter.title,
    description: entry.frontmatter.summary,
  };
}

export default async function BlogDetailPage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  return <ContentDetail collection="blog" slug={slug} />;
}
