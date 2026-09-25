import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { AuthGate } from "@/components/auth-gate";
import { CardEditor, type EditorCard } from "@/components/card-editor";
import { GenerateDialog } from "@/components/generate-dialog";
import { LanguageSelect } from "@/components/language-select";
import { NO_LANGUAGE, languageChoice, type LanguageChoice } from "@/lib/lang/choice";
import { ImportDialog, looksLikeKartaJson } from "@/components/import-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/input";
import { suggestFolder } from "@/lib/folder-suggest";
import { checkAiDraftCards } from "@/lib/ai-draft";
import { useStudyStore } from "@/lib/store";
import { toast } from "sonner";

type Search = { ai?: boolean };

export const Route = createFileRoute("/create")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    ai: search.ai === true || search.ai === "true",
  }),
  component: CreatePage,
});

function blankCards(): EditorCard[] {
  return [
    { id: crypto.randomUUID(), term: "", definition: "" },
    { id: crypto.randomUUID(), term: "", definition: "" },
    { id: crypto.randomUUID(), term: "", definition: "" },
  ];
}

function CreatePage() {
  const { ai } = Route.useSearch();
  const navigate = useNavigate();
  const addSet = useStudyStore((s) => s.addSet);
  const sets = useStudyStore((s) => s.sets);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isReference, setIsReference] = useState(false);
  const [termLang, setTermLang] = useState<LanguageChoice>(() => languageChoice("de"));
  const [defLang, setDefLang] = useState<LanguageChoice>(() => languageChoice("en"));
  const [definitionLanguage2Enabled, setDefinitionLanguage2Enabled] = useState(false);
  const [defLang2, setDefLang2] = useState<LanguageChoice>(NO_LANGUAGE);
  const [folder, setFolder] = useState("");
  const [cards, setCards] = useState<EditorCard[]>(blankCards);
  const [aiOpenSignal, setAiOpenSignal] = useState(0);

  const folderOptions = Array.from(
    new Set(sets.map((s) => s.folder?.trim()).filter((f): f is string => !!f)),
  ).sort((a, b) => a.localeCompare(b));

  // Only offered while the field is empty — a learner who already typed or
  // picked a folder isn't nagged about a different guess.
  const folderSuggestion = useMemo(
    () => (folder.trim() ? undefined : suggestFolder(title, folderOptions)),
    [title, folder, folderOptions],
  );

  useEffect(() => {
    if (ai) setAiOpenSignal((n) => n + 1);
  }, [ai]);

  /** Flag the AI-drafted noun cards that still lack gender/plural/example. */
  async function flagAiDrafts(list: EditorCard[]): Promise<Record<string, string[]>> {
    const drafts = list.filter((c) => c.aiGenerated && c.term.trim());
    if (drafts.length === 0) return {};
    const issues = await checkAiDraftCards({
      data: {
        cards: drafts.map((c) => ({
          id: c.id,
          term: c.term,
          example: c.example ?? null,
          enrichment: c.enrichment ?? undefined,
        })),
        termLanguage: termLang.text.trim() || undefined,
        termLangCode: termLang.code ?? undefined,
      },
    });
    setCards((prev) => prev.map((c) => (c.aiGenerated ? { ...c, missing: issues[c.id] } : c)));
    return issues;
  }

  async function save() {
    const filled = cards.filter((c) => c.term.trim() && c.definition.trim());
    if (!title.trim()) {
      toast.error("Write a title for the set.");
      return;
    }
    if (filled.length < 2) {
      toast.error("Add at least two cards.");
      return;
    }
    // AI drafts never land incomplete: incomplete nouns stay here, flagged.
    const issues = await flagAiDrafts(filled);
    const blocked = filled.filter((c) => c.aiGenerated && issues[c.id]);
    if (blocked.length > 0) {
      toast.error(
        `${blocked.length} generated noun card${blocked.length === 1 ? " needs" : "s need"} a gender, plural and example before saving. They're flagged below.`,
      );
      return;
    }
    let id: string;
    try {
      id = await addSet({
        aiGenerated: filled.some((c) => c.aiGenerated),
        title,
        description,
        subject: "General",
        cards: filled,
        isReference,
        termLanguage: termLang.text.trim() || undefined,
        termLangCode: termLang.code ?? undefined,
        defLangCode: defLang.code ?? undefined,
        definitionLanguage2:
          definitionLanguage2Enabled && defLang2.text.trim() ? defLang2.text.trim() : undefined,
        defLang2Code: definitionLanguage2Enabled ? (defLang2.code ?? undefined) : undefined,
        folder: folder.trim() || undefined,
      });
    } catch (error) {
      // The server refuses incomplete AI nouns too; show why instead of failing silently.
      toast.error(error instanceof Error ? error.message : "Couldn't save the set.");
      return;
    }
    toast.success("Set saved.");
    void navigate({ to: "/sets/$setId", params: { setId: id } });
  }

  return (
    <AuthGate>
      <AppShell>
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-medium text-muted">New set</p>
          <h1 className="mt-2 font-display text-4xl font-medium tracking-tight">
            Write your cards
          </h1>
          <p className="mt-2 text-sm text-muted">
            Add cards by hand, paste text, or auto-fill from a topic.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <GenerateDialog
              forceOpen={aiOpenSignal}
              termLang={termLang}
              onTermLangChange={setTermLang}
              defLang={defLang}
              onDefLangChange={setDefLang}
              definitionLanguage2={definitionLanguage2Enabled ? defLang2.text.trim() : undefined}
              onGenerated={(generated) => {
                setTitle(generated.title);
                setDescription(generated.description ?? "");
                // Same match A3 offers while typing, applied to the
                // generated title — still just a prefill of the editable
                // field, never a silent assignment.
                setFolder((current) =>
                  current.trim()
                    ? current
                    : (suggestFolder(generated.title, folderOptions) ?? current),
                );
                const drafted: EditorCard[] = generated.cards.map((card) => ({
                  id: crypto.randomUUID(),
                  term: card.term,
                  definition: card.definition,
                  example: card.example,
                  definition2: card.definition2,
                  aiGenerated: true,
                }));
                setCards(drafted);
                // Flag incomplete nouns straight away, before the user reaches Save.
                void flagAiDrafts(drafted).catch(() => {});
              }}
            />
            <ImportDialog
              onImport={(incoming, meta) => {
                // Only a real, term-filled row survives an import merge — a
                // still-blank template row (empty term, whatever its
                // definition) is never a card, so it must never combine
                // with the incoming ones into a bigger saved count.
                setCards((prev) => [...prev.filter((c) => c.term.trim()), ...incoming]);
                // Karta JSON also names the set and its language pair.
                // `meta.description` is the JSON's own typed "description"
                // field (or "" when it left that out) — never the raw JSON
                // text itself, and never a card's own gloss/definition.
                if (meta) {
                  if (!title.trim()) setTitle(meta.title);
                  if (!description.trim() && meta.description) setDescription(meta.description);
                  setTermLang(languageChoice("de"));
                  setDefLang(languageChoice(meta.pair === "de-tr" ? "tr" : "en"));
                }
              }}
            />
          </div>

          <form
            className="mt-8 space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. European capitals"
              />
            </div>
            <div className="space-y-1.5 rounded-card bg-surface-2 p-4">
              <Label htmlFor="folder">Folder</Label>
              {/* A placeholder alone disappears the moment someone starts typing —
                  this stays visible so the grouping feature is actually noticed. */}
              <p className="text-xs text-muted">
                Group related sets together, e.g. "German A2" — optional.
              </p>
              <Input
                id="folder"
                list="folder-options"
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                placeholder="e.g. German A2"
              />
              <datalist id="folder-options">
                {folderOptions.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
              {folderSuggestion ? (
                <button
                  type="button"
                  onClick={() => setFolder(folderSuggestion)}
                  className="text-xs text-primary-ink hover:underline"
                >
                  Use "{folderSuggestion}"?
                </button>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onPaste={(e) => {
                  // A learner pasting Karta JSON belongs in the "Paste"
                  // dialog above (which reads only its own typed
                  // "description" field), never straight into this box as
                  // raw text — refuse it here rather than silently
                  // accepting a JSON dump as the set's description.
                  const pasted = e.clipboardData.getData("text");
                  if (looksLikeKartaJson(pasted)) {
                    e.preventDefault();
                    toast.error(
                      "That looks like Karta JSON — use the Paste button above to import it, not this field.",
                    );
                  }
                }}
                placeholder="What is this set for?"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <LanguageSelect
                id="term-language"
                label="Term language"
                hint="The language the terms are written in — drives pronunciation."
                value={termLang}
                onChange={setTermLang}
                placeholder="e.g. German"
              />
              <LanguageSelect
                id="definition-language"
                label="Definition language"
                value={defLang}
                onChange={setDefLang}
                placeholder="e.g. English"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-fg select-none pointer-coarse:min-h-11">
              <input
                type="checkbox"
                checked={isReference}
                onChange={(e) => setIsReference(e.target.checked)}
                className="size-4 rounded border-border accent-primary-ink"
              />
              Reference set (no study modes, just a list)
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-fg select-none pointer-coarse:min-h-11">
                <input
                  type="checkbox"
                  checked={definitionLanguage2Enabled}
                  onChange={(e) => setDefinitionLanguage2Enabled(e.target.checked)}
                  className="size-4 rounded border-border accent-primary-ink"
                />
                Add a second definition language
              </label>
              {definitionLanguage2Enabled ? (
                <LanguageSelect
                  id="def-lang-2"
                  label="Second definition language"
                  value={defLang2}
                  onChange={setDefLang2}
                  placeholder="e.g. Turkish"
                />
              ) : null}
            </div>
            <CardEditor
              cards={cards}
              onChange={setCards}
              termLanguage={termLang.text.trim() || undefined}
              termLangCode={termLang.code ?? undefined}
              defLangCode={defLang.code ?? undefined}
              definitionLanguage2={definitionLanguage2Enabled ? defLang2.text.trim() : undefined}
              definitionLanguage2Code={
                definitionLanguage2Enabled ? (defLang2.code ?? undefined) : undefined
              }
            />
            <div className="sticky bottom-4 flex justify-end">
              <Button type="submit" size="lg">
                Save set
              </Button>
            </div>
          </form>
        </div>
      </AppShell>
    </AuthGate>
  );
}
