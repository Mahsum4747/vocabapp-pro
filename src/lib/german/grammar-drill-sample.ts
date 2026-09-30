import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import type { NounEntry } from "./types.ts";

/**
 * The Nominalisierung drill's two question kinds — declared here (a plain,
 * client-safe module) rather than in `nominalisierung.server.ts`, so this
 * file's `fetchRandomNominalisierungSample` can expose the type to client
 * code without a client-side import of a `*.server.*` file (Vite's
 * import-protection plugin denies those, type-only or not — see
 * vite.config.ts). `nominalisierung.server.ts` imports this type back from
 * here.
 */
export type NominalisierungSampleEntry =
  | { kind: "ung"; base: string; correctAnswer: string; distractors: string[] }
  | { kind: "infinitiv"; base: string; correctAnswer: string; distractors: string[] };

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

/**
 * Client-callable wrapper around `nominalisierung.server.ts`'s
 * `randomNominalisierungSample` — same thin-wrapper/auth-gated shape as
 * `fetchRandomNounSample` above, and for the same reason: the -ung pool is
 * derived from `nouns-data.ts` (2.9 MB), which must never reach the client
 * bundle. Each returned entry already carries its own correct answer and
 * distractors (see that module's doc comment) — nothing here re-derives
 * anything.
 */
export const fetchRandomNominalisierungSample = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }): Promise<NominalisierungSampleEntry[]> => {
    const { randomNominalisierungSample } = await import("./nominalisierung.server");
    return randomNominalisierungSample(data.count);
  });

/** One term's offline gloss, one string per explanation language — `en` is
 *  never empty when a gloss exists at all (`pickExplanation`'s own
 *  contract); `tr`/`ku` fall back to `""` when `examples-data.ts` has no
 *  translation for that language yet, same as the card editor's own
 *  bundled-translation handling. */
export interface GermanGloss {
  en: string;
  tr: string;
  ku: string;
}

const glossInputSchema = z.object({
  // Capped well above any one round's realistic distinct-term count —
  // just a sane upper bound, not a real limit any caller approaches.
  terms: z.array(z.string().trim().min(1)).min(1).max(100),
});

/**
 * Batch offline-translation lookup for the grammar drills' optional
 * "meaning" line under a prompt's German word (`DrillQuestion.glossKey` —
 * see `GrammarDrillRunner`'s own doc comment). One request per round
 * (never per question) for every distinct `glossKey` the round's questions
 * carry. Terms with no bundled entry (or an ambiguous one — see
 * `examples.server.ts`'s own doc comment) are simply absent from the
 * returned map — the caller renders nothing for those, never a guess.
 */
export const fetchGermanGlosses = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => glossInputSchema.parse(input))
  .handler(async ({ data }): Promise<Record<string, GermanGloss>> => {
    const { lookupBundled } = await import("./examples.server");
    const result: Record<string, GermanGloss> = {};
    for (const term of data.terms) {
      const entry = lookupBundled(term);
      const en = entry?.translations.en[0];
      if (!entry || !en) continue; // no bundled entry, or no English sense to fall back to
      result[term] = {
        en,
        tr: entry.translations.tr[0] ?? "",
        ku: entry.translations.ku[0] ?? "",
      };
    }
    return result;
  });
