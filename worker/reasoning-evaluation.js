// Deterministic evaluation utilities for the Dollar evidence-first news reasoner.
// Scores reviewed labels; it does not generate labels or claim market-prediction skill.
export const REASONING_EVALUATION_VERSION = "dollar-reasoning-eval-1.0.0";

const clamp01 = value => Math.max(0, Math.min(1, Number(value) || 0));
const norm = value => String(value ?? "").normalize("NFKC").toLocaleLowerCase()
  .replace(/[يى]/g,"ی").replace(/ك/g,"ک").replace(/[\u064B-\u065F\u0670]/g,"")
  .replace(/[^\p{L}\p{N}]+/gu," ").trim();

function ratio(numerator, denominator) {
  return denominator > 0 ? numerator / denominator : null;
}

export function scoreReasoningEvaluationCase({case_id, gold, analysis}) {
  if (!case_id || !gold || !analysis) throw new TypeError("case_id, gold and analysis are required");
  const expectedAbstain = gold.expected_abstain === true;
  const actualAbstain = analysis.abstained === true || analysis.analysis?.abstain === true;
  const abstentionCorrect = expectedAbstain === actualAbstain;

  const audit = analysis.evidence_audit || {};
  const quotes = Array.isArray(audit.items)
    ? audit.items.flatMap(item => item.evidence_quotes || [])
    : [];
  const verifiedQuotes = quotes.filter(item => item.quote_verified === true && item.numeric_fidelity !== false).length;
  const evidenceQuotePrecision = ratio(verifiedQuotes, quotes.length);

  const implications = Array.isArray(analysis.analysis?.market_implications)
    ? analysis.analysis.market_implications
    : Array.isArray(analysis.market_implications) ? analysis.market_implications : [];
  const expectedDirection = gold.expected_market_direction || "unclear";
  const observedDirections = implications.map(item => item.impact_direction).filter(Boolean);
  const directionKnown = expectedDirection !== "unclear";
  const directionCorrect = directionKnown
    ? observedDirections.includes(expectedDirection)
    : null;

  const hypotheses = Array.isArray(analysis.analysis?.causal_hypotheses)
    ? analysis.analysis.causal_hypotheses
    : Array.isArray(analysis.causal_hypotheses) ? analysis.causal_hypotheses : [];
  const structurallyCompleteHypotheses = hypotheses.filter(item =>
    typeof item.mechanism === "string" && item.mechanism.trim() &&
    typeof item.time_order === "string" && item.time_order.trim() &&
    Array.isArray(item.confounders) &&
    typeof item.falsification_test === "string" && item.falsification_test.trim()
  ).length;
  const causalStructureRate = ratio(structurallyCompleteHypotheses, hypotheses.length);

  const confidence = clamp01(analysis.confidence ?? analysis.analysis?.confidence);
  const confidenceBrier = gold.expected_correct === undefined
    ? null
    : (confidence - (gold.expected_correct ? 1 : 0)) ** 2;

  return {
    case_id,
    expected_abstain: expectedAbstain,
    actual_abstain: actualAbstain,
    abstention_correct: abstentionCorrect,
    evidence_quote_count: quotes.length,
    verified_quote_count: verifiedQuotes,
    evidence_quote_precision: evidenceQuotePrecision,
    expected_market_direction: expectedDirection,
    observed_market_directions: observedDirections,
    direction_correct: directionCorrect,
    causal_hypothesis_count: hypotheses.length,
    structurally_complete_causal_hypotheses: structurallyCompleteHypotheses,
    causal_structure_rate: causalStructureRate,
    confidence,
    confidence_brier: confidenceBrier
  };
}

export function aggregateReasoningEvaluation(caseScores) {
  const scores = Array.isArray(caseScores) ? caseScores : [];
  const mean = values => values.length ? values.reduce((a,b)=>a+b,0)/values.length : null;
  const present = key => scores.map(item=>item[key]).filter(value=>typeof value==="number" && Number.isFinite(value));
  const abstention = scores.filter(item=>typeof item.abstention_correct==="boolean");
  const direction = scores.filter(item=>typeof item.direction_correct==="boolean");
  const evaluatedQuotes = scores.filter(item=>typeof item.evidence_quote_precision==="number");
  const causal = scores.filter(item=>typeof item.causal_structure_rate==="number");
  const brier = present("confidence_brier");
  return {
    version: REASONING_EVALUATION_VERSION,
    sample_size: scores.length,
    abstention_accuracy: ratio(abstention.filter(item=>item.abstention_correct).length, abstention.length),
    market_direction_accuracy: ratio(direction.filter(item=>item.direction_correct).length, direction.length),
    evidence_quote_precision: mean(evaluatedQuotes.map(item=>item.evidence_quote_precision)),
    causal_structure_rate: mean(causal.map(item=>item.causal_structure_rate)),
    confidence_brier_score: mean(brier),
    evaluated_counts: {
      abstention: abstention.length,
      market_direction: direction.length,
      evidence_quotes: evaluatedQuotes.length,
      causal_hypotheses: causal.length,
      confidence_calibration: brier.length
    },
    warning: "این معیارها فقط برچسب‌های بازبینی‌شده را ارزیابی می‌کنند؛ نمونهٔ کوچک یا مصنوعی، دقت واقعی بازار را اثبات نمی‌کند."
  };
}

export function validateGoldEvaluationCase(item) {
  const errors = [];
  if (!item || typeof item !== "object") return ["case must be an object"];
  if (!item.case_id) errors.push("case_id is required");
  if (!item.source?.url || !item.source?.published_at || !item.source?.text_sha256)
    errors.push("source url, published_at and text_sha256 are required");
  if (!item.review?.annotator_count || item.review.annotator_count < 2)
    errors.push("at least two annotators are required");
  if (!item.review?.adjudication) errors.push("review adjudication is required");
  if (!item.gold || typeof item.gold.expected_abstain !== "boolean")
    errors.push("gold.expected_abstain must be boolean");
  if (!item.horizon || !item.asset) errors.push("asset and evaluation horizon are required");
  return errors;
}
