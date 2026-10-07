import { ArrowLeft, BookOpenText } from "lucide-react";
import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { AuthGate } from "@/components/auth-gate";
import { EmptyState } from "@/components/empty-state";
import { GrammarRuleContent } from "@/components/grammar-rule-content";
import { Button } from "@/components/ui/button";
import { GRAMMAR_RULES } from "@/content/grammar-rules";
import {
  listPersonalGrammarNotes,
  type SavedPersonalGrammarNote,
} from "@/lib/personal-grammar-notes.server";

export const Route = createFileRoute("/grammar/notes")({
  component: PersonalGrammarNotesRoute,
});

function PersonalGrammarNotesRoute() {
  return (
    <AuthGate>
      <PersonalGrammarNotesPage />
    </AuthGate>
  );
}

function PersonalGrammarNotesPage() {
  const [notes, setNotes] = useState<SavedPersonalGrammarNote[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void listPersonalGrammarNotes({ data: { limit: 30 } })
      .then((result) => {
        if (!cancelled) setNotes(result.notes);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load your grammar notes.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppShell>
      <Link
        to="/grammar/rules"
        className="tap-target inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-fg"
      >
        <ArrowLeft className="size-4" />
        Grammar Reference
      </Link>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-primary-ink">Personal notebook</p>
          <h1 className="mt-1 font-display text-3xl font-medium tracking-tight">My Grammar Notes</h1>
          <p className="mt-2 max-w-2xl text-muted">
            AI-personalized explanations you chose to keep. The reviewed Karta rule remains the
            source of truth for every note.
          </p>
        </div>
        <Button asChild variant="secondary">
          <Link to="/grammar/rules">Create another note</Link>
        </Button>
      </div>

      {error ? <p className="mt-6 text-sm text-danger">{error}</p> : null}

      {notes === null && !error ? (
        <p className="mt-8 text-sm text-muted">Loading notes…</p>
      ) : notes?.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No saved grammar notes yet"
            description="Open a reviewed grammar rule, create a personal AI note, then save the ones that help."
            action={
              <Button asChild>
                <Link to="/grammar/rules">Open Grammar Reference</Link>
              </Button>
            }
          />
        </div>
      ) : (
        <div className="mt-section space-y-4">
          {notes?.map((note) => (
            <article key={note.id} className="rounded-card bg-surface p-5 shadow-[var(--elevation-1)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium tracking-wide text-muted uppercase">
                    {GRAMMAR_RULES[note.topic].title} · {note.explanationLanguage}
                  </p>
                  <h2 className="mt-1 font-display text-xl font-medium">{note.title}</h2>
                </div>
                <Link
                  to="/grammar/rules"
                  hash={note.topic}
                  className="tap-target inline-flex items-center gap-1 text-sm font-medium text-primary-ink"
                >
                  <BookOpenText className="size-4" />
                  Reviewed rule
                </Link>
              </div>

              {note.focus ? (
                <p className="mt-3 rounded-control bg-surface-2 px-3 py-2 text-sm">
                  <span className="font-medium">Your question:</span> {note.focus}
                </p>
              ) : null}

              <p className="mt-4 whitespace-pre-line leading-relaxed text-muted">{note.explanation}</p>

              <h3 className="mt-5 text-sm font-medium">Key points</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                {note.keyPoints.map((point) => <li key={point}>{point}</li>)}
              </ul>

              <h3 className="mt-5 text-sm font-medium">Examples</h3>
              <ul className="mt-2 space-y-1 text-sm" lang="de">
                {note.examples.map((example) => <li key={example}>{example}</li>)}
              </ul>

              <p className="mt-5 rounded-control bg-primary-soft px-3 py-2 text-sm text-primary-ink">
                {note.memoryTip}
              </p>

              <p className="mt-4 text-xs text-muted">
                Saved {new Date(note.createdAt).toLocaleDateString()}
              </p>
            </article>
          ))}
        </div>
      )}
    </AppShell>
  );
}
