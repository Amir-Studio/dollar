import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildNewsTriageFeatures, extractiveNewsSummary, fallbackNewsTriage,
  trainNewsTriageModel, predictNewsTriageModel, runNewsTriageSelfTest, TRIAGE_LABELS
} from "./news-triage-engine.js";

test("feature extraction returns eight bounded features",()=>{
  const result=buildNewsTriageFeatures({title:"Central bank raises rates",original_text:"According to the central bank, rates increased by 2 percent.",published_at:new Date().toISOString(),source_id:"central-bank",extraction_method:"rss_content"},{semantic_score:.8,themes:["interest_rate","inflation"]});
  assert.equal(result.vector.length,8);
  assert.ok(result.vector.every(x=>x>=0&&x<=1));
});
test("extractive summary only selects source sentences",()=>{
  const source="The central bank announced a rate increase of 2 percent. The decision follows new inflation data and is expected to affect lending costs.";
  const result=extractiveNewsSummary({language_code:"en",original_text:source});
  assert.ok(result.summary.length>30);
  for(const sentence of result.summary.split(/(?<=[.!?])\s+/)) assert.ok(source.includes(sentence));
});
test("duplicate candidates are discarded by fallback",()=>{
  const result=fallbackNewsTriage([.9,.9,.9,.9,.9,1,1,1]);
  assert.equal(result.decision,"discard");
});
test("model refuses to train on too few or single-class labels",()=>{
  assert.equal(trainNewsTriageModel([]).trained,false);
  const rows=Array.from({length:30},(_,i)=>({features:Array(8).fill(i/30),decision:"keep"}));
  assert.equal(trainNewsTriageModel(rows).trained,false);
});
test("feedback-trained MLP produces normalized class probabilities",()=>{
  const rows=[];
  for(let i=0;i<12;i++) rows.push({features:[.9,.8,.9,.9,.8,1,1,0],decision:"keep"});
  for(let i=0;i<12;i++) rows.push({features:[.7,.6,.4,.8,.6,1,.5,0],decision:"summarize"});
  for(let i=0;i<12;i++) rows.push({features:[.2,.1,.1,.7,.3,0,0,0],decision:"quarantine"});
  for(let i=0;i<12;i++) rows.push({features:[.05,.0,.0,.0,.1,0,0,1],decision:"discard"});
  const trained=trainNewsTriageModel(rows,{epochs:80});
  assert.equal(trained.trained,true);
  assert.ok(trained.metrics.validation_samples>0);
  assert.ok(trained.metrics.validation_macro_f1>=0&&trained.metrics.validation_macro_f1<=1);
  assert.equal(trained.model.training_samples+trained.model.validation_samples,48);
  const prediction=predictNewsTriageModel(trained.model,[.9,.8,.9,.9,.8,1,1,0]);
  assert.ok(TRIAGE_LABELS.includes(prediction.decision));
  const sum=Object.values(prediction.probabilities).reduce((a,b)=>a+b,0);
  assert.ok(Math.abs(sum-1)<0.001);
});
test("built-in regression self-test passes",()=>{
  const result=runNewsTriageSelfTest();
  assert.equal(result.failed.length,0);
});

test("model refuses to train when a class has too few reviewed examples",()=>{
  const rows=[];
  for(let i=0;i<20;i++) rows.push({features:[.8,.8,.8,.8,.8,1,1,0],decision:"keep"});
  for(let i=0;i<3;i++) rows.push({features:[.4,.4,.4,.4,.4,0,0,0],decision:"summarize"});
  for(let i=0;i<3;i++) rows.push({features:[.2,.2,.2,.2,.2,0,0,0],decision:"quarantine"});
  assert.equal(trainNewsTriageModel(rows).trained,false);
});
