import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "../auth/middleware";
import { germanA1 } from "@/content/curriculum/german-a1";
import { diagnoseLessonResponse } from "./lesson-diagnostics";

const schema = z.object({
  lessonId: z.string().min(1).max(120),
  stepId: z.string().min(1).max(160),
  response: z.string().max(1000),
  operationId: z.string().uuid(),
  hintUsed: z.boolean().optional(),
  revealed: z.boolean().optional(),
  attemptNumber: z.number().int().min(1).max(20).optional(),
});

export const recordLessonDiagnostic = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => schema.parse(input))
  .handler(async ({ context, data }) => {
    const lesson = germanA1.lessons.find((candidate) => candidate.id === data.lessonId);
    const step = lesson?.steps.find((candidate) => candidate.id === data.stepId);
    if (!lesson || !step) return { recorded: false as const };

    const draft = diagnoseLessonResponse(lesson, step, data.response, {
      hintUsed: data.hintUsed,
      revealed: data.revealed,
      attemptNumber: data.attemptNumber,
    });
    if (!draft) return { recorded: false as const };

    const { getAdminFirestore } = await import("../firebase-admin.server");
    const db = getAdminFirestore();
    const ref = db
      .collection("users")
      .doc(context.userId)
      .collection("learningDiagnostics")
      .doc(data.operationId);

    await ref.create({
      ...draft,
      lessonId: lesson.id,
      stepId: step.id,
      context: "lesson_independent",
      contextDetail: draft.independent ? "independent" : "supported",
      occurredAt: Date.now(),
      schemaVersion: 1,
    });

    return { recorded: true as const };
  });
