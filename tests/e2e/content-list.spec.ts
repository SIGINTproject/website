import { expect, test } from "@playwright/test";

test("無限スクロールで追加読込し、末尾と重複なしを確認できる", async ({ page }) => {
  await page.goto("/activities");
  const cards = page.getByTestId("content-card");
  const initialCount = await cards.count();
  expect(initialCount).toBeGreaterThan(0);

  await page.getByTestId("load-more-link").scrollIntoViewIfNeeded();
  await expect.poll(() => cards.count()).toBeGreaterThan(initialCount);
  await expect(page.getByTestId("content-end")).toHaveText("これで全部です。");

  const hrefs = await cards.locator("h2 a").evaluateAll((links) =>
    links.map((link) => (link as HTMLAnchorElement).pathname),
  );
  expect(new Set(hrefs).size).toBe(hrefs.length);
});

test("タグ絞り込みをブラウザバックで復元する", async ({ page }) => {
  await page.goto("/activities");
  const tag = page.getByTestId("tag-filter").getByRole("link").nth(1);
  await tag.click();
  await expect(page).toHaveURL(/tag=/);

  const cards = page.getByTestId("content-card");
  const expectedCount = await cards.count();
  expect(expectedCount).toBeGreaterThan(0);

  await cards.first().getByRole("link").first().click();
  // Wait for the client-side push navigation to actually land before going
  // back, otherwise goBack() can race it and step past the tag-filtered entry.
  await expect(page).toHaveURL(/\/activities\//);
  await page.goBack({ waitUntil: "networkidle" });

  await expect(page).toHaveURL(/tag=/);
  await expect(page.getByTestId("tag-filter").locator('[aria-current="true"]')).toBeVisible();
  await expect(cards).toHaveCount(expectedCount);
});

test("読込件数・スクロール位置をブラウザバックで復元する", async ({ page }) => {
  await page.goto("/activities");
  const cards = page.getByTestId("content-card");

  // 追加読込を可能な限り行い、複数ページにわたる状態を作る（fixture件数に依存しない）。
  while ((await page.getByTestId("load-more-link").count()) > 0) {
    const previousCount = await cards.count();
    await page.getByTestId("load-more-link").scrollIntoViewIfNeeded();
    await expect.poll(() => cards.count()).toBeGreaterThan(previousCount);
  }

  const expectedCount = await cards.count();
  const lastCard = cards.nth(expectedCount - 1);
  await lastCard.scrollIntoViewIfNeeded();
  const expectedScrollY = await page.evaluate(() => window.scrollY);
  await lastCard.getByRole("link").first().click();
  // Wait for the client-side push navigation to actually land before going
  // back, otherwise goBack() can race it and step past the intended entry.
  await expect(page).toHaveURL(/\/activities\//);
  await page.goBack({ waitUntil: "networkidle" });

  await expect(cards).toHaveCount(expectedCount);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(expectedScrollY - 100);
});
