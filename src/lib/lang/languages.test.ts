import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  LANGUAGES,
  asLanguageCode,
  isLanguageCode,
  languageByCode,
  normalizeLanguage,
  type LanguageCode,
} from "./languages.ts";

describe("the language list", () => {
  it("has no duplicate codes", () => {
    const codes = LANGUAGES.map((l) => l.code);
    assert.equal(new Set(codes).size, codes.length);
  });

  it("covers the five the app is built around", () => {
    for (const code of ["de", "en", "tr", "ku", "ckb"] as LanguageCode[]) {
      assert.ok(
        LANGUAGES.some((l) => l.code === code),
        `missing ${code}`,
      );
    }
  });

  it("gives every entry both an English and a native label", () => {
    for (const language of LANGUAGES) {
      assert.ok(language.label.trim(), `${language.code} has no label`);
      assert.ok(language.nativeLabel.trim(), `${language.code} has no nativeLabel`);
    }
  });

  it("round-trips every entry through normalizeLanguage", () => {
    // The invariant that keeps the list safe to extend: whatever a picker
    // shows for a row must resolve back to that row's code.
    for (const language of LANGUAGES) {
      assert.equal(normalizeLanguage(language.code), language.code, `code ${language.code}`);
      assert.equal(normalizeLanguage(language.label), language.code, `label ${language.label}`);
      assert.equal(
        normalizeLanguage(language.nativeLabel),
        language.code,
        `nativeLabel ${language.nativeLabel}`,
      );
    }
  });

  it("looks up a row by code", () => {
    assert.equal(languageByCode("de").label, "German");
    assert.equal(languageByCode("tr").nativeLabel, "Türkçe");
  });
});

describe("normalizeLanguage — every legacy speech.ts key", () => {
  // The 36 keys speech.ts's LANGUAGE_TAGS accepted before codes existed.
  // These are the values that can already be sitting in Firestore, so each
  // one has to keep resolving or an existing set loses its language.
  const LEGACY: Record<string, LanguageCode> = {
    english: "en",
    german: "de",
    deutsch: "de",
    turkish: "tr",
    türkçe: "tr",
    french: "fr",
    français: "fr",
    spanish: "es",
    español: "es",
    italian: "it",
    italiano: "it",
    portuguese: "pt",
    dutch: "nl",
    russian: "ru",
    polish: "pl",
    swedish: "sv",
    norwegian: "nb",
    danish: "da",
    finnish: "fi",
    greek: "el",
    arabic: "ar",
    japanese: "ja",
    korean: "ko",
    chinese: "zh",
    mandarin: "zh",
    hindi: "hi",
    ukrainian: "uk",
    czech: "cs",
    romanian: "ro",
    hungarian: "hu",
    kurdish: "ku",
    kurmanci: "ku",
    kurmancî: "ku",
    kürtçe: "ku",
    sorani: "ckb",
    soranî: "ckb",
  };

  it("covers all 36 of them", () => {
    assert.equal(Object.keys(LEGACY).length, 36);
  });

  for (const [legacy, expected] of Object.entries(LEGACY)) {
    it(`"${legacy}" -> ${expected}`, () => {
      assert.equal(normalizeLanguage(legacy), expected);
    });
  }
});

describe("normalizeLanguage — raw BCP-47", () => {
  const cases: [string, LanguageCode][] = [
    ["de", "de"],
    ["de-DE", "de"],
    ["en-US", "en"],
    ["en-GB", "en"],
    ["tr-TR", "tr"],
    ["pt-PT", "pt"],
    ["pt-BR", "pt"],
    ["zh-CN", "zh"],
    ["zh-Hans", "zh"],
    ["nb-NO", "nb"],
    ["ckb", "ckb"],
    ["ku", "ku"],
    // Underscore form, as some platforms write locales.
    ["de_DE", "de"],
    // ISO 639-1 Norwegian, which the app speaks as bokmål.
    ["no", "nb"],
  ];
  for (const [input, expected] of cases) {
    it(`"${input}" -> ${expected}`, () => {
      assert.equal(normalizeLanguage(input), expected);
    });
  }
});

describe("normalizeLanguage — case, accents and whitespace", () => {
  const cases: [string, LanguageCode][] = [
    ["German", "de"],
    ["GERMAN", "de"],
    ["  german  ", "de"],
    ["gErMaN", "de"],
    ["DE", "de"],
    ["Deutsch", "de"],
    ["DEUTSCH", "de"],
    // Accent-folded: with and without diacritics must agree.
    ["Türkçe", "tr"],
    ["turkce", "tr"],
    ["TÜRKÇE", "tr"],
    ["Kurmancî", "ku"],
    ["Kurmanci", "ku"],
    ["KURMANCÎ", "ku"],
    ["Français", "fr"],
    ["francais", "fr"],
    ["Español", "es"],
    ["espanol", "es"],
    ["Čeština", "cs"],
    ["cestina", "cs"],
    ["Norsk bokmål", "nb"],
    ["norsk bokmal", "nb"],
  ];
  for (const [input, expected] of cases) {
    it(`"${input}" -> ${expected}`, () => {
      assert.equal(normalizeLanguage(input), expected);
    });
  }

  it("handles Turkish's dotted capital I", () => {
    // "İngilizce".toLowerCase() is "i" + a combining dot above; without NFD
    // folding it would never match the plain-ascii alias.
    assert.equal(normalizeLanguage("İngilizce"), "en");
    assert.equal(normalizeLanguage("ingilizce"), "en");
    assert.equal(normalizeLanguage("İNGİLİZCE"), "en");
  });
});

describe("normalizeLanguage — Turkish names users actually type", () => {
  const cases: [string, LanguageCode][] = [
    ["Almanca", "de"],
    ["Kürtçe", "ku"],
    ["Arapça", "ar"],
    ["Fransızca", "fr"],
    ["İspanyolca", "es"],
    ["Rusça", "ru"],
    ["Japonca", "ja"],
    ["Çince", "zh"],
  ];
  for (const [input, expected] of cases) {
    it(`"${input}" -> ${expected}`, () => {
      assert.equal(normalizeLanguage(input), expected);
    });
  }
});

describe("normalizeLanguage — refuses to guess", () => {
  for (const input of [
    "",
    "   ",
    "Klingon",
    "not a language",
    "xx",
    "zzz-ZZ",
    // A real language the app has no code for yet: null, never a near miss.
    "Persian",
    "Hebrew",
  ]) {
    it(`"${input}" -> null`, () => {
      assert.equal(normalizeLanguage(input), null);
    });
  }

  it("survives non-string input from untyped Firestore data", () => {
    for (const value of [undefined, null, 42, {}, []]) {
      assert.equal(normalizeLanguage(value as unknown as string), null);
    }
  });
});

describe("isLanguageCode / asLanguageCode", () => {
  it("accepts canonical codes only", () => {
    assert.equal(isLanguageCode("de"), true);
    assert.equal(isLanguageCode("ckb"), true);
    // A label is not a code.
    assert.equal(isLanguageCode("German"), false);
    assert.equal(isLanguageCode("de-DE"), false);
    assert.equal(isLanguageCode(""), false);
    assert.equal(isLanguageCode(undefined), false);
    assert.equal(isLanguageCode(7), false);
  });

  it("narrows stored values, defaulting to null", () => {
    assert.equal(asLanguageCode("tr"), "tr");
    assert.equal(asLanguageCode("Turkish"), null);
    assert.equal(asLanguageCode(undefined), null);
    assert.equal(asLanguageCode({ code: "tr" }), null);
  });
});
