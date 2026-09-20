import { chromium, type FullConfig } from "@playwright/test";

/**
 * Vite's dev server compiles routes and pre-bundles dependencies on first
 * request, which makes the first page loads slow enough to race the tests when
 * they start in parallel. Visiting each route once up front pays that cost
 * before any test runs. Nothing is asserted here, and no backend is reachable
 * (the dev server has no credentials), so the failed data calls are harmless.
 */
export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0].use.baseURL!;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const path of ["/", "/review", "/sets/warmup"]) {
    await page.goto(`${baseURL}${path}`, { waitUntil: "networkidle" }).catch(() => {});
  }
  await browser.close();
}
