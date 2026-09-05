import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { generateStudySet, type GeneratedSet } from "@/lib/generate-set";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const LANGS = [
  { id: "tr" as const, label: "Turkish" },
  { id: "en" as const, label: "English" },
  { id: "mixed" as const, label: "EN term / TR definition" },
];

export function GenerateDialog({
  onGenerated,
  forceOpen = 0,
}: {
  onGenerated: (set: GeneratedSet) => void;
  forceOpen?: number;
}) {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(12);
  const [language, setLanguage] = useState<(typeof LANGS)[number]["id"]>("tr");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (forceOpen > 0) setOpen(true);
  }, [forceOpen]);

  async function run() {
    if (topic.trim().length < 2) {
      toast.error("Enter a topic.");
      return;
    }
    setLoading(true);
    try {
      const result = await generateStudySet({
        data: { topic: topic.trim(), count, language },
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
      setLoading(false);
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
            onKeyDown={(e) => {
              if (e.key === "Enter") void run();
            }}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="count">Number of cards · {count}</Label>
          <input
            id="count"
            type="range"
            min={6}
            max={20}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {LANGS.map((lang) => (
            <Button
              key={lang.id}
              type="button"
              size="sm"
              variant={language === lang.id ? "default" : "secondary"}
              onClick={() => setLanguage(lang.id)}
            >
              {lang.label}
            </Button>
          ))}
        </div>
        <Button type="button" className="w-full" onClick={() => void run()} disabled={loading}>
          {loading ? "Generating…" : "Generate"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
