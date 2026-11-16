// Validation helpers for the human-supervised Dollar news learning loop.
const META_FIELDS = new Set(["version","language","input_coverage","interpretation_policy","generated_at","model_version"]);
const BLOCKED_PATH_PARTS = new Set(["__proto__","prototype","constructor"]);

export function buildLearningAssertions(category,predictedOutput,correctedOutput) {
  const corrected=correctedOutput&&typeof correctedOutput==="object"&&!Array.isArray(correctedOutput)?correctedOutput:{};
  const predicted=predictedOutput&&typeof predictedOutput==="object"&&!Array.isArray(predictedOutput)?predictedOutput:{};
  let assertions=Array.isArray(corrected.assertions)?corrected.assertions:null;
  let source="explicit";
  if(!assertions) {
    source="derived_changed_fields";
    assertions=Object.keys(corrected).filter(key=>!META_FIELDS.has(key)&&
      JSON.stringify(predicted[key])!==JSON.stringify(corrected[key]))
      .map(path=>({path,equals:corrected[path]}));
  }
  const normalized=assertions.filter(x=>x&&typeof x.path==="string"&&x.path.length>0&&x.path.length<=160&&
    !x.path.split(".").some(part=>BLOCKED_PATH_PARTS.has(part))&&
    Object.prototype.hasOwnProperty.call(x,"equals"))
    .slice(0,32).map(x=>({path:x.path,equals:x.equals}));
  return {assertions:normalized,source};
}

export function validateLearningCaseInput(category,inputText,expectedOutput) {
  const input=String(inputText||"").trim();
  if(input.length<20) return {ok:false,reason:"input_text_too_short"};
  if(category==="contradiction") {
    let payload;
    try { payload=JSON.parse(input); } catch { return {ok:false,reason:"contradiction_input_must_be_json"}; }
    if(!Array.isArray(payload?.articles)||payload.articles.length<2)
      return {ok:false,reason:"contradiction_requires_two_articles"};
  }
  const assertions=Array.isArray(expectedOutput?.assertions)?expectedOutput.assertions:[];
  if(!assertions.length) return {ok:false,reason:"corrected_output_has_no_comparable_assertions"};
  if(assertions.some(x=>!x||typeof x.path!=="string"||!x.path.trim()||!Object.prototype.hasOwnProperty.call(x,"equals")))
    return {ok:false,reason:"invalid_learning_assertion"};
  return {ok:true,assertion_count:assertions.length};
}

export function diagnoseLearningPipeline(summary={}) {
  const feedback=Number(summary.feedback_total)||0;
  const submitted=Number(summary.feedback_submitted)||0;
  const verified=Number(summary.feedback_verified)||0;
  const cases=Number(summary.learning_cases)||0;
  const scorable=Number(summary.evaluated_cases)||0;
  const failed=Number(summary.cases_failed)||0;
  const unscorable=Number(summary.cases_unscorable)||0;
  if(!feedback) return {status:"blocked_no_feedback",reason:"no_feedback_submissions",next_step:"submit_a_corrected_example"};
  if(submitted>0&&verified===0) return {status:"waiting_for_human_review",reason:"feedback_not_verified",next_step:"review_submitted_feedback"};
  if(verified>0&&cases===0) return {status:"blocked_missing_learning_cases",reason:"verified_feedback_without_cases",next_step:"repair_feedback_case_creation"};
  if(unscorable>0) return {status:"blocked_unscorable_cases",reason:"missing_or_invalid_assertions",next_step:"add_explicit_expected_assertions"};
  if(!scorable) return {status:"blocked_no_scorable_cases",reason:"no_verified_scorable_examples",next_step:"create_verified_cases_with_assertions"};
  if(failed>0) return {status:"corrections_available",reason:"verified_cases_failed_regression_checks",next_step:"review_recurring_failures_and_retest"};
  return {status:"learning_memory_ready",reason:"verified_cases_scored",next_step:"refresh_verified_error_memory"};
}
