import { expect, test } from "@playwright/test";

async function waitForServiceWorker(page: import("@playwright/test").Page) {
  // Poll until the worker is fully `activated` *and* claims this page
  // (clientsClaim), not just registered — navigation interception and the
  // runtime cache only kick in once the page is actually controlled.
  await expect
    .poll(
      () =>
        page.evaluate(async () => {
          const registration = await navigator.serviceWorker.getRegistration();
          return {
            active: registration?.active?.state ?? null,
            controlled: Boolean(navigator.serviceWorker.controller),
          };
        }),
      { timeout: 15_000 },
    )
    .toMatchObject({ active: "activated", controlled: true });
  return page.evaluate(async () => (await navigator.serviceWorker.getRegistration())?.active?.state);
}

test("訪問済みページはオフラインで再表示される", async ({ page, context }) => {
  await page.goto("/about", { waitUntil: "networkidle" });
  await waitForServiceWorker(page);
  // The very first load happened before the worker controlled the page, so
  // it was never routed through the runtime cache. Reload once online so the
  // stale-while-revalidate strategy actually populates the cache entry.
  await page.reload({ waitUntil: "networkidle" });
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1, name: "私たちについて" })).toBeVisible();
});

test("未訪問ページはオフラインフォールバックを表示する", async ({ page, context }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await waitForServiceWorker(page);
  await context.setOffline(true);
  await page.goto(`/contact?uncached=${Date.now()}`).catch(() => undefined);
  // The service worker serves the precached /offline document as a
  // substitute response for the failed navigation — this doesn't change
  // the browser's address bar, it only swaps the rendered content.
  await expect(page.getByTestId("offline-page")).toBeVisible();
});

test("Service Worker が登録・activatedになり、更新通知が表示される", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const state = await waitForServiceWorker(page);
  expect(state).toBe("activated");

  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    await registration?.update();
    navigator.serviceWorker.dispatchEvent(
      new MessageEvent("message", { data: { type: "SW_UPDATE_AVAILABLE" } }),
    );
  });
  await expect(page.getByTestId("sw-update-banner")).toBeVisible();
});

test("manifest と必須アイコンを取得できる", async ({ page, request }) => {
  await page.goto("/");
  const manifestLink = page.locator('link[rel="manifest"]');
  await expect(manifestLink).toHaveCount(1);
  const manifestHref = await manifestLink.getAttribute("href");
  expect(manifestHref).toBeTruthy();

  const response = await request.get(manifestHref!);
  expect(response.ok()).toBeTruthy();
  const manifest = await response.json();
  expect(manifest).toMatchObject({
    name: expect.any(String),
    short_name: expect.any(String),
    start_url: expect.any(String),
    display: expect.any(String),
    icons: expect.any(Array),
  });
  expect(manifest.icons.length).toBeGreaterThan(0);
  for (const icon of manifest.icons) {
    expect(icon).toMatchObject({ src: expect.any(String), sizes: expect.any(String), type: expect.any(String) });
    // Icons may be inline `data:` URIs (no network request possible) or
    // fetchable paths; only verify the latter over HTTP.
    if (icon.src.startsWith("data:")) continue;
    expect((await request.get(icon.src)).ok()).toBeTruthy();
  }
});
