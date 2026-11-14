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
  assert.equal(claim.domain, 'www.example.com');
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
