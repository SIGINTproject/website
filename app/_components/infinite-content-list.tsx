"use client";

import Link from "next/link";

import { useInfiniteContent } from "@/hooks/use-infinite-content";
import type { ContentCollection, ContentPage, ContentSummary } from "@/lib/content";

const COLLECTION_LABEL: Record<ContentCollection, string> = {
  activities: "活動記録",
  blog: "技術ブログ",
};

function ContentCard({ entry }: { entry: ContentSummary }) {
  return (
    <li data-testid="content-card" className="border-b border-zinc-200 pb-6 dark:border-zinc-800">
      <article>
        <p className="text-xs text-zinc-500">
          <time dateTime={entry.frontmatter.date}>{entry.frontmatter.date}</time>
          {" · "}{COLLECTION_LABEL[entry.collection]}{" · "}読了目安 {entry.readingTimeMinutes} 分
        </p>
        <h2 className="mt-1 text-lg font-semibold">
          <Link href={`/${entry.collection}/${entry.slug}`} className="underline-offset-4 hover:underline">
            {entry.frontmatter.title}
          </Link>
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{entry.frontmatter.summary}</p>
        {entry.frontmatter.tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-500">
            {entry.frontmatter.tags.map((tag) => <li key={tag} className="rounded border px-2 py-0.5">{tag}</li>)}
          </ul>
        )}
      </article>
    </li>
  );
}

function Skeletons() {
  return (
    <ul data-testid="content-loading" aria-label="記事を読み込み中" aria-live="polite" className="mt-6 flex flex-col gap-6">
      {Array.from({ length: 3 }, (_, index) => (
        <li key={index} aria-hidden="true" className="animate-pulse border-b border-zinc-200 pb-6 dark:border-zinc-800">
          <div className="h-3 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-3 h-5 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-3 h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
        </li>
      ))}
    </ul>
  );
}

export function InfiniteContentList({ collection, initialData }: { collection: ContentCollection; initialData: ContentPage }) {
  const { items, page, hasNextPage, isLoading, error, isReady, sentinelRef, loadNext } = useInfiniteContent({ collection, initialData });

  return (
    <>
      <ul data-testid="content-list" className="flex flex-col gap-6">
        {items.map((entry) => <ContentCard key={`${entry.collection}/${entry.slug}`} entry={entry} />)}
      </ul>
      {isLoading && <Skeletons />}
      {error && <p role="alert" data-testid="content-load-error" className="mt-4 text-sm text-red-700">{error}</p>}
      <div className="mt-8" data-testid="pagination">
        {hasNextPage ? (
          <>
            <Link
              data-testid="load-more-link"
              href={`/${collection}?${new URLSearchParams({ ...(initialData.tag ? { tag: initialData.tag } : {}), page: String(page + 1) })}`}
              onClick={isReady ? (event) => { event.preventDefault(); void loadNext(); } : undefined}
              className={isReady ? "sr-only" : "inline-block rounded border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700"}
            >
              もっと見る
            </Link>
            <div ref={sentinelRef} data-testid="infinite-scroll-sentinel" aria-hidden="true" className="h-px" />
          </>
        ) : initialData.totalItems > 0 ? (
          <p data-testid="content-end" className="text-sm text-zinc-500">これで全部です。</p>
        ) : null}
      </div>
    </>
  );
}
