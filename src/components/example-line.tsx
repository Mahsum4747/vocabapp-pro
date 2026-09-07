import { SpeakButton } from "./speak-button";
import { cn } from "@/lib/utils";

/**
 * A card's example sentence, styled so it reads as secondary to the
 * definition. It's written in the set's term language (not the definition
 * language), so its speaker button gets `termLanguage`. Renders nothing when
 * there's no example.
 */
export function ExampleLine({
  example,
  termLanguage,
  className,
}: {
  example?: string | null;
  termLanguage?: string;
  className?: string;
}) {
  if (!example?.trim()) return null;
  return (
    <p className={cn("flex items-start gap-1 text-sm text-subtle italic", className)}>
      <span className="whitespace-pre-line">{example}</span>
      <SpeakButton text={example} language={termLanguage} label="Listen to the example" />
    </p>
  );
}
