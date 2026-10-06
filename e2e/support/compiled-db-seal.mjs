// Local compiled-browser QA only. Sessions/server functions are mocked by the
// browser harness. Do not construct PGlite or run its automatic SQL migrations.
// Nitro bundles PGlite without its relative WASM/data assets; production uses
// configured Postgres instead. Never copy those assets into deployed output.
for (const name of [
  "DATABASE_URL",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
  "BETTER_AUTH_SECRET",
  "GEMINI_API_KEY",
]) {
  if (process.env[name]?.trim()) throw new Error(`Compiled QA requires blank ${name}`);
}
globalThis.__pgBootstrapPromise__ = Promise.resolve();
// Also prevent Better Auth's eager adapter initialization from constructing the
// fallback. A SQL-dependent request cannot complete; it fails the bounded test.
// This does not replace sessions, identity checks or any application handler.
globalThis.__pgliteInstance__ = new Promise(() => {});
