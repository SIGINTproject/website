import Link from "next/link";

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
        <ul
          data-testid="tag-filter"
          className="flex flex-wrap gap-2 text-sm"
        >
          <li>
            <Link
              href={buildHref(collection, {})}
              aria-current={!tag ? "true" : undefined}
              className={`rounded-full border px-3 py-1 ${
                !tag
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                  : "border-zinc-300 dark:border-zinc-700"
              }`}
            >
              すべて
            </Link>
          </li>
          {allTags.map(({ tag: t, count }) => (
            <li key={t}>
              <Link
                href={buildHref(collection, { tag: t })}
                aria-current={tag === t ? "true" : undefined}
                className={`rounded-full border px-3 py-1 ${
                  tag === t
                    ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                    : "border-zinc-300 dark:border-zinc-700"
                }`}
              >
                {t}
                <span className="ml-1 text-xs opacity-70">{count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {items.length === 0 ? (
        <p data-testid="content-empty" className="text-zinc-500">
          {tag
            ? `「${tag}」に該当する記事はまだありません。`
            : "まだ記事がありません。"}
        </p>
      ) : (
        <ul data-testid="content-list" className="flex flex-col gap-6">
          {items.map((entry) => (
            <li
              key={entry.slug}
              data-testid="content-card"
              className="border-b border-zinc-200 pb-6 dark:border-zinc-800"
            >
              <article>
                <p className="text-xs text-zinc-500">
                  <time dateTime={entry.frontmatter.date}>
                    {entry.frontmatter.date}
                  </time>
                  {" · "}
                  {COLLECTION_LABEL[entry.collection]}
                  {" · "}
                  読了目安 {entry.readingTimeMinutes} 分
                </p>
                <h2 className="mt-1 text-lg font-semibold">
                  <Link
                    href={`/${entry.collection}/${entry.slug}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {entry.frontmatter.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {entry.frontmatter.summary}
                </p>
                {entry.frontmatter.tags.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-500">
                    {entry.frontmatter.tags.map((t) => (
                      <li key={t} className="rounded border px-2 py-0.5">
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8" data-testid="pagination">
        {hasNextPage ? (
          <Link
            data-testid="load-more-link"
            href={buildHref(collection, { tag, page: page + 1 })}
            className="inline-block rounded border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700"
          >
            もっと見る
          </Link>
        ) : (
          totalItems > 0 && (
            <p data-testid="content-end" className="text-sm text-zinc-500">
              これで全部です。
            </p>
          )
        )}
      </div>
    </div>
  );
}
