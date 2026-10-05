import type { CurriculumRelease } from "./types";

/** Pure, stable-order diagnostics; no mutation, service calls or unlock policy. */
export function validateCurriculum(release: CurriculumRelease): string[] {
  const errors: string[] = [];
  const canonical = new Set<string>();
  const register = (kind: string, ids: readonly string[]) => {
    const seen = new Set<string>();
    for (const id of ids) {
      if (!id.trim()) errors.push(`Empty ${kind} ID.`);
      if (seen.has(id)) errors.push(`Duplicate ${kind} ID: ${id}.`);
      else if (canonical.has(id)) errors.push(`Duplicate canonical ID across entities: ${id}.`);
      seen.add(id);
      canonical.add(id);
    }
    return seen;
  };
  register("release", [release.id]);
  const skillIds = register(
    "skill",
    release.skills.map((s) => s.id),
  );
  const unitIds = register(
    "unit",
    release.units.map((u) => u.id),
  );
  const lessonIds = register(
    "lesson",
    release.lessons.map((l) => l.id),
  );
  for (const skill of release.skills) {
    if (skill.targetLanguage !== release.targetLanguage || skill.level !== release.level)
      errors.push(`Skill metadata differs from release: ${skill.id}.`);
    const seen = new Set<string>();
    for (const dependency of skill.hardPrerequisites) {
      if (!skillIds.has(dependency))
        errors.push(`Unresolved prerequisite ${dependency} for ${skill.id}.`);
      if (dependency === skill.id) errors.push(`Self-dependency: ${skill.id}.`);
      if (seen.has(dependency))
        errors.push(`Duplicate prerequisite ${dependency} for ${skill.id}.`);
      seen.add(dependency);
    }
  }
  const skills = new Map(release.skills.map((s) => [s.id, s]));
  const visited = new Set<string>();
  const active: string[] = [];
  function visit(id: string) {
    const start = active.indexOf(id);
    if (start !== -1) {
      errors.push(`Hard prerequisite cycle: ${[...active.slice(start), id].join(" → ")}.`);
      return;
    }
    if (visited.has(id)) return;
    active.push(id);
    for (const dependency of skills.get(id)?.hardPrerequisites ?? [])
      if (skills.has(dependency)) visit(dependency);
    active.pop();
    visited.add(id);
  }
  for (const id of skills.keys()) visit(id);
  const memberships = new Map<string, number>();
  for (const unit of release.units) {
    const seen = new Set<string>();
    for (const id of unit.lessonIds) {
      if (!lessonIds.has(id)) errors.push(`Invalid lesson reference ${id} in ${unit.id}.`);
      if (seen.has(id)) errors.push(`Duplicate lesson membership ${id} in ${unit.id}.`);
      seen.add(id);
      memberships.set(id, (memberships.get(id) ?? 0) + 1);
      if (release.lessons.find((l) => l.id === id)?.unitId !== unit.id)
        errors.push(`Invalid unit→lesson membership: ${unit.id} → ${id}.`);
    }
  }
  for (const lesson of release.lessons) {
    if (!unitIds.has(lesson.unitId))
      errors.push(`Unresolved unit ${lesson.unitId} for ${lesson.id}.`);
    if (memberships.get(lesson.id) !== 1)
      errors.push(`Lesson ${lesson.id} must belong to exactly one unit.`);
    const refs = [...lesson.introducedSkillIds, ...lesson.consolidatedSkillIds];
    if (new Set(refs).size !== refs.length)
      errors.push(`Duplicate lesson skill references: ${lesson.id}.`);
    for (const id of refs)
      if (!skillIds.has(id)) errors.push(`Unresolved lesson skill ${id} for ${lesson.id}.`);
    if (lesson.availability === "not-authored" && lesson.steps.length)
      errors.push(`Unauthored lesson has actionable content: ${lesson.id}.`);
    if (lesson.availability === "prototype" && !lesson.steps.length)
      errors.push(`Prototype lesson has no content: ${lesson.id}.`);
    register(
      "step",
      lesson.steps.map((s) => s.id),
    );
    for (const step of lesson.steps) {
      for (const id of step.skillIds) {
        if (!skillIds.has(id)) errors.push(`Unresolved step skill ${id} for ${step.id}.`);
        else if (!refs.includes(id))
          errors.push(`Step skill ${id} is outside lesson ${lesson.id}.`);
      }
      if (!step.prompt.trim() || !step.label.trim())
        errors.push(`Missing step content: ${step.id}.`);
      if (step.stage === "check" && step.purpose !== "formative-check")
        errors.push(`Check purpose invalid: ${step.id}.`);
      if (
        step.kind === "choice" &&
        (new Set(step.options).size !== step.options.length ||
          step.options.length < 2 ||
          !step.options.includes(step.correctAnswer))
      )
        errors.push(`Invalid choice answers: ${step.id}.`);
      if (
        step.kind === "text" &&
        (!step.acceptedAnswers.length || step.acceptedAnswers.some((a) => !a.trim()))
      )
        errors.push(`Missing accepted answers: ${step.id}.`);
      if (step.kind === "original" && (!Number.isSafeInteger(step.maxLength) || step.maxLength < 1))
        errors.push(`Invalid original-response limit: ${step.id}.`);
    }
  }
  return errors;
}
