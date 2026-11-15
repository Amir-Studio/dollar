// Dollar Market Decision Engine v0.2
// Evidence synthesis with explicit abstention. No fabricated probability or trading signal.
export const DECISION_ENGINE_VERSION = "0.3.0-deep-evidence";

const clamp=(x,lo,hi)=>Math.max(lo,Math.min(hi,x));
const finite=x=>x!==null&&x!==undefined&&x!==""&&Number.isFinite(Number(x));
const num=x=>finite(x)?Number(x):null;
const dateMs=x=>{const n=typeof x==="number"?x:Date.parse(x||"");return Number.isFinite(n)?n:null;};
const EVENT_LABELS={
 rate_hike:"افزایش نرخ بهره",rate_cut:"کاهش نرخ بهره",
 sanction_new:"اعمال یا تشدید تحریم",sanction_relief:"کاهش یا لغو تحریم",
 talks:"مذاکرات",ceasefire:"آتش‌بس یا کاهش تنش",conflict:"درگیری یا تشدید تنش",
 inflation_up:"افزایش تورم",inflation_down:"کاهش تورم",
 oil_supply:"اختلال عرضه نفت",oil_supply_increase:"افزایش عرضه نفت",
 currency_intervention:"مداخله ارزی",currency_devaluation:"کاهش ارزش پول",
 gold_demand:"تغییر تقاضای طلا"
};
const MULTIPART_SUFFIXES=new Set(["co.uk","com.au","co.jp","com.br","co.in","com.tr","com.cn"]);
function hostOf(value){
 const raw=String(value||"").toLowerCase().replace(/^https?:\/\//,"").split("/")[0].replace(/^www\./,"").split(":")[0];
 const parts=raw.split(".").filter(Boolean);
 if(parts.length<2)return raw||"unknown";
 const suffix=parts.slice(-2).join(".");
 return MULTIPART_SUFFIXES.has(suffix)&&parts.length>=3?parts.slice(-3).join("."):suffix;
}
function words(value){
 return String(value||"").toLowerCase().normalize("NFKC")
  .replace(/[^\p{L}\p{N}]+/gu," ").trim().split(/\s+/).filter(x=>x.length>1);
}
function similarity(a,b){
 const A=new Set(words(a)),B=new Set(words(b));
 if(!A.size||!B.size)return 0;
 let common=0;for(const x of A)if(B.has(x))common++;
 return common/(A.size+B.size-common);
}
function clusterStories(items){
 const clusters=[];
 for(const item of items){
  const title=String(item?.title||"").trim();
  if(!title)continue;
  let match=clusters.find(c=>similarity(c.title,title)>=0.82);
  if(!match){match={title,items:[]};clusters.push(match);}
  match.items.push(item);
 }
 return clusters;
}
function historyMetrics(history,now){
 const rows=Array.isArray(history?.rows)?history.rows:[];
 const clean=rows.map(r=>({t:dateMs(r?.date??r?.timestamp??r?.observed_at),p:num(r?.close??r?.price)}))
  .filter(x=>x.t!==null&&x.p!==null&&x.p>0&&x.t<=now+300000)
  .sort((a,b)=>a.t-b.t);
 const dedup=[];
 for(const row of clean){if(dedup.length&&dedup[dedup.length-1].t===row.t)dedup[dedup.length-1]=row;else dedup.push(row);}
 const summary=history?.summary||history||{};
 const obs=dedup.length||Number(summary.observations)||0;
 if(dedup.length>=8){
  const last=dedup.at(-1),returns=[];
  for(let i=1;i<dedup.length;i++)returns.push({t:dedup[i].t,r:Math.log(dedup[i].p/dedup[i-1].p)*100});
  const pct=(n)=>dedup.length>n?((last.p/dedup[dedup.length-1-n].p)-1)*100:null;
  const r7=pct(7),r14=pct(14),r30=pct(29);
  const recent=returns.slice(-30).map(x=>x.r);
  const mean=recent.reduce((a,b)=>a+b,0)/Math.max(1,recent.length);
  const volatility=recent.length>1?Math.sqrt(recent.reduce((s,x)=>s+(x-mean)**2,0)/(recent.length-1)):null;
  const directionReturns=returns.slice(-7).map(x=>Math.sign(x.r)).filter(x=>x!==0);
  const consistency=directionReturns.length?Math.max(directionReturns.filter(x=>x>0).length,directionReturns.filter(x=>x<0).length)/directionReturns.length:0;
  const peak=Math.max(...dedup.slice(-30).map(x=>x.p));
  const drawdown=peak>0?(last.p/peak-1)*100:null;
  const intervals=dedup.slice(1).map((x,i)=>x.t-dedup[i].t).filter(x=>x>0).sort((a,b)=>a-b);
  const medianInterval=intervals.length?intervals[Math.floor(intervals.length/2)]:null;
  const lastAge=now-last.t;
  const lastDate=dedup.at(-1).t;
  const lastChange=(r7??r14??r30);
  const trendScore=[r7===null?null:r7*0.5,r14===null?null:r14*0.3,r30===null?null:r30*0.2].filter(x=>x!==null).reduce((a,b)=>a+b,0);
  const signal=lastChange===null?"unknown":trendScore>0.5&&consistency>=0.6?"up":trendScore< -0.5&&consistency>=0.6?"down":"sideways";
  return {observations:obs,last_price:last.p,last_observation_at:new Date(lastDate).toISOString(),last_observation_age_hours:lastAge/3600000,
   return_7_observations_pct:r7,return_14_observations_pct:r14,return_30_observations_pct:r30,
   volatility_pct:volatility,drawdown_30_observations_pct:drawdown,direction_consistency:consistency,
   median_observation_interval_hours:medianInterval===null?null:medianInterval/3600000,trend_score_not_probability:trendScore,
   signal,raw_rows_used:dedup.length};
 }
 const r7=num(summary.momentum_7d_pct??summary.return_7_observations_pct);
 const r14=num(summary.momentum_14d_pct);
 const r30=num(summary.momentum_30d_pct??summary.return_30_observations_pct);
 const volatility=num(summary.daily_volatility_pct);
 const trend=num(summary.daily_trend_pct);
 const fallbackScore=[r7===null?null:r7*0.5,r14===null?null:r14*0.3,r30===null?null:r30*0.2,trend===null?null:trend*3.5].filter(x=>x!==null);
 const score=fallbackScore.reduce((a,b)=>a+b,0);
 return {observations:obs,last_price:num(summary.last_price),last_observation_at:summary.last_date||null,
  last_observation_age_hours:null,return_7_observations_pct:r7,return_14_observations_pct:r14,return_30_observations_pct:r30,
  volatility_pct:volatility,drawdown_30_observations_pct:num(summary.max_drawdown_30d_pct??summary.drawdown_from_30_observation_peak_pct),
  direction_consistency:null,median_observation_interval_hours:null,trend_score_not_probability:fallbackScore.length?score:null,
  signal:fallbackScore.length<1?"unknown":score>0.5?"up":score< -0.5?"down":"sideways",raw_rows_used:0};
}
function historicalEventReactions(context){
 const observations=Array.isArray(context?.observations)?context.observations:[];
 const grouped=new Map();
 for(const item of observations){
  for(const id of Array.isArray(item.event_ids)?item.event_ids:[]){
   const group=grouped.get(id)||{event_id:id,by_horizon:{1:[],3:[],7:[]}};
   const after=item.subsequent_price_observations||{};
   for(const h of [1,3,7]){
    const change=num(after[h]?.change_pct);
    if(change!==null)group.by_horizon[h].push(change);
   }
   grouped.set(id,group);
  }
 }
 const median=values=>{const a=[...values].sort((x,y)=>x-y);if(!a.length)return null;const m=Math.floor(a.length/2);return a.length%2?a[m]:(a[m-1]+a[m])/2;};
 return [...grouped.values()].map(group=>{
  const horizons={};
  for(const h of [1,3,7]){
   const values=group.by_horizon[h],up=values.filter(x=>x>0).length;
   horizons[h]={sample_count:values.length,median_change_pct:values.length>=3?Number(median(values).toFixed(3)):null,
    positive_observation_share:values.length>=3?Number((up/values.length).toFixed(2)):null,
    usable_for_pattern_summary:values.length>=3};
  }
  return {event_id:group.event_id,label_fa:EVENT_LABELS[group.event_id]||group.event_id,horizons,
   interpretation:"historical_temporal_association_not_causation"};
 }).sort((a,b)=>Math.max(b.horizons[1].sample_count,b.horizons[3].sample_count,b.horizons[7].sample_count)-Math.max(a.horizons[1].sample_count,a.horizons[3].sample_count,a.horizons[7].sample_count));
}
function newsMetrics(news,analyses,now){
 const raw=Array.isArray(news)?news:[];
 const rows=Array.isArray(analyses)?analyses:[];
 const clusters=clusterStories(raw);
 const domains=new Set(raw.map(x=>hostOf(x.domain||x.source||x.source_id)).filter(x=>x!=="unknown"));
 const evidence=[];
 for(const a of rows){
  const events=Array.isArray(a.events)?a.events:[];
  if(!events.length)continue;
  const published=dateMs(a.published_at);
  const ageHours=published===null?null:Math.max(0,(now-published)/3600000);
  const fresh=ageHours===null?0.45:Math.exp(-ageHours/36);
  const textFactor=a.input_mode==="headline_plus_rss_excerpt"&&Number(a.content_chars)>80?1:0.58;
  const uncertaintyFactor=a.uncertain?0.45:1;
  const assertion=a.english_semantics?.assertion||"";
  const assertionFactor=["conditional","forecast_or_possibility","negated_or_denied"].includes(assertion)?0.45:assertion==="attributed_report"?0.72:1;
  const reading=a.reading_analysis||{};
  const claimCount=Math.max(0,Number(reading.claim_count)||0);
  const completeCount=Math.max(0,Number(reading.complete_claim_count)||0);
  const conditionalCount=Math.max(0,Number(reading.conditional_count)||0);
  const negatedCount=Math.max(0,Number(reading.negated_count)||0);
  const readingCoverage=claimCount?Math.min(1,completeCount/claimCount):null;
  const uncertaintyRatio=claimCount?Math.min(1,(conditionalCount+negatedCount)/claimCount):0;
  const readingFactor=readingCoverage===null?1:Math.max(0.25,0.65+0.35*readingCoverage-0.25*uncertaintyRatio);
  const lexicalMatchScore=clamp(num(a.confidence)??0.35,0.2,0.92);
  const weight=fresh*textFactor*uncertaintyFactor*assertionFactor*readingFactor*(0.55+0.45*lexicalMatchScore);
  const domain=hostOf(a.source);
  for(const event of events){
   const id=event.id;
   if(!EVENT_LABELS[id])continue;
   const risk=event.market_effect==="risk_up"?"up":event.market_effect==="risk_down"?"down":"mixed";
   evidence.push({event_id:id,label_fa:EVENT_LABELS[id],risk_direction:risk,title:a.title||"",source:domain,
    published_at:a.published_at||null,age_hours:ageHours===null?null:Number(ageHours.toFixed(1)),
    content_type:textFactor===1?"rss_excerpt":"headline_only",assertion,uncertain:!!a.uncertain,reading_coverage:readingCoverage,reading_uncertainty_ratio:uncertaintyRatio,reading_factor:Number(readingFactor.toFixed(3)),reading_coverage:readingCoverage,reading_uncertainty_ratio:uncertaintyRatio,reading_factor:Number(readingFactor.toFixed(3)),
    lexicon_match_score_not_calibrated:lexicalMatchScore,weight:Number(weight.toFixed(3))});
  }
 }
 const riskUp=evidence.filter(x=>x.risk_direction==="up").reduce((s,x)=>s+x.weight,0);
 const riskDown=evidence.filter(x=>x.risk_direction==="down").reduce((s,x)=>s+x.weight,0);
 const riskMixed=evidence.filter(x=>x.risk_direction==="mixed").length;
 const storyIndependent=Math.max(1,clusters.length);
 const riskBalance=riskUp-riskDown;
 const riskSignal=evidence.length<2?"insufficient":riskBalance>=0.65?"higher_risk_pressure":riskBalance<=-0.65?"lower_risk_pressure":"mixed_or_unclear";
 const duplicateRatio=raw.length?Math.max(0,1-clusters.length/raw.length):0;
 const recentCount=raw.filter(x=>{const t=dateMs(x.published_at);return t!==null&&now-t>=0&&now-t<=72*3600000;}).length;
 const excerptCount=rows.filter(x=>x.input_mode==="headline_plus_rss_excerpt"&&Number(x.content_chars)>80).length;
 return {headline_count:raw.length,classified_articles:rows.length,unique_story_clusters:clusters.length,
  likely_syndication_ratio:Number(duplicateRatio.toFixed(2)),unique_publisher_domains:domains.size,
  recent_72h_count:recentCount,excerpt_articles:excerptCount,
  excerpt_coverage_pct:rows.length?Math.round(excerptCount/rows.length*100):0,
  event_mentions:evidence.length,risk_up_weight:Number(riskUp.toFixed(2)),risk_down_weight:Number(riskDown.toFixed(2)),
  risk_mixed_event_count:riskMixed,risk_signal:riskSignal,risk_balance_not_probability:Number(riskBalance.toFixed(2)),
  linguistically_reviewed_articles:rows.filter(x=>Number(x.reading_analysis?.claim_count)>0).length,
  reading_uncertainty_articles:rows.filter(x=>Number(x.reading_analysis?.conditional_count)>0||Number(x.reading_analysis?.negated_count)>0).length,
  linguistically_reviewed_articles:rows.filter(x=>Number(x.reading_analysis?.claim_count)>0).length,
  reading_uncertainty_articles:rows.filter(x=>Number(x.reading_analysis?.conditional_count)>0||Number(x.reading_analysis?.negated_count)>0).length,
  event_evidence:evidence.sort((a,b)=>b.weight-a.weight).slice(0,12),
  note_fa:"فشار ریسک خبری با جهت قیمت دارایی یکسان نیست. خبرهای شرطی، احتمالی، تکذیب‌شده یا صرفاً تیتر وزن کمتری می‌گیرند؛ وزن‌ها احتمال آماری نیستند."};
}
function buildDeepAnalysis({news,languageAnalysis,priceSignal="unknown",now=Date.now()}={}) {
 const raw=Array.isArray(news)?news:[], analyses=Array.isArray(languageAnalysis?.per_news)?languageAnalysis.per_news:[];
 const clusters=clusterStories(raw), evidence=[];
 const clusterFor=title=>{const i=clusters.findIndex(g=>g.items.some(x=>similarity(x?.title,title)>=0.82));return i<0?null:i;};
 for(const a of analyses){
  const title=String(a?.title||"").trim();if(!title)continue;
  const source=hostOf(a.source||a.domain||""), published=dateMs(a.published_at);
  const age=published===null?null:Math.max(0,(now-published)/3600000), mode=String(a.input_mode||"headline_only");
  const simple=a.simple_analysis_fa||{}, status=String(simple.claim_status||a.english_semantics?.assertion||"unclassified");
  const qualified=!!(a.uncertain||simple.conditional||simple.denied_or_disputed||
   ["conditional","forecast_or_possibility","negated_or_denied","unconfirmed_or_uncertain","denied_or_disputed"].includes(status));
  const tier=qualified?"qualified_or_disputed":mode==="full_article"?"full_text_claim_not_independently_verified":
   mode==="headline_plus_rss_excerpt"&&Number(a.content_chars)>80?"excerpt_claim_not_independently_verified":"headline_only";
  for(const event of (Array.isArray(a.events)?a.events:[])){
   if(!event?.id)continue;
   evidence.push({event_id:String(event.id),title:title.slice(0,240),source_domain:source,story_cluster:clusterFor(title),
    published_at:a.published_at||null,age_hours:age===null?null:Number(age.toFixed(1)),input_mode:mode,
    claim_status:status,qualified_or_disputed:qualified,evidence_tier:tier,
    risk_pressure:event.market_effect==="risk_up"?"higher":event.market_effect==="risk_down"?"lower":"mixed"});
  }
 }
 const grouped=new Map();
 for(const e of evidence){if(!grouped.has(e.event_id))grouped.set(e.event_id,[]);grouped.get(e.event_id).push(e);}
 const matrix=[...grouped.entries()].map(([id,items])=>{
  const up=items.filter(x=>x.risk_pressure==="higher"),down=items.filter(x=>x.risk_pressure==="lower");
  const domains=[...new Set(items.map(x=>x.source_domain).filter(x=>x!=="unknown"))];
  const stories=[...new Set(items.map(x=>x.story_cluster).filter(x=>x!==null))];
  const qualified=items.filter(x=>x.qualified_or_disputed).length;
  const full=items.filter(x=>x.evidence_tier==="full_text_claim_not_independently_verified").length;
  const excerpt=items.filter(x=>x.evidence_tier==="excerpt_claim_not_independently_verified").length;
  const headline=items.filter(x=>x.evidence_tier==="headline_only").length, conflict=up.length>0&&down.length>0;
  return {event_id:id,label_fa:EVENT_LABELS[id]||id,evidence_count:items.length,publisher_domain_count:domains.length,
   publisher_domains:domains.slice(0,8),story_cluster_count:stories.length,higher_risk_mentions:up.length,
   lower_risk_mentions:down.length,qualified_or_disputed_count:qualified,full_text_count:full,
   excerpt_count:excerpt,headline_only_count:headline,conflict_detected:conflict,
   status:conflict?"opposing_event_frames":domains.length<2?"single_publisher_domain":
    qualified===items.length?"all_claims_qualified_or_disputed":full?"full_text_available_but_unverified":excerpt?"excerpt_evidence_only":"headline_evidence_only"};
 }).sort((a,b)=>(Number(b.conflict_detected)-Number(a.conflict_detected))||b.evidence_count-a.evidence_count);
 const structured=Array.isArray(languageAnalysis?.structured_claim_conflicts)?languageAnalysis.structured_claim_conflicts:[];
 const headlineConflicts=Array.isArray(languageAnalysis?.possible_conflicts)?languageAnalysis.possible_conflicts:[];
 const domains=new Set(evidence.map(x=>x.source_domain).filter(x=>x!=="unknown"));
 const qualified=evidence.filter(x=>x.qualified_or_disputed).length;
 const full=evidence.filter(x=>x.input_mode==="full_article").length;
 const excerpt=evidence.filter(x=>x.input_mode==="headline_plus_rss_excerpt").length;
 const headline=evidence.filter(x=>x.input_mode==="headline_only").length;
 const conflictCount=matrix.filter(x=>x.conflict_detected).length;
 const gaps=[];
 if(!evidence.length)gaps.push("هیچ رویداد ساختاریافته‌ای از خبرها استخراج نشده است.");
 if(domains.size<2)gaps.push("برای بررسی چندمنبعی، دست‌کم دو دامنهٔ ناشر لازم است.");
 if(!full)gaps.push("متن کامل ناشر در شواهد فعلی موجود نیست.");
 if(qualified)gaps.push("برخی ادعاها مشروط، احتمالی، تکذیب‌شده یا نامطمئن‌اند.");
 if(conflictCount||structured.length||headlineConflicts.length)gaps.push("چارچوب‌های متعارض وجود دارند و باید متن اصلی، زمان و انتساب مقایسه شوند.");
 if(evidence.some(x=>x.age_hours===null))gaps.push("زمان انتشار معتبر برای بعضی شواهد در دسترس نیست.");
 const conclusion=!evidence.length?"insufficient_structured_evidence":
  conflictCount||structured.length?"conflicting_evidence":domains.size<2?"single_domain_evidence":
  !full&&!excerpt?"headline_only_evidence":qualified===evidence.length?"qualified_evidence_only":
  "multi_source_claims_not_independently_verified";
 const supporting=matrix.filter(x=>x.higher_risk_mentions>x.lower_risk_mentions&&!x.conflict_detected).slice(0,6);
 const counter=matrix.filter(x=>x.lower_risk_mentions>x.higher_risk_mentions||x.conflict_detected).slice(0,6);
 const contextual=matrix.filter(x=>x.status==="all_claims_qualified_or_disputed").slice(0,6);
 return {engine:"dollar_deep_evidence_analysis",version:"0.1.0",conclusion_state:conclusion,
  review_state:conclusion==="insufficient_structured_evidence"?"abstain":conclusion==="conflicting_evidence"?"hold_for_conflict_resolution":
   ["single_domain_evidence","headline_only_evidence"].includes(conclusion)?"provisional_only":"evidence_review_required",
  evidence_summary:{structured_event_mentions:evidence.length,event_types:matrix.length,publisher_domain_count:domains.size,
   story_cluster_count:clusters.length,full_text_mentions:full,excerpt_mentions:excerpt,headline_only_mentions:headline,
   qualified_or_disputed_mentions:qualified,event_conflict_count:conflictCount,structured_claim_conflict_count:structured.length,
   headline_conflict_candidate_count:headlineConflicts.length,publisher_independence_verified:false},
  evidence_matrix:matrix.slice(0,12),supporting_evidence:supporting,counterevidence:counter,qualified_context:contextual,
  scenario_branches:[
   {scenario:"risk_pressure_increases",status:supporting.length?"conditional_context_only":"not_supported_by_current_evidence",
    evidence_events:supporting.map(x=>x.event_id),interpretation_fa:"این شاخه فقط فشار ریسک خبری را توصیف می‌کند و جهت قیمت را تعیین نمی‌کند."},
   {scenario:"risk_pressure_eases_or_offsets",status:counter.length?"counterevidence_present":"insufficient_counterevidence",
    evidence_events:counter.map(x=>x.event_id),interpretation_fa:"شواهد مخالف و متعادل‌کننده حفظ می‌شوند و حذف نمی‌شوند."},
   {scenario:"claims_remain_unconfirmed",status:qualified?"plausible_data_quality_scenario":"not_prominent",
    evidence_events:contextual.map(x=>x.event_id),interpretation_fa:"ادعاهای مشروط یا تکذیب‌شده واقعیت قطعی محسوب نمی‌شوند."}
  ],
  price_context_separate:{price_signal:priceSignal,interpretation:"price_history_signal_is_not_inferred_from_news"},
  data_gaps:gaps,next_verification_steps:["متن اصلی ادعا و تاریخ انتشار را بررسی کن.","بازنشرهای یک خبر را شاهد مستقل حساب نکن.",
   "برای ادعای مهم، منبع اولیه یا دو ناشر مستقل پیدا کن.","شواهد مخالف و تکذیب‌ها را کنار شواهد موافق نگه دار.",
   "واکنش قیمت را پس از تکمیل افق زمانی، جداگانه و بدون ادعای علیت ارزیابی کن."],
  guardrails:["این تحلیل احتمال عددی یا توصیهٔ مالی تولید نمی‌کند.","فشار ریسک خبری معادل جهت حرکت قیمت نیست.",
   "تعداد دامنه‌ها اثبات استقلال تحریریه‌ای ناشران نیست.","هم‌زمانی خبر و تغییر قیمت رابطهٔ علّی را ثابت نمی‌کند.",
   "ادعای نقل‌شده، مشروط یا تکذیب‌شده واقعیت تأییدشده محسوب نمی‌شود."]
 };
}
export function buildDecisionBrief({asset,quote,history,news,languageAnalysis,now=Date.now()}={}){
 const price=num(quote?.price),quoteStamp=dateMs(quote?.source_time);
 const quoteAge=quoteStamp===null?null:Math.max(0,(now-quoteStamp)/3600000);
 const h=historyMetrics(history,now);
 const n=newsMetrics(news,languageAnalysis?.per_news,now);
 const eventReactions=historicalEventReactions(languageAnalysis?.event_price_context);
 const conflicts=Array.isArray(languageAnalysis?.possible_conflicts)?languageAnalysis.possible_conflicts:[];
 const errorMemory=languageAnalysis?.verified_error_memory||{};
 const memoryMatches=Array.isArray(errorMemory.matches)?errorMemory.matches:[];
 const neuralPivot=languageAnalysis?.multilingual_news?.english_neural_pivot_analysis||{};
 const neuralLanguageGroups=Array.isArray(neuralPivot.cross_language_analyses)?neuralPivot.cross_language_analyses:[];
 const neuralSemanticLanguages=[...new Set(neuralLanguageGroups.map(x=>String(x.language||"und")))].slice(0,12);
 const neuralSemanticMatchCount=neuralLanguageGroups.reduce((n,x)=>n+(Array.isArray(x.matches)?x.matches.length:0),0);
 const neuralSemanticConcepts=[...new Set(neuralLanguageGroups.flatMap(x=>(Array.isArray(x.matches)?x.matches:[]).slice(0,3).map(m=>String(m.term||m.id||"")).filter(Boolean)))].slice(0,12);
  const deepAnalysis=buildDeepAnalysis({news,languageAnalysis,priceSignal:h.signal,now});
 const quoteFresh=quoteAge!==null&&quoteAge<=6;
 const historyFresh=h.last_observation_age_hours===null||h.last_observation_age_hours<=72;
 const quoteHistoryGap=h.last_price&&price>0?((price/h.last_price)-1)*100:null;
 const enoughHistory=h.observations>=30;
 const enoughNews=n.recent_72h_count>=3&&n.unique_story_clusters>=3&&n.unique_publisher_domains>=2;
 const sourceDiversity=n.unique_publisher_domains>=3&&n.unique_story_clusters>=5;
 const issues=[];
 if(memoryMatches.length)issues.push("نمونه‌های مشابه با اصلاحات انسانی تأییدشدهٔ قبلی پیدا شد؛ این فقط هشدار بازبینی است و تحلیل را خودکار تغییر نمی‌دهد.");
 if(!(price>0))issues.push("قیمت مرجع معتبر نیست.");
 if(quoteAge===null)issues.push("زمان قیمت مرجع در دسترس نیست.");
 else if(!quoteFresh)issues.push("قیمت مرجع بیش از ۶ ساعت قدمت دارد.");
 if(h.observations<12)issues.push("کمتر از ۱۲ مشاهدهٔ تاریخی موجود است.");
 else if(!enoughHistory)issues.push("تاریخچه برای سنجش پایدار روند هنوز به ۳۰ مشاهده نرسیده است.");
 if(!historyFresh)issues.push("آخرین مشاهدهٔ تاریخچه بیش از ۷۲ ساعت قدیمی است.");
 if(quoteHistoryGap!==null&&Math.abs(quoteHistoryGap)>5)issues.push("قیمت فعلی با آخرین نقطهٔ تاریخچه بیش از ۵٪ اختلاف دارد؛ احتمال تفاوت زمان یا منبع داده بررسی شود.");
 if(!enoughNews)issues.push("تعداد خبرهای تازه، داستان‌های مستقل یا ناشران کافی نیست.");
 if(n.likely_syndication_ratio>=0.35)issues.push("بخشی از تیترها احتمالاً بازنشر یک خبر واحد هستند.");
 if(n.excerpt_coverage_pct<30)issues.push("بیشتر داده‌های خبری تیترمحورند و متن چکیدهٔ کافی ندارند.");
 if(conflicts.length)issues.push("چارچوب برخی خبرها با یکدیگر ناسازگار به نظر می‌رسد؛ این هنوز تناقض قطعی نیست.");
 if(h.volatility_pct!==null&&h.volatility_pct>2)issues.push("نوسان تاریخی بالاست.");
 if(h.direction_consistency!==null&&h.direction_consistency<0.6)issues.push("حرکت‌های اخیر قیمت از ثبات جهت کافی برخوردار نیستند.");
 const sufficientForTrend=h.observations>=12&&historyFresh&&h.signal!=="unknown";
 const sufficientForNews=n.event_mentions>=2&&n.recent_72h_count>=2&&n.unique_story_clusters>=2;
 let action="monitor";
 if(!(price>0)||quoteAge===null||h.observations<12||!historyFresh)action="wait_for_reliable_data";
 else if(!quoteFresh||!enoughHistory||!enoughNews||conflicts.length||n.likely_syndication_ratio>=0.5)action="wait_for_confirmation";
 else if(h.signal==="sideways"||!sufficientForTrend)action="monitor_without_directional_claim";
 else action="monitor_trend_with_news_risk_context";
 let state="insufficient_evidence";
 if(sufficientForTrend&&sufficientForNews){
  if(n.risk_signal==="higher_risk_pressure")state="price_trend_with_higher_risk_news";
  else if(n.risk_signal==="lower_risk_pressure")state="price_trend_with_lower_risk_news";
  else state="price_trend_news_unclear";
 }else if(sufficientForTrend)state="price_trend_only";
 else if(sufficientForNews)state="news_risk_context_only";
 const explanation=[];
 if(h.signal==="up")explanation.push("روند چندبازه‌ای قیمت در داده‌های موجود متمایل به افزایش است.");
 if(h.signal==="down")explanation.push("روند چندبازه‌ای قیمت در داده‌های موجود متمایل به کاهش است.");
 if(h.signal==="sideways")explanation.push("روند قیمت سیگنال جهت‌دار باثباتی نشان نمی‌دهد.");
 if(n.risk_signal==="higher_risk_pressure")explanation.push("خبرهای طبقه‌بندی‌شده فشار ریسک بالاتری را نشان می‌دهند؛ این به‌تنهایی به معنی افزایش دلار یا طلا نیست.");
 if(n.risk_signal==="lower_risk_pressure")explanation.push("خبرهای طبقه‌بندی‌شده کاهش فشار ریسک را نشان می‌دهند؛ این به‌تنهایی به معنی افت دلار یا طلا نیست.");
 if(n.risk_signal==="mixed_or_unclear")explanation.push("خبرها پیام یکدست و قابل اتکایی ندارند.");
 if(n.risk_signal==="insufficient")explanation.push("برای جمع‌بندی خبری، رویدادهای طبقه‌بندی‌شده کافی نیستند.");
 if(!enoughNews)explanation.push("تأیید مستقل چندمنبعی کافی نیست.");
 if(memoryMatches.length)explanation.push("شبکهٔ معنایی نمونه‌های اصلاح‌شدهٔ مشابه را بازیابی کرده است؛ ادعای فعلی باید با آن‌ها مقایسه شود، نه اینکه خودکار جایگزین تحلیل شود.");
 const learningContext={neural_error_memory_status:errorMemory.status||"unavailable",verified_correction_matches:memoryMatches.length,top_similarity:memoryMatches.length?(Number(memoryMatches[0].similarity)||null):null,categories:[...new Set(memoryMatches.map(x=>String(x.category||"other")))].slice(0,5),neural_semantic_language_groups:neuralSemanticLanguages,neural_semantic_match_count:neuralSemanticMatchCount,neural_semantic_concepts:neuralSemanticConcepts,neural_semantic_fact_checked:false,automatic_override:false};
 const quality={quote_fresh:quoteFresh,history_sufficient:enoughHistory,history_fresh:historyFresh,
  news_sufficient:enoughNews,source_diversity_sufficient:sourceDiversity,syndication_risk:n.likely_syndication_ratio>=0.35,
  excerpt_coverage_pct:n.excerpt_coverage_pct,issues};
 return {
  engine:"deterministic_evidence_synthesis",version:DECISION_ENGINE_VERSION,asset,as_of:new Date(now).toISOString(),
  decision_label_fa:action==="wait_for_reliable_data"?"دادهٔ معتبر بیشتری لازم است":action==="wait_for_confirmation"?"فعلاً نیازمند تأیید بیشتر":action==="monitor_without_directional_claim"?"پایش؛ بدون جهت‌گیری": "پایش روند و ریسک خبرها",
  action,
  price_context:{reference_price:price,quote_history_gap_pct:quoteHistoryGap===null?null:Number(quoteHistoryGap.toFixed(2)),quote_age_hours:quoteAge===null?null:Number(quoteAge.toFixed(2)),history_observations:h.observations,
   last_observation_at:h.last_observation_at,last_observation_age_hours:h.last_observation_age_hours,
   return_7_observations_pct:h.return_7_observations_pct,return_14_observations_pct:h.return_14_observations_pct,
   return_30_observations_pct:h.return_30_observations_pct,volatility_pct:h.volatility_pct,
   drawdown_30_observations_pct:h.drawdown_30_observations_pct,direction_consistency:h.direction_consistency,
   trend_score_not_probability:h.trend_score_not_probability,price_signal:h.signal},
  news_context:n,
  historical_event_reactions:eventReactions,
  learning_context:learningContext,
   deep_analysis:deepAnalysis,
  synthesis:{state,explanation_fa:explanation.join(" ")||"شواهد کافی برای جمع‌بندی وجود ندارد.",
   important_distinction_fa:"جهت روند قیمت، فشار ریسک خبرها و پیش‌بینی آینده سه مفهوم جدا هستند؛ این موتور آن‌ها را یکی فرض نمی‌کند."},
  evidence_quality:quality,reasons_fa:explanation,
  limitations_fa:["وزن‌ها و آستانه‌ها قواعد شفاف‌اند و هنوز با آزمون تاریخی کالیبره نشده‌اند.",
   "فشار ریسک خبری معادل جهت حرکت قیمت دارایی نیست.",
   "تعداد دامنه‌ها استقلال تحریریه‌ای ناشران را ثابت نمی‌کند.",
   "خبرهای تیترمحور ممکن است زمینه، تکذیب یا شرط مهم را حذف کرده باشند.",
   "واکنش‌های تاریخی به رویدادها فقط همراهی زمانی هستند و به‌دلیل تغییر شرایط، اثر آینده را تضمین نمی‌کنند.",
   "این خروجی اطلاعاتی است و توصیهٔ خرید، فروش یا نگهداری دارایی نیست."]
 };
}
export function runDecisionEngineSelfTest(){
 const now=Date.parse("2026-11-14T12:00:00Z");
 const rows=Array.from({length:40},(_,i)=>({date:now-(39-i)*86400000,close:100+i*0.5}));
 const common={asset:"USD_IRR_FREE",quote:{price:120,source_time:new Date(now).toISOString()},
  history:{rows},news:[],languageAnalysis:{per_news:[],possible_conflicts:[]},now};
 const tests=[
  {name:"empty_news_does_not_create_news_signal",input:common,check:x=>x.news_context.risk_signal==="insufficient"&&x.synthesis.state==="price_trend_only"},
  {name:"verified_neural_error_memory_is_review_only",input:{...common,languageAnalysis:{per_news:[],possible_conflicts:[],verified_error_memory:{status:"verified_error_memory_matches_found",matches:[{category:"wrong_action",similarity:0.91,verified_correction:{action:"increase"}}]}}},check:x=>x.learning_context.verified_correction_matches===1&&x.learning_context.automatic_override===false&&x.evidence_quality.issues.some(v=>v.includes("اصلاحات انسانی"))},
  {name:"headline_only_has_lower_weight_than_excerpt",input:{...common,news:[{title:"New sanctions announced",domain:"one.example",published_at:new Date(now).toISOString()}],languageAnalysis:{per_news:[{title:"New sanctions announced",source:"one.example",published_at:new Date(now).toISOString(),input_mode:"headline_only",events:[{id:"sanction_new",market_effect:"risk_up"}],confidence:0.7}],possible_conflicts:[]}},check:x=>x.news_context.event_evidence[0]?.content_type==="headline_only"&&x.news_context.event_evidence[0]?.weight<0.7},
  {name:"structured_reading_discounts_incomplete_or_uncertain_claims",input:{...common,news:[{title:"Rates may rise",domain:"a.example",published_at:new Date(now).toISOString()}],languageAnalysis:{per_news:[{title:"Rates may rise",source:"a.example",published_at:new Date(now).toISOString(),input_mode:"headline_plus_rss_excerpt",content_chars:240,events:[{id:"rate_hike",market_effect:"risk_up"}],confidence:0.8,reading_analysis:{claim_count:2,complete_claim_count:0,conditional_count:1,negated_count:0}}],possible_conflicts:[]}},check:x=>x.news_context.event_evidence[0]?.reading_factor<0.8},
  {name:"structured_reading_discounts_incomplete_or_uncertain_claims",input:{...common,news:[{title:"Rates may rise",domain:"a.example",published_at:new Date(now).toISOString()}],languageAnalysis:{per_news:[{title:"Rates may rise",source:"a.example",published_at:new Date(now).toISOString(),input_mode:"headline_plus_rss_excerpt",content_chars:240,events:[{id:"rate_hike",market_effect:"risk_up"}],confidence:0.8,reading_analysis:{claim_count:2,complete_claim_count:0,conditional_count:1,negated_count:0}}],possible_conflicts:[]}},check:x=>x.news_context.event_evidence[0]?.reading_factor<0.8},
  {name:"conditional_claim_is_discounted",input:{...common,news:[{title:"Sanctions may be imposed",domain:"one.example",published_at:new Date(now).toISOString()}],languageAnalysis:{per_news:[{title:"Sanctions may be imposed",source:"one.example",published_at:new Date(now).toISOString(),input_mode:"headline_only",uncertain:true,english_semantics:{assertion:"forecast_or_possibility"},events:[{id:"sanction_new",market_effect:"risk_up"}],confidence:0.6}],possible_conflicts:[]}},check:x=>x.news_context.event_evidence[0]?.weight<0.3},
  {name:"duplicate_headlines_do_not_count_as_independent_stories",input:{...common,news:[{title:"Central bank announces new rate policy",domain:"a.example",published_at:new Date(now).toISOString()},{title:"Central bank announces new rate policy",domain:"b.example",published_at:new Date(now).toISOString()}]},check:x=>x.news_context.unique_story_clusters===1&&x.news_context.likely_syndication_ratio===0.5},
  {name:"risk_pressure_is_not_price_direction",input:{...common,news:[{title:"Conflict escalates",domain:"a.example",published_at:new Date(now).toISOString()},{title:"Military strike reported",domain:"b.example",published_at:new Date(now).toISOString()}],languageAnalysis:{per_news:[{title:"Conflict escalates",source:"a.example",published_at:new Date(now).toISOString(),input_mode:"headline_plus_rss_excerpt",content_chars:200,events:[{id:"conflict",market_effect:"risk_up"}],confidence:0.8},{title:"Military strike reported",source:"b.example",published_at:new Date(now).toISOString(),input_mode:"headline_plus_rss_excerpt",content_chars:200,events:[{id:"conflict",market_effect:"risk_up"}],confidence:0.8}],possible_conflicts:[]}},check:x=>x.news_context.risk_signal==="higher_risk_pressure"&&!String(x.synthesis.state).includes("upward")},
  {name:"stale_quote_requires_confirmation",input:{...common,quote:{price:120,source_time:new Date(now-9*3600000).toISOString()}},check:x=>x.action==="wait_for_confirmation"},
  {name:"short_history_does_not_claim_trend",input:{...common,history:{rows:rows.slice(-8)}},check:x=>x.action==="wait_for_reliable_data"||x.action==="wait_for_confirmation"||x.action==="monitor_without_directional_claim"},
  {name:"historical_event_reaction_requires_three_observations",input:{...common,languageAnalysis:{per_news:[],possible_conflicts:[],event_price_context:{observations:[1,2].map((v)=>({event_ids:["conflict"],subsequent_price_observations:{1:{change_pct:v}}}))}}},check:x=>x.historical_event_reactions[0]?.horizons[1]?.median_change_pct===null},
  {name:"contradictory_candidate_is_reported_as_quality_issue",input:{...common,languageAnalysis:{per_news:[],possible_conflicts:[{type:"opposing_event_frames"}]}},check:x=>x.evidence_quality.issues.some(v=>v.includes("ناسازگار"))}
 ];
 const deepBase={asset:"USD_IRR_FREE",quote:{price:120,source_time:new Date(now).toISOString()},history:{rows},
   news:[],languageAnalysis:{per_news:[],possible_conflicts:[],structured_claim_conflicts:[]},now};
  tests.push(
   {name:"deep_analysis_abstains_without_structured_news",input:deepBase,check:x=>x.deep_analysis.conclusion_state==="insufficient_structured_evidence"&&x.deep_analysis.review_state==="abstain"},
   {name:"one_domain_never_claims_multi_source_confirmation",input:{...deepBase,news:[{title:"Sanctions announced",domain:"one.example"}],languageAnalysis:{per_news:[{title:"Sanctions announced",source:"one.example",input_mode:"headline_only",events:[{id:"sanction_new",market_effect:"risk_up"}]}]}},check:x=>x.deep_analysis.conclusion_state==="single_domain_evidence"&&!x.deep_analysis.evidence_summary.publisher_independence_verified},
   {name:"opposing_event_frames_are_preserved_as_conflict",input:{...deepBase,news:[{title:"Sanctions announced",domain:"one.example"},{title:"Sanctions relief announced",domain:"two.example"}],languageAnalysis:{per_news:[{title:"Sanctions announced",source:"one.example",input_mode:"full_article",events:[{id:"sanction_new",market_effect:"risk_up"}]},{title:"Sanctions relief announced",source:"two.example",input_mode:"full_article",events:[{id:"sanction_new",market_effect:"risk_down"}]}]}},check:x=>x.deep_analysis.conclusion_state==="conflicting_evidence"&&x.deep_analysis.evidence_matrix[0].conflict_detected},
   {name:"conditional_and_denied_claims_are_not_verified_facts",input:{...deepBase,news:[{title:"Sanctions may be imposed",domain:"one.example"},{title:"Officials denied sanctions",domain:"two.example"}],languageAnalysis:{per_news:[{title:"Sanctions may be imposed",source:"one.example",input_mode:"headline_plus_rss_excerpt",uncertain:true,simple_analysis_fa:{claim_status:"conditional",conditional:true},events:[{id:"sanction_new",market_effect:"risk_up"}]},{title:"Officials denied sanctions",source:"two.example",input_mode:"full_article",simple_analysis_fa:{claim_status:"denied_or_disputed",denied_or_disputed:true},events:[{id:"sanction_new",market_effect:"risk_down"}]}]}},check:x=>x.deep_analysis.evidence_summary.qualified_or_disputed_mentions===2&&x.deep_analysis.conclusion_state==="conflicting_evidence"},
   {name:"headline_only_is_separated_from_full_text",input:{...deepBase,news:[{title:"Oil supply report",domain:"one.example"}],languageAnalysis:{per_news:[{title:"Oil supply report",source:"one.example",input_mode:"headline_only",events:[{id:"oil_supply",market_effect:"mixed"}]}]}},check:x=>x.deep_analysis.evidence_matrix[0].headline_only_count===1&&x.deep_analysis.evidence_matrix[0].full_text_count===0},
   {name:"news_pressure_never_becomes_price_direction",input:{...deepBase,news:[{title:"Conflict escalates",domain:"one.example"},{title:"Conflict escalates elsewhere",domain:"two.example"}],languageAnalysis:{per_news:[{title:"Conflict escalates",source:"one.example",input_mode:"full_article",events:[{id:"conflict",market_effect:"risk_up"}]},{title:"Conflict escalates elsewhere",source:"two.example",input_mode:"full_article",events:[{id:"conflict",market_effect:"risk_up"}]}]}},check:x=>x.deep_analysis.scenario_branches[0].interpretation_fa.includes("جهت قیمت")&&x.deep_analysis.price_context_separate.price_signal==="up"},
   {name:"deep_analysis_does_not_publish_probability_fields",input:deepBase,check:x=>!Object.keys(x.deep_analysis).some(k=>/probability|confidence_pct/i.test(k))}
  );
  const results=tests.map(t=>{try{const out=buildDecisionBrief(t.input);return {name:t.name,passed:!!t.check(out)};}catch(e){return {name:t.name,passed:false,error:String(e?.message||e)};}});
 return {version:DECISION_ENGINE_VERSION,total:results.length,passed:results.filter(x=>x.passed).length,failed:results.filter(x=>!x.passed)};
}
