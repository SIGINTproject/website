import type { PrecacheEntry, RuntimeCaching, SerwistGlobalConfig } from "serwist";
import { CacheFirst, ExpirationPlugin, Serwist, StaleWhileRevalidate } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const runtimeCaching: RuntimeCaching[] = [
  {
    matcher: ({ request, sameOrigin }) => sameOrigin && request.destination === "document",
    handler: new StaleWhileRevalidate({ cacheName: "sigint-pages" }),
  },
  {
    matcher: ({ request, sameOrigin }) => sameOrigin && request.destination === "image",
    handler: new CacheFirst({
      cacheName: "sigint-images",
      plugins: [new ExpirationPlugin({ maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30, purgeOnQuotaError: true })],
    }),
  },
];

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: false,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching,
  fallbacks: {
    entries: [{ url: "/offline", matcher: ({ request }) => request.destination === "document" }],
  },
});

// Belt-and-suspenders: `fallbacks` above attaches a per-strategy plugin, but
// if a route's strategy still rejects (e.g. no runtime-caching route
// matched at all), fall back to the precached offline document directly
// rather than letting the navigation surface as a raw network error.
serwist.setCatchHandler(async ({ request }) => {
  if (request.destination === "document") {
    const offline = await serwist.matchPrecache("/offline");
    if (offline) return offline;
  }
  return Response.error();
});

serwist.addEventListeners();
