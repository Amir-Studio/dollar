import { runAdvancedEnglishGrammarSelfTest } from "./english-grammar-advanced.js";
import test from "node:test";
import { runEnglishNewsVocabularySelfTest, getEnglishNewsVocabulary } from "./news-vocabulary-en.js";
import assert from "node:assert/strict";
import { extractUnknownVocabularyCandidates, lookupVocabularyMeaning, runLanguageLearnerSelfTest, LANGUAGE_LEARNER_VERSION, classifyVocabularyKnowledge } from "./language-learning-engine.js";
import { runEnglishGrammarNeuralSelfTest } from "./english-neural-grammar-engine.js";

test("learner discovers repeated unknown economic terms and filters stopwords",()=>{
 const result=runLanguageLearnerSelfTest();
 assert.equal(result.passed,true,JSON.stringify(result));
 assert.match(LANGUAGE_LEARNER_VERSION,/^dollar-language-learner-/);
});
test("known vocabulary is not incorrectly marked unknown",()=>{
 assert.equal(classifyVocabularyKnowledge("inflation","en").knowledge_state,"known_in_internal_lexicon");
 assert.equal(classifyVocabularyKnowledge("the","en").knowledge_state,"known_function_word");
});
test("technical terminology can be detected on a single occurrence with domain evidence",()=>{
 const result=extractUnknownVocabularyCandidates("The central bank discussed Klimarisikoprämie during monetary policy review.","de");
 assert.ok(result.some(x=>x.normalized_term==="klimarisikoprämie"));
});
test("unknown short words without context are not promoted as learned gaps",()=>{
 const result=extractUnknownVocabularyCandidates("mavo terek luno pavi","en");
 assert.equal(result.length,0);
});
test("multiword market terminology is surfaced as a candidate",()=>{
 const result=extractUnknownVocabularyCandidates("The central bank discussed geopolitical spillover and liquidity risk.","en",{limit:20});
 assert.ok(result.some(x=>x.normalized_term==="geopolitical spillover"));
});
test("cross-language ontology resolves known concepts without a web request",async()=>{
 const result=await lookupVocabularyMeaning("geldpolitische Straffung","de",async()=>{throw Error("should not fetch");});
 assert.equal(result.ok,true);
 assert.equal(result.source_provider,"internal_market_ontology");
 assert.ok(result.cross_language_equivalents.fa);
});
test("dictionary fallback preserves candidate status and source provenance",async()=>{
 const fake=async url=>({ok:true,json:async()=>({German:[{partOfSpeech:"noun",definitions:[{definition:"an increase in interest rates"}]}]})});
 const result=await lookupVocabularyMeaning("Klimarisikoprämie","de",fake);
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
test("existing specialist German and Chinese vocabularies are not re-flagged as unknown",()=>{
 const german=extractUnknownVocabularyCandidates("Zinserhöhung Zinserhöhung Zinserhöhung", "de");
 const chinese=extractUnknownVocabularyCandidates("通胀预期通胀预期通胀预期", "zh");
 assert.equal(german.some(x=>x.normalized_term==="zinserhöhung"),false);
 assert.equal(chinese.some(x=>x.normalized_term==="通胀预期"),false);
});


test("English curriculum contains 1000 unique specialist terms and grammar exceptions",()=>{
 const result=runEnglishNewsVocabularySelfTest();
 assert.equal(result.total,1000,JSON.stringify(result));
 assert.equal(result.passed,true,JSON.stringify(result));
 const curriculum=getEnglishNewsVocabulary({limit:1000});
 assert.equal(curriculum.items.length,1000);
 assert.equal(new Set(curriculum.items.map(x=>x.term.toLowerCase())).size,1000);
 assert.equal(curriculum.target_total,1000);
 assert.ok(curriculum.grammar.rules.length>=20);
 assert.ok(curriculum.grammar.irregular_verbs.length>=50);
 assert.ok(curriculum.grammar.irregular_plurals.length>=20);
});

test("English specialist terms are recognized by the learner lexicon",()=>{
 assert.equal(classifyVocabularyKnowledge("consumer price index","en").known,true);
 assert.equal(classifyVocabularyKnowledge("core inflation","en").known,true);
});


test("expanded English grammar curriculum exposes every authored advanced rule",()=>{
 const result=runAdvancedEnglishGrammarSelfTest();
 assert.equal(result.total,175,JSON.stringify(result));
 assert.equal(result.passed,true,JSON.stringify(result));
 const curriculum=getEnglishNewsVocabulary({limit:500});
 assert.equal(curriculum.grammar.rules.length,2365);
});

test("English grammar neural layer covers the expanded curriculum and flags regression examples",()=>{
 const result=runEnglishGrammarNeuralSelfTest();
 assert.equal(result.grammar_rule_count,2365,JSON.stringify(result));
 assert.equal(result.irregular_verb_count,205,JSON.stringify(result));
 assert.equal(result.total_knowledge_items,2570,JSON.stringify(result));
 assert.equal(result.unique_items,2570,JSON.stringify(result));
 assert.equal(result.diagnostic_benchmark.total_positive_cases,29,JSON.stringify(result));
 assert.equal(result.diagnostic_benchmark.valid_control_sentences,27,JSON.stringify(result));
 assert.equal(result.passed,true,JSON.stringify(result));
});
