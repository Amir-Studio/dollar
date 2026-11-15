import test from "node:test";
import assert from "node:assert/strict";
import { COUNTRY_NEWS_SOURCES, NEWS_DAILY_QUOTAS, validateCountryNewsSources } from "./country-news-sources.js";

test("priority source registry contains Iran, US, and exactly 16 other countries",()=>{
  const report=validateCountryNewsSources();
  assert.equal(report.passed,true,JSON.stringify(report.errors));
  assert.equal(COUNTRY_NEWS_SOURCES.length,18);
  assert.equal(new Set(COUNTRY_NEWS_SOURCES.map(x=>x.country_code)).size,18);
  assert.deepEqual(new Set(COUNTRY_NEWS_SOURCES.map(x=>x.country_code)),new Set(Object.keys(NEWS_DAILY_QUOTAS)));
});

test("daily news quotas total 72 and match requested allocation",()=>{
  assert.equal(NEWS_DAILY_QUOTAS.IR,30);
  assert.equal(NEWS_DAILY_QUOTAS.US,10);
  const otherCountries=Object.entries(NEWS_DAILY_QUOTAS).filter(([code])=>code!=="IR"&&code!=="US");
  assert.equal(otherCountries.length,16);
  assert.ok(otherCountries.every(([,quota])=>quota===2));
  assert.equal(Object.values(NEWS_DAILY_QUOTAS).reduce((sum,value)=>sum+value,0),72);
});

test("every active priority feed uses HTTPS and has a distinct source id",()=>{
  assert.equal(new Set(COUNTRY_NEWS_SOURCES.map(x=>x.source_id)).size,18);
  for(const source of COUNTRY_NEWS_SOURCES){
    assert.equal(new URL(source.feed_url).protocol,"https:");
    assert.equal(source.active,true);
  }
});
