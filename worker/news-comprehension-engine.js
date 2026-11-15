// Dollar hard-news comprehension benchmark v1.0
// Deterministic, auditable comprehension diagnostics. This is not an LLM and does not train model weights.
export const NEWS_COMPREHENSION_VERSION = "dollar-hard-news-comprehension-1.0.0";

const normalize = value => String(value ?? "")
  .replace(/[ي]/g,"ی").replace(/[ك]/g,"ک").replace(/\u200c/g," ")
  .toLocaleLowerCase("en-US").replace(/[^\p{L}\p{N}%$€£.+-]+/gu," ").replace(/\s+/g," ").trim();

function inspectSentence(sentence) {
  const t=normalize(sentence);
  return {
    attribution:/\b(according to|the report (?:says|states|notes|warns|finds)|officials (?:said|warned)|the (?:fed|federal reserve|imf) (?:said|reported|found))\b/.test(t),
    causal:/\b(because|due to|owing to|therefore|thereby|as a result|led to|leads to|resulted in|contributed to|driven by|stemming from|amplif(?:y|ies|ied))\b/.test(t),
    contrast:/\b(although|however|whereas|while|nevertheless|nonetheless|by contrast|despite|notwithstanding|but)\b/.test(t),
    conditional:/\b(if|unless|provided that|subject to|in the event that|could|may|might|potentially)\b/.test(t),
    negation:/\b(not|no|never|neither|does not|did not|cannot|can't|won't|isn't|aren't|not necessarily|doesn't)\b/.test(t),
    comparison:/\b(compared with|compared to|similar to|resembles|unlike|more than|less than|higher than|lower than|one third|one-third|percentage points)\b/.test(t)||/\bcompares?\b.{0,80}\bwith\b/.test(t),
    passive:/\b(was|were|is|are|has been|have been|could be|may be)\s+\w+(?:ed|en)\b/.test(t),
    modal:/\b(may|might|could|would|should|potentially|possibly|likely|unlikely|expected to|projected to)\b/.test(t),
    time:/\b(by october|currently|already|future|next year|in 2026|in 2027|over time|since|during|after|before)\b/.test(t)
  };
}

function makeExamples() {
  const out=[];
  const drivers=["AI infrastructure spending","data-center construction","higher borrowing costs","weaker earnings expectations","rapid credit expansion"];
  const outcomes=["greater demand for capital","tighter financing conditions","a reassessment of valuations","lower business investment","more financial-system exposure"];
  const sources=["the Federal Reserve report","the central bank statement","the IMF assessment","the regulator's filing","the published survey"];
  const claims=["the risk is material","the outlook remains uncertain","the evidence is incomplete","the estimate is preliminary","the exposure may increase"];
  const sectors=["data-center finance","corporate credit","technology investment","bond markets","the wider economy"];
  const counterpoints=["the comparison is not proof of identical outcomes","the estimate is not a confirmed loss","the risk is not the same as a realized event","the relationship does not establish causation","the projection is not a guaranteed outcome"];
  const patterns=[
    {id:"causal",expected:"causal",build:(i,j)=>drivers[i]+" contributed to "+outcomes[j]+"."},
    {id:"contrast",expected:"contrast",build:(i,j)=>"Although "+drivers[i]+" is expanding, "+outcomes[j]+" remains a concern."},
    {id:"conditional_modality",expected:"conditional",build:(i,j)=>"If "+drivers[i]+" slows, "+outcomes[j]+" could follow."},
    {id:"attribution",expected:"attribution",build:(i,j)=>"According to "+sources[i]+", "+claims[j]+"."},
    {id:"negation",expected:"negation",build:(i,j)=>"The evidence does not establish that "+drivers[i]+" will cause "+outcomes[j]+"."},
    {id:"comparison",expected:"comparison",build:(i,j)=>"The report compares "+sectors[i]+" with "+sectors[j]+", while noting that "+counterpoints[(i+j)%5]+"."},
    {id:"passive_voice",expected:"passive",build:(i,j)=>"The exposure was assessed by "+sources[i]+"; "+claims[j]+"."},
    {id:"time_frame",expected:"time",build:(i,j)=>"By October, "+drivers[i]+" had affected "+outcomes[j]+"; the future effect remains uncertain."}
  ];
  for(const p of patterns){
    for(let i=0;i<5;i++) for(let j=0;j<5;j++){
      const text=p.build(i,j);
      const detected=inspectSentence(text);
      out.push({id:p.id+"_"+String(i+1).padStart(2,"0")+"_"+String(j+1).padStart(2,"0"),category:p.id,text,passed:detected[p.expected]===true});
    }
  }
  return out;
}

const HARD_NEWS_PASSAGE = [
  "The Federal Reserve's semiannual Financial Stability Report says that concerns about AI-related financial risks have become more prominent among people consulted by the central bank: 87% mentioned them, compared with 50% in the previous survey in May. That is a rise of 37 percentage points in the share of respondents, not a 37% increase in the value of financial assets.",
  "The report also points to rapid borrowing connected with data centers and advanced computing. Issuance reached about $680 billion by October 2026, close to one-third of nonfinancial investment-grade corporate debt issuance over the period. Separately, debt, guarantees and future lease commitments associated with this infrastructure could exceed $3 trillion; this is a potential combined exposure, not a statement that $3 trillion has already been lost or borrowed in cash.",
  "The central concern is a possible chain reaction: if expected AI-related earnings fail to justify current valuations, investors may reprice technology assets; a broad correction could then tighten credit conditions and reduce investment. High leverage at some hedge funds could amplify market stress, although the report does not say that such a correction is certain or that AI investment itself is necessarily unproductive.",
  "The Federal Reserve compares the scale and financing structure of the current investment cycle with the late-1990s telecommunications build-out. The analogy is a warning about financing concentration and optimistic expectations, not proof that the same outcome will occur."
].join(" ");

function analyzeHardNews() {
  const sentences=HARD_NEWS_PASSAGE.split(/(?<=[.!?])\s+/).filter(Boolean);
  const features=sentences.map((sentence,index)=>({sentence_index:index+1,...inspectSentence(sentence)}));
  const all=normalize(HARD_NEWS_PASSAGE);
  const pct=[...HARD_NEWS_PASSAGE.matchAll(/(\d+(?:\.\d+)?)\s*%/g)].map(m=>Number(m[1]));
  const money=[...HARD_NEWS_PASSAGE.matchAll(/\$\s?(\d+(?:\.\d+)?)\s*(billion|trillion)/gi)].map(m=>({value:Number(m[1]),unit:m[2].toLowerCase()}));
  const checks=[
    {id:"survey_share_is_not_asset_loss",passed:/87%\s+mentioned them/.test(HARD_NEWS_PASSAGE)&&/share of respondents/.test(HARD_NEWS_PASSAGE)},
    {id:"percentage_point_change",passed:pct.length>=2&&pct[0]-pct[1]===37&&/37 percentage points/.test(HARD_NEWS_PASSAGE)},
    {id:"issuance_is_separate_from_total_exposure",passed:/issuance reached about \$680 billion/i.test(HARD_NEWS_PASSAGE)&&/could exceed \$3 trillion/.test(HARD_NEWS_PASSAGE)},
    {id:"future_exposure_is_not_realized_loss",passed:/could exceed \$3 trillion/.test(HARD_NEWS_PASSAGE)&&/not a statement that \$3 trillion has already been lost/.test(HARD_NEWS_PASSAGE)},
    {id:"earnings_to_valuation_to_credit_chain",passed:/if expected AI-related earnings fail/.test(HARD_NEWS_PASSAGE)&&/reprice technology assets/.test(HARD_NEWS_PASSAGE)&&/tighten credit conditions and reduce investment/.test(HARD_NEWS_PASSAGE)},
    {id:"hedge_fund_leverage_is_amplifier_not_primary_cause",passed:/could amplify market stress/.test(HARD_NEWS_PASSAGE)},
    {id:"historical_analogy_is_not_prediction",passed:/compares the scale/.test(HARD_NEWS_PASSAGE)&&/not proof that the same outcome will occur/.test(HARD_NEWS_PASSAGE)},
    {id:"conditional_risk_not_certain_event",passed:/may reprice/.test(HARD_NEWS_PASSAGE)&&/does not say that such a correction is certain/.test(HARD_NEWS_PASSAGE)}
  ];
  return {
    source_basis:"Reuters report dated 13 November 2026 on the Federal Reserve Financial Stability Report; challenge passage is an original paraphrase, not a reproduced article.",
    source_url:"https://www.reuters.com/business/finance/ai-rockets-top-worries-about-financial-system-latest-fed-survey-2026-11-13/",
    passage:HARD_NEWS_PASSAGE,
    sentence_count:sentences.length,
    grammar_diagnostics:{
      attribution_sentences:features.filter(x=>x.attribution).length,
      causal_sentences:features.filter(x=>x.causal).length,
      contrast_sentences:features.filter(x=>x.contrast).length,
      conditional_or_modal_sentences:features.filter(x=>x.conditional||x.modal).length,
      negation_sentences:features.filter(x=>x.negation).length,
      comparison_sentences:features.filter(x=>x.comparison).length,
      passive_sentences:features.filter(x=>x.passive).length,
      temporal_sentences:features.filter(x=>x.time).length
    },
    extracted_figures:{percentages:pct,money,percentage_point_difference:pct.length>=2?pct[0]-pct[1]:null},
    vocabulary_focus:[
      {term:"semiannual",fa:"شش‌ماهه؛ هر شش ماه یک‌بار",category:"time",related:["annual","quarterly"]},
      {term:"financial stability",fa:"ثبات مالی؛ توان نظام مالی برای جذب شوک بدون اختلال گسترده",category:"macro_finance",related:["systemic risk","financial instability"]},
      {term:"systemic risk",fa:"ریسک سیستمی؛ خطری که می‌تواند از یک بخش به کل نظام مالی سرایت کند",category:"risk",related:["contagion","financial stability"]},
      {term:"issuance",fa:"انتشار اوراق یا بدهی جدید؛ با کل بدهی موجود یکسان نیست",category:"debt",related:["outstanding debt","borrowing"]},
      {term:"investment-grade",fa:"دارای درجه اعتباری سرمایه‌گذاری؛ رتبه اعتباری بالاتر از اوراق پرریسک",category:"credit",related:["high-yield","credit rating"]},
      {term:"corporate debt",fa:"بدهی شرکت‌ها؛ تعهدات مالی شرکت‌ها به وام‌دهندگان یا دارندگان اوراق",category:"debt",related:["sovereign debt","leverage"]},
      {term:"guarantee",fa:"ضمانت؛ تعهد پرداخت در صورت ناتوانی بدهکار اصلی",category:"finance",related:["contingent liability","collateral"]},
      {term:"lease commitment",fa:"تعهد اجاره؛ پرداخت‌های قراردادی آینده برای استفاده از دارایی",category:"accounting",related:["liability","future obligation"]},
      {term:"exposure",fa:"میزان درمعرض‌بودن نسبت به یک ریسک یا تعهد؛ لزوماً زیان تحقق‌یافته نیست",category:"risk",related:["potential loss","risk concentration"]},
      {term:"valuation",fa:"ارزش‌گذاری؛ برآورد ارزش یک دارایی یا شرکت",category:"markets",related:["market capitalization","earnings expectations"]},
      {term:"earnings",fa:"سود یا درآمد حسابداری شرکت؛ در این متن مبنای توجیه ارزش‌گذاری",category:"corporate_finance",related:["revenue","profitability"]},
      {term:"repricing",fa:"قیمت‌گذاری مجدد؛ تغییر ارزش دارایی با به‌روزرسانی انتظارات",category:"markets",related:["revaluation","sell-off"]},
      {term:"market correction",fa:"اصلاح بازار؛ افت معنادار قیمت‌ها پس از رشد یا ارزش‌گذاری بیش‌ازحد",category:"markets",related:["market crash","pullback"]},
      {term:"credit conditions",fa:"شرایط اعتباری؛ میزان دسترسی وام‌گیرندگان به اعتبار و هزینه آن",category:"credit",related:["borrowing costs","liquidity"]},
      {term:"leverage",fa:"اهرم مالی؛ استفاده از بدهی برای بزرگ‌کردن موقعیت مالی و هم‌زمان تشدید ریسک",category:"risk",related:["debt","margin"]},
      {term:"amplify",fa:"تشدید یا بزرگ‌تر کردن اثر؛ عامل تقویت‌کننده لزوماً علت اولیه نیست",category:"causality",related:["magnify","mitigate"]},
      {term:"telecommunications build-out",fa:"گسترش زیرساخت مخابراتی؛ نمونه تاریخی برای مقایسه چرخه سرمایه‌گذاری",category:"historical_analogy",related:["infrastructure boom","capital expenditure"]},
      {term:"percentage point",fa:"واحد اختلاف مستقیم دو نرخ درصدی؛ تغییر از ۵۰٪ به ۸۷٪ برابر ۳۷ واحد درصد است",category:"statistics",related:["percent change","relative change"]}
    ],
    grammar_focus:[
      {pattern:"According to / the report says",fa:"گزارش‌دهی و انتساب ادعا؛ مشخص می‌کند اطلاعات از چه منبعی آمده و الزاماً تأیید مستقل نیست."},
      {pattern:"87%, compared with 50%",fa:"ساختار مقایسه‌ای؛ دو مقدار را کنار هم می‌گذارد. اختلاف آن‌ها ۳۷ واحد درصد است، نه ۳۷ درصد رشد نسبی."},
      {pattern:"could exceed",fa:"فعل وجهی + مصدر؛ امکان یا برآورد آینده را نشان می‌دهد، نه وقوع قطعی."},
      {pattern:"If ... may/could ...",fa:"جمله شرطی و پیامد احتمالی؛ بخش دوم نتیجه قطعی نیست."},
      {pattern:"Although ..., ...",fa:"جمله امتیازی/تضادی؛ بخش دوم را در برابر انتظار حاصل از بخش اول قرار می‌دهد."},
      {pattern:"was compared / was assessed",fa:"ساختار مجهول؛ تمرکز روی رویداد یا موضوع است، نه انجام‌دهنده."},
      {pattern:"not necessarily / does not establish",fa:"محدودسازی استنتاج؛ داده ممکن است با یک برداشت سازگار باشد اما آن را اثبات نکند."},
      {pattern:"could then tighten ... and reduce ...",fa:"زنجیره پیامد با قید احتمال؛ دو اثر بعدی را به یک سناریوی مشروط وصل می‌کند."}
    ],
    concept_relations:[
      {from:"AI infrastructure investment",relation:"requires financing",to:"corporate borrowing / debt / guarantees / leases"},
      {from:"optimistic earnings expectations",relation:"support",to:"high asset valuations"},
      {from:"weaker-than-expected earnings",relation:"may trigger",to:"valuation reassessment"},
      {from:"valuation reassessment",relation:"could lead to",to:"market correction"},
      {from:"market correction",relation:"may tighten",to:"credit conditions"},
      {from:"tighter credit conditions",relation:"may reduce",to:"new investment"},
      {from:"hedge-fund leverage",relation:"may amplify",to:"market stress"}
    ],
    semantic_checks:checks,
    passed:checks.filter(x=>x.passed).length,
    total:checks.length,
    score_pct:Number((checks.filter(x=>x.passed).length/checks.length*100).toFixed(1)),
    limitations:[
      "This is deterministic pattern-based checking of a controlled paraphrase, not proof of open-domain reading comprehension.",
      "The 200 examples are a regression and diagnostic corpus, not gradient-based model training.",
      "A real deployment still needs human-labelled unseen articles and an independent semantic evaluator."
    ]
  };
}

function analyzeSecondHardNews() {
  const passage=[
    "The IMF's October 2026 World Economic Outlook projects global growth of 3.1% in 2026 and 3.4% in 2027. Global headline inflation is projected at 4.7% in 2026 before easing to 4.1% in 2027.",
    "Those global averages conceal an uneven distribution of gains and losses. Economies linked to AI-related exports and investment may receive a demand boost, while energy-importing countries with limited participation in technology supply chains face higher import bills, exchange-rate pressure, weaker real incomes and less fiscal room.",
    "The report distinguishes physical disruptions to commodity supply from geopolitical uncertainty alone: a prolonged interruption to actual energy supply can have larger and more persistent macroeconomic effects. Inventory drawdowns, shipment rerouting and fiscal support have helped absorb shocks, but these buffers are not unlimited.",
    "The balance of risks is tilted to the downside, which describes the direction of risks around the projection rather than a certainty that the forecast will fail. A reassessment of AI profitability could reduce investment, depress asset prices and tighten financial conditions, with spillovers to economies connected to technology supply chains."
  ].join(" ");
  const checks=[
    {id:"growth_forecasts_keep_years_attached",passed:/3\.1%\s+in 2026/.test(passage)&&/3\.4%\s+in 2027/.test(passage)},
    {id:"inflation_rises_then_eases",passed:/4\.7%\s+in 2026/.test(passage)&&/easing to 4\.1%\s+in 2027/.test(passage)},
    {id:"global_average_masks_uneven_outcomes",passed:/global averages conceal an uneven distribution/.test(passage)},
    {id:"ai_benefit_is_not_uniform",passed:/AI-related exports and investment may receive a demand boost/.test(passage)&&/energy-importing countries with limited participation/.test(passage)},
    {id:"physical_supply_disruption_differs_from_geopolitical_uncertainty",passed:/physical disruptions to commodity supply/.test(passage)&&/larger and more persistent macroeconomic effects/.test(passage)},
    {id:"buffers_are_finite",passed:/inventory drawdowns/i.test(passage)&&/buffers are not unlimited/i.test(passage)},
    {id:"downside_risk_is_not_certainty",passed:/tilted to the downside/.test(passage)&&/rather than a certainty/.test(passage)},
    {id:"ai_reassessment_spillover_chain",passed:/reassessment of AI profitability could reduce investment/.test(passage)&&/depress asset prices and tighten financial conditions/.test(passage)&&/spillovers/.test(passage)}
  ];
  return {
    source_basis:"Original paraphrase of the IMF October 2026 World Economic Outlook executive summary.",
    source_url:"https://www.imf.org/-/media/files/publications/weo/2026/october/english/execsum.pdf",
    passage,
    semantic_checks:checks,
    passed:checks.filter(x=>x.passed).length,
    total:checks.length,
    score_pct:Number((checks.filter(x=>x.passed).length/checks.length*100).toFixed(1)),
    vocabulary_focus:[
      {term:"uneven growth",fa:"رشد نامتوازن؛ توزیع نابرابر رشد میان کشورها و بخش‌ها"},
      {term:"terms of trade",fa:"رابطه مبادله؛ نسبت قیمت صادرات به قیمت واردات"},
      {term:"import bill",fa:"هزینه کل واردات"},
      {term:"exchange-rate pressure",fa:"فشار بر نرخ ارز"},
      {term:"fiscal space",fa:"فضای مالی دولت؛ ظرفیت افزایش هزینه یا کاهش مالیات بدون به‌خطرانداختن پایداری مالی"},
      {term:"supply disruption",fa:"اختلال عرضه؛ کاهش یا توقف جریان واقعی کالا"},
      {term:"inventory drawdown",fa:"کاهش موجودی انبار برای پاسخ به کمبود عرضه"},
      {term:"spillover",fa:"سرریز؛ انتقال اثر یک شوک به کشور یا بخش دیگر"},
      {term:"downside risk",fa:"ریسک نزولی؛ احتمال انحراف نامطلوب از پیش‌بینی پایه"},
      {term:"real income",fa:"درآمد واقعی؛ قدرت خرید پس از تعدیل تورم"},
      {term:"resilience",fa:"تاب‌آوری؛ توان تحمل شوک و ادامه عملکرد"},
      {term:"fragmentation",fa:"چندپارگی اقتصادی یا تجاری؛ تکه‌تکه‌شدن شبکه‌های جهانی"}
    ],
    grammar_focus:[
      {pattern:"is projected at ... before easing to ...",fa:"ساختار مجهولِ پیش‌بینی + before برای ترتیب زمانی و تغییر مسیر"},
      {pattern:"while ... face ...",fa:"while برای نشان دادن تفاوت هم‌زمان میان دو گروه"},
      {pattern:"which describes ... rather than ...",fa:"بند موصولی توضیحی و تقابل برای جلوگیری از برداشت قطعی"},
      {pattern:"could reduce ... with spillovers to ...",fa:"وجه احتمالی could و عبارت با with برای توضیح پیامدهای همراه"}
    ]
  };
}

export function runNewsComprehensionBenchmark() {
  const examples=makeExamples();
  const hard=analyzeHardNews();
  const secondHard=analyzeSecondHardNews();
  const passed=examples.filter(x=>x.passed).length;
  const categories={};
  for(const x of examples){const c=categories[x.category]||(categories[x.category]={total:0,passed:0});c.total++;if(x.passed)c.passed++;}
  return {
    version:NEWS_COMPREHENSION_VERSION,
    benchmark_type:"deterministic_news_grammar_discourse_regression",
    example_count:examples.length,
    examples_passed:passed,
    examples_failed:examples.length-passed,
    example_score_pct:Number((passed/examples.length*100).toFixed(1)),
    category_results:categories,
    difficult_real_news_case:{...hard,passage:undefined},
    second_real_news_case:{...secondHard,passage:undefined},
    example_samples:examples.filter((x,i)=>i%25===0).slice(0,8),
    overall_status:passed===examples.length&&hard.passed===hard.total&&secondHard.passed===secondHard.total?"pass":"needs_debugging",
    limitations:hard.limitations
  };
}

export function getHardNewsChallenge() {
  return analyzeHardNews();
}
