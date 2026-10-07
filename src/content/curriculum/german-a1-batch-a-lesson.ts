import type { LessonStage, LessonStep } from "@/lib/curriculum/types";
// Authoring helpers for this original content batch, not a new exercise engine.
export const G = "DE.A1.GRAMMAR.",
  R = "DE.A1.READING.",
  W = "DE.A1.WRITING.",
  V = "DE.A1.VOCABULARY.";
export function lessonAuthor(unit: "04" | "05" | "06" | "07" | "08" | "09" | "10", lesson: number) {
  const base = (
    id: string,
    stage: LessonStage,
    label: string,
    prompt: string,
    skillIds: string[],
  ) => ({
    id: `U${unit}.L0${lesson}.${id}`,
    stage,
    label,
    prompt,
    skillIds,
    purpose:
      stage === "check"
        ? ("formative-check" as const)
        : ["discover", "understand"].includes(stage)
          ? ("teach" as const)
          : ("practice" as const),
  });
  return {
    explain: (
      id: string,
      label: string,
      prompt: string,
      example: string,
      explanation: string,
      skills: string[],
    ): LessonStep => ({
      ...base(id, id === "scene" ? "discover" : "understand", label, prompt, skills),
      kind: "explanation",
      example,
      explanation,
    }),
    choice: (
      id: string,
      stage: LessonStage,
      label: string,
      prompt: string,
      options: string[],
      correctAnswer: string,
      feedback: string,
      skills: string[],
      example?: string,
    ): LessonStep => ({
      ...base(id, stage, label, prompt, skills),
      kind: "choice",
      options,
      correctAnswer,
      feedback,
      ...(example ? { example } : {}),
    }),
    text: (
      id: string,
      stage: LessonStage,
      label: string,
      prompt: string,
      acceptedAnswers: string[],
      feedback: string,
      skills: string[],
      example?: string,
    ): LessonStep => ({
      ...base(id, stage, label, prompt, skills),
      kind: "text",
      answerLanguage: "de",
      inputLabel: "Your German response",
      acceptedAnswers,
      caseSensitive: true,
      feedback,
      ...(example ? { example } : {}),
    }),
  };
}
