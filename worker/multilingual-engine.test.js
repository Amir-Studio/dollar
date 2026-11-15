import test from "node:test";
import assert from "node:assert/strict";
import { analyzeMultilingualNews, runMultilingualBenchmark, MULTILINGUAL_VERSION } from "./multilingual-engine.js";

test("multilingual engine exposes a versioned, auditable benchmark", () => {
  assert.match(MULTILINGUAL_VERSION, /^dollar-multilingual-news-/);
  const result = runMultilingualBenchmark();
  assert.equal(result.total, 32);
  assert.equal(result.failed, 0, JSON.stringify(result.failures, null, 2));
  assert.equal(result.passed, 32);
  for (const lang of ["ar","zh","de","fr"]) {
    assert.equal(result.by_language[lang].total, 8);
    assert.equal(result.by_language[lang].failed, 0);
  }
});

test("Arabic parsing preserves negation, attribution and conditional modality", () => {
  const result = analyzeMultilingualNews("خبر", "إذا انخفضت أسعار النفط فقد يتراجع الدولار، وفقاً لتقرير البنك.", "ar");
  assert.equal(result.language, "ar");
  assert.equal(result.summary.conditional_count, 1);
  assert.equal(result.summary.modal_or_forecast_count, 1);
  assert.equal(result.summary.attributed_count, 1);
});

test("Chinese parsing handles script detection, numbers and negation", () => {
  const result = analyzeMultilingualNews("央行表示利率不会上升", "", null);
  assert.equal(result.language, "zh");
  assert.equal(result.sentence_frames[0].negated, true);
});

test("German and French language metadata overrides ambiguous script detection", () => {
  assert.equal(analyzeMultilingualNews("Marktbericht", "Die Bundesbank hielt den Leitzins unverändert.", "de").language, "de");
  assert.equal(analyzeMultilingualNews("Marché", "La banque centrale a maintenu le taux inchangé.", "fr").language, "fr");
});

test("unsupported or ambiguous language abstains instead of guessing", () => {
  const result = analyzeMultilingualNews("Market update", "Markets were mixed today.", null);
  assert.equal(result.language, "und");
  assert.equal(result.reading_status, "unsupported_or_ambiguous_language");
});
