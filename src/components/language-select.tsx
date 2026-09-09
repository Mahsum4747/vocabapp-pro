import { LANGUAGES, normalizeLanguage } from "@/lib/lang/languages";
import type { LanguageChoice } from "@/lib/lang/choice";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

/**
 * Searchable language field.
 *
 * A native `<input list>` + `<datalist>`, the same pattern the folder field
 * already uses: it filters as you type, and typing something that isn't on
 * the list is the "Other" escape hatch rather than an error — that text is
 * kept and stored, just without a code behind it.
 */
export function LanguageSelect({
  id,
  label,
  hint,
  value,
  onChange,
  disabled,
  placeholder,
}: {
  id: string;
  label: string;
  hint?: string;
  value: LanguageChoice;
  onChange: (choice: LanguageChoice) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const listId = `${id}-options`;
  const isOther = value.text.trim().length > 0 && value.code === null;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
      <Input
        id={id}
        list={listId}
        value={value.text}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => {
          const text = e.target.value;
          // Resolve on every keystroke so picking "Deutsch" from the list — or
          // typing "de" — lands on the same code, while the text stays what
          // the user chose to see.
          onChange({ code: normalizeLanguage(text), text });
        }}
      />
      <datalist id={listId}>
        {LANGUAGES.map((language) => (
          <option key={language.code} value={language.label} label={language.nativeLabel} />
        ))}
      </datalist>
      {isOther ? (
        <p className="text-xs text-subtle">
          Not a language we know yet — saved as free text, so speech may not match it.
        </p>
      ) : null}
    </div>
  );
}
