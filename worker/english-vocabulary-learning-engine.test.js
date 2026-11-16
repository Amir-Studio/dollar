import test from "node:test";
import assert from "node:assert/strict";
import { getEnglishNewsVocabulary } from "./news-vocabulary-en.js";
import { getEnglishVocabularyLearningStatus, recordEnglishVocabularyExposure, recordEnglishVocabularyFeedback, runEnglishVocabularyLearningSelfTest } from "./english-vocabulary-learning-engine.js";

function cache(){
  const values=new Map();
  return {
    get:async key=>values.has(key)?values.get(key):null,
    put:async (key,value)=>{values.set(key,JSON.parse(value));}
  };
}

test("English curriculum contains exactly 1000 unique reviewed vocabulary entries",()=>{
  const result=getEnglishNewsVocabulary({limit:1000});
  assert.equal(result.current_total,1000);
  assert.equal(result.items.length,1000);
  assert.equal(new Set(result.items.map(x=>x.term.toLowerCase())).size,1000);
  assert.equal(new Set(result.items.map(x=>x.id)).size,1000);
});

test("vocabulary feedback drives adaptive spaced review and remediation",async()=>{
  const env={MARKET_CACHE:cache()};
  const term=getEnglishNewsVocabulary({limit:1000}).items[0];
  const first=await recordEnglishVocabularyFeedback({term_id:term.id,correct:true},env);
  const second=await recordEnglishVocabularyFeedback({term_id:term.id,correct:true},env);
  const third=await recordEnglishVocabularyFeedback({term_id:term.id,correct:true},env);
  const wrong=await recordEnglishVocabularyFeedback({term_id:term.id,correct:false},env);
  assert.equal(first.interval_days,1);
  assert.equal(second.interval_days,3);
  assert.ok(third.interval_days>=7);
  assert.equal(wrong.interval_days,0.25);
  assert.equal(wrong.streak,0);
  assert.equal(wrong.mastery_state,"needs_remediation");
});

test("article exposure is not mistaken for verified vocabulary mastery",async()=>{
  const env={MARKET_CACHE:cache()};
  const term=getEnglishNewsVocabulary({limit:1000}).items[0];
  const exposure=await recordEnglishVocabularyExposure([term.id,term.id],env,"market article context");
  const status=await getEnglishVocabularyLearningStatus(env);
  assert.equal(exposure.recorded,1);
  assert.equal(status.exposure_events,1);
  assert.equal(status.reviewed_terms,0);
  assert.equal(status.consolidating_terms,0);
});

test("spaced repetition schedule self-test passes",()=>{
  assert.equal(runEnglishVocabularyLearningSelfTest().passed,true);
});
