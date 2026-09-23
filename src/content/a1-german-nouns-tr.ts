import { stripArticle, type LanguageProfile } from "@/lib/lang/profiles";

/**
 * Phase 2, Adım 4: a static Turkish gloss/feedback pilot for the Articles
 * and Cases reveal lines — NOT a translation feature, NOT AI-generated, and
 * NOT tied to any new Firestore field. Exactly 50 hand-written entries for
 * the existing "CEFR A1 German Nouns" set's own nouns, keyed by the bare
 * noun headword (no article).
 *
 * Review-time only: this is looked up client-side when
 * `profile.explanationLanguage === "tr"`. It never calls Gemini, never
 * writes anywhere, and never grows beyond this fixed list — a term with no
 * entry here falls back to the card's own English `definition`, same as
 * any other language.
 */
export const A1_NOUNS_TR: Record<string, { gloss: string; feedback: string }> = {
  Apfel: { gloss: "elma", feedback: "der Apfel. Akkusativ: den Apfel." },
  Haus: { gloss: "ev", feedback: "das Haus. Dativ: dem Haus." },
  Frau: { gloss: "kadın", feedback: "die Frau. Akkusativ ve Dativ: die Frau." },
  Mann: { gloss: "adam", feedback: "der Mann. Akkusativ: den Mann." },
  Kind: { gloss: "çocuk", feedback: "das Kind. Dativ: dem Kind." },
  Mutter: { gloss: "anne", feedback: "die Mutter." },
  Vater: { gloss: "baba", feedback: "der Vater. Akkusativ: den Vater." },
  Stadt: { gloss: "şehir", feedback: "die Stadt." },
  Hund: { gloss: "köpek", feedback: "der Hund. Akkusativ: den Hund." },
  Katze: { gloss: "kedi", feedback: "die Katze." },
  Buch: { gloss: "kitap", feedback: "das Buch. Akkusativ: das Buch." },
  Tisch: { gloss: "masa", feedback: "der Tisch. Dativ: dem Tisch." },
  Stuhl: { gloss: "sandalye", feedback: "der Stuhl. Akkusativ: den Stuhl." },
  Tasche: { gloss: "çanta", feedback: "die Tasche." },
  Wasser: { gloss: "su", feedback: "das Wasser. Çoğul yok." },
  Brot: { gloss: "ekmek", feedback: "das Brot." },
  Käse: { gloss: "peynir", feedback: "der Käse." },
  Milch: { gloss: "süt", feedback: "die Milch. Çoğul yok." },
  Kaffee: { gloss: "kahve", feedback: "der Kaffee." },
  Tee: { gloss: "çay", feedback: "der Tee." },
  Sonne: { gloss: "güneş", feedback: "die Sonne." },
  Regen: { gloss: "yağmur", feedback: "der Regen." },
  Schule: { gloss: "okul", feedback: "die Schule." },
  Arbeit: { gloss: "iş", feedback: "die Arbeit." },
  Name: { gloss: "ad", feedback: "der Name. Dativ konuşmada: dem Namen." },
  Freund: { gloss: "arkadaş (erkek)", feedback: "der Freund. Akkusativ: den Freund." },
  Freundin: { gloss: "arkadaş (kadın)", feedback: "die Freundin." },
  Uhr: { gloss: "saat", feedback: "die Uhr." },
  Auto: { gloss: "araba", feedback: "das Auto." },
  Bus: { gloss: "otobüs", feedback: "der Bus. Dativ: dem Bus." },
  Zug: { gloss: "tren", feedback: "der Zug. Dativ: dem Zug." },
  Bahnhof: { gloss: "tren istasyonu", feedback: "der Bahnhof. Dativ: am Bahnhof." },
  Flughafen: { gloss: "havaalanı", feedback: "der Flughafen." },
  Geld: { gloss: "para", feedback: "das Geld. Çoğul yok." },
  Schlüssel: { gloss: "anahtar", feedback: "der Schlüssel." },
  Handy: { gloss: "cep telefonu", feedback: "das Handy." },
  Tag: { gloss: "gün", feedback: "der Tag. Akkusativ: den Tag." },
  Nacht: { gloss: "gece", feedback: "die Nacht." },
  Woche: { gloss: "hafta", feedback: "die Woche." },
  Jahr: { gloss: "yıl", feedback: "das Jahr." },
  Frage: { gloss: "soru", feedback: "die Frage." },
  Antwort: { gloss: "cevap", feedback: "die Antwort." },
  Arzt: { gloss: "doktor", feedback: "der Arzt. Dativ: zum Arzt." },
  Zimmer: { gloss: "oda", feedback: "das Zimmer." },
  Garten: { gloss: "bahçe", feedback: "der Garten. Dativ: im Garten." },
  Straße: { gloss: "sokak", feedback: "die Straße." },
  Supermarkt: { gloss: "süpermarket", feedback: "der Supermarkt." },
  Fenster: { gloss: "pencere", feedback: "das Fenster." },
  Tür: { gloss: "kapı", feedback: "die Tür." },
  Schuh: { gloss: "ayakkabı", feedback: "der Schuh. Akkusativ: den Schuh." },
};

/**
 * `A1_NOUNS_TR` lookup for a card's own `term`, tolerant of a stored term
 * that still carries its article ("der Apfel" as well as "Apfel") — reuses
 * `stripArticle` (src/lib/lang/profiles.ts), the same leniency the AI-cache
 * key path already uses, rather than a second, possibly-divergent copy.
 */
export function a1NounTrEntry(
  term: string,
  profile: LanguageProfile,
): { gloss: string; feedback: string } | undefined {
  return A1_NOUNS_TR[stripArticle(term, profile)];
}
