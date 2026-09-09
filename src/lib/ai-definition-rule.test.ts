import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  DEFINITION_SCHEMA_DESCRIPTION,
  SECOND_DEFINITION_SCHEMA_DESCRIPTION,
  definitionExampleLines,
  definitionRuleLines,
  secondDefinitionRuleLines,
} from "./ai-definition-rule.ts";

describe("the definition rule the AI paths share", () => {
  it("asks for a direct translation into the caller's definition language", () => {
    const text = definitionRuleLines("Turkish", "").join("\n");
    assert.match(text, /DIRECT TRANSLATION into Turkish/);
    assert.match(text, /a single\s+word or a very short equivalent phrase/);
  });

  it("rules out the description shapes that made this wrong twice", () => {
    const text = definitionRuleLines("English", "").join("\n");
    // The bug: grammatical, accurate prose instead of the word itself.
    assert.match(text, /never a/i);
    assert.match(text, /dictionary definition/i);
    assert.match(text, /an explanation/i);
    assert.match(text, /a description of what the term means/i);
  });

  it("keeps a same-language set usable by asking for the shortest synonym", () => {
    // term language === definition language has no translation to give; without
    // this clause the model has nothing to fall back on but a description.
    const text = definitionRuleLines("English", "").join("\n");
    assert.match(text, /already in that language.*shortest equivalent synonym/s);
  });

  it("indents every line so it can nest under a field list", () => {
    for (const line of definitionRuleLines("German", "    ")) {
      assert.ok(line.startsWith("    "), `not indented: ${line}`);
    }
    for (const line of secondDefinitionRuleLines("Turkish", "  ")) {
      assert.ok(line.startsWith("  "), `not indented: ${line}`);
    }
    for (const line of definitionExampleLines("  ")) {
      assert.ok(line.startsWith("  "), `not indented: ${line}`);
    }
  });

  it("carries the same rule into the second definition language", () => {
    const text = secondDefinitionRuleLines("Kurmancî", "").join("\n");
    assert.match(text, /Kurmancî/);
    assert.match(text, /direct translation only, never a description/i);
  });
});

describe("the worked examples", () => {
  const lines = definitionExampleLines("");

  it("pairs a CORRECT and a WRONG output for the same term", () => {
    const correct = lines.filter((line) => line.includes("CORRECT"));
    const wrong = lines.filter((line) => line.includes("WRONG"));
    assert.ok(correct.length >= 3, "expected several correct examples");
    assert.equal(correct.length, wrong.length, "every correct example needs its wrong twin");
  });

  it("shows the exact cases reported as broken", () => {
    const text = lines.join("\n");
    // "Luggage" -> "bagaj", not "Yolculuk sırasında taşınan bavul ve çantalar".
    assert.match(text, /"Luggage".*"bagaj"\s+CORRECT/);
    assert.match(text, /"Luggage".*Yolculuk sırasında taşınan.*WRONG/);
    // "Vater" -> "baba" / "the father", not a description of a parent.
    assert.match(text, /"Vater".*"baba"\s+CORRECT/);
    assert.match(text, /"Vater".*"the father"\s+CORRECT/);
    assert.match(text, /"Vater".*"the male parent of a child"\s+WRONG/);
  });

  it("labels every wrong example as a description, so the reason is explicit", () => {
    for (const line of lines.filter((l) => l.includes("WRONG"))) {
      assert.match(line, /\(a description\)/, `unexplained wrong example: ${line}`);
    }
  });
});

describe("the Gemini responseSchema descriptions", () => {
  it("state the translation rule on both definition fields", () => {
    assert.match(DEFINITION_SCHEMA_DESCRIPTION, /DIRECT TRANSLATION/);
    assert.match(DEFINITION_SCHEMA_DESCRIPTION, /Never a dictionary definition/);
    assert.match(SECOND_DEFINITION_SCHEMA_DESCRIPTION, /direct translation only/);
    assert.match(SECOND_DEFINITION_SCHEMA_DESCRIPTION, /never a\s+description/);
  });
});
