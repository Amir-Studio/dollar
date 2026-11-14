const median = values => {
  if (!values.length) return 0;
  const sorted=[...values].sort((a,b)=>a-b), middle=Math.floor(sorted.length/2);
  return sorted.length%2 ? sorted[middle] : (sorted[middle-1]+sorted[middle])/2;
};
const mean = values => values.length ? values.reduce((sum,value)=>sum+value,0)/values.length : 0;
const validPositive = value => Number.isFinite(Number(value)) && Number(value)>0;

/**
 * Estimate a bounded live residual correction.
 * A correction is accepted only after at least 30 matured forecasts and
 * when the recent and preceding residual windows agree on the bias direction.
 */
export function robustBiasCalibration(rows) {
  const valid=(Array.isArray(rows)?rows:[])
    .filter(row=>validPositive(row?.predicted_price)&&validPositive(row?.actual_price))
    .sort((a,b)=>Date.parse(b.actual_at||0)-Date.parse(a.actual_at||0))
    .slice(0,60);
  if(valid.length<30) return {
    samples:valid.length,applied:false,log_bias:0,adjustment_log:0,
    reason:"insufficient_matured_forecasts",required:30
  };
  const residuals=valid.map(row=>Math.log(Number(row.actual_price)/Number(row.predicted_price)));
  const recent=median(residuals.slice(0,15));
  const previous=median(residuals.slice(15,30));
  if(Math.abs(recent)<0.0005 || Math.abs(previous)<0.0005 || Math.sign(recent)!==Math.sign(previous)) {
    return {
      samples:valid.length,applied:false,log_bias:Number(median(residuals).toFixed(6)),
      adjustment_log:0,recent_bias_log:Number(recent.toFixed(6)),
      previous_bias_log:Number(previous.toFixed(6)),reason:"bias_not_stable_across_windows"
    };
  }
  const center=median(residuals);
  const mad=median(residuals.map(value=>Math.abs(value-center)));
  const clip=3*Math.max(mad,0.00025);
  const winsorized=residuals.map(value=>Math.max(center-clip,Math.min(center+clip,value)));
  const robustMean=mean(winsorized);
  const shrink=Math.min(0.5,valid.length/60);
  const adjustment=Math.max(-0.01,Math.min(0.01,robustMean*shrink));
  return {
    samples:valid.length,applied:true,log_bias:Number(center.toFixed(6)),
    robust_mean_log_bias:Number(robustMean.toFixed(6)),mad_log:Number(mad.toFixed(6)),
    recent_bias_log:Number(recent.toFixed(6)),previous_bias_log:Number(previous.toFixed(6)),
    adjustment_log:Number(adjustment.toFixed(6)),reason:"stable_robust_residual_bias"
  };
}

/** Diagnose matured forecast errors without changing the underlying model. */
export function analyzeForecastErrors(rows) {
  const sample=(Array.isArray(rows)?rows:[])
    .filter(row=>validPositive(row?.predicted_price)&&validPositive(row?.reference_price)&&validPositive(row?.actual_price))
    .sort((a,b)=>Date.parse(b.actual_at||0)-Date.parse(a.actual_at||0))
    .slice(0,60);
  const errors=sample.map(row=>Math.abs((Number(row.actual_price)/Number(row.predicted_price)-1)*100));
  const baseline=sample.map(row=>Math.abs((Number(row.actual_price)/Number(row.reference_price)-1)*100));
  const signed=sample.map(row=>(Number(row.actual_price)/Number(row.predicted_price)-1)*100);
  const mae=mean(errors),baselineMae=mean(baseline),signedBias=median(signed);
  const directional=sample.filter(row=>typeof row.direction_correct==="boolean");
  const directionalAccuracy=directional.length?directional.filter(row=>row.direction_correct).length/directional.length*100:null;
  const recent=errors.slice(0,20),older=errors.slice(20);
  const recentMae=recent.length?mean(recent):null,olderMae=older.length?mean(older):null;
  const intervalRows=sample.filter(row=>validPositive(row.lower_price)&&validPositive(row.upper_price)&&Number(row.upper_price)>=Number(row.lower_price));
  const intervalCoverage=intervalRows.length
    ? intervalRows.filter(row=>Number(row.actual_price)>=Number(row.lower_price)&&Number(row.actual_price)<=Number(row.upper_price)).length/intervalRows.length*100
    : null;
  const intervalWidth=intervalRows.length
    ? mean(intervalRows.map(row=>(Number(row.upper_price)-Number(row.lower_price))/Number(row.reference_price)*100))
    : null;
  const skill=baselineMae>0?(1-mae/baselineMae)*100:0;
  const drift=recent.length>=10&&older.length>=10&&olderMae>0&&recentMae>olderMae*1.5;
  const profile=Math.abs(signedBias)>=0.15
    ? (signedBias>0?"systematic_underprediction":"systematic_overprediction")
    : directionalAccuracy!==null&&directionalAccuracy<45
      ? "directional_instability"
      : "balanced";
  return {
    samples:sample.length,mae_pct:Number(mae.toFixed(5)),
    no_change_mae_pct:Number(baselineMae.toFixed(5)),
    skill_vs_no_change_pct:Number(skill.toFixed(3)),
    signed_bias_pct:Number(signedBias.toFixed(5)),
    error_profile:profile,
    directional_accuracy_pct:directionalAccuracy===null?null:Number(directionalAccuracy.toFixed(2)),
    directional_samples:directional.length,
    recent_20_mae_pct:recentMae===null?null:Number(recentMae.toFixed(5)),
    previous_40_mae_pct:olderMae===null?null:Number(olderMae.toFixed(5)),
    performance_drift:drift,
    interval_samples:intervalRows.length,
    interval_coverage_pct:intervalCoverage===null?null:Number(intervalCoverage.toFixed(2)),
    average_interval_width_pct:intervalWidth===null?null:Number(intervalWidth.toFixed(4))
  };
}
