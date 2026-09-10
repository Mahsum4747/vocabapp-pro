import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { AuthGate } from "@/components/auth-gate";
import { CardEditor, type EditorCard } from "@/components/card-editor";
import { GenerateDialog } from "@/components/generate-dialog";
import { LanguageSelect } from "@/components/language-select";
import { NO_LANGUAGE, languageChoice, type LanguageChoice } from "@/lib/lang/choice";
import { ImportDialog } from "@/components/import-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/input";
import { SUBJECTS } from "@/lib/types";
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
  const [subject, setSubject] = useState("General");
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

  useEffect(() => {
    if (ai) setAiOpenSignal((n) => n + 1);
  }, [ai]);

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
    const id = await addSet({
      title,
      description,
      subject,
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
                setSubject(generated.subject || "General");
                setCards(
                  generated.cards.map((card) => ({
                    id: crypto.randomUUID(),
                    term: card.term,
                    definition: card.definition,
                    example: card.example,
                    definition2: card.definition2,
                  })),
                );
              }}
            />
            <ImportDialog
              onImport={(incoming) =>
                setCards((prev) => [...prev.filter((c) => c.term || c.definition), ...incoming])
              }
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
            <div className="space-y-1.5">
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this set for?"
              />
            </div>
            <div className="space-y-1.5">
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
            <div className="space-y-1.5">
              <Label>Subject</Label>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.map((name) => (
                  <Button
                    key={name}
                    type="button"
                    size="sm"
                    variant={subject === name ? "default" : "secondary"}
                    onClick={() => setSubject(name)}
                  >
                    {name}
                  </Button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-fg select-none">
              <input
                type="checkbox"
                checked={isReference}
                onChange={(e) => setIsReference(e.target.checked)}
                className="size-4 rounded border-border accent-primary"
              />
              Reference set (no study modes, just a list)
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-fg select-none">
                <input
                  type="checkbox"
                  checked={definitionLanguage2Enabled}
                  onChange={(e) => setDefinitionLanguage2Enabled(e.target.checked)}
                  className="size-4 rounded border-border accent-primary"
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
              definitionLanguage2={definitionLanguage2Enabled ? defLang2.text.trim() : undefined}
              topic={subject}
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
