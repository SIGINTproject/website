import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = ["/", "/about", "/activities", "/blog", "/network", "/join", "/contact"];

for (const path of pages) {
  test(`${path} に critical / serious のaxe違反がない`, async ({ page }) => {
    await page.goto(path, { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const violations = results.violations.filter(({ impact }) => impact === "critical" || impact === "serious");
    expect(violations).toEqual([]);
  });
}
