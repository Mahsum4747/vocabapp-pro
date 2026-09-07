import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { AuthGate } from "@/components/auth-gate";
import { CardEditor, type EditorCard } from "@/components/card-editor";
import { GenerateDialog } from "@/components/generate-dialog";
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
  const [termLanguage, setTermLanguage] = useState<string | undefined>(undefined);
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
      termLanguage,
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
              onGenerated={(generated) => {
                setTitle(generated.title);
                setDescription(generated.description ?? "");
                setSubject(generated.subject || "General");
                setTermLanguage(generated.termLanguage);
                setCards(
                  generated.cards.map((card) => ({
                    id: crypto.randomUUID(),
                    term: card.term,
                    definition: card.definition,
                    example: card.example,
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
              <Input
                id="folder"
                list="folder-options"
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                placeholder="e.g. A1, İş Almancası (optional)"
              />
              <datalist id="folder-options">
                {folderOptions.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
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
            <CardEditor cards={cards} onChange={setCards} />
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
