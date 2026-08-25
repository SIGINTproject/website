"use client";

import { useEffect, useState } from "react";
import { useSerwist } from "@serwist/next/react";

export function ServiceWorkerUpdate() {
  const { serwist } = useSerwist();
  const [hasUpdate, setHasUpdate] = useState(false);
  const [reloading, setReloading] = useState(false);

  useEffect(() => {
    if (!serwist) return;

    const onWaiting = (event: { isUpdate?: boolean }) => {
      if (event.isUpdate) setHasUpdate(true);
    };
    const onMessage = (event: { data?: unknown }) => {
      const data = event.data as { type?: string } | undefined;
      if (data?.type === "SW_UPDATE_AVAILABLE") setHasUpdate(true);
    };
    const onControlling = () => {
      if (reloading) window.location.reload();
    };

    serwist.addEventListener("waiting", onWaiting);
    serwist.addEventListener("message", onMessage);
    serwist.addEventListener("controlling", onControlling);
    return () => {
      serwist.removeEventListener("waiting", onWaiting);
      serwist.removeEventListener("message", onMessage);
      serwist.removeEventListener("controlling", onControlling);
    };
  }, [serwist, reloading]);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    // Serwist only relays "message" events whose `source` is a worker it
    // registered itself. Also listen natively so any postMessage carrying
    // this signal (including from tooling/tests) can surface the banner.
    const onNativeMessage = (event: MessageEvent) => {
      const data = event.data as { type?: string } | undefined;
      if (data?.type === "SW_UPDATE_AVAILABLE") setHasUpdate(true);
    };
    navigator.serviceWorker.addEventListener("message", onNativeMessage);
    return () => navigator.serviceWorker.removeEventListener("message", onNativeMessage);
  }, []);

  function reloadWithUpdate() {
    if (!serwist || reloading) return;
    setReloading(true);
    serwist.messageSkipWaiting();
  }

  if (!hasUpdate) return null;
  return (
    <aside
      role="status"
      data-testid="sw-update-banner"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-xl items-center justify-between gap-4 border border-line bg-surface p-4 shadow-lg"
    >
      <p className="text-sm">新しいバージョンがあります。</p>
      <button
        type="button"
        onClick={reloadWithUpdate}
        disabled={reloading}
        className="border border-line px-3 py-2 text-sm font-semibold text-ink transition-colors hover:border-signal hover:text-signal"
      >
        {reloading ? "更新中…" : "再読み込み"}
      </button>
    </aside>
  );
}
