import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "./auth/middleware.ts";
import { asLanguageCode, normalizeLanguage } from "./lang/languages.ts";
import { profileFor, stripArticle } from "./lang/profiles.ts";

/**
 * Optional, explicitly-triggered example-sentence suggestions for the manual
 * card editor's Example field — 2–3 short sentences a user can tap to fill
 * the field, never auto-inserted. See card-editor.tsx for the click-to-open
 * inline panel this feeds.
 *
 * Deliberately its own file and its own Firestore collection rather than a
 * third field bolted onto `suggestCardContent` (suggest-card.ts): that
 * function returns exactly one definition + one example as a package deal,
 * cached as that single shape; this returns a small ARRAY of example
 * candidates, which is a different cached shape, not a superset or subset
 * of the other. Mixing the two under one collection would mean every reader
 * has to know which shape a given cache document holds.
 *
 * Reuses everything else about the existing pattern: server-only API key,
 * a versioned Firestore-backed cache keyed by a sha256 hash, the same
 * Gemini model and safety thresholds as suggest-card.ts and generate-set.ts.
 */

const MAX_EXISTING_TERMS = 5;
const SUGGESTION_COUNT_TEXT = "two or three";

const inputSchema = z.object({
  term: z.string().trim().min(1).max(200),
  /** Free-text term language, for the prompt — mirrors suggest-card.ts. */
  termLanguage: z.string().trim().min(1).max(40).optional(),
  /** The set's resolved term-language code, when known. Validated with
   *  `asLanguageCode` server-side rather than trusted — same convention as
   *  every other endpoint that accepts a code over the wire. */
  termLangCode: z.string().trim().max(10).optional(),
  definitionLanguage: z.string().trim().min(1).max(40),
  /**
   * The set's topic/subject, for prompt flavour ONLY — see `cacheKeyFor`.
   * Deliberately excluded from the cache key: keying on topic would mean
   * every set generates its own copy of the same word's examples, and
   * against a 20-request/day Gemini quota, cache-hit rate is what makes
   * this feature usable at all. The trade-off this accepts: only the
   * FIRST set to ever ask for a given word's examples gets its topic
   * reflected in them; every later set (any topic, or none) gets that
   * same cached result. Deliberate, not an oversight.
   */
  topic: z.string().trim().max(80).optional(),
  /** A few other terms already in the set, for context only — same
   *  cache-key exclusion and the same reasoning as `topic`. */
  existingTerms: z.array(z.string().trim().min(1).max(100)).max(MAX_EXISTING_TERMS).optional(),
});

const suggestionSchema = z.object({
  examples: z.array(z.string().trim().min(1).max(300)).min(2).max(3),
});

// Same model as suggest-card.ts / generate-set.ts — see suggest-card.ts's
// comment for why gemini-3.6-flash and not gemini-2.5-flash.
const GEMINI_MODEL = "gemini-3.6-flash";

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    examples: {
      type: "ARRAY",
      items: { type: "STRING" },
      description:
        `${SUGGESTION_COUNT_TEXT} short, natural, contemporary example sentences in the term ` +
        "language, each using the term naturally (an inflected/conjugated form is fine). " +
        "Grammatically flawless. Plain everyday usage, not literary or archaic. No surrounding " +
        "quotes, no translation, no labels, no numbering.",
    },
  },
  required: ["examples"],
};

// v1: new cache, new collection — nothing to migrate from.
const CACHE_VERSION = "v1";

function languageKeyFor(value: string | undefined): string {
  const text = value?.trim() ?? "";
  if (!text) return "";
  return normalizeLanguage(text) ?? text.toLowerCase();
}

/**
 * Deterministic cache key for one (term, term language, definition language)
 * request — deliberately NOT including `topic`, `existingTerms`, or any
 * set/card id. See the `topic` field's doc comment above for why: the whole
 * point of this cache is that the same word is generated once, ever, across
 * every set and every user that ever asks for it.
 *
 * `stripArticle` runs on the term BEFORE hashing: "der Sohn" and "Sohn" must
 * resolve to the same entry, the same class of fix already made on the
 * grading path (`articleWordsForAnswer` / `answersMatch`) — this is the
 * write/lookup-key side of that identical problem, not a new one.
 */
export async function cacheKeyFor(
  data: z.infer<typeof inputSchema>,
  termLanguageCode: ReturnType<typeof asLanguageCode>,
): Promise<string> {
  const { createHash } = await import("node:crypto");
  const profile = profileFor(termLanguageCode);
  const normalizedTerm = stripArticle(data.term, profile).toLowerCase();
  const normalized = [
    CACHE_VERSION,
    normalizedTerm,
    termLanguageCode ?? languageKeyFor(data.termLanguage),
    languageKeyFor(data.definitionLanguage),
  ].join("|");
  return createHash("sha256").update(normalized).digest("hex");
}

export function buildPrompt(data: z.infer<typeof inputSchema>): string {
  const termLanguageText = data.termLanguage ? ` The term is in ${data.termLanguage}.` : "";
  const lines = [
    `Give ${SUGGESTION_COUNT_TEXT} short example sentences for this flashcard term: ` +
      `"${data.term}".${termLanguageText}`,
    "Each sentence must:",
    "- be natural, contemporary, everyday language a learner would actually encounter or use",
    "- be relatively short — one clause or two at most, not a literary or archaic sentence",
    "- use the term naturally (an inflected/conjugated form of it is fine)",
    "- be grammatically flawless — correct articles, prepositions, cases, and agreement",
    "- stand on its own, no surrounding quotes, no translation, no labels, no numbering",
    "Make the sentences meaningfully different from each other, not trivial variations.",
  ];
  if (data.topic?.trim()) {
    lines.push(
      `The flashcard set's topic is "${data.topic.trim()}" — where it fits naturally, let the ` +
        "sentences reflect that topic. Don't force it if the word doesn't relate to it.",
    );
  }
  if (data.existingTerms && data.existingTerms.length > 0) {
    lines.push(
      "For context only (do not define or explain these, just for flavour): this set also " +
        `contains the terms ${data.existingTerms.join(", ")}.`,
    );
  }
  return lines.join("\n");
}

/**
 * Suggest 2–3 example sentences for one term — explicitly triggered by the
 * user opening the suggestion panel in the card editor, never automatic.
 *
 * Gated by `LanguageProfile.hasExampleSuggestions` (German only for now):
 * checked before any Firestore or Gemini call, so an unsupported language
 * costs nothing, not even a cache read. This is the ONE place the gate is
 * enforced — the editor also checks it to decide whether to show the
 * button at all, but this server-side check is what actually protects the
 * shared Gemini quota if that client-side gate is ever missed or bypassed.
 */
export const suggestExampleSentences = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    const termLanguageCode = asLanguageCode(data.termLangCode) ?? normalizeLanguage(data.termLanguage ?? "");
    const profile = profileFor(termLanguageCode);
    if (!profile.hasExampleSuggestions) {
      return {
        ok: false as const,
        error: "Example suggestions aren't available for this language yet.",
      };
    }

    const { getAdminFirestore } = await import("./firebase-admin.server");
    const cacheKey = await cacheKeyFor(data, termLanguageCode);
    const db = getAdminFirestore();
    const cacheRef = db.collection("ai_example_suggestions").doc(cacheKey);

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
      console.error("Example suggestion cache lookup failed:", error);
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "Example suggestions aren't available in this environment." };
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
            // Same relaxed thresholds as suggest-card.ts / generate-set.ts.
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
      return { ok: false as const, error: "Couldn't get suggestions, try again." };
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
          : "Couldn't get suggestions, try again.",
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
      console.error("Failed to write example suggestion cache:", error);
    }

    return { ok: true as const, ...parsed };
  });
