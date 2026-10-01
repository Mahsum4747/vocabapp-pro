export type LesenLevel = "A1" | "A2" | "B1" | "B2";

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

/** A1/A2 (richtig/falsch, multiple-choice) and B1's richtig_falsch/
 *  multiple_choice/ja_nein — all the same shape: one passage, a short list
 *  of its own close-ended questions, tap to answer. */
export interface LesenChoicePassage {
  kind: "choice";
  id: string;
  level: LesenLevel;
  title: string;
  source: string;
  text: string;
  questions: LesenQuestion[];
}

/** One draggable option in a matching exercise — an ad, a person's
 *  statement, a quoted opinion, or (for zuordnung_ueberschriften) a bare
 *  heading with no `title`. */
export interface LesenMatchOption {
  id: string;
  title?: string;
  text: string;
}

/** One drop target — the situation/question/paragraph-reference a learner
 *  must find the right `LesenMatchOption` for. */
export interface LesenMatchTarget {
  id: string;
  prompt: string;
  correctOptionId: string;
  explanation: string;
}

/** The source's four zuordnung_* exercise types (B1 zuordnung_anzeigen; B2
 *  zuordnung_person, zuordnung_aeusserungen, zuordnung_ueberschriften) are
 *  all the same shape once reshaped: drag each option onto its matching
 *  target. Only zuordnung_ueberschriften also carries `referenceText` — a
 *  passage to read before matching headings to its paragraphs; the other
 *  three have no passage, just the options and targets themselves. */
export interface LesenMatchingPassage {
  kind: "matching";
  id: string;
  level: LesenLevel;
  title: string;
  source: string;
  instruction: string;
  referenceText?: string;
  options: LesenMatchOption[];
  targets: LesenMatchTarget[];
}

export interface LesenGapOption {
  id: string;
  text: string;
}

export interface LesenGap {
  id: string;
  correctOptionId: string;
  explanation: string;
}

/** B2's satz_einfuegen: a passage with numbered gaps, and a pool of
 *  sentences (one more than there are gaps — a distractor) to drag into
 *  them. `segments` is the passage text split at each gap marker, so
 *  `segments.length === gaps.length + 1` and gap `i` sits between
 *  `segments[i]` and `segments[i + 1]`. */
export interface LesenSentenceInsertionPassage {
  kind: "sentence-insertion";
  id: string;
  level: LesenLevel;
  title: string;
  source: string;
  instruction: string;
  segments: string[];
  gaps: LesenGap[];
  options: LesenGapOption[];
}

export type LesenPassage = LesenChoicePassage | LesenMatchingPassage | LesenSentenceInsertionPassage;
