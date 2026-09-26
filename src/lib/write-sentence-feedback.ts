import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "./auth/middleware";

/**
 * Free-writing AI feedback — Phase 3's second slice, sitting next to WriteIt
 * (write-it-feedback.ts) rather than replacing it. WriteIt checks ONE
 * inflected phrase against a fixed correct form; this mode has no correct
 * form at all — the learner writes any sentence using at least one of a few
 * suggested words, and Gemini reviews the whole thing (articles, case, word
 * order, spelling) instead of a single substring match.
 *
 * Same budget as every other Gemini call site: one action from the shared
 * project-wide pool (ai-budget.ts/ai-budget.server.ts), no per-user cap.
 * Same log destination as WriteIt, too — `users/{uid}/aiFeedbackLog`, the
 * exact collection getWriteItFeedback already writes to, not a new one.
 * `cardId`/`term`/`caseHint`/`correctForm` are simply omitted from the row
 * (see `WriteItFeedbackLogEntry`'s now-optional fields in
 * write-it-feedback.ts): a free-write sentence isn't about one specific
 * card. Account's "AI Feedback" tab groups by `setId`, which every row
 * still has, so these entries appear there automatically.
 */

const inputSchema = z.object({
  /** The learner's free-form sentence(s) — the textarea's own maxLength
   *  (200) is the same practical cap enforced here. */
  learnerSentence: z.string().trim().min(1).max(200),
  setId: z.string().trim().min(1).max(200),
  setTitle: z.string().trim().min(1).max(200),
  /** `profile.explanationLanguage`, forwarded as-is — same convention as
   *  write-it-feedback.ts / write-it-tr.ts. */
  explanationLanguage: z.string().trim().max(20).optional(),
});

const feedbackSchema = z.object({
  feedback: z.string().trim().min(1).max(800),
});

// Same model as every other Gemini call site in this codebase.
const GEMINI_MODEL = "gemini-3.6-flash";

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    feedback: {
      type: "STRING",
      description:
        "One short, concise paragraph reviewing an A1-A2 German learner's sentence: point out " +
        "any errors (articles, case, word order, spelling). Show the corrected sentence if there " +
        "are corrections. If it's already correct, say so briefly and encourage them. Beginner-" +
        "friendly — don't overwhelm with a full grammar lesson.",
    },
  },
  required: ["feedback"],
};

export function buildPrompt(data: z.infer<typeof inputSchema>): string {
  const responseLanguage = data.explanationLanguage === "tr" ? "Turkish" : "English";
  return [
    `A German learner (level A1-A2) wrote this sentence: '${data.learnerSentence}'.`,
    "Point out any errors (articles, case, word order, spelling) in one short paragraph.",
    "If there are corrections, show the corrected sentence.",
    "If the sentence is already correct, say so briefly and encourage them.",
    "Keep it concise — this is for a beginner, don't overwhelm them.",
    `Respond in ${responseLanguage}.`,
  ].join(" ");
}

/**
 * Explicitly triggered by the Write mode's "Check" button.
 */
export const getWriteSentenceFeedback = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ context, data }) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "AI feedback isn't available in this environment." };
    }

    const budget = await (await import("./ai-budget.server")).spendAiAction("assist");
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
            // Same relaxed thresholds as every other Gemini call site.
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

    // Best-effort, same as write-it-feedback.ts: a logging failure shouldn't
    // take away feedback the learner already spent a budget action for.
    // cardId/term/caseHint/correctForm are deliberately omitted (not set to
    // null) — this row isn't about one specific card.
    try {
      const { getAdminFirestore } = await import("./firebase-admin.server");
      const db = getAdminFirestore();
      await db.collection("users").doc(context.userId).collection("aiFeedbackLog").add({
        setId: data.setId,
        setTitle: data.setTitle,
        learnerSentence: data.learnerSentence,
        feedback: parsed.feedback,
        createdAt: Date.now(),
      });
    } catch (error) {
      console.error("Failed to log Write mode AI feedback:", error);
    }

    return { ok: true as const, feedback: parsed.feedback };
  });
