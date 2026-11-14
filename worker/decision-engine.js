// Dollar Market Decision Engine v0.1
// Transparent, deterministic evidence synthesis. Not a trading or investment recommendation.
const clamp=(x,lo,hi)=>Math.max(lo,Math.min(hi,x));
const num=x=>Number.isFinite(Number(x))?Number(x):null;
const EVENT_PRESSURE={
 sanction_new:{fa:"تشدید تحریم",usd:1.5,gold:0.25},
 sanction_relief:{fa:"کاهش تحریم",usd:-1.35,gold:-0.2},
 conflict:{fa:"تشدید تنش",usd:1.1,gold:0.9},
 ceasefire:{fa:"کاهش تنش",usd:-0.65,gold:-0.55},
 oil_supply:{fa:"اختلال عرضه نفت",usd:0.45,gold:0.15},
 currency_devaluation:{fa:"تضعیف پول ملی",usd:1.4,gold:0.35},
 inflation_up:{fa:"افزایش تورم",usd:0.3,gold:0.15},
 inflation_down:{fa:"کاهش تورم",usd:-0.2,gold:-0.1},
 gold_demand:{fa:"تغییر تقاضای طلا",usd:0,gold:0.8},
 currency_intervention:{fa:"مداخله ارزی",usd:0,gold:0},
 rate_hike:{fa:"افزایش نرخ بهره",usd:0,gold:0},
 rate_cut:{fa:"کاهش نرخ بهره",usd:0,gold:0},
 talks:{fa:"مذاکرات",usd:0,gold:0},
 oil_supply_increase:{fa:"افزایش عرضه نفت",usd:0,gold:0}
};
const ASSET_SCALE={USD_IRR_FREE:{usd:1,gold:0},EUR_IRR_FREE:{usd:0.65,gold:0},GOLD_18K_IRR:{usd:0.2,gold:1},COIN_EMAMI_IRR:{usd:0.55,gold:0.8}};
function sourceKey(item){return String(item?.source||item?.domain||item?.source_id||"unknown").toLowerCase().replace(/^www\./,"").trim();}
function eventWeight(item,now){
 const published=Date.parse(item?.published_at||"");
 const age=Number.isFinite(published)?Math.max(0,(now-published)/3600000):72;
 const freshness=Math.exp(-age/48);
 const excerpt=Number(item?.content_chars||0)>80?1:0.72;
 const uncertain=item?.uncertain?0.48:1;
 const confidence=clamp(Number(item?.confidence)||0.35,0.2,0.85);
 return freshness*excerpt*uncertain*(0.65+confidence*0.4);
}
function signLabel(score,positive,negative,neutral){
 if(score>=1.2)return positive;
 if(score<=-1.2)return negative;
 return neutral;
}
export function buildDecisionBrief({asset,quote,history,news,languageAnalysis,now=Date.now()}={}){
 const profile=ASSET_SCALE[asset]||ASSET_SCALE.USD_IRR_FREE;
 const price=num(quote?.price),stamp=Date.parse(quote?.source_time||"");
 const quoteAgeHours=Number.isFinite(stamp)?Math.max(0,(now-stamp)/3600000):null;
 const observations=Number(history?.observations)||0;
 const momentum7=num(history?.momentum_7d_pct),momentum14=num(history?.momentum_14d_pct),momentum30=num(history?.momentum_30d_pct);
 const dailyTrend=num(history?.daily_trend_pct),volatility=num(history?.daily_volatility_pct);
 const trendParts=[];
 if(momentum7!==null)trendParts.push({name:"۷ مشاهده",value:momentum7,weight:0.45});
 if(momentum14!==null)trendParts.push({name:"۱۴ مشاهده",value:momentum14,weight:0.25});
 if(momentum30!==null)trendParts.push({name:"۳۰ مشاهده",value:momentum30,weight:0.2});
 if(dailyTrend!==null)trendParts.push({name:"روند روزانه",value:dailyTrend*7,weight:0.1});
 const trendScore=trendParts.length?trendParts.reduce((s,x)=>s+clamp(x.value*4,-20,20)*x.weight,0):null;
 const priceSignal=trendScore===null?"unknown":trendScore>=5?"up":trendScore<=-5?"down":"sideways";
 const analyses=Array.isArray(languageAnalysis?.per_news)?languageAnalysis.per_news:[];
 const rawNews=Array.isArray(news)?news:[];
 const domains=new Set(rawNews.map(sourceKey).filter(x=>x&&x!=="unknown"));
 const upEvidence=[],downEvidence=[],neutralEvidence=[];
 const seen=new Set();
 for(const item of analyses){
  const domain=sourceKey(item);
  const weight=eventWeight(item,now);
  for(const event of Array.isArray(item.events)?item.events:[]){
   const def=EVENT_PRESSURE[event.id];
   if(!def)continue;
   const key=[domain,event.id,String(item.title||"").toLowerCase().slice(0,90)].join("|");
   if(seen.has(key))continue;
   seen.add(key);
   const raw=(def.usd*profile.usd+def.gold*profile.gold)*weight;
   const entry={event_id:event.id,label_fa:def.fa,title:item.title||"",source:domain,weight:Number(weight.toFixed(3)),pressure:Number(raw.toFixed(3)),published_at:item.published_at||null,uncertain:item.uncertain===true,input_mode:item.input_mode||"headline_only"};
   if(raw>=0.12)upEvidence.push(entry);
   else if(raw<=-0.12)downEvidence.push(entry);
   else neutralEvidence.push(entry);
  }
 }
 const upScore=upEvidence.reduce((s,x)=>s+x.pressure,0);
 const downScore=downEvidence.reduce((s,x)=>s+Math.abs(x.pressure),0);
 const newsBalance=clamp(upScore-downScore,-10,10);
 const newsSignal=newsBalance>=1.2?"up":newsBalance<=-1.2?"down":"mixed_or_neutral";
 const newsConflict=upScore>=0.7&&downScore>=0.7;
 let synthesis="insufficient_evidence";
 if(priceSignal!=="unknown"&&newsSignal==="up"&&priceSignal==="up")synthesis="aligned_upward_pressure";
 else if(priceSignal!=="unknown"&&newsSignal==="down"&&priceSignal==="down")synthesis="aligned_downward_pressure";
 else if(priceSignal!=="unknown"&&newsSignal!=="mixed_or_neutral"&&priceSignal!=="sideways"&&newsSignal!==(priceSignal))synthesis="signals_disagree";
 else if(priceSignal!=="unknown"&&newsSignal==="mixed_or_neutral")synthesis="price_trend_only";
 else if(priceSignal==="sideways"&&newsSignal!=="mixed_or_neutral")synthesis="news_watch_only";
 else if(priceSignal==="sideways"&&newsSignal==="mixed_or_neutral")synthesis="no_clear_direction";
 const enoughHistory=observations>=30;
 const enoughNews=rawNews.length>=3&&domains.size>=2;
 const quoteFresh=quoteAgeHours!==null&&quoteAgeHours<=6;
 const conflicts=Number(languageAnalysis?.possible_conflicts?.length)||0;
 const excerptCount=analyses.filter(x=>x.input_mode==="headline_plus_rss_excerpt").length;
 const excerptPct=analyses.length?Math.round(excerptCount/analyses.length*100):0;
 const qualityIssues=[];
 if(!price||quoteAgeHours===null)qualityIssues.push("قیمت مرجع یا زمان ثبت آن معتبر نیست.");
 else if(quoteAgeHours>6)qualityIssues.push("قیمت مرجع بیش از ۶ ساعت قدمت دارد.");
 if(!enoughHistory)qualityIssues.push("برای ارزیابی روند، کمتر از ۳۰ مشاهدهٔ تاریخی موجود است.");
 if(!enoughNews)qualityIssues.push("تعداد خبرها یا تنوع دامنه‌های ناشر برای تأیید چندمنبعی کافی نیست.");
 if(conflicts)qualityIssues.push("چند مورد ناسازگاری احتمالی تیترها نیازمند بررسی انسانی است.");
 if(excerptPct<30)qualityIssues.push("بخش زیادی از خبرها فقط تیتر هستند، نه متن یا چکیدهٔ مقاله.");
 if(volatility!==null&&volatility>2)qualityIssues.push("نوسان تاریخی بالاست و تفسیر روند را نامطمئن‌تر می‌کند.");
 const evidenceScore=Math.round(clamp(35+(enoughHistory?20:0)+(enoughNews?15:0)+(quoteFresh?10:0)+(excerptPct>=50?10:0)-(conflicts?Math.min(15,conflicts*3):0)-(volatility!==null&&volatility>2?10:0),0,85));
 const confidence=evidenceScore>=65?"moderate":"low";
 let action="monitor";
 if(!price||!Number.isFinite(quoteAgeHours)||!enoughHistory)action="wait_for_reliable_data";
 else if(newsConflict||synthesis==="signals_disagree"||!quoteFresh||!enoughNews)action="wait_for_confirmation";
 else if(synthesis==="no_clear_direction"||synthesis==="price_trend_only"||synthesis==="news_watch_only")action="monitor_without_directional_claim";
 const reasons=[];
 if(priceSignal==="up")reasons.push("روند تاریخی قیمت در بازه‌های موجود متمایل به افزایش است.");
 if(priceSignal==="down")reasons.push("روند تاریخی قیمت در بازه‌های موجود متمایل به کاهش است.");
 if(priceSignal==="sideways")reasons.push("روند تاریخی قیمت سیگنال جهت‌دار روشنی ندارد.");
 if(upEvidence.length)reasons.push("خبرهایی با فشار سناریویی افزایشی شناسایی شده‌اند؛ این برچسب اثر قطعی خبر نیست.");
 if(downEvidence.length)reasons.push("خبرهایی با فشار سناریویی کاهشی شناسایی شده‌اند؛ این برچسب اثر قطعی خبر نیست.");
 if(newsConflict)reasons.push("شواهد خبری در دو جهت متفاوت قرار دارند.");
 if(!analyses.length)reasons.push("تحلیل زبانی قابل‌استفاده‌ای از خبرها در دسترس نیست.");
 return {
  engine:"deterministic_evidence_synthesis",version:"0.1.0",
  decision_label_fa:action==="wait_for_reliable_data"?"دادهٔ معتبر بیشتری لازم است":action==="wait_for_confirmation"?"فعلاً نیازمند تأیید بیشتر":"پایش؛ بدون توصیهٔ معاملاتی",
  action,asset,as_of:new Date(now).toISOString(),
  price_context:{reference_price:price,quote_age_hours:quoteAgeHours===null?null:Number(quoteAgeHours.toFixed(2)),quote_fresh_under_6h:quoteFresh,history_observations:observations,momentum_7d_pct:momentum7,momentum_14d_pct:momentum14,momentum_30d_pct:momentum30,daily_volatility_pct:volatility,price_signal:priceSignal,trend_score_not_probability:trendScore===null?null:Number(trendScore.toFixed(2))},
  news_context:{headline_count:rawNews.length,classified_news_count:analyses.length,unique_publisher_domains:domains.size,excerpt_coverage_pct:excerptPct,possible_conflict_count:conflicts,upward_pressure_items:upEvidence.length,downward_pressure_items:downEvidence.length,news_signal:newsSignal,news_balance_not_probability:Number(newsBalance.toFixed(2)),upward_evidence:upEvidence.slice(0,6),downward_evidence:downEvidence.slice(0,6),neutral_or_mixed_evidence:neutralEvidence.slice(0,4)},
  synthesis:{state:synthesis,price_and_news_agree:synthesis==="aligned_upward_pressure"||synthesis==="aligned_downward_pressure",conflicting_news:newsConflict,explanation_fa:reasons.join(" ")||"شواهد کافی برای جمع‌بندی وجود ندارد."},
  evidence_quality:{score_not_probability:evidenceScore,confidence_label:confidence,issues:qualityIssues,source_independence_verified:false,full_article_text_available:excerptPct>0},
  reasons_fa:reasons,
  limitations_fa:["این موتور الگوریتمی و قاعده‌محور است، نه مدل زبانی مولد.","امتیازها احتمال آماری نیستند و با داده‌های واقعی کالیبره نشده‌اند.","جهت فشار خبری، اثر علّی خبر بر قیمت را ثابت نمی‌کند.","تعداد دامنه‌های ناشر لزوماً به معنی استقلال تحریریه‌ای منابع نیست.","این خروجی آموزشی و اطلاعاتی است؛ توصیهٔ خرید، فروش یا نگهداری دارایی نیست."]
 };
}
