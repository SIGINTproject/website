import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { getEntryBySlug, type ContentCollection } from "@/lib/content";
import { Breadcrumb, Tag, VlanTrunkLine } from "@/components/ui";

const COLLECTION_LABEL: Record<ContentCollection, string> = {
  activities: "活動記録",
  blog: "技術ブログ",
};

export function getDetailEntry(collection: ContentCollection, slug: string) {
  const entry = getEntryBySlug(collection, slug);
  if (!entry) notFound();
  return entry;
}

export function ContentDetail({
  collection,
  slug,
}: {
  collection: ContentCollection;
  slug: string;
}) {
  const entry = getDetailEntry(collection, slug);

  return (
    <article className="mx-auto w-full max-w-reading px-5 py-12 sm:px-8 lg:py-20">
      <Breadcrumb items={[{ label: COLLECTION_LABEL[collection], href: `/${collection}` }, { label: entry.frontmatter.title }]} />

      <header className="mt-8 border-b border-line pb-10">
        <p className="font-label text-xs tracking-wide text-muted">
          <time dateTime={entry.frontmatter.date}>
            {entry.frontmatter.date}
          </time>
          {" · "}
          {entry.frontmatter.author}
          {" · "}
          読了目安 {entry.readingTimeMinutes} 分
        </p>
        <h1 className="mt-4 text-title">{entry.frontmatter.title}</h1>
        {entry.frontmatter.tags.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {entry.frontmatter.tags.map((tag) => (
              <li key={tag}><Tag>{tag}</Tag></li>
            ))}
          </ul>
        )}
        <div className="mt-8"><VlanTrunkLine label="ARTICLE" /></div>
      </header>

      {/*
        TODO(design): this is unstyled MDX output. The design workstream
        owns typography (headings, lists, links) via styles/ or an MDX
        component map — do not add ad-hoc classes here.
      */}
      <div className="prose-sigint mt-10">
        <MDXRemote source={entry.source} />
      </div>
    </article>
  );
}
