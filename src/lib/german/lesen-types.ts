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

/** One draggable option in a matching exercise — just the short thing a
 *  learner drags (an ad's title, a person's name, a heading) and NEVER its
 *  full body text: dragging a whole paragraph around as a "chip" is both
 *  unusable and not how the source exam itself presents the task (you
 *  write a single letter as your answer; the full text is reference
 *  material, read once, not re-read on every chip). See
 *  `LesenMatchReferenceItem` for where the body text actually lives. */
export interface LesenMatchOption {
  id: string;
  shortLabel: string;
}

/** One read-only reference block shown above the board — the ad, person's
 *  statement, or quoted opinion a matching exercise's options are short
 *  names FOR. Present for zuordnung_anzeigen/zuordnung_person/
 *  zuordnung_aeusserungen (each option has its own paragraph); absent for
 *  zuordnung_ueberschriften, which uses the single shared `referenceText`
 *  instead (one document, not one block per option). */
export interface LesenMatchReferenceItem {
  id: string;
  label: string;
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
 *  target. zuordnung_ueberschriften carries `referenceText` (a passage to
 *  read before matching headings to its paragraphs); the other three
 *  carry `referenceItems` instead (their options' own full text, read-only
 *  — see that type's doc comment). `allowMultiple` is true ONLY for
 *  zuordnung_person: its own instruction text says so explicitly ("Die
 *  Personen können mehrmals gewählt werden") — the same person can be the
 *  right answer for more than one target, so placing them in one target
 *  must not remove them from the pool. Every other zuordnung_* type's own
 *  instruction says the opposite ("nur einmal verwenden") or simply
 *  provides more options than targets with no reuse, so this defaults to
 *  single-use when absent. */
export interface LesenMatchingPassage {
  kind: "matching";
  id: string;
  level: LesenLevel;
  title: string;
  source: string;
  instruction: string;
  referenceText?: string;
  referenceItems?: LesenMatchReferenceItem[];
  allowMultiple?: boolean;
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
