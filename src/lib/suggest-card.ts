import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "./auth/middleware";

/**
 * One-card AI assist for manual card creation: given a term, suggest its
 * definition and an example sentence in a single Gemini call.
 *
 * Deliberately its own file rather than a third mode bolted onto
 * `generate-set.ts` — that module builds a whole SET from a topic; this
 * fills in one card a person is already writing by hand. They share the
 * same constraints (server-only API key, cached, versioned) but not the
 * prompt, schema, or caller.
 */

const inputSchema = z.object({
  term: z.string().trim().min(1).max(200),
  /** The set's term language, when known — otherwise the model infers it. */
  termLanguage: z.string().trim().min(1).max(40).optional(),
  /** Which language to write the definition in — English for the card's
   *  primary definition, or a set's `definitionLanguage2` for the second. */
  definitionLanguage: z.string().trim().min(1).max(40),
});

const suggestionSchema = z.object({
  definition: z.string().min(1).max(500),
  example: z.string().max(500).optional().default(""),
});

// gemini-2.5-flash was retired for new API keys; gemini-3.6-flash is the
// current GA Flash model and keeps the same generateContent/responseSchema
// contract (custom temperature/top-K/top-P are silently ignored on this
// model, so we don't send one). Same model generate-set.ts uses.
const GEMINI_MODEL = "gemini-3.6-flash";

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    definition: {
      type: "STRING",
      description:
        "A brief translation or definition of the term, in the requested definition language. " +
        "One to a few words or short phrase only — no example sentence, no quotes, " +
        "no labels, no line breaks, no punctuation at the end.",
    },
    example: {
      type: "STRING",
      description:
        "One short, grammatically flawless sentence in the term language that uses " +
        "the term naturally. No quotes around it, no translation, no labels.",
    },
  },
  required: ["definition", "example"],
};

// Bump when the prompt/response shape changes in a way that makes previously
// cached results stale — old cache entries under the previous version are
// simply never looked up again. Independent of generate-set.ts's own version:
// the two caches, prompts and schemas are unrelated.
const CACHE_VERSION = "v1";

/** Deterministic cache key for one (term, term language, definition language) request. */
async function cacheKeyFor(data: z.infer<typeof inputSchema>): Promise<string> {
  const { createHash } = await import("node:crypto");
  const normalized = [
    CACHE_VERSION,
    data.term.trim().toLowerCase(),
    (data.termLanguage ?? "").trim().toLowerCase(),
    data.definitionLanguage.trim().toLowerCase(),
  ].join("|");
  return createHash("sha256").update(normalized).digest("hex");
}

function buildPrompt(data: z.infer<typeof inputSchema>): string {
  const termLanguageText = data.termLanguage ? ` The term is in ${data.termLanguage}.` : "";
  return [
    `Give a brief definition and one example sentence for this flashcard term: "${data.term}".${termLanguageText}`,
    `"definition": a brief translation or definition, in ${data.definitionLanguage}. One to a few words`,
    "  or short phrase only — no example sentence, no quotes, no labels, no line breaks, no ending punctuation.",
    `"example": one short sentence${data.termLanguage ? ` in ${data.termLanguage}` : ""} that uses the`,
    "  term naturally. It must contain the term itself (an inflected/conjugated form is fine)",
    "  and must be grammatically flawless — correct articles, prepositions, cases, and agreement.",
    "  No surrounding quotes, no translation, no labels.",
  ].join("\n");
}

/**
 * Suggest a definition and example for one term. Term-keyed and cached the
 * same way `generateStudySet` caches a topic: a common word ("der", "die",
 * "das", "run", ...) asked by any user, in the same languages, is answered
 * from Firestore instead of spending another call against the shared Gemini
 * free-tier quota.
 */
export const suggestCardContent = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const cacheKey = await cacheKeyFor(data);
    const db = getAdminFirestore();
    const cacheRef = db.collection("ai_card_suggestions").doc(cacheKey);

    try {
      const cached = await cacheRef.get();
      if (cached.exists) {
        const parsed = suggestionSchema.safeParse(cached.data()?.result);
        if (parsed.success) {
          return { ok: true as const, ...parsed.data };
        }
      }
    } catch (error) {
      // Cache is a nice-to-have — a Firestore hiccup shouldn't block the suggestion.
      console.error("AI suggestion cache lookup failed:", error);
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "AI suggestions aren't available in this environment." };
    }

    let res: Response;
    try {
      res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: buildPrompt(data) }] }],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: RESPONSE_SCHEMA,
            },
            // Same relaxed thresholds as generate-set.ts: flashcard content is
            // benign, but a minority/ethnic language name can otherwise trip
            // the default safety filter before any text comes back.
            safetySettings: [
              { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
              { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
              { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
              { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
            ],
          }),
        },
      );
    } catch (error) {
      console.error("Gemini request failed:", error);
      return { ok: false as const, error: "Couldn't reach the AI service, try again." };
    }

    if (res.status === 429) {
      return { ok: false as const, error: "AI quota exceeded, try again later." };
    }
    if (!res.ok) {
      console.error("Gemini API error:", res.status, await res.text().catch(() => ""));
      return { ok: false as const, error: "Couldn't get a suggestion, try again." };
    }

    const body = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
      promptFeedback?: { blockReason?: string };
    };
    const text = body.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      const blockReason = body.promptFeedback?.blockReason ?? body.candidates?.[0]?.finishReason;
      console.error("Gemini returned no usable content:", blockReason, body.promptFeedback);
      return {
        ok: false as const,
        error: blockReason
          ? "The AI declined this term/language combination."
          : "Couldn't get a suggestion, try again.",
      };
    }

    let parsed: z.infer<typeof suggestionSchema>;
    try {
      parsed = suggestionSchema.parse(JSON.parse(text));
    } catch (error) {
      console.error("Gemini returned unusable JSON:", error);
      return { ok: false as const, error: "Couldn't read the AI response, try again." };
    }

    try {
      await cacheRef.set({
        result: parsed,
        term: data.term,
        termLanguage: data.termLanguage ?? null,
        definitionLanguage: data.definitionLanguage,
        createdAt: Date.now(),
      });
    } catch (error) {
      console.error("Failed to write AI suggestion cache:", error);
    }

    return { ok: true as const, ...parsed };
  });
