import { InfiniteContentList } from "@/app/_components/infinite-content-list";
import { EmptyState, TagLink } from "@/components/ui";
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
        <InfiniteContentList
          key={`${collection}:${tag ?? "all"}:${data.page}`}
          collection={collection}
          initialData={data}
        />
      )}
    </div>
  );
}
