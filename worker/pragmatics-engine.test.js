import test from "node:test";
import assert from "node:assert/strict";
import {
  analyzePragmatics,
  runPragmaticsBenchmark,
  PRAGMATICS_VERSION,
  PRAGMATICS_PHRASE_COUNT
} from "./pragmatics-engine.js";

test("pragmatics dictionary contains 100 bilingual examples", () => {
  assert.equal(PRAGMATICS_PHRASE_COUNT, 100);
  assert.equal(runPragmaticsBenchmark().total, 100);
});

test("curated phrase-recognition benchmark has no missed dictionary entries", () => {
  const result = runPragmaticsBenchmark();
  assert.equal(result.passed, 100);
  assert.equal(result.score_pct, 100);
  assert.equal(result.persian.total, 50);
  assert.equal(result.english.total, 50);
});

test("Persian idiom returns figurative meaning rather than literal reading", () => {
  const result = analyzePragmatics("از کاه کوه ساختن", "fa");
  assert.ok(result.categories.includes("idiom"));
  assert.match(result.possible_intent_fa, /بزرگ‌نمایی/);
});

test("indirect requests are marked as context-dependent", () => {
  const result = analyzePragmatics("اینجا کمی سرد است", "fa");
  assert.ok(result.categories.includes("indirect_request"));
  assert.equal(result.interpretation_status, "context_required");
  assert.equal(result.requires_more_context, true);
});

test("ambiguous short replies do not receive a forced single interpretation", () => {
  const result = analyzePragmatics("باشه", "fa");
  assert.equal(result.interpretation_status, "ambiguous_multiple_readings");
  assert.match(result.possible_intent_fa, /چند برداشت/);
});

test("English sarcasm candidates are not treated as certain emotion", () => {
  const result = analyzePragmatics("brilliant move", "en");
  assert.ok(result.categories.includes("sarcasm"));
  assert.equal(result.requires_more_context, true);
  assert.match(result.safety_rule, /قطعی اعلام نکن/);
});

test("ordinary literal text is not forced into a figurative category", () => {
  const result = analyzePragmatics("The market opened on Monday.", "en");
  assert.deepEqual(result.categories, []);
  assert.equal(result.interpretation_status, "no_known_marker");
});

test("module version is explicit", () => {
  assert.match(PRAGMATICS_VERSION, /^dollar-pragmatics-/);
});
