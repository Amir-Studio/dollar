import test from "node:test";
import assert from "node:assert/strict";
import {
  analyzeArabicText,
  normalizeArabic,
  runArabicAcademicBenchmark,
  ARABIC_ENGINE_VERSION
} from "../worker/arabic-academic-engine.js";

test("Arabic normalization removes diacritics and standardizes Arabic numerals", () => {
  assert.equal(normalizeArabic("أَعْلَنَ ٣٫٥٪"), "اعلن 3.5٪");
});

test("MSA analysis identifies finance domain, attribution and discourse markers", () => {
  const result = analyzeArabicText("قال البنك المركزي إن التضخم ارتفع، لكن سعر الفائدة لم يتغير.");
  assert.ok(result.finance_domain.concepts.some(x => x.concept === "central_bank"));
  assert.ok(result.finance_domain.concepts.some(x => x.concept === "inflation"));
  assert.ok(result.syntax_and_discourse.features.attribution.length > 0);
  assert.ok(result.syntax_and_discourse.features.contrast.length > 0);
  assert.ok(result.syntax_and_discourse.features.negation.length > 0);
});

test("Arabic number extraction preserves decimal values and currency units", () => {
  const result = analyzeArabicText("ارتفع النفط بنسبة ٣٫٥ بالمئة إلى ٨٢ دولارا للبرميل.");
  assert.equal(result.quantities.length, 2);
  assert.equal(result.quantities[0].value, 3.5);
  assert.equal(result.quantities[1].value, 82);
});

test("Egyptian and Maghrebi colloquial markers are not silently treated as MSA", () => {
  assert.equal(analyzeArabicText("الجنيه مش مستقر والأسعار بتزيد دلوقتي.").dialect_profile.dialect, "egyptian");
  assert.equal(analyzeArabicText("واش غادي ترتفع الأسعار بزاف؟").dialect_profile.dialect, "maghrebi");
});

test("clitic and morphology outputs are explicitly marked as candidates", () => {
  const result = analyzeArabicText("وبالمصرف المركزي ستتغير الأسعار");
  assert.ok(result.clitic_analysis.length > 0);
  assert.match(result.morphology.warning, /Surface-form candidates/);
  assert.equal(result.quality.requires_human_review, true);
});

test("academic benchmark reports its limited scope and exposes all cases", () => {
  const result = runArabicAcademicBenchmark();
  assert.equal(result.version, ARABIC_ENGINE_VERSION);
  assert.equal(result.total, 12);
  assert.match(result.scope, /not an independent academic proficiency score/);
  assert.ok(Array.isArray(result.failures));
});
