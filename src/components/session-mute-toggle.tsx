import { Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
import { DEFAULT_SOUND_SETTINGS } from "@/lib/sound";
import { useStudyStore } from "@/lib/store";

/**
 * Header mute for every study mode: silences the sound cues and the cards'
 * read-aloud buttons at once. It is the same `soundSettings.enabled` the
 * Account page edits, so the choice is saved to the user — but applied
 * locally first (`setSoundSettings` configures the player before the write),
 * so the very next cue is already silent. The per-card speak button stays
 * its own "read this card" control; mute just makes it quiet.
 */
export function SessionMuteToggle() {
  const settings = useStudyStore((s) => s.profile?.soundSettings) ?? DEFAULT_SOUND_SETTINGS;
  const setSoundSettings = useStudyStore((s) => s.setSoundSettings);
  const muted = !settings.enabled;
  return (
    <button
      type="button"
      onClick={() => {
        void setSoundSettings({ ...settings, enabled: muted }).catch(() =>
          toast.error("Couldn't save the sound setting."),
        );
      }}
      aria-label={muted ? "Unmute" : "Mute"}
      aria-pressed={muted}
      className="inline-flex size-11 shrink-0 items-center justify-center rounded-control text-muted transition-colors hover:bg-surface-2 hover:text-fg active:bg-surface-2"
    >
      {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
    </button>
  );
}
