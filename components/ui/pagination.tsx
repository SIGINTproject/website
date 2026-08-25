import Link from "next/link";

export function Pagination({
  nextHref,
  end = false,
}: {
  nextHref?: string;
  end?: boolean;
}) {
  return (
    <div className="border-t border-line pt-6" data-testid="pagination">
      {nextHref ? (
        <Link
          data-testid="load-more-link"
          href={nextHref}
          className="inline-flex min-h-11 items-center border border-line px-5 py-2 text-sm font-semibold text-ink transition-colors hover:border-signal hover:text-signal"
        >
          もっと見る
          <span aria-hidden="true" className="ml-3 text-signal">↓</span>
        </Link>
      ) : (
        end && (
          <p data-testid="content-end" className="font-label text-xs tracking-[0.12em] text-muted">
            これで全部です。
          </p>
        )
      )}
    </div>
  );
}
