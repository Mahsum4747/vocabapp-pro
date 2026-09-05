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

export type GeneratedSet = z.infer<typeof payloadSchema>;

const GEMINI_MODEL = "gemini-2.5-flash";

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
          definition: { type: "STRING" },
        },
        required: ["term", "definition"],
      },
    },
  },
  required: ["title", "cards"],
};

/** Deterministic cache key for one (topic, count, term/definition language) request. */
async function cacheKeyFor(data: z.infer<typeof inputSchema>): Promise<string> {
  const { createHash } = await import("node:crypto");
  const normalized = [
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
    `Write each card's "term" in ${data.termLanguage} and its "definition" in ${data.definitionLanguage}.`,
    "Each definition is one or two short, clear sentences. Do not number the terms.",
    "Pick a fitting \"subject\" from: Language, Science, History, Geography, Software, General.",
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
        if (parsed.success) return { ok: true as const, set: parsed.data };
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
              temperature: 0.6,
              responseMimeType: "application/json",
              responseSchema: RESPONSE_SCHEMA,
            },
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
      candidates?: { content?: { parts?: { text?: string }[] } }[];
      promptFeedback?: { blockReason?: string };
    };
    const text = body.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.error("Gemini returned no candidates:", body.promptFeedback);
      return { ok: false as const, error: "Couldn't generate the set, try again." };
    }

    let parsed: GeneratedSet;
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

    return { ok: true as const, set: parsed };
  });
