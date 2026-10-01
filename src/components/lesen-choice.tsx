import { Check, Info } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn, shuffle } from "@/lib/utils";

/**
 * Shared "choice" Lesen session — one passage, its own short list of
 * close-ended questions, tap to answer. Used by both grammar.lesen.tsx
 * (bundled A1-B2 content, every `kind: "choice"` passage) and
 * grammar.lesen-paste.tsx (a learner's own AI-generated passage, always
 * this shape — Lesen Paste never produces matching/sentence-insertion).
 * Pulled out as its own component so neither route re-implements the same
 * ~70 lines of question/option/explanation JSX.
 */
export interface LesenChoiceQuestionLike {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string | null;
}

export interface LesenChoicePassageLike {
  title: string;
  source: string;
  text: string;
  questions: LesenChoiceQuestionLike[];
}

export function LesenChoiceBoard({
  passage,
  onComplete,
}: {
  passage: LesenChoicePassageLike;
  onComplete: (correctCount: number, total: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const question = passage.questions[index]!;
  const revealed = selected !== null;

  // Bug fix: the raw `options` array (as the AI/source gave it) was being
  // rendered in its original order — an AI tends to put the correct answer
  // at index 0 far more often than chance, and nothing here ever shuffled
  // it, so a Lesen Paste round could come out "correct answer is always
  // the first option" every single question. Reshuffled once per question
  // (memoized on `index` — a fresh shuffle on every render would visibly
  // reorder the options out from under a learner mid-question, including
  // right after they've answered and are looking at the reveal).
  const { options: shuffledOptions, correctIndex: shuffledCorrectIndex } = useMemo(() => {
    const correctOption = question.options[question.correctIndex];
    const options = shuffle(question.options);
    return { options, correctIndex: options.indexOf(correctOption) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  function choose(optionIndex: number) {
    if (revealed) return;
    setSelected(optionIndex);
    if (optionIndex === shuffledCorrectIndex) setCorrectCount((n) => n + 1);
  }

  function next() {
    const isLast = index + 1 >= passage.questions.length;
    if (isLast) {
      onComplete(correctCount, passage.questions.length);
      return;
    }
    setSelected(null);
    setIndex((i) => i + 1);
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-card border border-border bg-surface p-5 shadow-[var(--elevation-1)]">
        <p className="text-xs font-medium text-subtle">
          {passage.title} · {passage.source}
        </p>
        <p className="mt-2 whitespace-pre-line font-serif text-sm leading-relaxed text-fg">{passage.text}</p>
      </div>

      <div className="mt-6 rounded-card border border-border bg-surface-2 p-5">
        <p className="text-xs font-medium text-subtle tabular-nums">
          Question {index + 1} / {passage.questions.length}
        </p>
        <p className="mt-1 font-sans text-lg font-semibold tracking-tight text-fg text-balance">{question.prompt}</p>
        <div className="mt-4 flex flex-col gap-2">
          {shuffledOptions.map((option, optionIndex) => {
            const isCorrectOption = optionIndex === shuffledCorrectIndex;
            const isChosen = selected === optionIndex;
            const isWrongPick = revealed && isChosen && !isCorrectOption;
            const isAnswer = revealed && isCorrectOption;
            const dim = revealed && !isChosen && !isCorrectOption;
            return (
              <button
                key={option}
                type="button"
                disabled={revealed}
                onClick={() => choose(optionIndex)}
                className={cn(
                  "w-full rounded-card border-2 bg-surface px-4 py-3 text-left text-sm font-medium text-fg shadow-[var(--elevation-1)] transition-[box-shadow,opacity,border-color] duration-[var(--duration-fast)] ease-[var(--ease-out)]",
                  isAnswer ? "border-success" : isWrongPick ? "border-danger" : "border-border",
                  !revealed && "hover:shadow-[var(--elevation-2)]",
                  dim && "opacity-30",
                )}
              >
                <span className="inline-flex items-center gap-1.5">
                  {option}
                  {isAnswer ? <Check className="size-4 shrink-0 text-success" aria-hidden="true" /> : null}
                </span>
              </button>
            );
          })}
        </div>
        {revealed ? (
          question.explanation ? (
            <p className="mt-3 flex items-start gap-1.5 text-sm text-subtle">
              <Info className="mt-0.5 size-4 shrink-0" />
              {question.explanation}
            </p>
          ) : null
        ) : null}
        {revealed ? (
          <Button type="button" className="mt-4 w-full" onClick={next}>
            Continue
          </Button>
        ) : null}
      </div>
    </div>
  );
}
