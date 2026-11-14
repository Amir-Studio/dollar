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

test("quoted sarcasm expression is treated as mention, not speaker intent", () => {
  const result = analyzePragmatics('She wrote “brilliant move” in her review.', "en");
  assert.equal(result.interpretation_status, "quoted_mention_not_intent");
  assert.equal(result.signals.length, 0);
});

test("negated sarcasm candidate is not classified as sarcasm intent", () => {
  const result = analyzePragmatics("That was not a brilliant move.", "en");
  assert.equal(result.categories.includes("sarcasm"), false);
});

test("word-boundary matching avoids false positives inside longer words", () => {
  const result = analyzePragmatics("Please define the term clearly.", "en");
  assert.equal(result.categories.includes("ambiguity"), false);
});

test("negative surrounding context supports an irony candidate without claiming certainty", () => {
  const result = analyzePragmatics("چه به موقع رسیدی", "fa", "سه ساعت دیر رسیدی و همه منتظر ماندند.");
  assert.equal(result.interpretation_status, "context_supported_candidate");
  assert.equal(result.context_supports_irony_candidate, true);
  assert.equal(result.confidence_is_calibrated, false);
});

test("neutral context does not turn an irony phrase into a confirmed sarcastic intent", () => {
  const result = analyzePragmatics("چه به موقع رسیدی", "fa", "امروز قرار است جلسه برگزار شود.");
  assert.equal(result.interpretation_status, "context_required");
  assert.equal(result.requires_more_context, true);
});

test("context-only expressions are not incorrectly reported as words spoken in the headline", () => {
  const result = analyzePragmatics("The meeting is today.", "en", "They said it was a piece of cake.");
  assert.equal(result.signals.length, 0);
  assert.equal(result.context_signals.length, 1);
});

test("an ambiguous Persian reply retains multiple possible readings", () => {
  const result = analyzePragmatics("باشه", "fa", "بعد از یک اختلاف نظر طولانی");
  assert.equal(result.interpretation_status, "ambiguous_multiple_readings");
  assert.ok(result.alternative_readings.length > 0);
});
