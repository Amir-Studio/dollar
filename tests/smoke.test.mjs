import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const js = readFileSync(new URL('../assets/site.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../assets/site.css', import.meta.url), 'utf8');

test('homepage references external stylesheet and deferred script', () => {
  assert.match(html, /href="assets\/site\.css"/);
  assert.match(html, /src="assets\/site\.js" defer/);
  assert.ok(!/<style>/i.test(html), 'inline styles should stay out of the document');
  assert.ok(!/<script>/.test(html), 'inline application JS should stay out of the document');
});

test('essential product sections and calculators exist', () => {
  for (const id of ['markets', 'tools', 'watchlist', 'insights', 'methodology']) {
    assert.ok(html.includes('id="' + id + '"'), 'missing section: ' + id);
  }
  for (const id of ['amount', 'fromCurrency', 'toCurrency', 'weight', 'purity', 'goldCalc']) {
    assert.ok(html.includes('id="' + id + '"'), 'missing tool control: ' + id);
  }
});

test('data limitations are disclosed', () => {
  assert.match(html, /Historical series not connected/i);
  assert.match(html, /not investment, trading, tax or legal advice/i);
  assert.match(html, /local-market/i);
  assert.match(js, /31\.1034768/);
  assert.doesNotMatch(js, /Math\.sin|Math\.cos/, 'do not generate synthetic market series');
});

test('support pages and brand asset exist', () => {
  for (const file of ['about.html', 'sources.html', 'contact.html', 'privacy.html', 'assets/brand.svg']) {
    assert.ok(existsSync(new URL('../' + file, import.meta.url)), 'missing ' + file);
  }
});

test('application JavaScript parses', () => {
  assert.doesNotThrow(() => new Function(js));
});

test('stylesheet contains mobile responsive breakpoints', () => {
  assert.match(css, /@media\s*\(max-width:\s*850px\)/);
  assert.match(css, /@media\s*\(max-width:\s*520px\)/);
});
