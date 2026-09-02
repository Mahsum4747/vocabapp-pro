import { useState } from "react";
import { FileUp } from "lucide-react";
import { toast } from "sonner";
import { parseCardText } from "@/lib/parse-cards";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/input";
import type { EditorCard } from "./card-editor";

export function ImportDialog({
  onImport,
}: {
  onImport: (cards: EditorCard[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  function apply() {
    const parsed = parseCardText(text);
    if (parsed.length === 0) {
      toast.error("Satır bulunamadı.");
      return;
    }
    onImport(parsed.map((card) => ({ id: crypto.randomUUID(), ...card })));
    setOpen(false);
    toast.success(`${parsed.length} kart eklendi.`);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" size="sm">
          <FileUp />
          Yapıştır
        </Button>
      </DialogTrigger>
      <DialogContent title="Kartları yapıştır" className="space-y-4">
        <p className="text-sm text-muted">
          Her satır bir kart. Quizlet dışa aktarımı gibi sekme ile, veya{" "}
          <span className="font-medium text-fg">terim - tanım</span> yaz.
        </p>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={"mitokondri\tHücrenin enerji santrali\nanyway - her neyse"}
          className="min-h-40 font-mono text-sm"
        />
        <Button type="button" className="w-full" onClick={apply}>
          Kartlara ekle
        </Button>
      </DialogContent>
    </Dialog>
  );
}
