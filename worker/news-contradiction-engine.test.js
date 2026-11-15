import test from "node:test";
import assert from "node:assert/strict";
import {
  analyzeCrossSourceContradictions,
  runNewsContradictionBenchmark,
  NEWS_CONTRADICTION_VERSION
} from "./news-contradiction-engine.js";

const at="2026-11-15T10:00:00.000Z";
const article=(title,domain,extra={})=>({
  title,domain,url:"https://"+domain+"/story",published_at:at,...extra
});

test("contradiction engine exposes a versioned, auditable result",()=>{
  const result=analyzeCrossSourceContradictions([]);
  assert.equal(result.version,NEWS_CONTRADICTION_VERSION);
  assert.equal(result.mode,"deterministic_cross_source_claim_screening_not_llm_fact_verdict");
  assert.equal(result.potential_contradiction_count,0);
});

test("opposite interest-rate decisions from distinct domains are flagged",()=>{
  const result=analyzeCrossSourceContradictions([
    article("Central bank raised interest rates","alpha.example"),
    article("Central bank cut interest rates","beta.example")
  ]);
  assert.equal(result.potential_contradiction_count,1);
  assert.equal(result.comparisons[0].kind,"opposite_event_directions");
  assert.equal(result.comparisons[0].status,"potential_contradiction");
  assert.equal(result.comparisons[0].source_independence,"different_domains_detected_but_editorial_independence_not_established");
});

test("same-direction reports are not flagged",()=>{
  const result=analyzeCrossSourceContradictions([
    article("Central bank raised interest rates","alpha.example"),
    article("Central bank raised interest rates","beta.example")
  ]);
  assert.equal(result.comparisons.length,0);
});

test("same publisher domain cannot create a cross-source contradiction",()=>{
  const result=analyzeCrossSourceContradictions([
    article("Central bank raised interest rates","alpha.example"),
    article("Central bank cut interest rates","alpha.example",{url:"https://www.alpha.example/second"})
  ]);
  assert.equal(result.comparisons.length,0);
});

test("conditional and forecast claims are not treated as confirmed factual conflicts",()=>{
  const result=analyzeCrossSourceContradictions([
    article("Central bank may raise interest rates","alpha.example"),
    article("Central bank cut interest rates","beta.example")
  ]);
  assert.equal(result.comparisons[0].status,"needs_context");
  assert.equal(result.comparisons[0].kind,"certainty_or_condition_mismatch");
});

test("different explicit years are not compared as the same event",()=>{
  const result=analyzeCrossSourceContradictions([
    article("Central bank raised interest rates in 2025","alpha.example"),
    article("Central bank cut interest rates in 2026","beta.example")
  ]);
  assert.equal(result.comparisons.length,0);
});

test("different numeric values with a shared unit require context, not a truth verdict",()=>{
  const result=analyzeCrossSourceContradictions([
    article("Central bank rate is 5%","alpha.example"),
    article("Central bank rate is 6%","beta.example")
  ]);
  assert.equal(result.comparisons[0].status,"needs_context");
  assert.equal(result.comparisons[0].kind,"numeric_discrepancy");
});

test("Persian opposing currency claims are detected",()=>{
  const result=analyzeCrossSourceContradictions([
    article("بانک مرکزی نرخ دلار را افزایش داد","alpha.example"),
    article("بانک مرکزی نرخ دلار را کاهش داد","beta.example")
  ]);
  assert.equal(result.potential_contradiction_count,1);
  assert.equal(result.comparisons[0].topic,"fx_rate");
});

test("an explicit denial and an assertion about the same action are surfaced",()=>{
  const result=analyzeCrossSourceContradictions([
    article("Central bank raised interest rates","alpha.example"),
    article("Central bank did not raise interest rates","beta.example")
  ]);
  assert.equal(result.potential_contradiction_count,1);
});

test("benchmark corpus passes all current regression cases",()=>{
  const result=runNewsContradictionBenchmark();
  assert.equal(result.failed,0,JSON.stringify(result.results.filter(x=>!x.passed)));
  assert.ok(result.total>=7);
});
