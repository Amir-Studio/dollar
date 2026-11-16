import test from "node:test";
import assert from "node:assert/strict";
import {
  diagnoseEnglishGrammar,
  runEnglishGrammarDiagnosticBenchmark,
  runEnglishGrammarNeuralSelfTest
} from "./english-neural-grammar-engine.js";

test("English grammar curriculum has unique, populated knowledge records", () => {
  const result=runEnglishGrammarNeuralSelfTest();
  assert.equal(result.grammar_rule_count,2367);
  assert.equal(result.irregular_verb_count,205);
  assert.equal(result.unique_items,result.total_knowledge_items);
  assert.equal(result.passed,true,JSON.stringify(result,null,2));
});

test("isolated grammar diagnostic benchmark detects all target errors without flagging controls", () => {
  const result=runEnglishGrammarDiagnosticBenchmark();
  assert.equal(result.positive_cases_detected,result.total_positive_cases);
  assert.deepEqual(result.missed,[]);
  assert.deepEqual(result.false_positives,[]);
  assert.equal(result.passed,true);
  assert.equal(result.total_positive_cases,29);
  assert.equal(result.valid_control_sentences,27);
});

test("valid past participles and gerund constructions are not flagged by targeted checks", () => {
  const valid=[
    "The proposal was written yesterday.",
    "The agency had gone home.",
    "I look forward to meeting them.",
    "They are used to working late.",
    "Each of the reports is ready."
  ];
  for(const sentence of valid) {
    assert.deepEqual(diagnoseEnglishGrammar(sentence),[],sentence);
  }
});
