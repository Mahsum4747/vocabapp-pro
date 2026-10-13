import assert from "node:assert/strict";
import { test } from "node:test";
import { betterAuth } from "better-auth";
import { authOriginConfig } from "./origin-config";
const allowed = ["*.grok-sandbox.com"];
const hostname = "vocabapp-n394ccy8k-memahs.vercel.app";
const origin = `https://${hostname}`;

test("Preview without BETTER_AUTH_URL trusts only its exact deployment over HTTPS", () => {
  const config = authOriginConfig({ vercelEnvironment: "preview", vercelURL: hostname }, allowed);
  assert.equal(config.baseURL, origin);
  assert(config.trustedOrigins.includes(origin));
  assert(!config.trustedOrigins.includes(`http://${hostname}`));
  assert(!config.trustedOrigins.some((s) => s.includes("*.vercel.app")));
});
test("Explicit Production URL and existing local origins remain authoritative", () => {
  const config = authOriginConfig(
    {
      baseURL: "https://vocabapp-pro.vercel.app",
      vercelEnvironment: "production",
      vercelURL: hostname,
    },
    allowed,
  );
  assert.equal(config.baseURL, "https://vocabapp-pro.vercel.app");
  assert(!config.trustedOrigins.includes(origin));
  assert(config.trustedOrigins.includes("http://127.0.0.1:8080"));
});
test("Explicit Preview custom URL is not silently replaced", () => {
  const config = authOriginConfig(
    { baseURL: "https://preview.example.org", vercelEnvironment: "preview", vercelURL: hostname },
    allowed,
  );
  assert.equal(config.baseURL, "https://preview.example.org");
  assert(!config.trustedOrigins.includes(origin));
});
test("Grok sandbox and loopback fallback are unchanged outside Vercel Preview", () => {
  for (const vercelEnvironment of [undefined, "development", "production"]) {
    const config = authOriginConfig({ vercelEnvironment, vercelURL: hostname }, allowed);
    assert.deepEqual(config.baseURL, {
      allowedHosts: [...allowed, "localhost", "127.0.0.1", "[::1]"],
      protocol: "auto",
      fallback: "http://localhost:8080",
    });
    assert(config.trustedOrigins.includes("https://*.grok-sandbox.com"));
    assert(!config.trustedOrigins.includes(origin));
  }
});
test("Malformed or foreign deployment hostnames do not expand the trust boundary", () => {
  for (const vercelURL of [
    "*.vercel.app",
    "https://" + hostname,
    hostname + ".evil.org",
    hostname + "/path",
    hostname + ":443",
    "user@" + hostname,
    "vercel.app",
    "example.org",
    hostname + "?query",
  ]) {
    const config = authOriginConfig({ vercelEnvironment: "preview", vercelURL }, allowed);
    assert.equal(typeof config.baseURL, "object");
  }
});
test("Real Better Auth middleware accepts current Preview and rejects sibling/HTTP/foreign origins before persistence", async () => {
  const config = authOriginConfig({ vercelEnvironment: "preview", vercelURL: hostname }, allowed);
  const instance = betterAuth({
    ...config,
    secret: "test-only-origin-secret-32-characters-long",
    emailAndPassword: { enabled: true },
    logger: { disabled: true },
  });
  // No DB, session, credential or account is created. A missing password triggers
  // request validation only after origin checks. This exercises the real handler.
  async function post(from: string) {
    return instance.handler(
      new Request(origin + "/api/auth/sign-in/email", {
        method: "POST",
        headers: { "Content-Type": "application/json", Origin: from, Cookie: "test-origin=1" },
        body: JSON.stringify({ email: "fictional@example.org" }),
      }),
    );
  }
  const accepted = await post(origin);
  assert.equal(accepted.status, 400);
  assert.notEqual((await accepted.json()).code, "INVALID_ORIGIN");
  for (const from of [
    "https://sibling.vercel.app",
    `http://${hostname}`,
    "https://evil.example.org",
  ]) {
    const result = await post(from);
    assert.equal(result.status, 403);
    assert.equal((await result.json()).code, "INVALID_ORIGIN");
  }
});
