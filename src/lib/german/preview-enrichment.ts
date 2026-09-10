import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import type { CardEnrichment } from "@/lib/types";

/**
 * Editor-only preview of what a German card's enrichment WOULD be if saved
 * right now — the exact same computation `card-enrichment-policy.ts` calls
 * on save (`enrichGermanTerm`), so what a user sees while typing can never
 * drift from what actually gets stored. It changes nothing: this is a plain
 * read, called from `CardEditor` on blurring the term field, so the "fills
 * silently" behavior is visible before the card is ever saved.
 *
 * Deliberately its own thin wrapper rather than reusing `lookupGermanNoun`
 * (Phase 3A) directly from the client: that function returns raw dictionary
 * senses and a compound analysis, and turning those into a `CardEnrichment`
 * means applying the same ambiguity rules `enrichGermanTerm` already
 * encodes. Re-implementing that in a component would be a second copy of
 * the one decision this whole feature is built around not duplicating.
 */

const inputSchema = z.object({ term: z.string().trim().min(1).max(80) });

export const previewGermanEnrichment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }): Promise<CardEnrichment | null> => {
    const { enrichGermanTerm } = await import("./enrich.server");
    return enrichGermanTerm(data.term);
  });
