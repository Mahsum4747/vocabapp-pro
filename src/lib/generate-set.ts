import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "./auth/middleware";
import {
  DEFINITION_SCHEMA_DESCRIPTION,
  SECOND_DEFINITION_SCHEMA_DESCRIPTION,
  definitionExampleLines,
  definitionRuleLines,
  secondDefinitionRuleLines,
} from "./ai-definition-rule";
import { normalizeLanguage } from "./lang/languages";

const inputSchema = z.object({
  topic: z.string().trim().min(2).max(200),
  count: z.number().int().min(6).max(50),
  termLanguage: z.string().trim().min(1).max(40),
  definitionLanguage: z.string().trim().min(1).max(40),
  /** When set, ask for a second definition in this language too — mirrors
   *  the set's own `definitionLanguage2` toggle. */
  definitionLanguage2: z.string().trim().min(1).max(40).optional(),
});

const cardSchema = z.object({
  term: z.string().min(1).max(200),
  definition: z.string().min(1).max(500),
  definition2: z.string().max(500).optional(),
  example: z.string().max(500).optional().default(""),
});

const payloadSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(280).optional().default(""),
  subject: z.string().max(40).optional().default("General"),
  cards: z.array(cardSchema).min(4).max(50),
});

export type GeneratedSet = z.infer<typeof payloadSchema> & { termLanguage: string };

// gemini-2.5-flash was retired for new API keys; gemini-3.6-flash is the
// current GA Flash model and keeps the same generateContent/responseSchema
// contract (custom temperature/top-K/top-P are silently ignored on this
// model, so we don't send one).
const GEMINI_MODEL = "gemini-3.6-flash";

// Gemini's `responseSchema` is a restricted OpenAPI-3.0-style schema — plain
// object, not a zod schema — that forces the model's JSON output to match it,
// so we never have to parse free-form text out of a reply.
//
// Built per-request rather than as one static object: `definition2` only
// belongs in the schema (and only becomes required) when the caller actually
// asked for a second definition language — an unused optional field still
// costs the model attention and output tokens it doesn't need to spend.
function buildResponseSchema(wantsSecondDefinition: boolean) {
  return {
    type: "OBJECT",
    properties: {
      title: { type: "STRING" },
      description: { type: "STRING" },
      subject: {
        type: "STRING",
        enum: ["Language", "Science", "History", "Geography", "Software", "General"],
      },
      cards: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            term: { type: "STRING" },
            definition: {
              type: "STRING",
              description: DEFINITION_SCHEMA_DESCRIPTION,
            },
            ...(wantsSecondDefinition
              ? {
                  definition2: {
                    type: "STRING",
                    description: SECOND_DEFINITION_SCHEMA_DESCRIPTION,
                  },
                }
              : {}),
            example: {
              type: "STRING",
              description:
                "One short, grammatically flawless sentence in the term language that uses " +
                "the term naturally. No quotes around it, no translation, no labels.",
            },
          },
          required: wantsSecondDefinition
            ? ["term", "definition", "definition2", "example"]
            : ["term", "definition", "example"],
        },
      },
    },
    required: ["title", "cards"],
  };
}

// Bump when the prompt/response shape changes in a way that makes previously
// cached results stale (e.g. the definition format below) — old cache entries
// under the previous version are simply never looked up again. v4 added the
// optional second-definition-language field; v5 makes `definition` a direct
// translation rather than a dictionary-style description; v6 keys the cache
// on canonical language codes instead of raw free text.
const CACHE_VERSION = "v6";

/**
 * Deterministic cache key for one (topic, count, term/definition language[s])
 * request, keyed on canonical codes so the same request spelled differently
 * ("German" / "Deutsch" / "de") hits one entry instead of three.
 *
 * Free text is still what gets keyed for a language with no code — an
 * unrecognized language keeps its own bucket rather than colliding with
 * every other unrecognized one.
 */
async function cacheKeyFor(data: z.infer<typeof inputSchema>): Promise<string> {
  const { createHash } = await import("node:crypto");
  const languageKey = (value: string | undefined) => {
    const text = value?.trim() ?? "";
    if (!text) return "";
    return normalizeLanguage(text) ?? text.toLowerCase();
  };
  const normalized = [
    CACHE_VERSION,
    data.topic.trim().toLowerCase(),
    data.count,
    languageKey(data.termLanguage),
    languageKey(data.definitionLanguage),
    languageKey(data.definitionLanguage2),
  ].join("|");
  return createHash("sha256").update(normalized).digest("hex");
}

function buildPrompt(data: z.infer<typeof inputSchema>): string {
  return [
    `Create exactly ${data.count} high-quality flashcards about: ${data.topic}.`,
    "Each card has three separate fields — never merge them:",
    `  "term": the word or phrase itself, in ${data.termLanguage}.`,
    ...definitionRuleLines(data.definitionLanguage, "  "),
    ...(data.definitionLanguage2 ? secondDefinitionRuleLines(data.definitionLanguage2, "  ") : []),
    `  "example": one short sentence in ${data.termLanguage} that uses the term naturally.`,
    "    It must contain the term itself (an inflected/conjugated form is fine) and must be",
    "    grammatically flawless — correct articles, prepositions, cases, and agreement.",
    "    No surrounding quotes, no translation, no labels.",
    "How the definition must look:",
    ...definitionExampleLines("  "),
    'A full correct card: term: "zurückgeben", definition: "to give back",',
    '  example: "Kannst du mir das Buch morgen zurückgeben?"',
    'Pick a fitting "subject" from: Language, Science, History, Geography, Software, General.',
  ].join("\n");
}

export const generateStudySet = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const cacheKey = await cacheKeyFor(data);
    const db = getAdminFirestore();
    const cacheRef = db.collection("ai_generated_sets").doc(cacheKey);

    try {
      const cached = await cacheRef.get();
      if (cached.exists) {
        const parsed = payloadSchema.safeParse(cached.data()?.result);
        if (parsed.success) {
          return { ok: true as const, set: { ...parsed.data, termLanguage: data.termLanguage } };
        }
      }
    } catch (error) {
      // Cache is a nice-to-have — a Firestore hiccup shouldn't block generation.
      console.error("AI cache lookup failed:", error);
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "AI generation isn't available in this environment." };
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
              responseSchema: buildResponseSchema(Boolean(data.definitionLanguage2)),
            },
            // Flashcard generation is benign educational content, but Gemini's
            // default safety thresholds can over-block a prompt just for
            // naming a minority/ethnic language (e.g. Kurdish) — relax them so
            // a legitimate language name doesn't get the whole request
            // silently filtered before any cards come back.
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
      return { ok: false as const, error: "Couldn't generate the set, try again." };
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
          ? "The AI declined this topic/language combination. Try rephrasing the topic."
          : "Couldn't generate the set, try again.",
      };
    }

    let parsed: z.infer<typeof payloadSchema>;
    try {
      parsed = payloadSchema.parse(JSON.parse(text));
    } catch (error) {
      console.error("Gemini returned unusable JSON:", error);
      return { ok: false as const, error: "Couldn't read the AI response, try again." };
    }

    try {
      await cacheRef.set({
        result: parsed,
        topic: data.topic,
        count: data.count,
        termLanguage: data.termLanguage,
        definitionLanguage: data.definitionLanguage,
        createdAt: Date.now(),
      });
    } catch (error) {
      console.error("Failed to write AI cache:", error);
    }

    return { ok: true as const, set: { ...parsed, termLanguage: data.termLanguage } };
  });
