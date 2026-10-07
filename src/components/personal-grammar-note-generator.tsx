import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generatePersonalGrammarNote, type PersonalGrammarNote } from "@/lib/personal-grammar-note";
import { savePersonalGrammarNote } from "@/lib/personal-grammar-notes";
import {
  generatePersonalGrammarPractice,
  type PersonalGrammarPractice,
} from "@/lib/personal-grammar-practice";
import { recordGrammarRemediation } from "@/lib/grammar-remediation-api";
import { DIAGNOSTIC_TARGET_TOPICS } from "@/lib/grammar-remediation";
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
  const [practiceLoading, setPracticeLoading] = useState(false);
  const [practice, setPractice] = useState<PersonalGrammarPractice | null>(null);
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string>>({});
  const [savingNote, setSavingNote] = useState(false);
  const [savedNoteId, setSavedNoteId] = useState<string | null>(null);
  const [practiceSessionId, setPracticeSessionId] = useState<string | null>(null);
  const [practiceRecorded, setPracticeRecorded] = useState(false);
  const [recordingPractice, setRecordingPractice] = useState(false);

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
      setSavedNoteId(null);
    } catch {
      setError("Couldn't generate the grammar note, try again.");
    } finally {
      setLoading(false);
    }
  }

  async function generatePractice() {
    setPracticeLoading(true);
    setError(null);
    try {
      const result = await generatePersonalGrammarPractice({
        data: {
          topic,
          count: 5,
          ...(focus.trim() ? { focus: focus.trim() } : {}),
        },
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setPractice(result.practice);
      setPracticeAnswers({});
      setPracticeSessionId(crypto.randomUUID());
      setPracticeRecorded(false);
    } catch {
      setError("Couldn't generate grammar practice, try again.");
    } finally {
      setPracticeLoading(false);
    }
  }

  async function saveNote() {
    if (!note || savedNoteId) return;
    setSavingNote(true);
    setError(null);
    try {
      const operationId = crypto.randomUUID();
      const result = await savePersonalGrammarNote({
        data: {
          operationId,
          topic,
          explanationLanguage: language,
          note,
          ...(focus.trim() ? { focus: focus.trim() } : {}),
          ...(learnerExample.trim() ? { learnerExample: learnerExample.trim() } : {}),
        },
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSavedNoteId(result.id);
    } catch {
      setError("Couldn't save the grammar note, try again.");
    } finally {
      setSavingNote(false);
    }
  }

  async function finishPractice() {
    if (!practice || !practiceSessionId || practiceRecorded) return;
    if (Object.keys(practiceAnswers).length !== practice.items.length) return;
    setRecordingPractice(true);
    setError(null);
    try {
      const diagnosticTargetId = Object.entries(DIAGNOSTIC_TARGET_TOPICS).find(
        ([, mappedTopic]) => mappedTopic === topic,
      )?.[0];
      const correctCount = practice.items.filter(
        (item) => practiceAnswers[item.id] === item.correctAnswer,
      ).length;
      const result = await recordGrammarRemediation({
        data: {
          operationId: practiceSessionId,
          topic,
          ...(diagnosticTargetId ? { diagnosticTargetId } : {}),
          correctCount,
          totalCount: practice.items.length,
        },
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setPracticeRecorded(true);
    } catch {
      setError("Couldn't record this practice session. Your answers are still here.");
    } finally {
      setRecordingPractice(false);
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
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={savingNote || Boolean(savedNoteId)}
              onClick={() => void saveNote()}
            >
              {savingNote ? "Saving…" : savedNoteId ? "Saved to My Notes" : "Save to My Notes"}
            </Button>
            {savedNoteId ? (
              <span className="text-sm text-muted">
                Saved. You can reopen it from My Grammar Notes.
              </span>
            ) : null}
          </div>
          <div className="mt-5 border-t border-border pt-5">
            <p className="text-sm font-medium">Practice this exact topic</p>
            <p className="mt-1 text-sm text-muted">
              Generate fresh bounded questions from the same reviewed grammar rule. This practice does not create mastery or completion evidence.
            </p>
            <Button
              type="button"
              variant="secondary"
              className="mt-3"
              disabled={practiceLoading}
              onClick={() => void generatePractice()}
            >
              <Sparkles className="size-4" aria-hidden="true" />
              {practiceLoading ? "Creating practice…" : practice ? "Generate new practice" : "Generate 5 questions"}
            </Button>
          </div>
        </article>
      ) : null}

      {practice ? (
        <section className="mt-5 rounded-card bg-surface p-5 shadow-[var(--elevation-1)]" aria-label="Personal grammar practice">
          <h3 className="font-display text-xl font-medium">{practice.title}</h3>
          <p className="mt-2 text-sm text-muted">
            Personal practice only. Your answers here do not change course completion or assessment evidence.
          </p>
          <div className="mt-5 space-y-5">
            {practice.items.map((item, index) => {
              const selected = practiceAnswers[item.id];
              const checked = Boolean(selected);
              const correct = selected === item.correctAnswer;
              return (
                <fieldset key={item.id} className="rounded-control border border-border p-4">
                  <legend className="px-1 text-sm font-medium">
                    {index + 1}. {item.prompt}
                  </legend>
                  <div className="mt-3 space-y-2">
                    {item.options.map((option) => (
                      <label key={option} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-control bg-surface-2 px-3 py-2 text-sm">
                        <input
                          type="radio"
                          name={item.id}
                          value={option}
                          checked={selected === option}
                          onChange={() =>
                            setPracticeAnswers((previous) => ({ ...previous, [item.id]: option }))
                          }
                        />
                        <span lang="de">{option}</span>
                      </label>
                    ))}
                  </div>
                  {checked ? (
                    <p className={`mt-3 text-sm ${correct ? "text-primary-ink" : "text-danger"}`}>
                      {correct ? "Correct. " : `Not quite. Correct answer: ${item.correctAnswer}. `}
                      <span className="text-muted">{item.explanation}</span>
                    </p>
                  ) : null}
                </fieldset>
              );
            })}
          </div>
          {Object.keys(practiceAnswers).length === practice.items.length ? (
            <div className="mt-5 border-t border-border pt-4">
              <Button
                type="button"
                disabled={recordingPractice || practiceRecorded}
                onClick={() => void finishPractice()}
              >
                {recordingPractice
                  ? "Recording…"
                  : practiceRecorded
                    ? "Practice recorded"
                    : "Finish practice"}
              </Button>
              <p className="mt-2 text-xs text-muted">
                {practiceRecorded
                  ? "Karta will wait before suggesting a fresh recheck. This does not mark the grammar as mastered."
                  : "Finishing records only that you practised this topic, not mastery or course completion."}
              </p>
            </div>
          ) : null}
        </section>
      ) : null}
    </section>
  );
}
