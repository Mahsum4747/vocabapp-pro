import type { LesenLevel } from "./german/lesen-types";

/**
 * The prompt a learner pastes into their OWN AI chat to get a free-topic
 * German reading-comprehension round as JSON — Lesen's version of
 * grammar-paste-prompt.ts (itself modeled on karta-prompt.ts). Karta's own
 * Gemini path is NOT involved: the app only validates and runs what comes
 * back (lesen-paste-import.ts). Shown verbatim on the Lesen Paste screen;
 * TOPIC is left for the learner to fill in (optional — an empty topic lets
 * the AI pick any level-appropriate everyday subject).
 *
 * Deliberately simpler than Grammar Paste: one fixed question count, no
 * question-count picker, "choice" shape only (plain multiple-choice
 * comprehension questions) — matching/sentence-insertion are B1/B2-only
 * exam-format exercises bundled from the real source data, not something
 * worth asking a general-purpose AI to improvise well.
 */

export const LESEN_PASTE_QUESTION_COUNT = 5;

/** Same en/tr/ku -> display-name mapping grammar-paste-prompt.ts's own
 *  `explanationLanguageName` uses, for the same reason. */
function explanationLanguageName(explanationLanguage: string | undefined): string {
  if (explanationLanguage === "tr") return "Turkish";
  if (explanationLanguage === "ku") return "Kurdish (Kurmanji)";
  return "English";
}

const LEVEL_GUIDANCE: Record<LesenLevel, string> = {
  A1: "very short (3-5 simple sentences), present tense, everyday vocabulary, no subordinate clauses",
  A2: "short (5-8 sentences), simple past or present, everyday topics, at most one simple subordinate clause per sentence",
  B1: "a few paragraphs, a mix of tenses, some subordinate clauses, everyday-to-semi-formal topics",
  B2: "several paragraphs, abstract or analytical content allowed, varied sentence structure including passive and extended participle constructions",
};

function lesenPastePromptHead(level: LesenLevel, questionCount: number): string {
  return `You write a German reading-comprehension passage for Karta, a language-learning app, at CEFR level ${level}.

Output ONLY valid JSON. No markdown. No commentary.

{
  "title": "a short title for the passage, in German",
  "text": "a reading passage in German, appropriate for level ${level}",
  "questions": [
    {
      "prompt": "a comprehension question about the passage, in German",
      "options": ["string", "string", "string", "string"],
      "correctIndex": 0,
      "explanation": "one short sentence on why the correct answer is right, or null"
    }
  ]
}

Rules:
- The passage must genuinely match CEFR level ${level}: ${LEVEL_GUIDANCE[level]}.
- Exactly ${questionCount} questions in the array. Not ${questionCount - 1}, not ${questionCount + 1}.
- Every question must test comprehension of the PASSAGE ITSELF — a fact, the
  main idea, or a detail actually stated in the text — never an isolated
  grammar point unrelated to the content.
- Each question must have exactly 4 "options", all different from each
  other, all plausible — no obviously fake or silly distractors.
- "correctIndex" is 0-based (0, 1, 2 or 3) and must point at the option that
  is actually supported by the text.
- If TOPIC below is given, write the passage about that topic. If TOPIC is
  empty, pick any everyday topic suitable for the level yourself.
- If TOPIC is given but is not something a reasonable reading passage can be
  written about, output exactly {"error": "why not"} instead of the schema
  above — never invent an unrelated passage to fill the shape.
`;
}

/**
 * The full prompt text, with the learner's own `profile.explanationLanguage`
 * filled into the language instruction line and `level` filled into both
 * the CEFR instruction and the fixed question count — everything else is
 * the approved template above, unchanged. TOPIC is left blank for the
 * learner to optionally fill in on the Lesen Paste screen.
 */
export function lesenPastePromptFor(level: LesenLevel, explanationLanguage: string | undefined): string {
  const languageName = explanationLanguageName(explanationLanguage);
  const questionCount = LESEN_PASTE_QUESTION_COUNT;
  return `${lesenPastePromptHead(level, questionCount)}- Write every question's explanation in ${languageName}. Keep the passage text, title, prompts and options in German (that's what's being tested), but explanations in ${languageName}.

TOPIC (optional — leave blank for any suitable level-appropriate topic): `;
}

export function lesenPasteRuleFor(level: LesenLevel): string {
  return `Karta reading-practice JSON: a short German passage at CEFR level ${level}, plus exactly ${LESEN_PASTE_QUESTION_COUNT} multiple-choice comprehension questions, 4 options each.`;
}
