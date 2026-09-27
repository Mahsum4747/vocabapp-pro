import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getPromptById } from "@/content/write-prompts";
import { authMiddleware } from "./auth/middleware";
import { ERROR_CATEGORIES, parseErrorTags, type FeedbackErrorTag } from "./write-feedback-types";

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
  learnerSentence: z.string().trim().min(1).max(2000),
  /** Static task-bank id (src/content/write-prompts.ts). Present only in the Task tab. */
  promptId: z.string().trim().min(1).max(100).optional(),
  setId: z.string().trim().min(1).max(200),
  setTitle: z.string().trim().min(1).max(200),
  /** `profile.explanationLanguage`, forwarded as-is — same convention as
   *  write-it-feedback.ts / write-it-tr.ts. */
  explanationLanguage: z.string().trim().max(20).optional(),
});

// `errorTags` is parsed fail-safe via `parseErrorTags` below, not through
// this schema — a malformed tag must never take the whole response down
// with it the way a strict z.array(...) parse would.
const feedbackSchema = z.object({
  feedback: z.string().trim().min(1).max(1600),
  errorTags: z.array(z.unknown()).optional(),
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
    errorTags: {
      type: "ARRAY",
      description:
        "Structured tags for each error found, using ONLY the given category values. Empty array " +
        "if there are no errors.",
      items: {
        type: "OBJECT",
        properties: {
          category: { type: "STRING", enum: [...ERROR_CATEGORIES] },
          severity: {
            type: "STRING",
            enum: ["minor", "major"],
            description:
              "'major' if the error breaks meaning or invalidates a Leitpunkt, 'minor' otherwise.",
          },
          excerpt: {
            type: "STRING",
            description: "Optional short quote from the learner's text pinpointing the error.",
          },
        },
        required: ["category", "severity"],
      },
    },
  },
  required: ["feedback", "errorTags"],
};

export function buildPrompt(data: z.infer<typeof inputSchema>): string {
  const responseLanguage = data.explanationLanguage === "tr" ? "Turkish" : "English";
  const task = data.promptId ? getPromptById(data.promptId) : undefined;
  if (!task) {
    return [
      `A German learner (level A1-A2) wrote this sentence: '${data.learnerSentence}'.`,
      "Point out any errors (articles, case, word order, spelling) in one short paragraph.",
      "If there are corrections, show the corrected sentence.",
      "If the sentence is already correct, say so briefly and encourage them.",
      "Keep it concise — this is for a beginner, don't overwhelm them.",
      `Respond in ${responseLanguage}.`,
      errorTagInstructions(),
    ].join(" ");
  }
  const strictness =
    task.level === "A1" || task.level === "A2"
      ? "Level-appropriate strictness: judge content and basic grammar only; don't nitpick style."
      : "Level-appropriate strictness: also check that greeting and closing formulas match the register, and that simple connectors (weil, deshalb, dass) are used correctly.";
  return [
    `A German learner (level ${task.level}) wrote a ${task.taskType} for this writing task.`,
    `Task: ${task.situationDe}`,
    `Required register: ${task.register}.`,
    "Content points (Leitpunkte):",
    ...task.leitpunkte.map((l, i) => `${i + 1}. ${l}`),
    `Learner's text: ${JSON.stringify(data.learnerSentence)}`,
    "Give one compact review: (1) for each numbered Leitpunkt say whether it is addressed (yes/no) with a one-line reason; " +
      `(2) check the register is used consistently (${task.register}; a mix of du and Sie is an error to point out); ` +
      "(3) the main language errors (articles, case, word order, spelling) with corrected examples.",
    strictness,
    "Be warm and concise, don't give a full grammar lesson.",
    `Respond in ${responseLanguage}.`,
    errorTagInstructions(),
  ].join("\n");
}

/**
 * Shared across both prompt branches (task-based and plain sentence): asks
 * for the structured `errorTags` array alongside the free-text feedback,
 * restricted to the literal category list so the model can't invent new
 * ones. This never changes what the user sees — `errorTags` is a separate
 * field in the same JSON response, parsed out before display.
 */
function errorTagInstructions(): string {
  return [
    `Also return "errorTags": an array using ONLY these category values: ${ERROR_CATEGORIES.join(", ")}.`,
    "Map: any missed Leitpunkt -> one 'missing_leitpunkt' tag (severity 'major'); du/Sie inconsistency or wrong " +
      "formality -> 'register'; wrong der/die/das -> 'article_gender'; wrong case ending (Akkusativ/Dativ/Genitiv) " +
      "-> 'case'; verb-second/verb-final word order errors -> 'verb_position'; wrong conjugation (bin/ist, " +
      "haben/sein, etc.) -> 'verb_conjugation'; wrong word/preposition choice -> 'word_choice'; spelling -> " +
      "'spelling'; any other word-order issue -> 'word_order_other'.",
    "severity: 'major' if it breaks meaning or invalidates a Leitpunkt, 'minor' otherwise. `excerpt` is optional, " +
      "only include it if a short quote helps pinpoint the error. Empty array if there are no errors.",
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

    // Fail-safe, not fail-loud: a malformed/missing errorTags block never
    // affects the free-text feedback the user sees — see write-feedback-types.ts.
    const errorTags: FeedbackErrorTag[] = parseErrorTags(parsed.errorTags);

    // Best-effort, same as write-it-feedback.ts: a logging failure shouldn't
    // take away feedback the learner already spent a budget action for.
    // cardId/term/caseHint/correctForm are deliberately omitted (not set to
    // null) — this row isn't about one specific card.
    try {
      const { getAdminFirestore } = await import("./firebase-admin.server");
      const db = getAdminFirestore();
      await db
        .collection("users")
        .doc(context.userId)
        .collection("aiFeedbackLog")
        .add({
          setId: data.setId,
          setTitle: data.setTitle,
          learnerSentence: data.learnerSentence,
          ...(data.promptId ? { promptId: data.promptId } : {}),
          feedback: parsed.feedback,
          ...(errorTags.length > 0 ? { errorTags } : {}),
          createdAt: Date.now(),
        });
    } catch (error) {
      console.error("Failed to log Write mode AI feedback:", error);
    }

    return { ok: true as const, feedback: parsed.feedback };
  });
