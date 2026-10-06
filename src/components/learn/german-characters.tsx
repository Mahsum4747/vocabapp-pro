import type { RefObject } from "react";
import { Button } from "@/components/ui/button";

/** Cursor/selection insertion only; the owning control keeps response state and privacy. */
export function GermanCharacters({
  input,
  value,
  onChange,
  disabled,
}: {
  input: RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  function insert(character: string) {
    const control = input.current;
    if (!control) return;
    const start = control.selectionStart ?? value.length;
    const end = control.selectionEnd ?? start;
    if (value.length - (end - start) + 1 > control.maxLength) return;
    onChange(value.slice(0, start) + character + value.slice(end));
    requestAnimationFrame(() => {
      control.focus();
      control.setSelectionRange(start + 1, start + 1);
    });
  }
  return (
    <div className="mt-2 flex gap-1" role="group" aria-label="German characters">
      {["ä", "ö", "ü", "ß"].map((character) => (
        <Button
          key={character}
          type="button"
          variant="ghost"
          className="min-h-11 min-w-11 px-3"
          disabled={disabled}
          aria-label={`Insert ${character}`}
          onPointerDown={(event) => event.preventDefault()}
          onClick={() => insert(character)}
        >
          {character}
        </Button>
      ))}
    </div>
  );
}
