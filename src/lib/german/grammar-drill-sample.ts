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

/**
 * A bare `[0, 1, ..., count - 1]` array — no server round-trip, no dataset.
 * For the three grammar drills whose whole question pool is a small fixed
 * table baked into `grammar-drills.ts` (Modalverben, Pronomen, Steigerung):
 * `GrammarDrillRunner` still needs a same-length sample array to drive one
 * question per round slot, but these drills' `buildRound` ignores its
 * contents entirely and calls the fixed-table builder directly.
 */
export function numberSample(count: number): number[] {
  return Array.from({ length: count }, (_, i) => i);
}

/**
 * Client-callable wrapper around `examples.server.ts`'s
 * `randomExampleSentence`, same thin-wrapper/auth-gated shape as
 * `fetchRandomNounSample` above. The Diktat drill (grammar.diktat.tsx)
 * is the only caller — never a generated sentence, always one of the
 * bundled dataset's real examples.
 */
export const fetchRandomExampleSentence = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async (): Promise<string | null> => {
    const { randomExampleSentence } = await import("./examples.server");
    return randomExampleSentence();
  });
