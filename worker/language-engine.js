// Dollar Market Language Engine v0.1
// Lightweight, deterministic Persian/English domain NLP. It does not claim to be a generative LLM.
const VERSION = "dollar-domain-nlp-1.0.0";

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
function extractLanguageFoundations(text,language="en") {
 const t=normalize(text),dict=language==="fa"?PERSIAN_LANGUAGE_FOUNDATIONS:ENGLISH_LANGUAGE_FOUNDATIONS;
 return dict.filter(item=>item.terms.some(term=>t.includes(normalize(term)))).map(item=>({id:item.id,meaning_fa:item.fa}));
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

function languageIsEnglish(title) { return !/[\u0600-\u06ff]/.test(String(title||"")); }
function classifyOne(item) {
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
  const b1 = languageIsEnglish(title) ? analyzeB1English(text) : null;
  const c1 = languageIsEnglish(title) ? analyzeC1English(text) : null;
  const glossaryTerms = languageIsEnglish(title) ? extractMarketGlossary(text) : extractPersianMarketGlossary(text);
  const persianLiterature = languageIsEnglish(title) ? null : analyzePersianLiterature(title + " " + body);
  const languageFoundations = extractLanguageFoundations(title + " " + body,languageIsEnglish(title)?"en":"fa");
  const language = /[\u0600-\u06ff]/.test(title) ? "fa" : "en";
  const confidence = Math.min(0.92,0.2+themeHits.length*0.10+events.length*0.12+(numberMentions.length?0.05:0)+(english.actors.length?0.04:0))*(uncertain||english.assertion==="conditional"||english.assertion==="forecast_or_possibility"?0.7:1);
  return {
    title,source:item?.domain||item?.source_id||null,published_at:item?.published_at||null,url:item?.url||null,
    language,content_chars:body.length,input_mode:body.length?"headline_plus_rss_excerpt":"headline_only",
    themes:themeHits.map(t=>t.id),events,wording_tone:tone,uncertain,
    english_semantics:language==="en"?{...english,b1_analysis:b1,c1_analysis:c1,market_glossary:glossaryTerms}:null,
    persian_literature:persianLiterature,
    language_foundations:languageFoundations,
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
    language_coverage:["fa","en"],english_understanding:["actor_extraction","market_entity_recognition","morphological_and_synonym_normalization","negation_and_modality","reported_speech","conditional_statements","sentence_level_frames","discourse_relations","time_framing","financial_amount_and_unit_extraction","b1_oriented_common_vocabulary","basic_tense_voice_condition_and_comparison_frames","c1_oriented_financial_and_macroeconomic_terminology","advanced_discourse_hedging_attribution_and_counterfactual_analysis","financial_market_glossary_60_plus_terms","terminology_self_test","introductory_broad_persian_financial_vocabulary","persian_to_financial_concept_mapping","persian_literature_genres_and_rhetorical_devices","bilingual_internal_comprehension_exam","general_english_and_persian_grammar_vocabulary_reading_writing_and_literature"],news_analyzed:analyses.length,
    terminology_benchmark:terminologySelfTest(),
    persian_terminology_benchmark:persianTerminologySelfTest(),
    bilingual_comprehension_exam:languageComprehensionExam(),
    language_foundations_exam:languageFoundationsExam(),
    persian_literary_topics_count:PERSIAN_LITERARY_TERMS.length,
    english_language_foundations_count:ENGLISH_LANGUAGE_FOUNDATIONS.length,
    persian_language_foundations_count:PERSIAN_LANGUAGE_FOUNDATIONS.length,
    persian_glossary_size:PERSIAN_MARKET_GLOSSARY.length,
    market_glossary_size:MARKET_GLOSSARY.length,
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
