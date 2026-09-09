import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { CardEditor, type EditorCard } from "@/components/card-editor";
import { EmptyState } from "@/components/empty-state";
import { GenerateDialog } from "@/components/generate-dialog";
import { ImportDialog } from "@/components/import-dialog";
import { OwnerGate } from "@/components/owner-gate";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SUBJECTS } from "@/lib/types";
import { useSet, useStudyStore } from "@/lib/store";

export const Route = createFileRoute("/sets/$setId/edit")({
  component: EditPage,
});

function EditPage() {
  const { setId } = Route.useParams();
  const studySet = useSet(setId);
  const navigate = useNavigate();
  const updateSetMeta = useStudyStore((s) => s.updateSetMeta);
  const replaceCards = useStudyStore((s) => s.replaceCards);
  const sets = useStudyStore((s) => s.sets);

  const [title, setTitle] = useState(studySet?.title ?? "");
  const [description, setDescription] = useState(studySet?.description ?? "");
  const [subject, setSubject] = useState(studySet?.subject ?? "General");
  const [isReference, setIsReference] = useState(studySet?.isReference ?? false);
  const [termLanguage, setTermLanguage] = useState(studySet?.termLanguage);
  const [definitionLanguage2Enabled, setDefinitionLanguage2Enabled] = useState(
    Boolean(studySet?.definitionLanguage2),
  );
  const [definitionLanguage2, setDefinitionLanguage2] = useState(
    studySet?.definitionLanguage2 ?? "",
  );
  const [folder, setFolder] = useState(studySet?.folder ?? "");
  const [cards, setCards] = useState<EditorCard[]>(
    studySet?.cards.map((c) => ({
      id: c.id,
      term: c.term,
      definition: c.definition,
      imageUrl: c.imageUrl,
      example: c.example,
      definition2: c.definition2,
    })) ?? [],
  );

  useEffect(() => {
    if (!studySet) return;
    setTitle(studySet.title);
    setDescription(studySet.description);
    setSubject(studySet.subject);
    setIsReference(studySet.isReference ?? false);
    setTermLanguage(studySet.termLanguage);
    setDefinitionLanguage2Enabled(Boolean(studySet.definitionLanguage2));
    setDefinitionLanguage2(studySet.definitionLanguage2 ?? "");
    setFolder(studySet.folder ?? "");
    setCards(
      studySet.cards.map((c) => ({
        id: c.id,
        term: c.term,
        definition: c.definition,
        imageUrl: c.imageUrl,
        example: c.example,
        definition2: c.definition2,
      })),
    );
  }, [studySet]);

  const folderOptions = Array.from(
    new Set(sets.map((s) => s.folder?.trim()).filter((f): f is string => !!f)),
  ).sort((a, b) => a.localeCompare(b));

  if (!studySet) {
    return (
      <AppShell>
        <EmptyState
          title="Set not found"
          description="There's no set to edit."
          action={
            <Button asChild>
              <Link to="/">Back to library</Link>
            </Button>
          }
        />
      </AppShell>
    );
  }

  function save() {
    const filled = cards.filter((c) => c.term.trim() && c.definition.trim());
    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (filled.length < 2) {
      toast.error("Add at least two cards.");
      return;
    }
    updateSetMeta(setId, {
      title,
      description,
      subject,
      isReference,
      termLanguage,
      // Sent even when cleared: an omitted key survives an update() as
      // whatever it already was, but an unchecked toggle means "no second
      // language", not "leave it alone".
      definitionLanguage2:
        definitionLanguage2Enabled && definitionLanguage2.trim()
          ? definitionLanguage2.trim()
          : "",
      folder: folder.trim(),
    });
    replaceCards(setId, filled);
    toast.success("Changes saved.");
    void navigate({ to: "/sets/$setId", params: { setId } });
  }

  return (
    <AppShell>
      <OwnerGate
        ownerId={studySet.ownerId}
        fallback={
          <EmptyState
            title="You can't edit this set"
            description="Only the set's owner can make changes."
            action={
              <Button asChild>
                <Link to="/sets/$setId" params={{ setId }}>
                  Back to set
                </Link>
              </Button>
            }
          />
        }
      >
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-medium text-muted">Edit</p>
          <h1 className="mt-2 font-display text-4xl font-medium tracking-tight">
            {studySet.title}
          </h1>
          <div className="mt-6 flex flex-wrap gap-2">
            <GenerateDialog
              definitionLanguage2={definitionLanguage2Enabled ? definitionLanguage2 : undefined}
              onGenerated={(generated) => {
                setTitle(generated.title);
                setDescription(generated.description ?? "");
                setSubject(generated.subject || subject);
                setTermLanguage(generated.termLanguage);
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
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                <Input
                  value={definitionLanguage2}
                  onChange={(e) => setDefinitionLanguage2(e.target.value)}
                  placeholder="e.g. Turkish"
                  aria-label="Second definition language"
                />
              ) : null}
            </div>
            <CardEditor
              cards={cards}
              onChange={setCards}
              termLanguage={termLanguage}
              definitionLanguage2={definitionLanguage2Enabled ? definitionLanguage2 : undefined}
            />
            <div className="sticky bottom-4 flex justify-end gap-2">
              <Button type="button" variant="ghost" asChild>
                <Link to="/sets/$setId" params={{ setId }}>
                  Cancel
                </Link>
              </Button>
              <Button type="submit" size="lg">
                Save
              </Button>
            </div>
          </form>
        </div>
      </OwnerGate>
    </AppShell>
  );
}
