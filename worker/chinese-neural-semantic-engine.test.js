import test from "node:test";
import assert from "node:assert/strict";
import { analyzeChineseNewsNeurally, runChineseNeuralSelfTest, CHINESE_NEURAL_VERSION } from "./chinese-neural-semantic-engine.js";

function mockAI() {
  return { run: async (_model, { text }) => ({
    data: text.map(value => value.includes("足球") ? [0, 1, 0] : [1, 0, 0])
  }) };
}

test("Chinese neural engine uses a multilingual embedding model and returns ranked concepts", async () => {
  const cache = { get: async () => null, put: async () => {} };
  const result = await analyzeChineseNewsNeurally("通货膨胀与利率政策", { AI: mockAI(), MARKET_CACHE: cache }, { limit: 5, minimumScore: 0 });
  assert.equal(result.status, "neural_semantic_analysis_complete");
  assert.equal(result.model, "@cf/baai/bge-m3");
  assert.equal(result.model_version, CHINESE_NEURAL_VERSION);
  assert.equal(result.embedding_dimension, 3);
  assert.equal(result.matches.length, 5);
  assert.ok(result.matches.every(x => x.match_type === "pretrained_neural_embedding"));
});

test("neural self-test checks embedding geometry instead of lexical rules", async () => {
  const result = await runChineseNeuralSelfTest(mockAI());
  assert.equal(result.passed, true, JSON.stringify(result));
});

test("neural engine reports missing Cloudflare AI binding without pretending to analyze", async () => {
  const result = await analyzeChineseNewsNeurally("人民币汇率", {});
  assert.equal(result.status, "neural_binding_not_configured");
  assert.equal(result.matches.length, 0);
});
