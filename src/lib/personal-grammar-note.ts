import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "./auth/middleware";
import { GRAMMAR_RULES, type GrammarRuleTopic } from "@/content/grammar-rules";
import { logOperationFailure } from "./diagnostics";

const inputSchema = z.object({
  topic: z.string().trim().min(1).max(80),
  explanationLanguage: z.enum(["English", "Turkish", "Kurdish"]).default("English"),
  focus: z.string().trim().max(500).optional(),
  learnerExample: z.string().trim().max(500).optional(),
});

const noteSchema = z.object({
  title: z.string().trim().min(1).max(140),
  explanation: z.string().trim().min(1).max(1600),
  keyPoints: z.array(z.string().trim().min(1).max(300)).min(2).max(6),
  examples: z.array(z.string().trim().min(1).max(300)).min(2).max(6),
  commonMistakes: z.array(z.string().trim().min(1).max(350)).max(5),
  memoryTip: z.string().trim().min(1).max(400),
});

export type PersonalGrammarNote = z.infer<typeof noteSchema>;

const GEMINI_MODEL = "gemini-3.6-flash";

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    explanation: { type: "STRING" },
    keyPoints: { type: "ARRAY", items: { type: "STRING" } },
    examples: { type: "ARRAY", items: { type: "STRING" } },
    commonMistakes: { type: "ARRAY", items: { type: "STRING" } },
    memoryTip: { type: "STRING" },
  },
  required: ["title", "explanation", "keyPoints", "examples", "commonMistakes", "memoryTip"],
};

function isRuleTopic(value: string): value is GrammarRuleTopic {
  return Object.prototype.hasOwnProperty.call(GRAMMAR_RULES, value);
}

export function buildPersonalGrammarNotePrompt(input: z.infer<typeof inputSchema>): string {
  if (!isRuleTopic(input.topic)) throw new Error("Unknown canonical grammar topic");
  const rule = GRAMMAR_RULES[input.topic];
  const canonical = {
    title: rule.title,
    intro: rule.intro,
    table: rule.table ?? null,
    examples: rule.examples ?? [],
  };

  return [
    "You are creating a PERSONAL study note for a German learner inside Karta.",
    "The canonical Karta rule below is the source of truth. Do not contradict it, broaden it beyond what it supports, or invent a mastery claim.",
    `Write the explanatory prose in ${input.explanationLanguage}. Keep German examples in German.`,
    "Use concise A1-friendly language unless the canonical topic itself is above A1.",
    "Explain meaning and use before terminology. If a technical term is useful, explain it plainly.",
    "Examples must be natural contemporary German and must illustrate only the supplied rule.",
    "Common mistakes should be plausible learner mistakes, not traps.",
    input.focus ? `Learner focus/question: ${JSON.stringify(input.focus)}` : "Learner focus/question: none supplied.",
    input.learnerExample
      ? `Learner sentence/error to explain carefully: ${JSON.stringify(input.learnerExample)}`
      : "Learner sentence/error: none supplied.",
    "If the learner sentence is already grammatical, say so in the explanation rather than fabricating an error.",
    "Canonical Karta rule:",
    JSON.stringify(canonical),
  ].join("\n");
}

export const generatePersonalGrammarNote = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    if (!isRuleTopic(data.topic)) {
      return { ok: false as const, error: "This grammar topic is not in Karta's reviewed reference yet." };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "AI grammar notes aren't available in this environment." };
    }

    const budget = await (await import("./ai-budget.server")).spendAiAction("assist");
    if (!budget.ok) return { ok: false as const, error: budget.error };

    let response: Response;
    try {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: buildPersonalGrammarNotePrompt(data) }] }],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: RESPONSE_SCHEMA,
            },
            safetySettings: [
              { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
              { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
              { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
              { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
            ],
          }),
        },
      );
    } catch {
      logOperationFailure("grammar-note.gemini", new Error("Operation failed"));
      return { ok: false as const, error: "Couldn't reach the AI service, try again." };
    }

    if (response.status === 429) {
      return { ok: false as const, error: "AI quota exceeded, try again later." };
    }
    if (!response.ok) {
      logOperationFailure("grammar-note.gemini", new Error("Operation failed"));
      return { ok: false as const, error: "Couldn't generate the grammar note, try again." };
    }

    const body = (await response.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
    };
    const text = body.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      logOperationFailure("grammar-note.gemini", new Error("Operation failed"));
      return { ok: false as const, error: "Couldn't generate the grammar note, try again." };
    }

    try {
      return { ok: true as const, note: noteSchema.parse(JSON.parse(text)) };
    } catch {
      logOperationFailure("grammar-note.parse", new Error("Invalid AI note"));
      return { ok: false as const, error: "Couldn't read the AI grammar note, try again." };
    }
  });
