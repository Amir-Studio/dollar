import test from 'node:test';
import assert from 'node:assert/strict';
import { buildForecast } from '../worker/forecast-engine.js';

const DAY = 86400000;
function series(count, dailyLogReturn) {
  const start = Date.UTC(2025, 0, 1);
  return Array.from({length:count}, (_,i) => ({
    t: start + i*DAY,
    p: 100000 * Math.exp(dailyLogReturn*i + 0.00015*Math.sin(i*1.7))
  }));
}

test('forecast refuses to publish when history is below the horizon minimum', () => {
  const result = buildForecast(series(54, 0.0025), 114500, 7);
  assert.equal(result.eligible, false);
  assert.equal(result.required, 55);
  assert.equal(result.observations, 54);
});

test('forecast refuses to publish a flat series that does not beat the no-change baseline', () => {
  const points = series(90, 0);
  const result = buildForecast(points, points.at(-1).p, 7);
  assert.equal(result.eligible, false);
  assert.equal(result.samples >= 20, true);
  assert.match(result.reason, /۵٪/);
});

test('walk-forward ensemble can qualify on a stable synthetic trend and returns an uncertainty band', () => {
  const points = series(100, 0.0025);
  const result = buildForecast(points, points.at(-1).p, 7);
  assert.equal(result.eligible, true, result.reason || 'Expected stable trend to beat the naive baseline');
  assert.equal(result.horizon_days, 7);
  assert.ok(result.predicted_price > 0);
  assert.ok(result.lower_price < result.predicted_price);
  assert.ok(result.upper_price > result.predicted_price);
  assert.ok(result.validation.samples >= 20);
  assert.ok(result.validation.mae_pct < result.validation.naive_mae_pct * 0.95);
});
