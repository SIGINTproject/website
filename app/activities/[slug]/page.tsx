import type { Metadata } from "next";

import { ContentDetail, getDetailEntry } from "@/app/_components/content-detail";
import { getAllSlugs } from "@/lib/content";

export function generateStaticParams() {
  return getAllSlugs("activities").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/activities/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const entry = getDetailEntry("activities", slug);
  return {
    title: entry.frontmatter.title,
    description: entry.frontmatter.summary,
  };
}

export default async function ActivityDetailPage({
  params,
}: PageProps<"/activities/[slug]">) {
  const { slug } = await params;
  return <ContentDetail collection="activities" slug={slug} />;
}
