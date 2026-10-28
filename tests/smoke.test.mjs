import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const js = readFileSync(new URL('../assets/site.js', import.meta.url), 'utf8');
const aiJs = readFileSync(new URL('../assets/ai.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../assets/site.css', import.meta.url), 'utf8');
const worker = readFileSync(new URL('../worker/index.js', import.meta.url), 'utf8');

test('homepage references external stylesheet and deferred scripts', () => {
  assert.match(html, /href="assets\/site\.css/);
  assert.match(html, /src="assets\/site\.js[^"]*" defer/);
  assert.match(html, /src="assets\/ai\.js[^"]*" defer/);
  assert.ok(!/<style>/i.test(html), 'inline styles should stay out of the document');
  assert.ok(!/<script>/.test(html), 'inline application JS should stay out of the document');
});

test('market chart is the first content section and key tools exist', () => {
  assert.ok(html.indexOf('id="charts"') < html.indexOf('id="markets"'), 'chart should appear before market cards');
  for (const id of ['markets', 'charts', 'ai-market', 'tools', 'watchlist', 'methodology']) {
    assert.ok(html.includes('id="' + id + '"'), 'missing section: ' + id);
  }
  for (const id of ['chartAsset', 'historyChart', 'forecastValue', 'amount', 'fromCurrency', 'toCurrency', 'weight', 'purity', 'goldCalc']) {
    assert.ok(html.includes('id="' + id + '"'), 'missing tool control: ' + id);
  }
});

test('chart forecast uses live AI endpoint when configured and labels statistical fallback honestly', () => {
  assert.match(js, /dollar_ai_worker_endpoint_v1/);
  assert.match(js, /loadAiForecast/);
  assert.match(js, /aiForecast\.target_price/);
  assert.match(js, /خط زرد/);
  assert.match(aiJs, /dollar-ai-endpoint-updated/);
  assert.match(html, /id="forecastLegendText"/);
  assert.match(html, /id="chartNoteText"/);
  assert.doesNotMatch(js, /Math\.random/, 'do not synthesize market prices');
});

test('news intelligence backend checks fresh quotes and provides source links', () => {
  assert.match(worker, /type:"web_search"/);
  assert.match(worker, /OPENAI_API_KEY/);
  assert.match(worker, /aiChange\*0\.65\+baselineChange\*0\.35/);
  assert.match(worker, /sources:citations\(resp\)/);
  assert.match(worker, /45\*60\*1000/);
  assert.match(worker, /range_low/);
  assert.match(worker, /tool_choice:"required"/);
});

test('market data limitations and risk disclosure are visible', () => {
  assert.ok(html.includes('id="marketStatus"'), 'market data status should exist');
  assert.match(html, /توصیهٔ سرمایه‌گذاری|توصیهٔ خریدوفروش/);
  assert.match(js, /staleItem/);
  assert.match(js, /TGJU/);
});

test('support pages, brand asset, and Worker deployment files exist', () => {
  for (const file of ['about.html', 'sources.html', 'contact.html', 'privacy.html', 'assets/brand.svg', 'worker/wrangler.toml', '.github/workflows/deploy-worker.yml']) {
    assert.ok(existsSync(new URL('../' + file, import.meta.url)), 'missing ' + file);
  }
});

test('application JavaScript parses', () => {
  assert.doesNotThrow(() => new Function(js));
  assert.doesNotThrow(() => new Function(aiJs));
});

test('stylesheet contains mobile responsive breakpoints', () => {
  assert.match(css, /@media\s*\(max-width:\s*900px\)/);
  assert.match(css, /@media\s*\(max-width:\s*680px\)/);
});
