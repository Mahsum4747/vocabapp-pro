import { useEffect, useState } from "react";
import { Volume2 } from "lucide-react";
import { speak, speechSupported } from "@/lib/speech";
import { cn } from "@/lib/utils";

/**
 * Reads `text` aloud via the browser's Web Speech API. Renders nothing until
 * after mount (checking `speechSynthesis` support during SSR would always be
 * false, causing a hydration mismatch once the browser has it) and nothing
 * at all when the browser doesn't support it.
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
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(speechSupported());
  }, []);

  if (!supported || !text.trim()) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        speak(text, language);
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
