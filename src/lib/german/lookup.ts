import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import type { CompoundAnalysis } from "./compound.ts";
import type { NounEntry } from "./types.ts";

/**
 * Server function for German noun lookup: gender, plural, part of speech, and
 * a compound analysis of the word.
 *
 * Deterministic — a dictionary read, not a model call. No API key, no quota,
 * no cache: the answer for "Fahrrad" is the same today as tomorrow, and the
 * lookup is a Map hit, so caching it in Firestore the way the AI paths do
 * would be slower than recomputing it.
 *
 * Wiring only for now; nothing calls it yet. Presenting any of this on a card
 * is the next step and its own decision.
 */

const inputSchema = z.object({
  word: z.string().trim().min(1).max(80),
});

export interface GermanNounLookup {
  /** The word as asked for. */
  word: string;
  /**
   * Dictionary senses, best match first. Empty means the word is not in the
   * 102k-lemma extract — common for compounds, which is what `compound` is
   * for, and never an error.
   */
  entries: NounEntry[];
  /**
   * How the word might be built from other nouns. Always computed, including
   * for words that are themselves listed: "Wachstube" is both a lemma and a
   * compound, and its parts are useful either way.
   *
   * Read `compound.ambiguous` before showing `compound.guesses[0]` to anyone —
   * a split is a hypothesis about morphology, not a fact about the word.
   */
  compound: CompoundAnalysis;
}

export const lookupGermanNoun = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }): Promise<GermanNounLookup> => {
    // Imported here rather than at module scope, the same way Firestore access
    // is: it keeps the 2.9 MB dictionary out of every chunk that merely
    // references this module, and off the critical path of a cold start that
    // never looks a word up.
    const { lookupNoun, germanNouns } = await import("./nouns.server.ts");
    const { analyzeCompound } = await import("./compound.ts");

    return {
      word: data.word,
      entries: lookupNoun(data.word),
      compound: analyzeCompound(data.word, germanNouns),
    };
  });
