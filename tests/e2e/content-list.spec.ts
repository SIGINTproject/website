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

test("タグ・読込件数・スクロール位置をブラウザバックで復元する", async ({ page }) => {
  await page.goto("/activities");
  const tag = page.getByTestId("tag-filter").getByRole("link").nth(1);
  await tag.click();
  await expect(page).toHaveURL(/tag=/);

  const cards = page.getByTestId("content-card");
  while ((await page.getByTestId("load-more-link").count()) > 0 && (await cards.count()) < 27) {
    const previousCount = await cards.count();
    await page.getByTestId("load-more-link").scrollIntoViewIfNeeded();
    await expect.poll(() => cards.count()).toBeGreaterThan(previousCount);
  }
  expect(await cards.count(), "状態復元の検証には3ページ分（27件）のfixtureが必要").toBeGreaterThanOrEqual(27);

  const expectedCount = await cards.count();
  await cards.nth(20).scrollIntoViewIfNeeded();
  const expectedScrollY = await page.evaluate(() => window.scrollY);
  await cards.nth(20).getByRole("link").first().click();
  await page.goBack({ waitUntil: "networkidle" });

  await expect(page.getByTestId("tag-filter").locator('[aria-current="true"]')).toBeVisible();
  await expect(cards).toHaveCount(expectedCount);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(expectedScrollY - 100);
});
