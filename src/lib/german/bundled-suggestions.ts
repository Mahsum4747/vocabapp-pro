import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import type { BundledEntry } from "./examples.server.ts";

/**
 * Client-callable lookup for the bundled (offline, zero-AI-call) example/
 * translation dataset — the data source `CardEditor`'s example panel and
 * Definition tap-to-fill chips check FIRST, before ever considering the AI
 * suggestion flows. Shaped exactly like `preview-enrichment.ts`: a thin
 * server-fn wrapper around a free, already-computed lookup, not a cached,
 * quota-guarded call like `example-suggestions.ts`.
 *
 * Deliberately has NO server-side language/profile gate, unlike
 * `suggestExampleSentences` — that gate exists specifically to protect a
 * shared, metered Gemini quota from a bypassed client check. This is a
 * local Map lookup with nothing to protect: calling it for a non-German
 * term just returns `null`, the same as `previewGermanEnrichment` does
 * today for the same reason. The client-side `hasBundledSuggestions` check
 * is what decides whether the UI ever calls this at all.
 */

const inputSchema = z.object({ term: z.string().trim().min(1).max(80) });

export const lookupBundledSuggestions = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }): Promise<BundledEntry | null> => {
    const { lookupBundled } = await import("./examples.server");
    return lookupBundled(data.term);
  });
