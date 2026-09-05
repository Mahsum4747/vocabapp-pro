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
      toast.error("No lines found.");
      return;
    }
    onImport(parsed.map((card) => ({ id: crypto.randomUUID(), ...card })));
    setOpen(false);
    toast.success(`${parsed.length} cards added.`);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" size="sm">
          <FileUp />
          Paste
        </Button>
      </DialogTrigger>
      <DialogContent title="Paste cards" className="space-y-4">
        <p className="text-sm text-muted">
          One card per line, separated by a tab or{" "}
          <span className="font-medium text-fg">term - definition</span> (dash or comma also
          work).
        </p>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={"mitochondria\tThe cell's energy powerhouse\nubiquitous - present everywhere"}
          className="min-h-40 font-mono text-sm"
        />
        <Button type="button" className="w-full" onClick={apply}>
          Add to cards
        </Button>
      </DialogContent>
    </Dialog>
  );
}
