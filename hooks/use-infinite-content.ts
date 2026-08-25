"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { ContentCollection, ContentPage, ContentSummary } from "@/lib/content";

const STORAGE_PREFIX = "sigint:list:";

type SavedListState = {
  page: number;
  scrollY: number;
};

function storageKey(collection: ContentCollection, tag: string | null) {
  return `${STORAGE_PREFIX}${collection}:${tag ?? "all"}`;
}

function readSavedState(collection: ContentCollection, tag: string | null) {
  try {
    const raw = sessionStorage.getItem(storageKey(collection, tag));
    return raw ? (JSON.parse(raw) as SavedListState) : null;
  } catch {
    return null;
  }
}

function currentUrlPage() {
  const value = new URLSearchParams(window.location.search).get("page");
  const parsed = value ? Number.parseInt(value, 10) : 1;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export function useInfiniteContent({
  collection,
  initialData,
}: {
  collection: ContentCollection;
  initialData: ContentPage;
}) {
  const [items, setItems] = useState<ContentSummary[]>(initialData.items);
  const [page, setPage] = useState(initialData.page);
  const [hasNextPage, setHasNextPage] = useState(initialData.hasNextPage);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const pageRef = useRef(initialData.page);
  const readyRef = useRef(false);

  const fetchPage = useCallback(
    async (nextPage: number, signal?: AbortSignal) => {
      const search = new URLSearchParams({ page: String(nextPage) });
      if (initialData.tag) search.set("tag", initialData.tag);
      const response = await fetch(
        `/api/content/${collection}?${search.toString()}`,
        { signal, headers: { Accept: "application/json" } },
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return (await response.json()) as ContentPage;
    },
    [collection, initialData.tag],
  );

  const updateUrl = useCallback(
    (nextPage: number) => {
      const url = new URL(window.location.href);
      if (nextPage > 1) url.searchParams.set("page", String(nextPage));
      else url.searchParams.delete("page");
      window.history.replaceState(window.history.state, "", url);
    },
    [],
  );

  const loadNext = useCallback(async () => {
    if (loadingRef.current || !hasNextPage) return;
    loadingRef.current = true;
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchPage(pageRef.current + 1);
      setItems((current) => {
        const known = new Set(current.map((item) => `${item.collection}/${item.slug}`));
        return [...current, ...result.items.filter((item) => !known.has(`${item.collection}/${item.slug}`))];
      });
      pageRef.current = result.page;
      setPage(result.page);
      setHasNextPage(result.hasNextPage);
      updateUrl(result.page);
    } catch (cause) {
      if (!(cause instanceof DOMException && cause.name === "AbortError")) {
        setError("追加の記事を読み込めませんでした。通信状況を確認してください。");
      }
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  }, [fetchPage, hasNextPage, updateUrl]);

  useEffect(() => {
    const controller = new AbortController();
    // Browser back/forward always reuses Next.js's client route cache to avoid
    // losing scroll position (this is independent of `staleTimes` and isn't
    // triggered by our `history.replaceState` URL updates below), so on back
    // navigation `initialData` here can reflect a stale page-1 render even
    // though the address bar already shows `?page=N`. Read the true current
    // page from the URL instead of trusting the prop.
    const urlPage = currentUrlPage();
    const saved = readSavedState(collection, initialData.tag);
    const shouldRestore = urlPage > 1 && saved !== null && saved.page >= urlPage;

    async function restore() {
      if (!shouldRestore || !saved) {
        pageRef.current = urlPage;
        setPage(urlPage);
        setIsReady(true);
        readyRef.current = true;
        return;
      }
      setIsLoading(true);
      try {
        const pages = await Promise.all(
          Array.from({ length: saved.page }, (_, index) => fetchPage(index + 1, controller.signal)),
        );
        const restored = pages.flatMap((result) => result.items);
        setItems(restored);
        const last = pages.at(-1)!;
        pageRef.current = last.page;
        setPage(last.page);
        setHasNextPage(last.hasNextPage);
        requestAnimationFrame(() => window.scrollTo({ top: saved.scrollY, behavior: "instant" }));
      } catch (cause) {
        if (!(cause instanceof DOMException && cause.name === "AbortError")) {
          setError("前回の表示位置を復元できませんでした。");
        }
      } finally {
        setIsLoading(false);
        setIsReady(true);
        readyRef.current = true;
      }
    }
    void restore();
    return () => controller.abort();
  }, [collection, fetchPage, initialData.tag]);

  useEffect(() => {
    const save = () => {
      // A mount that never finished its own restore (e.g. aborted by a
      // second effect pass under React Strict Mode, or by unmounting before
      // `restore()` settles) must not overwrite a previously saved deeper
      // session with its own unrestored page=1 state.
      if (!readyRef.current) return;
      const value: SavedListState = {
        page: pageRef.current,
        scrollY: window.scrollY,
      };
      sessionStorage.setItem(storageKey(collection, initialData.tag), JSON.stringify(value));
    };
    const saveOnActivation = (event: Event) => {
      if (event instanceof KeyboardEvent && event.key !== "Enter" && event.key !== " ") return;
      save();
    };
    // `pointerdown`/`keydown` fire before Next.js starts a client-side
    // transition to a clicked article (which resets scroll position as part
    // of navigating to the new route, before this effect's own unmount
    // cleanup would otherwise run), so they're the last reliable point to
    // capture "the scroll position the user was reading at" before leaving
    // the list. Calling `save()` unconditionally on unmount instead would
    // read `window.scrollY` after Next.js has already reset it to 0.
    window.addEventListener("pointerdown", saveOnActivation, { capture: true });
    window.addEventListener("keydown", saveOnActivation, { capture: true });
    window.addEventListener("pagehide", save);
    document.addEventListener("visibilitychange", save);
    return () => {
      window.removeEventListener("pointerdown", saveOnActivation, { capture: true });
      window.removeEventListener("keydown", saveOnActivation, { capture: true });
      window.removeEventListener("pagehide", save);
      document.removeEventListener("visibilitychange", save);
    };
  }, [collection, initialData.tag]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !isReady || !hasNextPage) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void loadNext();
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isReady, loadNext]);

  return { items, page, hasNextPage, isLoading, error, isReady, sentinelRef, loadNext };
}
