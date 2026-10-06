/** Curriculum metadata is independent of transport, storage and morphology. */
export type LessonStage =
  | "discover"
  | "understand"
  | "recognize"
  | "classify"
  | "read"
  | "recall"
  | "produce"
  | "apply"
  | "check";
export type ContentPurpose = "teach" | "practice" | "formative-check";
export type SkillDefinition = {
  id: string;
  targetLanguage: string;
  level: string;
  domain: "grammar" | "reading" | "writing" | "vocabulary";
  outcome: string;
  hardPrerequisites: readonly string[];
};
type StepBase = {
  id: string;
  stage: LessonStage;
  purpose: ContentPurpose;
  label: string;
  prompt: string;
  explanation?: string;
  example?: string;
  skillIds: readonly string[];
};
export type LessonStep = StepBase &
  (
    | { kind: "explanation" }
    | { kind: "choice"; options: readonly string[]; correctAnswer: string; feedback: string }
    | {
        kind: "text";
        inputLabel: string;
        acceptedAnswers: readonly string[];
        caseSensitive?: boolean;
        feedback: string;
      }
    | { kind: "original"; inputLabel: string; maxLength: number }
  );
export type LessonDefinition = {
  id: string;
  /** Required for durable authored lessons. Bump only for incompatible step identity/order,
   * task meaning, grading or response contracts; retain for presentation/feedback copy edits. */
  resumeContractVersion?: number;
  unitId: string;
  title: string;
  outcome: string;
  description?: string;
  introducedSkillIds: readonly string[];
  consolidatedSkillIds: readonly string[];
  availability: "prototype" | "not-authored";
  steps: readonly LessonStep[];
};
export type UnitDefinition = {
  id: string;
  title: string;
  description?: string;
  lessonIds: readonly string[];
};
export type CurriculumRelease = {
  id: string;
  version: string;
  targetLanguage: string;
  level: string;
  title: string;
  status: "prototype" | "published";
  provenance: { origin: string; reviewStatus: "prototype-review" | "publication-reviewed" };
  supportLanguages: readonly string[];
  skills: readonly SkillDefinition[];
  units: readonly UnitDefinition[];
  lessons: readonly LessonDefinition[];
};
