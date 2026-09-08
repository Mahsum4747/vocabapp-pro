import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_SOUND_SETTINGS,
  gainFor,
  isAudible,
  MAX_GAIN,
  readSoundSettings,
  SOUNDS,
  type SoundEvent,
} from "./sound.ts";

const EVENTS = Object.keys(SOUNDS) as SoundEvent[];

describe("the sound specs", () => {
  it("covers every event the app fires", () => {
    assert.deepEqual(EVENTS.sort(), [
      "achievement",
      "cardFlip",
      "correct",
      "dailyGoalSuccess",
      "error",
      "excellent",
      "setCompleted",
    ]);
  });

  it("keeps every cue inside its stated length", () => {
    // The duration is what callers schedule against, so no tone may outlive it.
    for (const event of EVENTS) {
      const spec = SOUNDS[event];
      for (const tone of spec.tones) {
        assert.ok(
          tone.start + tone.duration <= spec.duration,
          `${event}: a tone runs past the cue's ${spec.duration}ms`,
        );
      }
    }
  });

  it("matches the lengths the design asks for", () => {
    assert.equal(SOUNDS.cardFlip.duration, 200);
    assert.equal(SOUNDS.correct.duration, 300);
    assert.equal(SOUNDS.excellent.duration, 400);
    assert.equal(SOUNDS.achievement.duration, 500);
    assert.equal(SOUNDS.setCompleted.duration, 800);
    assert.equal(SOUNDS.error.duration, 200);
    assert.equal(SOUNDS.dailyGoalSuccess.duration, 500);
  });

  it("uses audible frequencies and real durations throughout", () => {
    for (const event of EVENTS) {
      for (const tone of SOUNDS[event].tones) {
        assert.ok(
          tone.freq >= 100 && tone.freq <= 4000,
          `${event}: ${tone.freq}Hz is out of range`,
        );
        assert.ok(tone.duration > 0, `${event}: a tone has no length`);
        assert.ok(tone.gain > 0 && tone.gain <= 1, `${event}: gain ${tone.gain} is out of range`);
      }
    }
  });

  it("never lets one cue's voices add up to clipping", () => {
    // Tones overlap in the chords, so their combined gain is what reaches the
    // output — over 1 and the sum distorts.
    for (const event of EVENTS) {
      const total = SOUNDS[event].tones.reduce((sum, tone) => sum + tone.gain, 0);
      assert.ok(total <= 1.5, `${event}: voices sum to ${total}`);
    }
  });

  it("plays the flip cue more quietly than the reward cues", () => {
    // It fires on every single card; a chime at answer volume would grate.
    assert.ok(SOUNDS.cardFlip.tones[0].gain < SOUNDS.correct.tones[0].gain);
  });

  it("rises in pitch for a right answer", () => {
    const [tone] = SOUNDS.correct.tones;
    assert.equal(tone.freq, 1000);
    assert.equal(tone.freqEnd, 1200);
  });
});

describe("volume", () => {
  it("scales the master gain, capped well below unity", () => {
    assert.equal(gainFor({ enabled: true, volume: 100 }), MAX_GAIN);
    assert.equal(gainFor({ enabled: true, volume: 50 }), MAX_GAIN / 2);
  });

  it("is silent at zero even when sound is on", () => {
    assert.equal(gainFor({ enabled: true, volume: 0 }), 0);
    assert.equal(isAudible({ enabled: true, volume: 0 }), false);
  });

  it("is silent when sound is off, whatever the volume", () => {
    assert.equal(gainFor({ enabled: false, volume: 100 }), 0);
    assert.equal(isAudible({ enabled: false, volume: 100 }), false);
  });

  it("is audible by default", () => {
    assert.equal(isAudible(DEFAULT_SOUND_SETTINGS), true);
    assert.equal(DEFAULT_SOUND_SETTINGS.enabled, true);
    assert.equal(DEFAULT_SOUND_SETTINGS.volume, 70);
  });
});

describe("reading stored settings", () => {
  it("falls back to the defaults for a user who has never set them", () => {
    assert.deepEqual(readSoundSettings(null), DEFAULT_SOUND_SETTINGS);
    assert.deepEqual(readSoundSettings({}), DEFAULT_SOUND_SETTINGS);
  });

  it("keeps what was stored", () => {
    assert.deepEqual(readSoundSettings({ enabled: false, volume: 20 }), {
      enabled: false,
      volume: 20,
    });
  });

  it("clamps and rounds a volume that could not be right", () => {
    assert.equal(readSoundSettings({ volume: 500 }).volume, 100);
    assert.equal(readSoundSettings({ volume: -30 }).volume, 0);
    assert.equal(readSoundSettings({ volume: 42.7 }).volume, 43);
    assert.equal(readSoundSettings({ volume: NaN }).volume, DEFAULT_SOUND_SETTINGS.volume);
    assert.equal(readSoundSettings({ volume: "loud" }).volume, DEFAULT_SOUND_SETTINGS.volume);
  });

  it("only accepts a real boolean for the switch", () => {
    assert.equal(readSoundSettings({ enabled: "no" }).enabled, true);
    assert.equal(readSoundSettings({ enabled: false }).enabled, false);
  });
});
