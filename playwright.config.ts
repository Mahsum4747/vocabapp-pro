import { defineConfig, devices } from "@playwright/test";

const PORT = 5199;

/**
 * Browser tests never talk to a real backend. Every server function and the
 * auth session are mocked per test (see e2e/support). As a second, independent
 * seal, the dev server itself starts with the database and Firebase
 * credentials blanked: even a request that slipped past a mock would fail
 * instead of reaching real user data.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  // The dev server compiles modules on demand; more browsers than this and it
  // saturates, so pages hydrate too slowly and tests time out for no real reason.
  workers: 2,
  globalSetup: "./e2e/global-setup.ts",
  expect: { timeout: 15_000 },
  reporter: [["list"]],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    // A fixed zone so "today" means the same day on every machine.
    timezoneId: "UTC",
    locale: "en-US",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `node scripts/with-app-env.mjs vite dev --host 127.0.0.1 --port ${PORT} --strictPort`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      PATH: `${process.cwd()}/node_modules/.bin:${process.env.PATH ?? ""}`,
      // Auth stays ON so the real sign-in gate runs; the session is mocked.
      VITE_AUTH_ENABLED: "true",
      DATABASE_URL: "",
      FIREBASE_CLIENT_EMAIL: "",
      FIREBASE_PRIVATE_KEY: "",
      GEMINI_API_KEY: "",
      BETTER_AUTH_SECRET: "",
    },
  },
});
