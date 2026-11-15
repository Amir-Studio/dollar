import test from "node:test";
import assert from "node:assert/strict";
import {
  runCalibrationSelfTest,
  buildForecastErrorDiagnostic,
  directionMatches
} from "../worker/forecast-engine.js";

test("robust calibration passes its holdout and minimum-sample regression checks", () => {
  const result = runCalibrationSelfTest();
  assert.equal(result.failed.length, 0, JSON.stringify(result.failed));
  assert.equal(result.passed, result.total);
});

test("direction scoring respects the neutral deadband", () => {
  assert.equal(directionMatches(0.5, "up"), true);
  assert.equal(directionMatches(-0.5, "down"), true);
  assert.equal(directionMatches(0.05, "sideways"), true);
  assert.equal(directionMatches(0.5, "down"), false);
});

test("forecast diagnostics compare against the same-row no-change baseline", () => {
  const result = buildForecastErrorDiagnostic({
    id: "synthetic-forecast",
    asset: "USD_IRR_FREE",
    horizon_days: 1,
    model_version: "test-model",
    actual_price: 110,
    predicted_price: 90,
    reference_price: 100,
    predicted_change_pct: -10,
    direction_correct: false,
    validation: {
      forecast_mode: "adaptive_directional",
      quote_age_hours: 1,
      selected_models: ["trend_15"],
      news_context: { source_count: 2, headline_count: 4, event_risk_score: 30 }
    }
  });
  assert.ok(result);
  assert.ok(result.error_metrics.absolute_error_pct > result.error_metrics.no_change_error_pct);
  assert.ok(result.root_cause_candidates.some(x => x.code === "underperformed_no_change"));
  assert.ok(result.root_cause_candidates.every(x => x.causal === false));
});

test("invalid or incomplete forecasts are not diagnosed", () => {
  assert.equal(buildForecastErrorDiagnostic({ id: "bad", asset: "USD_IRR_FREE" }), null);
});
