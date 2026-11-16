import test from "node:test";
import assert from "node:assert/strict";
import {buildLearningAssertions,validateLearningCaseInput,diagnoseLearningPipeline} from "./news-learning-validation.js";

test("derives precise assertions only from changed corrected fields",()=>{
  const out=buildLearningAssertions("wrong_actor",{actors:["government"],actions:["increase"]},{actors:["central_bank"],actions:["increase"],version:"v1"});
  assert.deepEqual(out.assertions,[{path:"actors",equals:["central_bank"]}]);
  assert.equal(out.source,"derived_changed_fields");
});
test("preserves explicit assertions and rejects unsafe paths",()=>{
  const out=buildLearningAssertions("wrong_action",{},{
    assertions:[{path:"claims.0.action",equals:"decrease"},{path:"__proto__.x",equals:"x"},{path:"constructor.prototype",equals:"x"}]
  });
  assert.deepEqual(out.assertions,[{path:"claims.0.action",equals:"decrease"}]);
});
test("rejects feedback that cannot be scored",()=>{
  const result=validateLearningCaseInput("wrong_actor","Central bank raised rates yesterday.",{});
  assert.equal(result.ok,false);
  assert.equal(result.reason,"corrected_output_has_no_comparable_assertions");
});
test("requires two source articles for contradiction learning",()=>{
  const result=validateLearningCaseInput("contradiction","one article says rates rose",{assertions:[{path:"potential_contradiction_count",equals:1}]});
  assert.equal(result.ok,false);
  assert.equal(result.reason,"contradiction_input_must_be_json");
});
test("accepts explicit contradiction case with two articles",()=>{
  const input=JSON.stringify({articles:[{title:"Rates rose",domain:"a.example"},{title:"Rates fell",domain:"b.example"}]});
  assert.equal(validateLearningCaseInput("contradiction",input,{assertions:[{path:"potential_contradiction_count",equals:1}]}).ok,true);
});
test("diagnostics explain why no learning can happen",()=>{
  assert.deepEqual(diagnoseLearningPipeline({}),{status:"blocked_no_feedback",reason:"no_feedback_submissions",next_step:"submit_a_corrected_example"});
  assert.equal(diagnoseLearningPipeline({feedback_total:3,feedback_submitted:3,feedback_verified:0}).status,"waiting_for_human_review");
  assert.equal(diagnoseLearningPipeline({feedback_total:3,feedback_verified:2,learning_cases:2,cases_unscorable:2}).status,"blocked_unscorable_cases");
  assert.equal(diagnoseLearningPipeline({feedback_total:3,feedback_verified:3,learning_cases:3,evaluated_cases:3,cases_failed:1}).status,"corrections_available");
});
