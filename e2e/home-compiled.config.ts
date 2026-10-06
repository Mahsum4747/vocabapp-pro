import { readFileSync, readdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { defineConfig } from "@playwright/test";
import base from "../playwright.config";

// Read the compiler's registry, never guess hashes or allow an unmocked request.
// This variable exists only in the test runner/workers, not production config.
const compiledDirectory = ".vercel/output/functions/__server.func/_ssr";
const registry = readdirSync(compiledDirectory)
  .filter((name) => name.endsWith(".mjs"))
  .map((name) => readFileSync(`${compiledDirectory}/${name}`, "utf8"))
  .join("\n");
const names = Object.fromEntries(
  Array.from(
    registry.matchAll(/"([a-f0-9]{64})": \{\s*functionName: "([^"]+)"/g),
    ([, id, name]) => [id, name.replace(/_createServerFn_handler$/, "")],
  ),
);
if (!Object.values(names).includes("getLearningSignals"))
  throw new Error("Compile the app before running compiled Home tests");
process.env.KARTA_E2E_SERVER_FN_NAMES = JSON.stringify(names);
export default defineConfig({
  ...base,
  testDir: ".",
  globalSetup: undefined, // Compiled assets have no dev-server warmup cost.
  use: { ...base.use, baseURL: "http://127.0.0.1:5200" },
  webServer: {
    ...base.webServer,
    command: "npm run preview -- --host 127.0.0.1 --port 5200 --strictPort",
    url: "http://127.0.0.1:5200",
    env: {
      ...base.webServer.env,
      NODE_OPTIONS: `--import=${pathToFileURL(resolve("e2e/support/compiled-db-seal.mjs")).href}`,
    },
  },
});
