import assert from "node:assert/strict";
import test from "node:test";
import { normalizePgConnectionString } from "./db-connection";

test("pg require mode becomes explicit verify-full", () => {
  const normalized = normalizePgConnectionString(
    "postgresql://example.test/db?sslmode=require&channel_binding=require",
  );
  const url = new URL(normalized);
  assert.equal(url.searchParams.get("sslmode"), "verify-full");
  assert.equal(url.searchParams.get("channel_binding"), "require");
});

test("other ssl modes and malformed values stay unchanged", () => {
  const prefer = "postgresql://example.test/db?sslmode=prefer";
  assert.equal(normalizePgConnectionString(prefer), prefer);
  assert.equal(normalizePgConnectionString("not-a-url"), "not-a-url");
});
