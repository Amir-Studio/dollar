import test from "node:test";
import assert from "node:assert/strict";
import { NEWS_SOURCES } from "./news-sources.js";

test("exactly 50 curated news feeds are configured", () => {
  assert.equal(NEWS_SOURCES.length, 50);
});
test("all feed IDs and URLs are unique and valid", () => {
  const ids=NEWS_SOURCES.map(x=>x.source_id);
  const urls=NEWS_SOURCES.map(x=>x.feed_url);
  assert.equal(new Set(ids).size,50);
  assert.equal(new Set(urls).size,50);
  for(const source of NEWS_SOURCES) {
    assert.ok(source.source_id && source.name && source.country_code);
    assert.ok(["fa","en","ar","zh","de","fr"].includes(source.language_code));
    assert.equal(new URL(source.feed_url).protocol.startsWith("http"),true);
    assert.equal(source.active,true);
  }
});
test("all six requested languages have multiple sources", () => {
  const counts=Object.fromEntries(["fa","en","ar","zh","de","fr"].map(code=>[code,NEWS_SOURCES.filter(x=>x.language_code===code).length]));
  assert.deepEqual(counts,{fa:8,en:9,ar:8,zh:8,de:8,fr:9});
});
