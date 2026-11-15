import test from "node:test";
import assert from "node:assert/strict";
import {
  CHINESE_NEWS_VOCABULARY,
  getChineseNewsVocabulary,
  runChineseNewsVocabularySelfTest
} from "./news-vocabulary-zh.js";

test("Chinese news vocabulary has 600 unique specialist entries", () => {
  assert.equal(CHINESE_NEWS_VOCABULARY.length, 600);
  assert.equal(new Set(CHINESE_NEWS_VOCABULARY.map(x => x[0])).size, 600);
  assert.equal(new Set(CHINESE_NEWS_VOCABULARY.map(x => x[3])).size, 600);
});

test("all vocabulary entries have Chinese, pinyin, English and Persian fields", () => {
  for (const row of CHINESE_NEWS_VOCABULARY) {
    assert.equal(row.length, 6);
    assert.match(row[3], /[\u3600-\u9fff]/);
    assert.ok(row[4].length > 0);
    assert.ok(row[5].length > 0);
  }
});

test("category and query filters return relevant vocabulary", () => {
  const economics = getChineseNewsVocabulary({ category: "macroeconomics" });
  assert.equal(economics.items.length, 30);
  assert.ok(economics.items.every(x => x.category === "macroeconomics"));
  const search = getChineseNewsVocabulary({ query: "sanctions" });
  assert.ok(search.items.length === 18); // sanctions terms are in the second tranche
  const politics = getChineseNewsVocabulary({ category: "politics" });
  assert.equal(politics.items.length, 10);
  const fx = getChineseNewsVocabulary({ category: "foreign_exchange" });
  assert.equal(fx.items.length, 10);
  assert.ok(fx.items.some(x => x.english === "currency depreciation"));
});

test("self-test reports structural quality without claiming translation certification", () => {
  const result = runChineseNewsVocabularySelfTest();
  assert.equal(result.total, 600);
  assert.equal(result.passed, true);
  assert.match(result.scope, /native-speaker review/);
});

test("second Chinese vocabulary batch passes structural checks", async () => {
  const { runChineseVocabularyBatch2SelfTest } = await import("./news-vocabulary-zh-batch-2.js");
  const result = runChineseVocabularyBatch2SelfTest();
  assert.equal(result.total, 100);
  assert.equal(result.passed, true);
  assert.equal(result.unique_ids, 100);
  assert.equal(result.unique_chinese_terms, 100);
});

test("third Chinese vocabulary batch passes structural checks", async () => {
  const { runChineseVocabularyBatch3SelfTest } = await import("./news-vocabulary-zh-batch-3.js");
  const result = runChineseVocabularyBatch3SelfTest();
  assert.equal(result.total, 100);
  assert.equal(result.passed, true);
  assert.equal(result.unique_ids, 100);
  assert.equal(result.unique_chinese_terms, 100);
});

test("fourth Chinese vocabulary batch passes structural checks", async () => {
  const { runChineseVocabularyBatch4SelfTest } = await import("./news-vocabulary-zh-batch-4.js");
  const result = runChineseVocabularyBatch4SelfTest();
  assert.equal(result.total, 80);
  assert.equal(result.passed, true);
  assert.equal(result.unique_ids, 80);
  assert.equal(result.unique_chinese_terms, 80);
});

test("fifth Chinese vocabulary batch passes structural checks", async () => {
 const { runChineseVocabularyBatch5SelfTest } = await import("./news-vocabulary-zh-batch-5.js");
 const r=runChineseVocabularyBatch5SelfTest(); assert.equal(r.total,100); assert.equal(r.passed,true);
});
test("sixth Chinese vocabulary batch passes structural checks", async () => {
 const { runChineseVocabularyBatch6SelfTest } = await import("./news-vocabulary-zh-batch-6.js");
 const r=runChineseVocabularyBatch6SelfTest(); assert.equal(r.total,100); assert.equal(r.passed,true);
});
