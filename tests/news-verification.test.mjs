import test from 'node:test';
import assert from 'node:assert/strict';
import { extractNewsClaim, verifyNewsItems, buildGdeltQuery, compareClaimToSearchEvidence } from '../worker/news-verification-engine.js';

const day = '2026-11-14T10:00:00.000Z';
const item = (title, domain, url, published_at=day) => ({title,domain,url,published_at});

test('opposing market headlines are flagged as a potential contradiction, not a truth verdict', () => {
  const result = verifyNewsItems([
    item('قیمت دلار افزایش یافت', 'one.example', 'https://one.example/a'),
    item('قیمت دلار کاهش یافت', 'two.example', 'https://two.example/b')
  ]);
  assert.equal(result.conflicts.length, 1);
  assert.equal(result.conflicts[0].relation, 'contradicts');
  assert.equal(result.conflicts[0].status, 'potential_conflict_requires_full_text_review');
  assert.equal(result.claims[0].verdict, 'single_independent_signal');
});

test('same direction across independent publishers is corroboration only at headline level', () => {
  const result = verifyNewsItems([
    item('قیمت نفت افزایش یافت', 'one.example', 'https://one.example/a'),
    item('قیمت نفت رشد کرد', 'two.example', 'https://two.example/b'),
    item('نفت با افزایش قیمت همراه شد', 'three.example', 'https://three.example/c')
  ]);
  assert.ok(result.claims[0].verdict.includes('corroborated'));
  assert.equal(result.claims[0].confidence_band, 'moderate');
  assert.match(result.claims[0].verdict_caution, /اثبات حقیقت نیست/);
});

test('same publisher and syndicated copies do not count as independent corroboration', () => {
  const result = verifyNewsItems([
    item('قیمت دلار افزایش یافت', 'one.example', 'https://one.example/a'),
    item('قیمت دلار افزایش یافت', 'one.example', 'https://one.example/b'),
    item('قیمت دلار افزایش یافت', 'two.example', 'https://two.example/c')
  ]);
  assert.equal(result.claims[0].verdict, 'single_independent_signal');
});

test('different publication dates are not automatically treated as contradiction', () => {
  const result = verifyNewsItems([
    item('قیمت دلار افزایش یافت', 'one.example', 'https://one.example/a', '2026-11-13T10:00:00Z'),
    item('قیمت دلار کاهش یافت', 'two.example', 'https://two.example/b', '2026-11-14T10:00:00Z')
  ]);
  assert.equal(result.conflicts.length, 0);
});

test('numeric disagreement is flagged only when the same unit and metric align', () => {
  const result = verifyNewsItems([
    item('قیمت نفت برنت به ۷۰ دلار رسید', 'one.example', 'https://one.example/a'),
    item('قیمت نفت برنت به ۷۵ دلار رسید', 'two.example', 'https://two.example/b')
  ]);
  assert.equal(result.conflicts.length, 1);
  assert.equal(result.conflicts[0].relation, 'numeric_disagreement');
});

test('non-checkable headlines abstain rather than receiving a fabricated verdict', () => {
  const result = verifyNewsItems([
    item('گزارش تازه از وضعیت اقتصاد منتشر شد', 'one.example', 'https://one.example/a')
  ]);
  assert.equal(result.claims[0].verdict, 'not_checkable_from_headline');
  assert.equal(result.claims[0].confidence_band, 'none');
});

test('Persian digits and source provenance are normalized', () => {
  const claim = extractNewsClaim(item('قیمت نفت برنت به ۷۰ دلار رسید', 'www.example.com', 'https://www.example.com/a'));
  assert.equal(claim.domain, 'example.com');
  assert.equal(claim.numbers[0].value, 70);
  assert.equal(claim.source_class, 'publisher_unrated');
});

test('GDELT query builder keeps claim terms and removes generic filler', () => {
  const query = buildGdeltQuery('گزارش تازه درباره افزایش نرخ بهره بانک مرکزی ایران');
  assert.match(query, /نرخ/);
  assert.match(query, /بهره/);
  assert.doesNotMatch(query, /گزارش/);
});

test('claim search comparison allows older retrieved evidence when claim has no explicit date', () => {
  const result = compareClaimToSearchEvidence('قیمت دلار افزایش یافت', [
    item('قیمت دلار افزایش یافت', 'one.example', 'https://one.example/a', '2026-11-12T10:00:00Z'),
    item('قیمت دلار رشد کرد', 'two.example', 'https://two.example/b', '2026-11-13T10:00:00Z')
  ]);
  assert.equal(result.verdict, 'corroborated_by_retrieved_headlines');
  assert.equal(result.supporting_count, 2);
});


test('news verification API searches GDELT and exposes linked evidence without overstating certainty', async () => {
  const worker = (await import('../worker/index.js')).default;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input) => {
    const url = String(input);
    assert.match(url, /api\.gdeltproject\.org\/api\/v2\/doc\/doc/);
    assert.match(url, /mode=ArtList/);
    return new Response(JSON.stringify({articles:[
      {title:'قیمت دلار افزایش یافت',url:'https://one.example/news/a',domain:'one.example',seendate:'20261113T100000Z'},
      {title:'قیمت دلار رشد کرد',url:'https://two.example/news/b',domain:'two.example',seendate:'20261113T110000Z'}
    ]}),{status:200,headers:{'content-type':'application/json'}});
  };
  try {
    const response=await worker.fetch(new Request('https://worker.example/news/verify?claim='+encodeURIComponent('قیمت دلار افزایش یافت')), {});
    assert.equal(response.status,200);
    const body=await response.json();
    assert.equal(body.search_provider,'GDELT DOC 2.0');
    assert.equal(body.verdict,'corroborated_by_retrieved_headlines');
    assert.equal(body.supporting_count,2);
    assert.ok(body.evidence.every(x=>x.url.startsWith('https://')));
    assert.match(body.caution,/نمی‌تواند خبر را قطعی درست یا دروغ اعلام کند/);
  } finally {
    globalThis.fetch=originalFetch;
  }
});

test('news verification API abstains when internet search is unavailable', async () => {
  const worker = (await import('../worker/index.js')).default;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response('rate limited',{status:429,headers:{'content-type':'text/plain'}});
  try {
    const response=await worker.fetch(new Request('https://worker.example/news/verify?claim='+encodeURIComponent('قیمت دلار افزایش یافت')), {});
    assert.equal(response.status,503);
    const body=await response.json();
    assert.equal(body.verdict,'search_unavailable');
  } finally {
    globalThis.fetch=originalFetch;
  }
});


test('Persian negation does not invert or double-count direction words', () => {
  const didNotRise=extractNewsClaim(item('قیمت دلار افزایش نیافت','one.example','https://one.example/a'));
  const didNotFall=extractNewsClaim(item('قیمت دلار کاهش نیافت','two.example','https://two.example/b'));
  assert.equal(didNotRise.polarity,'negative');
  assert.equal(didNotFall.polarity,'positive');
});
