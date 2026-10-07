import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generatePersonalGrammarNote, type PersonalGrammarNote } from "@/lib/personal-grammar-note";
import type { GrammarRuleTopic } from "@/content/grammar-rules";

const LANGUAGES = ["English", "Turkish", "Kurdish"] as const;

export function PersonalGrammarNoteGenerator({ topic }: { topic: GrammarRuleTopic }) {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<(typeof LANGUAGES)[number]>("English");
  const [focus, setFocus] = useState("");
  const [learnerExample, setLearnerExample] = useState("");
  const [note, setNote] = useState<PersonalGrammarNote | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const result = await generatePersonalGrammarNote({
        data: {
          topic,
          explanationLanguage: language,
          ...(focus.trim() ? { focus: focus.trim() } : {}),
          ...(learnerExample.trim() ? { learnerExample: learnerExample.trim() } : {}),
        },
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setNote(result.note);
    } catch {
      setError("Couldn't generate the grammar note, try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <Button type="button" variant="secondary" className="mt-4" onClick={() => setOpen(true)}>
        <Sparkles className="size-4" aria-hidden="true" />
        Create personal AI note
      </Button>
    );
  }

  return (
    <section className="mt-4 rounded-control bg-surface-2 p-4" aria-label="Personal AI grammar note">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-medium">Personal AI note</p>
          <p className="mt-1 text-sm text-muted">
            Karta keeps the reviewed rule above as the source of truth. AI only personalizes the explanation.
          </p>
        </div>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Close
        </Button>
      </div>

      <label className="mt-4 block text-sm font-medium">
        Explain in
        <select
          value={language}
          onChange={(event) => setLanguage(event.target.value as (typeof LANGUAGES)[number])}
          className="mt-1 block min-h-11 w-full rounded-control border border-border bg-surface px-3 text-fg"
        >
          {LANGUAGES.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </label>

      <label className="mt-4 block text-sm font-medium">
        What confuses you? <span className="font-normal text-muted">(optional)</span>
        <textarea
          value={focus}
          onChange={(event) => setFocus(event.target.value)}
          maxLength={500}
          rows={2}
          placeholder="e.g. Why is it mir and not mich?"
          className="mt-1 block w-full rounded-control border border-border bg-surface px-3 py-2 text-fg"
        />
      </label>

      <label className="mt-4 block text-sm font-medium">
        My sentence or mistake <span className="font-normal text-muted">(optional)</span>
        <textarea
          value={learnerExample}
          onChange={(event) => setLearnerExample(event.target.value)}
          maxLength={500}
          rows={2}
          placeholder="Paste the sentence you want Karta to explain"
          className="mt-1 block w-full rounded-control border border-border bg-surface px-3 py-2 text-fg"
        />
      </label>

      <Button type="button" className="mt-4" disabled={loading} onClick={() => void generate()}>
        <Sparkles className="size-4" aria-hidden="true" />
        {loading ? "Creating note…" : note ? "Regenerate note" : "Generate note"}
      </Button>

      {error ? (
        <p className="mt-3 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}

      {note ? (
        <article className="mt-5 rounded-card bg-surface p-5 shadow-[var(--elevation-1)]">
          <h3 className="font-display text-xl font-medium">{note.title}</h3>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-muted">{note.explanation}</p>

          <h4 className="mt-5 font-medium">Key points</h4>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {note.keyPoints.map((point) => <li key={point}>{point}</li>)}
          </ul>

          <h4 className="mt-5 font-medium">Examples</h4>
          <ul className="mt-2 space-y-1 text-sm" lang="de">
            {note.examples.map((example) => <li key={example}>{example}</li>)}
          </ul>

          {note.commonMistakes.length ? (
            <>
              <h4 className="mt-5 font-medium">Common mistakes</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                {note.commonMistakes.map((mistake) => <li key={mistake}>{mistake}</li>)}
              </ul>
            </>
          ) : null}

          <p className="mt-5 rounded-control bg-primary-soft px-3 py-2 text-sm text-primary-ink">
            {note.memoryTip}
          </p>
        </article>
      ) : null}
    </section>
  );
}
