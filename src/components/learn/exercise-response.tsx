import { Input, Textarea } from "@/components/ui/input";
import type { LessonStep } from "@/lib/curriculum/types";

/** Response controls only; validation and transitions belong to the pure engine. */
export function ExerciseResponse({
  step,
  answer,
  disabled,
  incorrect,
  onRespond,
}: {
  step: LessonStep;
  answer: string;
  disabled: boolean;
  incorrect: boolean;
  onRespond: (value: string) => void;
}) {
  if (step.kind === "explanation") return null;
  if (step.kind === "choice")
    return (
      <fieldset disabled={disabled}>
        <legend className="sr-only">{step.prompt}</legend>
        <div className="space-y-2">
          {step.options.map((option) => (
            <label
              key={option}
              className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-control border px-4 py-3 ${answer === option ? "border-primary bg-primary-soft text-primary-ink" : "border-border bg-surface text-fg"}`}
            >
              <input
                type="radio"
                name={step.id}
                value={option}
                checked={answer === option}
                onChange={() => onRespond(option)}
                className="size-4 shrink-0 accent-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>
    );
  return (
    <div>
      <label htmlFor="lesson-answer" className="mb-2 block text-sm font-medium">
        {step.inputLabel}
      </label>
      {step.kind === "original" ? (
        <Textarea
          id="lesson-answer"
          lang="de"
          value={answer}
          onChange={(event) => onRespond(event.target.value)}
          maxLength={step.maxLength}
          disabled={disabled}
          aria-describedby="response-help lesson-feedback"
          autoComplete="off"
        />
      ) : (
        <Input
          id="lesson-answer"
          lang="de"
          value={answer}
          onChange={(event) => onRespond(event.target.value)}
          maxLength={160}
          disabled={disabled}
          aria-describedby="lesson-feedback"
          aria-invalid={incorrect}
          autoComplete="off"
          spellCheck={false}
          autoCapitalize="none"
        />
      )}
      {step.kind === "original" && (
        <p id="response-help" className="mt-2 text-sm text-muted">
          {answer.length}/{step.maxLength} characters · Unassessed practice
        </p>
      )}
    </div>
  );
}
