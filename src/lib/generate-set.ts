import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "./auth/middleware";

const inputSchema = z.object({
  topic: z.string().trim().min(2).max(200),
  count: z.number().int().min(6).max(50),
  termLanguage: z.string().trim().min(1).max(40),
  definitionLanguage: z.string().trim().min(1).max(40),
});

const cardSchema = z.object({
  term: z.string().min(1).max(200),
  definition: z.string().min(1).max(500),
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
const RESPONSE_SCHEMA = {
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
            description:
              "Two lines separated by a single newline character: line 1 is the term's " +
              "meaning; line 2 is a short example sentence that uses the term, in quotes. " +
              "No other lines, no labels.",
          },
        },
        required: ["term", "definition"],
      },
    },
  },
  required: ["title", "cards"],
};

// Bump when the prompt/response shape changes in a way that makes previously
// cached results stale (e.g. the definition format below) — old cache entries
// under the previous version are simply never looked up again.
const CACHE_VERSION = "v2";

/** Deterministic cache key for one (topic, count, term/definition language) request. */
async function cacheKeyFor(data: z.infer<typeof inputSchema>): Promise<string> {
  const { createHash } = await import("node:crypto");
  const normalized = [
    CACHE_VERSION,
    data.topic.trim().toLowerCase(),
    data.count,
    data.termLanguage.trim().toLowerCase(),
    data.definitionLanguage.trim().toLowerCase(),
  ].join("|");
  return createHash("sha256").update(normalized).digest("hex");
}

function buildPrompt(data: z.infer<typeof inputSchema>): string {
  return [
    `Create exactly ${data.count} high-quality flashcards about: ${data.topic}.`,
    `Write each card's "term" in ${data.termLanguage}.`,
    'Write each card\'s "definition" as exactly two lines, separated by one newline character:',
    `  1. The term's meaning, in ${data.definitionLanguage}.`,
    `  2. A short example sentence in ${data.termLanguage} that uses the term naturally, wrapped in quotes.`,
    `Example, if term language is German and definition language is English, for the term "zurückgeben":`,
    '  to give back\n  "Kannst du mir das Buch zurückgeben?"',
    "Do not add any other lines, labels, or numbering to the definition or the term.",
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
              responseSchema: RESPONSE_SCHEMA,
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
