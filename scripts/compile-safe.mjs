import { spawnSync } from "node:child_process";
// Vite compilation only. No migration, no production credentials, no deployment.
const env = { ...process.env };
for (const key of [
  "DATABASE_URL",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
  "GEMINI_API_KEY",
  "BETTER_AUTH_SECRET",
  "XAI_API_KEY",
])
  env[key] = "";
const result = spawnSync(process.execPath, ["scripts/with-app-env.mjs", "vite", "build"], {
  stdio: "inherit",
  env: { ...env, PATH: `${process.cwd()}/node_modules/.bin:${env.PATH ?? ""}` },
});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
