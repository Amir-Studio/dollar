import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);

test("browser vocabulary data exports 100 structured lesson objects", () => {
  const file = new URL("../assets/german-news-vocabulary-data.js", import.meta.url);
  const source = readFileSync(file, "utf8");
  const context = { window: {} };
  vm.runInNewContext(source, context);
  const words = context.window.GERMAN_NEWS_VOCABULARY;
  assert.equal(words.length, 100);
  assert.equal(words[0].id, "de001");
  assert.equal(words[0].lesson, 1);
  assert.equal(words[99].id, "de100");
  assert.equal(words[99].lesson, 10);
  assert.ok(words.every(w => w.word && w.form && w.fa && w.ipa && w.example && w.example_fa && w.dictionary_url));
});

test("German course browser script passes Node syntax validation", () => {
  execFileSync(process.execPath, ["--check", fileURLToPath(new URL("../assets/german-news-vocabulary.js", import.meta.url))]);
});
