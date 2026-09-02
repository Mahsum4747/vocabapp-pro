import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  topic: z.string().trim().min(2).max(200),
  count: z.number().int().min(6).max(20),
  language: z.enum(["tr", "en", "mixed"]),
});

const cardSchema = z.object({
  term: z.string().min(1).max(200),
  definition: z.string().min(1).max(500),
});

const payloadSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(280).optional().default(""),
  subject: z.string().max(40).optional().default("Genel"),
  cards: z.array(cardSchema).min(4).max(20),
});

export type GeneratedSet = z.infer<typeof payloadSchema>;

function extractJson(text: string) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced?.[1] ?? text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("JSON bulunamadı");
  return JSON.parse(raw.slice(start, end + 1)) as unknown;
}

export const generateStudySet = createServerFn({ method: "POST" })
  .validator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "Yapay zekâ bu ortamda kullanılamıyor." };
    }

    const languageLine =
      data.language === "en"
        ? "Write terms and definitions in English."
        : data.language === "mixed"
          ? "Terms in English, definitions in Turkish."
          : "Write terms and definitions in Turkish.";

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.6,
        max_tokens: 2200,
        messages: [
          {
            role: "system",
            content:
              "You create concise flashcard study sets. Reply with JSON only, no markdown.",
          },
          {
            role: "user",
            content: [
              `Create ${data.count} high-quality flashcards about: ${data.topic}.`,
              languageLine,
              'JSON shape: {"title":"","description":"","subject":"Dil|Fen|Tarih|Coğrafya|Yazılım|Genel","cards":[{"term":"","definition":""}]}',
              "Each definition is one or two short sentences. No numbering in terms.",
            ].join("\n"),
          },
        ],
      }),
    });

    if (!res.ok) {
      return { ok: false as const, error: "Set oluşturulamadı, tekrar dene." };
    }

    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = body.choices?.[0]?.message?.content ?? "";
    try {
      const parsed = payloadSchema.parse(extractJson(text));
      return { ok: true as const, set: parsed };
    } catch {
      return { ok: false as const, error: "Yanıt okunamadı, tekrar dene." };
    }
  });
