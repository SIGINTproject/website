import { expect, test } from "@playwright/test";

const viewports = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 1000 },
] as const;

const pages = ["home", "about", "activities", "blog", "network", "join", "contact"] as const;
const paths = ["/", "/about", "/activities", "/blog", "/network", "/join", "/contact"] as const;

for (const viewport of viewports) {
  for (let index = 0; index < paths.length; index += 1) {
    test(`${pages[index]} / ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
      await page.goto(paths[index], { waitUntil: "networkidle" });
      await expect(page).toHaveScreenshot(`${pages[index]}-${viewport.name}.png`, {
        fullPage: true,
      });
    });
  }
}
