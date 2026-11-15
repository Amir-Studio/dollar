// Modern formal-register analyser for contemporary Persian and English.
// It deliberately targets current institutional, journalistic, financial and policy prose,
// not Classical Persian, archaic literary diction, or Shakespearean English.
export const FORMAL_REGISTER_VERSION = "dollar-formal-register-1.0.0";

const FA_FORMAL = [
  ["official_attribution", ["اعلام کرد","اعلام کردند","اظهار داشت","اظهار کرد","تصریح کرد","خاطرنشان کرد","تأکید کرد","بیانیه منتشر کرد","بر اساس اعلام","طبق اعلام","در بیانیه آمده است","گزارش حاکی است"]],
  ["administrative_legal", ["در راستای","به‌منظور","در چارچوب","حسب","متعاقب","موضوعِ","در دستور کار","لازم‌الاجرا","مشروط بر","در صورت تصویب","با رعایت","مطابق با","بر اساس مفاد","در خصوص","نسبت به"]],
  ["analytical_connectors", ["بااین‌حال","با این حال","علی‌رغم","اگرچه","هرچند","از سوی دیگر","در مقابل","افزون بر این","در نتیجه","در پیِ","به‌دنبال","هم‌زمان با"]],
  ["evidence_qualification", ["برآورد می‌شود","به نظر می‌رسد","احتمال می‌رود","شواهد نشان می‌دهد","داده‌ها حاکی از","بر پایه داده‌ها","طبق آمار","بر اساس آخرین داده‌ها","هنوز تأیید نشده","نمی‌توان نتیجه گرفت","لزوماً به معنای"]],
  ["formal_reporting_verbs", ["افزایش یافت","کاهش یافت","اعلام شد","منتشر شد","تصویب شد","ابلاغ شد","تعیین شد","مطرح شد","در نظر گرفته شد","مورد بررسی قرار گرفت","به تصویب رسید","به اجرا درآمد"]],
  ["financial_register", ["سیاست پولی","نرخ سیاستی","نرخ بهره","انتظارات تورمی","پایه پولی","نقدینگی","تراز تجاری","کسری بودجه","بدهی عمومی","بازار ارز","نرخ برابری","حساب جاری","ترازنامه بانک مرکزی","بازده اوراق","ریسک اعتباری","شاخص قیمت مصرف‌کننده"]]
];
const FA_INFORMAL = ["میخواد","می‌خواد","میخواد","میگن","می‌گن","یه جورایی","خیلی خفن","حسابی","واسه","واسه‌ی","چیزه","خب","آخه","ببین","کلاً","رو به راه","ترکوند","ریخت به هم"];
const EN_FORMAL = [
  ["official_attribution", ["according to","the ministry stated","the central bank said","the statement said","officials announced","the report noted","the filing disclosed","the regulator confirmed","the authority indicated"]],
  ["administrative_legal", ["pursuant to","in accordance with","subject to","under the provisions of","with effect from","for the purposes of","in the framework of","hereby","thereof","therein","notwithstanding"]],
  ["analytical_connectors", ["nevertheless","nonetheless","conversely","by contrast","furthermore","moreover","whereas","albeit","thereby","consequently","accordingly","in turn"]],
  ["evidence_qualification", ["the available evidence suggests","preliminary data indicate","the figures point to","it remains unclear whether","cannot be ruled out","does not necessarily imply","is not sufficient to establish","subject to confirmation","according to preliminary estimates"]],
  ["formal_reporting_verbs", ["announced","reiterated","underscored","acknowledged","disclosed","implemented","enacted","approved","introduced","withdrew","remained unchanged","came into effect"]],
  ["financial_register", ["monetary policy","policy rate","inflationary pressures","fiscal deficit","public debt","current account","balance of payments","foreign-exchange market","exchange-rate regime","sovereign yield","credit conditions","market liquidity","underlying inflation","gross domestic product","consumer price index"]]
];
const EN_INFORMAL = ["gonna","wanna","gotta","kinda","sort of","a lot of","stuff","things are","big deal","go up","go down","pretty bad","pretty good","you know","it's","don't","can't","won't","isn't","aren't"];

function norm(s) {
  return String(s ?? "").toLocaleLowerCase("en-US")
    .replace(/[ي]/g,"ی").replace(/[ك]/g,"ک")
    .replace(/\u200c/g," ").replace(/[\u064b-\u065f\u0670]/g,"")
    .replace(/[ـ]/g,"").replace(/\s+/g," ").trim();
}
function hits(text, groups) {
  return groups.flatMap(([id, terms]) => {
    const found = terms.filter(term => text.includes(norm(term)));
    return found.length ? [{id, terms:found}] : [];
  });
}
function sentenceCount(text) {
  return Math.max(1, String(text).split(/[.!?؟؛;]+/u).filter(x=>x.trim()).length);
}
export function analyzeFormalRegister(input, language) {
  const text = norm(input);
  const lang = language === "fa" || /[\u0600-\u06ff]/u.test(text) ? "fa" : "en";
  const groups = lang === "fa" ? FA_FORMAL : EN_FORMAL;
  const informalTerms = lang === "fa" ? FA_INFORMAL : EN_INFORMAL;
  const matched = hits(text, groups);
  const informal = informalTerms.filter(term => text.includes(norm(term)));
  const categories = matched.map(x=>x.id);
  const formalHits = matched.reduce((n,x)=>n+x.terms.length,0);
  const passive = lang === "fa"
    ? /(?:شده است|شده بود|خواهد شد|اعلام شد|تصویب شد|ابلاغ شد|مورد .{1,30} قرار گرفت)/u.test(text)
    : /\b(?:was|were|is|are|has been|have been|will be)\s+\w+(?:ed|en)\b/u.test(text);
  const nominalStyle = lang === "fa"
    ? /(?:افزایش|کاهش|تصویب|ابلاغ|تعدیل|تعیین|ارزیابی|بررسی|تدوین|اجرای)\s+(?:نرخ|سیاست|پیشنهاد|برنامه|مقررات|طرح|آن|این)/u.test(text)
    : /\b(?:implementation|assessment|adjustment|announcement|approval|evaluation|allocation|contraction|expansion|reduction|increase)\b/u.test(text);
  const contractions = lang === "en" ? (text.match(/\b(?:it's|don't|can't|won't|isn't|aren't|we're|they're|didn't|doesn't)\b/g)||[]).length : 0;
  const sentenceN = sentenceCount(input);
  const score = Math.max(0,Math.min(100,Math.round(18 + formalHits*8 + categories.length*4 + (passive?7:0) + (nominalStyle?7:0) - informal.length*13 - contractions*5)));
  const register = score >= 30 ? "formal_official_or_analytical" : score >= 18 ? "neutral_professional_or_mixed" : "conversational_or_unclear";
  return {
    version:FORMAL_REGISTER_VERSION,language:lang,register,heuristic_score_not_probability:score,
    matched_register_functions:matched.map(x=>({function:x.id,evidence:x.terms.slice(0,5)})),
    sentence_count:sentenceN,passive_construction_detected:passive,
    nominalisation_detected:nominalStyle,informal_markers:informal.slice(0,8),
    english_contractions_count:contractions,
    interpretation_fa:lang==="fa"
      ? "تحلیل بر پایهٔ نثر رسمی و اداریِ معاصر فارسی است؛ وجود واژهٔ رسمی به‌تنهایی صحت ادعا یا کیفیت نگارش را ثابت نمی‌کند."
      : "Analysis targets contemporary formal English used in institutions, policy, finance and journalism; register classification does not establish factual accuracy.",
    limitations:["pattern_based_register_detection_not_full_grammar_parsing","score_is_not_a_probability_or_language_proficiency_grade","formal_register_does_not_imply_claim_is_true"]
  };
}

export function runFormalRegisterBenchmark() {
  const cases = [
    {language:"fa",text:"بانک مرکزی اعلام کرد که در راستای کنترل تورم، نرخ سیاستی را با هدف مهار انتظارات تورمی تعدیل خواهد کرد.",expected:"formal_official_or_analytical"},
    {language:"fa",text:"بر اساس گزارش منتشرشده، رشد نقدینگی در مقایسه با دوره مشابه سال قبل کاهش یافته است؛ با این حال، این روند به‌تنهایی دلالت بر کاهش سطح عمومی قیمت‌ها ندارد.",expected:"formal_official_or_analytical"},
    {language:"fa",text:"در صورت تصویب این پیشنهاد، اجرای آن از ابتدای سال آینده در دستور کار قرار خواهد گرفت.",expected:"formal_official_or_analytical"},
    {language:"fa",text:"میگن قراره قیمت‌ها بره بالا و بانک هم شاید یه کاری بکنه.",expected:"conversational_or_unclear"},
    {language:"en",text:"According to the central bank's statement, the policy rate will remain unchanged pending further assessment of inflationary pressures.",expected:"formal_official_or_analytical"},
    {language:"en",text:"Notwithstanding the moderation in headline inflation, underlying price pressures remain elevated.",expected:"formal_official_or_analytical"},
    {language:"en",text:"Subject to parliamentary approval, the measure is expected to take effect in the next fiscal year.",expected:"formal_official_or_analytical"},
    {language:"en",text:"They say prices are gonna go up and the bank might do something about it.",expected:"conversational_or_unclear"}
  ];
  const results=cases.map(c=>{const out=analyzeFormalRegister(c.text,c.language);return {language:c.language,expected:c.expected,actual:out.register,passed:out.register===c.expected,score:out.heuristic_score_not_probability};});
  const passed=results.filter(x=>x.passed).length;
  return {version:FORMAL_REGISTER_VERSION,total:results.length,passed,accuracy_pct:Number((passed/results.length*100).toFixed(1)),status:passed===results.length?"pass":"needs_revision",cases:results};
}
