import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import type { KurdishBundledEntry } from "./types.ts";

/**
 * Client-callable lookup for the bundled (offline, zero-AI-call) Kurmancî
 * (KU) <-> {German, English, Turkish} datasets — the KU-side counterpart to
 * German's `lookupBundledSuggestions` (`german/bundled-suggestions.ts`),
 * same shape: a thin server-fn wrapper around a free, already-computed Map
 * lookup.
 *
 * `termLang`/`otherLang` say which side of the pair `term` is written in,
 * and which language to look it up against — exactly one of the two must
 * be `"ku"` (the dataset only ever has a Kurdish side), and they must
 * differ. Any other combination (both `"ku"`, both the same non-Kurdish
 * language, or neither side `"ku"`) is a caller bug, not a real query — it
 * returns `null` rather than throwing, the same "best-effort, nothing to
 * protect" reasoning the rest of this module already documents.
 *
 * No server-side language/profile gate, same reasoning as the German
 * version: this is a local Map lookup with nothing to protect (no AI
 * quota), so calling it for an unrecognized term/direction just returns
 * `null`. The client-side `hasBundledSuggestions` check plus `termLangCode`
 * branch is what decides whether the UI ever calls this at all.
 */

const langSchema = z.enum(["ku", "de", "en", "tr"]);

const inputSchema = z.object({
  term: z.string().trim().min(1).max(80),
  termLang: langSchema,
  otherLang: langSchema,
});

export const lookupKurdishBundledSuggestions = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }): Promise<KurdishBundledEntry | null> => {
    const { termLang, otherLang, term } = data;
    if (termLang === otherLang) return null;
    if (termLang !== "ku" && otherLang !== "ku") return null;

    const lookup = await import("./lookup.server");

    if (termLang === "ku") {
      if (otherLang === "tr") return lookup.lookupKurdishToTurkish(term);
      if (otherLang === "de") return lookup.lookupKurdishToGerman(term);
      if (otherLang === "en") return lookup.lookupKurdishToEnglish(term);
      return null;
    }
    // otherLang === "ku" here (the termLang === "ku" case is handled above).
    if (termLang === "tr") return lookup.lookupTurkishToKurdish(term);
    if (termLang === "de") return lookup.lookupGermanToKurdish(term);
    if (termLang === "en") return lookup.lookupEnglishToKurdish(term);
    return null;
  });
