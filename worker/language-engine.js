// Dollar Market Language Engine v0.1
// Lightweight, deterministic Persian/English domain NLP. It does not claim to be a generative LLM.
const VERSION = "dollar-domain-nlp-0.4.0";

const DIGITS = Object.freeze({"۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9","٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9"});
const CHAR_MAP = Object.freeze({"ي":"ی","ك":"ک","ۀ":"ه","ة":"ه","ؤ":"و","إ":"ا","أ":"ا","آ":"ا"});
const STOP = new Set(["از","به","با","در","را","و","یا","برای","این","آن","یک","the","a","an","and","or","of","to","in","on","for","as","is","are","was","were","by","that","this","it","its","he","she","they","their","has","have","had","will","would"]);
const ENGLISH_ACTORS = [
  {id:"us_fed",terms:["federal reserve","fed","fomc","jerome powell"]},
  {id:"ecb",terms:["european central bank","ecb","christine lagarde"]},
  {id:"iran",terms:["iran","iranian"]},{id:"us",terms:["united states","u.s.","us administration","white house","washington"]},
  {id:"israel",terms:["israel","israeli"]},{id:"opec",terms:["opec","opec+"]},
  {id:"china",terms:["china","chinese","beijing"]},{id:"russia",terms:["russia","russian","moscow"]}
];
const ENGLISH_MODAL = ["may","might","could","would","should","expected to","likely to","unlikely to","projected to","forecast to","plans to","intends to","considering","proposed","potentially"];
const ENGLISH_REPORTED = ["according to","officials said","sources said","reportedly","the ministry said","the central bank said","the government said","state media reported","reuters reported","bloomberg reported"];
const ENGLISH_CONDITIONAL = ["if ","unless ","in the event of","if approved","if confirmed","should talks"];
const ENGLISH_TIME = [
  {id:"past",terms:["yesterday","last week","last month","previously","earlier","has announced","announced","was imposed","were imposed","took effect","began"]},
  {id:"present",terms:["today","currently","now","is imposing","are imposing","is rising","are rising","remains"]},
  {id:"future",terms:["tomorrow","next week","next month","will impose","will raise","will cut","is set to","scheduled to","due to","expected to"]}
];


const ENGLISH_SYNONYMS = [
  {canonical:"rise",terms:["rise","rises","rose","risen","surge","surges","surged","soar","soars","soared","climb","climbs","climbed","jump","jumps","jumped","increase","increases","increased","gain","gains","gained","edge higher","move higher","advance","advanced"]},
  {canonical:"fall",terms:["fall","falls","fell","fallen","drop","drops","dropped","decline","declines","declined","slump","slumps","slumped","plunge","plunges","plunged","slide","slides","slid","sink","sinks","sank","retreat","retreated","ease","eased","move lower","edge lower"]},
  {canonical:"hold",terms:["hold","holds","held","keep unchanged","keeps unchanged","leave unchanged","left unchanged","stand pat","maintain","maintains","maintained"]},
  {canonical:"tighten",terms:["tighten","tightens","tightened","tightening","raise rates","raises rates","raised rates","rate hike","monetary tightening"]},
  {canonical:"ease_policy",terms:["ease policy","eases policy","eased policy","loosen policy","loosens policy","rate cut","cuts rates","cut rates","monetary easing"]},
  {canonical:"sanctions_relief",terms:["lift sanctions","lifts sanctions","lifted sanctions","ease sanctions","eases sanctions","sanctions relief","waive sanctions","waives sanctions"]},
  {canonical:"sanctions_tightening",terms:["impose sanctions","imposes sanctions","imposed sanctions","tighten sanctions","tightens sanctions","new sanctions","sanctions package"]},
  {canonical:"talks_progress",terms:["resume talks","resumes talks","talks resume","restart negotiations","restarts negotiations","reach an agreement","deal reached","make progress in talks"]},
  {canonical:"talks_breakdown",terms:["walk away from talks","walks away from talks","talks collapse","negotiations collapse","break off talks","breaks off talks","negotiations stall"]}
];
const ENGLISH_ENTITIES = [
  {id:"usd",terms:["u.s. dollar","us dollar","dollar index","dxy","greenback"]},
  {id:"gold",terms:["gold","bullion","xau","safe-haven metal"]},
  {id:"crude_oil",terms:["crude oil","brent","wti","oil futures"]},
  {id:"treasuries",terms:["treasury yield","treasuries","government bond yield","10-year yield","two-year yield"]},
  {id:"crypto",terms:["bitcoin","btc","cryptocurrency","crypto market"]}
];
const ENGLISH_RELATIONS = [
  {id:"because",terms:["because","due to","owing to","as a result of","amid","following"]},
  {id:"contrast",terms:["however","although","though","whereas","while","nevertheless","despite"]},
  {id:"addition",terms:["also","moreover","furthermore","in addition"]},
  {id:"sequence",terms:["after","before","then","subsequently","meanwhile","earlier"]}
];
const ENGLISH_NEGATIVE_PATTERNS = ["not expected to","not likely to","no plans to","did not","does not","do not","has not","have not","had not","was not","were not","will not","won't","cannot","can't","denies","denied","ruled out","failed to","unlikely to"];
const ENGLISH_NEGATIVE_CONTRACTIONS = ["won't","can't","isn't","aren't","wasn't","weren't","doesn't","don't","didn't","hasn't","haven't","hadn't"];
const ENGLISH_UNITS = [
  {id:"percent",terms:["percent","per cent","%"]},{id:"basis_points",terms:["basis points","bps"]},
  {id:"usd",terms:["us dollars","u.s. dollars","dollars","usd"]},{id:"eur",terms:["euros","eur"]},
  {id:"barrel",terms:["barrels","barrel"]},{id:"ounce",terms:["troy ounces","ounces","ounce","oz"]},
  {id:"tonne",terms:["metric tons","tonnes","tons"]},{id:"million",terms:["million","mn"]},{id:"billion",terms:["billion","bn"]}
];

const THEMES = [
  {id:"fx_policy",label_fa:"ارز و سیاست پولی",terms:["دلار","ارز","ریال","تومان","بانک مرکزی","نرخ بهره","بازار ارز","currency","exchange rate","central bank","interest rate","rial"]},
  {id:"gold",label_fa:"طلا و فلزات گران‌بها",terms:["طلا","سکه","اونس","شمش","gold","bullion","precious metal","xau"]},
  {id:"inflation",label_fa:"تورم و قیمت‌ها",terms:["تورم","شاخص قیمت","قیمت مصرف کننده","cpi","inflation","consumer prices","price index"]},
  {id:"oil_energy",label_fa:"نفت و انرژی",terms:["نفت","اوپک","انرژی","oil","opec","energy","crude"]},
  {id:"sanctions",label_fa:"تحریم و محدودیت تجاری",terms:["تحریم","محدودیت تجاری","ممنوعیت صادرات","sanction","trade restriction","embargo"]},
  {id:"diplomacy",label_fa:"مذاکرات و روابط خارجی",terms:["مذاکره","توافق","برجام","گفتگو","دیپلماسی","negotiation","agreement","nuclear deal","diplomacy"]},
  {id:"geopolitics",label_fa:"ریسک ژئوپلیتیک",terms:["جنگ","درگیری","حمله","تنش","آتش بس","war","conflict","attack","tension","ceasefire","escalation"]},
  {id:"fiscal",label_fa:"بودجه و سیاست مالی",terms:["بودجه","کسری بودجه","مالیات","یارانه","بدهی دولت","budget","fiscal","tax","subsidy","government debt"]},
  {id:"global_rates",label_fa:"بانک‌های مرکزی جهان",terms:["فدرال رزرو","فدرال‌رزرو","بانک مرکزی اروپا","ecb","federal reserve","fed rate","monetary policy"]}
];

const EVENT_TERMS = [
  {id:"rate_hike",label_fa:"افزایش نرخ بهره",terms:["افزایش نرخ بهره","نرخ بهره را افزایش","rate hike","raises rates","raised rates"],direction:"mixed"},
  {id:"rate_cut",label_fa:"کاهش نرخ بهره",terms:["کاهش نرخ بهره","نرخ بهره را کاهش","rate cut","cuts rates","cut rates"],direction:"mixed"},
  {id:"sanction_new",label_fa:"اعمال یا تشدید تحریم",terms:["تحریم جدید","اعمال تحریم","تشدید تحریم","imposes sanctions","new sanctions","sanctions imposed"],direction:"risk_up"},
  {id:"sanction_relief",label_fa:"کاهش یا لغو تحریم",terms:["لغو تحریم","رفع تحریم","تعلیق تحریم","sanctions lifted","eases sanctions","sanctions relief"],direction:"risk_down"},
  {id:"talks",label_fa:"آغاز یا ادامه مذاکره",terms:["آغاز مذاکرات","ادامه مذاکرات","ازسرگیری مذاکرات","resumes talks","talks resume","negotiations begin"],direction:"mixed"},
  {id:"ceasefire",label_fa:"آتش‌بس یا کاهش تنش",terms:["آتش بس","آتش‌بس","توافق آتش بس","ceasefire","de-escalation"],direction:"risk_down"},
  {id:"conflict",label_fa:"درگیری یا تشدید تنش",terms:["حمله نظامی","حمله موشکی","درگیری نظامی","تشدید تنش","military strike","missile attack","military conflict"],direction:"risk_up"},
  {id:"inflation_up",label_fa:"افزایش تورم",terms:["افزایش تورم","تورم صعودی","تورم افزایش یافت","inflation rises","inflation accelerated","higher inflation"],direction:"mixed"},
  {id:"inflation_down",label_fa:"کاهش تورم",terms:["کاهش تورم","تورم نزولی","تورم کاهش یافت","inflation falls","inflation eased","lower inflation"],direction:"mixed"},
  {id:"oil_supply",label_fa:"اختلال عرضه نفت",terms:["اختلال عرضه نفت","کاهش تولید نفت","توقف صادرات نفت","oil supply disruption","output cuts","oil exports halted","supply disruption","production outage","shipping disruption"],direction:"risk_up"},
  {id:"oil_supply_increase",label_fa:"افزایش عرضه نفت",terms:["افزایش عرضه نفت","افزایش تولید نفت","oil supply increase","raises output","boosts production","production increase"],direction:"mixed"},
  {id:"currency_intervention",label_fa:"مداخله ارزی",terms:["مداخله ارزی","تزریق ارز","intervenes in currency market","currency intervention","sells dollars","buys dollars"],direction:"mixed"},
  {id:"currency_devaluation",label_fa:"کاهش ارزش پول",terms:["کاهش ارزش پول","افت ارزش ارز","currency devaluation","currency depreciates","currency weakens","record low"],direction:"risk_up"},
  {id:"gold_demand",label_fa:"تغییر تقاضای طلا",terms:["تقاضای طلا","خرید طلا","gold demand","central bank gold buying","gold purchases"],direction:"mixed"}
];

const POSITIVE = ["افزایش","رشد","صعود","تقویت","بهبود","رکورد","بالاتر","افزایش یافت","افزایش پیدا کرد","rise","rises","surge","gain","higher","strengthen","improve"];
const NEGATIVE = ["کاهش","افت","سقوط","تضعیف","ریزش","کمتر","پایین‌تر","کاهش یافت","کاهش پیدا کرد","fall","falls","drop","decline","lower","weaken","plunge"];
const NEGATORS = ["نه","نیست","نشد","نمی‌شود","نخواهد","بدون","عدم","لغو","رد","تکذیب","not","no","never","without","denies","denied","rejects","rejected"];
const UNCERTAIN = ["احتمال","شاید","ممکن است","گمانه","ادعا","احتمالی","گزارش نشده","احراز نشده","reportedly","may","might","could","alleged","unconfirmed"];

function normalize(value) {
  return String(value ?? "").replace(/[۰-۹٠-٩]/g, c => DIGITS[c] || c)
    .replace(/[يكةۀؤإأآ]/g, c => CHAR_MAP[c] || c)
    .replace(/\u200c/g," ").replace(/[\u064b-\u065f\u0670]/g,"")
    .toLocaleLowerCase("en-US").replace(/\s+/g," ").trim();
}
function tokens(value) {
  return normalize(value).match(/[a-z]+(?:'[a-z]+)?|[\u0600-\u06ff]+|\d+(?:\.\d+)?/g) || [];
}
function containsAny(text, terms) { return terms.filter(term => text.includes(normalize(term))); }
function polarity(text, terms) {
  const hits = containsAny(text, terms);
  if (!hits.length) return 0;
  let score = 0;
  for (const hit of hits) {
    const at = text.indexOf(hit);
    const left = text.slice(Math.max(0, at-32), at);
    if (containsAny(left, NEGATORS).length) continue;
    score += 1;
  }
  return Math.sign(score);
}
function extractNumbers(text) {
  const out = [];
  const re = /(?:\d+(?:\.\d+)?)(?:\s?(?:٪|%|میلیون|میلیارد|هزار|دلار|تومان|ریال|بشکه|اونس|گرم|درصد|basis points?|bps))?/gi;
  for (const match of text.matchAll(re)) {
    const raw = match[0].trim();
    if (!raw) continue;
    const prev = text.slice(Math.max(0, match.index-45), match.index);
    const next = text.slice(match.index+raw.length, match.index+raw.length+35);
    out.push({value:Number((raw.match(/^\d+(?:\.\d+)?/)||[])[0]),unit:(raw.match(/٪|%|میلیون|میلیارد|هزار|دلار|تومان|ریال|بشکه|اونس|گرم|درصد|basis points?|bps/i)||[])[0]||null,context:(prev+raw+next).trim()});
  }
  return out.slice(0,12);
}
function englishSemantics(text) {
  const actors = ENGLISH_ACTORS.filter(a=>containsAny(text,a.terms).length).map(a=>a.id);
  const modal = containsAny(text,ENGLISH_MODAL);
  const reported = containsAny(text,ENGLISH_REPORTED);
  const conditional = containsAny(text,ENGLISH_CONDITIONAL).length > 0;
  const time = ENGLISH_TIME.filter(t=>containsAny(text,t.terms).length).map(t=>t.id);
  const negated = containsAny(text,["not","never","no longer","fails to","did not","has not","have not","was not","were not","denies","denied","ruled out"]).length > 0;
  const assertion = conditional ? "conditional" : modal.length ? "forecast_or_possibility" : reported.length ? "attributed_report" : negated ? "negated_or_denied" : "asserted_or_unclassified";
  return {actors,modality_terms:modal,reported_speech:reported.length>0,conditional,time_frames:[...new Set(time)],assertion};
}

function englishAdvancedSemantics(text) {
  const sentences = text.split(/(?<=[.!?])\s+|[;]\s+/).filter(Boolean).slice(0,20);
  const synonymMatches = ENGLISH_SYNONYMS.filter(x=>containsAny(text,x.terms).length).map(x=>x.canonical);
  const entities = ENGLISH_ENTITIES.filter(x=>containsAny(text,x.terms).length).map(x=>x.id);
  const relations = ENGLISH_RELATIONS.filter(x=>containsAny(text,x.terms).length).map(x=>x.id);
  const negativePatterns = containsAny(text,ENGLISH_NEGATIVE_PATTERNS);
  const contractions = containsAny(text,ENGLISH_NEGATIVE_CONTRACTIONS);
  const modal = containsAny(text,ENGLISH_MODAL);
  const reported = containsAny(text,ENGLISH_REPORTED);
  const conditional = containsAny(text,ENGLISH_CONDITIONAL).length > 0;
  const time = ENGLISH_TIME.filter(t=>containsAny(text,t.terms).length).map(t=>t.id);
  const actorIds = ENGLISH_ACTORS.filter(a=>containsAny(text,a.terms).length).map(a=>a.id);
  const units = ENGLISH_UNITS.filter(u=>containsAny(text,u.terms).length).map(u=>u.id);
  const sentenceFrames = sentences.map(sentence=>{
    const lower=sentence.toLowerCase();
    const sentenceActors=ENGLISH_ACTORS.filter(a=>containsAny(lower,a.terms).length).map(a=>a.id);
    const sentenceEvents=ENGLISH_SYNONYMS.filter(x=>containsAny(lower,x.terms).length).map(x=>x.canonical);
    const isNegated=containsAny(lower,ENGLISH_NEGATIVE_PATTERNS).length>0 || containsAny(lower,ENGLISH_NEGATIVE_CONTRACTIONS).length>0;
    const isConditional=/\b(if|unless|provided that|in case)\b/.test(lower);
    const isReported=containsAny(lower,ENGLISH_REPORTED).length>0;
    const isModal=containsAny(lower,ENGLISH_MODAL).length>0;
    return {text:sentence.slice(0,500),actors:sentenceActors,actions:[...new Set(sentenceEvents)],negated:isNegated,conditional:isConditional,reported:isReported,modal:isModal};
  });
  const assertion=conditional?"conditional":negativePatterns.length||contractions.length?"negated_or_denied":modal.length?"forecast_or_possibility":reported.length?"attributed_report":"asserted_or_unclassified";
  return {
    actors:actorIds,market_entities:entities,normalized_action_concepts:[...new Set(synonymMatches)],
    modality_terms:modal,negation_markers:[...negativePatterns,...contractions],
    reported_speech:reported.length>0,conditional,discourse_relations:relations,
    time_frames:[...new Set(time)],mentioned_units:units,assertion,sentence_frames:sentenceFrames
  };
}
function extractEnglishAmounts(text) {
  const out=[];
  const re=/\b(\d+(?:,\d{3})*(?:\.\d+)?)\s*(%|percent|per cent|bps|basis points|USD|EUR|dollars?|euros?|barrels?|bbl|ounces?|oz|million|billion|trillion)\b/gi;
  for(const m of text.matchAll(re)) {
    const raw=m[1].replace(/,/g,"");
    out.push({value:Number(raw),unit:m[2].toLowerCase(),context:text.slice(Math.max(0,m.index-55),Math.min(text.length,m.index+m[0].length+55)).trim()});
  }
  return out.slice(0,12);
}
\nfunction classifyOne(item) {
  const title = String(item?.title || item?.original_title || "");
  const body = String(item?.original_text || item?.translated_text_fa || item?.summary_fa || "").slice(0,3000);
  const text = normalize(title + " " + body);
  const themeHits = THEMES.map(t=>({...t,matches:containsAny(text,t.terms)})).filter(t=>t.matches.length);
  const events = EVENT_TERMS.filter(e=>containsAny(text,e.terms).length).map(e=>({id:e.id,label_fa:e.label_fa,market_effect:e.direction}));
  const uncertain = containsAny(text,UNCERTAIN).length>0;
  const pos = polarity(text,POSITIVE), neg = polarity(text,NEGATIVE);
  const tone = pos===neg?"neutral_or_unclear":pos>neg?"positive_wording":"negative_wording";
  const numberMentions = extractNumbers(text);
  const english = englishAdvancedSemantics(text);
  const language = /[\u0600-\u06ff]/.test(title) ? "fa" : "en";
  const confidence = Math.min(0.92,0.2+themeHits.length*0.10+events.length*0.12+(numberMentions.length?0.05:0)+(english.actors.length?0.04:0))*(uncertain||english.assertion==="conditional"||english.assertion==="forecast_or_possibility"?0.7:1);
  return {
    title,source:item?.domain||item?.source_id||null,published_at:item?.published_at||null,url:item?.url||null,
    language,content_chars:body.length,input_mode:body.length?"headline_plus_rss_excerpt":"headline_only",
    themes:themeHits.map(t=>t.id),events,wording_tone:tone,uncertain,
    english_semantics:language==="en"?english:null,
    numbers:[...numberMentions,...extractEnglishAmounts(text)].slice(0,20),confidence:Number(confidence.toFixed(2)),
    limitations:["lexicon_based","syntax_and_context_not_fully_resolved"]
  };
}
function historyFeatures(rows) {
  const valid=(Array.isArray(rows)?rows:[]).filter(r=>Number.isFinite(Number(r?.date))&&Number.isFinite(Number(r?.close))&&Number(r.close)>0).sort((a,b)=>a.date-b.date);
  const close=valid.map(r=>Number(r.close)), last=close.at(-1);
  const change=(period)=>close.length>period?(last/close[close.length-1-period]-1)*100:null;
  const returns=[];
  for(let i=1;i<close.length;i++) if(close[i-1]>0) returns.push((close[i]/close[i-1]-1)*100);
  const recent=returns.slice(-30),mean=recent.length?recent.reduce((a,b)=>a+b,0)/recent.length:0;
  const volatility=recent.length?Math.sqrt(recent.reduce((s,x)=>s+(x-mean)**2,0)/recent.length):null;
  const peak=Math.max(...close.slice(-30));
  const drawdown=peak>0?(last/peak-1)*100:null;
  const momentum7=change(7),momentum30=change(30);
  const trend=momentum7===null?"insufficient_data":momentum7>0.5?"rising":momentum7< -0.5?"falling":"sideways";
  return {
    observations:valid.length,last_price:last??null,first_date:valid[0]?.date??null,last_date:valid.at(-1)?.date??null,
    return_7_observations_pct:momentum7===null?null:Number(momentum7.toFixed(3)),
    return_30_observations_pct:momentum30===null?null:Number(momentum30.toFixed(3)),
    daily_volatility_pct:volatility===null?null:Number(volatility.toFixed(3)),
    drawdown_from_30_observation_peak_pct:drawdown===null?null:Number(drawdown.toFixed(3)),
    trend,trend_confidence:valid.length<12?"low":valid.length<30?"medium":"moderate",
    note_fa:"این ویژگی‌ها توصیف داده‌های تاریخی‌اند و به‌تنهایی علت تغییر قیمت یا پیش‌بینی قطعی نیستند."
  };
}
function eventPriceContext(analyses, rows) {
  const history=(Array.isArray(rows)?rows:[])
    .filter(r=>Number.isFinite(Number(r?.date))&&Number.isFinite(Number(r?.close))&&Number(r.close)>0)
    .map(r=>({date:Number(r.date),close:Number(r.close)}))
    .sort((a,b)=>a.date-b.date);
  const observations=[];
  for(const analysis of analyses) {
    const published=Date.parse(analysis.published_at||"");
    if(!Number.isFinite(published)||!analysis.events.length) continue;
    let before=-1;
    for(let i=0;i<history.length;i++) {
      if(history[i].date<=published) before=i;
      else break;
    }
    if(before<0 || published-history[before].date>72*60*60*1000) continue;
    const base=history[before].close;
    const after={};
    for(const horizon of [1,3,7]) {
      const point=history[before+horizon];
      after[horizon]=point?{
        observations:horizon,
        observed_at:new Date(point.date).toISOString(),
        change_pct:Number(((point.close/base-1)*100).toFixed(3))
      }:null;
    }
    observations.push({
      event_date:new Date(published).toISOString(),
      title:analysis.title,source:analysis.source,
      event_ids:analysis.events.map(e=>e.id),
      nearest_prior_observation_at:new Date(history[before].date).toISOString(),
      price_at_nearest_prior_observation:base,
      subsequent_price_observations:after,
      interpretation:"temporal_association_only_not_causation"
    });
  }
  return {
    matched_news_events:observations.length,
    observations:observations.slice(0,20),
    note_fa:"این بخش فقط تغییرات قیمت پس از زمان انتشار خبر را در داده‌های موجود نشان می‌دهد؛ رابطه زمانی، اثبات اثر خبر یا رابطه علّی نیست."
  };
}
function buildTopics(analyses,items) {
  const counts=new Map();
  for(const a of analyses) for(const id of a.themes) counts.set(id,(counts.get(id)||0)+1);
  return [...counts.entries()].sort((a,b)=>b[1]-a[1]).slice(0,6).map(([id,count])=>{
    const def=THEMES.find(t=>t.id===id);
    const evidence=analyses.filter(a=>a.themes.includes(id)).slice(0,3);
    return {id,title_fa:def?.label_fa||id,count,impact:"unknown",
      explanation_fa:"این موضوع در تیتر خبرها شناسایی شده است؛ اثر جهت‌دار آن بدون متن کامل و تأیید چند منبع تعیین نمی‌شود.",
      evidence:evidence.map(x=>x.title),sources:[...new Set(evidence.map(x=>x.source).filter(Boolean))]};
  });
}
function compareHeadlines(analyses) {
  const groups=new Map();
  for(const a of analyses) {
    const key=[...a.themes].sort().join("|");
    if(!key) continue;
    const g=groups.get(key)||[];
    g.push(a);groups.set(key,g);
  }
  const candidates=[];
  for(const group of groups.values()) {
    if(group.length<2) continue;
    const up=group.filter(x=>x.events.some(e=>e.market_effect==="risk_down"));
    const down=group.filter(x=>x.events.some(e=>e.market_effect==="risk_up"));
    if(up.length&&down.length) candidates.push({
      type:"opposing_event_frames",theme_ids:[...new Set(group.flatMap(x=>x.themes))],
      note_fa:"تیترها رویدادهایی با جهت ریسک متفاوت را پوشش می‌دهند؛ ممکن است درباره دو رویداد یا دو زمان متفاوت باشند و تناقض قطعی محسوب نمی‌شوند.",
      examples:[...up.slice(0,2),...down.slice(0,2)].map(x=>({title:x.title,source:x.source,published_at:x.published_at,url:x.url}))
    });
  }
  return candidates.slice(0,8);
}
export function analyzeMarketLanguage(items,rows) {
  const input=Array.isArray(items)?items:[];
  const analyses=input.slice(0,50).map(classifyOne);
  const hist=historyFeatures(rows);
  const events=analyses.flatMap(a=>a.events.map(e=>({...e,title:a.title,source:a.source,published_at:a.published_at,url:a.url,confidence:a.confidence,uncertain:a.uncertain})));
  const numberMentions=analyses.flatMap(a=>a.numbers.map(n=>({...n,title:a.title,source:a.source,published_at:a.published_at})));
  return {
    engine:"dollar-domain-nlp",version:VERSION,mode:"deterministic_domain_nlp_not_llm",
    language_coverage:["fa","en"],english_understanding:["actor_extraction","market_entity_recognition","morphological_and_synonym_normalization","negation_and_modality","reported_speech","conditional_statements","sentence_level_frames","discourse_relations","time_framing","financial_amount_and_unit_extraction"],news_analyzed:analyses.length,
    news_with_excerpt:analyses.filter(x=>x.content_chars>0).length,
    excerpt_coverage_pct:analyses.length?Number((analyses.filter(x=>x.content_chars>0).length/analyses.length*100).toFixed(1)):0,
    themes:buildTopics(analyses,input),events:events.slice(0,30),
    numeric_mentions:numberMentions.slice(0,30),
    possible_conflicts:compareHeadlines(analyses),
    historical_context:hist,
    event_price_context:eventPriceContext(analyses,rows),
    quality:{
      title_only:analyses.length>0&&analyses.every(x=>x.content_chars===0),
      rss_excerpt_available:analyses.some(x=>x.content_chars>0),
      full_article_text_available:false,
      source_independence_verified:false,
      sentiment_is_market_direction:false,
      confidence_is_not_calibrated_probability:true
    },
    per_news:analyses.slice(0,30)
  };
}
