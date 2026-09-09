import { SpeakButton } from "./speak-button";
import { cn } from "@/lib/utils";

export function FlashCard({
  term,
  definition,
  example,
  definition2,
  definitionLanguage2,
  imageUrl,
  termLanguage,
  flipped,
  onFlip,
}: {
  term: string;
  definition: string;
  example?: string | null;
  /** The set's second-language definition for this card, if it has one. */
  definition2?: string | null;
  definitionLanguage2?: string;
  imageUrl?: string | null;
  termLanguage?: string;
  flipped: boolean;
  onFlip: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onFlip}
      className={cn(
        "flex min-h-80 w-full flex-col justify-between gap-4 rounded-2xl p-8 text-left shadow-[var(--shadow-card)] transition-[background-color,color,transform] duration-200 ease-[var(--ease-smooth-out)] md:min-h-96",
        flipped ? "bg-primary text-primary-fg" : "bg-surface text-fg",
      )}
      aria-label={flipped ? "Show term" : "Show definition"}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-xs font-medium tracking-wide uppercase",
            flipped ? "text-primary-fg/70" : "text-muted",
          )}
        >
          {flipped ? "Definition" : "Term"}
        </span>
        <SpeakButton
          text={flipped ? definition : term}
          language={flipped ? undefined : termLanguage}
          className={
            flipped ? "text-primary-fg/70 hover:bg-primary-fg/10 hover:text-primary-fg" : undefined
          }
        />
      </div>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          className="mx-auto max-h-28 rounded-lg object-contain md:max-h-36"
        />
      ) : null}
      <div className="flex flex-col gap-3">
        <span
          className={cn(
            "text-balance",
            flipped
              ? "text-xl leading-snug whitespace-pre-line md:text-2xl"
              : "font-display text-3xl font-semibold tracking-tight md:text-4xl",
          )}
        >
          {flipped ? definition : term}
        </span>
        {/* Second definition sits right under the primary one — same side,
            same question, just a different language. Never leaks the term. */}
        {flipped && definition2 ? (
          <span className="flex items-start gap-1">
            <span className="text-base whitespace-pre-line text-primary-fg/85">
              {definition2}
            </span>
            <SpeakButton
              text={definition2}
              language={definitionLanguage2}
              label="Listen to the second definition"
              className="text-primary-fg/70 hover:bg-primary-fg/10 hover:text-primary-fg"
            />
          </span>
        ) : null}
        {/* The example is in the term language, so it belongs with the answer side. */}
        {flipped && example ? (
          <span className="flex items-start gap-1">
            <span className="text-sm italic text-primary-fg/70 md:text-base">{example}</span>
            <SpeakButton
              text={example}
              language={termLanguage}
              label="Listen to the example"
              className="text-primary-fg/70 hover:bg-primary-fg/10 hover:text-primary-fg"
            />
          </span>
        ) : null}
      </div>
      <span className={cn("text-sm", flipped ? "text-primary-fg/70" : "text-subtle")}>
        Tap to flip
      </span>
    </button>
  );
}
