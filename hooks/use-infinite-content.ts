"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { ContentCollection, ContentPage, ContentSummary } from "@/lib/content";

const STORAGE_PREFIX = "sigint:list:";

type SavedListState = {
  entryId: string;
  page: number;
  scrollY: number;
};

function entryIdFor(collection: ContentCollection, tag: string | null) {
  return `${collection}:${tag ?? "all"}`;
}

function storageKey(collection: ContentCollection, tag: string | null) {
  return `${STORAGE_PREFIX}${entryIdFor(collection, tag)}`;
}

function readSavedState(collection: ContentCollection, tag: string | null) {
  try {
    const raw = sessionStorage.getItem(storageKey(collection, tag));
    return raw ? (JSON.parse(raw) as SavedListState) : null;
  } catch {
    return null;
  }
}

function createEntryId() {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
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
  const entryIdRef = useRef("");
  const pageRef = useRef(initialData.page);

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
    const historyState = (window.history.state ?? {}) as Record<string, unknown>;
    const stateKey = `sigintListEntry:${entryIdFor(collection, initialData.tag)}`;
    const existingId = typeof historyState[stateKey] === "string" ? historyState[stateKey] : null;
    const entryId = existingId ?? createEntryId();
    entryIdRef.current = entryId;
    if (!existingId) {
      window.history.replaceState({ ...historyState, [stateKey]: entryId }, "");
    }

    const saved = readSavedState(collection, initialData.tag);
    const shouldRestore = saved?.entryId === entryId && saved.page > 1;

    async function restore() {
      if (!shouldRestore || !saved) {
        setIsReady(true);
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
      }
    }
    void restore();
    return () => controller.abort();
  }, [collection, fetchPage, initialData.page, initialData.tag]);

  useEffect(() => {
    const save = () => {
      if (!entryIdRef.current) return;
      const value: SavedListState = {
        entryId: entryIdRef.current,
        page: pageRef.current,
        scrollY: window.scrollY,
      };
      sessionStorage.setItem(storageKey(collection, initialData.tag), JSON.stringify(value));
    };
    window.addEventListener("pagehide", save);
    document.addEventListener("visibilitychange", save);
    return () => {
      save();
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
