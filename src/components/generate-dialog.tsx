import { useEffect, useRef, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { generateStudySet, type GeneratedSet } from "@/lib/generate-set";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { LanguageSelect } from "./language-select";
import type { LanguageChoice } from "@/lib/lang/choice";

export function GenerateDialog({
  onGenerated,
  forceOpen = 0,
  termLang,
  onTermLangChange,
  defLang,
  onDefLangChange,
  definitionLanguage2,
}: {
  onGenerated: (set: GeneratedSet) => void;
  forceOpen?: number;
  /** The form owns the two languages, so choosing one here and choosing it on
   *  the form are the same choice — and the set is saved with the codes. */
  termLang: LanguageChoice;
  onTermLangChange: (choice: LanguageChoice) => void;
  defLang: LanguageChoice;
  onDefLangChange: (choice: LanguageChoice) => void;
  /** The set's second definition language, if the form's own toggle for it
   *  is on — forwarded as-is so generation fills `definition2` too. */
  definitionLanguage2?: string;
}) {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(12);
  const [loading, setLoading] = useState(false);
  // Flips on once generation has been running long enough that "Generating…"
  // alone would start to read as stuck, rather than just working.
  const [longWait, setLongWait] = useState(false);
  const longWaitTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (forceOpen > 0) setOpen(true);
  }, [forceOpen]);

  // Cancel a pending timer if the dialog unmounts mid-generation.
  useEffect(() => () => window.clearTimeout(longWaitTimer.current), []);

  async function run() {
    if (loading) return;
    if (topic.trim().length < 2) {
      toast.error("Enter a topic.");
      return;
    }
    if (!termLang.text.trim() || !defLang.text.trim()) {
      toast.error("Enter both languages.");
      return;
    }
    setLoading(true);
    setLongWait(false);
    longWaitTimer.current = window.setTimeout(() => setLongWait(true), 6000);
    try {
      const trimmedDefinitionLanguage2 = definitionLanguage2?.trim();
      const result = await generateStudySet({
        data: {
          topic: topic.trim(),
          count,
          termLanguage: termLang.text.trim(),
          definitionLanguage: defLang.text.trim(),
          ...(trimmedDefinitionLanguage2
            ? { definitionLanguage2: trimmedDefinitionLanguage2 }
            : {}),
        },
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      onGenerated(result.set);
      setOpen(false);
      toast.success("Set is ready, review the cards.");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      window.clearTimeout(longWaitTimer.current);
      setLoading(false);
      setLongWait(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          <Sparkles />
          Generate from topic
        </Button>
      </DialogTrigger>
      <DialogContent title="Generate a set from a topic" className="space-y-4">
        <p className="text-sm text-muted">
          Write a topic and the cards will be filled in for you. You can edit them before saving.
        </p>
        <div className="space-y-1.5">
          <Label htmlFor="topic">Topic</Label>
          <Input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Ottoman sultans, A2 verbs, CSS flexbox"
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter") void run();
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <LanguageSelect
            id="term-lang"
            label="Term language"
            value={termLang}
            onChange={onTermLangChange}
            disabled={loading}
            placeholder="e.g. German"
          />
          <LanguageSelect
            id="def-lang"
            label="Definition language"
            value={defLang}
            onChange={onDefLangChange}
            disabled={loading}
            placeholder="e.g. English"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="count">Number of cards · {count}</Label>
          <input
            id="count"
            type="range"
            min={6}
            max={50}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full accent-primary"
            disabled={loading}
          />
        </div>
        <Button type="button" className="w-full" onClick={() => void run()} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Generating…
            </>
          ) : (
            "Generate"
          )}
        </Button>
        {loading ? (
          <p className="text-center text-sm text-muted" role="status" aria-live="polite">
            {longWait ? "This can take a moment…" : "Creating your set…"}
          </p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
