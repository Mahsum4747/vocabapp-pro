import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  configureSound,
  DEFAULT_SOUND_SETTINGS,
  gainFor,
  isAudible,
  MAX_FREQUENCY,
  MAX_GAIN,
  playSound,
  readSoundSettings,
  RETRIGGER_MS,
  SOUNDS,
  type SoundEvent,
} from "./sound.ts";

const EVENTS = Object.keys(SOUNDS) as SoundEvent[];

describe("the sound language", () => {
  it("covers every event the app fires", () => {
    assert.deepEqual(EVENTS.sort(), [
      "achievement",
      "cardFlip",
      "correct",
      "dailyGoalSuccess",
      "error",
      "excellent",
      "hard",
      "setCompleted",
    ]);
  });

  it("keeps every cue inside its stated length", () => {
    // The duration is what callers schedule against, so nothing may outlive it.
    for (const event of EVENTS) {
      const spec = SOUNDS[event];
      for (const voice of spec.voices) {
        assert.ok(
          voice.start + voice.duration <= spec.duration,
          `${event}: a voice runs past the cue's ${spec.duration}ms`,
        );
      }
      for (const transient of spec.transients ?? []) {
        assert.ok(
          transient.start + transient.duration <= spec.duration,
          `${event}: a transient runs past the cue`,
        );
      }
    }
  });

  it("stays inside the lengths the design calls for", () => {
    const ranges: Record<SoundEvent, [number, number]> = {
      cardFlip: [80, 150],
      correct: [180, 250],
      excellent: [250, 350],
      hard: [150, 250],
      achievement: [350, 500],
      setCompleted: [500, 700],
      error: [120, 180],
      dailyGoalSuccess: [350, 500],
    };

    for (const event of EVENTS) {
      const [min, max] = ranges[event];
      const { duration } = SOUNDS[event];
      assert.ok(
        duration >= min && duration <= max,
        `${event}: ${duration}ms is outside ${min}–${max}ms`,
      );
    }
  });

  it("never reaches a piercing frequency", () => {
    // The whole character depends on this: brightness is what makes a cue
    // read as a notification rather than as UI feedback.
    for (const event of EVENTS) {
      for (const voice of SOUNDS[event].voices) {
        for (const freq of [voice.freq, voice.freqEnd ?? voice.freq]) {
          assert.ok(
            freq >= 100 && freq <= MAX_FREQUENCY,
            `${event}: ${freq}Hz is outside the warm range`,
          );
        }
        assert.ok(
          voice.lowpass <= 3200,
          `${event}: the low-pass is too open at ${voice.lowpass}Hz`,
        );
      }
    }
  });

  it("gives every voice a real envelope rather than an on/off switch", () => {
    for (const event of EVENTS) {
      for (const voice of SOUNDS[event].voices) {
        const { attack, decay, sustain, release } = voice.envelope;
        assert.ok(attack > 0, `${event}: a voice switches on instantly`);
        assert.ok(release > 0, `${event}: a voice cuts off instead of decaying`);
        assert.ok(decay >= 0);
        assert.ok(sustain >= 0 && sustain <= 1, `${event}: sustain ${sustain} is out of range`);
        assert.ok(
          attack + decay + release <= voice.duration * 1.6,
          `${event}: the envelope is far longer than the voice`,
        );
      }
    }
  });

  it("keeps each cue's voices from summing into something loud", () => {
    // Voices overlap by design, so their combined peak is what reaches the
    // bus. Well under 1 leaves the compressor room to work.
    for (const event of EVENTS) {
      const total = SOUNDS[event].voices.reduce((sum, voice) => sum + voice.gain, 0);
      assert.ok(total <= 0.9, `${event}: voices peak together at ${total.toFixed(2)}`);
    }
  });

  it("plays the flip cue far more quietly than any reward", () => {
    // It fires on every single card; at reward volume it would grate within a
    // dozen flips.
    const flip = Math.max(...SOUNDS.cardFlip.voices.map((v) => v.gain));
    for (const event of ["correct", "excellent", "achievement", "setCompleted"] as SoundEvent[]) {
      const reward = Math.max(...SOUNDS[event].voices.map((v) => v.gain));
      assert.ok(flip < reward, `cardFlip (${flip}) should be quieter than ${event} (${reward})`);
    }
  });

  it("builds the tactile cues from a filtered transient, not just a tone", () => {
    // The click of contact is what makes a flip feel physical.
    assert.ok((SOUNDS.cardFlip.transients ?? []).length > 0);
    assert.ok((SOUNDS.error.transients ?? []).length > 0);
  });

  it("answers a wrong card low and quietly, never as a buzzer", () => {
    const loudest = Math.max(...SOUNDS.error.voices.map((v) => v.gain));
    const correct = Math.max(...SOUNDS.correct.voices.map((v) => v.gain));

    for (const voice of SOUNDS.error.voices) {
      assert.ok(voice.freq <= 250, "the error cue must stay in the low register");
      assert.ok(voice.lowpass <= 900, "and must not carry any bite");
    }
    assert.ok(loudest <= correct, "getting one wrong must not be louder than getting one right");
  });

  it("makes the wrong-answer cue actually audible, not just present", () => {
    // Regression: 0.22 read as inaudible on real hardware at a 196→165Hz
    // fundamental, which the ear hears as quieter than a higher tone at the
    // same amplitude. Raised as far as the "never louder than correct" rule
    // allows, rather than by opening the low-pass (that would add the bite
    // the cue is explicitly designed not to have).
    const loudest = Math.max(...SOUNDS.error.voices.map((v) => v.gain));
    assert.ok(loudest >= 0.28, `error cue is still too quiet at gain ${loudest}`);
  });

  it("gives a hard answer its own light-but-audible cue, between flip and correct", () => {
    // Before this, "hard" fired no sound at all. It should read as more than
    // the everywhere-tick of a card flip, but plainly under a full reward.
    const flip = Math.max(...SOUNDS.cardFlip.voices.map((v) => v.gain));
    const hard = Math.max(...SOUNDS.hard.voices.map((v) => v.gain));
    const correct = Math.max(...SOUNDS.correct.voices.map((v) => v.gain));
    assert.ok(hard > flip, `hard (${hard}) should be louder than the flip tick (${flip})`);
    assert.ok(hard < correct, `hard (${hard}) should stay under a full reward (${correct})`);
  });

  it("moves in pitch where the gesture should carry meaning", () => {
    // Confirmation lifts; a miss settles downward.
    const [confirm] = SOUNDS.correct.voices;
    assert.ok(confirm.freqEnd !== undefined && confirm.freqEnd > confirm.freq);

    const [miss] = SOUNDS.error.voices;
    assert.ok(miss.freqEnd !== undefined && miss.freqEnd < miss.freq);
  });

  it("voices the celebrations as chords rather than single beeps", () => {
    for (const event of ["achievement", "setCompleted", "dailyGoalSuccess"] as SoundEvent[]) {
      assert.ok(SOUNDS[event].voices.length >= 2, `${event} should be voiced, not a single tone`);
    }
  });

  it("keeps the goal cue distinct from the badge cue", () => {
    // They can occur seconds apart, and must not be mistaken for each other.
    const goal = SOUNDS.dailyGoalSuccess.voices.map((v) => v.freq).sort();
    const badge = SOUNDS.achievement.voices.map((v) => v.freq).sort();
    assert.notDeepEqual(goal, badge);
  });
});

describe("volume", () => {
  it("scales the master gain, capped well below unity", () => {
    assert.equal(gainFor({ enabled: true, volume: 100 }), MAX_GAIN);
    assert.equal(gainFor({ enabled: true, volume: 50 }), MAX_GAIN / 2);
  });

  it("is muted at zero even when sound is on", () => {
    assert.equal(gainFor({ enabled: true, volume: 0 }), 0);
    assert.equal(isAudible({ enabled: true, volume: 0 }), false);
  });

  it("is silent when sound is off, whatever the volume", () => {
    assert.equal(gainFor({ enabled: false, volume: 100 }), 0);
    assert.equal(isAudible({ enabled: false, volume: 100 }), false);
  });

  it("is quiet by default", () => {
    assert.equal(isAudible(DEFAULT_SOUND_SETTINGS), true);
    assert.ok(gainFor(DEFAULT_SOUND_SETTINGS) < 0.15, "the default must not be assertive");
  });
});

describe("playing a cue", () => {
  it("does nothing at all when sound is off", () => {
    // No context, no nodes, no throw — with sound off the audio hardware is
    // never touched.
    configureSound({ enabled: false, volume: 100 });
    for (const event of EVENTS) {
      assert.doesNotThrow(() => playSound(event));
    }
  });

  it("does nothing at all at volume zero", () => {
    configureSound({ enabled: true, volume: 0 });
    for (const event of EVENTS) {
      assert.doesNotThrow(() => playSound(event));
    }
  });

  it("never blocks or throws where there is no audio at all", () => {
    // Server rendering, and any browser that refuses to give us a context:
    // the study loop must be untouched either way.
    configureSound(DEFAULT_SOUND_SETTINGS);
    for (const event of EVENTS) {
      assert.equal(playSound(event), undefined);
    }
  });

  it("suppresses a repeat of the same cue for long enough to matter", () => {
    // Match mode can resolve pairs faster than this; the same chime stacked on
    // itself is both louder and cheaper-sounding than one clean hit.
    assert.ok(RETRIGGER_MS >= 40 && RETRIGGER_MS <= 150);
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
