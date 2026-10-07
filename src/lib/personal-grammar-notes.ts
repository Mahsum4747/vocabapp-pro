import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "./auth/middleware";
import { GRAMMAR_RULES, type GrammarRuleTopic } from "@/content/grammar-rules";
import { personalGrammarNoteSchema, type PersonalGrammarNote } from "./personal-grammar-note";

const saveSchema = z.object({
  operationId: z.string().uuid(),
  topic: z.string().trim().min(1).max(80),
  explanationLanguage: z.enum(["English", "Turkish", "Kurdish"]),
  focus: z.string().trim().max(500).optional(),
  learnerExample: z.string().trim().max(500).optional(),
  note: personalGrammarNoteSchema,
});

const listSchema = z.object({
  limit: z.number().int().min(1).max(50).default(20),
});

function isRuleTopic(value: string): value is GrammarRuleTopic {
  return Object.prototype.hasOwnProperty.call(GRAMMAR_RULES, value);
}

export type SavedPersonalGrammarNote = PersonalGrammarNote & {
  id: string;
  topic: GrammarRuleTopic;
  explanationLanguage: "English" | "Turkish" | "Kurdish";
  focus?: string;
  learnerExample?: string;
  createdAt: number;
};

export const savePersonalGrammarNote = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => saveSchema.parse(input))
  .handler(async ({ context, data }) => {
    if (!isRuleTopic(data.topic)) {
      return { ok: false as const, error: "This grammar topic is not in Karta's reviewed reference." };
    }
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const createdAt = Date.now();
    const ref = db
      .collection("users")
      .doc(context.userId)
      .collection("personalGrammarNotes")
      .doc(data.operationId);

    const payload = {
      topic: data.topic,
      explanationLanguage: data.explanationLanguage,
      ...(data.focus ? { focus: data.focus } : {}),
      ...(data.learnerExample ? { learnerExample: data.learnerExample } : {}),
      ...data.note,
      createdAt,
      schemaVersion: 1,
    };

    try {
      await ref.create(payload);
    } catch (error) {
      const code =
        error && typeof error === "object" && "code" in error
          ? String((error as { code?: unknown }).code)
          : "";
      // Idempotent retry: an operationId represents exactly one saved note.
      if (code !== "6" && code !== "already-exists") throw error;
    }

    return { ok: true as const, id: data.operationId, createdAt };
  });

export const listPersonalGrammarNotes = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => listSchema.parse(input ?? {}))
  .handler(async ({ context, data }) => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const snapshot = await db
      .collection("users")
      .doc(context.userId)
      .collection("personalGrammarNotes")
      .orderBy("createdAt", "desc")
      .limit(data.limit)
      .get();

    const notes = snapshot.docs.flatMap((doc) => {
      const raw = doc.data();
      if (!isRuleTopic(String(raw.topic ?? ""))) return [];
      const parsed = personalGrammarNoteSchema.safeParse(raw);
      if (!parsed.success) return [];
      return [{
        id: doc.id,
        topic: raw.topic as GrammarRuleTopic,
        explanationLanguage:
          raw.explanationLanguage === "Turkish" || raw.explanationLanguage === "Kurdish"
            ? raw.explanationLanguage
            : "English",
        ...(typeof raw.focus === "string" ? { focus: raw.focus } : {}),
        ...(typeof raw.learnerExample === "string" ? { learnerExample: raw.learnerExample } : {}),
        createdAt: typeof raw.createdAt === "number" ? raw.createdAt : 0,
        ...parsed.data,
      } satisfies SavedPersonalGrammarNote];
    });

    return { ok: true as const, notes };
  });
