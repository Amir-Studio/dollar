import test from 'node:test';
import assert from 'node:assert/strict';
import { buildForecast, isMarketRelevantHeadline } from '../worker/forecast-engine.js';

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
  const points = series(420, 0.0025);
  const result = buildForecast(points, points.at(-1).p, 7);
  assert.equal(result.eligible, true, result.reason || 'Expected stable trend to beat the no-change baseline');
  assert.equal(result.horizon_days, 7);
  assert.ok(result.predicted_price > 0);
  assert.ok(result.lower_price < result.predicted_price);
  assert.ok(result.upper_price > result.predicted_price);
  assert.ok(result.validation.samples >= 30);
  assert.ok(result.validation.skill_vs_no_change_pct >= 2);
});


test('news relevance filter keeps market headlines and rejects unrelated or incident-only headlines', () => {
  assert.equal(isMarketRelevantHeadline('قیمت نفت کاهش یافت'), true);
  assert.equal(isMarketRelevantHeadline('US Treasury warns against rate hikes during Iran energy shock'), true);
  assert.equal(isMarketRelevantHeadline('ایجاد کارگاه اشتغال برای ۳۰۰ نفر'), false);
  assert.equal(isMarketRelevantHeadline('مسابقات فوتبال لیگ برتر برگزار شد'), false);
  assert.equal(isMarketRelevantHeadline('گزارش حادثه مسلحانه در شهر'), false);
});
