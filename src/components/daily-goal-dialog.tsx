import { useState } from "react";
import { Check } from "lucide-react";
import { DAILY_GOAL_OPTIONS } from "@/lib/daily-goal";
import { useStudyStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "./ui/dialog";

/**
 * The daily goal picker.
 *
 * Four fixed choices rather than a free number: the goal is a promise to
 * yourself, and the useful decision is "a little / normal / a lot", not 17.
 */
export function DailyGoalDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const profile = useStudyStore((s) => s.profile);
  const setDailyGoal = useStudyStore((s) => s.setDailyGoal);
  const [saving, setSaving] = useState<number | null>(null);

  async function choose(goal: number) {
    setSaving(goal);
    try {
      await setDailyGoal(goal);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save the daily goal:", error);
    } finally {
      setSaving(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Daily goal" className="max-w-sm">
        <p className="mt-2 text-sm text-muted">
          How many different words do you want to work on each day?
        </p>
        <div className="mt-4 grid gap-2">
          {DAILY_GOAL_OPTIONS.map((goal) => {
            const selected = profile?.dailyGoal === goal;
            return (
              <button
                key={goal}
                type="button"
                disabled={saving !== null}
                onClick={() => void choose(goal)}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-3 text-left transition-colors",
                  selected ? "bg-primary text-primary-fg" : "bg-surface-2 hover:bg-border",
                  saving !== null && "opacity-60",
                )}
              >
                <span className="text-sm font-medium tabular-nums">{goal} words a day</span>
                {selected ? <Check className="size-4" /> : null}
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** The picker as a plain block, for the account page's settings tab. */
export function DailyGoalPicker() {
  const profile = useStudyStore((s) => s.profile);
  const setDailyGoal = useStudyStore((s) => s.setDailyGoal);
  const [saving, setSaving] = useState<number | null>(null);

  return (
    <div className="grid gap-2 sm:grid-cols-4">
      {DAILY_GOAL_OPTIONS.map((goal) => {
        const selected = profile?.dailyGoal === goal;
        return (
          <button
            key={goal}
            type="button"
            disabled={saving !== null}
            onClick={() => {
              setSaving(goal);
              void setDailyGoal(goal)
                .catch((error) => console.error("Failed to save the daily goal:", error))
                .finally(() => setSaving(null));
            }}
            className={cn(
              "rounded-xl px-4 py-3 text-center transition-colors",
              selected ? "bg-primary text-primary-fg" : "bg-surface-2 hover:bg-border",
              saving !== null && "opacity-60",
            )}
          >
            <span className="block font-display text-2xl font-medium tabular-nums">{goal}</span>
            <span className="text-xs opacity-75">words a day</span>
          </button>
        );
      })}
    </div>
  );
}
