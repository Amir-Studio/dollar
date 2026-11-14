// Multi-turn conversational context layer for Dollar's bilingual pragmatics engine.
// It preserves turn boundaries and speaker metadata; it does not infer private emotions or certainty.
import { analyzePragmatics } from "./pragmatics-engine.js";

export const CONVERSATION_CONTEXT_VERSION = "dollar-conversation-context-0.1.0";
const MAX_TURNS = 12;
const MAX_CHARS_PER_TURN = 1200;
const QUESTION_END = /[?؟]\s*$/u;
const REQUEST_CUES = {
  fa: ["لطفاً","لطفا","می‌شود","میشه","می‌تونی","میتونی","ممکنه","خواهش می‌کنم"],
  en: ["please","could you","can you","would you","would you mind"]
};

function detectLanguage(text, requested) {
  if (requested === "fa" || requested === "en") return requested;
  return /[\u0600-\u06ff]/u.test(text) ? "fa" : "en";
}

function normalizeRole(role, index, total) {
  const value = String(role || "").toLowerCase();
  if (["user","assistant","system","other"].includes(value)) return value;
  return index === total - 1 ? "user" : "other";
}

function isRequest(text, language) {
  const lower = String(text || "").toLocaleLowerCase("en-US");
  return REQUEST_CUES[language].some(cue => lower.includes(cue));
}

export function analyzeConversationContext(turns, language) {
  const input = Array.isArray(turns) ? turns : [];
  const selected = input.slice(-MAX_TURNS).map((turn, index, all) => ({
    role: normalizeRole(turn?.role, index, all.length),
    text: String(turn?.content ?? turn?.text ?? "").trim().slice(0, MAX_CHARS_PER_TURN)
  })).filter(turn => turn.text);

  if (!selected.length) {
    return {
      version: CONVERSATION_CONTEXT_VERSION,
      status: "empty_conversation",
      turn_count: 0,
      analysis: null,
      limitations: ["No usable turns were supplied."]
    };
  }

  const current = selected[selected.length - 1];
  const lang = detectLanguage(current.text, language);
  const previous = selected.slice(0, -1);
  const context = previous.map(turn => turn.text).join("\n");
  const previousTurn = previous.at(-1) || null;
  const previousQuestion = previous.slice().reverse().find(turn => QUESTION_END.test(turn.text)) || null;
  const previousRequest = previous.slice().reverse().find(turn => isRequest(turn.text, lang)) || null;

  const analysis = analyzePragmatics(current.text, lang, context);
  const isShortReply = current.text.length <= 48;
  const likelyRespondingToQuestion = Boolean(previousQuestion && previousQuestion.role !== current.role);
  const likelyRespondingToRequest = Boolean(previousRequest && previousRequest.role !== current.role);

  let conversationalRole = "standalone_or_unclear";
  if (likelyRespondingToQuestion) conversationalRole = "possible_answer_to_previous_question";
  else if (likelyRespondingToRequest) conversationalRole = "possible_response_to_previous_request";
  else if (previousTurn && previousTurn.role !== current.role && isShortReply) conversationalRole = "short_reply_with_prior_context";

  return {
    version: CONVERSATION_CONTEXT_VERSION,
    status: "analyzed",
    language: lang,
    turn_count: selected.length,
    context_turn_count: previous.length,
    context_truncated: input.length > MAX_TURNS || input.some(turn => String(turn?.content ?? turn?.text ?? "").length > MAX_CHARS_PER_TURN),
    current_turn: { role: current.role, text: current.text },
    conversational_role: conversationalRole,
    context_links: {
      previous_turn_role: previousTurn?.role || null,
      previous_question_role: previousQuestion?.role || null,
      previous_request_role: previousRequest?.role || null,
      likely_response_to_question: likelyRespondingToQuestion,
      likely_response_to_request: likelyRespondingToRequest,
      inferred_emotion_or_intent: false
    },
    analysis,
    limitations: [
      "Turn-role and question/request links are heuristic, not proof of who a message addresses.",
      "Sarcasm, sincerity, emotion and hidden intent cannot be established from text alone.",
      "Context is limited to the most recent 12 turns and 1,200 characters per turn."
    ]
  };
}
