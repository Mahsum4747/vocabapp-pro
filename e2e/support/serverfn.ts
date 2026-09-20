import type { Page, Route } from "@playwright/test";
import { fromJSON, toCrossJSONAsync } from "seroval";

/**
 * Wire-level mock of TanStack Start server functions.
 *
 * The real transport (see @tanstack/start-client-core serverFnFetcher):
 *  - the URL is `/_serverFn/<base64 {file, export}>`, the export being
 *    `<name>_createServerFn_handler`;
 *  - the request payload is seroval JSON, in `?payload=` for GET and in the
 *    body for POST;
 *  - a success response is `application/json` with `x-tss-serialized: true`
 *    whose body is the seroval cross-JSON of `{ result, error, context }`.
 *
 * Anything that is not explicitly handled fails the test instead of falling
 * through to the dev server (and from there to a backend).
 */
export type ServerFnHandler = (data: unknown) => unknown | Promise<unknown>;

export type ServerFnCall = { name: string; data: unknown };

export class ServerFnMock {
  readonly calls: ServerFnCall[] = [];
  readonly unhandled: string[] = [];

  constructor(private readonly handlers: Record<string, ServerFnHandler>) {}

  callsTo(name: string): ServerFnCall[] {
    return this.calls.filter((c) => c.name === name);
  }

  async install(page: Page): Promise<void> {
    await page.route("**/_serverFn/**", (route) => this.handle(route));
  }

  private async handle(route: Route): Promise<void> {
    const request = route.request();
    const url = new URL(request.url());
    const id = decodeURIComponent(url.pathname.split("/_serverFn/")[1] ?? "");
    let name = "";
    try {
      const meta = JSON.parse(Buffer.from(id, "base64url").toString("utf8")) as { export: string };
      name = meta.export.replace(/_createServerFn_handler$/, "");
    } catch {
      /* falls through to unhandled */
    }

    const handler = this.handlers[name];
    if (!handler) {
      this.unhandled.push(name || request.url());
      await route.fulfill({ status: 500, contentType: "text/plain", body: `unmocked: ${name}` });
      return;
    }

    let data: unknown = undefined;
    const raw = request.method() === "GET" ? url.searchParams.get("payload") : request.postData();
    if (raw) {
      const payload = fromJSON(JSON.parse(raw)) as { data?: unknown };
      data = payload.data;
    }
    this.calls.push({ name, data });

    try {
      const result = await handler(data);
      await route.fulfill({
        status: 200,
        headers: { "content-type": "application/json", "x-tss-serialized": "true" },
        body: JSON.stringify(
          await toCrossJSONAsync({ result, error: undefined, context: {} }, { refs: new Map() }),
        ),
      });
    } catch (error) {
      // Same shape the real server sends for a thrown Error (see the captured
      // "Auth is disabled…" response): result undefined, error set.
      const err = error instanceof Error ? error : new Error(String(error));
      await route.fulfill({
        status: 200,
        headers: { "content-type": "application/json", "x-tss-serialized": "true" },
        body: JSON.stringify(
          await toCrossJSONAsync(
            { result: undefined, error: err, context: {} },
            { refs: new Map(), plugins: [] },
          ),
        ),
      });
    }
  }
}
