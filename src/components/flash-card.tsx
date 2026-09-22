import { ArticleizedTerm } from "./articleized-term";
import { SpeakButton } from "./speak-button";
import { cn } from "@/lib/utils";
import { profileFor } from "@/lib/lang/profiles";
import type { LanguageCode } from "@/lib/lang/languages";
import type { CardEnrichment } from "@/lib/types";

export function FlashCard({
  term,
  definition,
  example,
  definition2,
  definitionLanguage2,
  imageUrl,
  termLanguage,
  enrichment,
  termLangCode,
  note,
  flipped,
  instant = false,
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
  /** This card's gender/plural, if any — shown as an article on the term
   *  ("der Tisch") only, never affecting `term` itself or what's spoken. */
  enrichment?: CardEnrichment | null;
  /** The set's resolved term-language code, gating whether `enrichment`
   *  renders as an article at all (German today; see profileFor). */
  termLangCode?: LanguageCode;
  /** The learner's own free-text memory aid, if any — most useful exactly
   *  when reviewing, so it's shown here too, not just in the editor. */
  note?: string | null;
  flipped: boolean;
  /** True when the last flip came from the keyboard: the face swap then skips
   *  its transition (a repeated, keyboard-initiated action is never animated).
   *  View-layer only — it does not change what is shown or graded. */
  instant?: boolean;
  onFlip: () => void;
}) {
  const profile = profileFor(termLangCode);
  return (
    <button
      type="button"
      onClick={onFlip}
      className={cn(
        "flex min-h-80 w-full flex-col justify-between gap-4 rounded-card p-8 text-left shadow-[var(--elevation-2)] active:opacity-90 md:min-h-96",
        // Colour/opacity transitions; a keyboard flip (instant) keeps only the press
        // feedback so nothing else animates. Opacity is listed so active:opacity-90
        // eases instead of snapping.
        instant
          ? "transition-[opacity] duration-[var(--duration-press)] ease-[var(--ease-out)]"
          : "transition-[background-color,color,opacity] duration-[var(--duration-fast)] ease-[var(--ease-out)]",
        "border border-border bg-surface text-fg",
      )}
      aria-label={flipped ? "Show term" : "Show definition"}
    >
      <div
        key={flipped ? "back" : "front"}
        data-motion={instant ? "instant" : undefined}
        className="card-face flex flex-1 flex-col justify-between gap-4"
      >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-wide text-muted uppercase">
          {flipped ? "Definition" : "Term"}
        </span>
        <SpeakButton text={flipped ? definition : term} language={flipped ? undefined : termLanguage} />
      </div>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          className="mx-auto max-h-28 rounded-control object-contain md:max-h-36"
        />
      ) : null}
      <div className="flex flex-col gap-3">
        <span
          className={cn(
            "text-balance",
            flipped
              ? "text-xl leading-snug whitespace-pre-line md:text-2xl"
              : "font-serif text-3xl font-semibold tracking-tight text-headword md:text-4xl",
          )}
        >
          {flipped ? (
            definition
          ) : (
            <ArticleizedTerm term={term} enrichment={enrichment} profile={profile} />
          )}
        </span>
        {/* Second definition sits right under the primary one — same side,
            same question, just a different language. Never leaks the term. */}
        {flipped && definition2 ? (
          <span className="flex items-start gap-1">
            <span className="text-base whitespace-pre-line text-muted">{definition2}</span>
            <SpeakButton text={definition2} language={definitionLanguage2} label="Listen to the second definition" />
          </span>
        ) : null}
        {/* The example is in the term language, so it belongs with the answer side. */}
        {flipped && example ? (
          <span className="flex items-start gap-1">
            <span className="text-sm italic text-muted md:text-base">{example}</span>
            <SpeakButton text={example} language={termLanguage} label="Listen to the example" />
          </span>
        ) : null}
        {/* Personal, never spoken (no SpeakButton) — it's a reminder to the
            learner, not language content. */}
        {flipped && note ? <span className="text-sm whitespace-pre-line text-muted">{note}</span> : null}
      </div>
      <span className="text-sm text-subtle">Tap to flip</span>
      </div>
    </button>
  );
}
