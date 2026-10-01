export type LesenLevel = "A1" | "A2";

export interface LesenQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
  /** English rationale, straight from the source's own `begruendung.en`
   *  field — the source only ever provides de/en, never tr/ku, so (unlike
   *  every other grammar drill's offline gloss) this is not run through
   *  `explanationLanguage`/`pickExplanation`; see LESEN-ATTRIBUTION.md. */
  explanation: string;
}

export interface LesenPassage {
  id: string;
  level: LesenLevel;
  title: string;
  source: string;
  text: string;
  questions: LesenQuestion[];
}
