"use client";

import { useEffect, useState } from "react";

export function ServiceWorkerUpdate() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [reloading, setReloading] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    let active = true;

    const showWaitingWorker = (candidate: ServiceWorkerRegistration) => {
      if (active && candidate.waiting && navigator.serviceWorker.controller) setRegistration(candidate);
    };

    navigator.serviceWorker.ready.then((ready) => {
      if (!active) return;
      showWaitingWorker(ready);
      ready.addEventListener("updatefound", () => {
        const installing = ready.installing;
        installing?.addEventListener("statechange", () => {
          if (installing.state === "installed") showWaitingWorker(ready);
        });
      });
    });

    return () => { active = false; };
  }, []);

  function reloadWithUpdate() {
    const waiting = registration?.waiting;
    if (!waiting || reloading) return;
    setReloading(true);
    let reloaded = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (reloaded) return;
      reloaded = true;
      window.location.reload();
    });
    waiting.postMessage({ type: "SKIP_WAITING" });
  }

  if (!registration) return null;
  return (
    <aside
      role="status"
      data-testid="pwa-update-notice"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-xl items-center justify-between gap-4 rounded border border-zinc-300 bg-white p-4 shadow-lg dark:border-zinc-700 dark:bg-zinc-950"
    >
      <p className="text-sm">新しいバージョンがあります。</p>
      <button type="button" onClick={reloadWithUpdate} disabled={reloading} className="rounded border px-3 py-2 text-sm">
        {reloading ? "更新中…" : "再読み込み"}
      </button>
    </aside>
  );
}
