import { defineConfig, devices } from "@playwright/test";

const PORT = 5201;

export default defineConfig({
  testDir: "./e2e",
  testMatch: "compat-smoke.spec.ts",
  fullyParallel: true,
  workers: 2,
  globalSetup: "./e2e/global-setup.ts",
  expect: { timeout: 15_000 },
  reporter: [["list"]],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    timezoneId: "UTC",
    locale: "en-US",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium-desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "chromium-android", use: { ...devices["Pixel 7"] } },
    { name: "firefox-desktop", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit-desktop", use: { ...devices["Desktop Safari"] } },
    { name: "webkit-iphone", use: { ...devices["iPhone 15"] } },
  ],
  webServer: {
    command: `node scripts/with-app-env.mjs vite dev --host 127.0.0.1 --port ${PORT} --strictPort`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      PATH: `${process.cwd()}/node_modules/.bin:${process.env.PATH ?? ""}`,
      VITE_AUTH_ENABLED: "true",
      DATABASE_URL: "",
      FIREBASE_CLIENT_EMAIL: "",
      FIREBASE_PRIVATE_KEY: "",
      GEMINI_API_KEY: "",
      BETTER_AUTH_SECRET: "",
    },
  },
});
