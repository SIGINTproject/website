import { expect, test } from "@playwright/test";

const majorPages = ["/", "/about", "/activities", "/blog", "/network", "/join", "/contact"];

for (const path of majorPages) {
  test(`${path} がエラーなく表示される`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    const response = await page.goto(path, { waitUntil: "networkidle" });

    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    expect(errors).toEqual([]);
  });
}
