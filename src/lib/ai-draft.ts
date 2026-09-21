import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "./auth/middleware";
import { asLanguageCode } from "./lang/languages";
import { resolveSetLanguages } from "./types";
import { resolveEnrichment } from "./card-enrichment-policy";
import { missingNounFields, type MissingField } from "./card-completeness";

const inputSchema = z.object({
  cards: z
    .array(
      z.object({
        id: z.string().min(1).max(100),
        term: z.string().max(200),
        example: z.string().max(500).nullish(),
        enrichment: z.unknown().optional(),
      }),
    )
    .max(200),
  termLanguage: z.string().max(40).optional(),
  termLangCode: z.string().max(10).optional(),
});

/**
 * Which cards of an AI-generated draft are still incomplete nouns, judged with
 * the same enrichment the save would store (dictionary fill, user override
 * first) — so the editor's flags and the save-time refusal in `createSet` can
 * never disagree. Reads only; touches neither Gemini nor the budget.
 */
export const checkAiDraftCards = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }): Promise<Record<string, MissingField[]>> => {
    const isGerman =
      resolveSetLanguages({
        termLanguage: data.termLanguage,
        termLangCode: asLanguageCode(data.termLangCode) ?? undefined,
      }).term === "de";
    if (!isGerman) return {};
    const { enrichGermanTerm } = await import("./german/enrich.server");
    const context = { isGermanTermLanguage: true, dictLookup: enrichGermanTerm };

    const issues: Record<string, MissingField[]> = {};
    for (const card of data.cards) {
      const term = card.term.trim();
      if (!term) continue;
      const enrichment = resolveEnrichment(term, card.enrichment, context);
      const missing = missingNounFields({ term, example: card.example, enrichment }, true);
      if (missing.length > 0) issues[card.id] = missing;
    }
    return issues;
  });
