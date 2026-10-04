import type { LesenMatchingPassage, LesenMatchOption } from "./lesen-types";
/** B1 matching includes a legitimate 0/no-fit answer omitted from the ad pool. */
export function matchingOptions(passage: LesenMatchingPassage): LesenMatchOption[] {
  return passage.targets.some((target) => target.correctOptionId === "0") &&
    !passage.options.some((option) => option.id === "0")
    ? [...passage.options, { id: "0", shortLabel: "0 — No matching option" }]
    : passage.options;
}
