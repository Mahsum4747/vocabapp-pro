import { expect, test as base, type Page } from "@playwright/test";
import { MockBackend, NOW, USER_ID, type Seed } from "./backend.ts";
import { ServerFnMock } from "./serverfn.ts";

export { expect };

export type Harness = {
  backend: MockBackend;
  serverFns: ServerFnMock;
};

/** The body Better Auth's `/api/auth/get-session` returns for a signed-in user. */
function sessionBody() {
  const iso = new Date(NOW).toISOString();
  return {
    session: {
      id: "session-e2e",
      token: "token-e2e",
      userId: USER_ID,
      expiresAt: new Date(NOW + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: iso,
      updatedAt: iso,
      ipAddress: null,
      userAgent: null,
    },
    user: {
      id: USER_ID,
      name: "E2E Learner",
      email: "e2e@example.test",
      emailVerified: true,
      image: null,
      createdAt: iso,
      updatedAt: iso,
    },
  };
}

async function launchApp(page: Page, seed: Seed, leaks: string[]): Promise<Harness> {
  // Frozen clock: `Date.now()` and `new Date()` return NOW, timers keep running.
  await page.clock.setFixedTime(NOW);

  // Seal the network from the outside in. Later routes win, so: everything
  // off-origin is refused, any /api call not mocked below is refused and
  // recorded, and only then do the specific mocks go on top.
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.hostname !== "127.0.0.1") return route.abort();
    return route.continue();
  });
  await page.route("**/api/**", (route) => {
    leaks.push(route.request().url());
    return route.abort();
  });
  await page.route("**/api/auth/get-session", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(sessionBody()) }),
  );

  const backend = new MockBackend(seed);
  const serverFns = new ServerFnMock(backend.handlers());
  await serverFns.install(page);
  return { backend, serverFns };
}

export const test = base.extend<{ launch: (seed: Seed) => Promise<Harness> }>({
  launch: async ({ page }, use) => {
    const leaks: string[] = [];
    const harnesses: Harness[] = [];
    await use(async (seed) => {
      const harness = await launchApp(page, seed, leaks);
      harnesses.push(harness);
      return harness;
    });
    // A request that no mock claimed means the test was not actually hermetic.
    expect(leaks, "requests to /api that no mock handled").toEqual([]);
    for (const harness of harnesses) {
      expect(harness.serverFns.unhandled, "server functions that no mock handled").toEqual([]);
    }
  },
});
