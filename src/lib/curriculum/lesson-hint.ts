import type { LessonStep } from "./types";
/** Teaching-only structure cue; assessments never import this helper. */
export function lessonHint(step: LessonStep) {
  if (step.kind === "choice")
    return `Look for the taught answer beginning “${step.correctAnswer.split(" ")[0]}”. Compare its meaning with the example.`;
  if (step.kind !== "text") return "";
  const answer = step.acceptedAnswers[0];
  if (/^\d+\./.test(answer))
    return "Use digits in day.month order. Read the date field, not the number field.";
  if (/^\d+$/.test(answer)) return "Use digits only. Find the number in the requested field.";
  if (answer.includes(" "))
    return `Keep the supplied words in the taught order. Start with “${answer.split(" ")[0]}”.`;
  if (/verb|Verb|possession/.test(step.inputLabel))
    return `Match the subject to its taught verb form. It begins “${answer.slice(0, 2)}” and ends “${answer.at(-1)}”.`;
  return `Write one ${step.inputLabel === "Adjective" ? "adjective" : "word"}, beginning “${answer[0]}”. Use the detail requested, not the whole message.`;
}
