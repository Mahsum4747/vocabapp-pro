import { globSync } from "node:fs";
import { spawnSync } from "node:child_process";
const files = [...globSync("src/**/*.test.ts")].sort();
if (!files.length) throw new Error("No TypeScript tests found");
const result = spawnSync(
  process.execPath,
  ["--import", "./scripts/test-register.mjs", "--test", ...files],
  { stdio: "inherit" },
);
if (result.error) throw result.error;
process.exit(result.status ?? 1);
