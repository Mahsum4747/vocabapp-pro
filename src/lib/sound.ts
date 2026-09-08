/**
 * The app's sounds, synthesised rather than shipped.
 *
 * Every cue here is one or two short sine tones, which the Web Audio API can
 * make from a few numbers — so there are no audio files to download, decode or
 * keep in sync with the bundle. The specs below are plain data and are tested
 * as data; the engine underneath them only turns numbers into oscillators.
 */

export type SoundEvent =
  | "cardFlip"
  | "correct"
  | "excellent"
  | "achievement"
  | "setCompleted"
  | "error"
  | "dailyGoalSuccess";

/**
 * One tone in a cue. `freqEnd` glides the pitch across the tone's life, which
 * is what makes a two-note chime out of a single oscillator.
 */
export type Tone = {
  freq: number;
  freqEnd?: number;
  /** Offset from the start of the cue, ms. */
  start: number;
  duration: number;
  /** Relative loudness within the cue, 0..1. Chords give each voice less. */
  gain: number;
};

export type SoundSpec = {
  /** Total length, ms — what a caller can assume the cue occupies. */
  duration: number;
  tones: Tone[];
};

export const SOUNDS: Record<SoundEvent, SoundSpec> = {
  /** A soft click under the card turning over. Quiet: it fires constantly. */
  cardFlip: {
    duration: 200,
    tones: [{ freq: 800, start: 0, duration: 200, gain: 0.35 }],
  },
  /** A short rising chime for a right answer. */
  correct: {
    duration: 300,
    tones: [{ freq: 1000, freqEnd: 1200, start: 0, duration: 300, gain: 0.6 }],
  },
  /** Brighter, two notes — for an answer that came easily. */
  excellent: {
    duration: 400,
    tones: [
      { freq: 1000, start: 0, duration: 200, gain: 0.55 },
      { freq: 1500, start: 180, duration: 220, gain: 0.55 },
    ],
  },
  /** A ding with a major third under it, so a badge sounds like an event. */
  achievement: {
    duration: 500,
    tones: [
      { freq: 880, start: 0, duration: 500, gain: 0.4 },
      { freq: 1108, start: 60, duration: 440, gain: 0.32 },
      { freq: 1320, start: 120, duration: 380, gain: 0.28 },
    ],
  },
  /** A rising chord for finishing a whole set — the longest cue in the app. */
  setCompleted: {
    duration: 800,
    tones: [
      { freq: 523, start: 0, duration: 800, gain: 0.34 },
      { freq: 659, start: 160, duration: 640, gain: 0.32 },
      { freq: 784, start: 320, duration: 480, gain: 0.3 },
      { freq: 1046, start: 480, duration: 320, gain: 0.28 },
    ],
  },
  /** Low and short. Not a buzzer — a wrong answer is normal, not a failure. */
  error: {
    duration: 200,
    tones: [{ freq: 400, start: 0, duration: 200, gain: 0.45 }],
  },
  /** The day's goal met. */
  dailyGoalSuccess: {
    duration: 500,
    tones: [
      { freq: 659, start: 0, duration: 250, gain: 0.45 },
      { freq: 880, start: 200, duration: 300, gain: 0.45 },
    ],
  },
};

export type SoundSettings = {
  enabled: boolean;
  /** 0..100, as the settings slider shows it. */
  volume: number;
};

export const DEFAULT_SOUND_SETTINGS: SoundSettings = { enabled: true, volume: 70 };

/**
 * Ceiling on the master gain.
 *
 * A raw gain of 1 on a sine tone is startlingly loud through headphones, so
 * "volume 100" means this, not unity.
 */
export const MAX_GAIN = 0.25;

export function readSoundSettings(stored: unknown): SoundSettings {
  const doc = (stored ?? {}) as Record<string, unknown>;
  const volume =
    typeof doc.volume === "number" && Number.isFinite(doc.volume)
      ? Math.min(100, Math.max(0, Math.round(doc.volume)))
      : DEFAULT_SOUND_SETTINGS.volume;
  return {
    enabled: typeof doc.enabled === "boolean" ? doc.enabled : DEFAULT_SOUND_SETTINGS.enabled,
    volume,
  };
}

/**
 * The master gain for these settings, or 0 for silence.
 *
 * Volume 0 is silence even when sound is on: a slider dragged to zero is a
 * mute, and playing an inaudible tone anyway would still wake the audio
 * hardware for nothing.
 */
export function gainFor(settings: SoundSettings): number {
  if (!settings.enabled) return 0;
  const volume = Number.isFinite(settings.volume) ? Math.min(100, Math.max(0, settings.volume)) : 0;
  return (volume / 100) * MAX_GAIN;
}

export function isAudible(settings: SoundSettings): boolean {
  return gainFor(settings) > 0;
}

const STORAGE_KEY = "karta.sound";

let settings: SoundSettings = DEFAULT_SOUND_SETTINGS;
let context: AudioContext | null = null;
let loadedFromStorage = false;

/**
 * The last known settings, read from this device once.
 *
 * The stored profile is the source of truth, but it arrives over the network
 * and a sound has to fire the instant a card is graded — including on the
 * first grade of a session, before the profile has loaded. A local mirror
 * means the very first cue already respects a muted preference.
 */
function currentSettings(): SoundSettings {
  if (!loadedFromStorage && typeof window !== "undefined") {
    loadedFromStorage = true;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) settings = readSoundSettings(JSON.parse(raw));
    } catch {
      // A blocked or corrupt localStorage is not worth failing over.
    }
  }
  return settings;
}

/** Point the player at the user's stored settings, and remember them locally. */
export function configureSound(next: SoundSettings): void {
  settings = readSoundSettings(next);
  loadedFromStorage = true;
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Private mode, or storage full. The in-memory value still applies.
  }
}

function audioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (context) return context;
  const Ctor =
    window.AudioContext ??
    (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  try {
    context = new Ctor();
  } catch {
    return null;
  }
  return context;
}

/**
 * Play one cue. Never throws and never blocks: sound is decoration, and a
 * browser that refuses to make any must not take the study loop down with it.
 *
 * Silent when the user has sound off or the volume at zero, which is also why
 * no AudioContext is created until the first audible cue — an unused context
 * is a background tab that never sleeps.
 */
export function playSound(event: SoundEvent): void {
  const active = currentSettings();
  const master = gainFor(active);
  if (master <= 0) return;

  const ctx = audioContext();
  if (!ctx) return;

  try {
    // Browsers start the context suspended until a user gesture; grading a
    // card is one, so this resolves on the first real cue.
    if (ctx.state === "suspended") void ctx.resume();

    const spec = SOUNDS[event];
    const now = ctx.currentTime;

    for (const tone of spec.tones) {
      const start = now + tone.start / 1000;
      const end = start + tone.duration / 1000;

      const oscillator = ctx.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(tone.freq, start);
      if (tone.freqEnd !== undefined) {
        oscillator.frequency.linearRampToValueAtTime(tone.freqEnd, end);
      }

      // A short attack and a decay to near-silence: a square-edged sine is a
      // click at both ends.
      const gain = ctx.createGain();
      const peak = master * tone.gain;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(peak, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, end);

      oscillator.connect(gain).connect(ctx.destination);
      oscillator.start(start);
      oscillator.stop(end + 0.02);
    }
  } catch {
    // Autoplay policy, a closed context, an exhausted node budget — all of
    // which mean "no sound", never "no review".
  }
}
