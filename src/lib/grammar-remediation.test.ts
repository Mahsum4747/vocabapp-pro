import assert from "node:assert/strict";
import test from "node:test";
import {
  DIAGNOSTIC_TARGET_TOPICS,
  REMEDIATION_RECHECK_DELAY_MS,
  remediationNextReviewAt,
} from "./grammar-remediation";

test("narrow diagnostic targets map to reviewed reference topics", () => {
  assert.equal(DIAGNOSTIC_TARGET_TOPICS["DE.GRAMMAR.LEXICAL.HELFEN_DAT"], "helfen-dativ");
  assert.equal(DIAGNOSTIC_TARGET_TOPICS["DE.GRAMMAR.PREPOSITION.MIT_DAT"], "mit-dativ");
});

test("remediation schedules a conservative 24-hour recheck", () => {
  const at = 1_790_000_000_000;
  assert.equal(REMEDIATION_RECHECK_DELAY_MS, 24 * 60 * 60 * 1000);
  assert.equal(remediationNextReviewAt(at), at + REMEDIATION_RECHECK_DELAY_MS);
});
