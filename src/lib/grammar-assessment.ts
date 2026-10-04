import { roundAccuracyEvidence } from "./progress-window";
import { logOperationFailure } from "./diagnostics";
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

/** A learner's own AI-generated Grammar Paste topic (grammar-paste-topics.ts)
 *  — same accuracy/attempts shape as the fixed 26, but never one of them:
 *  its `topic` is free text the learner typed, not a `topicId` slug. Kept
 *  as a distinct type (not folded into `GrammarTopicSummary`) so the prompt
 *  builder can never accidentally treat one as the other. */
export interface GrammarPasteTopicForAssessment {
  topic: string;
  accuracy: number;
  totalAttempts: number;
}

/** A paste topic needs at least this many attempts before it's worth
 *  mentioning to Gemini at all — same idea as the "ignore a topic with
 *  only 1-2 attempts" instruction below, just enforced up front so a
 *  barely-tried custom topic never crowds out the fixed 26's own signal. */
export const MIN_PASTE_TOPIC_ATTEMPTS_FOR_ASSESSMENT = 3;

/** Exported for direct testing without a live Gemini call. */
export function buildGrammarAssessmentPrompt(
  topics: GrammarTopicSummary[],
  explanationLanguage: string | undefined,
  pasteTopics: GrammarPasteTopicForAssessment[] = [],
): string {
  const lines = topics
    .map(
      (t) =>
        `- ${humanizeTopicId(t.topicId)}: ${roundAccuracyEvidence(t.accuracy, t.totalAttempts)}`,
    )
    .join("\n");
  const parts = [
    "This is a German learner's grammar drill practice data, one line per topic practiced so far:",
    lines,
    "Rolling accuracy is question-weighted over up to 20 completed rounds. Lifetime questions is a separate participation counter, not the accuracy denominator.",
    "Identify the weakest 2-3 topics — lowest accuracy, and only topics with enough attempts to be " +
      "meaningful (ignore a topic with only 1-2 attempts if better-attempted topics are also weak) — " +
      "and write ONE short, concrete sentence of advice for EACH, naming the topic and what to " +
      "review. Keep the tone short, non-judgmental and motivating, never clinical or harsh. Do not " +
      "add a general introduction or summary — just the 2-3 sentences, one per line.",
  ];
  if (pasteTopics.length > 0) {
    const pasteLines = pasteTopics
      .map((t) => `- ${t.topic}: ${roundAccuracyEvidence(t.accuracy, t.totalAttempts)}`)
      .join("\n");
    parts.push(
      "In addition, here are grammar topics the learner created THEMSELVES, using their own AI, " +
        "through Karta's \"Practice your own topic\" feature — these are NOT part of Karta's official " +
        "curriculum, just custom practice the learner set up on their own:",
      pasteLines,
      "Evaluate these the same way if one shows a real weakness worth mentioning, but when you do " +
        "mention one, make clear in that sentence that it's one of the learner's own custom topics " +
        "(e.g. \"in your custom topic '...'\"), not part of Karta's built-in curriculum. Do not force " +
        "a mention if none of these show a genuine weakness — only the fixed curriculum topics above " +
        "are guaranteed to be covered.",
    );
  }
  parts.push(`The learner wants the response in ${responseLanguageName(explanationLanguage)}.`);
  return parts.join("\n\n");
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

    // Read-only: grammar-assessment.ts never writes to grammarPasteTopics,
    // only reads it to fold qualifying topics into the same prompt — see
    // buildGrammarAssessmentPrompt's own doc comment on how they're labeled.
    let pasteSummary: GrammarPasteTopicForAssessment[] = [];
    try {
      const pasteSnap = await db
        .collection("users")
        .doc(context.userId)
        .collection("grammarPasteTopics")
        .get();
      pasteSummary = pasteSnap.docs
        .map((d) => d.data() as { topic: string; accuracy: number | null; totalAttempts: number })
        .filter(
          (t): t is { topic: string; accuracy: number; totalAttempts: number } =>
            t.accuracy !== null && t.totalAttempts >= MIN_PASTE_TOPIC_ATTEMPTS_FOR_ASSESSMENT,
        )
        .map((t) => ({ topic: t.topic, accuracy: t.accuracy, totalAttempts: t.totalAttempts }));
    } catch (error) {
      logOperationFailure("grammar-assessment.storage", new Error("Operation failed"));
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
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: buildGrammarAssessmentPrompt(
                      summary,
                      data.explanationLanguage,
                      pasteSummary,
                    ),
                  },
                ],
              },
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
      logOperationFailure("grammar-assessment.gemini", new Error("Operation failed"));
      return { status: "error", error: "Couldn't get a review right now — try again." };
    }

    if (res.status === 429) {
      return { status: "error", error: "AI quota exceeded, try again later." };
    }
    if (!res.ok) {
      logOperationFailure("grammar-assessment.gemini", new Error("Operation failed"));
      return { status: "error", error: "Couldn't get a review right now — try again." };
    }

    const body = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
      promptFeedback?: { blockReason?: string };
    };
    const text = body.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      const blockReason = body.promptFeedback?.blockReason ?? body.candidates?.[0]?.finishReason;
      logOperationFailure("grammar-assessment.gemini", new Error("Operation failed"));
      return { status: "error", error: "Couldn't get a review right now — try again." };
    }

    let parsed: z.infer<typeof assessmentSchema>;
    try {
      parsed = assessmentSchema.parse(JSON.parse(text));
    } catch (error) {
      logOperationFailure("grammar-assessment.gemini", new Error("Operation failed"));
      return { status: "error", error: "Couldn't get a review right now — try again." };
    }

    return { status: "ok", assessment: parsed.assessment };
  });
