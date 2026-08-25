import { expect, test } from "@playwright/test";

test("訪問済みページはオフラインで再表示される", async ({ page, context }) => {
  await page.goto("/about", { waitUntil: "networkidle" });
  await expect.poll(() => page.evaluate(() => navigator.serviceWorker?.ready.then(() => true))).toBe(true);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1, name: "私たちについて" })).toBeVisible();
});

test("未訪問ページはオフラインフォールバックを表示する", async ({ page, context }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await expect.poll(() => page.evaluate(() => navigator.serviceWorker?.ready.then(() => true))).toBe(true);
  await context.setOffline(true);
  await page.goto(`/contact?uncached=${Date.now()}`).catch(() => undefined);
  await expect(page).toHaveURL(/\/offline/);
  await expect(page.locator("h1")).toBeVisible();
});

test("Service Worker が登録・activatedになり、更新通知が表示される", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const state = await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    return registration.active?.state;
  });
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
  const manifestHref = await page.locator('link[rel="manifest"]').getAttribute("href");
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
    expect((await request.get(icon.src)).ok()).toBeTruthy();
  }
});
