import test from "node:test";
import assert from "node:assert/strict";
import {
  CHINESE_NEWS_VOCABULARY,
  getChineseNewsVocabulary,
  runChineseNewsVocabularySelfTest
} from "./news-vocabulary-zh.js";

test("Chinese news vocabulary batch has 100 unique specialist entries", () => {
  assert.equal(CHINESE_NEWS_VOCABULARY.length, 100);
  assert.equal(new Set(CHINESE_NEWS_VOCABULARY.map(x => x[0])).size, 100);
  assert.equal(new Set(CHINESE_NEWS_VOCABULARY.map(x => x[3])).size, 100);
});

test("all vocabulary entries have Chinese, pinyin, English and Persian fields", () => {
  for (const row of CHINESE_NEWS_VOCABULARY) {
    assert.equal(row.length, 6);
    assert.match(row[3], /[\u3400-\u9fff]/);
    assert.ok(row[4].length > 0);
    assert.ok(row[5].length > 0);
  }
});

test("category and query filters return relevant vocabulary", () => {
  const economics = getChineseNewsVocabulary({ category: "macroeconomics" });
  assert.equal(economics.items.length, 20);
  assert.ok(economics.items.every(x => x.category === "macroeconomics"));
  const search = getChineseNewsVocabulary({ query: "sanctions" });
  assert.ok(search.items.length === 0); // sanctions is not in this first tranche
  const politics = getChineseNewsVocabulary({ category: "politics" });
  assert.equal(politics.items.length, 10);
});

test("self-test reports structural quality without claiming translation certification", () => {
  const result = runChineseNewsVocabularySelfTest();
  assert.equal(result.total, 100);
  assert.equal(result.passed, true);
  assert.match(result.scope, /native-speaker review/);
});
