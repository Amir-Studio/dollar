import test from "node:test";
import assert from "node:assert/strict";
import { runNeuralForecastSelfTest, trainNeuralReturnModel } from "../worker/neural-forecast-engine.js";

test("neural forecast model passes deterministic and safety checks", () => {
  const report = runNeuralForecastSelfTest();
  assert.equal(report.failed.length, 0, JSON.stringify(report.failed));
  assert.equal(report.passed, report.total);
  assert.equal(report.architecture, "9-6-1");
});

test("neural model refuses unsupported horizons", () => {
  const now = Date.UTC(2025, 0, 1);
  const points = Array.from({ length: 320 }, (_, i) => ({ t: now + i * 86400000, p: 100 + i }));
  assert.equal(trainNeuralReturnModel(points, 2).available, false);
});
