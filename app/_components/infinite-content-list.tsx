"use client";

import Link from "next/link";

import { useInfiniteContent } from "@/hooks/use-infinite-content";
import type { ContentCollection, ContentPage, ContentSummary } from "@/lib/content";
import { Skeleton, Tag } from "@/components/ui";

const COLLECTION_LABEL: Record<ContentCollection, string> = {
  activities: "活動記録",
  blog: "技術ブログ",
};

function ContentCard({ entry }: { entry: ContentSummary }) {
  return (
    <li
      data-testid="content-card"
      className="group border-t border-line py-7 sm:grid sm:grid-cols-[9rem_1fr] sm:gap-6"
    >
      <article className="contents">
        <p className="font-label text-xs leading-6 text-muted">
          <time dateTime={entry.frontmatter.date}>{entry.frontmatter.date}</time>
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
          <p className="mt-2 text-sm leading-7 text-muted">{entry.frontmatter.summary}</p>
          {entry.frontmatter.tags.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {entry.frontmatter.tags.map((t) => (
                <li key={t}>
                  <Tag>{t}</Tag>
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>
    </li>
  );
}

function Skeletons() {
  return (
    <ul
      data-testid="content-loading"
      aria-label="記事を読み込み中"
      aria-live="polite"
    >
      {Array.from({ length: 3 }, (_, index) => (
        <li key={index} aria-hidden="true" className="border-t border-line py-7">
          <Skeleton lines={3} />
        </li>
      ))}
    </ul>
  );
}

export function InfiniteContentList({
  collection,
  initialData,
}: {
  collection: ContentCollection;
  initialData: ContentPage;
}) {
  const { items, page, hasNextPage, isLoading, error, isReady, sentinelRef, loadNext } =
    useInfiniteContent({ collection, initialData });

  return (
    <>
      <ul data-testid="content-list" className="border-b border-line">
        {items.map((entry) => (
          <ContentCard key={`${entry.collection}/${entry.slug}`} entry={entry} />
        ))}
      </ul>
      {isLoading && <Skeletons />}
      {error && (
        <p role="alert" data-testid="content-load-error" className="mt-4 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="border-t border-line pt-6" data-testid="pagination">
        {hasNextPage ? (
          <>
            <Link
              data-testid="load-more-link"
              href={`/${collection}?${new URLSearchParams({
                ...(initialData.tag ? { tag: initialData.tag } : {}),
                page: String(page + 1),
              })}`}
              onClick={
                isReady
                  ? (event) => {
                      event.preventDefault();
                      void loadNext();
                    }
                  : undefined
              }
              className={
                isReady
                  ? "sr-only"
                  : "inline-flex min-h-11 items-center border border-line px-5 py-2 text-sm font-semibold text-ink transition-colors hover:border-signal hover:text-signal"
              }
            >
              もっと見る
              <span aria-hidden="true" className="ml-3 text-signal">
                ↓
              </span>
            </Link>
            <div
              ref={sentinelRef}
              data-testid="infinite-scroll-sentinel"
              aria-hidden="true"
              className="h-px"
            />
          </>
        ) : (
          initialData.totalItems > 0 && (
            <p data-testid="content-end" className="font-label text-xs tracking-[0.12em] text-muted">
              これで全部です。
            </p>
          )
        )}
      </div>
    </>
  );
}
