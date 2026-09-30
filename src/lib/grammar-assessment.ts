import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "./auth/middleware";

/**
 * Optional, explicitly-triggered AI review of a learner's `grammarProgress`
 * data (grammar-progress.ts) — Account's "Grammar Review" button, never
 * automatic. Same shared-pool budget as every other Gemini call site
 * (ai-budget.ts/ai-budget.server.ts via `spendAiAction("assist")`) — no new
 * budget system, no per-feature cap.
 *
 * Never calls Gemini with too little data to say anything real: fewer than
 * `MIN_TOTAL_ATTEMPTS` questions answered across ALL topics combined
 * returns `{ status: "insufficient" }` before the budget is even touched,
 * let alone Gemini. The Account tab also gates the button itself on this
 * same threshold (computed client-side from `getGrammarProgress`), so this
 * server-side check only ever fires on stale client state, never as the
 * primary UX gate.
 */

const MIN_TOTAL_ATTEMPTS = 5;

// Same model as suggest-card.ts / generate-set.ts / write-it-feedback.ts.
const GEMINI_MODEL = "gemini-3.6-flash";

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    assessment: {
      type: "STRING",
      description:
        "2-3 short, one-sentence-each pieces of advice, each naming a specific weak topic (by its " +
        "given name) and what to review — e.g. 'Pronomen'de %40 doğruluk var, mich/mir ayrımını " +
        "tekrar gözden geçir.' Encouraging, non-judgmental tone throughout. No general intro/outro, " +
        "just the 2-3 sentences.",
    },
  },
  required: ["assessment"],
};

function responseLanguageName(explanationLanguage: string | undefined): string {
  if (explanationLanguage === "tr") return "Turkish";
  if (explanationLanguage === "ku") return "Kurdish (Kurmanji)";
  return "English";
}

/** "subjektive-modalverben" -> "Subjektive Modalverben" — Gemini reads the
 *  raw topicId slugs fine either way, but a humanized label makes the
 *  prompt (and any debugging of it) easier to read. Not a display-name
 *  lookup table — deliberately no dependency on grammar-rules.ts's own
 *  (differently-keyed, drill-subset-only) topic list. */
function humanizeTopicId(topicId: string): string {
  return topicId
    .split("-")
    .map((word) => (word.length === 0 ? word : word[0]!.toUpperCase() + word.slice(1)))
    .join(" ");
}

export interface GrammarTopicSummary {
  topicId: string;
  accuracy: number;
  totalAttempts: number;
}

/** Exported for direct testing without a live Gemini call. */
export function buildGrammarAssessmentPrompt(
  topics: GrammarTopicSummary[],
  explanationLanguage: string | undefined,
): string {
  const lines = topics
    .map((t) => `- ${humanizeTopicId(t.topicId)}: ${t.accuracy}% accuracy over ${t.totalAttempts} questions`)
    .join("\n");
  return [
    "This is a German learner's grammar drill practice data, one line per topic practiced so far:",
    lines,
    "Identify the weakest 2-3 topics — lowest accuracy, and only topics with enough attempts to be " +
      "meaningful (ignore a topic with only 1-2 attempts if better-attempted topics are also weak) — " +
      "and write ONE short, concrete sentence of advice for EACH, naming the topic and what to " +
      "review. Keep the tone short, non-judgmental and motivating, never clinical or harsh. Do not " +
      "add a general introduction or summary — just the 2-3 sentences, one per line.",
    `The learner wants the response in ${responseLanguageName(explanationLanguage)}.`,
  ].join("\n\n");
}

const inputSchema = z.object({
  /** `profile.explanationLanguage`, forwarded as-is — same convention as
   *  write-it-feedback.ts / write-sentence-feedback.ts. */
  explanationLanguage: z.string().trim().max(20).optional(),
});

const assessmentSchema = z.object({
  assessment: z.string().trim().min(1).max(1500),
});

export type GrammarAssessmentResult =
  | { status: "ok"; assessment: string }
  | { status: "insufficient" }
  | { status: "error"; error: string };

export const getGrammarAssessment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ context, data }): Promise<GrammarAssessmentResult> => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const doc = await db.collection("grammarProgress").doc(context.userId).get();
    const raw = (doc.data() ?? {}) as Record<string, GrammarTopicSummary>;
    const topics = Object.values(raw);
    const totalAttempts = topics.reduce((sum, t) => sum + (t.totalAttempts ?? 0), 0);
    if (totalAttempts < MIN_TOTAL_ATTEMPTS) {
      return { status: "insufficient" };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { status: "error", error: "AI review isn't available in this environment." };
    }

    const budget = await (await import("./ai-budget.server")).spendAiAction("assist");
    if (!budget.ok) return { status: "error", error: budget.error };

    const summary: GrammarTopicSummary[] = topics.map((t) => ({
      topicId: t.topicId,
      accuracy: t.accuracy,
      totalAttempts: t.totalAttempts,
    }));

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
            contents: [
              { role: "user", parts: [{ text: buildGrammarAssessmentPrompt(summary, data.explanationLanguage) }] },
            ],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: RESPONSE_SCHEMA,
            },
            // Same relaxed thresholds as suggest-card.ts / generate-set.ts / write-it-feedback.ts.
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
      return { status: "error", error: "Couldn't get a review right now — try again." };
    }

    if (res.status === 429) {
      return { status: "error", error: "AI quota exceeded, try again later." };
    }
    if (!res.ok) {
      console.error("Gemini API error:", res.status, await res.text().catch(() => ""));
      return { status: "error", error: "Couldn't get a review right now — try again." };
    }

    const body = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
      promptFeedback?: { blockReason?: string };
    };
    const text = body.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      const blockReason = body.promptFeedback?.blockReason ?? body.candidates?.[0]?.finishReason;
      console.error("Gemini returned no usable content:", blockReason, body.promptFeedback);
      return { status: "error", error: "Couldn't get a review right now — try again." };
    }

    let parsed: z.infer<typeof assessmentSchema>;
    try {
      parsed = assessmentSchema.parse(JSON.parse(text));
    } catch (error) {
      console.error("Gemini returned unusable JSON:", error);
      return { status: "error", error: "Couldn't get a review right now — try again." };
    }

    return { status: "ok", assessment: parsed.assessment };
  });
