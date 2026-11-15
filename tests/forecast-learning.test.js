import test from "node:test";
import assert from "node:assert/strict";
import {
  runCalibrationSelfTest,
  buildForecastErrorDiagnostic,
  directionMatches,
  summarizeLearningEvidence,
  evaluateComponentWeightAdjustment,
  runComponentCalibrationSelfTest,
  getMissingForecastHorizons,
  hasRecentForecastForModel,
  selectWeightsFromErrorSums
} from "../worker/forecast-engine.js";

test("inner forecast duplicate guard does not let an older model block a new version", () => {
  const recent = [{ id: "legacy-row", model_version: "iran-ensemble-wf-2.7-maturity-safe-walkforward" }];
  assert.equal(hasRecentForecastForModel(recent, "iran-ensemble-wf-3.1-regime-directional-gate"), false);
  assert.equal(hasRecentForecastForModel(recent, "iran-ensemble-wf-2.7-maturity-safe-walkforward"), true);
});

test("forecast issuance deduplication is isolated by model version", () => {
  const missing = getMissingForecastHorizons([
    { horizon_days: 1, model_version: "iran-ensemble-wf-2.7-maturity-safe-walkforward" },
    { horizon_days: 3, model_version: "iran-ensemble-wf-3.1-regime-directional-gate" },
    { horizon_days: 7, model_version: "iran-ensemble-wf-2.7-maturity-safe-walkforward" }
  ]);
  assert.deepEqual(missing, [1, 7]);
});

test("experts with zero or insufficient matured samples never receive learned weight", () => {
  const weights=selectWeightsFromErrorSums(
    ["no_change","never_observed","sparse_expert","validated_expert"],
    40,
    100,
    {never_observed:0,sparse_expert:0,validated_expert:80},
    {never_observed:0,sparse_expert:3,validated_expert:40}
  );
  assert.equal(weights.never_observed,0);
  assert.equal(weights.sparse_expert,0);
  assert.ok(weights.validated_expert>0);
  assert.ok(Math.abs(Object.values(weights).reduce((a,b)=>a+b,0)-1)<1e-9);
});

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

test("forecast diagnostics distinguish systematic overprediction and underprediction", () => {
  const over = buildForecastErrorDiagnostic({
    id:"over",asset:"USD_IRR_FREE",horizon_days:1,model_version:"test-model",
    actual_price:100,predicted_price:102,reference_price:100,
    validation:{forecast_mode:"adaptive_directional",selected_models:["trend_15"]}
  });
  const under = buildForecastErrorDiagnostic({
    id:"under",asset:"USD_IRR_FREE",horizon_days:1,model_version:"test-model",
    actual_price:102,predicted_price:100,reference_price:100,
    validation:{forecast_mode:"adaptive_directional",selected_models:["trend_15"]}
  });
  assert.equal(over.error_metrics.error_direction,"overprediction");
  assert.ok(over.root_cause_candidates.some(x=>x.code==="systematic_overprediction_candidate"));
  assert.equal(under.error_metrics.error_direction,"underprediction");
  assert.ok(under.root_cause_candidates.some(x=>x.code==="systematic_underprediction_candidate"));
  assert.ok(over.root_cause_candidates.every(x=>x.causal===false));
});

test("learning summary exposes signed bias, baseline wins and tail error", () => {
  const rows=Array.from({length:30},(_,i)=>({
    asset:"USD_IRR_FREE",horizon_days:1,model_version:"bias-test-v1",
    reference_price:100,predicted_price:105,actual_price:100,direction_correct:false,
    actual_at:new Date(Date.UTC(2026,10,15)-i*86400000).toISOString()
  }));
  const result=summarizeLearningEvidence(rows,[]);
  const metrics=result.asset_metrics["USD_IRR_FREE:1:bias-test-v1"];
  assert.equal(metrics.bias_state,"overpredicting");
  assert.ok(metrics.signed_bias_median_pct>0);
  assert.equal(metrics.overprediction_rate_pct,100);
  assert.equal(metrics.underprediction_rate_pct,0);
  assert.equal(metrics.baseline_win_rate_pct,0);
  assert.ok(metrics.p90_absolute_error_pct>0);
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
  const active = result.asset_metrics["USD_IRR_FREE:1:iran-ensemble-wf-3.1-regime-directional-gate"];
  assert.equal(legacy.samples,3);
  assert.equal(active.samples,0);
  assert.ok(result.learning_actions.some(x=>x.model_version==="legacy-v2.4"&&x.samples===3));
  assert.ok(result.learning_actions.some(x=>x.model_version==="iran-ensemble-wf-3.1-regime-directional-gate"&&x.samples===0));
});

test("diagnostic patterns are attributed only to the matching model version", () => {
  const rows = [{asset:"USD_IRR_FREE",horizon_days:1,model_version:"legacy-v2.4",
    predicted_price:100,reference_price:100,actual_price:101,direction_correct:true}];
  const diagnostics = Array.from({length:3},()=>({asset:"USD_IRR_FREE",horizon_days:1,
    model_version:"legacy-v2.4",root_cause_candidates:[{code:"quote_age_elevated"}]}));
  const result = summarizeLearningEvidence(rows,diagnostics);
  assert.equal(result.asset_metrics["USD_IRR_FREE:1:legacy-v2.4"].diagnostic_sample_count,3);
  assert.equal(result.asset_metrics["USD_IRR_FREE:1:legacy-v2.4"].recurring_error_patterns[0].code,"quote_age_elevated");
  assert.equal(result.asset_metrics["USD_IRR_FREE:1:iran-ensemble-wf-3.1-regime-directional-gate"].diagnostic_sample_count,0);
});

test("model retention requires enough matured evidence and beats the no-change baseline", () => {
  const good = Array.from({length:30},()=>({
    asset:"EUR_IRR_FREE",horizon_days:3,model_version:"candidate-v3",
    reference_price:100,predicted_price:102,actual_price:102.5,direction_correct:true
  }));
  const bad = Array.from({length:30},()=>({
    asset:"GOLD_18K_IRR",horizon_days:3,model_version:"candidate-v3",
    reference_price:100,predicted_price:105,actual_price:101,direction_correct:false
  }));
  const result = summarizeLearningEvidence([...good,...bad],[]);
  assert.ok(result.learning_actions.some(x=>x.asset==="EUR_IRR_FREE"&&x.action==="retain_validated_model"));
  assert.ok(result.learning_actions.some(x=>x.asset==="GOLD_18K_IRR"&&x.action==="keep_directional_signal_withheld"));
});

test("live component reweighting is accepted only when it wins on newer holdout rows", () => {
  const rows = Array.from({length:60},(_,i)=>({
    reference_price:100,
    actual_price:100*Math.exp(0.01),
    model_weights:{trend_15:1,median_5:0,no_change:0},
    validation:{candidate_predictions_log:{trend_15:0.02,median_5:0.01,no_change:0}}
  }));
  const result = evaluateComponentWeightAdjustment(rows,{trend_15:1,median_5:0,no_change:0});
  assert.equal(result.samples,60);
  assert.equal(result.training_samples,40);
  assert.equal(result.holdout_samples,20);
  assert.equal(result.applied,true);
  assert.ok(result.holdout_improvement_pct>=3);
});

test("live component reweighting rejects a change that fails on newer holdout rows", () => {
  const rows = Array.from({length:60},(_,i)=>({
    reference_price:100,
    actual_price:100*Math.exp(i<20?0.02:0.01),
    model_weights:{trend_15:1,median_5:0,no_change:0},
    validation:{candidate_predictions_log:{trend_15:0.02,median_5:0.01,no_change:0}}
  }));
  const result = evaluateComponentWeightAdjustment(rows,{trend_15:1,median_5:0,no_change:0});
  assert.equal(result.applied,false);
});

test("live component reweighting requires at least 60 matured forecasts", () => {
  const rows = Array.from({length:59},()=>({
    reference_price:100,actual_price:101,model_weights:{trend_15:1},
    validation:{candidate_predictions_log:{trend_15:0.01,median_5:0.01}}
  }));
  const result = evaluateComponentWeightAdjustment(rows,{trend_15:1});
  assert.equal(result.applied,false);
  assert.equal(result.samples,59);
});

test("component calibration built-in regression suite passes", () => {
  const result = runComponentCalibrationSelfTest();
  assert.equal(result.failed.length,0,JSON.stringify(result.failed));
  assert.equal(result.passed,result.total);
});
