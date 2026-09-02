import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { generateStudySet, type GeneratedSet } from "@/lib/generate-set";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const LANGS = [
  { id: "tr" as const, label: "Türkçe" },
  { id: "en" as const, label: "English" },
  { id: "mixed" as const, label: "EN terim / TR tanım" },
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
      toast.error("Bir konu yaz.");
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
      toast.success("Set hazır, kartları gözden geçir.");
    } catch {
      toast.error("Bir şeyler ters gitti.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          <Sparkles />
          Konudan oluştur
        </Button>
      </DialogTrigger>
      <DialogContent title="Konudan set oluştur" className="space-y-4">
        <p className="text-sm text-muted">
          Bir konu yaz, kartlar senin için doldurulsun. Kaydetmeden önce düzenleyebilirsin.
        </p>
        <div className="space-y-1.5">
          <Label htmlFor="topic">Konu</Label>
          <Input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="ör. Osmanlı padişahları, A2 fiiller, CSS flexbox"
            onKeyDown={(e) => {
              if (e.key === "Enter") void run();
            }}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="count">Kart sayısı · {count}</Label>
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
          {loading ? "Hazırlanıyor…" : "Oluştur"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
