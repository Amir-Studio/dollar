// Arabic academic-depth analysis layer for Dollar Market Intelligence.
// Deterministic morphology/syntax/discourse heuristics. This is NOT a trained LLM,
// a complete Arabic parser, a translation system, or a substitute for expert review.
export const ARABIC_ENGINE_VERSION = "arabic-academic-layer-1.0.0";

const DIACRITICS = /[\u064b-\u065f\u0670\u06d6-\u06ed]/g;
const TATWEEL = /\u0640/g;
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";
const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

export function normalizeArabic(value = "") {
  return String(value).normalize("NFKC")
    .replace(TATWEEL, "")
    .replace(DIACRITICS, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/[\u200c\u200f\u202a-\u202e]/g, " ")
    .replace(/[٠-٩]/g, d => String(ARABIC_DIGITS.indexOf(d)))
    .replace(/[۰-۹]/g, d => String(PERSIAN_DIGITS.indexOf(d)))
    .replace(/٫/g, ".").replace(/٬/g, ",")
    .replace(/\s+/g, " ").trim();
}

const DIALECT_MARKERS = {
  egyptian: ["مش", "عايز", "عاوز", "إزاي", "ازاي", "ليه", "دلوقتي", "هن", "احنا", "بتاع"],
  gulf: ["وش", "إيش", "ابغى", "أبغى", "مو", "مب", "الحين", "يا هلا", "ترى"],
  levantine: ["شو", "بدّي", "بدي", "هلأ", "هلق", "كتير", "منيح", "مش", "رح"],
  iraqi: ["شلون", "شنو", "هسه", "ماكو", "أكو", "مو", "راح"],
  maghrebi: ["بزاف", "واش", "دابا", "ديال", "ماشي", "كاين", "بصح"]
};

const FINANCE = [
  ["central_bank", ["البنك المركزي", "مصرف مركزي", "المصرف المركزي", "بنك مركزي"]],
  ["interest_rate", ["سعر الفائدة", "أسعار الفائدة", "سعر الخصم", "الفائدة الأساسية", "معدل الفائدة"]],
  ["inflation", ["التضخم", "التضخم الأساسي", "غلاء الأسعار", "ارتفاع الأسعار"]],
  ["exchange_rate", ["سعر الصرف", "أسعار الصرف", "سوق الصرف", "سعر العملة"]],
  ["currency_devaluation", ["خفض قيمة العملة", "تعويم العملة", "تحرير سعر الصرف", "انخفاض قيمة العملة"]],
  ["foreign_reserves", ["الاحتياطيات الأجنبية", "الاحتياطي النقدي", "احتياطي العملات"]],
  ["liquidity", ["السيولة", "شح السيولة", "أزمة السيولة"]],
  ["public_debt", ["الدين العام", "خدمة الدين", "سندات الخزانة"]],
  ["fiscal_policy", ["السياسة المالية", "العجز المالي", "الفائض المالي", "الإنفاق الحكومي"]],
  ["monetary_policy", ["السياسة النقدية", "التيسير النقدي", "التشديد النقدي", "سحب السيولة"]],
  ["oil_market", ["سعر النفط", "أسعار النفط", "النفط الخام", "خام برنت", "خام غرب تكساس", "أوبك", "أوبك بلس"]],
  ["gold_market", ["الذهب", "المعدن الأصفر", "أونصة الذهب", "الذهب الفوري"]],
  ["trade_balance", ["الميزان التجاري", "الصادرات", "الواردات", "الحساب الجاري"]],
  ["sanctions", ["العقوبات الاقتصادية", "رفع العقوبات", "تشديد العقوبات", "حزمة عقوبات"]]
];

const ROOT_FAMILIES = [
  {root:"ر ف ع", forms:["رفع","يرفع","رفعت","رفعتا","يرتفع","ارتفع","ارتفعت","ارتفاع","رافعة"] , lemma:"رفع", meaning:"raise_or_increase"},
  {root:"خ ف ض", forms:["خفض","يخفض","خفضت","انخفض","انخفضت","ينخفض","انخفاض","تخفيض"], lemma:"خفض", meaning:"lower_or_decrease"},
  {root:"ز ي د", forms:["زاد","زادت","يزيد","تزايد","زيادة","مزيد"], lemma:"زاد", meaning:"increase"},
  {root:"ن ق ص", forms:["نقص","نقصت","ينقص","تناقص","انخفاض","تراجع"], lemma:"نقص", meaning:"decrease_or_reduction"},
  {root:"ث ب ت", forms:["ثبت","تثبت","يثبت","تثبيت","استقر","استقرت","استقرار","أبقى","أبقت","يبقي","الإبقاء"], lemma:"ثبت", meaning:"stability_or_hold"},
  {root:"و ف ق", forms:["وافق","وافقت","يوافق","موافقة","اتفاق","توافق"], lemma:"وافق", meaning:"agreement_or_approval"},
  {root:"ر ف ض", forms:["رفض","رفضت","يرفض","رفضوا","رفض","مرفوض"], lemma:"رفض", meaning:"rejection"},
  {root:"ن ف ي", forms:["نفى","نفت","ينفي","تنفي","نفي","منفي"], lemma:"نفى", meaning:"denial"},
  {root:"ع ل ن", forms:["أعلن","اعلن","أعلنت","اعلنت","يعلن","إعلان"], lemma:"أعلن", meaning:"announcement"},
  {root:"ت و ق ع", forms:["توقع","توقعات","يتوقع","تتوقع","متوقع","توقعوا"], lemma:"توقع", meaning:"expectation"},
  {root:"س ع ر", forms:["سعر","أسعار","تسعير","مسعّر"], lemma:"سعر", meaning:"price"},
  {root:"ض خ م", forms:["تضخم","التضخم","متضخم"], lemma:"تضخم", meaning:"inflation"},
  {root:"ص د ر", forms:["صدر","صدّر","تصدير","صادرات","يصدر"], lemma:"صدر", meaning:"export_or_issue"},
  {root:"س ت ث م ر", forms:["استثمر","استثمار","استثمارات","يستثمر"], lemma:"استثمر", meaning:"investment"}
];

const PARTICLES = {
  negation:["لا","لم","لن","ليس","ليست","ليسوا","ما","لمّا","غير","دون"],
  modality:["قد","ربما","لعل","يمكن","ممكن","يحتمل","من المحتمل","من المرجح","يرجح","قد يكون","قد تكون"],
  condition:["إذا","إن","لو","لولا","ما لم","في حال","بشرط","شريطة","حالما"],
  contrast:["لكن","لكنّ","غير أن","إلا أن","بينما","في حين","على الرغم من","رغم","مع ذلك","بالمقابل"],
  causality:["لأن","بسبب","نتيجة","جراء","إذ","حيث إن","مما أدى إلى","أدى إلى","لذلك","وبالتالي"],
  attribution:["قال","قالت","صرح","صرحت","أعلن","أعلنت","ذكر","ذكرت","أفاد","أفادت","بحسب","وفقا","وفقاً","استنادا إلى","نقلا عن","نقلت"],
  exception:["إلا","عدا","خلا","حاشا","باستثناء","ما عدا"],
  emphasis:["إن","أن","إنما","لقد","حقا","بالفعل","لا شك أن"],
  future:["سوف","سي","سـ","المقبل","القادم","غدا","غداً","لاحقا","لاحقاً"],
  past:["أمس","امس","سابقا","سابقاً","في العام الماضي","الأسبوع الماضي","الشهر الماضي"]
};

const DIALECT_WORDS = new Set(Object.values(DIALECT_MARKERS).flat());

function occurrences(text, words) {
  return words.filter(word => text.includes(normalizeArabic(word)));
}

function detectDialect(text) {
  const scores = Object.entries(DIALECT_MARKERS).map(([dialect, words]) => {
    const normalizedWords=words.map(normalizeArabic);
    const markers=occurrences(text,normalizedWords);
    return {dialect,markers,score:markers.length};
  }).sort((a,b) => b.score-a.score);
  const best = scores[0];
  if (!best || best.score === 0) return {dialect:"msa_or_unclassified",confidence:0,markers:[]};
  if (scores[1]?.score === best.score) return {dialect:"mixed_or_ambiguous",confidence:0.35,markers:best.markers};
  return {dialect:best.dialect,confidence:Math.min(0.92,0.55+best.score*0.1),markers:best.markers};
}

function tokenize(text) {
  return normalizeArabic(text).match(/[\p{Script=Arabic}]+|\d+(?:[.,]\d+)?|[%٪$€£]+|[^\s]/gu) || [];
}

function analyzeClitics(token) {
  const original = token;
  let stem = token;
  const prefixes = [], suffixes = [];
  // Conservative clitic segmentation; preserve original token and never claim full morphological disambiguation.
  for (const p of ["وال","بال","كال","فال","لل","ال","و","ف","ب","ك","ل","س"]) {
    if (stem.startsWith(p) && stem.length - p.length >= 3) { prefixes.push(p); stem=stem.slice(p.length); break; }
  }
  for (const s of ["كما","هما","كم","كن","هم","هن","نا","ها","هم","ه","ك","ي","ون","ين","ان","ات","ة"]) {
    if (stem.endsWith(s) && stem.length - s.length >= 2) { suffixes.push(s); stem=stem.slice(0,-s.length); break; }
  }
  return {token:original,prefixes,stem,suffixes,has_article:prefixes.includes("ال"),has_conjunction:prefixes.some(x=>["و","ف","وال","فال"].includes(x)),has_preposition:prefixes.some(x=>["ب","ك","ل","بال","كال","لل"].includes(x)),segmentation_confidence:stem.length>=2?0.62:0.25};
}

function detectMorphology(text, tokens) {
  const verbPrefixes = tokens.filter(t => /^(?:ي|ت|ا|ن)[\p{Script=Arabic}]{2,}$/u.test(t));
  const feminineForms = tokens.filter(t => /(?:ت|ة)$/.test(t));
  const brokenPluralCandidates = tokens.filter(t => /^(?:أفعا|فعا|فُعُ|فِعَل|فُعَل|مفاعي|فعال)/u.test(t));
  const dualMarkers = tokens.filter(t => /(?:ان|ين)$/.test(t));
  const soundMasculinePlural = tokens.filter(t => /ون$|ين$/.test(t));
  const soundFemininePlural = tokens.filter(t => /ات$/.test(t));
  const weakLetterForms = tokens.filter(t => /[اويى]/.test(t));
  const hamzaForms = tokens.filter(t => /[ءأإؤئ]/.test(t));
  const derivedPatterns = [];
  const patterns = [
    ["استفعال_or_form_X", /^است[\p{Script=Arabic}]{3,}$/u],
    ["انفعال_or_form_VII", /^ان[\p{Script=Arabic}]{3,}$/u],
    ["افتعال_or_form_VIII", /^ا[\p{Script=Arabic}]ت[\p{Script=Arabic}]{2,}$/u],
    ["تفعيل_or_form_II", /^ت[\p{Script=Arabic}]{3,}$/u],
    ["مفعول_or_passive_participle", /^م[\p{Script=Arabic}]{3,}ول$/u],
    ["فاعل_or_active_participle", /^م?[\p{Script=Arabic}]{2,}ا[\p{Script=Arabic}]$/u]
  ];
  for (const token of tokens) for (const [label,re] of patterns) if (re.test(token)) derivedPatterns.push({token,pattern_candidate:label});
  return {
    imperfect_prefix_candidates:verbPrefixes,
    feminine_or_ta_marbuta_candidates:feminineForms,
    broken_plural_pattern_candidates:brokenPluralCandidates,
    dual_suffix_candidates:dualMarkers,
    sound_masculine_plural_candidates:soundMasculinePlural,
    sound_feminine_plural_candidates:soundFemininePlural,
    weak_letter_candidates:weakLetterForms,
    hamza_candidates:hamzaForms,
    derived_pattern_candidates:derivedPatterns.slice(0,30),
    warning:"Surface-form candidates only; Arabic morphology requires context and cannot be resolved reliably by suffix/prefix heuristics alone."
  };
}

function findRootFamilies(text) {
  return ROOT_FAMILIES.flatMap(f => {
    const found = f.forms.filter(form => text.includes(normalizeArabic(form)));
    return found.length ? [{root_consonants:f.root,lemma_candidate:f.lemma,semantic_family:f.meaning,matched_forms:[...new Set(found)]}] : [];
  });
}

function extractNumbers(text) {
  const out=[];
  const re=/(\d+(?:[.,]\d+)?)\s*(%|٪|بالمئة|في المئة|مئة|مائة|ألف|آلاف|مليون|ملايين|مليار|مليارات|ترليون|تريليون|دولار|دولارات|درهم|دراهم|ريال|ريالات|دينار|دنانير|جنيه|جنيهات|ليرة|ليرات|برميل|أونصة|اونصة|نقطة مئوية)?/gu;
  for(const m of text.matchAll(re)){
    const raw=m[0].trim(); if(!raw) continue;
    const numeric=m[1].includes(",")?( /,\\d{3}$/.test(m[1])?m[1].replace(/,/g,""):m[1].replace(",",".") ):m[1];
    const value=Number(numeric);
    out.push({raw,value,unit:m[2]||null,unit_normalized:normalizeUnit(m[2]||""),context:text.slice(Math.max(0,m.index-55),Math.min(text.length,m.index+raw.length+55))});
    if(out.length>=30) break;
  }
  return out;
}

function normalizeUnit(unit) {
  if(/%|٪|بالمئة|في المئة|مئة|مائة/.test(unit)) return "percent";
  if(/ألف|آلاف/.test(unit)) return "thousand";
  if(/مليون/.test(unit)) return "million";
  if(/مليار|ترليون|تريليون/.test(unit)) return "billion_or_trillion";
  if(/دولار/.test(unit)) return "USD";
  if(/درهم/.test(unit)) return "AED_or_other_dirham";
  if(/ريال/.test(unit)) return "SAR_or_other_riyal";
  if(/دينار/.test(unit)) return "dinar";
  if(/جنيه/.test(unit)) return "pound";
  if(/ليرة/.test(unit)) return "lira";
  if(/برميل/.test(unit)) return "barrel";
  if(/أونصة|اونصة/.test(unit)) return "troy_ounce";
  if(/نقطة/.test(unit)) return "percentage_point";
  return null;
}

function analyzeClauses(text) {
  const chunks = text.split(/(?<=[،؛.!؟?])\s*|\s+(?=لكن|غير أن|إلا أن|بينما|في حين|على الرغم من|بالمقابل)\s*/u).filter(Boolean).slice(0,30);
  return chunks.map((clause,index) => {
    const norm=normalizeArabic(clause);
    const neg=occurrences(norm,PARTICLES.negation);
    const modal=occurrences(norm,PARTICLES.modality);
    const conditional=occurrences(norm,PARTICLES.condition);
    const attribution=occurrences(norm,PARTICLES.attribution);
    const contrast=occurrences(norm,PARTICLES.contrast);
    const causality=occurrences(norm,PARTICLES.causality);
    const exception=occurrences(norm,PARTICLES.exception);
    const future=occurrences(norm,PARTICLES.future);
    const past=occurrences(norm,PARTICLES.past);
    const actions=findRootFamilies(norm);
    return {
      clause_index:index+1,text:clause.trim(),negation_markers:neg,modality_markers:modal,
      conditional_markers:conditional,attribution_markers:attribution,contrast_markers:contrast,
      causal_markers:causality,exception_markers:exception,temporal_markers:{future,past},
      semantic_families:actions.map(x=>x.semantic_family),
      polarity:neg.length?"possibly_negated":"not_explicitly_negated",
      modality:modal.length?"possible_or_uncertain":"not_explicitly_modal",
      attribution:attribution.length?"source_attributed":"not_explicitly_attributed",
      caution:"Marker detection does not determine grammatical scope; review the clause in context."
    };
  });
}

function analyzeGrammar(text, tokens) {
  const evidence=[];
  const add=(type,pattern,matched)=>{if(matched.length)evidence.push({type,pattern,matched:matched.slice(0,12),status:"candidate_not_full_parse"});};
  const prepositions=["في","من","إلى","على","عن","ب","ك","ل","حتى","منذ","خلال","بين","مع","ضد"];
  const relatives=["الذي","التي","اللذان","اللتان","الذين","اللاتي","اللواتي","من","ما"];
  const conjunctions=["و","ف","ثم","أو","أم","بل","لكن"];
  const verbalOpeners=["ارتفع","انخفض","تراجع","هبط","زاد","نقص","أعلن","قال","صرح","نفى","وافق","رفض","استقر","ثبت","أبقى","خفض","رفع","توقع","يتوقع","يرتفع","ينخفض","يزيد","يخفض","تراجع"];
  const normalizedPreps=prepositions.map(normalizeArabic);
  const normalizedRelatives=relatives.map(normalizeArabic);
  const normalizedVerbs=verbalOpeners.map(normalizeArabic);
  add("prepositional_phrase_candidates","preposition + following phrase",tokens.filter(t=>normalizedPreps.includes(t)));
  add("relative_clause_candidates","relative pronouns",tokens.filter(t=>normalizedRelatives.includes(t)));
  add("coordinating_conjunction_candidates","coordination particles",tokens.filter(t=>conjunctions.map(normalizeArabic).includes(t)));
  add("verbal_sentence_opening_candidate","verb-like lexical opener",tokens[0]&&normalizedVerbs.includes(tokens[0])?[tokens[0]]:[]);
  add("nominal_sentence_opening_candidate","definite noun or pronoun opener",tokens[0]&&(/^(?:ال|هذا|هذه|ذلك|تلك|هو|هي|هم|هن)/u.test(tokens[0]))?[tokens[0]]:[]);
  add("idafa_construction_candidates","first noun followed by a definite or construct-state complement",text.match(/(?:سعر|اسعار|معدل|معدلات|سياسة|سياسات|بنك|مصرف|وزارة|اسواق|اسعار|حجم|مستوى|قيمة|قيمة|احتياطي|نسبة)\\s+(?:ال[\\p{Script=Arabic}]+|[\\p{Script=Arabic}]{3,})/gu)||[]);
  add("adjective_noun_agreement_candidates","known noun-adjective pairs",text.match(/(?:البنك المركزي|السياسة النقدية|الميزان التجاري|الاحتياطيات الأجنبية|الأسواق العالمية|الاقتصاد العالمي|الطلب المحلي|العملة المحلية|النفط الخام|الذهب العالمي)/gu)||[]);
  add("passive_or_impersonal_construction_candidates","passive or impersonal reporting forms",text.match(/(?:تم|جرى)\\s+(?:فرض|رفع|خفض|اعلان|تطبيق|اعتماد|تثبيت|تجميد|اصدار|الغاء|اتخاذ)|(?:اعلن|اقر|فرض|خفض|رفع)\\s+.{0,24}\\s+(?:من قبل|بواسطة)/gu)||[]);
  add("comparative_construction_candidates","comparative and proportional markers",text.match(/(?:أكثر من|اكثر من|أقل من|اقل من|أعلى من|اعلى من|أدنى من|ادنى من|مقارنة ب|مقارنة مع|ضعف|نصف|بنسبة أكبر|بنسبة أقل)/gu)||[]);
  add("conditional_construction_candidates","conditional particle and apodosis cues",text.match(/(?:إذا|اذا|إن|ان|لو|لولا|ما لم|في حال|بشرط)[^،؛.!؟?]{0,140}/gu)||[]);
  add("exception_construction_candidates","exception particles and their local spans",text.match(/(?:إلا|الا|عدا|خلا|حاشا|باستثناء|ما عدا)[^،؛.!؟?]{0,90}/gu)||[]);
  add("numeral_tamyiz_or_measure_candidates","numeric measure phrases",text.match(/\\d+(?:[.,]\\d+)?\\s*(?:بالمئة|في المئة|مليون|مليار|دولار|درهم|ريال|دينار|جنيه|ليرة|برميل|أونصة|اونصة|نقطة)/gu)||[]);
  return {
    sentence_type_candidate:tokens.length&&normalizedVerbs.includes(tokens[0])?"verbal_sentence":tokens.length&&(/^(?:ال|هذا|هذه|ذلك|تلك|هو|هي)/u.test(tokens[0]))?"nominal_sentence":"undetermined",
    construction_candidates:evidence,
    caution:"Arabic syntactic roles (فاعل، مفعول به، مبتدأ، خبر، حال، تمييز، مضاف إليه) are not assigned without a context-aware parser."
  };
}

function identifySpeechActs(text) {
  const patterns = [
    ["official_announcement",/(?:أعلن|اعلن|أعلنت|اعلنت|إعلان|اعلان|بيان رسمي)/],
    ["denial",/(?:نفى|نفي|نفت|ينفي|تنفي|تكذيب)/],
    ["warning",/(?:حذر|حذرت|تحذير|يحذر)/],
    ["expectation_or_forecast",/(?:يتوقع|تتوقع|توقعات|من المتوقع|يرجح|قد يرتفع|قد ينخفض)/],
    ["commitment_or_intention",/(?:سوف|سيتم|تعتزم|يعتزم|تخطط|يخطط|تقرر|قررت)/],
    ["question_or_uncertainty",/[؟?]|هل من المتوقع|ما مدى احتمال/],
    ["reported_speech",/(?:قال|قالت|صرح|صرحت|بحسب|وفقا|نقلا عن)/]
  ];
  return patterns.filter(([,re])=>re.test(text)).map(([act])=>act);
}

export function analyzeArabicText(input = "", options = {}) {
  const original=String(input||"").slice(0,16000);
  const text=normalizeArabic(original);
  const tokens=tokenize(text);
  const clitics=tokens.filter(t=>/[\p{Script=Arabic}]/u.test(t)).map(analyzeClitics);
  const dialect=detectDialect(text);
  const clauses=analyzeClauses(text);
  const financeConcepts=FINANCE.flatMap(([concept,terms])=>terms.filter(term=>text.includes(normalizeArabic(term))).map(term=>({concept,term})));
  const rootFamilies=findRootFamilies(text);
  const numbers=extractNumbers(text);
  const features={
    negation:occurrences(text,PARTICLES.negation),
    modality:occurrences(text,PARTICLES.modality),
    condition:occurrences(text,PARTICLES.condition),
    contrast:occurrences(text,PARTICLES.contrast),
    causality:occurrences(text,PARTICLES.causality),
    attribution:occurrences(text,PARTICLES.attribution),
    exception:occurrences(text,PARTICLES.exception),
    emphasis:occurrences(text,PARTICLES.emphasis),
    speech_acts:identifySpeechActs(text)
  };
  return {
    engine_version:ARABIC_ENGINE_VERSION,
    language:"ar",
    normalized_text:text,
    dialect_profile:dialect,
    text_register:dialect.dialect==="msa_or_unclassified"?"formal_or_unclassified":"colloquial_or_mixed",
    morphology:detectMorphology(text,tokens),
    clitic_analysis:clitics.slice(0,120),
    root_and_semantic_families:rootFamilies,
    syntax_and_discourse:{clauses,features,grammar:analyzeGrammar(text,tokens)},
    finance_domain:{concepts:financeConcepts,concept_count:new Set(financeConcepts.map(x=>x.concept)).size},
    quantities:numbers,
    speech_acts:features.speech_acts,
    quality:{
      token_count:tokens.length,
      clause_count:clauses.length,
      dialect_confidence:dialect.confidence,
      unsupported_claims:[],
      requires_human_review:true,
      limitations:[
        "This is a transparent rule-based linguistic layer, not a university graduate, native speaker, or neural language model.",
        "Clitic segmentation, roots, patterns, dialect labels and grammatical scope are candidate analyses, not guaranteed parses.",
        "No full syntactic dependency tree, diacritization, named-entity disambiguation, idiom coverage or reliable sarcasm understanding is claimed.",
        "Financial terms can be ambiguous across countries; currency identity must be resolved from source and context."
      ]
    }
  };
}

const CASES = [
  {id:"msa_negation",text:"لم يرفع البنك المركزي سعر الفائدة رغم ارتفاع التضخم.",expect:{negation:true,finance:"interest_rate",root:"raise_or_increase"}},
  {id:"msa_future_conditional",text:"إذا استمر التضخم فقد يخفض المصرف المركزي أسعار الفائدة في العام المقبل.",expect:{condition:true,modality:true,finance:"interest_rate",future:true}},
  {id:"msa_attribution_contrast",text:"قالت الوزارة إن الصادرات ارتفعت، لكن الواردات تراجعت مقارنة بالعام الماضي.",expect:{attribution:true,contrast:true,finance:"trade_balance",roots:2}},
  {id:"msa_exception",text:"لم توافق الحكومة على الاتفاق إلا بعد مراجعة الشروط.",expect:{negation:true,exception:true}},
  {id:"msa_numbers",text:"ارتفع سعر النفط بنسبة ٣٫٥ بالمئة إلى ٨٢ دولارا للبرميل.",expect:{finance:"oil_market",number:2}},
  {id:"msa_interest",text:"أبقى البنك المركزي سعر الفائدة دون تغيير.",expect:{finance:"central_bank",root:"stability_or_hold"}},
  {id:"egyptian",text:"الجنيه مش مستقر والأسعار بتزيد دلوقتي.",expect:{dialect:"egyptian"}},
  {id:"gulf",text:"وش تتوقعون يصير بسعر النفط الحين؟",expect:{dialect:"gulf"}},
  {id:"levantine",text:"شو ممكن يصير بسعر الدولار إذا ارتفع النفط؟",expect:{dialect:"levantine"}},
  {id:"iraqi",text:"شنو وضع الدينار هسه؟",expect:{dialect:"iraqi"}},
  {id:"maghrebi",text:"واش غادي ترتفع الأسعار بزاف؟",expect:{dialect:"maghrebi"}},
  {id:"diacritics",text:"أَعْلَنَ الْبَنْكُ الْمَرْكَزِيُّ تَثْبِيتَ سِعْرِ الْفَائِدَةِ.",expect:{finance:"interest_rate",root:"stability_or_hold"}}
];

export function runArabicAcademicBenchmark() {
  const results=CASES.map(item=>{
    const a=analyzeArabicText(item.text);
    const e=item.expect, checks=[];
    if(e.negation!==undefined) checks.push({name:"negation",passed:a.syntax_and_discourse.features.negation.length>0===e.negation});
    if(e.condition!==undefined) checks.push({name:"condition",passed:a.syntax_and_discourse.features.condition.length>0===e.condition});
    if(e.modality!==undefined) checks.push({name:"modality",passed:a.syntax_and_discourse.features.modality.length>0===e.modality});
    if(e.attribution!==undefined) checks.push({name:"attribution",passed:a.syntax_and_discourse.features.attribution.length>0===e.attribution});
    if(e.contrast!==undefined) checks.push({name:"contrast",passed:a.syntax_and_discourse.features.contrast.length>0===e.contrast});
    if(e.exception!==undefined) checks.push({name:"exception",passed:a.syntax_and_discourse.features.exception.length>0===e.exception});
    if(e.finance) checks.push({name:"finance:"+e.finance,passed:a.finance_domain.concepts.some(x=>x.concept===e.finance)});
    if(e.root) checks.push({name:"root:"+e.root,passed:a.root_and_semantic_families.some(x=>x.semantic_family===e.root)});
    if(e.roots) checks.push({name:"root_count",passed:a.root_and_semantic_families.length>=e.roots});
    if(e.number) checks.push({name:"number_count",passed:a.quantities.length>=e.number});
    if(e.future) checks.push({name:"future",passed:a.syntax_and_discourse.clauses.some(c=>c.temporal_markers.future.length>0)});
    if(e.dialect) checks.push({name:"dialect:"+e.dialect,passed:a.dialect_profile.dialect===e.dialect});
    return {id:item.id,passed:checks.every(x=>x.passed),checks};
  });
  return {
    version:ARABIC_ENGINE_VERSION,
    benchmark:"curated_arabic_linguistic_regression",
    total:results.length,passed:results.filter(x=>x.passed).length,failed:results.filter(x=>!x.passed).length,
    score_pct:Number((results.filter(x=>x.passed).length/Math.max(1,results.length)*100).toFixed(1)),
    failures:results.filter(x=>!x.passed),
    scope:"Small curated regression suite; not an independent academic proficiency score or real-world accuracy estimate."
  };
}
