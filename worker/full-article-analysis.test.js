import test from "node:test";
import assert from "node:assert/strict";
import { analyzeMarketLanguage } from "./language-engine.js";

test("global corpus analysis reads full article bodies beyond the normal excerpt cap", () => {
  const sentence = "The central bank said inflation may remain elevated, while officials review the latest economic data.";
  const body = Array.from({ length: 70 }, () => sentence).join(" ");
  const result = analyzeMarketLanguage([{
    title: "Central bank economic update",
    original_title: "Central bank economic update",
    original_text: body,
    full_text_mode: true,
    language_code: "en",
    published_at: "2026-11-15T00:00:00Z"
  }]);
  const article = result.per_news[0];
  assert.equal(article.content_chars, body.length);
  assert.equal(article.input_mode, "full_article");
  assert.equal(article.reading_comprehension.input_coverage.body_chars, body.length);
  assert.equal(article.reading_comprehension.input_coverage.mode, "headline_plus_full_article");
  assert.equal(article.reading_comprehension.reading_status, "parsed_full_article");
  assert.ok(article.reading_comprehension.sentence_frames.length > 30);
});

test("ordinary news analysis retains its bounded excerpt input", () => {
  const body = "The central bank reviewed the economy. ".repeat(200);
  const result = analyzeMarketLanguage([{
    title: "Central bank update",
    original_text: body,
    language_code: "en"
  }]);
  assert.equal(result.per_news[0].content_chars, 3000);
  assert.equal(result.per_news[0].input_mode, "headline_plus_rss_excerpt");
});
