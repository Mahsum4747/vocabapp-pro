import { useState } from "react";
import { Copy, FileUp } from "lucide-react";
import { toast } from "sonner";
import { KARTA_PROMPT, KARTA_RULE } from "@/lib/karta-prompt";
import { parseKartaJson } from "@/lib/karta-import";
import { parseCardText } from "@/lib/parse-cards";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/input";
import type { EditorCard } from "./card-editor";

/** Set-level fields a Karta JSON import carries alongside its cards. */
export type ImportMeta = { title: string; description: string; pair: "de-en" | "de-tr" };

export function ImportDialog({
  onImport,
}: {
  onImport: (cards: EditorCard[], meta?: ImportMeta) => void;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  function apply() {
    setErrors([]);
    if (/^\s*(\{|```)/.test(text)) {
      // Karta JSON: all-or-nothing. Any problem lists every error and adds
      // no cards at all.
      const result = parseKartaJson(text);
      if (!result.ok) {
        setErrors(result.errors);
        return;
      }
      const { cards, warnings, title, description, pair } = result.value;
      onImport(
        cards.map((card) => ({ id: crypto.randomUUID(), ...card })),
        { title, description, pair },
      );
      setOpen(false);
      toast.success(`${cards.length} cards added.`);
      for (const warning of warnings) toast.warning(warning);
      return;
    }
    const parsed = parseCardText(text);
    if (parsed.length === 0) {
      toast.error("No lines found.");
      return;
    }
    onImport(parsed.map((card) => ({ id: crypto.randomUUID(), ...card })));
    setOpen(false);
    toast.success(`${parsed.length} cards added.`);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" size="sm">
          <FileUp />
          Paste
        </Button>
      </DialogTrigger>
      <DialogContent title="Paste cards" className="space-y-4">
        <p className="text-sm text-muted">
          One card per line, separated by a tab or{" "}
          <span className="font-medium text-fg">term - definition</span> (dash or comma also
          work). Or paste Karta JSON.
        </p>
        <details className="rounded-card bg-surface-2 p-3 text-sm">
          <summary className="cursor-pointer font-medium text-fg">Karta JSON</summary>
          <p className="mt-2 text-muted">{KARTA_RULE}</p>
          <p className="mt-1 text-muted">
            Paste this prompt into your own AI chat, fill TOPIC / TARGET LANGUAGE / LEVEL, then
            paste the JSON it returns below.
          </p>
          <pre className="mt-2 max-h-48 overflow-auto rounded-card bg-surface p-3 font-mono text-xs whitespace-pre-wrap text-fg">
            {KARTA_PROMPT}
          </pre>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => {
              navigator.clipboard
                .writeText(KARTA_PROMPT)
                .then(() => toast.success("Prompt copied."))
                .catch(() => toast.error("Couldn't copy the prompt."));
            }}
          >
            <Copy />
            Copy prompt
          </Button>
        </details>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={"mitochondria\tThe cell's energy powerhouse\nubiquitous - present everywhere"}
          className="min-h-40 font-mono text-sm"
        />
        {errors.length > 0 ? (
          <ul className="list-disc space-y-1 pl-5 text-sm text-danger">
            {errors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        ) : null}
        <Button type="button" className="w-full" onClick={apply}>
          Add to cards
        </Button>
      </DialogContent>
    </Dialog>
  );
}
