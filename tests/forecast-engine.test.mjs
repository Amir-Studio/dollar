import test from 'node:test';
import assert from 'node:assert/strict';
import { buildForecast, isMarketRelevantHeadline, headlineConflictCandidates, getMarketSnapshot } from '../worker/forecast-engine.js';
import { robustBiasCalibration, analyzeForecastErrors, diagnoseForecastRow } from '../worker/learning-engine.js';

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

test('robust feedback requires 60 matured forecasts and rejects unstable training bias', () => {
  const tooFew = Array.from({length:59}, (_,i) => ({predicted_price:100,actual_price:101,actual_at:new Date(Date.UTC(2026,0,1)-i*86400000).toISOString()}));
  assert.equal(robustBiasCalibration(tooFew).reason, 'insufficient_matured_forecasts');
  const unstable = Array.from({length:60}, (_,i) => ({
    predicted_price:100,
    actual_price: i>=20 && i<40 ? 101 : i>=40 ? 99 : 101,
    actual_at: new Date(Date.UTC(2026,0,30)-i*86400000).toISOString()
  }));
  assert.equal(robustBiasCalibration(unstable).applied, false);
  assert.equal(robustBiasCalibration(unstable).reason, 'training_bias_not_stable');
});

test('robust feedback limits outlier influence and promotes only after chronological holdout improvement', () => {
  const rows = Array.from({length:60}, (_,i) => ({
    predicted_price:100,
    actual_price: i===0 ? 180 : 101,
    actual_at: new Date(Date.UTC(2026,1,1)-i*86400000).toISOString()
  }));
  const result=robustBiasCalibration(rows);
  assert.equal(result.applied,true);
  assert.equal(result.training_samples,40);
  assert.equal(result.holdout_samples,20);
  assert.ok(Math.abs(result.adjustment_log)<=0.01);
  assert.ok(result.adjustment_log>0);
  assert.ok(result.mad_log<0.001);
  assert.ok(result.holdout_improvement_pct>=3);
});

test('robust calibration rejects a training correction that fails on the recent holdout', () => {
  const rows = Array.from({length:60}, (_,i) => ({
    predicted_price:100,
    actual_price: i<20 ? 99 : 101,
    actual_at: new Date(Date.UTC(2026,1,1)-i*86400000).toISOString()
  }));
  const result=robustBiasCalibration(rows);
  assert.equal(result.applied,false);
  assert.equal(result.reason,'holdout_does_not_confirm_training_bias');
});

test('error diagnosis separates systematic bias, directional accuracy and interval coverage', () => {
  const rows = Array.from({length:40}, (_,i) => ({
    predicted_price:100, reference_price:100, actual_price:102,
    lower_price:101, upper_price:103, direction_correct:true,
    actual_at:new Date(Date.UTC(2026,2,1)-i*86400000).toISOString()
  }));
  const result=analyzeForecastErrors(rows);
  assert.equal(result.samples,40);
  assert.equal(result.error_profile,'systematic_underprediction');
  assert.equal(result.directional_accuracy_pct,100);
  assert.equal(result.interval_coverage_pct,100);
  assert.equal(result.performance_drift,false);
});

test('error profile resists a single extreme residual and detects recent degradation', () => {
  const rows = Array.from({length:60}, (_,i) => ({
    predicted_price:100, reference_price:100,
    actual_price: i===0 ? 180 : (i<20 ? 102 : 100.1),
    lower_price:99, upper_price:101,
    direction_correct: i>=20,
    actual_at:new Date(Date.UTC(2026,3,1)-i*86400000).toISOString()
  }));
  const result=analyzeForecastErrors(rows);
  assert.equal(result.error_profile,'balanced');
  assert.equal(result.performance_drift,true);
  assert.ok(result.recent_20_mae_pct > result.previous_60_mae_pct * 1.5);
});

test('row diagnosis identifies forecast symptoms and weak contextual risk factors separately', () => {
  const row={
    predicted_price:105,reference_price:100,actual_price:102,
    predicted_change_pct:5,direction_correct:true,lower_price:103,upper_price:104,
    quote_source:'provider-a',model_weights:{trend:0.9,baseline:0.1},
    validation:{
      forecast_mode:'adaptive_directional',quote_age_hours:8,history_provider:'NerkhAra',
      quote_quality:{source_count:1,spread_pct:2.4},
      news_context:{event_risk_score:72}
    }
  };
  const result=diagnoseForecastRow(row);
  assert.equal(result.valid,true);
  const codes=result.root_cause_candidates.map(x=>x.code);
  assert.ok(codes.includes('magnitude_overforecast'));
  assert.ok(codes.includes('aging_reference_quote'));
  assert.ok(codes.includes('thin_quote_consensus'));
  assert.ok(codes.includes('wide_quote_dispersion'));
  assert.ok(codes.includes('elevated_news_event_risk'));
  assert.ok(codes.includes('concentrated_ensemble_weight'));
  assert.ok(codes.includes('prediction_interval_miss'));
  assert.equal(result.contributing_factors.quote_age_band,'aging_6_24h');
});

test('error analysis reports only adequately sized source and regime cohorts', () => {
  const rows=Array.from({length:12},(_,i)=>({
    predicted_price:100,reference_price:100,actual_price:i<6?102:100.5,
    predicted_change_pct:0,direction_correct:i>=6,lower_price:99,upper_price:101,
    quote_source:i<6?'source-a':'source-b',
    validation:{quote_age_hours:i<6?1:12,history_provider:'history-a',forecast_mode:'adaptive_directional',quote_quality:{source_count:i<6?3:1,spread_pct:i<6?0.5:2.5},news_context:{event_risk_score:i<6?10:75}},
    actual_at:new Date(Date.UTC(2026,4,1)-i*86400000).toISOString()
  }));
  const result=analyzeForecastErrors(rows);
  assert.equal(result.cohort_diagnostics.quote_source['source-a'].samples,6);
  assert.equal(result.cohort_diagnostics.quote_source['source-b'].samples,6);
  assert.equal(result.cohort_diagnostics.event_risk_band.elevated.samples,6);
  assert.ok(result.root_cause_candidates.some(x=>x.code==='thin_quote_consensus'&&x.count===6));
  assert.match(result.diagnosis_caution,/not proof of causation/);
});

test('missing provider metadata stays unknown and is never misclassified as a single-source quote', () => {
  const result=diagnoseForecastRow({
    predicted_price:101,reference_price:100,actual_price:102,
    validation:{quote_quality:{source_count:null,spread_pct:null},news_context:{event_risk_score:null}}
  });
  assert.equal(result.contributing_factors.quote_source_count,null);
  assert.equal(result.contributing_factors.quote_consensus_band,'unknown');
  assert.equal(result.contributing_factors.quote_spread_band,'unknown');
  assert.equal(result.contributing_factors.event_risk_band,'unknown');
  assert.equal(result.root_cause_candidates.some(x=>x.code==='thin_quote_consensus'),false);
});
