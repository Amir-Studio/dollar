import test from "node:test";
import assert from "node:assert/strict";
import {
  runCalibrationSelfTest,
  buildForecastErrorDiagnostic,
  directionMatches,
  summarizeLearningEvidence
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

test("learning evidence never mixes different model versions", () => {
  const rows = Array.from({length:3},(_,i)=>({
    asset:"USD_IRR_FREE",horizon_days:1,model_version:"legacy-v2.4",
    predicted_price:100,reference_price:100,actual_price:101+i,direction_correct:true
  }));
  const result = summarizeLearningEvidence(rows,[]);
  const legacy = result.asset_metrics["USD_IRR_FREE:1:legacy-v2.4"];
  const active = result.asset_metrics["USD_IRR_FREE:1:iran-ensemble-wf-2.7-maturity-safe-walkforward"];
  assert.equal(legacy.samples,3);
  assert.equal(active.samples,0);
  assert.ok(result.learning_actions.some(x=>x.model_version==="legacy-v2.4"&&x.samples===3));
  assert.ok(result.learning_actions.some(x=>x.model_version==="iran-ensemble-wf-2.7-maturity-safe-walkforward"&&x.samples===0));
});

test("diagnostic patterns are attributed only to the matching model version", () => {
  const rows = [{asset:"USD_IRR_FREE",horizon_days:1,model_version:"legacy-v2.4",
    predicted_price:100,reference_price:100,actual_price:101,direction_correct:true}];
  const diagnostics = Array.from({length:3},()=>({asset:"USD_IRR_FREE",horizon_days:1,
    model_version:"legacy-v2.4",root_cause_candidates:[{code:"quote_age_elevated"}]}));
  const result = summarizeLearningEvidence(rows,diagnostics);
  assert.equal(result.asset_metrics["USD_IRR_FREE:1:legacy-v2.4"].diagnostic_sample_count,3);
  assert.equal(result.asset_metrics["USD_IRR_FREE:1:legacy-v2.4"].recurring_error_patterns[0].code,"quote_age_elevated");
  assert.equal(result.asset_metrics["USD_IRR_FREE:1:iran-ensemble-wf-2.7-maturity-safe-walkforward"].diagnostic_sample_count,0);
});
