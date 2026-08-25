import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { getEntryBySlug, type ContentCollection } from "@/lib/content";

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
    <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-sm">
        <Link
          href={`/${collection}`}
          className="underline-offset-4 hover:underline"
        >
          &larr; {COLLECTION_LABEL[collection]}一覧へ戻る
        </Link>
      </p>

      <header className="mt-4">
        <p className="text-xs text-zinc-500">
          <time dateTime={entry.frontmatter.date}>
            {entry.frontmatter.date}
          </time>
          {" · "}
          {entry.frontmatter.author}
          {" · "}
          読了目安 {entry.readingTimeMinutes} 分
        </p>
        <h1 className="mt-2 text-3xl font-bold">{entry.frontmatter.title}</h1>
        {entry.frontmatter.tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-500">
            {entry.frontmatter.tags.map((tag) => (
              <li key={tag} className="rounded border px-2 py-0.5">
                {tag}
              </li>
            ))}
          </ul>
        )}
      </header>

      {/*
        TODO(design): this is unstyled MDX output. The design workstream
        owns typography (headings, lists, links) via styles/ or an MDX
        component map — do not add ad-hoc classes here.
      */}
      <div className="mt-8">
        <MDXRemote source={entry.source} />
      </div>
    </article>
  );
}
