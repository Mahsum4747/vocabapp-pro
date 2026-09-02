import { cn } from "@/lib/utils";

export function FlashCard({
  term,
  definition,
  flipped,
  onFlip,
}: {
  term: string;
  definition: string;
  flipped: boolean;
  onFlip: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onFlip}
      className={cn(
        "flex h-80 w-full flex-col justify-between rounded-2xl p-8 text-left shadow-[var(--shadow-card)] transition-[background-color,color,transform] duration-200 ease-[var(--ease-smooth-out)] md:h-96",
        flipped ? "bg-primary text-primary-fg" : "bg-surface text-fg",
      )}
      aria-label={flipped ? "Terimi göster" : "Tanımı göster"}
    >
      <span
        className={cn(
          "text-xs font-medium tracking-wide uppercase",
          flipped ? "text-primary-fg/70" : "text-muted",
        )}
      >
        {flipped ? "Tanım" : "Terim"}
      </span>
      <span
        className={cn(
          "text-balance",
          flipped
            ? "text-xl leading-snug md:text-2xl"
            : "font-display text-3xl font-medium tracking-tight md:text-4xl",
        )}
      >
        {flipped ? definition : term}
      </span>
      <span className={cn("text-sm", flipped ? "text-primary-fg/70" : "text-subtle")}>
        Çevirmek için dokun
      </span>
    </button>
  );
}
