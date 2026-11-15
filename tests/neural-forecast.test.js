import test from "node:test";
import assert from "node:assert/strict";
import { runNeuralForecastSelfTest, trainNeuralReturnModel } from "../worker/neural-forecast-engine.js";

test("neural forecast model passes deterministic and safety checks", () => {
  const report = runNeuralForecastSelfTest();
  assert.equal(report.failed.length, 0, JSON.stringify(report.failed));
  assert.equal(report.passed, report.total);
  assert.equal(report.architecture, "15-24-12-1");
});

test("neural model refuses unsupported horizons", () => {
  const now = Date.UTC(2025, 0, 1);
  const points = Array.from({ length: 320 }, (_, i) => ({ t: now + i * 86400000, p: 100 + i }));
  assert.equal(trainNeuralReturnModel(points, 2).available, false);
});

test("trained model exposes auditable holdout and training metadata", () => {
  const now = Date.UTC(2025, 0, 1);
  const points = Array.from({ length: 420 }, (_, i) => ({
    t: now + i * 86400000,
    p: 100 * Math.exp(i * 0.0007 + Math.sin(i / 11) * 0.014 + Math.sin(i / 37) * 0.009)
  }));
  const result = trainNeuralReturnModel(points, 7);
  assert.equal(result.available, true);
  assert.ok(result.training_samples >= 90);
  assert.equal(result.architecture, "15-24-12-1");
  assert.equal(result.ensemble_size, 9);
  assert.ok(Number.isFinite(result.ensemble_prediction_std));
  assert.ok(result.validation_skill_gate >= 0 && result.validation_skill_gate <= 1);
  assert.ok(Number.isFinite(result.predicted_log_return));
  assert.ok(Number.isFinite(result.final_training_huber_loss));
  assert.ok(Number.isFinite(result.validation_huber_loss));
  assert.ok(Number.isFinite(result.validation_baseline_huber_loss));
  assert.ok(Number.isFinite(result.validation_skill));
  assert.ok(result.purged_training_samples >= 35);
  assert.ok(result.validation_samples >= 20);
  assert.ok(result.validation_folds >= 2);
  assert.ok(result.epochs >= 1 && result.epochs <= 40);
  assert.ok(result.volatility_cap > 0 && result.volatility_cap <= 0.30);
});

test("model rejects duplicate timestamps and invalid prices", () => {
  const now = Date.UTC(2025, 0, 1);
  const points = Array.from({ length: 120 }, (_, i) => ({ t: now + i * 86400000, p: 100 + i }));
  const duplicate = points.map((p, i) => i === 80 ? { ...p, t: points[79].t } : p);
  const invalid = points.map((p, i) => i === 80 ? { ...p, p: Number.NaN } : p);
  assert.equal(trainNeuralReturnModel(duplicate, 3).available, false);
  assert.equal(trainNeuralReturnModel(invalid, 3).available, false);
});
