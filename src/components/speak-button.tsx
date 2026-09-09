import { useEffect, useState } from "react";
import { Volume2 } from "lucide-react";
import { canSpeak, speak } from "@/lib/speech";
import { cn } from "@/lib/utils";

/**
 * Reads `text` aloud via the browser's Web Speech API. Renders nothing until
 * `canSpeak` resolves true — which requires both a mount (checking
 * `speechSynthesis` during SSR would always be false, causing a hydration
 * mismatch once the browser has it) and, for a recognized `language`, an
 * installed voice actually being found for it (voice lookup is async: the
 * list itself loads async in most browsers). A recognized language with no
 * voice at all (nor fallback — see speech.ts) keeps this hidden rather than
 * having it silently mispronounce the text in some unrelated voice.
 */
export function SpeakButton({
  text,
  language,
  className,
  label = "Listen",
}: {
  text: string;
  language?: string;
  className?: string;
  label?: string;
}) {
  const [available, setAvailable] = useState(false);
  const hasText = text.trim().length > 0;

  useEffect(() => {
    if (!hasText) return;
    let cancelled = false;
    void canSpeak(language).then((ok) => {
      if (!cancelled) setAvailable(ok);
    });
    return () => {
      cancelled = true;
    };
  }, [language, hasText]);

  if (!hasText || !available) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void speak(text, language);
      }}
      aria-label={label}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md p-1.5 text-muted hover:bg-surface-2 hover:text-fg",
        className,
      )}
    >
      <Volume2 className="size-4" />
    </button>
  );
}
