// Dollar Market Decision Engine v0.2
// Evidence synthesis with explicit abstention. No fabricated probability or trading signal.
export const DECISION_ENGINE_VERSION = "0.2.0";

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
  const lexicalMatchScore=clamp(num(a.confidence)??0.35,0.2,0.92);
  const weight=fresh*textFactor*uncertaintyFactor*assertionFactor*(0.55+0.45*lexicalMatchScore);
  const domain=hostOf(a.source);
  for(const event of events){
   const id=event.id;
   if(!EVENT_LABELS[id])continue;
   const risk=event.market_effect==="risk_up"?"up":event.market_effect==="risk_down"?"down":"mixed";
   evidence.push({event_id:id,label_fa:EVENT_LABELS[id],risk_direction:risk,title:a.title||"",source:domain,
    published_at:a.published_at||null,age_hours:ageHours===null?null:Number(ageHours.toFixed(1)),
    content_type:textFactor===1?"rss_excerpt":"headline_only",assertion,uncertain:!!a.uncertain,
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
  event_evidence:evidence.sort((a,b)=>b.weight-a.weight).slice(0,12),
  note_fa:"فشار ریسک خبری با جهت قیمت دارایی یکسان نیست. خبرهای شرطی، احتمالی، تکذیب‌شده یا صرفاً تیتر وزن کمتری می‌گیرند؛ وزن‌ها احتمال آماری نیستند."};
}
export function buildDecisionBrief({asset,quote,history,news,languageAnalysis,now=Date.now()}={}){
 const price=num(quote?.price),quoteStamp=dateMs(quote?.source_time);
 const quoteAge=quoteStamp===null?null:Math.max(0,(now-quoteStamp)/3600000);
 const h=historyMetrics(history,now);
 const n=newsMetrics(news,languageAnalysis?.per_news,now);
 const eventReactions=historicalEventReactions(languageAnalysis?.event_price_context);
 const conflicts=Array.isArray(languageAnalysis?.possible_conflicts)?languageAnalysis.possible_conflicts:[];
 const quoteFresh=quoteAge!==null&&quoteAge<=6;
 const historyFresh=h.last_observation_age_hours===null||h.last_observation_age_hours<=72;
 const quoteHistoryGap=h.last_price&&price>0?((price/h.last_price)-1)*100:null;
 const enoughHistory=h.observations>=30;
 const enoughNews=n.recent_72h_count>=3&&n.unique_story_clusters>=3&&n.unique_publisher_domains>=2;
 const sourceDiversity=n.unique_publisher_domains>=3&&n.unique_story_clusters>=5;
 const issues=[];
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
  synthesis:{state,explanation_fa:explanation.join(" ")||"شواهد کافی برای جمع‌بندی وجود ندارد.",
   important_distinction_fa:"جهت روند قیمت، فشار ریسک خبرها و پیش‌بینی آینده سه مفهوم جدا هستند؛ این موتور آن‌ها را یکی فرض نمی‌کند."},
  evidence_quality:quality,reasons_fa:explanation,
  limitations_fa:["وزن‌ها و آستانه‌ها قواعد شفاف‌اند و هنوز با آزمون تاریخی کالیبره نشده‌اند.",
   "فشار ریسک خبری معادل جهت حرکت قیمت دارایی نیست.",
   "تعداد دامنه‌ها استقلال تحریریه‌ای ناشران را ثابت نمی‌کند.",
   "خبرهای تیترمحور ممکن است زمینه، تکذیب یا شرط مهم را حذف کرده باشند.",\n   "واکنش‌های تاریخی به رویدادها فقط همراهی زمانی هستند و به‌دلیل تغییر شرایط، اثر آینده را تضمین نمی‌کنند.",
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
  {name:"headline_only_has_lower_weight_than_excerpt",input:{...common,news:[{title:"New sanctions announced",domain:"one.example",published_at:new Date(now).toISOString()}],languageAnalysis:{per_news:[{title:"New sanctions announced",source:"one.example",published_at:new Date(now).toISOString(),input_mode:"headline_only",events:[{id:"sanction_new",market_effect:"risk_up"}],confidence:0.7}],possible_conflicts:[]}},check:x=>x.news_context.event_evidence[0]?.content_type==="headline_only"&&x.news_context.event_evidence[0]?.weight<0.7},
  {name:"conditional_claim_is_discounted",input:{...common,news:[{title:"Sanctions may be imposed",domain:"one.example",published_at:new Date(now).toISOString()}],languageAnalysis:{per_news:[{title:"Sanctions may be imposed",source:"one.example",published_at:new Date(now).toISOString(),input_mode:"headline_only",uncertain:true,english_semantics:{assertion:"forecast_or_possibility"},events:[{id:"sanction_new",market_effect:"risk_up"}],confidence:0.6}],possible_conflicts:[]}},check:x=>x.news_context.event_evidence[0]?.weight<0.3},
  {name:"duplicate_headlines_do_not_count_as_independent_stories",input:{...common,news:[{title:"Central bank announces new rate policy",domain:"a.example",published_at:new Date(now).toISOString()},{title:"Central bank announces new rate policy",domain:"b.example",published_at:new Date(now).toISOString()}]},check:x=>x.news_context.unique_story_clusters===1&&x.news_context.likely_syndication_ratio===0.5},
  {name:"risk_pressure_is_not_price_direction",input:{...common,news:[{title:"Conflict escalates",domain:"a.example",published_at:new Date(now).toISOString()},{title:"Military strike reported",domain:"b.example",published_at:new Date(now).toISOString()}],languageAnalysis:{per_news:[{title:"Conflict escalates",source:"a.example",published_at:new Date(now).toISOString(),input_mode:"headline_plus_rss_excerpt",content_chars:200,events:[{id:"conflict",market_effect:"risk_up"}],confidence:0.8},{title:"Military strike reported",source:"b.example",published_at:new Date(now).toISOString(),input_mode:"headline_plus_rss_excerpt",content_chars:200,events:[{id:"conflict",market_effect:"risk_up"}],confidence:0.8}],possible_conflicts:[]}},check:x=>x.news_context.risk_signal==="higher_risk_pressure"&&!String(x.synthesis.state).includes("upward")},
  {name:"stale_quote_requires_confirmation",input:{...common,quote:{price:120,source_time:new Date(now-9*3600000).toISOString()}},check:x=>x.action==="wait_for_confirmation"},
  {name:"short_history_does_not_claim_trend",input:{...common,history:{rows:rows.slice(-8)}},check:x=>x.action==="wait_for_confirmation"||x.action==="monitor_without_directional_claim"},
  {name:"contradictory_candidate_is_reported_as_quality_issue",input:{...common,languageAnalysis:{per_news:[],possible_conflicts:[{type:"opposing_event_frames"}]}},check:x=>x.evidence_quality.issues.some(v=>v.includes("ناسازگار"))}
 ];
 const results=tests.map(t=>{try{const out=buildDecisionBrief(t.input);return {name:t.name,passed:!!t.check(out)};}catch(e){return {name:t.name,passed:false,error:String(e?.message||e)};}});
 return {version:DECISION_ENGINE_VERSION,total:results.length,passed:results.filter(x=>x.passed).length,failed:results.filter(x=>!x.passed)};
}
