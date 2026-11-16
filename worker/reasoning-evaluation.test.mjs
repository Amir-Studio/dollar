import test from "node:test";
import assert from "node:assert/strict";
import {scoreReasoningEvaluationCase,aggregateReasoningEvaluation,validateGoldEvaluationCase} from "./reasoning-evaluation.js";

test("headline-only source expected to abstain is scored correctly",()=>{
  const score=scoreReasoningEvaluationCase({case_id:"synthetic-headline-only",
    gold:{expected_abstain:true,expected_correct:true,expected_market_direction:"unclear"},
    analysis:{abstained:true,confidence:0,evidence_audit:{items:[]},analysis:{market_implications:[],causal_hypotheses:[]}}});
  assert.equal(score.abstention_correct,true);
  assert.equal(score.confidence_brier,1);
  assert.equal(score.direction_correct,null);
});

test("numeric mismatch and fabricated quotes do not count as verified",()=>{
  const score=scoreReasoningEvaluationCase({case_id:"synthetic-bad-quote",
    gold:{expected_abstain:true,expected_correct:false},
    analysis:{abstained:true,confidence:.9,evidence_audit:{items:[{evidence_quotes:[
      {quote_verified:true,numeric_fidelity:false},{quote_verified:false,numeric_fidelity:true}
    ]}]}}});
  assert.equal(score.evidence_quote_precision,0);
  assert.equal(score.confidence_brier,.81);
});

test("market direction is scored only when a reviewed expected direction exists",()=>{
  const score=scoreReasoningEvaluationCase({case_id:"synthetic-market-direction",
    gold:{expected_abstain:false,expected_market_direction:"upward_pressure",asset:"USD/IRR",horizon:"1d"},
    analysis:{abstained:false,confidence:.6,analysis:{market_implications:[
      {asset:"USD/IRR",horizon:"1d",impact_direction:"upward_pressure"},
      {asset:"gold",horizon:"1d",impact_direction:"downward_pressure"}],causal_hypotheses:[]}}});
  assert.equal(score.direction_correct,true);
});

test("contradictory directions for the same asset and horizon are not scored as correct",()=>{
  const score=scoreReasoningEvaluationCase({case_id:"synthetic-conflicting-market-direction",
    gold:{expected_abstain:false,expected_market_direction:"upward_pressure",asset:"USD/IRR",horizon:"1d"},
    analysis:{abstained:false,analysis:{market_implications:[
      {asset:"USD/IRR",horizon:"1d",impact_direction:"upward_pressure"},
      {asset:"USD/IRR",horizon:"1d",impact_direction:"downward_pressure"},
      {asset:"gold",horizon:"1d",impact_direction:"upward_pressure"}
    ]}}});
  assert.equal(score.direction_correct,false);
  assert.deepEqual(score.observed_market_directions,["upward_pressure","downward_pressure"]);
});

test("causal quality requires all falsifiable structure fields",()=>{
  const score=scoreReasoningEvaluationCase({case_id:"synthetic-causal",
    gold:{expected_abstain:false},
    analysis:{analysis:{causal_hypotheses:[
      {mechanism:"channel",time_order:"after",confounders:["policy"],falsification_test:"check counter signal"},
      {statement:"unsupported"}
    ]}}});
  assert.equal(score.causal_structure_rate,.5);
});

test("aggregate reports denominators and never hides missing labels",()=>{
  const scores=[
    {abstention_correct:true,direction_correct:true,evidence_quote_precision:1,causal_structure_rate:1,confidence_brier:.04},
    {abstention_correct:false,direction_correct:null,evidence_quote_precision:0,causal_structure_rate:null,confidence_brier:.64}
  ];
  const result=aggregateReasoningEvaluation(scores);
  assert.equal(result.sample_size,2);
  assert.equal(result.abstention_accuracy,.5);
  assert.equal(result.market_direction_accuracy,1);
  assert.equal(result.evidence_quote_precision,.5);
  assert.equal(result.confidence_brier_score,.34);
  assert.equal(result.evaluated_counts.market_direction,1);
});

test("gold cases require source provenance and independent review",()=>{
  const errors=validateGoldEvaluationCase({case_id:"x",source:{url:"https://example.org",published_at:"2026-01-01",text_sha256:"abc"},
    review:{annotator_count:1},gold:{expected_abstain:false},asset:"USD/IRR",horizon:"1d"});
  assert.ok(errors.some(error=>error.includes("two annotators")));
  assert.ok(errors.some(error=>error.includes("adjudication")));
});
