import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/input";
import {
  DIRECTIONS,
  DIRECTION_LABELS,
  EXPLANATION_LANGUAGES,
  EXPLANATION_LANGUAGE_LABELS,
  isDirection,
  isExplanationLanguage,
  shouldPromptForPrefs,
  type LearningPrefs,
} from "@/lib/learning-prefs";
import { useStudyStore } from "@/lib/store";

/** The two learning preferences, as one form — used by the Account tab and the one-time prompt. */
function PrefsFields({
  value,
  onChange,
}: {
  value: LearningPrefs;
  onChange: (next: LearningPrefs) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label htmlFor="pref-direction">I want to</Label>
        <Select
          id="pref-direction"
          value={value.direction}
          onChange={(e) => isDirection(e.target.value) && onChange({ ...value, direction: e.target.value })}
        >
          {DIRECTIONS.map((d) => (
            <option key={d} value={d}>
              {DIRECTION_LABELS[d]}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="pref-explanations">Explanations in</Label>
        <Select
          id="pref-explanations"
          value={value.explanationLanguage}
          onChange={(e) =>
            isExplanationLanguage(e.target.value) &&
            onChange({ ...value, explanationLanguage: e.target.value })
          }
        >
          {EXPLANATION_LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {EXPLANATION_LANGUAGE_LABELS[l]}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}

/** Why the two fields exist, and the promise that nothing else is collected. */
export function LearningPrefsPrivacyNote() {
  return (
    <p className="text-xs text-muted">
      These two settings only decide which language your explanations are written in and which
      language you are learning, so we can show you the right content. We collect nothing else about
      you: no age, location, level or any other profile details.
    </p>
  );
}

/** Account tab section. */
export function LearningPrefsSection() {
  const profile = useStudyStore((s) => s.profile);
  const setLearningPrefs = useStudyStore((s) => s.setLearningPrefs);
  const [draft, setDraft] = useState<LearningPrefs | null>(null);
  const [saving, setSaving] = useState(false);
  if (!profile) return null;

  const saved: LearningPrefs = {
    explanationLanguage: profile.explanationLanguage,
    direction: profile.direction,
  };
  const value = draft ?? saved;
  const dirty = value.explanationLanguage !== saved.explanationLanguage || value.direction !== saved.direction;

  async function save() {
    setSaving(true);
    try {
      await setLearningPrefs(value);
      setDraft(null);
      toast.success("Saved.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-4 rounded-card bg-surface p-4 shadow-[var(--elevation-1)]">
      <h3 className="font-medium">Learning</h3>
      <PrefsFields value={value} onChange={setDraft} />
      <LearningPrefsPrivacyNote />
      <Button onClick={save} disabled={!dirty || saving}>
        {saving ? "Saving…" : "Save"}
      </Button>
    </section>
  );
}

/**
 * One-time prompt, shown on Home after the first study session while the
 * learner has never chosen. Saving or dismissing settles it for good.
 */
export function LearningPrefsPrompt() {
  const profile = useStudyStore((s) => s.profile);
  const setLearningPrefs = useStudyStore((s) => s.setLearningPrefs);
  const dismiss = useStudyStore((s) => s.dismissPrefsPrompt);
  const [draft, setDraft] = useState<LearningPrefs | null>(null);
  const [saving, setSaving] = useState(false);
  if (!profile || !shouldPromptForPrefs(profile)) return null;

  const value: LearningPrefs = draft ?? {
    explanationLanguage: profile.explanationLanguage,
    direction: profile.direction,
  };

  async function save() {
    setSaving(true);
    try {
      await setLearningPrefs(value);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't save.");
      setSaving(false);
    }
  }

  return (
    <section className="mt-3 space-y-4 rounded-card bg-surface p-card shadow-[var(--elevation-1)]">
      <h2 className="font-medium">Set up your learning</h2>
      <PrefsFields value={value} onChange={setDraft} />
      <LearningPrefsPrivacyNote />
      <div className="flex gap-2">
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
        <Button variant="ghost" onClick={() => void dismiss()} disabled={saving}>
          Not now
        </Button>
      </div>
    </section>
  );
}
