import test from "node:test";
import assert from "node:assert/strict";
import { extractUnknownVocabularyCandidates, lookupVocabularyMeaning, runLanguageLearnerSelfTest, LANGUAGE_LEARNER_VERSION } from "./language-learning-engine.js";

test("learner discovers repeated unknown economic terms and filters stopwords",()=>{
 const result=runLanguageLearnerSelfTest();
 assert.equal(result.passed,true,JSON.stringify(result));
 assert.match(LANGUAGE_LEARNER_VERSION,/^dollar-language-learner-/);
});
test("cross-language ontology resolves known concepts without a web request",async()=>{
 const result=await lookupVocabularyMeaning("Zinserhöhung","de",async()=>{throw Error("should not fetch");});
 assert.equal(result.ok,true);
 assert.equal(result.source_provider,"internal_market_ontology");
 assert.ok(result.cross_language_equivalents.fa);
});
test("dictionary fallback preserves candidate status and source provenance",async()=>{
 const fake=async url=>({ok:true,json:async()=>({German:[{partOfSpeech:"noun",definitions:[{definition:"an increase in interest rates"}]}]})});
 const result=await lookupVocabularyMeaning("Zinserhöhung","de",fake);
 assert.equal(result.ok,true);
 assert.equal(result.source_provider,"Wiktionary");
 assert.equal(result.status,"candidate_review");
 assert.match(result.source_url,/wiktionary\.org/);
});
test("unsupported language is rejected instead of guessed",async()=>{
 const result=await lookupVocabularyMeaning("unknown","xx",async()=>{throw Error("no");});
 assert.equal(result.ok,false);
 assert.equal(result.status,"invalid_input");
});
