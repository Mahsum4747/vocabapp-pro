import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import type { KurdishBundledEntry } from "./types.ts";

/**
 * Client-callable lookup for the bundled (offline, zero-AI-call) Kurmancî
 * (KU) <-> Turkish (TR) dataset — the KU/TR counterpart to German's
 * `lookupBundledSuggestions` (`german/bundled-suggestions.ts`), same shape:
 * a thin server-fn wrapper around a free, already-computed Map lookup.
 *
 * `direction` says which side `term` is written in — `"ku"` looks up a
 * Kurmancî term and returns Turkish gloss(es), `"tr"` looks up a Turkish
 * term and returns the one Kurmancî headword it unambiguously translates.
 * The caller (`card-editor.tsx`) picks this from the card's resolved term
 * language, exactly like the German path picks German vs. nothing from
 * `termLangCode`.
 *
 * No server-side language/profile gate, same reasoning as the German
 * version: this is a local Map lookup with nothing to protect (no AI
 * quota), so calling it for an unrecognized term/direction just returns
 * `null`. The client-side `hasBundledSuggestions` check plus `termLangCode`
 * branch is what decides whether the UI ever calls this at all.
 */

const inputSchema = z.object({
  term: z.string().trim().min(1).max(80),
  direction: z.enum(["ku", "tr"]),
});

export const lookupKurdishBundledSuggestions = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }): Promise<KurdishBundledEntry | null> => {
    const { lookupKurdishToTurkish, lookupTurkishToKurdish } = await import("./lookup.server");
    return data.direction === "ku"
      ? lookupKurdishToTurkish(data.term)
      : lookupTurkishToKurdish(data.term);
  });
