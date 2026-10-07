import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "./auth/middleware";
import { GRAMMAR_RULES, type GrammarRuleTopic } from "@/content/grammar-rules";
import { logOperationFailure } from "./diagnostics";

const inputSchema = z.object({
  topic: z.string().trim().min(1).max(80),
  count: z.number().int().min(3).max(8).default(5),
  focus: z.string().trim().max(500).optional(),
});

const itemSchema = z.object({
  id: z.string().trim().min(1).max(80),
  prompt: z.string().trim().min(1).max(500),
  options: z.array(z.string().trim().min(1).max(250)).length(3),
  correctAnswer: z.string().trim().min(1).max(250),
  explanation: z.string().trim().min(1).max(500),
});

const payloadSchema = z.object({
  title: z.string().trim().min(1).max(120),
  items: z.array(itemSchema).min(3).max(8),
});

export type PersonalGrammarPractice = z.infer<typeof payloadSchema>;

const GEMINI_MODEL = "gemini-3.6-flash";

function isRuleTopic(value: string): value is GrammarRuleTopic {
  return Object.prototype.hasOwnProperty.call(GRAMMAR_RULES, value);
}

export function buildPersonalGrammarPracticePrompt(data: z.infer<typeof inputSchema>): string {
  if (!isRuleTopic(data.topic)) throw new Error("Unknown canonical grammar topic");
  const rule = GRAMMAR_RULES[data.topic];
  return [
    "Create a small PERSONAL German grammar practice set for Karta.",
    "The canonical Karta rule below is the source of truth. Do not test anything outside it.",
    `Create exactly ${data.count} multiple-choice items.`,
    "Each item must have exactly 3 options and correctAnswer must exactly equal one option.",
    "Use short, natural contemporary German. Keep vocabulary simple enough that the grammar target, not obscure vocabulary, determines success.",
    "Vary the scenario and surface wording. Do not produce trivial duplicates.",
    "The explanation should teach why the answer is correct in one or two concise sentences.",
    "This is practice only. Never claim mastery, proficiency, certification or lesson completion.",
    data.focus ? `Learner focus: ${JSON.stringify(data.focus)}` : "Learner focus: none supplied.",
    "Canonical Karta rule:",
    JSON.stringify({
      title: rule.title,
      intro: rule.intro,
      table: rule.table ?? null,
      examples: rule.examples ?? [],
    }),
  ].join("\n");
}

export const generatePersonalGrammarPractice = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    if (!isRuleTopic(data.topic)) {
      return { ok: false as const, error: "This grammar topic is not in Karta's reviewed reference yet." };
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "AI grammar practice isn't available in this environment." };
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
            contents: [{ role: "user", parts: [{ text: buildPersonalGrammarPracticePrompt(data) }] }],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: {
                type: "OBJECT",
                properties: {
                  title: { type: "STRING" },
                  items: {
                    type: "ARRAY",
                    items: {
                      type: "OBJECT",
                      properties: {
                        id: { type: "STRING" },
                        prompt: { type: "STRING" },
                        options: { type: "ARRAY", items: { type: "STRING" } },
                        correctAnswer: { type: "STRING" },
                        explanation: { type: "STRING" },
                      },
                      required: ["id", "prompt", "options", "correctAnswer", "explanation"],
                    },
                  },
                },
                required: ["title", "items"],
              },
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
      logOperationFailure("grammar-practice.gemini", new Error("Operation failed"));
      return { ok: false as const, error: "Couldn't reach the AI service, try again." };
    }

    if (response.status === 429) return { ok: false as const, error: "AI quota exceeded, try again later." };
    if (!response.ok) {
      logOperationFailure("grammar-practice.gemini", new Error("Operation failed"));
      return { ok: false as const, error: "Couldn't generate grammar practice, try again." };
    }

    const body = (await response.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text = body.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return { ok: false as const, error: "Couldn't generate grammar practice, try again." };

    try {
      const parsed = payloadSchema.parse(JSON.parse(text));
      if (parsed.items.length !== data.count) {
        return { ok: false as const, error: "The AI returned an incomplete practice set. Try again." };
      }
      if (parsed.items.some((item) => !item.options.includes(item.correctAnswer))) {
        return { ok: false as const, error: "The AI returned an invalid practice set. Try again." };
      }
      return { ok: true as const, practice: parsed };
    } catch {
      logOperationFailure("grammar-practice.parse", new Error("Invalid AI practice"));
      return { ok: false as const, error: "Couldn't read the AI grammar practice, try again." };
    }
  });
