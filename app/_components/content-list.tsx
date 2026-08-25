import Link from "next/link";

import { EmptyState, Pagination, Tag, TagLink } from "@/components/ui";
import type { ContentCollection, ContentPage } from "@/lib/content";

const COLLECTION_LABEL: Record<ContentCollection, string> = {
  activities: "活動記録",
  blog: "技術ブログ",
};

function buildHref(
  collection: ContentCollection,
  params: { tag?: string | null; page?: number },
) {
  const search = new URLSearchParams();
  if (params.tag) search.set("tag", params.tag);
  if (params.page && params.page > 1) search.set("page", String(params.page));
  const query = search.toString();
  return `/${collection}${query ? `?${query}` : ""}`;
}

/**
 * Server-rendered list: works with JS disabled via the "もっと見る" link to
 * `?page=n+1`. The PWA workstream progressively enhances this with an
 * IntersectionObserver-driven client component that fetches additional
 * pages from `/api/content/[collection]` (see lib/content/index.ts).
 */
export function ContentList({
  collection,
  data,
  allTags,
}: {
  collection: ContentCollection;
  data: ContentPage;
  allTags: { tag: string; count: number }[];
}) {
  const { items, page, hasNextPage, tag, totalItems } = data;

  return (
    <div>
      <nav aria-label="タグで絞り込み" className="mb-6">
        <ul data-testid="tag-filter" className="flex flex-wrap gap-2">
          <li>
            <TagLink href={buildHref(collection, {})} selected={!tag}>
              すべて
            </TagLink>
          </li>
          {allTags.map(({ tag: t, count }) => (
            <li key={t}>
              <TagLink href={buildHref(collection, { tag: t })} selected={tag === t}>
                {t}
                <span className="ml-1 text-xs opacity-70">{count}</span>
              </TagLink>
            </li>
          ))}
        </ul>
      </nav>

      {items.length === 0 ? (
        <div data-testid="content-empty">
          <EmptyState>
            {tag ? `「${tag}」に該当する記事はまだありません。` : "まだ記事がありません。"}
          </EmptyState>
        </div>
      ) : (
        <ul data-testid="content-list" className="border-b border-line">
          {items.map((entry) => (
            <li
              key={entry.slug}
              data-testid="content-card"
              className="group border-t border-line py-7 sm:grid sm:grid-cols-[9rem_1fr] sm:gap-6"
            >
              <article className="contents">
                <p className="font-label text-xs leading-6 text-muted">
                  <time dateTime={entry.frontmatter.date}>
                    {entry.frontmatter.date}
                  </time>
                  {" · "}
                  {COLLECTION_LABEL[entry.collection]}
                  {" · "}
                  読了目安 {entry.readingTimeMinutes} 分
                </p>
                <div>
                <h2 className="text-lg font-semibold sm:text-xl">
                  <Link
                    href={`/${entry.collection}/${entry.slug}`}
                    className="transition-colors group-hover:text-signal"
                  >
                    {entry.frontmatter.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm leading-7 text-muted">
                  {entry.frontmatter.summary}
                </p>
                {entry.frontmatter.tags.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {entry.frontmatter.tags.map((t) => (
                      <li key={t}><Tag>{t}</Tag></li>
                    ))}
                  </ul>
                )}
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8">
        <Pagination
          nextHref={hasNextPage ? buildHref(collection, { tag, page: page + 1 }) : undefined}
          end={!hasNextPage && totalItems > 0}
        />
      </div>
    </div>
  );
}
