import test from "node:test";
import assert from "node:assert/strict";
import {
  GERMAN_NEWS_VOCABULARY,
  GERMAN_NEWS_VOCABULARY_TARGET,
  GERMAN_NEWS_LESSON_TARGET,
  getGermanNewsVocabulary,
  runGermanNewsVocabularySelfTest
} from "./news-vocabulary-de.js";

test("German news vocabulary has unique, structurally complete entries", () => {
  const result = runGermanNewsVocabularySelfTest();
  assert.equal(result.passed, true);
  assert.equal(result.total, 100);
  assert.equal(result.unique_ids, 100);
  assert.equal(result.unique_words, 100);
});

test("German course keeps its 1,000-word / 100-lesson target explicit", () => {
  assert.equal(GERMAN_NEWS_VOCABULARY_TARGET, 1000);
  assert.equal(GERMAN_NEWS_LESSON_TARGET, 100);
  const result = getGermanNewsVocabulary();
  assert.equal(result.target_total, 1000);
  assert.equal(result.verified_entries, 100);
  assert.equal(result.available_lessons, 10);
  assert.equal(result.frequency_status, "corpus_rank_pending");
});

test("each published lesson returns ten entries and includes German morphology", () => {
  for (let lesson = 1; lesson <= 10; lesson++) {
    const result = getGermanNewsVocabulary({ lesson });
    assert.equal(result.items.length, 10);
    for (const item of result.items) {
      assert.ok(item.word);
      assert.ok(item.form);
      assert.ok(item.fa);
      assert.ok(item.ipa);
      assert.ok(item.example);
      assert.ok(item.example_fa);
      assert.equal(item.lesson, lesson);
    }
  }
});

test("search and category filters remain scoped to the German curriculum", () => {
  assert.ok(getGermanNewsVocabulary({ query: "Regierung" }).items.some(x => x.id === "de001"));
  assert.ok(getGermanNewsVocabulary({ category: "central_bank" }).items.every(x => x.category === "central_bank"));
  assert.equal(GERMAN_NEWS_VOCABULARY.some(row => row[0].startsWith("zh")), false);
});
