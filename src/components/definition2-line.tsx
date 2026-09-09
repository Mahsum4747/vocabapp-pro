import { SpeakButton } from "./speak-button";
import { cn } from "@/lib/utils";

/**
 * A card's second-language definition, shown right under the primary one.
 * Unlike the example, it never leaks the answer (the term), so it's safe to
 * show alongside a definition-based prompt before anything is revealed.
 * Renders nothing when the card has no second definition.
 */
export function Definition2Line({
  definition2,
  definitionLanguage2,
  className,
}: {
  definition2?: string | null;
  definitionLanguage2?: string;
  className?: string;
}) {
  if (!definition2?.trim()) return null;
  return (
    <p className={cn("flex items-start gap-1 text-base text-muted", className)}>
      <span className="whitespace-pre-line">{definition2}</span>
      <SpeakButton
        text={definition2}
        language={definitionLanguage2}
        label="Listen to the second definition"
      />
    </p>
  );
}
