import test from 'node:test';
import assert from 'node:assert/strict';
import { buildForecast, isMarketRelevantHeadline, headlineConflictCandidates, getMarketSnapshot, directionMatches, buildForecastErrorDiagnostic } from '../worker/forecast-engine.js';

const DAY = 86_400_000;
function series(count, dailyLogReturn) {
  const start = Date.UTC(2025, 0, 1);
  return Array.from({length:count}, (_,i) => ({
    t: start + i*DAY,
    p: 100000 * Math.exp(dailyLogReturn*i + 0.00015*Math.sin(i*1.7))
  }));
}

test('forecast refuses to publish when history is below the production minimum', () => {
  const points = series(299, 0.0025);
  const result = buildForecast(points, points.at(-1).p, 1);
  assert.equal(result.eligible, false);
  assert.equal(result.required, 300);
  assert.equal(result.observations, 299);
});

test('flat series records a neutral baseline for calibration without inventing a directional signal', () => {
  const start = Date.UTC(2025, 0, 1);
  const points = Array.from({length:360}, (_,i) => ({ t:start+i*DAY, p:100000 }));
  const result = buildForecast(points, 100000, 1);
  assert.equal(result.eligible, true);
  assert.equal(result.forecast_mode, 'baseline_only');
  assert.equal(result.predicted_change_pct, 0);
  assert.equal(result.validation.samples >= 30, true);
  assert.equal(result.validation.directional_signal, false);
  assert.match(result.validation.reason, /بدون تغییر/);
});

test('walk-forward ensemble can qualify on a stable synthetic trend and returns an uncertainty band', () => {
  const points = series(600, 0.0025);
  const result = buildForecast(points, points.at(-1).p, 7);
  assert.equal(result.eligible, true, result.reason || 'Expected stable trend to beat the no-change baseline');
  assert.equal(result.horizon_days, 7);
  assert.ok(result.predicted_price > 0);
  assert.ok(result.lower_price < result.predicted_price);
  assert.ok(result.upper_price > result.predicted_price);
  assert.ok(result.validation.samples >= 30);
  assert.ok(result.validation.skill_vs_no_change_pct >= 2);
  assert.equal(result.validation.evaluation_method, 'non_overlapping_rolling_origin_maturity_guard');
  assert.equal(result.validation.overlapping_test_windows, false);
  assert.ok(result.validation.effective_horizon_days.min >= 7);
  assert.ok(result.validation.effective_horizon_days.max <= 8.5);
  assert.equal(result.validation.target_tolerance_days, 1.5);
});


test('news relevance filter keeps market headlines and rejects unrelated or incident-only headlines', () => {
  assert.equal(isMarketRelevantHeadline('قیمت نفت کاهش یافت'), true);
  assert.equal(isMarketRelevantHeadline('US Treasury warns against rate hikes during Iran energy shock'), true);
  assert.equal(isMarketRelevantHeadline('ایجاد کارگاه اشتغال برای ۳۰۰ نفر'), false);
  assert.equal(isMarketRelevantHeadline('مسابقات فوتبال لیگ برتر برگزار شد'), false);
  assert.equal(isMarketRelevantHeadline('گزارش حادثه مسلحانه در شهر'), false);
});

test('headline conflict screening flags only cross-publisher candidates for human review', () => {
  const candidates = headlineConflictCandidates([
    { title: 'قیمت دلار افزایش یافت و به ۲۶۸ هزار تومان رسید', domain: 'source-a.example' },
    { title: 'قیمت دلار کاهش یافت و به ۲۶۵ هزار تومان رسید', domain: 'source-b.example' }
  ]);
  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].status, 'needs_human_review');
  assert.ok(candidates[0].signals.includes('opposing_direction_words'));
});

test('NerkhAra snapshot is normalized with provider quality metadata and UTC timestamps', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({
    generated_utc: '2026-11-14T10:00:00',
    items: [
      { id: 'usd', price: 268200, unit: 'IRT', updated_utc: '2026-11-14T09:55:00', stale: false, sources: 2, spread_pct: 0.8, method: 'average' },
      { id: 'eur', price: 296800, unit: 'IRT', updated_utc: '2026-11-14T09:55:00', stale: false, sources: 2, spread_pct: 0.7, method: 'average' },
      { id: 'gold-18k', price: 25400881, unit: 'IRT', updated_utc: '2026-11-14T09:55:00', stale: false, sources: 1, spread_pct: null, method: 'lead' },
      { id: 'coin-emami', price: 254232500, unit: 'IRT', updated_utc: '2026-11-14T09:55:00', stale: false, sources: 1, spread_pct: null, method: 'lead' }
    ]
  }), { status: 200, headers: { 'content-type': 'application/json' } });
  try {
    const snapshot = await getMarketSnapshot({ NERKHARA_URL: 'https://example.test/latest.json' });
    assert.equal(snapshot.data.length, 4);
    const usd = snapshot.data.find(item => item.symbol === 'USD_IRR_FREE');
    assert.equal(usd.price, 268200);
    assert.equal(usd.provider_meta.source_count, 2);
    assert.equal(usd.timestamp, '2026-11-14T09:55:00.000Z');
  } finally {
    globalThis.fetch = originalFetch;
  }
});


test('forecast direction scoring uses persisted direction and production deadband', () => {
  assert.equal(directionMatches(0.11, 'up'), true);
  assert.equal(directionMatches(-0.11, 'down'), true);
  assert.equal(directionMatches(0.1, 'sideways'), true);
  assert.equal(directionMatches(-0.1, 'sideways'), true);
  assert.equal(directionMatches(0.11, 'down'), false);
  assert.equal(directionMatches(0.11, null), false);
  assert.equal(directionMatches(Number.NaN, 'up'), false);
});


test('buildForecastErrorDiagnostic records error decomposition and cautious evidence candidates', () => {
  const diagnostic = buildForecastErrorDiagnostic({
    id: 'forecast-1', asset: 'USD_IRR_FREE', horizon_days: 1, model_version: 'test-v1',
    reference_price: 100, predicted_price: 110, predicted_change_pct: 10, actual_price: 105, direction_correct: true,
    validation: {
      forecast_mode: 'adaptive_directional', quote_age_hours: 8,
      quote_quality: { source_count: 1, spread_pct: 2.5 },
      news_context: { source_count: 1, headline_count: 0, event_risk_score: 55 },
      selected_models: ['trend_15']
    }
  });
  assert.equal(diagnostic.forecast_id, 'forecast-1');
  assert.equal(diagnostic.error_metrics.absolute_error_pct, 4.54545);
  assert.equal(diagnostic.error_metrics.no_change_error_pct, 5);
  assert.equal(diagnostic.error_metrics.improvement_vs_no_change_pct, 9.091);
  assert.equal(diagnostic.contributing_factors.live_bias_applied, false);
  assert.ok(diagnostic.root_cause_candidates.some(x => x.code === 'quote_age_elevated'));
  assert.ok(diagnostic.root_cause_candidates.every(x => x.causal === false && x.confidence === 'low'));
});

test('buildForecastErrorDiagnostic refuses incomplete or invalid price rows', () => {
  assert.equal(buildForecastErrorDiagnostic({ reference_price: 100, predicted_price: 110, actual_price: 105 }), null);
  assert.equal(buildForecastErrorDiagnostic({ id: 'x', reference_price: 0, predicted_price: 110, actual_price: 105 }), null);
});
