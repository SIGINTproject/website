import Link from "next/link";

import { InfiniteContentList } from "@/app/_components/infinite-content-list";
import type { ContentCollection, ContentPage } from "@/lib/content";

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
  const { items, tag } = data;

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
      ) : <InfiniteContentList key={`${collection}:${tag ?? "all"}:${data.page}`} collection={collection} initialData={data} />}
    </div>
  );
}
