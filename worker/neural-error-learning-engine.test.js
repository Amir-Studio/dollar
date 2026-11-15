import test from "node:test";
import assert from "node:assert/strict";
import { refreshNeuralErrorMemory, retrieveNeuralErrorGuidance } from "./neural-error-learning-engine.js";

function mockAi() {
  return { async run(_model, { text }) {
    const rows = Array.isArray(text) ? text : [text];
    return { data: rows.map(value => {
      const s = String(value).toLowerCase();
      return [
        /interest|monetary|borrowing|rate/.test(s) ? 1 : 0,
        /football|club|championship/.test(s) ? 1 : 0,
        /inflation|cpi/.test(s) ? 1 : 0
      ];
    }) };
  }};
}
function mockKv() {
  const map = new Map();
  return {
    async get(key, type) { const v = map.get(key); return v ? (type === "json" ? JSON.parse(v) : v) : null; },
    async put(key, value) { map.set(key, value); }
  };
}
test("only verified correction-shaped cases enter neural memory", async () => {
  const env = { AI: mockAi(), MARKET_CACHE: mockKv() };
  const result = await refreshNeuralErrorMemory([
    { id:"1", feedback_id:"f1", category:"wrong_action", input_text:"Central bank rate decision", expected_output:{ action:"increase" }, results:[] },
    { id:"2", feedback_id:"f2", category:"other", input_text:"", expected_output:{ action:"hold" } },
    { id:"3", feedback_id:"f3", category:"other", input_text:"No correction" }
  ], env);
  assert.equal(result.indexed, 1);
});
test("retrieval returns a verified correction for a semantically related query", async () => {
  const env = { AI: mockAi(), MARKET_CACHE: mockKv() };
  await refreshNeuralErrorMemory([
    { id:"1", feedback_id:"f1", category:"wrong_action", input_text:"Central bank raised interest rates", expected_output:{ action:"increase" }, results:[] },
    { id:"2", feedback_id:"f2", category:"other", input_text:"Football club won championship", expected_output:{ topic:"sports" }, results:[] }
  ], env);
  const result = await retrieveNeuralErrorGuidance("The monetary authority increased borrowing costs.", env, { minimumScore:0.5 });
  assert.equal(result.status, "verified_error_memory_matches_found");
  assert.equal(result.matches[0].feedback_id, "f1");
  assert.equal(result.matches[0].verified_correction.action, "increase");
});
test("no unverified cases means no memory guidance", async () => {
  const env = { AI: mockAi(), MARKET_CACHE: mockKv() };
  const result = await refreshNeuralErrorMemory([], env);
  assert.equal(result.indexed, 0);
  assert.equal((await retrieveNeuralErrorGuidance("central bank rate", env)).status, "no_verified_error_memory");
});
