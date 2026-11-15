import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeMarketNewsSearchQuery,
  detectMarketNewsLocale,
  buildGoogleNewsSearchUrl,
  parseGoogleNewsSearchFeed,
  searchMarketNews
} from '../worker/news-search.js';

const now=Date.parse('2026-11-15T18:00:00.000Z');
const feedUrl='https://news.google.com/rss/search?q=gold&hl=en-US&gl=US&ceid=US:en';

test('market search accepts relevant queries and normalizes Persian variants',()=>{
  const result=normalizeMarketNewsSearchQuery('  قيمت دلار  ');
  assert.equal(result.ok,true);
  assert.equal(result.query,'قیمت دلار');
  assert.equal(normalizeMarketNewsSearchQuery('x').ok,false);
  assert.equal(normalizeMarketNewsSearchQuery('football scores').ok,false);
});

test('market search rejects non-market and control-character input',()=>{
  const result=normalizeMarketNewsSearchQuery(String.fromCharCode(0)+'gold price');
  assert.equal(result.ok,true);
  assert.equal(result.query,'gold price');
  assert.equal(normalizeMarketNewsSearchQuery('celebrity gossip').ok,false);
});

test('search locale detection supports Persian, Arabic, English, German, French and Chinese',()=>{
  assert.equal(detectMarketNewsLocale('قیمت دلار'),'fa');
  assert.equal(detectMarketNewsLocale('سعر الدولار'),'ar');
  assert.equal(detectMarketNewsLocale('gold price'),'en');
  assert.equal(detectMarketNewsLocale('Goldpreis'),'de');
  assert.equal(detectMarketNewsLocale("prix de l'or"),'fr');
  assert.equal(detectMarketNewsLocale('美元汇率'),'zh');
});

test('Google News URL encodes the query and applies the selected locale',()=>{
  const url=new URL(buildGoogleNewsSearchUrl('قیمت دلار','fa'));
  assert.equal(url.hostname,'news.google.com');
  assert.equal(url.pathname,'/rss/search');
  assert.equal(url.searchParams.get('q'),'قیمت دلار');
  assert.equal(url.searchParams.get('hl'),'fa');
  assert.equal(url.searchParams.get('ceid'),'IR:fa');
  assert.equal(new URL(buildGoogleNewsSearchUrl('Goldpreis','de')).searchParams.get('ceid'),'DE:de');
});

test('Google News RSS parser keeps fresh market results and drops unrelated, stale and future items',()=>{
  const xml=`<?xml version="1.0"?>
  <rss><channel>
    <item><title>Gold prices rise after central bank update</title><link>https://www.reuters.com/markets/gold-a</link><pubDate>Sun, 15 Nov 2026 17:55:00 GMT</pubDate><source url="https://www.reuters.com">Reuters</source><description><![CDATA[Gold markets react to new data.]]></description></item>
    <item><title>Celebrity event attracts fans</title><link>https://example.com/celeb</link><pubDate>Sun, 15 Nov 2026 17:50:00 GMT</pubDate></item>
    <item><title>Oil prices rise</title><link>https://example.com/old</link><pubDate>Sun, 01 Nov 2026 17:50:00 GMT</pubDate></item>
    <item><title>Dollar exchange rate update</title><link>https://example.com/future</link><pubDate>Mon, 16 Nov 2026 17:50:00 GMT</pubDate></item>
    <item><title>Inflation outlook</title><link>javascript:alert(1)</link><pubDate>Sun, 15 Nov 2026 17:50:00 GMT</pubDate></item>
  </channel></rss>`;
  const items=parseGoogleNewsSearchFeed(xml,feedUrl,{now,maxAgeHours:24*7,locale:'en'});
  assert.equal(items.length,1);
  assert.equal(items[0].domain,'reuters.com');
  assert.equal(items[0].source_id,'google-news-live-search');
  assert.equal(items[0].article_status,'extracted');
  assert.match(items[0].original_text,/Gold markets/);
});

test('Google News RSS parser supports Atom links',()=>{
  const xml=`<feed><entry><title>Dollar exchange rate moves</title><link href="https://www.ft.com/content/example" rel="alternate"/><updated>2026-11-15T17:30:00Z</updated></entry></feed>`;
  const items=parseGoogleNewsSearchFeed(xml,feedUrl,{now,locale:'en'});
  assert.equal(items.length,1);
  assert.equal(items[0].url,'https://www.ft.com/content/example');
});

test('live market search calls the encoded Google News endpoint and returns parsed results',async()=>{
  const xml=`<rss><channel><item><title>قیمت دلار در بازار ارز</title><link>https://example.com/usd</link><pubDate>Sun, 15 Nov 2026 17:55:00 GMT</pubDate></item></channel></rss>`;
  let calledUrl='';
  const result=await searchMarketNews('قیمت دلار',async url=>{
    calledUrl=url;
    return {ok:true,text:async()=>xml};
  },now);
  assert.equal(new URL(calledUrl).searchParams.get('q'),'قیمت دلار');
  assert.equal(new URL(calledUrl).searchParams.get('ceid'),'IR:fa');
  assert.equal(result.ok,true);
  assert.equal(result.items.length,1);
});

test('live market search reports upstream HTTP errors rather than fabricating results',async()=>{
  await assert.rejects(
    searchMarketNews('gold price',async()=>({ok:false,status:503}),now),
    /Google News search HTTP 503/
  );
});
