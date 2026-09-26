import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "./auth/middleware";
import type { WriteItCase } from "@/components/write-it-step";

/**
 * Optional, explicitly-triggered AI feedback on one WriteIt sentence —
 * Phase 3's first review-time Gemini call. The rule-based check in
 * write-it-step.tsx (does the sentence contain the exact inflected phrase)
 * is unchanged and still free/unlimited; this is a separate, budget-gated
 * layer a learner opts into with its own button, whether their rule-based
 * result was Correct or Almost.
 *
 * Not cached: unlike suggest-card.ts/example-suggestions.ts, the input here
 * is a free-text sentence a learner just typed, so there's no meaningful
 * cache key that would ever hit twice. Every click spends one aiActionsToday
 * action, same counter/message as the rest of P1.6 — no new budget system.
 *
 * The result is never persisted (no Firestore write of any kind) — purely a
 * transient response the client holds in local state until the page changes.
 */

const inputSchema = z.object({
  term: z.string().trim().min(1).max(200),
  correctForm: z.string().trim().min(1).max(100),
  caseHint: z.enum(["akkusativ", "dativ", "nominativ"]),
  /** What the learner actually typed — the only free-text field here. */
  learnerSentence: z.string().trim().min(1).max(500),
  /** `profile.explanationLanguage`, forwarded as-is — same "tr" switches
   *  English/Turkish convention as write-it-tr.ts's static copy. */
  explanationLanguage: z.string().trim().max(20).optional(),
});

const feedbackSchema = z.object({
  feedback: z.string().trim().min(1).max(600),
});

// Same model as suggest-card.ts / generate-set.ts / example-suggestions.ts.
const GEMINI_MODEL = "gemini-3.6-flash";

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    feedback: {
      type: "STRING",
      description:
        "One short sentence explaining exactly what's wrong with the learner's sentence, if " +
        "anything — which word or case they got wrong, and why. If already correct, a brief " +
        "confirmation. No general grammar lesson, stay focused on this specific mistake.",
    },
  },
  required: ["feedback"],
};

function caseLabel(caseHint: WriteItCase): string {
  return caseHint === "akkusativ" ? "Akkusativ" : caseHint === "dativ" ? "Dativ" : "Nominativ";
}

export function buildPrompt(data: z.infer<typeof inputSchema>): string {
  const responseLanguage = data.explanationLanguage === "tr" ? "Turkish" : "English";
  return [
    `A German learner is trying to use "${data.term}" in the ${caseLabel(data.caseHint)} form.`,
    `The correct form is: "${data.correctForm}".`,
    `The learner wrote this sentence: '${data.learnerSentence}'.`,
    "In one short sentence, explain exactly what's wrong with the learner's sentence (if " +
      "anything) — which word or case they got wrong, and why. If the sentence is already " +
      "correct, just confirm it briefly. Do not give a general grammar lesson, stay focused on " +
      "this specific mistake.",
    `Respond in ${responseLanguage}.`,
  ].join(" ");
}

/**
 * Explicitly triggered by the "Get AI feedback" button — never automatic,
 * never blocking the rule-based Correct/Almost result it sits alongside.
 */
export const getWriteItFeedback = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ context, data }) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "AI feedback isn't available in this environment." };
    }

    const budget = await (await import("./ai-budget.server")).spendAiAction(context.userId, "assist");
    if (!budget.ok) return { ok: false as const, error: budget.error };

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
            // Same relaxed thresholds as suggest-card.ts / generate-set.ts / example-suggestions.ts.
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
      return { ok: false as const, error: "Couldn't get feedback right now — try again." };
    }

    if (res.status === 429) {
      return { ok: false as const, error: "AI quota exceeded, try again later." };
    }
    if (!res.ok) {
      console.error("Gemini API error:", res.status, await res.text().catch(() => ""));
      return { ok: false as const, error: "Couldn't get feedback right now — try again." };
    }

    const body = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
      promptFeedback?: { blockReason?: string };
    };
    const text = body.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      const blockReason = body.promptFeedback?.blockReason ?? body.candidates?.[0]?.finishReason;
      console.error("Gemini returned no usable content:", blockReason, body.promptFeedback);
      return { ok: false as const, error: "Couldn't get feedback right now — try again." };
    }

    let parsed: z.infer<typeof feedbackSchema>;
    try {
      parsed = feedbackSchema.parse(JSON.parse(text));
    } catch (error) {
      console.error("Gemini returned unusable JSON:", error);
      return { ok: false as const, error: "Couldn't get feedback right now — try again." };
    }

    return { ok: true as const, feedback: parsed.feedback };
  });
