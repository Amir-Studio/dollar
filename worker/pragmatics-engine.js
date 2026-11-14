// Dollar bilingual pragmatics module.
// Curated phrase-level support for figurative language and conversational intent.
// This is deterministic NLP, not a generative model or human-level comprehension.
export const PRAGMATICS_VERSION = "dollar-pragmatics-0.2.0";

const normalize = value => String(value ?? "")
  .replace(/[ي]/g, "ی").replace(/[ك]/g, "ک").replace(/[ۀة]/g, "ه")
  .replace(/\u200c/g, " ").replace(/[\u064b-\u065f\u0670]/g, "")
  .toLocaleLowerCase("en-US").replace(/[^\p{L}\p{N}%]+/gu, " ").replace(/\s+/g, " ").trim();

const RULES = {
  fa: [
    { category:"idiom", label_fa:"اصطلاح و کنایه زبانی", entries:[
      ["از کاه کوه ساختن","بزرگ‌نمایی یک مسئله کوچک"],
      ["آب از سرش گذشته","کار از مرحله معمول گذشته است"],
      ["مو را از ماست کشیدن","بسیار دقیق و سخت‌گیرانه بررسی کردن"],
      ["نان کسی را آجر کردن","باعث از دست رفتن کار یا درآمد کسی شدن"],
      ["دست کسی را خواندن","نیت یا نقشه او را فهمیدن"]
    ]},
    { category:"metaphor", label_fa:"استعاره", entries:[
      ["او شیر میدان است","او بسیار شجاع است"],
      ["دریای غم","اندوه بسیار زیاد"],
      ["چراغ راه","راهنما یا عامل روشن‌کننده مسیر"],
      ["ریشه مشکلات","عامل بنیادی مشکلات"],
      ["بار سنگین مسئولیت","مسئولیت دشوار و پرزحمت"]
    ]},
    { category:"irony", label_fa:"کنایه وارونه / طنز موقعیتی", requires_context:true, entries:[
      ["چه به موقع رسیدی","در بافت تأخیر، انتقاد از دیر رسیدن"],
      ["عجب هوای خوبی","در بافت باران یا سرمای شدید، احتمالاً معنای وارونه"],
      ["چه عالی شد","در بافت نتیجه بد، احتمالاً نارضایتی"],
      ["دقیقاً همان چیزی که لازم داشتیم","در بافت مشکل تازه، احتمالاً طعنه"],
      ["واقعاً روز فوق العاده ای بود","در بافت اتفاقات ناخوشایند، احتمالاً کنایه"]
    ]},
    { category:"sarcasm", label_fa:"طعنه", requires_context:true, entries:[
      ["واقعاً شاهکار کردی","در بافت اشتباه، انتقاد طعنه‌آمیز"],
      ["چه نابغه ای","در بافت خطا، احتمالاً تمسخر یا انتقاد"],
      ["آفرین، همه چیز را خراب کردی","سرزنش با بیان طعنه‌آمیز"],
      ["دست مریزاد، باز هم دیر کردی","انتقاد از تکرار تأخیر"],
      ["به به، چه تصمیم عاقلانه ای","در بافت تصمیم زیان‌بار، انتقاد"]
    ]},
    { category:"indirect_request", label_fa:"درخواست غیرمستقیم", requires_context:true, entries:[
      ["اینجا کمی سرد است","ممکن است درخواست بستن پنجره یا گرم‌کردن محیط باشد"],
      ["پنجره باز مانده","ممکن است درخواست بستن پنجره باشد"],
      ["اتاق خیلی تاریک است","ممکن است درخواست روشن کردن چراغ باشد"],
      ["صدای تلویزیون زیاد است","ممکن است درخواست کم کردن صدا باشد"],
      ["آب تمام شده","ممکن است درخواست آوردن آب باشد"]
    ]},
    { category:"taarof", label_fa:"تعارف و ادب فرهنگی", requires_context:true, entries:[
      ["قابل شما را ندارد","تعارف برای کم‌اهمیت نشان دادن هدیه یا پذیرایی"],
      ["بفرمایید، در خدمتیم","دعوت مؤدبانه؛ میزان جدی بودن به موقعیت بستگی دارد"],
      ["زحمت کشیدید","قدردانی یا ادب اجتماعی"],
      ["اختیار دارید","پاسخ فروتنانه به تعریف یا تشکر"],
      ["اول شما بفرمایید","ادب یا تعارف در تقدم دادن"]
    ]},
    { category:"rhetorical_question", label_fa:"پرسش بلاغی", entries:[
      ["مگر می شود چنین چیزی را ندید","پرسش برای تأکید، نه لزوماً درخواست پاسخ"],
      ["چه کسی از موفقیت بدش می آید","پرسش برای تأکید بر پسندیده بودن موفقیت"],
      ["تا کی باید صبر کرد","بیان بی‌صبری یا اعتراض"],
      ["مگر قرار نبود امروز تمام شود","یادآوری همراه با اعتراض یا انتظار"],
      ["آیا بهتر از این هم می شد","پرسش تأکیدی؛ معنایش به بافت بستگی دارد"]
    ]},
    { category:"implicature", label_fa:"معنای ضمنی مکالمه", requires_context:true, entries:[
      ["ببینیم چه می شود","تعهد قطعی نمی‌دهد؛ تصمیم را به آینده موکول می‌کند"],
      ["فعلاً نظری ندارم","ممکن است پرهیز از اعلام موضع باشد"],
      ["باید بیشتر فکر کنم","ممکن است تردید یا رد مؤدبانه باشد"],
      ["شاید یک وقت دیگر","اغلب تعویق؛ لزوماً وعده قطعی نیست"],
      ["اگر فرصت شد","شرطی و نامطمئن؛ قول قطعی نیست"]
    ]},
    { category:"hedging", label_fa:"احتیاط و عدم قطعیت", entries:[
      ["شاید","بیان احتمال، نه قطعیت"],
      ["به نظر می رسد","برداشت یا ارزیابی، نه واقعیت اثبات‌شده"],
      ["احتمالاً","درجه‌ای از عدم قطعیت"],
      ["تا جایی که می دانم","محدود کردن دامنه ادعا به دانش گوینده"],
      ["نمی توان رد کرد","امکان را باز می‌گذارد، اما آن را اثبات نمی‌کند"]
    ]},
    { category:"ambiguity", label_fa:"ابهام وابسته به بافت", requires_context:true, entries:[
      ["باشه","می‌تواند موافقت، پذیرش موقت یا پایان بحث باشد"],
      ["جالبه","می‌تواند علاقه واقعی، تعجب یا پاسخ خنثی باشد"],
      ["هر طور راحتی","می‌تواند اختیار دادن یا نارضایتی غیرمستقیم باشد"],
      ["مشکلی نیست","می‌تواند اطمینان‌بخشی یا پنهان کردن ناراحتی باشد"],
      ["بعداً صحبت می کنیم","می‌تواند برنامه واقعی یا تعویق مکالمه باشد"]
    ]}
  ],
  en: [
    { category:"idiom", label_fa:"اصطلاح انگلیسی", entries:[
      ["break the ice","شروع تعامل و کاهش معذب بودن"],
      ["hit the nail on the head","دقیقاً به نکته اصلی اشاره کردن"],
      ["spill the beans","راز را فاش کردن"],
      ["a piece of cake","کاری بسیار آسان"],
      ["under the weather","کمی ناخوش یا بیمار بودن"]
    ]},
    { category:"metaphor", label_fa:"استعاره", entries:[
      ["time is money","زمان ارزش اقتصادی دارد"],
      ["a sea of troubles","مشکلات بسیار زیاد"],
      ["the heart of the problem","بخش یا علت اصلی مسئله"],
      ["a bridge between cultures","عامل پیونددهنده فرهنگ‌ها"],
      ["a wave of change","موج یا دوره‌ای از تغییر"]
    ]},
    { category:"irony", label_fa:"Irony / کنایه وارونه", requires_context:true, entries:[
      ["just what we needed","در بافت یک مشکل تازه، احتمالاً معنای وارونه"],
      ["what a lovely day","در بافت هوای بسیار بد، احتمالاً کنایه"],
      ["right on time","در بافت تأخیر، انتقاد غیرمستقیم"],
      ["could not be better","در بافت نتیجه بد، احتمالاً وارونه‌گویی"],
      ["that went perfectly","در بافت شکست، احتمالاً کنایه"]
    ]},
    { category:"sarcasm", label_fa:"Sarcasm / طعنه", requires_context:true, entries:[
      ["brilliant move","در بافت اشتباه، انتقاد طعنه‌آمیز"],
      ["well done, you broke it","سرزنش مستقیم با لحن طعنه‌آمیز"],
      ["genius idea","در بافت تصمیم بد، احتمالاً تمسخر"],
      ["great job being late again","انتقاد از تکرار تأخیر"],
      ["thanks for nothing","بیان نارضایتی، نه تشکر واقعی"]
    ]},
    { category:"indirect_request", label_fa:"درخواست غیرمستقیم", requires_context:true, entries:[
      ["it is cold in here","ممکن است درخواست بستن پنجره یا گرم‌کردن محیط باشد"],
      ["the window is still open","ممکن است درخواست بستن پنجره باشد"],
      ["it is rather dark","ممکن است درخواست روشن کردن چراغ باشد"],
      ["the music is quite loud","ممکن است درخواست کم کردن صدا باشد"],
      ["we are out of water","ممکن است درخواست آوردن آب باشد"]
    ]},
    { category:"politeness", label_fa:"ادب و تعارف", requires_context:true, entries:[
      ["make yourself at home","دعوت مؤدبانه برای احساس راحتی"],
      ["after you","تعارف برای مقدم دانستن دیگری"],
      ["my pleasure","پاسخ مؤدبانه به تشکر"],
      ["do not mention it","کم‌اهمیت جلوه دادن لطف از روی ادب"],
      ["would you mind","درخواست مؤدبانه، نه پرسش واقعی درباره ذهن"]
    ]},
    { category:"rhetorical_question", label_fa:"Rhetorical question / پرسش بلاغی", entries:[
      ["who would not want that","پرسش برای تأکید، نه لزوماً پاسخ"],
      ["is the sky blue","پرسش بلاغی برای بدیهی دانستن موضوع"],
      ["how many times do I have to say this","بیان کلافگی یا اعتراض"],
      ["does that make any sense","ممکن است اعتراض یا درخواست توضیح باشد"],
      ["what could possibly go wrong","در بافت خطر، می‌تواند کنایه باشد"]
    ]},
    { category:"implicature", label_fa:"Conversational implicature / معنای ضمنی", requires_context:true, entries:[
      ["i will think about it","ممکن است تردید یا رد مؤدبانه باشد؛ قول پذیرش نیست"],
      ["we will see","تعهد قطعی نمی‌دهد"],
      ["maybe another time","اغلب تعویق یا رد نرم"],
      ["that is an interesting idea","ممکن است تحسین، تردید یا پاسخ خنثی باشد"],
      ["i am not sure that will work","بیان تردید یا مخالفت محتاطانه"]
    ]},
    { category:"hedging", label_fa:"Hedging / احتیاط زبانی", entries:[
      ["perhaps","بیان احتمال"],
      ["it seems that","برداشت، نه قطعیت"],
      ["to the best of my knowledge","محدود کردن ادعا به دانش گوینده"],
      ["arguably","نشان می‌دهد ادعا قابل بحث است"],
      ["cannot be ruled out","امکان را باز می‌گذارد، نه اینکه اثبات کند"]
    ]},
    { category:"ambiguity", label_fa:"Contextual ambiguity / ابهام بافتی", requires_context:true, entries:[
      ["fine","می‌تواند رضایت واقعی یا پذیرش بی‌میل باشد"],
      ["sure","می‌تواند موافقت مشتاقانه یا پاسخ خنثی باشد"],
      ["interesting","می‌تواند علاقه، تعجب یا فاصله‌گذاری باشد"],
      ["whatever you want","می‌تواند اختیار دادن یا نارضایتی باشد"],
      ["we should talk later","می‌تواند برنامه واقعی یا تعویق باشد"]
    ]}
  ]
};

const PRIORITY = ["idiom","metaphor","sarcasm","irony","taarof","politeness","indirect_request","rhetorical_question","implicature","hedging","ambiguity"];

const CONTEXT_CUES = {
  fa: {
    negative:["خراب","بد","بدتر","شکست","اشتباه","دیر","مشکل","افتضاح","ناراحت","عصبانی","زیان","ضرر","سرد","باران","ناموفق","خرابی"],
    positive:["عالی","خوب","خوبی","موفق","درست","به موقع","خوشحال","سود","پیشرفت","زیبا","دلپذیر"],
    negation:["نه","نیست","نبود","نمی","هرگز","اصلاً","هیچ","بدون","قرار نیست"],
    contrast:["اما","ولی","با این حال","در حالی که","برعکس","هرچند","باوجود"]
  },
  en: {
    negative:["bad","worse","broken","failed","failure","mistake","late","problem","terrible","upset","angry","loss","cold","rain","unsuccessful","wrong"],
    positive:["great","good","successful","right","on time","happy","profit","progress","beautiful","lovely","perfect","brilliant","genius","well done"],
    negation:["not","no","never","without","isn't","aren't","wasn't","weren't","don't","doesn't","didn't","can't","cannot","won't"],
    contrast:["but","however","although","though","whereas","nevertheless","despite","in contrast"]
  }
};

const CONTEXT_DEPENDENT = new Set(["irony","sarcasm","indirect_request","taarof","politeness","implicature","ambiguity"]);

function hasTokenSequence(haystack, needle) {
  return (" " + haystack + " ").includes(" " + needle + " ");
}

function hasNegationNear(normalized, phrase) {
  const tokens = normalized.split(" ");
  const phraseTokens = phrase.split(" ");
  for (let i=0;i<=tokens.length-phraseTokens.length;i++) {
    if (tokens.slice(i,i+phraseTokens.length).join(" ") !== phrase) continue;
    const before = tokens.slice(Math.max(0,i-3),i);
    if (before.some(token => ["not","no","never","without","isnt","arent","wasnt","werent","dont","doesnt","didnt","cant","cannot","wont","نه","نیست","نبود","نمی","هرگز","اصلا","هیچ","بدون"].includes(token))) return true;
  }
  return false;
}

function isQuotedMention(originalText, phrase) {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g,"\\$&").replace(/\s+/g,"\\s+");
  const patterns = [
    new RegExp("[«“‘]" + escaped + "[»”’]","i"),
    new RegExp('["\\u0027]' + escaped + '["\\u0027]',"i")
  ];
  return patterns.some(pattern=>pattern.test(String(originalText||"")));
}

function detect(text, language, source="utterance") {
  const normalized = normalize(text);
  if (!normalized) return [];
  const matches = [];
  for (const group of RULES[language] || []) {
    for (const [phrase, meaning] of group.entries) {
      const needle = normalize(phrase);
      if (!needle || !hasTokenSequence(normalized,needle)) continue;
      const negated = hasNegationNear(normalized,needle);
      const quoted = isQuotedMention(text,phrase);
      matches.push({
        category:group.category,
        category_fa:group.label_fa,
        phrase,
        possible_meaning_fa:meaning,
        requires_context:group.requires_context === true || CONTEXT_DEPENDENT.has(group.category),
        source,
        negated,
        quoted_mention:quoted,
        usable_as_intent_evidence:!quoted && !(negated && CONTEXT_DEPENDENT.has(group.category))
      });
    }
  }
  return matches.sort((a,b) => {
    const length = normalize(b.phrase).length-normalize(a.phrase).length;
    return length || PRIORITY.indexOf(a.category)-PRIORITY.indexOf(b.category);
  });
}

function inspectContext(text, language) {
  const normalized=normalize(text);
  const cues=CONTEXT_CUES[language];
  const hits=list=>list.filter(term=>hasTokenSequence(normalized,normalize(term)));
  const negative=hits(cues.negative);
  const positive=hits(cues.positive);
  const negation=hits(cues.negation);
  const contrast=hits(cues.contrast);
  return {
    negative_cues:negative,
    positive_cues:positive,
    negation_cues:negation,
    contrast_cues:contrast,
    polarity:negative.length>positive.length?"negative":positive.length>negative.length?"positive":"mixed_or_unknown"
  };
}

export function analyzePragmatics(text, language, context = "") {
  const lang = language === "fa" || language === "en" ? language : (/[\u0600-\u06ff]/.test(String(text||"")) ? "fa" : "en");
  const utteranceSignals=detect(text,lang,"utterance");
  const contextSignals=detect(context,lang,"context");
  const signals=utteranceSignals.filter(signal=>signal.usable_as_intent_evidence);
  const contextFeatures=inspectContext(context,lang);
  const utteranceFeatures=inspectContext(text,lang);
  const categories=[...new Set(signals.map(x=>x.category))];
  const contextDependent=signals.some(x=>x.requires_context);
  const quotedOnly=utteranceSignals.length>0 && signals.length===0 && utteranceSignals.every(x=>x.quoted_mention);
  const contextHasNegative= contextFeatures.polarity==="negative";
  const contextHasPositive= contextFeatures.polarity==="positive";
  const ironyCandidates=signals.filter(x=>x.category==="irony"||x.category==="sarcasm");
  const ironyContextSupport=ironyCandidates.length>0 && (
    (utteranceFeatures.polarity==="positive" && contextHasNegative) ||
    (utteranceFeatures.polarity==="negative" && contextHasPositive) ||
    (contextFeatures.contrast_cues.length>0 && contextHasNegative && contextHasPositive)
  );
  const needsContext=contextDependent && !ironyContextSupport;
  const alternatives=[];
  if (categories.includes("ambiguity")) alternatives.push("موافقت واقعی","پذیرش موقت","پایان دادن به بحث","نارضایتی غیرمستقیم");
  if (categories.includes("indirect_request")) alternatives.push("گزارش ساده وضعیت","درخواست غیرمستقیم برای تغییر شرایط");
  if (categories.includes("implicature")) alternatives.push("تعویق تصمیم","تردید","رد مؤدبانه","پاسخ خنثی");
  if (ironyCandidates.length) alternatives.push("تعریف واقعی","طعنه یا کنایه وابسته به موقعیت");
  const strongest=signals[0]||null;
  const confidence=quotedOnly?0.9:!signals.length?0.2:contextDependent?(ironyContextSupport?0.68:0.42):0.78;
  let status;
  if (quotedOnly) status="quoted_mention_not_intent";
  else if (!signals.length) status="no_known_marker";
  else if (categories.includes("ambiguity")) status="ambiguous_multiple_readings";
  else if (ironyContextSupport) status="context_supported_candidate";
  else if (needsContext) status="context_required";
  else status="known_expression_match";
  return {
    language:lang,
    categories,
    signals,
    context_signals:contextSignals.map(({phrase,category,possible_meaning_fa})=>({phrase,category,possible_meaning_fa})),
    context_features:contextFeatures,
    possible_intent_fa:quotedOnly
      ? "عبارت در متن نقل یا بررسی شده است؛ نباید آن را قصد واقعی گوینده تلقی کرد."
      : !strongest
        ? "نشانه شناخته‌شده‌ای پیدا نشد؛ این به معنی نبود کنایه یا منظور ضمنی نیست."
        : needsContext
          ? "چند برداشت ممکن است؛ برای تعیین منظور، جمله‌های قبل و بعد و موقعیت لازم است."
          : strongest.possible_meaning_fa,
    alternative_readings:alternatives,
    interpretation_status:status,
    confidence_estimate:confidence,
    confidence_is_calibrated:false,
    requires_more_context:needsContext,
    context_supports_irony_candidate:ironyContextSupport,
    safety_rule:"این خروجی برداشت احتمالی است؛ از روی یک عبارت به‌تنهایی احساس، نیت یا صداقت گوینده را قطعی اعلام نکن."
  };
}

export function runPragmaticsBenchmark() {
  const results = [];
  for (const language of ["fa","en"]) {
    for (const group of RULES[language]) {
      for (const [phrase] of group.entries) {
        const found = detect(phrase, language);
        results.push({
          language,
          expected_category:group.category,
          phrase,
          detected_categories:[...new Set(found.map(x=>x.category))],
          passed:found.some(x=>x.category===group.category)
        });
      }
    }
  }
  const summarize = language => {
    const subset = results.filter(x=>x.language===language);
    const passed = subset.filter(x=>x.passed).length;
    return {
      total:subset.length,
      matched:passed,
      missed:subset.length-passed,
      phrase_recognition_pct:subset.length ? Number((passed/subset.length*100).toFixed(1)) : null,
      failures:subset.filter(x=>!x.passed).map(x=>({phrase:x.phrase,expected:x.expected_category,detected:x.detected_categories}))
    };
  };
  return {
    benchmark:"curated_bilingual_pragmatic_phrase_recognition",
    total:results.length,
    passed:results.filter(x=>x.passed).length,
    score_pct:results.length ? Number((results.filter(x=>x.passed).length/results.length*100).toFixed(1)) : null,
    persian:summarize("fa"),
    english:summarize("en"),
    categories_per_language:RULES.fa.length,
    limitations:[
      "This is phrase-level recognition of the curated examples, not a 100-question test of general language comprehension.",
      "The score is not human-validated and must not be presented as general AI accuracy.",
      "Irony, sarcasm, indirect requests, politeness and implicature require conversational context; this engine only flags possible readings.",
      "Unseen expressions, dialects, cultural variation and multi-turn intent may be missed."
    ],
  };
}

export const PRAGMATICS_CATEGORY_COUNT = RULES.fa.length;
export const PRAGMATICS_PHRASE_COUNT = Object.values(RULES).reduce((sum, groups)=>sum+groups.reduce((n,g)=>n+g.entries.length,0),0);
