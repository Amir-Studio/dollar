const median = values => {
  if (!values.length) return 0;
  const sorted=[...values].sort((a,b)=>a-b), middle=Math.floor(sorted.length/2);
  return sorted.length%2 ? sorted[middle] : (sorted[middle-1]+sorted[middle])/2;
};
const mean = values => values.length ? values.reduce((sum,value)=>sum+value,0)/values.length : 0;
const positive = value => Number.isFinite(Number(value)) && Number(value)>0;
const number = value => value===null||value===undefined||value==="" ? null : Number.isFinite(Number(value)) ? Number(value) : null;
const round = (value,digits=4) => Number(value.toFixed(digits));
const priceError = (predicted,actual) => Math.abs((actual/predicted-1)*100);

function contextOf(row) {
  const v=row?.validation||{}, q=v.quote_quality||{}, n=v.news_context||{};
  const weights=Object.values(row?.model_weights||{}).map(Number).filter(Number.isFinite);
  const age=number(v.quote_age_hours), sources=number(q.source_count), spread=number(q.spread_pct), risk=number(n.event_risk_score);
  return {
    quote_source:String(row?.quote_source||"unknown"),
    history_provider:String(v.history_provider||row?.history_provider||"unknown"),
    forecast_mode:String(v.forecast_mode||"unknown"),
    quote_age_hours:age,
    quote_age_band:age===null?"unknown":age<=1?"fresh_0_1h":age<=6?"recent_1_6h":age<=24?"aging_6_24h":"stale_over_24h",
    quote_source_count:sources,
    quote_consensus_band:sources===null?"unknown":sources<=1?"single_source":sources<3?"limited_sources":"multi_source",
    quote_spread_pct:spread,
    quote_spread_band:spread===null?"unknown":spread<1?"tight_under_1pct":spread<2?"moderate_1_2pct":"wide_2pct_plus",
    event_risk_score:risk,
    event_risk_band:risk===null?"unknown":risk<30?"low":risk<65?"moderate":"elevated",
    max_model_weight:weights.length?Math.max(...weights):null
  };
}

/** Candidate factors are correlations or observed symptoms, never causal proof. */
export function diagnoseForecastRow(row) {
  if(!positive(row?.predicted_price)||!positive(row?.reference_price)||!positive(row?.actual_price)) return {valid:false};
  const predicted=Number(row.predicted_price), reference=Number(row.reference_price), actual=Number(row.actual_price);
  const predictedMove=number(row.predicted_change_pct) ?? (predicted/reference-1)*100;
  const actualMove=(actual/reference-1)*100;
  const signedError=(actual/predicted-1)*100;
  const low=number(row.lower_price), high=number(row.upper_price);
  const intervalValid=low!==null&&high!==null&&high>=low;
  const intervalHit=intervalValid?actual>=low&&actual<=high:null;
  const context=contextOf(row), candidates=[];
  if(row.direction_correct===false) candidates.push({code:"directional_miss",evidence:"realized direction differed from issued direction",strength:"observed_symptom"});
  if(Math.abs(predictedMove)>Math.abs(actualMove)+0.15) candidates.push({code:"magnitude_overforecast",evidence:"predicted absolute move exceeded realized move",strength:"observed_symptom"});
  if(Math.abs(actualMove)>Math.abs(predictedMove)+0.15) candidates.push({code:"magnitude_underforecast",evidence:"realized absolute move exceeded predicted move",strength:"observed_symptom"});
  if(context.quote_age_hours!==null&&context.quote_age_hours>6) candidates.push({code:"aging_reference_quote",evidence:"reference quote age exceeded six hours",strength:"contextual_risk"});
  if(context.quote_source_count!==null&&context.quote_source_count<=1) candidates.push({code:"thin_quote_consensus",evidence:"quote used one or fewer contributing sources",strength:"contextual_risk"});
  if(context.quote_spread_pct!==null&&context.quote_spread_pct>=2) candidates.push({code:"wide_quote_dispersion",evidence:"provider spread was at least two percent",strength:"contextual_risk"});
  if(context.event_risk_score!==null&&context.event_risk_score>=65) candidates.push({code:"elevated_news_event_risk",evidence:"news risk score was at least 65/100; news was not used directionally",strength:"contextual_risk"});
  if(context.max_model_weight!==null&&context.max_model_weight>=0.8) candidates.push({code:"concentrated_ensemble_weight",evidence:"one component held at least 80 percent of ensemble weight",strength:"contextual_risk"});
  if(intervalHit===false) candidates.push({code:"prediction_interval_miss",evidence:"actual price fell outside the published interval",strength:"observed_symptom"});
  return {
    valid:true,
    error_metrics:{
      absolute_error_pct:round(priceError(predicted,actual)),
      signed_error_pct:round(signedError),
      actual_move_pct:round(actualMove),predicted_move_pct:round(predictedMove),
      direction_correct:typeof row.direction_correct==="boolean"?row.direction_correct:null,
      interval_hit:intervalHit,interval_width_pct:intervalValid?round((high-low)/reference*100):null
    },
    contributing_factors:context,root_cause_candidates:candidates
  };
}

function cohortStats(rows) {
  const d=rows.map(diagnoseForecastRow).filter(x=>x.valid);
  if(!d.length) return null;
  const errors=d.map(x=>x.error_metrics.absolute_error_pct);
  const baseline=rows.filter(r=>positive(r.reference_price)&&positive(r.actual_price)).map(r=>priceError(Number(r.reference_price),Number(r.actual_price)));
  const signed=d.map(x=>x.error_metrics.signed_error_pct), directional=d.filter(x=>x.error_metrics.direction_correct!==null);
  const intervals=d.filter(x=>x.error_metrics.interval_hit!==null);
  const mae=mean(errors),base=mean(baseline);
  return {
    samples:d.length,mae_pct:round(mae),no_change_mae_pct:round(base),
    skill_vs_no_change_pct:round(base>0?(1-mae/base)*100:0,3),
    median_signed_error_pct:round(median(signed)),
    directional_accuracy_pct:directional.length?round(directional.filter(x=>x.error_metrics.direction_correct).length/directional.length*100,2):null,
    interval_coverage_pct:intervals.length?round(intervals.filter(x=>x.error_metrics.interval_hit).length/intervals.length*100,2):null
  };
}
function cohortDiagnostics(rows,minimum=5) {
  const dimensions=["quote_source","history_provider","forecast_mode","quote_age_band","quote_consensus_band","quote_spread_band","event_risk_band"];
  const result={};
  for(const dimension of dimensions){
    const groups=new Map();
    for(const row of rows){const value=contextOf(row)[dimension];if(!groups.has(value))groups.set(value,[]);groups.get(value).push(row);}
    result[dimension]={};
    for(const [value,sample] of groups) if(sample.length>=minimum) result[dimension][value]=cohortStats(sample);
  }
  return result;
}

/** Train on older rows; promote a bounded correction only if a later holdout improves. */
export function robustBiasCalibration(rows) {
  const valid=(Array.isArray(rows)?rows:[]).filter(r=>positive(r?.predicted_price)&&positive(r?.actual_price))
    .sort((a,b)=>Date.parse(b.actual_at||0)-Date.parse(a.actual_at||0)).slice(0,80);
  if(valid.length<60) return {samples:valid.length,applied:false,log_bias:0,adjustment_log:0,reason:"insufficient_matured_forecasts",required:60};
  const holdout=valid.slice(0,20), training=valid.slice(20,80);
  const residuals=training.map(r=>Math.log(Number(r.actual_price)/Number(r.predicted_price)));
  const recent=median(residuals.slice(0,20)), older=median(residuals.slice(20,40));
  if(Math.abs(recent)<0.0005||Math.abs(older)<0.0005||Math.sign(recent)!==Math.sign(older))
    return {samples:valid.length,training_samples:training.length,holdout_samples:holdout.length,applied:false,log_bias:round(median(residuals),6),adjustment_log:0,recent_training_bias_log:round(recent,6),older_training_bias_log:round(older,6),reason:"training_bias_not_stable"};
  const center=median(residuals), mad=median(residuals.map(x=>Math.abs(x-center))), clip=3*Math.max(mad,0.00025);
  const robustMean=mean(residuals.map(x=>Math.max(center-clip,Math.min(center+clip,x))));
  const candidate=Math.max(-0.01,Math.min(0.01,robustMean*Math.min(0.5,training.length/80)));
  const holdoutResiduals=holdout.map(r=>Math.log(Number(r.actual_price)/Number(r.predicted_price)));
  const holdoutBias=median(holdoutResiduals);
  if(Math.abs(holdoutBias)<0.0005||Math.sign(holdoutBias)!==Math.sign(candidate))
    return {samples:valid.length,training_samples:training.length,holdout_samples:holdout.length,applied:false,log_bias:round(center,6),adjustment_log:0,holdout_bias_log:round(holdoutBias,6),reason:"holdout_does_not_confirm_training_bias"};
  const before=mean(holdoutResiduals.map(x=>Math.abs(Math.expm1(x))));
  const after=mean(holdoutResiduals.map(x=>Math.abs(Math.expm1(x-candidate))));
  const improvement=before>0?(1-after/before)*100:0;
  if(improvement<3) return {
    samples:valid.length,training_samples:training.length,holdout_samples:holdout.length,applied:false,
    log_bias:round(center,6),adjustment_log:0,holdout_bias_log:round(holdoutBias,6),
    holdout_mae_before_pct:round(before*100),holdout_mae_after_pct:round(after*100),
    holdout_improvement_pct:round(improvement,3),reason:"holdout_improvement_below_3pct"
  };
  return {
    samples:valid.length,training_samples:training.length,holdout_samples:holdout.length,applied:true,
    log_bias:round(center,6),robust_mean_log_bias:round(robustMean,6),mad_log:round(mad,6),
    recent_training_bias_log:round(recent,6),older_training_bias_log:round(older,6),
    holdout_bias_log:round(holdoutBias,6),holdout_mae_before_pct:round(before*100),
    holdout_mae_after_pct:round(after*100),holdout_improvement_pct:round(improvement,3),
    adjustment_log:round(candidate,6),reason:"chronological_holdout_confirmed_robust_residual_bias"
  };
}

export function analyzeForecastErrors(rows) {
  const sample=(Array.isArray(rows)?rows:[]).filter(r=>positive(r?.predicted_price)&&positive(r?.reference_price)&&positive(r?.actual_price))
    .sort((a,b)=>Date.parse(b.actual_at||0)-Date.parse(a.actual_at||0)).slice(0,80);
  const d=sample.map(diagnoseForecastRow), errors=d.map(x=>x.error_metrics.absolute_error_pct);
  const baseline=sample.map(r=>priceError(Number(r.reference_price),Number(r.actual_price)));
  const signed=d.map(x=>x.error_metrics.signed_error_pct), directional=d.filter(x=>x.error_metrics.direction_correct!==null);
  const intervals=d.filter(x=>x.error_metrics.interval_hit!==null), recent=errors.slice(0,20), older=errors.slice(20);
  const mae=mean(errors),base=mean(baseline),recentMae=recent.length?mean(recent):null,olderMae=older.length?mean(older):null;
  const signedBias=median(signed),directionalAccuracy=directional.length?directional.filter(x=>x.error_metrics.direction_correct).length/directional.length*100:null;
  const drift=recent.length>=10&&older.length>=10&&olderMae>0&&recentMae>olderMae*1.5;
  const profile=Math.abs(signedBias)>=0.15?(signedBias>0?"systematic_underprediction":"systematic_overprediction"):
    directionalAccuracy!==null&&directionalAccuracy<45?"directional_instability":"balanced";
  const counts={};
  for(const item of d) for(const candidate of item.root_cause_candidates) counts[candidate.code]=(counts[candidate.code]||0)+1;
  return {
    samples:sample.length,mae_pct:round(mae),no_change_mae_pct:round(base),
    skill_vs_no_change_pct:round(base>0?(1-mae/base)*100:0,3),signed_bias_pct:round(signedBias,5),
    error_profile:profile,directional_accuracy_pct:directionalAccuracy===null?null:round(directionalAccuracy,2),
    directional_samples:directional.length,recent_20_mae_pct:recentMae===null?null:round(recentMae),
    previous_60_mae_pct:olderMae===null?null:round(olderMae),performance_drift:drift,
    interval_samples:intervals.length,
    interval_coverage_pct:intervals.length?round(intervals.filter(x=>x.error_metrics.interval_hit).length/intervals.length*100,2):null,
    average_interval_width_pct:intervals.length?round(mean(intervals.map(x=>x.error_metrics.interval_width_pct)),4):null,
    root_cause_candidates:Object.entries(counts).map(([code,count])=>({code,count,share_pct:round(count/Math.max(1,sample.length)*100,1)})).sort((a,b)=>b.count-a.count),
    cohort_diagnostics:cohortDiagnostics(sample),
    diagnosis_caution:"These are associations and observed symptoms, not proof of causation. Cohorts with fewer than five records are withheld."
  };
}
