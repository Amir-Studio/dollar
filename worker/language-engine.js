// Dollar Market Language Engine v0.1
// Lightweight, deterministic Persian/English domain NLP. It does not claim to be a generative LLM.
import { analyzePragmatics, runPragmaticsBenchmark, PRAGMATICS_VERSION, PRAGMATICS_PHRASE_COUNT } from "./pragmatics-engine.js";
import { analyzeFormalRegister, runFormalRegisterBenchmark, FORMAL_REGISTER_VERSION } from "./formal-register-engine.js";
import { runNewsComprehensionBenchmark, getHardNewsChallenge, NEWS_COMPREHENSION_VERSION } from "./news-comprehension-engine.js";
import { analyzeNewsReading, runNewsReadingBenchmark, NEWS_READING_VERSION } from "./news-reading-engine.js";

export const VERSION = "dollar-news-analyzer-1.4.0";

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


const B1_VOCAB = [
  {id:"announce",terms:["announce","announces","announced","announcement","declare","declares","declared"]},
  {id:"expect",terms:["expect","expects","expected","expectation","predict","predicts","predicted","forecast","forecasts","forecasted"]},
  {id:"increase",terms:["increase","increases","increased","increasing","rise","rises","rose","risen","higher","higher than","up by"]},
  {id:"decrease",terms:["decrease","decreases","decreased","decreasing","fall","falls","fell","fallen","lower","lower than","down by"]},
  {id:"remain",terms:["remain","remains","remained","stay","stays","stayed","unchanged","stable"]},
  {id:"affect",terms:["affect","affects","affected","impact","impacts","influence","influences","influenced"]},
  {id:"cause",terms:["cause","causes","caused","lead to","leads to","led to","result in","results in","resulted in"]},
  {id:"support",terms:["support","supports","supported","back","backs","backed","boost","boosts","boosted"]},
  {id:"reduce",terms:["reduce","reduces","reduced","cut","cuts","cutting","lower","lowers","lowered"]},
  {id:"delay",terms:["delay","delays","delayed","postpone","postpones","postponed","put off"]},
  {id:"agree",terms:["agree","agrees","agreed","agreement","disagree","disagrees","disagreed"]},
  {id:"discuss",terms:["discuss","discusses","discussed","talk","talks","talked","negotiate","negotiates","negotiated"]}
];
const B1_PHRASES = [
  {id:"because_of",terms:["because of","due to","as a result of"]},
  {id:"in_spite_of",terms:["despite","in spite of","although","even though"]},
  {id:"compared_with",terms:["compared with","compared to","in comparison with","whereas"]},
  {id:"according_to",terms:["according to","as reported by","officials said","the report says"]},
  {id:"at_least",terms:["at least","at most","more than","less than","around","approximately","nearly"]},
  {id:"future_plan",terms:["plan to","plans to","is expected to","are expected to","is likely to","are likely to"]},
  {id:"past_event",terms:["has announced","have announced","was announced","were announced","took place","came into effect"]},
  {id:"condition",terms:["if","unless","provided that","in case"]}
];
function analyzeB1English(text) {
  const sentences=text.split(/(?<=[.!?])\s+|;\s+/).filter(Boolean).slice(0,20);
  const vocabulary=B1_VOCAB.filter(v=>containsAny(text,v.terms).length).map(v=>v.id);
  const phrases=B1_PHRASES.filter(p=>containsAny(text,p.terms).length).map(p=>p.id);
  const frames=sentences.map(sentence=>{
    const t=sentence.toLowerCase();
    const tense=/\b(will|shall|tomorrow|next week|next month|is expected to|are expected to)\b/.test(t)?"future":
      /\b(yesterday|last week|last month|ago|announced|rose|fell|was imposed|were imposed|increased|decreased)\b/.test(t)?"past":
      /\b(is|are|am|currently|today|now|remains|remain)\b/.test(t)?"present":"unspecified";
    const voice=/\b(was|were|is|are|been|be)\s+\w+(ed|en)\b/.test(t)?"possibly_passive":"active_or_unclear";
    const condition=/\b(if|unless|provided that|in case)\b/.test(t);
    const comparison=/\b(more|less|higher|lower|greater|fewer)\s+(than|by)\b|\b(as .* as)\b/.test(t);
    const cause=containsAny(t,["because","because of","due to","as a result","therefore","led to","resulted in"]).length>0;
    return {sentence:sentence.slice(0,500),tense,voice,conditional:condition,comparison,cause_or_result:cause};
  });
  return {coverage_level:"b1_oriented_domain_english_not_cefr_certification",vocabulary_concepts:vocabulary,common_phrase_functions:phrases,grammar_frames:frames,limitations:["rule_based_grammar_approximation","not_a_formal_cefr_assessment"]};
}


const C1_LEXICON = [
 {id:"monetary_policy",terms:["quantitative easing","quantitative tightening","forward guidance","policy tightening","policy easing","real interest rates","terminal rate","rate differential"]},
 {id:"market_liquidity",terms:["liquidity conditions","liquidity squeeze","market depth","bid-ask spread","funding stress","credit conditions"]},
 {id:"risk_sentiment",terms:["risk appetite","risk aversion","safe-haven demand","flight to quality","risk premium","tail risk"]},
 {id:"inflation_dynamics",terms:["core inflation","headline inflation","sticky inflation","disinflationary","inflationary pressure","wage-price spiral","second-round effects"]},
 {id:"commodities",terms:["backwardation","contango","spare capacity","inventory draw","supply glut","demand destruction","marginal producer"]},
 {id:"geopolitical_risk",terms:["geopolitical uncertainty","escalatory rhetoric","diplomatic breakthrough","fragile truce","ceasefire agreement","sanctions regime"]},
 {id:"fiscal_debt",terms:["debt sustainability","fiscal consolidation","sovereign risk","debt-servicing costs","yield curve","term premium"]},
 {id:"analytical_verbs",terms:["underscores","suggests","implies","signals","reinforces","undermines","constrains","offsets","exacerbates","mitigates","warrants","hinges on","stems from","is predicated on"]},
 {id:"advanced_connectors",terms:["notwithstanding","nevertheless","nonetheless","conversely","thereby","insofar as","to the extent that","in the wake of","by contrast","in turn","all else equal"]},
 {id:"hedging",terms:["arguably","conceivably","plausibly","tentatively","appears to","seems to","is unlikely to","cannot be ruled out","risks","may well","could potentially"]},
 {id:"evidence_language",terms:["according to preliminary data","the available evidence","the data indicate","the figures suggest","market participants expect","analysts caution","officials maintain","unverified reports"]}
];
const C1_DISCOURSE = [
 {id:"concession",terms:["even if","even though","while it is true","admittedly","granted that","notwithstanding","despite the fact that"]},
 {id:"qualification",terms:["to some extent","in part","at least partly","subject to","conditional on","provided that","assuming that"]},
 {id:"counterfactual",terms:["would have","could have","might have","had it not been","if it were not for","were it not for"]},
 {id:"causal_caution",terms:["does not necessarily mean","is not sufficient to establish","cannot be attributed solely to","correlation does not imply causation","may reflect a combination"]},
 {id:"relative_comparison",terms:["whereas","by comparison","relative to","in contrast with","outperformed","underperformed","diverged from"]},
 {id:"source_attribution",terms:["according to people familiar with","the source declined to","the ministry stated","the central bank reiterated","the filing disclosed","the report alleged"]},
 {id:"uncertainty",terms:["remains uncertain","subject to considerable uncertainty","the likelihood remains unclear","cannot be excluded","far from certain","little evidence that"]}
];
function analyzeC1English(text) {
 const lower=text.toLowerCase();
 const sentences=text.split(/(?<=[.!?])\s+|;\s+/).filter(Boolean).slice(0,24);
 const lexicon=C1_LEXICON.filter(x=>containsAny(lower,x.terms).length).map(x=>x.id);
 const discourse=C1_DISCOURSE.filter(x=>containsAny(lower,x.terms).length).map(x=>x.id);
 const sentenceAnalysis=sentences.map(sentence=>{
  const t=sentence.toLowerCase();
  const markers=C1_DISCOURSE.filter(x=>containsAny(t,x.terms).length).map(x=>x.id);
  const hedge=containsAny(t,C1_LEXICON.find(x=>x.id==="hedging").terms).length>0;
  const attribution=containsAny(t,C1_DISCOURSE.find(x=>x.id==="source_attribution").terms).length>0 || containsAny(t,ENGLISH_REPORTED).length>0;
  const denial=containsAny(t,ENGLISH_NEGATIVE_PATTERNS).length>0 || containsAny(t,ENGLISH_NEGATIVE_CONTRACTIONS).length>0;
  const modality=containsAny(t,ENGLISH_MODAL).length>0;
  const causal=containsAny(t,["because","because of","due to","therefore","thereby","as a result","stems from","hinges on","leads to","led to","consequently"]).length>0;
  const conditional=/\b(if|unless|provided that|assuming that|subject to|conditional on)\b/.test(t);
  const counterfactual=containsAny(t,C1_DISCOURSE.find(x=>x.id==="counterfactual").terms).length>0;
  const quantifier=containsAny(t,["most","some","few","several","a minority","a majority","at least","no more than","roughly","approximately","marginally"]).length>0;
  return {text:sentence.slice(0,650),discourse_functions:markers,hedged:hedge,attributed:attribution,negated_or_denied:denial,modal:modality,causal_language:causal,conditional,counterfactual,qualified_quantity:quantifier};
 });
 const advancedCount=lexicon.length+discourse.length;
 return {coverage_level:"c1_oriented_financial_news_analysis_not_cefr_certification",advanced_domains:lexicon,discourse_functions:discourse,sentence_analysis:sentenceAnalysis,complexity_signals:advancedCount,limitations:["deterministic_pattern_analysis_not_full_semantic_parsing","does_not_certify_cefr_level","idiom_and_irony_detection_is_limited"]};
}


const MARKET_GLOSSARY = [
 {id:"inflation",terms:["inflation","consumer price inflation","headline inflation"],fa:"تورم؛ افزایش عمومی سطح قیمت‌ها"},
 {id:"core_inflation",terms:["core inflation","underlying inflation"],fa:"تورم هسته؛ تورم با حذف اقلام پرنوسان"},
 {id:"disinflation",terms:["disinflation","disinflationary"],fa:"کاهش سرعت افزایش قیمت‌ها، نه لزوماً کاهش قیمت"},
 {id:"deflation",terms:["deflation","deflationary"],fa:"کاهش عمومی سطح قیمت‌ها"},
 {id:"stagflation",terms:["stagflation"],fa:"رکود تورمی؛ رشد ضعیف همراه با تورم بالا"},
 {id:"interest_rate",terms:["interest rate","interest rates","rates","policy rate","benchmark rate"],fa:"نرخ بهره؛ هزینه وام‌گرفتن یا بازده وام‌دادن"},
 {id:"real_interest_rate",terms:["real interest rate","real rates"],fa:"نرخ بهره واقعی؛ نرخ بهره پس از تعدیل تورم"},
 {id:"rate_hike",terms:["rate hike","raise rates","tighten monetary policy"],fa:"افزایش نرخ بهره یا انقباض پولی"},
 {id:"rate_cut",terms:["rate cut","cut rates","ease monetary policy"],fa:"کاهش نرخ بهره یا تسهیل پولی"},
 {id:"quantitative_easing",terms:["quantitative easing","qe"],fa:"تسهیل کمی؛ خرید دارایی توسط بانک مرکزی"},
 {id:"quantitative_tightening",terms:["quantitative tightening","qt"],fa:"انقباض کمی؛ کوچک‌کردن ترازنامه بانک مرکزی"},
 {id:"yield",terms:["yield","bond yield","treasury yield"],fa:"بازده اوراق؛ نرخ بازده مورد انتظار یا تحقق‌یافته"},
 {id:"yield_curve",terms:["yield curve","term structure"],fa:"منحنی بازده؛ رابطه سررسید اوراق و بازده آن‌ها"},
 {id:"inversion",terms:["yield curve inversion","inverted yield curve"],fa:"معکوس‌شدن منحنی بازده؛ بازده کوتاه‌مدت بالاتر از بلندمدت"},
 {id:"bond",terms:["government bond","sovereign bond","treasury bond"],fa:"اوراق قرضه دولتی"},
 {id:"bond_price",terms:["bond prices","bond price"],fa:"قیمت اوراق؛ معمولاً با بازده رابطه معکوس دارد"},
 {id:"liquidity",terms:["liquidity","market liquidity"],fa:"نقدشوندگی؛ امکان معامله سریع با اثر قیمتی کم"},
 {id:"volatility",terms:["volatility","price volatility"],fa:"نوسان‌پذیری؛ شدت تغییرات قیمت"},
 {id:"spread",terms:["spread","bid ask spread","credit spread"],fa:"فاصله دو قیمت یا اختلاف بازده؛ معنایش به زمینه بستگی دارد"},
 {id:"risk_premium",terms:["risk premium","term premium"],fa:"صرف ریسک؛ بازده اضافه برای پذیرش ریسک"},
 {id:"safe_haven",terms:["safe haven","safe-haven asset","flight to safety"],fa:"دارایی امن؛ دارایی مورد توجه در دوره‌های نااطمینانی"},
 {id:"risk_appetite",terms:["risk appetite","risk-on"],fa:"تمایل سرمایه‌گذاران به پذیرش ریسک"},
 {id:"risk_aversion",terms:["risk aversion","risk-off"],fa:"ریسک‌گریزی؛ کاهش تمایل به دارایی‌های پرریسک"},
 {id:"bull_market",terms:["bull market","bullish"],fa:"بازار صعودی یا دیدگاه افزایشی"},
 {id:"bear_market",terms:["bear market","bearish"],fa:"بازار نزولی یا دیدگاه کاهشی"},
 {id:"support",terms:["support level","technical support"],fa:"سطح حمایت؛ محدوده‌ای که ممکن است فشار خرید بیشتر شود"},
 {id:"resistance",terms:["resistance level","technical resistance"],fa:"سطح مقاومت؛ محدوده‌ای که ممکن است فشار فروش بیشتر شود"},
 {id:"breakout",terms:["breakout","break below","break above"],fa:"شکست محدوده یا سطح قیمتی"},
 {id:"correction",terms:["market correction","correction"],fa:"اصلاح قیمت؛ حرکت خلاف روند غالب"},
 {id:"drawdown",terms:["drawdown","peak-to-trough decline"],fa:"افت از اوج تا کف بعدی"},
 {id:"market_cap",terms:["market capitalization","market cap"],fa:"ارزش بازار؛ قیمت ضربدر تعداد واحدهای در گردش"},
 {id:"safe_haven_gold",terms:["gold","gold demand","gold bullion","spot gold"],fa:"تقاضا یا طلای نقدی"},
 {id:"ounce",terms:["troy ounce","ounce"],fa:"اونس تروا؛ واحد رایج وزن فلزات گران‌بها"},
 {id:"crude_oil",terms:["crude oil","brent crude","wti","oil","oil exports"],fa:"نفت خام؛ از جمله شاخص‌های برنت و WTI"},
 {id:"oil_inventory",terms:["oil inventories","crude stockpiles","inventory draw"],fa:"ذخایر نفتی؛ تغییر آن‌ها می‌تواند بر قیمت اثر بگذارد"},
 {id:"supply",terms:["supply","spare capacity","production output"],fa:"عرضه؛ مقدار کالای ارائه‌شده به بازار"},
 {id:"demand",terms:["demand","consumer demand","industrial demand"],fa:"تقاضا؛ مقدار کالای موردنیاز خریداران"},
 {id:"opec",terms:["opec","opec+"],fa:"اوپک و ائتلاف اوپک‌پلاس"},
 {id:"exchange_rate",terms:["exchange rate","fx rate","currency pair","currency"],fa:"نرخ ارز؛ قیمت یک ارز بر حسب ارز دیگر"},
 {id:"appreciation",terms:["currency appreciation","appreciate"],fa:"تقویت ارزش پول"},
 {id:"depreciation",terms:["currency depreciation","depreciate"],fa:"تضعیف ارزش پول"},
 {id:"devaluation",terms:["devaluation","devalue"],fa:"کاهش رسمی ارزش پول توسط مرجع پولی"},
 {id:"capital_outflow",terms:["capital outflow","capital flight"],fa:"خروج سرمایه از یک کشور یا بازار"},
 {id:"capital_inflow",terms:["capital inflow","foreign investment inflows"],fa:"ورود سرمایه به یک کشور یا بازار"},
 {id:"fiscal_deficit",terms:["fiscal deficit","budget deficit"],fa:"کسری بودجه؛ بیشتر بودن مخارج از درآمد دولت"},
 {id:"public_debt",terms:["public debt","sovereign debt","government debt"],fa:"بدهی عمومی یا بدهی دولت"},
 {id:"sanctions",terms:["sanctions","trade embargo","sanctions relief"],fa:"تحریم‌ها یا کاهش محدودیت‌های تحریمی"},
 {id:"geopolitical_risk",terms:["geopolitical risk","geopolitical tensions","geopolitical uncertainty","tensions"],fa:"ریسک ژئوپلیتیک؛ ریسک ناشی از تنش‌های سیاسی و بین‌المللی"},
 {id:"ceasefire",terms:["ceasefire","truce"],fa:"آتش‌بس؛ توقف درگیری با شرایط مشخص"},
 {id:"recession",terms:["recession","economic contraction"],fa:"رکود اقتصادی؛ کاهش فعالیت اقتصادی"},
 {id:"gdp",terms:["gross domestic product","gdp"],fa:"تولید ناخالص داخلی"},
 {id:"employment",terms:["unemployment rate","payrolls","labor market"],fa:"بیکاری، اشتغال و وضعیت بازار کار"},
 {id:"pmi",terms:["purchasing managers index","pmi"],fa:"شاخص مدیران خرید؛ سنجه‌ای از فعالیت اقتصادی"},
 {id:"cpi",terms:["consumer price index","cpi"],fa:"شاخص قیمت مصرف‌کننده"},
 {id:"ppi",terms:["producer price index","ppi"],fa:"شاخص قیمت تولیدکننده"},
 {id:"central_bank",terms:["central bank","federal reserve","ecb","bank of japan"],fa:"بانک مرکزی؛ نهاد مسئول سیاست پولی"},
 {id:"forward_guidance",terms:["forward guidance"],fa:"راهنمایی آینده‌نگر؛ پیام بانک مرکزی درباره مسیر احتمالی سیاست"},
 {id:"market_expectations",terms:["market expectations","priced in","fully priced"],fa:"انتظارات بازار یا پیش‌خورشدن یک رویداد در قیمت"},
 {id:"benchmark",terms:["benchmark","reference rate","index"],fa:"شاخص یا نرخ مرجع برای مقایسه"},
 {id:"correlation",terms:["correlation","correlated"],fa:"همبستگی؛ همراهی آماری دو متغیر، نه اثبات علت"},
 {id:"causation",terms:["causation","causal relationship","caused by"],fa:"رابطه علّی؛ اثرگذاری یک عامل بر عامل دیگر"},
 {id:"forecast",terms:["forecast","outlook","projection"],fa:"پیش‌بینی؛ برآورد آینده بر پایه اطلاعات و فرض‌ها"},
 {id:"guidance",terms:["guidance","outlook"],fa:"راهنمایی یا چشم‌انداز اعلام‌شده توسط نهاد یا شرکت"}
];
function extractMarketGlossary(text) {
 const found=[];
 for(const item of MARKET_GLOSSARY) {
  const matches=containsAny(text,item.terms);
  if(matches.length) found.push({id:item.id,term:matches[0],meaning_fa:item.fa});
 }
 return found.slice(0,30);
}
function terminologySelfTest() {
 const cases=[
  ["US inflation remains sticky despite higher interest rates.",["inflation","interest_rate"]],
  ["The central bank may cut rates if economic growth slows.",["central_bank","rate_cut"]],
  ["Gold is often treated as a safe haven during geopolitical risk.",["safe_haven","geopolitical_risk"]],
  ["Brent crude fell after oil inventories increased.",["crude_oil","oil_inventory"]],
  ["A yield curve inversion can signal recession risks.",["yield_curve","inversion","recession"]],
  ["Currency depreciation may increase imported inflation.",["depreciation","inflation"]],
  ["The government faces a widening fiscal deficit and rising public debt.",["fiscal_deficit","public_debt"]],
  ["Correlation between two assets does not prove causation.",["correlation","causation"]]
 ];
 const results=cases.map(([input,expected])=>{
  const actual=extractMarketGlossary(normalize(input)).map(x=>x.id);
  const missing=expected.filter(x=>!actual.includes(x));
  return {passed:missing.length===0,missing};
 });
 const passed=results.filter(x=>x.passed).length;
 return {passed,total:results.length,accuracy_pct:Number((passed/results.length*100).toFixed(1)),status:passed===results.length?"pass":"needs_revision",cases:results};
}


const PERSIAN_MARKET_GLOSSARY = [
 {id:"inflation",terms:["تورم","افزایش سطح عمومی قیمت","افزایش قیمت‌ها"],fa:"تورم؛ افزایش عمومی سطح قیمت‌ها"},
 {id:"core_inflation",terms:["تورم هسته","تورم پایه"],fa:"تورم هسته؛ تورم با حذف اقلام پرنوسان"},
 {id:"disinflation",terms:["کاهش نرخ تورم","کاهش شتاب تورم","کاهش سرعت رشد قیمت"],fa:"کاهش تورم؛ کندشدن رشد قیمت‌ها، نه الزاماً ارزان‌شدن کالاها"},
 {id:"deflation",terms:["تورم منفی","کاهش عمومی قیمت‌ها"],fa:"کاهش عمومی سطح قیمت‌ها"},
 {id:"stagflation",terms:["رکود تورمی"],fa:"رکود تورمی؛ رشد ضعیف همراه با تورم بالا"},
 {id:"interest_rate",terms:["نرخ بهره","نرخ سود بانکی"],fa:"نرخ بهره؛ هزینه وام یا بازده سپرده"},
 {id:"real_interest_rate",terms:["نرخ بهره واقعی","بهره واقعی"],fa:"نرخ بهره پس از تعدیل تورم"},
 {id:"rate_hike",terms:["افزایش نرخ بهره","بالا بردن نرخ بهره","سیاست پولی انقباضی"],fa:"افزایش نرخ بهره یا انقباض پولی"},
 {id:"rate_cut",terms:["کاهش نرخ بهره","پایین آوردن نرخ بهره","سیاست پولی انبساطی"],fa:"کاهش نرخ بهره یا تسهیل پولی"},
 {id:"quantitative_easing",terms:["تسهیل کمی","خرید دارایی توسط بانک مرکزی"],fa:"تسهیل کمی؛ خرید دارایی برای تزریق نقدینگی"},
 {id:"quantitative_tightening",terms:["انقباض کمی","کاهش ترازنامه بانک مرکزی"],fa:"انقباض کمی؛ کوچک‌کردن ترازنامه بانک مرکزی"},
 {id:"yield",terms:["بازده اوراق","نرخ بازده اوراق"],fa:"بازده اوراق؛ نرخ بازده مورد انتظار یا تحقق‌یافته"},
 {id:"yield_curve",terms:["منحنی بازده","منحنی نرخ بهره"],fa:"منحنی بازده؛ رابطه سررسید و بازده اوراق"},
 {id:"inversion",terms:["معکوس شدن منحنی بازده","وارونگی منحنی بازده"],fa:"معکوس‌شدن منحنی؛ بازده کوتاه‌مدت بالاتر از بلندمدت"},
 {id:"bond",terms:["اوراق قرضه","اوراق بدهی دولتی","اسناد خزانه"],fa:"اوراق بدهی؛ ابزار وام‌گرفتن دولت یا شرکت"},
 {id:"bond_price",terms:["قیمت اوراق","قیمت اوراق قرضه"],fa:"قیمت اوراق؛ معمولاً با بازده رابطه معکوس دارد"},
 {id:"liquidity",terms:["نقدشوندگی","نقدینگی بازار"],fa:"نقدشوندگی؛ امکان معامله سریع با اثر قیمتی کم"},
 {id:"volatility",terms:["نوسان‌پذیری","شدت نوسان قیمت"],fa:"نوسان‌پذیری؛ شدت تغییرات قیمت"},
 {id:"spread",terms:["فاصله قیمت خرید و فروش","اختلاف بازده","اسپرد"],fa:"فاصله قیمت‌ها یا اختلاف بازده؛ وابسته به زمینه"},
 {id:"risk_premium",terms:["صرف ریسک","پاداش ریسک"],fa:"صرف ریسک؛ بازده اضافه برای پذیرش ریسک"},
 {id:"safe_haven",terms:["دارایی امن","پناهگاه امن سرمایه","طلا"],fa:"دارایی امن؛ دارایی مورد توجه در دوره نااطمینانی"},
 {id:"risk_appetite",terms:["ریسک پذیری","تمایل به پذیرش ریسک"],fa:"تمایل سرمایه‌گذاران به پذیرش ریسک"},
 {id:"risk_aversion",terms:["ریسک گریزی","فرار از ریسک"],fa:"ریسک‌گریزی؛ کاهش تمایل به دارایی‌های پرریسک"},
 {id:"bull_market",terms:["بازار صعودی","روند صعودی","دیدگاه افزایشی"],fa:"بازار صعودی یا دیدگاه افزایشی"},
 {id:"bear_market",terms:["بازار نزولی","روند نزولی","دیدگاه کاهشی"],fa:"بازار نزولی یا دیدگاه کاهشی"},
 {id:"support",terms:["سطح حمایت","حمایت قیمتی"],fa:"حمایت؛ محدوده‌ای که احتمال افزایش تقاضا وجود دارد"},
 {id:"resistance",terms:["سطح مقاومت","مقاومت قیمتی"],fa:"مقاومت؛ محدوده‌ای که احتمال افزایش عرضه وجود دارد"},
 {id:"breakout",terms:["شکست مقاومت","شکست حمایت","شکست محدوده قیمتی"],fa:"شکست سطح یا محدوده قیمتی"},
 {id:"correction",terms:["اصلاح قیمت","اصلاح بازار"],fa:"اصلاح قیمت؛ حرکت خلاف روند غالب"},
 {id:"drawdown",terms:["افت از سقف","افت از اوج تا کف","حداکثر افت"],fa:"افت از اوج تا کف بعدی"},
 {id:"market_cap",terms:["ارزش بازار","ارزش کل بازار"],fa:"ارزش بازار؛ قیمت ضربدر تعداد واحدهای در گردش"},
 {id:"ounce",terms:["اونس تروا","اونس طلا"],fa:"اونس تروا؛ واحد رایج وزن فلزات گران‌بها"},
 {id:"crude_oil",terms:["نفت خام","نفت برنت","نفت وست تگزاس","صادرات نفت","نفت"],fa:"نفت خام؛ از جمله شاخص‌های برنت و WTI"},
 {id:"oil_inventory",terms:["ذخایر نفت","موجودی نفت","انبارهای نفت"],fa:"ذخایر نفتی؛ تغییر آن‌ها می‌تواند بر قیمت اثر بگذارد"},
 {id:"supply",terms:["عرضه","میزان عرضه","ظرفیت تولید"],fa:"عرضه؛ مقدار کالای ارائه‌شده به بازار"},
 {id:"demand",terms:["تقاضا","میزان تقاضا","نیاز خریداران"],fa:"تقاضا؛ مقدار کالای موردنیاز خریداران"},
 {id:"opec",terms:["اوپک","اوپک پلاس"],fa:"اوپک و ائتلاف اوپک‌پلاس"},
 {id:"exchange_rate",terms:["نرخ ارز","قیمت ارز","نرخ تبدیل ارز"],fa:"نرخ ارز؛ قیمت یک ارز بر حسب ارز دیگر"},
 {id:"appreciation",terms:["تقویت ارزش پول","افزایش ارزش پول ملی"],fa:"تقویت ارزش پول"},
 {id:"depreciation",terms:["تضعیف ارزش پول","کاهش ارزش پول ملی"],fa:"تضعیف ارزش پول"},
 {id:"devaluation",terms:["کاهش رسمی ارزش پول","کاهش ارزش رسمی پول"],fa:"کاهش رسمی ارزش پول توسط مرجع پولی"},
 {id:"capital_outflow",terms:["خروج سرمایه","فرار سرمایه"],fa:"خروج سرمایه از یک کشور یا بازار"},
 {id:"capital_inflow",terms:["ورود سرمایه","جذب سرمایه خارجی"],fa:"ورود سرمایه به یک کشور یا بازار"},
 {id:"fiscal_deficit",terms:["کسری بودجه","کسری بودجه دولت"],fa:"کسری بودجه؛ بیشتر بودن مخارج از درآمد دولت"},
 {id:"public_debt",terms:["بدهی عمومی","بدهی دولت","بدهی دولتی"],fa:"بدهی عمومی یا بدهی دولت"},
 {id:"sanctions",terms:["تحریم","تحریم اقتصادی","رفع تحریم","تشدید تحریم"],fa:"تحریم‌ها یا کاهش محدودیت‌های تحریمی"},
 {id:"geopolitical_risk",terms:["ریسک ژئوپلیتیک","تنش ژئوپلیتیک","تنش سیاسی بین‌المللی","تنش سیاسی"],fa:"ریسک ناشی از تنش‌های سیاسی و بین‌المللی"},
 {id:"ceasefire",terms:["آتش بس","توافق آتش بس","توقف درگیری"],fa:"آتش‌بس؛ توقف درگیری با شرایط مشخص"},
 {id:"recession",terms:["رکود اقتصادی","انقباض اقتصادی","رکود"],fa:"رکود اقتصادی؛ کاهش فعالیت اقتصادی"},
 {id:"gdp",terms:["تولید ناخالص داخلی","تولید ناخالص ملی"],fa:"تولید ناخالص داخلی؛ ارزش کالاها و خدمات نهایی تولیدشده"},
 {id:"employment",terms:["نرخ بیکاری","بازار کار","اشتغال","آمار اشتغال"],fa:"اشتغال، بیکاری و وضعیت بازار کار"},
 {id:"pmi",terms:["شاخص مدیران خرید","شاخص pmi"],fa:"شاخص مدیران خرید؛ سنجه‌ای از فعالیت اقتصادی"},
 {id:"cpi",terms:["شاخص قیمت مصرف کننده","شاخص بهای مصرف کننده","شاخص cpi"],fa:"شاخص قیمت مصرف‌کننده"},
 {id:"ppi",terms:["شاخص قیمت تولیدکننده","شاخص بهای تولیدکننده","شاخص ppi"],fa:"شاخص قیمت تولیدکننده"},
 {id:"central_bank",terms:["بانک مرکزی","فدرال رزرو","بانک مرکزی اروپا"],fa:"بانک مرکزی؛ نهاد مسئول سیاست پولی"},
 {id:"forward_guidance",terms:["راهنمایی آینده نگر","راهنمای سیاست پولی"],fa:"راهنمایی آینده‌نگر درباره مسیر احتمالی سیاست پولی"},
 {id:"market_expectations",terms:["انتظارات بازار","پیش خور شدن در قیمت","در قیمت لحاظ شده"],fa:"انتظارات بازار یا پیش‌خورشدن رویداد در قیمت"},
 {id:"benchmark",terms:["شاخص مرجع","نرخ مرجع","معیار مقایسه"],fa:"شاخص یا نرخ مرجع برای مقایسه"},
 {id:"correlation",terms:["همبستگی","ارتباط آماری"],fa:"همبستگی؛ همراهی آماری، نه اثبات رابطه علّی"},
 {id:"causation",terms:["رابطه علّی","علیت","سببیت"],fa:"رابطه علّی؛ اثرگذاری یک عامل بر عامل دیگر"},
 {id:"forecast",terms:["پیش بینی","برآورد آینده","چشم انداز"],fa:"پیش‌بینی؛ برآورد آینده بر پایه داده و فرض‌ها"},
 {id:"economic_growth",terms:["رشد اقتصادی","افزایش تولید"],fa:"رشد اقتصادی؛ افزایش تولید کالاها و خدمات"},
 {id:"intrinsic_value",terms:["ارزش ذاتی"],fa:"ارزش ذاتی؛ برآورد ارزش بر اساس عوامل بنیادی"},
 {id:"bubble",terms:["حباب قیمتی","حباب بازار","حباب دارایی"],fa:"حباب؛ قیمت بسیار بالاتر از برآورد ارزش بنیادی"},
 {id:"profit_margin",terms:["حاشیه سود","حاشیه سود خالص"],fa:"حاشیه سود؛ نسبت سود به درآمد"},
 {id:"revenue",terms:["درآمد عملیاتی","درآمد شرکت","فروش شرکت"],fa:"درآمد؛ مبلغ حاصل از فروش کالا یا خدمات"},
 {id:"net_income",terms:["سود خالص","زیان خالص"],fa:"سود خالص؛ درآمد پس از کسر هزینه‌ها"},
 {id:"cash_flow",terms:["جریان نقدی","جریان وجوه نقد"],fa:"جریان نقدی؛ ورود و خروج پول نقد"},
 {id:"default",terms:["نکول","عدم بازپرداخت بدهی","قصور در پرداخت بدهی"],fa:"نکول؛ ناتوانی یا خودداری از پرداخت بدهی در موعد مقرر"}
];
function extractPersianMarketGlossary(text) {
 const found=[];
 for(const item of PERSIAN_MARKET_GLOSSARY) {
  const matches=containsAny(text,item.terms);
  if(matches.length) found.push({id:item.id,term:matches[0],meaning_fa:item.fa});
 }
 return found.slice(0,35);
}
function persianTerminologySelfTest() {
 const cases=[
  ["بانک مرکزی افزایش نرخ بهره را اعلام کرد.",["central_bank","interest_rate","rate_hike"]],
  ["تورم هسته و کاهش نرخ تورم در گزارش جدید مطرح شدند.",["core_inflation","disinflation"]],
  ["افزایش نقدشوندگی بازار می‌تواند نوسان‌پذیری را کم کند.",["liquidity","volatility"]],
  ["قیمت نفت برنت پس از افزایش ذخایر نفت کاهش یافت.",["crude_oil","oil_inventory"]],
  ["کسری بودجه و بدهی عمومی افزایش پیدا کردند.",["fiscal_deficit","public_debt"]],
  ["ریسک گریزی باعث افزایش تقاضا برای دارایی امن شد.",["risk_aversion","safe_haven"]],
  ["همبستگی دو دارایی به معنی رابطه علّی نیست.",["correlation","causation"]],
  ["رشد اقتصادی و نرخ بیکاری از شاخص‌های مهم هستند.",["economic_growth","employment"]]
 ];
 const results=cases.map(([input,expected])=>{
  const actual=extractPersianMarketGlossary(normalize(input)).map(x=>x.id);
  const missing=expected.filter(x=>!actual.includes(x));
  return {passed:missing.length===0,missing};
 });
 const passed=results.filter(x=>x.passed).length;
 return {passed,total:results.length,accuracy_pct:Number((passed/results.length*100).toFixed(1)),status:passed===results.length?"pass":"needs_revision",cases:results};
}



const ENGLISH_LANGUAGE_FOUNDATIONS = [
{id:"noun",terms:["noun","common noun","proper noun"],fa:"اسم؛ نام شخص، مکان، چیز یا مفهوم"},
{id:"pronoun",terms:["pronoun","personal pronoun","relative pronoun"],fa:"ضمیر؛ جانشین اسم"},
{id:"verb",terms:["verb","action verb","linking verb"],fa:"فعل؛ بیان‌کننده کنش یا حالت"},
{id:"adjective",terms:["adjective","descriptive adjective"],fa:"صفت؛ توصیف‌کننده اسم"},
{id:"adverb",terms:["adverb","adverb of manner","adverb of frequency"],fa:"قید؛ توضیح‌دهنده فعل، صفت یا قید دیگر"},
{id:"preposition",terms:["preposition","prepositional phrase"],fa:"حرف اضافه"},
{id:"conjunction",terms:["conjunction","coordinating conjunction","subordinating conjunction"],fa:"حرف ربط"},
{id:"determiner",terms:["determiner","article","definite article","indefinite article"],fa:"تعیین‌کننده و حرف تعریف"},
{id:"subject",terms:["subject","grammatical subject"],fa:"نهاد یا فاعل دستوری"},
{id:"object",terms:["object","direct object","indirect object"],fa:"مفعول"},
{id:"predicate",terms:["predicate"],fa:"گزاره"},
{id:"present_simple",terms:["present simple","simple present"],fa:"حال ساده"},
{id:"present_continuous",terms:["present continuous","present progressive"],fa:"حال استمراری"},
{id:"past_simple",terms:["past simple","simple past"],fa:"گذشته ساده"},
{id:"past_continuous",terms:["past continuous","past progressive"],fa:"گذشته استمراری"},
{id:"present_perfect",terms:["present perfect"],fa:"حال کامل"},
{id:"past_perfect",terms:["past perfect"],fa:"گذشته کامل"},
{id:"future_forms",terms:["future simple","going to future","future with will"],fa:"ساخت‌های آینده"},
{id:"passive_voice",terms:["passive voice","passive construction"],fa:"مجهول"},
{id:"active_voice",terms:["active voice","active construction"],fa:"معلوم"},
{id:"conditional_zero",terms:["zero conditional"],fa:"شرطی نوع صفر"},
{id:"conditional_first",terms:["first conditional"],fa:"شرطی نوع اول"},
{id:"conditional_second",terms:["second conditional"],fa:"شرطی نوع دوم"},
{id:"conditional_third",terms:["third conditional"],fa:"شرطی نوع سوم"},
{id:"reported_speech",terms:["reported speech","indirect speech"],fa:"گفتار غیرمستقیم"},
{id:"direct_speech",terms:["direct speech","quotation"],fa:"گفتار مستقیم"},
{id:"relative_clause",terms:["relative clause","relative pronoun clause"],fa:"بند موصولی"},
{id:"noun_clause",terms:["noun clause"],fa:"بند اسمی"},
{id:"adverbial_clause",terms:["adverbial clause"],fa:"بند قیدی"},
{id:"infinitive",terms:["infinitive","to infinitive"],fa:"مصدر با to"},
{id:"gerund",terms:["gerund"],fa:"اسم مصدر با ing"},
{id:"participle",terms:["participle","present participle","past participle"],fa:"اسم مفعول و وجه وصفی"},
{id:"phrasal_verb",terms:["phrasal verb"],fa:"فعل عبارتی"},
{id:"collocation",terms:["collocation","word combination"],fa:"هم‌آیی واژگانی"},
{id:"idiom",terms:["idiom","idiomatic expression"],fa:"اصطلاح کنایی"},
{id:"synonym",terms:["synonym","synonyms"],fa:"مترادف"},
{id:"antonym",terms:["antonym","antonyms"],fa:"متضاد"},
{id:"homonym",terms:["homonym","homophone","homograph"],fa:"هم‌نام و هم‌آوا"},
{id:"prefix",terms:["prefix","prefixation"],fa:"پیشوند"},
{id:"suffix",terms:["suffix","suffixation"],fa:"پسوند"},
{id:"compound_word",terms:["compound word","compound noun"],fa:"واژه مرکب"},
{id:"word_family",terms:["word family","derivation"],fa:"خانواده واژگانی و اشتقاق"},
{id:"plural",terms:["plural noun","plural form"],fa:"جمع"},
{id:"countable",terms:["countable noun"],fa:"اسم شمارش‌پذیر"},
{id:"uncountable",terms:["uncountable noun","mass noun"],fa:"اسم ناشمار"},
{id:"comparative",terms:["comparative adjective","comparative form"],fa:"صفت تفضیلی"},
{id:"superlative",terms:["superlative adjective","superlative form"],fa:"صفت عالی"},
{id:"punctuation",terms:["punctuation","comma","semicolon","colon","apostrophe"],fa:"نشانه‌گذاری"},
{id:"paragraph",terms:["paragraph","topic sentence","supporting sentence"],fa:"بند و جمله موضوع"},
{id:"cohesion",terms:["cohesion","cohesive device","linking expression"],fa:"انسجام متن"},
{id:"coherence",terms:["coherence","logical flow"],fa:"پیوستگی معنایی"},
{id:"register",terms:["formal register","informal register","language register"],fa:"سطح رسمی و غیررسمی زبان"},
{id:"tone",terms:["tone of a text","author's tone"],fa:"لحن متن"},
{id:"main_idea",terms:["main idea","central idea"],fa:"ایده اصلی"},
{id:"inference",terms:["inference","implied meaning"],fa:"استنباط و معنای ضمنی"},
{id:"paraphrase",terms:["paraphrase","paraphrasing"],fa:"بازنویسی با حفظ معنا"},
{id:"summary",terms:["summary","summarizing"],fa:"خلاصه‌نویسی"},
{id:"argument",terms:["argument","claim","counterargument"],fa:"استدلال، ادعا و پاسخ مخالف"},
{id:"evidence",terms:["evidence","supporting evidence"],fa:"شاهد و مدرک"},
{id:"metaphor",terms:["metaphor"],fa:"استعاره"},
{id:"simile",terms:["simile"],fa:"تشبیه"},
{id:"personification",terms:["personification"],fa:"جان‌بخشی"},
{id:"alliteration",terms:["alliteration"],fa:"واج‌آرایی"},
{id:"onomatopoeia",terms:["onomatopoeia"],fa:"نام‌آوا"},
{id:"irony",terms:["irony","verbal irony"],fa:"طنز و وارونگی معنایی"},
{id:"narrator",terms:["narrator","first-person narrator","third-person narrator"],fa:"راوی"},
{id:"point_of_view",terms:["point of view","first-person point of view","third-person point of view"],fa:"زاویه دید"},
{id:"setting",terms:["setting in a story"],fa:"زمان و مکان داستان"},
{id:"plot",terms:["plot","plot structure"],fa:"پیرنگ"},
{id:"characterization",terms:["characterization","character development"],fa:"شخصیت‌پردازی"},
{id:"genre",terms:["literary genre","genre"],fa:"گونه ادبی"}
];
const PERSIAN_LANGUAGE_FOUNDATIONS = [
{id:"noun",terms:["اسم","اسم عام","اسم خاص"],fa:"اسم؛ نام شخص، مکان، چیز یا مفهوم"},
{id:"pronoun",terms:["ضمیر","ضمیر شخصی","ضمیر اشاره"],fa:"ضمیر؛ جانشین اسم"},
{id:"verb",terms:["فعل","فعل لازم","فعل متعدی"],fa:"فعل؛ بیان‌کننده کنش یا حالت"},
{id:"adjective",terms:["صفت","صفت بیانی","صفت اشاره"],fa:"صفت؛ ویژگی اسم"},
{id:"adverb",terms:["قید","قید زمان","قید مکان","قید حالت"],fa:"قید؛ توضیح‌دهنده فعل یا جمله"},
{id:"preposition",terms:["حرف اضافه"],fa:"حرف اضافه"},
{id:"conjunction",terms:["حرف ربط","پیوند"],fa:"حرف ربط"},
{id:"interjection",terms:["شبه جمله","صوت"],fa:"شبه‌جمله و صوت"},
{id:"subject",terms:["نهاد","فاعل دستوری"],fa:"نهاد؛ بخش اصلی جمله"},
{id:"predicate",terms:["گزاره"],fa:"گزاره؛ خبری که درباره نهاد داده می‌شود"},
{id:"object",terms:["مفعول","مفعول مستقیم"],fa:"مفعول"},
{id:"complement",terms:["متمم"],fa:"متمم؛ تکمیل‌کننده معنای جمله"},
{id:"simple_sentence",terms:["جمله ساده","جمله یک جزئی"],fa:"جمله ساده"},
{id:"compound_sentence",terms:["جمله مرکب","جمله چندپایه"],fa:"جمله مرکب"},
{id:"independent_clause",terms:["پایه","جمله پایه"],fa:"جمله پایه"},
{id:"dependent_clause",terms:["پیرو","جمله پیرو"],fa:"جمله پیرو"},
{id:"verb_tense",terms:["زمان فعل","زمان گذشته","زمان حال","زمان آینده"],fa:"زمان فعل"},
{id:"past_continuous",terms:["گذشته استمراری"],fa:"گذشته استمراری"},
{id:"past_perfect",terms:["ماضی بعید","گذشته کامل"],fa:"ماضی بعید"},
{id:"present_perfect",terms:["ماضی نقلی"],fa:"ماضی نقلی"},
{id:"imperative",terms:["فعل امر","وجه امری"],fa:"فعل امر"},
{id:"negative_sentence",terms:["جمله منفی","فعل منفی"],fa:"جمله و فعل منفی"},
{id:"passive_voice",terms:["جمله مجهول","ساخت مجهول"],fa:"ساخت مجهول"},
{id:"active_voice",terms:["جمله معلوم","ساخت معلوم"],fa:"ساخت معلوم"},
{id:"prefix",terms:["پیشوند","وند پیشین"],fa:"پیشوند"},
{id:"suffix",terms:["پسوند","وند پسین"],fa:"پسوند"},
{id:"root",terms:["بن فعل","ریشه واژه"],fa:"بن و ریشه واژه"},
{id:"derivation",terms:["اشتقاق","واژه مشتق"],fa:"اشتقاق"},
{id:"compound_word",terms:["واژه مرکب","ترکیب واژگانی"],fa:"واژه مرکب"},
{id:"synonym",terms:["مترادف","هم معنی"],fa:"مترادف"},
{id:"antonym",terms:["متضاد","متقابل"],fa:"متضاد"},
{id:"homonym",terms:["هم آوا","هم نویسه","مشترک لفظی"],fa:"هم‌آوا و مشترک لفظی"},
{id:"idiom",terms:["کنایه","اصطلاح","اصطلاح عامیانه"],fa:"کنایه و اصطلاح"},
{id:"proverb",terms:["ضرب المثل","مثل"],fa:"ضرب‌المثل"},
{id:"punctuation",terms:["نشانه گذاری","ویرگول","نقطه ویرگول","دونقطه","گیومه"],fa:"نشانه‌گذاری"},
{id:"paragraph",terms:["بند نوشتاری","پاراگراف","جمله موضوع"],fa:"بند و جمله موضوع"},
{id:"cohesion",terms:["انسجام","واژه های پیوندی"],fa:"انسجام متن"},
{id:"coherence",terms:["پیوستگی معنایی","ارتباط منطقی"],fa:"پیوستگی معنایی"},
{id:"register",terms:["زبان رسمی","زبان محاوره","لحن رسمی"],fa:"سطح رسمی و محاوره‌ای"},
{id:"tone",terms:["لحن نویسنده","لحن متن"],fa:"لحن"},
{id:"main_idea",terms:["موضوع اصلی","ایده اصلی","مفهوم اصلی"],fa:"ایده اصلی"},
{id:"inference",terms:["استنباط","معنای ضمنی"],fa:"استنباط"},
{id:"paraphrase",terms:["بازنویسی","بازگویی"],fa:"بازنویسی"},
{id:"summary",terms:["خلاصه نویسی","خلاصه متن"],fa:"خلاصه‌نویسی"},
{id:"argument",terms:["استدلال","ادعا","پاداستدلال"],fa:"استدلال و ادعا"},
{id:"evidence",terms:["شاهد","مدرک","دلیل متنی"],fa:"شاهد و مدرک"},
{id:"metaphor",terms:["استعاره"],fa:"استعاره"},
{id:"simile",terms:["تشبیه"],fa:"تشبیه"},
{id:"personification",terms:["تشخیص","جان بخشی"],fa:"تشخیص یا جان‌بخشی"},
{id:"alliteration",terms:["واج آرایی"],fa:"واج‌آرایی"},
{id:"onomatopoeia",terms:["نام آوا","واژه آوایی"],fa:"نام‌آوا"},
{id:"irony",terms:["طنز","طعنه","وارونه نمایی"],fa:"طنز و وارونگی معنایی"},
{id:"narrator",terms:["راوی","راوی اول شخص","راوی سوم شخص"],fa:"راوی"},
{id:"point_of_view",terms:["زاویه دید","دیدگاه راوی"],fa:"زاویه دید"},
{id:"setting",terms:["فضاسازی","زمان و مکان داستان"],fa:"زمان و مکان داستان"},
{id:"plot",terms:["پیرنگ","طرح داستان"],fa:"پیرنگ"},
{id:"characterization",terms:["شخصیت پردازی","پرورش شخصیت"],fa:"شخصیت‌پردازی"},
{id:"genre",terms:["گونه ادبی","ژانر ادبی"],fa:"گونه ادبی"}
];

const BILINGUAL_RELATION_LEXICON = Object.freeze([{"id":"clarify","fa":"شفاف‌سازی","en":"clarification","category":"formal","antonym":null},{"id":"specify","fa":"مشخص‌کردن","en":"specification","category":"formal","antonym":null},{"id":"define","fa":"تعریف‌کردن","en":"definition","category":"formal","antonym":null},{"id":"describe","fa":"توصیف‌کردن","en":"description","category":"formal","antonym":null},{"id":"explain","fa":"تبیین‌کردن","en":"explanation","category":"formal","antonym":null},{"id":"interpret","fa":"تفسیرکردن","en":"interpretation","category":"formal","antonym":null},{"id":"distinguish","fa":"تمایزقائل‌شدن","en":"distinction","category":"formal","antonym":null},{"id":"compare","fa":"مقایسه‌کردن","en":"comparison","category":"formal","antonym":null},{"id":"contrast","fa":"مقابله‌کردن","en":"contrast","category":"formal","antonym":null},{"id":"summarize","fa":"خلاصه‌کردن","en":"summary","category":"formal","antonym":null},{"id":"evaluate","fa":"ارزیابی‌کردن","en":"evaluation","category":"analysis","antonym":null},{"id":"assess","fa":"سنجیدن","en":"assessment","category":"analysis","antonym":null},{"id":"estimate","fa":"برآوردکردن","en":"estimate","category":"analysis","antonym":null},{"id":"calculate","fa":"محاسبه‌کردن","en":"calculation","category":"analysis","antonym":null},{"id":"measure","fa":"اندازه‌گیری‌کردن","en":"measurement","category":"analysis","antonym":null},{"id":"observe","fa":"مشاهده‌کردن","en":"observation","category":"analysis","antonym":null},{"id":"identify","fa":"شناسایی‌کردن","en":"identification","category":"analysis","antonym":null},{"id":"classify","fa":"طبقه‌بندی‌کردن","en":"classification","category":"analysis","antonym":null},{"id":"categorize","fa":"دسته‌بندی‌کردن","en":"category","category":"analysis","antonym":null},{"id":"prioritize","fa":"اولویت‌بندی‌کردن","en":"priority","category":"analysis","antonym":null},{"id":"assumption","fa":"فرض","en":"assumption","category":"reasoning","antonym":null},{"id":"hypothesis","fa":"فرضیه","en":"hypothesis","category":"reasoning","antonym":null},{"id":"evidence","fa":"شواهد","en":"evidence","category":"reasoning","antonym":null},{"id":"proof","fa":"اثبات","en":"proof","category":"reasoning","antonym":null},{"id":"claim","fa":"ادعا","en":"claim","category":"reasoning","antonym":null},{"id":"argument","fa":"استدلال","en":"argument","category":"reasoning","antonym":null},{"id":"reasoning","fa":"استدلال‌ورزی","en":"reasoning","category":"reasoning","antonym":null},{"id":"inference","fa":"استنتاج","en":"inference","category":"reasoning","antonym":null},{"id":"conclusion","fa":"نتیجه‌گیری","en":"conclusion","category":"reasoning","antonym":null},{"id":"implication","fa":"پیامد ضمنی","en":"implication","category":"reasoning","antonym":null},{"id":"relevance","fa":"ارتباط موضوعی","en":"relevance","category":"reasoning","antonym":null},{"id":"accuracy","fa":"دقت","en":"accuracy","category":"quality","antonym":"error"},{"id":"precision","fa":"ظرافت و دقت اندازه‌گیری","en":"precision","category":"quality","antonym":null},{"id":"reliability","fa":"قابلیت اعتماد","en":"reliability","category":"quality","antonym":null},{"id":"validity","fa":"اعتبار","en":"validity","category":"quality","antonym":null},{"id":"consistency","fa":"سازگاری","en":"consistency","category":"quality","antonym":null},{"id":"uncertainty","fa":"عدم‌قطعیت","en":"uncertainty","category":"quality","antonym":null},{"id":"ambiguity","fa":"ابهام","en":"ambiguity","category":"quality","antonym":null},{"id":"bias","fa":"سوگیری","en":"bias","category":"quality","antonym":null},{"id":"limitation","fa":"محدودیت","en":"limitation","category":"quality","antonym":null},{"id":"error","fa":"خطا","en":"error","category":"quality","antonym":null},{"id":"increase","fa":"افزایش","en":"increase","category":"change","antonym":"decrease"},{"id":"decrease","fa":"کاهش","en":"decrease","category":"change","antonym":"increase"},{"id":"expand","fa":"گسترش‌دادن","en":"expansion","category":"change","antonym":"contract"},{"id":"contract","fa":"منقبض‌کردن","en":"contraction","category":"change","antonym":"expand"},{"id":"accelerate","fa":"شتاب‌گرفتن","en":"acceleration","category":"change","antonym":"decelerate"},{"id":"decelerate","fa":"کندشدن","en":"deceleration","category":"change","antonym":"accelerate"},{"id":"improve","fa":"بهبوددادن","en":"improvement","category":"change","antonym":"deteriorate"},{"id":"deteriorate","fa":"وخیم‌شدن","en":"deterioration","category":"change","antonym":"improve"},{"id":"strengthen","fa":"تقویت‌کردن","en":"strengthening","category":"change","antonym":"weaken"},{"id":"weaken","fa":"تضعیف‌کردن","en":"weakening","category":"change","antonym":"strengthen"},{"id":"enable","fa":"امکان‌پذیرکردن","en":"enablement","category":"causality","antonym":null},{"id":"prevent","fa":"جلوگیری‌کردن","en":"prevention","category":"causality","antonym":null},{"id":"contribute","fa":"مشارکت‌داشتن","en":"contribution","category":"causality","antonym":null},{"id":"trigger","fa":"موجب‌شدن","en":"trigger","category":"causality","antonym":null},{"id":"generate","fa":"ایجادکردن","en":"generation","category":"causality","antonym":null},{"id":"derive","fa":"استخراج‌کردن","en":"derivation","category":"causality","antonym":null},{"id":"depend","fa":"وابسته‌بودن","en":"dependence","category":"causality","antonym":null},{"id":"require","fa":"نیازداشتن","en":"requirement","category":"causality","antonym":null},{"id":"indicate","fa":"نشان‌دادن","en":"indication","category":"evidence","antonym":null},{"id":"suggest","fa":"حاکی‌بودن","en":"suggestion","category":"evidence","antonym":null},{"id":"confirm","fa":"تأییدکردن","en":"confirmation","category":"evidence","antonym":null},{"id":"verify","fa":"راستی‌آزمایی‌کردن","en":"verification","category":"evidence","antonym":null},{"id":"refute","fa":"ردکردن","en":"refutation","category":"evidence","antonym":null},{"id":"dispute","fa":"موردتردیدقراردادن","en":"dispute","category":"evidence","antonym":null},{"id":"acknowledge","fa":"اذعان‌کردن","en":"acknowledgment","category":"evidence","antonym":null},{"id":"allege","fa":"مدعی‌شدن","en":"allegation","category":"evidence","antonym":null},{"id":"disclose","fa":"افشاکردن","en":"disclosure","category":"communication","antonym":null},{"id":"announce","fa":"اعلام‌کردن","en":"announcement","category":"communication","antonym":null,"fa_aliases":["اعلام کرد","اعلام کردن","اعلامیه","بیان کرد"],"en_aliases":["announced","announces","announcement","declare","declared"]},{"id":"report","fa":"گزارش‌دادن","en":"report","category":"communication","antonym":null},{"id":"publish","fa":"منتشرکردن","en":"publication","category":"communication","antonym":null},{"id":"propose","fa":"پیشنهادکردن","en":"proposal","category":"communication","antonym":null},{"id":"recommend","fa":"توصیه‌کردن","en":"recommendation","category":"communication","antonym":null},{"id":"negotiate","fa":"مذاکره‌کردن","en":"negotiation","category":"communication","antonym":null},{"id":"approve","fa":"تصویب‌کردن","en":"approval","category":"governance","antonym":null},{"id":"reject","fa":"ردکردن","en":"rejection","category":"governance","antonym":null},{"id":"authorize","fa":"مجوزدادن","en":"authorization","category":"governance","antonym":null},{"id":"regulate","fa":"تنظیم‌گری‌کردن","en":"regulation","category":"governance","antonym":null},{"id":"comply","fa":"تمکین‌کردن","en":"compliance","category":"governance","antonym":null},{"id":"violate","fa":"نقض‌کردن","en":"violation","category":"governance","antonym":null},{"id":"obligation","fa":"تعهد","en":"obligation","category":"governance","antonym":null},{"id":"provision","fa":"ماده یا حکم","en":"provision","category":"governance","antonym":null},{"id":"framework","fa":"چارچوب","en":"framework","category":"governance","antonym":null},{"id":"implementation","fa":"اجرا","en":"implementation","category":"governance","antonym":null},{"id":"policy","fa":"سیاست‌گذاری","en":"policy","category":"governance","antonym":null},{"id":"strategy","fa":"راهبرد","en":"strategy","category":"governance","antonym":null},{"id":"objective","fa":"هدف","en":"objective","category":"planning","antonym":"subjective"},{"id":"outcome","fa":"برونداد نهایی","en":"outcome","category":"planning","antonym":null},{"id":"impact","fa":"اثر","en":"impact","category":"planning","antonym":null},{"id":"consequence","fa":"پیامد","en":"consequence","category":"planning","antonym":null},{"id":"opportunity","fa":"فرصت","en":"opportunity","category":"planning","antonym":null},{"id":"constraint","fa":"قید و محدودیت","en":"constraint","category":"planning","antonym":null},{"id":"resource","fa":"منبع","en":"resource","category":"planning","antonym":null},{"id":"allocation","fa":"تخصیص","en":"allocation","category":"planning","antonym":null},{"id":"efficiency","fa":"کارایی","en":"efficiency","category":"economics","antonym":null},{"id":"productivity","fa":"بهره‌وری","en":"productivity","category":"economics","antonym":null},{"id":"supply","fa":"عرضه","en":"supply","category":"economics","antonym":"demand"},{"id":"demand","fa":"تقاضا","en":"demand","category":"economics","antonym":"supply"},{"id":"surplus","fa":"مازاد","en":"surplus","category":"economics","antonym":"shortage"},{"id":"shortage","fa":"کمبود","en":"shortage","category":"economics","antonym":"surplus"},{"id":"revenue","fa":"درآمد","en":"revenue","category":"economics","antonym":null},{"id":"expenditure","fa":"مخارج","en":"expenditure","category":"economics","antonym":null},{"id":"profit","fa":"سود","en":"profit","category":"economics","antonym":"loss"},{"id":"loss","fa":"زیان","en":"loss","category":"economics","antonym":"profit"},{"id":"asset","fa":"دارایی","en":"asset","category":"finance","antonym":"liability"},{"id":"liability","fa":"بدهی","en":"liability","category":"finance","antonym":"asset"},{"id":"equity","fa":"حقوق صاحبان سهام","en":"equity","category":"finance","antonym":null},{"id":"capital","fa":"سرمایه","en":"capital","category":"finance","antonym":null},{"id":"investment","fa":"سرمایه‌گذاری","en":"investment","category":"finance","antonym":null},{"id":"dividend","fa":"سود تقسیمی","en":"dividend","category":"finance","antonym":null},{"id":"debt","fa":"بدهی","en":"debt","category":"finance","antonym":null},{"id":"credit","fa":"اعتبار","en":"credit","category":"finance","antonym":null},{"id":"default","fa":"نکول","en":"default","category":"finance","antonym":null},{"id":"solvency","fa":"توانگری مالی","en":"solvency","category":"finance","antonym":null},{"id":"liquidity","fa":"نقدشوندگی","en":"liquidity","category":"finance","antonym":null},{"id":"volatility","fa":"نوسان‌پذیری","en":"volatility","category":"finance","antonym":null},{"id":"appreciation","fa":"افزایش ارزش","en":"appreciation","category":"markets","antonym":null},{"id":"depreciation","fa":"کاهش ارزش","en":"depreciation","category":"markets","antonym":null},{"id":"stability","fa":"ثبات","en":"stability","category":"markets","antonym":null},{"id":"instability","fa":"بی‌ثباتی","en":"instability","category":"markets","antonym":null},{"id":"scarcity","fa":"کمیابی","en":"scarcity","category":"economics","antonym":null},{"id":"abundance","fa":"فراوانی","en":"abundance","category":"economics","antonym":null},{"id":"incentive","fa":"مشوق","en":"incentive","category":"economics","antonym":null},{"id":"subsidy","fa":"یارانه","en":"subsidy","category":"economics","antonym":null},{"id":"taxation","fa":"مالیات‌ستانی","en":"taxation","category":"economics","antonym":null},{"id":"tariff","fa":"تعرفه","en":"tariff","category":"economics","antonym":null},{"id":"sanction","fa":"تحریم","en":"sanction","category":"policy","antonym":null},{"id":"exemption","fa":"معافیت","en":"exemption","category":"policy","antonym":null},{"id":"threshold","fa":"آستانه","en":"threshold","category":"measurement","antonym":null},{"id":"benchmark","fa":"معیار مرجع","en":"benchmark","category":"measurement","antonym":null},{"id":"baseline","fa":"خط مبنا","en":"baseline","category":"measurement","antonym":null},{"id":"forecast","fa":"پیش‌بینی","en":"forecast","category":"analysis","antonym":null},{"id":"projection","fa":"برآورد آینده‌نگر","en":"projection","category":"analysis","antonym":null},{"id":"scenario","fa":"سناریو","en":"scenario","category":"analysis","antonym":null},{"id":"trend","fa":"روند","en":"trend","category":"markets","antonym":null},{"id":"pattern","fa":"الگو","en":"pattern","category":"analysis","antonym":null},{"id":"fluctuation","fa":"نوسان","en":"fluctuation","category":"markets","antonym":null},{"id":"correlation","fa":"همبستگی","en":"correlation","category":"statistics","antonym":null},{"id":"causation","fa":"رابطه علّی","en":"causation","category":"statistics","antonym":null},{"id":"probability","fa":"احتمال","en":"probability","category":"statistics","antonym":null},{"id":"frequency","fa":"بسامد","en":"frequency","category":"statistics","antonym":null},{"id":"distribution","fa":"توزیع","en":"distribution","category":"statistics","antonym":null},{"id":"sample","fa":"نمونه آماری","en":"sample","category":"statistics","antonym":null},{"id":"population","fa":"جامعه آماری","en":"population","category":"statistics","antonym":null},{"id":"variance","fa":"واریانس","en":"variance","category":"statistics","antonym":null},{"id":"deviation","fa":"انحراف","en":"deviation","category":"statistics","antonym":null},{"id":"median","fa":"میانه","en":"median","category":"statistics","antonym":null},{"id":"average","fa":"میانگین","en":"average","category":"statistics","antonym":null},{"id":"proportion","fa":"نسبت","en":"proportion","category":"statistics","antonym":null},{"id":"ratio","fa":"نسبت","en":"ratio","category":"statistics","antonym":null},{"id":"index","fa":"شاخص","en":"index","category":"statistics","antonym":null},{"id":"indicator","fa":"نماگر","en":"indicator","category":"statistics","antonym":null},{"id":"parameter","fa":"پارامتر","en":"parameter","category":"statistics","antonym":null},{"id":"variable","fa":"متغیر","en":"variable","category":"statistics","antonym":null},{"id":"criterion","fa":"معیار","en":"criterion","category":"evaluation","antonym":null},{"id":"standard","fa":"استاندارد","en":"standard","category":"evaluation","antonym":null},{"id":"requirement","fa":"الزام","en":"requirement","category":"governance","antonym":null},{"id":"procedure","fa":"رویه","en":"procedure","category":"governance","antonym":null},{"id":"process","fa":"فرایند","en":"process","category":"governance","antonym":null},{"id":"sequence","fa":"توالی","en":"sequence","category":"reasoning","antonym":null},{"id":"precede","fa":"مقدم‌بودن","en":"precedence","category":"time","antonym":null},{"id":"succeed","fa":"درپی‌آمدن","en":"succession","category":"time","antonym":null},{"id":"simultaneous","fa":"هم‌زمان","en":"simultaneity","category":"time","antonym":null},{"id":"temporary","fa":"موقت","en":"temporary","category":"time","antonym":"permanent"},{"id":"permanent","fa":"دائمی","en":"permanent","category":"time","antonym":"temporary"},{"id":"gradual","fa":"تدریجی","en":"gradual","category":"change","antonym":null},{"id":"immediate","fa":"فوری","en":"immediate","category":"time","antonym":null},{"id":"eventual","fa":"نهایی و در نهایت رخ‌داده","en":"eventual","category":"time","antonym":null},{"id":"explicit","fa":"صریح","en":"explicit","category":"communication","antonym":"implicit"},{"id":"implicit","fa":"ضمنی","en":"implicit","category":"communication","antonym":"explicit"},{"id":"formal","fa":"رسمی","en":"formal","category":"register","antonym":"informal"},{"id":"informal","fa":"غیررسمی","en":"informal","category":"register","antonym":"formal"},{"id":"objective","fa":"عینی و بی‌طرفانه","en":"objective","category":"register","antonym":"subjective"},{"id":"subjective","fa":"ذهنی","en":"subjective","category":"register","antonym":"objective"},{"id":"literal","fa":"تحت‌اللفظی","en":"literal","category":"language","antonym":null},{"id":"figurative","fa":"مجازی","en":"figurative","category":"language","antonym":null},{"id":"conventional","fa":"متعارف","en":"conventional","category":"language","antonym":null},{"id":"exceptional","fa":"استثنایی","en":"exceptional","category":"language","antonym":null},{"id":"comprehensive","fa":"جامع","en":"comprehensive","category":"quality","antonym":null},{"id":"specific","fa":"مشخص","en":"specific","category":"quality","antonym":null},{"id":"general","fa":"کلی","en":"general","category":"quality","antonym":null},{"id":"sufficient","fa":"کافی","en":"sufficiency","category":"quality","antonym":"insufficient"},{"id":"insufficient","fa":"ناکافی","en":"insufficiency","category":"quality","antonym":"sufficient"},{"id":"relevant","fa":"مرتبط","en":"relevance","category":"quality","antonym":"irrelevant"},{"id":"irrelevant","fa":"نامرتبط","en":"irrelevance","category":"quality","antonym":"relevant"},{"id":"plausible","fa":"باورپذیر","en":"plausibility","category":"reasoning","antonym":null},{"id":"unlikely","fa":"بعید","en":"unlikelihood","category":"reasoning","antonym":null},{"id":"certain","fa":"قطعی","en":"certainty","category":"reasoning","antonym":null},{"id":"tentative","fa":"موقت و غیرقطعی","en":"tentativeness","category":"reasoning","antonym":null},{"id":"consistent","fa":"سازگار","en":"consistency","category":"quality","antonym":"contradictory"},{"id":"contradictory","fa":"متناقض","en":"contradiction","category":"quality","antonym":"consistent"},{"id":"compatible","fa":"سازگار و قابل جمع","en":"compatibility","category":"quality","antonym":"incompatible"},{"id":"incompatible","fa":"ناسازگار","en":"incompatibility","category":"quality","antonym":"compatible"},{"id":"transparent","fa":"شفاف","en":"transparency","category":"governance","antonym":"opaque"},{"id":"accountable","fa":"پاسخ‌گو","en":"accountability","category":"governance","antonym":null},{"id":"sustainable","fa":"پایدار","en":"sustainability","category":"economics","antonym":null},{"id":"resilient","fa":"تاب‌آور","en":"resilience","category":"economics","antonym":null},{"id":"vulnerable","fa":"آسیب‌پذیر","en":"vulnerability","category":"economics","antonym":null},{"id":"exposure","fa":"میزان درمعرض‌بودن","en":"exposure","category":"risk","antonym":null},{"id":"mitigation","fa":"کاهش اثرات","en":"mitigation","category":"risk","antonym":null},{"id":"hedging","fa":"پوشش ریسک","en":"hedging","category":"risk","antonym":null},{"id":"contingency","fa":"وضعیت احتمالی","en":"contingency","category":"risk","antonym":null},{"id":"sensitivity","fa":"حساسیت","en":"sensitivity","category":"risk","antonym":null},{"id":"severity","fa":"شدت","en":"severity","category":"risk","antonym":null},{"id":"likelihood","fa":"میزان احتمال","en":"likelihood","category":"risk","antonym":null},{"id":"materiality","fa":"اهمیت بااهمیت‌بودن","en":"materiality","category":"risk","antonym":null},{"id":"discrepancy","fa":"ناهمخوانی","en":"discrepancy","category":"quality","antonym":null},{"id":"consensus","fa":"اجماع","en":"consensus","category":"communication","antonym":null},{"id":"dissent","fa":"مخالفت رسمی","en":"dissent","category":"communication","antonym":null},{"id":"compromise","fa":"مصالحه","en":"compromise","category":"communication","antonym":null},{"id":"consent","fa":"رضایت","en":"consent","category":"governance","antonym":null},{"id":"participation","fa":"مشارکت","en":"participation","category":"governance","antonym":null},{"id":"representation","fa":"نمایندگی","en":"representation","category":"governance","antonym":null},{"id":"account","fa":"حساب","en":"account","category":"finance","antonym":null},{"id":"transaction","fa":"تراکنش","en":"transaction","category":"finance","antonym":null},{"id":"settlement","fa":"تسویه","en":"settlement","category":"finance","antonym":null},{"id":"collateral","fa":"وثیقه","en":"collateral","category":"finance","antonym":null},{"id":"mortgage","fa":"رهن","en":"mortgage","category":"finance","antonym":null},{"id":"installment","fa":"قسط","en":"installment","category":"finance","antonym":null},{"id":"principal","fa":"اصل سرمایه","en":"principal","category":"finance","antonym":null},{"id":"interest","fa":"بهره","en":"interest","category":"finance","antonym":null},{"id":"maturity","fa":"سررسید","en":"maturity","category":"finance","antonym":null},{"id":"portfolio","fa":"سبد دارایی","en":"portfolio","category":"finance","antonym":null},{"id":"diversification","fa":"تنوع‌بخشی","en":"diversification","category":"finance","antonym":null},{"id":"speculation","fa":"سفته‌بازی","en":"speculation","category":"markets","antonym":null},{"id":"arbitrage","fa":"آربیتراژ","en":"arbitrage","category":"markets","antonym":null},{"id":"commodity","fa":"کالای پایه","en":"commodity","category":"markets","antonym":null},{"id":"derivative","fa":"مشتقه","en":"derivative","category":"markets","antonym":null},{"id":"futures","fa":"قرارداد آتی","en":"futures","category":"markets","antonym":null},{"id":"option","fa":"اختیار معامله","en":"option","category":"markets","antonym":null},{"id":"exchange","fa":"مبادله","en":"exchange","category":"markets","antonym":null},{"id":"quotation","fa":"مظنه","en":"quotation","category":"markets","antonym":null},{"id":"spread","fa":"فاصله قیمتی","en":"spread","category":"markets","antonym":null},{"id":"margin","fa":"وجه تضمین","en":"margin","category":"markets","antonym":null},{"id":"brokerage","fa":"کارگزاری","en":"brokerage","category":"markets","antonym":null},{"id":"custody","fa":"امانت‌داری دارایی","en":"custody","category":"markets","antonym":null},{"id":"depository","fa":"سپرده‌گذاری","en":"depository","category":"markets","antonym":null},{"id":"clearing","fa":"پایاپای","en":"clearing","category":"markets","antonym":null},{"id":"settlement_date","fa":"تاریخ تسویه","en":"settlement date","category":"markets","antonym":null},{"id":"monetary","fa":"پولی","en":"monetary","category":"economics","antonym":null},{"id":"fiscal","fa":"مالی و بودجه‌ای","en":"fiscal","category":"economics","antonym":null},{"id":"structural","fa":"ساختاری","en":"structural","category":"economics","antonym":null},{"id":"cyclical","fa":"چرخه‌ای","en":"cyclical","category":"economics","antonym":null},{"id":"external","fa":"برون‌زا","en":"external","category":"analysis","antonym":"internal"},{"id":"internal","fa":"درون‌زا","en":"internal","category":"analysis","antonym":"external"},{"id":"nominal","fa":"اسمی","en":"nominal","category":"economics","antonym":"real"},{"id":"real","fa":"واقعی","en":"real","category":"economics","antonym":null},{"id":"gross","fa":"ناخالص","en":"gross","category":"economics","antonym":"net"},{"id":"net","fa":"خالص","en":"net","category":"economics","antonym":"gross"},{"id":"domestic","fa":"داخلی","en":"domestic","category":"economics","antonym":null},{"id":"foreign","fa":"خارجی","en":"foreign","category":"economics","antonym":null},{"id":"aggregate","fa":"تجمیعی","en":"aggregate","category":"economics","antonym":null},{"id":"marginal","fa":"نهایی","en":"marginal","category":"economics","antonym":null},{"id":"elasticity","fa":"کشش","en":"elasticity","category":"economics","antonym":null},{"id":"equilibrium","fa":"تعادل","en":"equilibrium","category":"economics","antonym":null},{"id":"recession","fa":"رکود","en":"recession","category":"economics","antonym":"recovery"},{"id":"recovery","fa":"بهبود اقتصادی","en":"recovery","category":"economics","antonym":"recession"},{"id":"contraction","fa":"انقباض","en":"contraction","category":"economics","antonym":null},{"id":"expansion","fa":"رونق و گسترش","en":"expansion","category":"economics","antonym":null},{"id":"employment","fa":"اشتغال","en":"employment","category":"economics","antonym":"unemployment"},{"id":"unemployment","fa":"بیکاری","en":"unemployment","category":"economics","antonym":"employment"},{"id":"wage","fa":"دستمزد","en":"wage","category":"economics","antonym":null},{"id":"income","fa":"درآمد","en":"income","category":"economics","antonym":null},{"id":"consumption","fa":"مصرف","en":"consumption","category":"economics","antonym":null},{"id":"saving","fa":"پس‌انداز","en":"saving","category":"economics","antonym":null},{"id":"production","fa":"تولید","en":"production","category":"economics","antonym":null},{"id":"output","fa":"محصول و ستانده","en":"output","category":"economics","antonym":null},{"id":"capacity","fa":"ظرفیت","en":"capacity","category":"economics","antonym":null},{"id":"inventory","fa":"موجودی انبار","en":"inventory","category":"economics","antonym":null},{"id":"logistics","fa":"لجستیک","en":"logistics","category":"economics","antonym":null},{"id":"distribution_channel","fa":"کانال توزیع","en":"distribution channel","category":"economics","antonym":null},{"id":"procurement","fa":"تدارکات و خرید","en":"procurement","category":"economics","antonym":null},{"id":"tender","fa":"مناقصه","en":"tender","category":"governance","antonym":null},{"id":"contract","fa":"قرارداد","en":"contract","category":"governance","antonym":"expand"},{"id":"clause","fa":"بند قرارداد","en":"clause","category":"governance","antonym":null},{"id":"jurisdiction","fa":"صلاحیت قضایی","en":"jurisdiction","category":"governance","antonym":null},{"id":"legislation","fa":"قانون‌گذاری","en":"legislation","category":"governance","antonym":null},{"id":"amendment","fa":"اصلاحیه","en":"amendment","category":"governance","antonym":null},{"id":"enforcement","fa":"اجرای قانون","en":"enforcement","category":"governance","antonym":null},{"id":"compliance_check","fa":"بررسی انطباق","en":"compliance check","category":"governance","antonym":null},{"id":"audit","fa":"حسابرسی","en":"audit","category":"finance","antonym":null},{"id":"disclosure","fa":"افشای اطلاعات","en":"disclosure","category":"finance","antonym":null},{"id":"statement","fa":"صورت‌حساب یا بیانیه","en":"statement","category":"finance","antonym":null},{"id":"balance_sheet","fa":"ترازنامه","en":"balance sheet","category":"finance","antonym":null},{"id":"cash_flow","fa":"جریان نقدی","en":"cash flow","category":"finance","antonym":null},{"id":"receivable","fa":"حساب دریافتنی","en":"receivable","category":"finance","antonym":null},{"id":"payable","fa":"حساب پرداختنی","en":"payable","category":"finance","antonym":null},{"id":"depreciation_expense","fa":"هزینه استهلاک","en":"depreciation expense","category":"finance","antonym":null},{"id":"amortization","fa":"استهلاک دارایی نامشهود","en":"amortization","category":"finance","antonym":null},{"id":"provision_accounting","fa":"ذخیره حسابداری","en":"accounting provision","category":"finance","antonym":null},{"id":"impairment","fa":"کاهش ارزش دفتری","en":"impairment","category":"finance","antonym":null},{"id":"retained_earnings","fa":"سود انباشته","en":"retained earnings","category":"finance","antonym":null},{"id":"working_capital","fa":"سرمایه در گردش","en":"working capital","category":"finance","antonym":null},{"id":"operating_cost","fa":"هزینه عملیاتی","en":"operating cost","category":"finance","antonym":null},{"id":"fixed_cost","fa":"هزینه ثابت","en":"fixed cost","category":"finance","antonym":null},{"id":"variable_cost","fa":"هزینه متغیر","en":"variable cost","category":"finance","antonym":null},{"id":"break_even","fa":"نقطه سربه‌سر","en":"break-even point","category":"finance","antonym":null},{"id":"markup","fa":"حاشیه اضافه‌شده بر بهای تمام‌شده","en":"markup","category":"finance","antonym":null},{"id":"discount","fa":"تخفیف","en":"discount","category":"finance","antonym":null},{"id":"premium","fa":"صرف یا اضافه‌بها","en":"premium","category":"finance","antonym":null},{"id":"benchmark_rate","fa":"نرخ معیار","en":"benchmark rate","category":"finance","antonym":null},{"id":"policy_rate","fa":"نرخ سیاستی","en":"policy rate","category":"finance","antonym":null},{"id":"exchange_rate","fa":"نرخ ارز","en":"exchange rate","category":"finance","antonym":null},{"id":"devaluation","fa":"کاهش رسمی ارزش پول","en":"devaluation","category":"markets","antonym":null},{"id":"revaluation","fa":"افزایش رسمی ارزش پول","en":"revaluation","category":"markets","antonym":null},{"id":"currency_peg","fa":"میخکوب‌کردن نرخ ارز","en":"currency peg","category":"markets","antonym":null},{"id":"floating_rate","fa":"نرخ شناور","en":"floating rate","category":"markets","antonym":null},{"id":"capital_control","fa":"کنترل سرمایه","en":"capital control","category":"policy","antonym":null},{"id":"capital_outflow","fa":"خروج سرمایه","en":"capital outflow","category":"markets","antonym":null},{"id":"capital_inflow","fa":"ورود سرمایه","en":"capital inflow","category":"markets","antonym":null},{"id":"foreign_reserve","fa":"ذخیره ارزی","en":"foreign reserve","category":"markets","antonym":null},{"id":"current_account","fa":"حساب جاری","en":"current account","category":"economics","antonym":null},{"id":"trade_balance","fa":"تراز تجاری","en":"trade balance","category":"economics","antonym":null},{"id":"trade_deficit","fa":"کسری تجاری","en":"trade deficit","category":"economics","antonym":null},{"id":"trade_surplus","fa":"مازاد تجاری","en":"trade surplus","category":"economics","antonym":null},{"id":"fiscal_deficit","fa":"کسری بودجه","en":"fiscal deficit","category":"economics","antonym":null},{"id":"public_debt","fa":"بدهی عمومی","en":"public debt","category":"economics","antonym":null},{"id":"debt_ceiling","fa":"سقف بدهی","en":"debt ceiling","category":"economics","antonym":null},{"id":"tax_base","fa":"پایه مالیاتی","en":"tax base","category":"economics","antonym":null},{"id":"tax_rate","fa":"نرخ مالیات","en":"tax rate","category":"economics","antonym":null},{"id":"inflation_expectation","fa":"انتظارات تورمی","en":"inflation expectations","category":"economics","antonym":null},{"id":"purchasing_power","fa":"قدرت خرید","en":"purchasing power","category":"economics","antonym":null},{"id":"price_level","fa":"سطح قیمت‌ها","en":"price level","category":"economics","antonym":null},{"id":"cost_of_living","fa":"هزینه زندگی","en":"cost of living","category":"economics","antonym":null},{"id":"consumer_confidence","fa":"اعتماد مصرف‌کننده","en":"consumer confidence","category":"economics","antonym":null},{"id":"business_confidence","fa":"اعتماد کسب‌وکار","en":"business confidence","category":"economics","antonym":null},{"id":"economic_indicator","fa":"شاخص اقتصادی","en":"economic indicator","category":"economics","antonym":null},{"id":"leading_indicator","fa":"شاخص پیش‌نگر","en":"leading indicator","category":"economics","antonym":null},{"id":"lagging_indicator","fa":"شاخص پس‌نگر","en":"lagging indicator","category":"economics","antonym":null},{"id":"coincident_indicator","fa":"شاخص هم‌زمان","en":"coincident indicator","category":"economics","antonym":null},{"id":"policy_transmission","fa":"سازوکار انتقال سیاست","en":"policy transmission","category":"economics","antonym":null},{"id":"monetary_base","fa":"پایه پولی","en":"monetary base","category":"economics","antonym":null},{"id":"money_supply","fa":"حجم پول","en":"money supply","category":"economics","antonym":null},{"id":"credit_growth","fa":"رشد اعتبارات","en":"credit growth","category":"economics","antonym":null},{"id":"bank_reserves","fa":"ذخایر بانکی","en":"bank reserves","category":"economics","antonym":null},{"id":"reserve_requirement","fa":"نسبت سپرده قانونی","en":"reserve requirement","category":"economics","antonym":null},{"id":"open_market_operation","fa":"عملیات بازار باز","en":"open-market operation","category":"economics","antonym":null},{"id":"lender_of_last_resort","fa":"وام‌دهنده نهایی","en":"lender of last resort","category":"economics","antonym":null},{"id":"bank_run","fa":"هجوم بانکی","en":"bank run","category":"economics","antonym":null},{"id":"systemic_risk","fa":"ریسک سیستمی","en":"systemic risk","category":"risk","antonym":null},{"id":"counterparty_risk","fa":"ریسک طرف مقابل","en":"counterparty risk","category":"risk","antonym":null},{"id":"operational_risk","fa":"ریسک عملیاتی","en":"operational risk","category":"risk","antonym":null},{"id":"market_risk","fa":"ریسک بازار","en":"market risk","category":"risk","antonym":null},{"id":"credit_risk","fa":"ریسک اعتباری","en":"credit risk","category":"risk","antonym":null},{"id":"liquidity_risk","fa":"ریسک نقدشوندگی","en":"liquidity risk","category":"risk","antonym":null},{"id":"concentration_risk","fa":"ریسک تمرکز","en":"concentration risk","category":"risk","antonym":null},{"id":"reputational_risk","fa":"ریسک اعتباری و شهرت","en":"reputational risk","category":"risk","antonym":null},{"id":"stress_test","fa":"آزمون تنش","en":"stress test","category":"risk","antonym":null},{"id":"scenario_analysis","fa":"تحلیل سناریو","en":"scenario analysis","category":"risk","antonym":null},{"id":"sensitivity_analysis","fa":"تحلیل حساسیت","en":"sensitivity analysis","category":"risk","antonym":null},{"id":"risk_adjusted_return","fa":"بازده تعدیل‌شده به ریسک","en":"risk-adjusted return","category":"risk","antonym":null},{"id":"value_at_risk","fa":"ارزش در معرض ریسک","en":"value at risk","category":"risk","antonym":null},{"id":"expected_shortfall","fa":"کسری مورد انتظار","en":"expected shortfall","category":"risk","antonym":null},{"id":"drawdown","fa":"افت از اوج","en":"drawdown","category":"risk","antonym":null},{"id":"tail_event","fa":"رویداد حدی","en":"tail event","category":"risk","antonym":null},{"id":"black_swan","fa":"قوی سیاه","en":"black swan","category":"risk","antonym":null},{"id":"contagion","fa":"سرایت مالی","en":"contagion","category":"risk","antonym":null},{"id":"spillover","fa":"اثر سرریز","en":"spillover","category":"risk","antonym":null},{"id":"transmission_channel","fa":"کانال انتقال اثر","en":"transmission channel","category":"economics","antonym":null},{"id":"feedback_loop","fa":"حلقه بازخورد","en":"feedback loop","category":"systems","antonym":null},{"id":"adaptive","fa":"سازگارشونده","en":"adaptive","category":"systems","antonym":null},{"id":"robust","fa":"مقاوم و پایدار","en":"robust","category":"systems","antonym":null},{"id":"fragile","fa":"شکننده","en":"fragile","category":"systems","antonym":null},{"id":"scalable","fa":"مقیاس‌پذیر","en":"scalable","category":"systems","antonym":null},{"id":"modular","fa":"ماژولار","en":"modular","category":"systems","antonym":null},{"id":"interoperable","fa":"دارای قابلیت همکاری","en":"interoperable","category":"systems","antonym":null},{"id":"redundancy","fa":"افزونگی","en":"redundancy","category":"systems","antonym":null},{"id":"dependency","fa":"وابستگی","en":"dependency","category":"systems","antonym":null},{"id":"synchronization","fa":"همگام‌سازی","en":"synchronization","category":"systems","antonym":null},{"id":"automation","fa":"خودکارسازی","en":"automation","category":"systems","antonym":null},{"id":"optimization","fa":"بهینه‌سازی","en":"optimization","category":"systems","antonym":null},{"id":"validation","fa":"اعتبارسنجی","en":"validation","category":"systems","antonym":null},{"id":"monitoring","fa":"پایش","en":"monitoring","category":"systems","antonym":null},{"id":"diagnostics","fa":"عیب‌یابی","en":"diagnostics","category":"systems","antonym":null},{"id":"maintenance","fa":"نگهداشت","en":"maintenance","category":"systems","antonym":null},{"id":"versioning","fa":"نسخه‌بندی","en":"versioning","category":"systems","antonym":null},{"id":"rollback","fa":"بازگشت به نسخه پیشین","en":"rollback","category":"systems","antonym":null},{"id":"traceability","fa":"ردیابی‌پذیری","en":"traceability","category":"systems","antonym":null},{"id":"audit_trail","fa":"ردپای حسابرسی","en":"audit trail","category":"systems","antonym":null}]);
const BILINGUAL_LEXICON_INDEX = new Map(BILINGUAL_RELATION_LEXICON.map(x=>[x.id,x]));
function analyzeBilingualVocabulary(input) {
 const text=normalize(String(input||""));
 const hits=BILINGUAL_RELATION_LEXICON.filter(x=>[x.fa,x.en,...(x.fa_aliases||[]),...(x.en_aliases||[])].some(term=>text.includes(normalize(term))));
 const ids=new Set(hits.map(x=>x.id));
 const linked=new Set();
 for(const x of hits) {
  if(x.antonym) linked.add(x.antonym);
  for(const y of BILINGUAL_RELATION_LEXICON) if(y.category===x.category&&y.id!==x.id) linked.add(y.id);
 }
 const related=[...linked].map(id=>BILINGUAL_LEXICON_INDEX.get(id)).filter(Boolean);
 return {
  matched_concepts:hits.map(x=>({id:x.id,persian:x.fa,english:x.en,category:x.category,antonym:x.antonym})),
  synonym_equivalents:hits.map(x=>({id:x.id,fa:x.fa,en:x.en})),
  antonym_links:hits.filter(x=>x.antonym).map(x=>({concept:x.id,opposite:x.antonym,opposite_fa:BILINGUAL_LEXICON_INDEX.get(x.antonym)?.fa||null,opposite_en:BILINGUAL_LEXICON_INDEX.get(x.antonym)?.en||null})),
  related_concepts:related.slice(0,40).map(x=>({id:x.id,fa:x.fa,en:x.en,relation:"same_semantic_domain"})),
  matched_count:hits.length,related_count:related.length
 };
}
function bilingualLexiconSelfTest() {
 const cases=[
  {text:"The central bank announced a policy rate increase.",must:["announce","policy_rate","increase"]},
  {text:"بانک مرکزی افزایش نرخ سیاستی را اعلام کرد.",must:["announce","policy_rate","increase"]},
  {text:"Evidence supports the conclusion, but uncertainty remains.",must:["evidence","conclusion","uncertainty"]},
  {text:"شواهد از نتیجه‌گیری پشتیبانی می‌کنند، اما عدم‌قطعیت باقی است.",must:["evidence","conclusion","uncertainty"]},
  {text:"A surplus may offset a fiscal deficit.",must:["surplus","fiscal_deficit"]},
  {text:"مازاد ممکن است کسری بودجه را جبران کند.",must:["surplus","fiscal_deficit"]},
  {text:"Liquidity risk can amplify volatility.",must:["liquidity_risk","volatility"]},
  {text:"ریسک نقدشوندگی می‌تواند نوسان‌پذیری را تشدید کند.",must:["liquidity_risk","volatility"]},
  {text:"The report is explicit, not implicit.",must:["explicit","implicit"]},
  {text:"گزارش صریح است، نه ضمنی.",must:["explicit","implicit"]}
 ];
 const results=cases.map(c=>{const a=analyzeBilingualVocabulary(c.text);const ids=a.matched_concepts.map(x=>x.id);const missing=c.must.filter(x=>!ids.includes(x));return {passed:missing.length===0,missing};});
 return {total:results.length,passed:results.filter(x=>x.passed).length,failed:results.map((x,i)=>({...x,index:i})).filter(x=>!x.passed),lexicon_concepts:BILINGUAL_RELATION_LEXICON.length,core_bilingual_terms:BILINGUAL_RELATION_LEXICON.length*2};
}

function extractLanguageFoundations(text,language="en") {
 const t=normalize(text),dict=language==="fa"?PERSIAN_LANGUAGE_FOUNDATIONS:ENGLISH_LANGUAGE_FOUNDATIONS;
 return dict.filter(item=>item.terms.some(term=>t.includes(normalize(term)))).map(item=>({id:item.id,meaning_fa:item.fa}));
}
function independentLanguageBenchmark() {
 const suites = {
  en: [
   ["negation",["The committee did not approve the proposal.","The minister denied that a new tax was planned.","The bank has never confirmed the reported figure.","Exports are no longer falling.","There is no evidence that the rumour is accurate."]],
   ["modality",["The currency may strengthen after the announcement.","Analysts could revise their outlook next week.","The central bank is likely to pause its programme.","Prices might remain volatile through June.","The proposal is expected to face resistance."]],
   ["conditional",["If demand weakens, factories may reduce output.","Unless the vote is delayed, the rule starts Monday.","The rate will change only if the board agrees.","Should inflation accelerate, policymakers may respond.","The plan depends on whether parliament approves it."]],
   ["reported",["Officials said the talks would continue.","The newspaper reported that exports had recovered.","According to the ministry, the figures are preliminary.","The central bank stated that no decision had been made.","A spokesperson said the claim was unverified."]],
   ["contrast",["Although sales increased, profits declined.","The currency rose, whereas bond prices fell.","Demand was strong; however, supply remained limited.","Despite the delay, negotiations continued.","The first estimate was high, but the revised figure was lower."]],
   ["causal",["The factory closed because energy costs increased.","Higher borrowing costs contributed to weaker demand.","The currency weakened as import payments rose.","The outage led to a temporary production decline.","The decline followed the policy change, but its cause is unknown."]],
   ["future",["The company plans to open two new offices.","The bank will publish its decision tomorrow.","Officials intend to resume discussions next month.","The new rules are due to take effect in July.","The committee is scheduled to meet on Friday."]],
   ["counterfactual",["If the shipment had arrived, output would have been higher.","Had rates fallen earlier, borrowing might have increased.","The project could have succeeded if funding had continued.","Without the delay, the vote would have taken place yesterday.","If demand were stronger, firms would invest more."]],
   ["sequence",["After the announcement, the currency moved higher.","Before the meeting, officials released a statement.","The report came first; subsequently, the agency clarified it.","Meanwhile, oil prices remained almost unchanged.","The two events occurred in sequence, not at the same time."]],
   ["causal_caution",["The price rise does not prove that the announcement caused it.","A correlation between the variables is not evidence of causation.","The timing alone cannot establish a causal link.","The report does not show that the policy was responsible.","Several factors may explain the change; one event is not enough."]]
  ],
  fa: [
   ["negation",["کمیته این پیشنهاد را تصویب نکرد.","وزیر وجود برنامه‌ای برای مالیات جدید را تکذیب کرد.","بانک هرگز رقم گزارش‌شده را تأیید نکرده است.","صادرات دیگر روند کاهشی ندارد.","هیچ مدرکی درستی این شایعه را نشان نمی‌دهد."]],
   ["modality",["ممکن است ارز پس از اعلام خبر تقویت شود.","تحلیلگران شاید پیش‌بینی خود را تغییر دهند.","احتمال دارد بانک مرکزی برنامه را متوقف کند.","قیمت‌ها ممکن است تا خرداد پرنوسان بمانند.","انتظار می‌رود این پیشنهاد با مخالفت روبه‌رو شود."]],
   ["conditional",["اگر تقاضا ضعیف شود، کارخانه‌ها تولید را کم می‌کنند.","مگر اینکه رأی‌گیری عقب بیفتد، قانون از دوشنبه اجرا می‌شود.","نرخ فقط در صورتی تغییر می‌کند که هیئت موافقت کند.","چنانچه تورم شتاب بگیرد، سیاست‌گذاران واکنش نشان می‌دهند.","اجرای طرح به تصویب مجلس بستگی دارد."]],
   ["reported",["مقام‌ها گفتند مذاکرات ادامه خواهد یافت.","روزنامه گزارش داد که صادرات بهبود یافته است.","بر اساس اعلام وزارتخانه، آمارها مقدماتی هستند.","بانک مرکزی اعلام کرد هنوز تصمیمی گرفته نشده است.","سخنگو گفت این ادعا تأیید نشده است."]],
   ["contrast",["با اینکه فروش افزایش یافت، سود کاهش پیدا کرد.","ارز تقویت شد، در حالی که قیمت اوراق پایین آمد.","تقاضا قوی بود؛ بااین‌حال عرضه محدود ماند.","با وجود تأخیر، مذاکرات ادامه یافت.","برآورد نخست بالا بود، اما رقم اصلاح‌شده کمتر شد."]],
   ["causal",["کارخانه تعطیل شد زیرا هزینه انرژی افزایش یافت.","هزینه بالاتر وام به کاهش تقاضا کمک کرد.","با افزایش پرداخت‌های وارداتی، ارزش پول تضعیف شد.","اختلال به افت موقت تولید منجر شد.","افت قیمت پس از تغییر سیاست رخ داد، اما علت آن روشن نیست."]],
   ["future",["شرکت قصد دارد دو دفتر جدید افتتاح کند.","بانک فردا تصمیم خود را منتشر خواهد کرد.","مقام‌ها برنامه دارند ماه آینده گفت‌وگوها را از سر بگیرند.","قرار است مقررات جدید در تیر اجرا شوند.","کمیته روز جمعه جلسه خواهد داشت."]],
   ["counterfactual",["اگر محموله رسیده بود، تولید بیشتر می‌شد.","اگر نرخ‌ها زودتر کاهش یافته بودند، وام‌گیری می‌توانست افزایش یابد.","پروژه می‌توانست موفق شود، اگر تأمین مالی ادامه پیدا می‌کرد.","بدون آن تأخیر، رأی‌گیری دیروز انجام شده بود.","اگر تقاضا قوی‌تر بود، شرکت‌ها سرمایه‌گذاری می‌کردند."]],
   ["sequence",["پس از اعلام خبر، نرخ ارز افزایش یافت.","پیش از جلسه، مقام‌ها بیانیه‌ای منتشر کردند.","ابتدا گزارش منتشر شد و سپس نهاد مربوط توضیح داد.","در همین زمان، قیمت نفت تقریباً ثابت ماند.","این دو رویداد پشت سر هم رخ دادند، نه هم‌زمان."]],
   ["causal_caution",["افزایش قیمت ثابت نمی‌کند که اعلام خبر علت آن بوده است.","همبستگی میان متغیرها دلیل رابطه علّی نیست.","صرف هم‌زمانی نمی‌تواند رابطه علت و معلولی را ثابت کند.","گزارش نشان نمی‌دهد که سیاست مسئول این تغییر بوده است.","چند عامل می‌توانند تغییر را توضیح دهند؛ یک رویداد کافی نیست."]]
  ]
 };
 const rules = {
  en:{
   negation:["did not","denied","never","no longer","no evidence","not","cannot","without"],
   modality:["may","could","might","likely","expected to","possibly","perhaps"],
   conditional:["if ","unless","only if","should ","depends on whether"],
   reported:["officials said","reported that","according to","stated that","spokesperson said"],
   contrast:["although","whereas","however","despite","but"],
   causal:["because","contributed to","as ","led to","followed"],
   future:["plans to","will ","intend to","due to take effect","scheduled to"],
   counterfactual:["would have","had ","could have","if ","without","were "],
   sequence:["after","before","subsequently","meanwhile","in sequence"],
   causal_caution:["does not prove","not evidence of causation","cannot establish a causal","does not show","not enough"]
  },
  fa:{
   negation:["نکرد","تکذیب","هرگز","دیگر","هیچ مدرکی","نیست","نمی","تأیید نشده"],
   modality:["ممکن است","شاید","احتمال دارد","انتظار می‌رود","می‌تواند"],
   conditional:["اگر","مگر اینکه","در صورتی که","چنانچه","بستگی دارد"],
   reported:["گفتند","گزارش داد","بر اساس اعلام","اعلام کرد","سخنگو گفت"],
   contrast:["با اینکه","در حالی که","بااین‌حال","با وجود","اما"],
   causal:["زیرا","کمک کرد","با افزایش","منجر شد","پس از"],
   future:["قصد دارد","خواهد","برنامه دارند","قرار است","جلسه خواهد داشت"],
   counterfactual:["می‌شد","می‌توانست","اگر","بدون","انجام شده بود"],
   sequence:["پس از","پیش از","سپس","در همین زمان","پشت سر هم"],
   causal_caution:["ثابت نمی‌کند","دلیل رابطه علّی نیست","نمی‌تواند رابطه","نشان نمی‌دهد","کافی نیست"]
  }
 };
 const rows=[];
 for(const language of ["en","fa"]) {
  for(const [feature,sentences] of suites[language]) {
   for(let i=0;i<sentences.length;i++) {
    const text=sentences[i], t=normalize(text);
    const detected=Object.entries(rules[language]).filter(([,markers])=>markers.some(m=>t.includes(normalize(m)))).map(([key])=>key);
    rows.push({id:language+"-"+feature+"-"+(i+1),language,text,expected:feature,detected,passed:detected.includes(feature)});
   }
  }
 }
 const summarize=language=>{
  const subset=rows.filter(x=>x.language===language);
  const tp=subset.filter(x=>x.passed).length;
  return {total:subset.length,matched:tp,missed:subset.length-tp,recall_pct:Number((tp/subset.length*100).toFixed(1)),failures:subset.filter(x=>!x.passed).map(x=>({id:x.id,expected:x.expected,text:x.text,detected:x.detected}))};
 };
 const en=summarize("en"),fa=summarize("fa");
 return {exam_type:"independently_authored_100_sentence_semantic_marker_benchmark_not_general_comprehension_or_cefr",total:rows.length,passed:rows.filter(x=>x.passed).length,score_pct:Number((rows.filter(x=>x.passed).length/rows.length*100).toFixed(1)),english:en,persian:fa,limitations:["tests recognition of explicit semantic cues, not deep reading comprehension","no independent human annotation","does not test open-ended translation, paraphrase quality, or author-intent inference","rule-based detector can over-detect overlapping cues"],items:rows};
}

function languageFoundationsExam() {
 const make=(dict,language)=>dict.slice(0,50).map((item,i)=>{
  const term=item.terms[0];
  const text=language==="fa"?("نمونه آموزشی: "+term+" در دستور و تحلیل زبان بررسی می‌شود."):("Language lesson: "+term+" is a topic in language study.");
  const normalized=normalize(text);
  const detected=dict.filter(x=>x.terms.some(y=>normalized.includes(normalize(y)))).map(x=>x.id);
  return {id:(language==="fa"?"fa":"en")+(i+1),language,concept:item.id,passed:detected.includes(item.id),matched:detected.includes(item.id)};
 });
 const english=make(ENGLISH_LANGUAGE_FOUNDATIONS,"en");
 const persian=make(PERSIAN_LANGUAGE_FOUNDATIONS,"fa");
 const all=[...english,...persian];
 return {exam_type:"100_item_vocabulary_and_language_concept_recognition_screen_not_a_full_comprehension_exam",total:all.length,passed:all.filter(x=>x.passed).length,failed:all.filter(x=>!x.passed).map(x=>({id:x.id,concept:x.concept})),english:{total:english.length,passed:english.filter(x=>x.passed).length},persian:{total:persian.length,passed:persian.filter(x=>x.passed).length},items:all};
}

const PERSIAN_LITERARY_TERMS = [
 {id:"simile",terms:["مانند","مثل","همچون","چون","گویی","همانند"],label_fa:"تشبیه",meaning_fa:"مانندکردن یک چیز به چیز دیگر برای روشن‌تر یا زیباتر کردن معنا"},
 {id:"metaphor",terms:["استعاره","استعاری"],label_fa:"استعاره",meaning_fa:"به‌کاربردن واژه در معنایی غیرمستقیم بر پایه شباهت"},
 {id:"personification",terms:["جان بخشی","تشخیص","دیوارها سخن می گویند","باد می خندد","ابر گریست"],label_fa:"تشخیص یا جان‌بخشی",meaning_fa:"نسبت‌دادن ویژگی یا رفتار انسانی به اشیا و پدیده‌ها"},
 {id:"irony",terms:["طنز","کنایه","طعنه","وارونه نمایی"],label_fa:"طنز و کنایه",meaning_fa:"رساندن معنایی فراتر از ظاهر جمله؛ گاهی با وارونگی یا انتقاد"},
 {id:"allusion",terms:["تلمیح","اشاره به داستان","اشاره به اسطوره","اشاره به شخصیت تاریخی"],label_fa:"تلمیح",meaning_fa:"اشاره کوتاه به داستان، آیه، رویداد یا شخصیت شناخته‌شده"},
 {id:"hyperbole",terms:["اغراق","مبالغه","بزرگ نمایی"],label_fa:"اغراق",meaning_fa:"بزرگ یا کوچک نشان‌دادن بیش از اندازه برای تأکید"},
 {id:"paradox",terms:["متناقض نما","پارادوکس"],label_fa:"متناقض‌نما",meaning_fa:"ترکیبی که در ظاهر ناسازگار است اما معنایی قابل تأمل می‌سازد"},
 {id:"rhyme",terms:["قافیه"],label_fa:"قافیه",meaning_fa:"هماهنگی آوایی پایان مصراع‌ها یا بیت‌ها"},
 {id:"radif",terms:["ردیف"],label_fa:"ردیف",meaning_fa:"واژه یا عبارت تکرارشونده پس از قافیه"},
 {id:"meter",terms:["وزن شعر","وزن عروضی","بحر شعر"],label_fa:"وزن عروضی",meaning_fa:"الگوی آهنگین هجاها در شعر کلاسیک"},
 {id:"imagery",terms:["تصویر سازی","تصویرپردازی","حس آمیزی"],label_fa:"تصویرسازی و حس‌آمیزی",meaning_fa:"ساخت تصویر ذهنی یا آمیختن دریافت‌های حسی"},
 {id:"symbol",terms:["نماد","نمادپردازی"],label_fa:"نماد",meaning_fa:"عنصری که علاوه بر معنای ظاهری، مفهوم گسترده‌تری را نمایندگی می‌کند"},
 {id:"repetition",terms:["تکرار","واج آرایی","جناس"],label_fa:"آرایه‌های آوایی و تکرار",meaning_fa:"ایجاد موسیقی یا تأکید از راه تکرار صدا، واژه یا ساخت"},
 {id:"prose",terms:["نثر","نثر ادبی","نثر مرسل","نثر مسجع"],label_fa:"نثر",meaning_fa:"نوشتار غیرمنظوم؛ می‌تواند ساده، ادبی یا آهنگین باشد"},
 {id:"poetry",terms:["شعر","غزل","قصیده","مثنوی","رباعی","دوبیتی","قطعه"],label_fa:"قالب‌های شعر",meaning_fa:"گونه‌های شعر با ساختار و ویژگی‌های متفاوت"},
 {id:"narrative",terms:["روایت","راوی","زاویه دید","شخصیت پردازی","طرح داستان"],label_fa:"روایت و داستان",meaning_fa:"چگونگی بازگویی رخدادها، زاویه دید و ساخت شخصیت‌ها"},
 {id:"theme",terms:["درون مایه","مضمون","بن مایه"],label_fa:"درون‌مایه",meaning_fa:"اندیشه یا مسئله اصلی اثر ادبی"},
 {id:"classical_literature",terms:["ادبیات کلاسیک","ادبیات کهن","سبک خراسانی","سبک عراقی","سبک هندی"],label_fa:"ادبیات کلاسیک",meaning_fa:"سنت‌های تاریخی شعر و نثر فارسی و ویژگی‌های سبکی آن‌ها"},
 {id:"modern_literature",terms:["ادبیات معاصر","شعر نو","شعر نیمایی","شعر سپید","داستان مدرن"],label_fa:"ادبیات معاصر",meaning_fa:"جریان‌های جدید شعر و داستان فارسی"},
 {id:"proverb",terms:["ضرب المثل","مثل فارسی","اصطلاح عامیانه"],label_fa:"ضرب‌المثل و اصطلاح",meaning_fa:"عبارت جاافتاده‌ای که تجربه یا معنایی فشرده را منتقل می‌کند"}
];
function analyzePersianLiterature(text) {
 const t=normalize(text);
 const found=[];
 for(const item of PERSIAN_LITERARY_TERMS) {
  const hits=containsAny(t,item.terms);
  if(hits.length) found.push({id:item.id,label_fa:item.label_fa,meaning_fa:item.meaning_fa,matched_term:hits[0]});
 }
 const hasVerseLines=/\n/.test(String(text)) || /[؛،].{0,30}[؛،]/.test(String(text));
 return {detected_topics:found,form_hint:hasVerseLines?"possibly_verse_or_lineated_text":"prose_or_unknown",caution:"آرایه ادبی فقط با واژه‌های نشانگر قابل تشخیص قطعی نیست؛ تفسیر شعر و کنایه به بافت و خواندن انسانی نیاز دارد."};
}
function languageComprehensionExam() {
 const englishCases=[
  {text:"The central bank held rates steady, although inflation remains above its target.",expected:["central_bank","interest_rate","inflation"],checks:["contrast"]},
  {text:"Officials said the currency could weaken if oil exports fall.",expected:["exchange_rate","crude_oil"],checks:["conditional","reported"]},
  {text:"Gold rose amid geopolitical uncertainty, but this does not prove the tensions caused the increase.",expected:["safe_haven_gold","geopolitical_risk"],checks:["causal_caution"]},
  {text:"A yield curve inversion may signal recession, though it is not a guarantee.",expected:["yield_curve","inversion","recession"],checks:["hedging","negation"]},
  {text:"The government plans to reduce its fiscal deficit while public debt remains elevated.",expected:["fiscal_deficit","public_debt"],checks:["future_plan","contrast"]}
 ];
 const persianCases=[
  {text:"بانک مرکزی با وجود تورم بالا، نرخ بهره را ثابت نگه داشت.",expected:["central_bank","inflation","interest_rate"],checks:["contrast"]},
  {text:"مقام‌ها گفتند اگر صادرات نفت کاهش یابد، نرخ ارز ممکن است افزایش پیدا کند.",expected:["crude_oil","exchange_rate"],checks:["conditional","reported"]},
  {text:"افزایش قیمت طلا هم‌زمان با تنش سیاسی رخ داد، اما این هم‌زمانی علت را ثابت نمی‌کند.",expected:["safe_haven","geopolitical_risk"],checks:["causal_caution"]},
  {text:"معکوس شدن منحنی بازده می‌تواند نشانه رکود باشد، اما وقوع رکود قطعی نیست.",expected:["yield_curve","inversion","recession"],checks:["hedging","negation"]},
  {text:"دولت قصد دارد کسری بودجه را کاهش دهد، در حالی که بدهی عمومی همچنان بالاست.",expected:["fiscal_deficit","public_debt"],checks:["future_plan","contrast"]}
 ];
 function score(cases,dict) {
  const rows=cases.map(c=>{
   const t=normalize(c.text);
   const actual=dict.filter(x=>x.terms.some(term=>t.includes(normalize(term)))).map(x=>x.id);
   const missing=c.expected.filter(id=>!actual.includes(id));
   const markerRules={
    contrast:["although","but","while","however","despite","با وجود","اما","در حالی که"],
    conditional:["if","unless","provided that","اگر","مگر اینکه"],
    reported:["officials said","officials stated","said","مقام ها گفتند","گفتند","اعلام کردند"],
    causal_caution:["does not prove","does not necessarily mean","correlation does not imply","علت را ثابت نمی کند","به معنی رابطه علّی نیست","هم زمانی علت را ثابت نمی کند"],
    hedging:["may","might","could","possibly","می تواند","ممکن است","احتمال دارد"],
    negation:["not","no ","never","نیست","نمی","نه"],
    future_plan:["plans to","plan to","intends to","قصد دارد","برنامه دارد"]
   };
   const markerMissing=(c.checks||[]).filter(key=>!(markerRules[key]||[]).some(marker=>t.includes(normalize(marker))));
   return {passed:missing.length===0&&markerMissing.length===0,missing,missing_semantic_markers:markerMissing,expected:c.expected.length,found:c.expected.length-missing.length};
  });
  const found=rows.reduce((n,x)=>n+x.found,0),total=rows.reduce((n,x)=>n+x.expected,0);
  return {passed:rows.filter(x=>x.passed).length,total_cases:rows.length,matched_concepts:found,total_concepts:total,recall_pct:Number((found/total*100).toFixed(1)),case_results:rows};
 }
 const en=score(englishCases,MARKET_GLOSSARY);
 const fa=score(persianCases,PERSIAN_MARKET_GLOSSARY);
 const passed=en.passed===en.total_cases&&fa.passed===fa.total_cases;
 return {exam_type:"internal_lexical_semantic_coverage_not_a_general_language_proficiency_test",english:en,persian:fa,overall_status:passed?"pass":"needs_revision",note_fa:"این آزمون داخلی، پوشش مفاهیم و چند نشانگر معنایی را می‌سنجد؛ جایگزین آزمون استاندارد فهم زبان یا ارزیابی انسانی نیست."};
}

const THEMES = [
  {id:"fx_policy",label_fa:"ارز و سیاست پولی",terms:["نرخ دلار","قیمت دلار","بازار دلار","دلار آزاد","بازار ارز","نرخ ارز","ارز آزاد","نرخ برابری","ریال ایران","تومان ایران","بانک مرکزی","نرخ بهره","currency market","foreign exchange","exchange rate","central bank","interest rate","rial exchange rate","fx market"]},
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

function languageIsEnglish(title) { return !/[\u0600-\u06ff]/.test(String(title||"")); }
function buildSimpleNewsAnalysis({title,body,language,events,themes,uncertain,text,english}) {
  const isFa=language==="fa";
  const denied=isFa
    ? containsAny(text,["تکذیب شد","رد کرد","صحت ندارد","واقعیت ندارد","منتفی شد","انجام نشده","صورت نگرفت"]).length>0
    : containsAny(text,["denied","denies","not true","did not happen","ruled out","rejected"]).length>0;
  const conditional=isFa
    ? containsAny(text,["اگر","در صورت","مشروط به","به شرط"]).length>0
    : containsAny(text,["if ","unless ","provided that","conditional on"]).length>0;
  const reported=isFa
    ? containsAny(text,["اعلام کرد","اعلام کردند","به گفته","گفت","خبر داد","گزارش داد"]).length>0
    : containsAny(text,["according to","officials said","the ministry said","the central bank said","reported"]).length>0;
  const eventLabels=events.map(e=>e.label_fa);
  const themeLabels=themes.map(id=>THEMES.find(t=>t.id===id)?.label_fa).filter(Boolean);
  const status=denied?"denied_or_disputed":conditional?"conditional":uncertain?"unconfirmed_or_uncertain":reported?"reported_claim":"asserted_in_text";
  const riskUp=events.some(e=>e.market_effect==="risk_up");
  const riskDown=events.some(e=>e.market_effect==="risk_down");
  const riskPressure=riskUp&&riskDown?"mixed":riskUp?"higher":riskDown?"lower":"unclear";
  const relevance=themes.length||events.length?"مرتبط با بازار":"ارتباط مستقیم با بازار در متن شناسایی نشد";
  const what=eventLabels.length?eventLabels.join("، "):themeLabels.length?themeLabels.join("، "):"موضوع اقتصادی مشخصی شناسایی نشد";
  const statusFa={denied_or_disputed:"خبر یا ادعا تکذیب‌شده/مورد اختلاف است",conditional:"خبر مشروط است و هنوز قطعی نیست",unconfirmed_or_uncertain:"خبر با عدم‌قطعیت بیان شده",reported_claim:"گزارش یا نقل‌قول است و مستقلاً تأیید نشده",asserted_in_text:"متن خبر رویداد را به شکل خبری بیان می‌کند"};
  return {
    summary_fa: isFa ? `موضوع خبر: ${what}. ${statusFa[status]}.` : `موضوع خبر: ${what}. ${statusFa[status]}.`,
    topic_fa:what,
    market_relevance_fa:relevance,
    claim_status:status,
    claim_status_fa:statusFa[status],
    risk_pressure:riskPressure,
    risk_pressure_fa:riskPressure==="higher"?"افزایش فشار ریسک":riskPressure==="lower"?"کاهش فشار ریسک":riskPressure==="mixed"?"نشانه‌های متضاد":"نامشخص",
    reported_or_attributed:reported,
    conditional,
    denied_or_disputed:denied,
    uncertainty_detected:uncertain,
    price_direction_forecast:null,
    caution_fa:"این تحلیل فقط موضوع و فشار ریسک خبری را خلاصه می‌کند؛ به‌تنهایی جهت قیمت دلار یا طلا را پیش‌بینی نمی‌کند.",
    evidence_basis:body.length?"headline_and_rss_excerpt":"headline_only"
  };
}
function containsThemeTerm(text, term) {
  const needle=normalize(term);
  if(!needle) return false;
  // Match complete tokens/phrases for every term length. The old long-term
  // substring shortcut caused accidental matches inside unrelated words.
  let from=0, at=-1;
  while((at=text.indexOf(needle,from))>=0){
    const before=at===0?" ":text[at-1];
    const after=at+needle.length>=text.length?" ":text[at+needle.length];
    if(!/[\p{L}\p{N}]/u.test(before) && !/[\p{L}\p{N}]/u.test(after)) return true;
    from=at+Math.max(1,needle.length);
  }
  return false;
}
function themeMatchesForArticle(text, theme) {
  let matches=theme.terms.filter(term=>containsThemeTerm(text,term));
  // Domain disambiguation: a lexical hit is not enough when the phrase clearly belongs
  // to sport, medicine or entertainment rather than a financial/market event.
  if(theme.id==="gold") {
    const medical=/ریزش\s+مو|موی\s+سکه\s+ای|سکه\s+ای\s+مو/u.test(text);
    const sportsMedal=/(?:مدال\s+طلا|طلای\s+المپیک|قهرمان\s+المپیک|gold\s+medal|olympic\s+gold)/u.test(text);
    const marketAnchor=/(?:قیمت\s+طلا|بازار\s+طلا|اونس|شمش|طلای\s+\d+\s+عیار|gold\s+price|gold\s+market|bullion|xau)/u.test(text);
    if(medical) matches=matches.filter(term=>normalize(term)!=="سکه");
    if(sportsMedal&&!marketAnchor) matches=[];
  }
  if(theme.id==="oil_energy") {
    const nonMarketEnergy=/(?:انرژی\s+بدن|سوخت\s+و\s+ساز|متابولیسم|energy\s+metabolism|energy\s+drink)/u.test(text);
    const energyMarketAnchor=/(?:نفت|گاز\s+طبیعی|اوپک|بازار\s+انرژی|قیمت\s+انرژی|crude|oil\s+market|natural\s+gas|opec)/u.test(text);
    if(nonMarketEnergy&&!energyMarketAnchor) matches=[];
  }
  if(theme.id==="geopolitics") {
    const fictionContext=/(?:فیلم\s+جنگ|فیلمی\s+درباره\s+جنگ|سریال\s+جنگ|war\s+film|war\s+movie)/u.test(text);
    const concreteConflict=/(?:درگیری\s+نظامی|حمله\s+موشکی|حمله\s+نظامی|نیروهای\s+مسلح|military\s+strike|military\s+conflict|armed\s+forces)/u.test(text);
    if(fictionContext&&!concreteConflict) matches=[];
  }
  return matches;
}
function classifyOne(item) {
  const title = String(item?.title || item?.original_title || "");
  const body = String(item?.original_text || item?.translated_text_fa || item?.summary_fa || "").slice(0,3000);
  const text = normalize(title + " " + body);
  const themeHits = THEMES.map(t=>({...t,matches:themeMatchesForArticle(text,t)})).filter(t=>t.matches.length);
  const events = EVENT_TERMS.filter(e=>containsAny(text,e.terms).length).map(e=>({id:e.id,label_fa:e.label_fa,market_effect:e.direction}));
  const uncertain = containsAny(text,UNCERTAIN).length>0;
  const pos = polarity(text,POSITIVE), neg = polarity(text,NEGATIVE);
  const tone = pos===neg?"neutral_or_unclear":pos>neg?"positive_wording":"negative_wording";
  const numberMentions = extractNumbers(text);
  const english = englishAdvancedSemantics(text);
  const b1 = languageIsEnglish(title) ? analyzeB1English(text) : null;
  const c1 = languageIsEnglish(title) ? analyzeC1English(text) : null;
  const glossaryTerms = languageIsEnglish(title) ? extractMarketGlossary(text) : extractPersianMarketGlossary(text);
  const persianLiterature = languageIsEnglish(title) ? null : analyzePersianLiterature(title + " " + body);
  const languageFoundations = extractLanguageFoundations(title + " " + body,languageIsEnglish(title)?"en":"fa");
  const bilingualVocabulary = analyzeBilingualVocabulary(title + " " + body);
  const language = /[\u0600-\u06ff]/.test(title) ? "fa" : "en";
  const pragmatics = analyzePragmatics(title, language, body);
  const formalRegister = analyzeFormalRegister(title + " " + body, language);
  const confidence = Math.min(0.92,0.2+themeHits.length*0.10+events.length*0.12+(numberMentions.length?0.05:0)+(english.actors.length?0.04:0))*(uncertain||english.assertion==="conditional"||english.assertion==="forecast_or_possibility"?0.7:1);
  const simpleAnalysis=buildSimpleNewsAnalysis({title,body,language,events,themes:themeHits.map(t=>t.id),uncertain,text,english});
  return {
    title,source:item?.domain||item?.source_id||null,published_at:item?.published_at||null,url:item?.url||null,
    language,content_chars:body.length,input_mode:body.length?"headline_plus_rss_excerpt":"headline_only",
    simple_analysis_fa:simpleAnalysis,
    themes:themeHits.map(t=>t.id),
    theme_evidence:themeHits.map(t=>({
      theme_id:t.id,
      matched_terms:t.matches,
      matched_in_title:t.matches.filter(term=>containsThemeTerm(normalize(title),term)),
      matched_in_excerpt:t.matches.filter(term=>containsThemeTerm(normalize(body),term)),
      evidence_scope:body.length?"title_and_rss_excerpt":"headline_only"
    })),
    events,wording_tone:tone,uncertain,
    english_semantics:language==="en"?{...english,b1_analysis:b1,c1_analysis:c1,market_glossary:glossaryTerms}:null,
    persian_literature:persianLiterature,
    language_foundations:languageFoundations,
    bilingual_vocabulary:bilingualVocabulary,
    pragmatics,
    formal_register:formalRegister,
    reading_comprehension:analyzeNewsReading(title,body,item?.published_at||null),
    numbers:[...numberMentions,...extractEnglishAmounts(text)].slice(0,20),confidence:Number(confidence.toFixed(2)),
    limitations:["lexicon_based","syntax_and_context_not_fully_resolved"]
  };
}
function runThemeClassificationBenchmark() {
  const cases=[
    {name:"alopecia_coin_shaped_hair_loss_is_not_gold_or_geopolitics",item:{title:"ریزش موی سکه‌ای؛ نشانه واکنش سیستم ایمنی بدن",original_text:"ریزش موی سکه‌ای، فراتر از یک مشکل ساده، نشانه‌ای از واکنش سیستم ایمنی بدن است."},forbid:["gold","geopolitics"]},
    {name:"industrial_production_word_does_not_create_geopolitics",item:{title:"فعالیت واحدهای صنعتی و تولیدی ادامه دارد",original_text:"صنایع تولیدی استان بدون وقفه فعالیت می‌کنند."},forbid:["geopolitics"]},
    {name:"explicit_military_conflict_is_geopolitical",item:{title:"درگیری نظامی در مرزها گزارش شد",original_text:"گزارش‌ها از تشدید درگیری نظامی حکایت دارد."},require:["geopolitics"]},
    {name:"explicit_fx_market_reference_is_fx_policy",item:{title:"بازار ارز و نرخ دلار",original_text:"قیمت دلار آزاد و نرخ ارز بررسی شد."},require:["fx_policy"]},
    {name:"olympic_gold_medal_is_not_gold_market",item:{title:"مدال طلای المپیک به ورزشکار رسید",original_text:"قهرمان مسابقات مدال طلا دریافت کرد."},forbid:["gold"]},
    {name:"human_body_energy_is_not_energy_market",item:{title:"نقش انرژی در سوخت و ساز بدن",original_text:"متابولیسم بدن برای تولید انرژی به مواد غذایی نیاز دارد."},forbid:["oil_energy"]},
    {name:"war_film_is_not_geopolitical_event",item:{title:"اکران فیلم جنگی جدید",original_text:"فیلمی درباره جنگ جهانی در سینماها اکران می‌شود."},forbid:["geopolitics"]},
    {name:"oil_supply_is_energy_market",item:{title:"اختلال در عرضه نفت خام",original_text:"کاهش صادرات نفت خام می‌تواند عرضه جهانی را محدود کند."},require:["oil_energy"]},
    {name:"inflation_measure_is_inflation_topic",item:{title:"تورم سالانه افزایش یافت",original_text:"شاخص قیمت مصرف‌کننده رشد تورم را نشان می‌دهد."},require:["inflation"]}
  ];
  const results=cases.map(c=>{
    const actual=classifyOne(c.item).themes;
    const forbidden=(c.forbid||[]).filter(x=>actual.includes(x));
    const missing=(c.require||[]).filter(x=>!actual.includes(x));
    return {name:c.name,passed:forbidden.length===0&&missing.length===0,actual,forbidden,missing};
  });
  return {total:results.length,passed:results.filter(x=>x.passed).length,failed:results.filter(x=>!x.passed).length,results};
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
function compareStructuredClaims(analyses) {
  const stop=new Set(["the","and","for","from","with","that","this","there","their","into","over","under","after","before","said","says","according","report","reported","officials","will","would","could","might","may","not","has","have","had","was","were","are","is","be","been","of","to","in","on","at","by","as","an","a","or","but","if","then","it","its","they","them","we","you","he","she","که","این","آن","برای","از","به","در","با","را","و","یا","اما","ولی","گفت","اعلام","کرد","شد","است","بود","می‌شود","می شود","خواهد","احتمال","ممکن","بر اساس","طبق","گزارش","مقام","مقامات","دولت","بانک","مرکزی"]);
  const tokens=value=>normalize(value).split(/[^a-z0-9\u0600-\u06ff]+/u).filter(t=>t.length>2&&!stop.has(t)&&!/^[0-9]+$/.test(t));
  const opposite=new Set(["increase:decrease","decrease:increase","resume:halt","halt:resume","approve:deny","deny:approve"]);
  const output=[];
  const atomicClaims=analysis=>(analysis.reading_comprehension?.claims||[]).flatMap(claim=>(claim.clauses||[]).map(clause=>({
    text:clause.text||claim.text||"",
    actors:[...new Set(clause.actor_candidates?.length?clause.actor_candidates:claim.actor_candidates||[])],
    actions:[...new Set(clause.action_concepts?.length?clause.action_concepts:claim.action_concepts||[])],
    negated:Boolean(clause.negated),
    conditional:Boolean(clause.conditional||claim.certainty==="conditional"),
    modal:Boolean(clause.modal||claim.certainty==="uncertain_or_possible"||claim.certainty==="forecast_or_projection"),
    years:claim.temporal_scope?.years||[],
    quantities:claim.quantities||[],
    sentence_index:claim.sentence_index,
    claim_id:claim.claim_id,
    source_status:claim.claim_source_status||"unknown"
  })));
  const seen=new Set();
  for(let i=0;i<analyses.length;i++){
    const a=analyses[i], claimsA=atomicClaims(a);
    for(let j=i+1;j<analyses.length;j++){
      const b=analyses[j];
      if(a.url&&b.url&&a.url===b.url) continue;
      const claimsB=atomicClaims(b);
      for(const ca of claimsA){
        if(!ca.actors.length||!ca.actions.length||ca.conditional||ca.modal) continue;
        const ta=new Set(tokens(ca.text));
        for(const cb of claimsB){
          if(!cb.actors.length||!cb.actions.length||cb.conditional||cb.modal) continue;
          const actors=ca.actors.filter(x=>cb.actors.includes(x));
          if(!actors.length) continue;
          const shared=[...ta].filter(x=>tokens(cb.text).includes(x));
          if(!shared.length) continue;
          const yearsA=ca.years||[],yearsB=cb.years||[];
          if(yearsA.length&&yearsB.length&&!yearsA.some(y=>yearsB.includes(y))) continue;
          const timeA=Date.parse(a.published_at||""),timeB=Date.parse(b.published_at||"");
          const publicationGap=Number.isFinite(timeA)&&Number.isFinite(timeB)?Math.abs(timeA-timeB):null;
          if(publicationGap!==null&&publicationGap>7*24*60*60*1000) continue;
          let conflict=null;
          for(const x of ca.actions) for(const y of cb.actions){
            if(opposite.has(x+":"+y)&&!ca.negated&&!cb.negated) conflict={kind:"opposite_action",left:x,right:y};
            if(x===y&&ca.negated!==cb.negated) conflict={kind:"opposite_polarity_same_action",left:x,right:y};
          }
          if(!conflict) {
            const qa=ca.quantities||[],qb=cb.quantities||[];
            for(const x of ca.actions) for(const y of cb.actions) if(x===y) {
              for(const na of qa) for(const nb of qb) {
                const ua=String(na.unit||"").toLowerCase(),ub=String(nb.unit||"").toLowerCase();
                if(ua&&ua===ub&&Number.isFinite(na.value)&&Number.isFinite(nb.value)&&na.value!==nb.value) {
                  conflict={kind:"numeric_disagreement_needs_measure_check",left:x,right:y,values:[na.value,nb.value],unit:ua};
                }
              }
            }
          }
          if(!conflict) continue;
          const key=[i,j,conflict.kind,actors.slice().sort().join(","),shared.slice().sort().join(","),conflict.left,conflict.right,yearsA.join(","),yearsB.join(",")].join(":");
          if(seen.has(key)) continue;
          seen.add(key);
          const sourceA=String(a.source||"").toLowerCase(),sourceB=String(b.source||"").toLowerCase();
          const independent=Boolean(sourceA&&sourceB&&sourceA!==sourceB);
          const explicitTime=yearsA.length&&yearsB.length&&yearsA.some(y=>yearsB.includes(y));
          const evidenceScore=(actors.length?0.3:0)+(shared.length?0.2:0)+(explicitTime?0.2:0)+(independent?0.2:0)+(publicationGap!==null?0.1:0);
          output.push({
            status:"potential_conflict_not_verified",
            conflict_kind:conflict.kind,
            evidence_grade:evidenceScore>=0.8?"strong_candidate":evidenceScore>=0.5?"moderate_candidate":"weak_candidate",
            evidence_score:Number(evidenceScore.toFixed(2)),
            matched_actors:actors,
            shared_topic_terms:shared.slice(0,8),
            source_independence:independent?"different_publisher_domains":"same_or_unknown_publisher_domain",
            publication_gap_hours:publicationGap===null?null:Number((publicationGap/3600000).toFixed(1)),
            temporal_compatibility:explicitTime?"same_explicit_year":yearsA.length&&yearsB.length?"different_explicit_years":"time_not_fully_resolved",
            claim_mode:"asserted_nonconditional_claims",
            left:{title:a.title,source:a.source,published_at:a.published_at,url:a.url,claim:ca.text,claim_id:ca.claim_id,certainty:ca.modal?"uncertain":ca.conditional?"conditional":"asserted",polarity:ca.negated?"negated":"affirmative",years:yearsA},
            right:{title:b.title,source:b.source,published_at:b.published_at,url:b.url,claim:cb.text,claim_id:cb.claim_id,certainty:cb.modal?"uncertain":cb.conditional?"conditional":"asserted",polarity:cb.negated?"negated":"affirmative",years:yearsB},
            verification_state:"unverified",
            required_next_checks:["open_both_original_sources","verify_same_entity_and_measure","compare_reference_dates_and_units","check_attribution_and_corrections","confirm_publisher_independence"]
          });
          if(output.length>=20) return output;
        }
      }
    }
  }
  return output;
}
function runStructuredConflictBenchmark() {
  const make=(title,body,source,date,url)=>({
    title,source,published_at:date,url,
    reading_comprehension:analyzeNewsReading(title,body,date)
  });
  const date="2026-11-14T10:00:00Z";
  const cases=[
    {name:"affirmative_vs_negated_same_actor_action",items:[
      make("Central bank raised interest rates in 2027.","The central bank raised interest rates in 2027.","source-a",date,"https://a.example/1"),
      make("Central bank did not raise interest rates in 2027.","The central bank did not raise interest rates in 2027.","source-b",date,"https://b.example/1")
    ],expect:true},
    {name:"opposite_actions_same_actor_and_period",items:[
      make("Central bank raised interest rates in 2027.","The central bank raised interest rates in 2027.","source-a",date,"https://a.example/2"),
      make("Central bank cut interest rates in 2027.","The central bank cut interest rates in 2027.","source-b",date,"https://b.example/2")
    ],expect:true},
    {name:"different_explicit_years_are_not_conflict",items:[
      make("Central bank raised interest rates in 2025.","The central bank raised interest rates in 2025.","source-a",date,"https://a.example/3"),
      make("Central bank cut interest rates in 2026.","The central bank cut interest rates in 2026.","source-b",date,"https://b.example/3")
    ],expect:false},
    {name:"conditional_forecast_is_not_asserted_fact_conflict",items:[
      make("Central bank raised interest rates in 2027.","The central bank raised interest rates in 2027.","source-a",date,"https://a.example/4"),
      make("Central bank may raise interest rates in 2027.","The central bank may raise interest rates in 2027.","source-b",date,"https://b.example/4")
    ],expect:false},
    {name:"different_actors_are_not_same_claim",items:[
      make("Central bank raised interest rates in 2027.","The central bank raised interest rates in 2027.","source-a",date,"https://a.example/5"),
      make("Government cut taxes in 2027.","The government cut taxes in 2027.","source-b",date,"https://b.example/5")
    ],expect:false},
    {name:"same_publisher_is_not_independent_confirmation",items:[
      make("Central bank raised interest rates in 2027.","The central bank raised interest rates in 2027.","same-source",date,"https://a.example/6"),
      make("Central bank did not raise interest rates in 2027.","The central bank did not raise interest rates in 2027.","same-source",date,"https://a.example/7")
    ],expect:true,independent:false},
    {name:"persian_affirmative_vs_negated_rate_action",items:[
      make("بانک مرکزی نرخ بهره را افزایش داد.","بانک مرکزی نرخ بهره را افزایش داد.","source-fa-a",date,"https://fa-a.example/1"),
      make("بانک مرکزی نرخ بهره را افزایش نداد.","بانک مرکزی نرخ بهره را افزایش نداد.","source-fa-b",date,"https://fa-b.example/1")
    ],expect:true},
    {name:"different_values_same_unit_require_measure_review",items:[
      make("Central bank raised interest rates by 0.25% in 2027.","The central bank raised interest rates by 0.25% in 2027.","source-a",date,"https://a.example/8"),
      make("Central bank raised interest rates by 0.50% in 2027.","The central bank raised interest rates by 0.50% in 2027.","source-b",date,"https://b.example/8")
    ],expect:true,kind:"numeric_disagreement_needs_measure_check"}
  ];
  const results=cases.map(c=>{
    const found=compareStructuredClaims(c.items);
    const detected=found.length>0;
    const independenceOk=c.independent===undefined||found.every(x=>x.source_independence==="same_or_unknown_publisher_domain");
    const kindOk=!c.kind||found.every(x=>x.conflict_kind===c.kind);
    return {name:c.name,passed:detected===c.expect&&independenceOk&&kindOk,detected,expected:c.expect,conflict_kinds:[...new Set(found.map(x=>x.conflict_kind))],candidate_count:found.length,source_independence:found[0]?.source_independence||null};
  });
  return {total:results.length,passed:results.filter(x=>x.passed).length,failed:results.filter(x=>!x.passed).length,results,scope:"synthetic regression cases; not a real-world accuracy estimate"};
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
    language_coverage:["fa","en"],english_understanding:["actor_extraction","market_entity_recognition","morphological_and_synonym_normalization","negation_and_modality","reported_speech","conditional_statements","sentence_level_frames","discourse_relations","time_framing","financial_amount_and_unit_extraction","b1_oriented_common_vocabulary","basic_tense_voice_condition_and_comparison_frames","c1_oriented_financial_and_macroeconomic_terminology","advanced_discourse_hedging_attribution_and_counterfactual_analysis","financial_market_glossary_60_plus_terms","terminology_self_test","introductory_broad_persian_financial_vocabulary","persian_to_financial_concept_mapping","persian_literature_genres_and_rhetorical_devices","bilingual_internal_comprehension_exam","general_english_and_persian_grammar_vocabulary_reading_writing_and_literature","idiom_and_proverb_recognition","metaphor_and_figurative_language","irony_and_sarcasm_candidate_detection","indirect_speech_act_detection","persian_taarof_and_english_politeness","rhetorical_questions","conversational_implicature","hedging_and_uncertainty","contextual_ambiguity_with_abstention"],news_analyzed:analyses.length,
    theme_classification_benchmark:runThemeClassificationBenchmark(),
    terminology_benchmark:terminologySelfTest(),
    persian_terminology_benchmark:persianTerminologySelfTest(),
    bilingual_comprehension_exam:languageComprehensionExam(),
    language_foundations_exam:languageFoundationsExam(),
    bilingual_lexicon:{concept_count:BILINGUAL_RELATION_LEXICON.length,core_bilingual_term_count:BILINGUAL_RELATION_LEXICON.length*2,relation_types:["translation_equivalence","same_semantic_domain","antonym"],benchmark:bilingualLexiconSelfTest()},
    independent_language_benchmark:independentLanguageBenchmark(),
    pragmatic_language:{version:PRAGMATICS_VERSION,phrase_count:PRAGMATICS_PHRASE_COUNT,benchmark:runPragmaticsBenchmark()},
    hard_news_comprehension:{version:NEWS_COMPREHENSION_VERSION,benchmark:runNewsComprehensionBenchmark(),challenge:getHardNewsChallenge()},
    news_reading_comprehension:{version:NEWS_READING_VERSION,benchmark:runNewsReadingBenchmark(),articles:analyses.slice(0,20).map(x=>({title:x.title,source:x.source,published_at:x.published_at,url:x.url,reading:x.reading_comprehension}))},
    formal_language:{version:FORMAL_REGISTER_VERSION,scope:["contemporary_official_persian","contemporary_formal_english","financial_and_economic_register","administrative_and_policy_prose","news_attribution_and_evidence_qualification"],benchmark:runFormalRegisterBenchmark(),register_counts:{formal:analyses.filter(x=>x.formal_register?.register==="formal_official_or_analytical").length,professional_or_mixed:analyses.filter(x=>x.formal_register?.register==="neutral_professional_or_mixed").length,conversational_or_unclear:analyses.filter(x=>x.formal_register?.register==="conversational_or_unclear").length}},
    persian_literary_topics_count:PERSIAN_LITERARY_TERMS.length,
    english_language_foundations_count:ENGLISH_LANGUAGE_FOUNDATIONS.length,
    bilingual_relation_lexicon_concepts:BILINGUAL_RELATION_LEXICON.length,
    persian_language_foundations_count:PERSIAN_LANGUAGE_FOUNDATIONS.length,
    persian_glossary_size:PERSIAN_MARKET_GLOSSARY.length,
    market_glossary_size:MARKET_GLOSSARY.length,
    news_with_excerpt:analyses.filter(x=>x.content_chars>0).length,
    excerpt_coverage_pct:analyses.length?Number((analyses.filter(x=>x.content_chars>0).length/analyses.length*100).toFixed(1)):0,
    themes:buildTopics(analyses,input),events:events.slice(0,30),
    numeric_mentions:numberMentions.slice(0,30),
    possible_conflicts:compareHeadlines(analyses),
    structured_claim_conflicts:compareStructuredClaims(analyses),
    structured_conflict_benchmark:runStructuredConflictBenchmark(),
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
