import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import type { NounEntry } from "./types.ts";

/**
 * Client-callable wrapper around `nouns.server.ts`'s `randomNounSample` —
 * the set-independent grammar drills (plural, nicht/kein, mein/dein/sein)
 * pull their noun pool from the whole 102k-entry dictionary, not from any
 * one set's cards, so they need a fresh server round-trip rather than
 * anything already loaded into the store. Same thin-wrapper shape as
 * `term-suggestions.server.ts`/`bundled-suggestions.ts`: auth-gated (so a
 * signed-out caller can't hit it), zod-validated, no logic beyond the
 * import + call.
 */

const inputSchema = z.object({
  count: z.number().int().min(1).max(50),
});

export const fetchRandomNounSample = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }): Promise<NounEntry[]> => {
    const { randomNounSample } = await import("./nouns.server");
    return randomNounSample(data.count);
  });
