import test from "node:test";
import assert from "node:assert/strict";
import { analyzeConversationContext, CONVERSATION_CONTEXT_VERSION } from "./conversation-context-engine.js";

test("multi-turn analysis uses preceding turns to support an irony candidate", () => {
  const result = analyzeConversationContext([
    { role: "user", content: "سه ساعت دیر رسیدی و همه منتظر ماندند." },
    { role: "assistant", content: "چه به موقع رسیدی" }
  ], "fa");
  assert.equal(result.analysis.interpretation_status, "context_supported_candidate");
  assert.equal(result.analysis.confidence_is_calibrated, false);
  assert.equal(result.context_turn_count, 1);
});

test("short Persian reply is linked to a preceding question without claiming emotion", () => {
  const result = analyzeConversationContext([
    { role: "assistant", content: "فردا در جلسه شرکت می‌کنی؟" },
    { role: "user", content: "باشه" }
  ], "fa");
  assert.equal(result.conversational_role, "possible_answer_to_previous_question");
  assert.equal(result.context_links.likely_response_to_question, true);
  assert.equal(result.context_links.inferred_emotion_or_intent, false);
  assert.equal(result.analysis.interpretation_status, "ambiguous_multiple_readings");
});

test("English short reply can be connected to a preceding request", () => {
  const result = analyzeConversationContext([
    { role: "user", content: "Could you send the report today, please?" },
    { role: "assistant", content: "Sure." }
  ], "en");
  assert.equal(result.conversational_role, "possible_response_to_previous_request");
  assert.equal(result.context_links.likely_response_to_request, true);
});

test("turn limit is enforced and reported", () => {
  const turns = Array.from({ length: 15 }, (_, i) => ({ role: i % 2 ? "assistant" : "user", content: "Turn " + i }));
  const result = analyzeConversationContext(turns, "en");
  assert.equal(result.turn_count, 12);
  assert.equal(result.context_truncated, true);
});

test("empty conversation returns a safe abstention", () => {
  const result = analyzeConversationContext([], "en");
  assert.equal(result.status, "empty_conversation");
  assert.equal(result.analysis, null);
});

test("unseen figurative wording is not forced into a known category", () => {
  const result = analyzeConversationContext([
    { role: "user", content: "The room felt like a freezer." },
    { role: "assistant", content: "I understand." }
  ], "en");
  assert.deepEqual(result.analysis.categories, []);
  assert.equal(result.analysis.interpretation_status, "no_known_marker");
});

test("module version is explicit", () => {
  assert.match(CONVERSATION_CONTEXT_VERSION, /^dollar-conversation-context-/);
});
