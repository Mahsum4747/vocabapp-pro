/**
 * The app's sound language, synthesised at runtime.
 *
 * The cues are meant to read as physical UI feedback — the click of a good
 * switch, a warm confirmation — not as game effects. Two things get them
 * there, and neither needs an audio file or a library:
 *
 *   - every cue is built from VOICES with a real amplitude envelope, so a
 *     sound starts and stops the way a struck or plucked thing does instead of
 *     switching on;
 *   - tonal voices are quiet, low-passed and pitched in a single scale, so
 *     they sit together rather than competing, and nothing is bright enough
 *     to feel like a notification.
 *
 * The specs below are plain data, and are tested as data. The engine under
 * them only turns numbers into nodes.
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
 * An amplitude envelope, in milliseconds except `sustain`, which is the
 * fraction of the peak the voice holds at.
 *
 * This is what stops a tone sounding like a beep: the attack rounds the
 * onset, and the release lets it decay rather than cut.
 */
export type Envelope = {
  attack: number;
  decay: number;
  /** 0..1 of peak. */
  sustain: number;
  release: number;
};

/** One tonal layer of a cue. */
export type Voice = {
  type: OscillatorType;
  freq: number;
  /** Glides to this pitch across the voice's life, when set. */
  freqEnd?: number;
  /** Offset from the start of the cue, ms. */
  start: number;
  duration: number;
  /** Peak loudness within the cue, 0..1, before the master gain. */
  gain: number;
  envelope: Envelope;
  /** Gentle low-pass, Hz. Every voice has one — nothing here is meant to be bright. */
  lowpass: number;
  /** Cents of detune, for the slight thickness two near-identical voices give. */
  detune?: number;
};

/**
 * A filtered noise burst: the transient that makes a click feel like contact
 * with something rather than a short tone.
 */
export type Transient = {
  start: number;
  duration: number;
  gain: number;
  /** Band-pass centre, Hz. Low enough to read as a soft tick, not a hiss. */
  band: number;
  q: number;
};

export type SoundSpec = {
  /** Total length, ms — what a caller can assume the cue occupies. */
  duration: number;
  voices: Voice[];
  transients?: Transient[];
};

/**
 * Envelope presets, so the cues stay in one family.
 *
 * `tap` is almost all attack and release — a physical tick. `warm` opens
 * softly and lets go slowly, which is what makes a confirmation feel like
 * approval rather than an alert.
 */
const TAP: Envelope = { attack: 4, decay: 24, sustain: 0.25, release: 60 };
const WARM: Envelope = { attack: 18, decay: 70, sustain: 0.5, release: 120 };
const SOFT: Envelope = { attack: 30, decay: 90, sustain: 0.45, release: 180 };
const BLOOM: Envelope = { attack: 45, decay: 120, sustain: 0.4, release: 240 };

/**
 * One scale, used everywhere: F major around the fourth and fifth octaves.
 *
 * Every cue draws from it, so two sounds landing near each other are always
 * consonant — which is most of what separates a considered sound language
 * from a set of beeps.
 */
const F3 = 174.61;
const C4 = 261.63;
const F4 = 349.23;
const A4 = 440.0;
const C5 = 523.25;
const D5 = 587.33;
const F5 = 698.46;
const A5 = 880.0;

export const SOUNDS: Record<SoundEvent, SoundSpec> = {
  /**
   * A tactile tick under the card turning over. Mostly transient, with just
   * enough low body to feel like weight. It fires on every single card, so it
   * is the quietest thing in the app.
   */
  cardFlip: {
    duration: 120,
    voices: [
      {
        type: "triangle",
        freq: F4,
        freqEnd: C4,
        start: 6,
        duration: 100,
        gain: 0.16,
        envelope: TAP,
        lowpass: 1600,
      },
    ],
    transients: [{ start: 0, duration: 26, gain: 0.1, band: 1400, q: 1.1 }],
  },

  /**
   * Warm confirmation: a fundamental that lifts a whole tone, with a quiet
   * octave above it. The movement is what says "yes" — no bright top end
   * needed.
   */
  correct: {
    duration: 220,
    voices: [
      {
        type: "sine",
        freq: C5,
        freqEnd: D5,
        start: 0,
        duration: 220,
        gain: 0.3,
        envelope: WARM,
        lowpass: 2600,
      },
      {
        type: "triangle",
        freq: C4,
        start: 0,
        duration: 200,
        gain: 0.1,
        envelope: WARM,
        lowpass: 1400,
      },
    ],
    transients: [{ start: 0, duration: 18, gain: 0.05, band: 1100, q: 1.4 }],
  },

  /**
   * The same gesture, resolved a third higher and held a little longer. Read
   * as "that was easy" rather than as a bigger reward.
   */
  excellent: {
    duration: 320,
    voices: [
      {
        type: "sine",
        freq: F5,
        start: 0,
        duration: 200,
        gain: 0.26,
        envelope: SOFT,
        lowpass: 2800,
      },
      {
        type: "sine",
        freq: A5,
        start: 90,
        duration: 230,
        gain: 0.2,
        envelope: SOFT,
        lowpass: 3000,
      },
      {
        type: "triangle",
        freq: F4,
        start: 0,
        duration: 300,
        gain: 0.09,
        envelope: SOFT,
        lowpass: 1500,
      },
    ],
  },

  /**
   * The badge signature: an F major triad voiced from the bottom up, each note
   * entering under the last. Deliberately no top octave — brightness is what
   * would make it sound like a slot machine.
   */
  achievement: {
    duration: 460,
    voices: [
      {
        type: "sine",
        freq: F4,
        start: 0,
        duration: 420,
        gain: 0.22,
        envelope: BLOOM,
        lowpass: 2200,
      },
      {
        type: "sine",
        freq: A4,
        start: 70,
        duration: 380,
        gain: 0.18,
        envelope: BLOOM,
        lowpass: 2200,
      },
      {
        type: "sine",
        freq: C5,
        start: 140,
        duration: 320,
        gain: 0.16,
        envelope: BLOOM,
        lowpass: 2400,
      },
      {
        type: "triangle",
        freq: F3,
        start: 0,
        duration: 440,
        gain: 0.08,
        envelope: BLOOM,
        lowpass: 900,
      },
    ],
  },

  /**
   * The one real celebration: the same triad, arriving in sequence and
   * resolving onto the octave. Rising and settled — not explosive.
   */
  setCompleted: {
    duration: 640,
    voices: [
      {
        type: "sine",
        freq: F4,
        start: 0,
        duration: 300,
        gain: 0.2,
        envelope: SOFT,
        lowpass: 2200,
      },
      {
        type: "sine",
        freq: A4,
        start: 110,
        duration: 300,
        gain: 0.18,
        envelope: SOFT,
        lowpass: 2200,
      },
      {
        type: "sine",
        freq: C5,
        start: 220,
        duration: 340,
        gain: 0.17,
        envelope: SOFT,
        lowpass: 2400,
      },
      {
        type: "sine",
        freq: F5,
        start: 330,
        duration: 310,
        gain: 0.15,
        envelope: BLOOM,
        lowpass: 2600,
      },
      {
        type: "triangle",
        freq: F3,
        start: 0,
        duration: 620,
        gain: 0.08,
        envelope: BLOOM,
        lowpass: 800,
      },
    ],
  },

  /**
   * Not a buzzer. A muted low knock that falls slightly — the sound of
   * something not quite landing. Getting a card wrong is the normal cost of
   * learning and must not feel like a penalty.
   */
  error: {
    duration: 160,
    voices: [
      {
        type: "sine",
        freq: 196,
        freqEnd: 164.81,
        start: 0,
        duration: 160,
        gain: 0.22,
        envelope: { attack: 10, decay: 50, sustain: 0.3, release: 90 },
        lowpass: 700,
      },
    ],
    transients: [{ start: 0, duration: 20, gain: 0.05, band: 500, q: 0.9 }],
  },

  /**
   * The day's goal: a warm perfect fifth, lower and rounder than the badge
   * cue so the two are never mistaken for one another.
   */
  dailyGoalSuccess: {
    duration: 420,
    voices: [
      {
        type: "sine",
        freq: C4,
        start: 0,
        duration: 400,
        gain: 0.22,
        envelope: BLOOM,
        lowpass: 1800,
      },
      {
        type: "sine",
        freq: A4,
        start: 120,
        duration: 300,
        gain: 0.18,
        envelope: BLOOM,
        lowpass: 2000,
      },
      {
        type: "triangle",
        freq: F4,
        start: 60,
        duration: 340,
        gain: 0.09,
        envelope: BLOOM,
        lowpass: 1200,
        detune: -6,
      },
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
 * Deliberately low: these cues should sit under the room, not over it. "Volume
 * 100" means this, not unity — a raw sine at 1.0 through headphones is a
 * shock, and a study app that startles you has failed at its one job.
 */
export const MAX_GAIN = 0.18;

/** Above this, a tone starts to read as piercing rather than warm. */
export const MAX_FREQUENCY = 1200;

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
 * mute, and playing an inaudible cue anyway would still wake the audio
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

/**
 * How long the same cue is suppressed after it fires.
 *
 * Match mode can resolve several pairs in a second; the same chime stacked on
 * itself is both louder and cheaper-sounding than one clean hit.
 */
export const RETRIGGER_MS = 70;

const STORAGE_KEY = "karta.sound";

let settings: SoundSettings = DEFAULT_SOUND_SETTINGS;
let loadedFromStorage = false;

type Bus = {
  context: AudioContext;
  /** Everything routes through here, so the user's volume is one node. */
  master: GainNode;
  /** Catches cues that land on top of each other before they add up. */
  compressor: DynamicsCompressorNode;
  noise: AudioBuffer;
};

let bus: Bus | null = null;
const lastPlayed = new Map<SoundEvent, number>();

/**
 * The last known settings, read from this device once.
 *
 * The stored profile is the source of truth, but it arrives over the network
 * and a cue has to fire the instant a card is graded — including on the first
 * grade of a session, before the profile has loaded. A local mirror means the
 * very first cue already respects a muted preference.
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

  // Take effect on anything already sounding, so muting is immediate.
  if (bus) {
    try {
      bus.master.gain.setTargetAtTime(gainFor(settings), bus.context.currentTime, 0.01);
    } catch {
      // A closed context; the next cue will build a new one.
    }
  }

  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Private mode, or storage full. The in-memory value still applies.
  }
}

/** A second of white noise, reused by every transient in the session. */
function makeNoise(context: AudioContext): AudioBuffer {
  const buffer = context.createBuffer(1, context.sampleRate, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

/**
 * The output chain, built once: voices -> compressor -> master -> speakers.
 *
 * The compressor is what keeps two cues arriving together from adding up into
 * something loud; the master gain is the user's volume, and the only place it
 * is applied.
 */
function audioBus(): Bus | null {
  if (typeof window === "undefined") return null;
  if (bus && bus.context.state !== "closed") return bus;

  const Ctor =
    window.AudioContext ??
    (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;

  try {
    const context = new Ctor();
    const master = context.createGain();
    master.gain.value = gainFor(currentSettings());

    const compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 24;
    compressor.ratio.value = 3;
    compressor.attack.value = 0.004;
    compressor.release.value = 0.12;

    compressor.connect(master).connect(context.destination);
    bus = { context, master, compressor, noise: makeNoise(context) };
    return bus;
  } catch {
    return null;
  }
}

const FLOOR = 0.0001;

/**
 * Apply an ADSR contour to one gain node.
 *
 * Exponential ramps rather than linear: loudness is perceived logarithmically,
 * and a linear fade to zero still ends with an audible edge.
 */
function applyEnvelope(
  gain: GainNode,
  start: number,
  durationMs: number,
  peak: number,
  envelope: Envelope,
): void {
  const attack = envelope.attack / 1000;
  const decay = envelope.decay / 1000;
  const release = envelope.release / 1000;
  const total = durationMs / 1000;
  // A voice shorter than its own envelope keeps the shape, scaled down.
  const scale = Math.min(1, total / Math.max(attack + decay + release, 0.001));
  const a = attack * scale;
  const d = decay * scale;
  const r = release * scale;
  const held = Math.max(peak * envelope.sustain, FLOOR);

  gain.gain.setValueAtTime(FLOOR, start);
  gain.gain.exponentialRampToValueAtTime(Math.max(peak, FLOOR), start + a);
  gain.gain.exponentialRampToValueAtTime(held, start + a + d);
  gain.gain.setValueAtTime(held, Math.max(start + a + d, start + total - r));
  gain.gain.exponentialRampToValueAtTime(FLOOR, start + total);
}

/**
 * Play one cue. Never throws, never awaits, never touches the DOM: sound is
 * decoration, and a browser that refuses to make any must not take the study
 * loop down with it. Nothing here blocks the next card.
 *
 * Silent when the user has sound off or the volume at zero — which is also why
 * no AudioContext is created until the first audible cue.
 */
export function playSound(event: SoundEvent): void {
  if (!isAudible(currentSettings())) return;

  const audio = audioBus();
  if (!audio) return;

  try {
    const { context, compressor } = audio;
    // Browsers hold the context suspended until a user gesture; grading a card
    // is one, so this resolves on the first real cue.
    if (context.state === "suspended") void context.resume();

    const now = context.currentTime;
    const nowMs = now * 1000;
    const last = lastPlayed.get(event);
    if (last !== undefined && nowMs - last < RETRIGGER_MS) return;
    lastPlayed.set(event, nowMs);

    const spec = SOUNDS[event];

    for (const voice of spec.voices) {
      const start = now + voice.start / 1000;
      const end = start + voice.duration / 1000;

      const oscillator = context.createOscillator();
      oscillator.type = voice.type;
      oscillator.frequency.setValueAtTime(voice.freq, start);
      if (voice.freqEnd !== undefined) {
        oscillator.frequency.exponentialRampToValueAtTime(voice.freqEnd, end);
      }
      if (voice.detune !== undefined) oscillator.detune.setValueAtTime(voice.detune, start);

      const filter = context.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(voice.lowpass, start);
      filter.Q.setValueAtTime(0.7, start);

      const gain = context.createGain();
      applyEnvelope(gain, start, voice.duration, voice.gain, voice.envelope);

      oscillator.connect(filter).connect(gain).connect(compressor);
      oscillator.start(start);
      oscillator.stop(end + 0.03);
    }

    for (const transient of spec.transients ?? []) {
      const start = now + transient.start / 1000;
      const end = start + transient.duration / 1000;

      const source = context.createBufferSource();
      source.buffer = audio.noise;

      const filter = context.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(transient.band, start);
      filter.Q.setValueAtTime(transient.q, start);

      const gain = context.createGain();
      gain.gain.setValueAtTime(FLOOR, start);
      gain.gain.exponentialRampToValueAtTime(Math.max(transient.gain, FLOOR), start + 0.002);
      gain.gain.exponentialRampToValueAtTime(FLOOR, end);

      source.connect(filter).connect(gain).connect(compressor);
      source.start(start);
      source.stop(end + 0.02);
    }
  } catch {
    // Autoplay policy, a closed context, an exhausted node budget — all of
    // which mean "no sound", never "no review".
  }
}
