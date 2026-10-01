/**
 * The prompt a learner pastes into their OWN AI chat to get a free-topic
 * German grammar practice round as JSON — Grammar Paste's version of
 * karta-prompt.ts's vocabulary-set prompt. Karta's own Gemini path is NOT
 * involved: the app only validates and runs what comes back
 * (grammar-paste-import.ts). Shown verbatim on the Grammar Paste screen;
 * TOPIC is left for the learner to fill in.
 */

/** The only question counts the picker on the Grammar Paste screen offers
 *  — kept small and fixed so the prompt/validator never have to handle an
 *  arbitrary number. 10 is the default, matching every other drill's
 *  `ROUND_SIZE`. */
export const GRAMMAR_PASTE_QUESTION_COUNTS = [10, 15, 20] as const;
export type GrammarPasteQuestionCount = (typeof GRAMMAR_PASTE_QUESTION_COUNTS)[number];
export const DEFAULT_GRAMMAR_PASTE_QUESTION_COUNT: GrammarPasteQuestionCount = 10;

export function grammarPasteRuleFor(questionCount: number): string {
  return `Karta grammar-practice JSON: a short rule explanation plus exactly ${questionCount} multiple-choice questions, 4 options each.`;
}

/** Same en/tr/ku -> display-name mapping grammar-assessment.ts's own
 *  `responseLanguageName` uses, for the same reason: `explanationLanguage`
 *  only ever holds one of those three codes, English is the safe fallback
 *  for anything else (unset, a future code this prompt doesn't know yet). */
function explanationLanguageName(explanationLanguage: string | undefined): string {
  if (explanationLanguage === "tr") return "Turkish";
  if (explanationLanguage === "ku") return "Kurdish (Kurmanji)";
  return "English";
}

function grammarPastePromptHead(questionCount: number): string {
  return `You write a German grammar practice round for Karta, a language-learning app.

Output ONLY valid JSON. No markdown. No commentary.

{
  "topic": "string — the TOPIC below, verbatim",
  "ruleExplanation": "1-3 short sentences explaining the rule for this topic in plain language",
  "questions": [
    {
      "prompt": "a real, natural German sentence or phrase with exactly one blank written as ___",
      "options": ["string", "string", "string", "string"],
      "correctIndex": 0,
      "explanation": "one short sentence on why the correct answer is right, or null"
    }
  ]
}

Rules:
- Exactly ${questionCount} questions in the array. Not ${questionCount - 1}, not ${questionCount + 1}.
- Each question's "prompt" must contain the blank marker ___ exactly once,
  inside a real, natural sentence or phrase — never an isolated word with
  no context.
- Each question must have exactly 4 "options", all different from each
  other, all real/plausible German words or forms for that blank — no
  obviously fake or nonsensical distractors.
- "correctIndex" is 0-based (0, 1, 2 or 3) and must point at the option in
  "options" that actually belongs in the blank.
- Every question must genuinely test TOPIC below, not unrelated grammar.
- Use a variety of different example sentences, contexts, and (where
  relevant to the topic) different valid connectors/structures — do not
  repeat the same pattern across all ${questionCount} questions.
- If TOPIC is not a real German grammar topic, or you cannot honestly
  write ${questionCount} correct questions for it, output exactly {"error": "why not"}
  instead of the schema above — never invent a fake topic to fill the
  shape.
`;
}

/**
 * The full prompt text, with the learner's own `profile.explanationLanguage`
 * (en/tr/ku) filled into the language instruction line right before TOPIC,
 * and `questionCount` (10/15/20, see GRAMMAR_PASTE_QUESTION_COUNTS) filled
 * into the exact-count rule — everything else is the fixed, approved
 * template above, unchanged.
 */
export function grammarPastePromptFor(
  explanationLanguage: string | undefined,
  questionCount: number = DEFAULT_GRAMMAR_PASTE_QUESTION_COUNT,
): string {
  const languageName = explanationLanguageName(explanationLanguage);
  return `${grammarPastePromptHead(questionCount)}- Write ruleExplanation and every question's explanation in ${languageName}. Keep prompt/options in German (that's what's being tested), but explanations in ${languageName}.

TOPIC: `;
}
