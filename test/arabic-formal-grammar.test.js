import test from "node:test";
import assert from "node:assert/strict";
import {
  analyzeFormalArabicGrammar,
  ARABIC_FORMAL_CURRICULUM,
  runArabicFormalGrammarBenchmark,
  ARABIC_FORMAL_GRAMMAR_VERSION
} from "../worker/arabic-formal-grammar.js";
import { analyzeArabicText } from "../worker/arabic-academic-engine.js";
import { analyzeMultilingualNews } from "../worker/multilingual-engine.js";
import { analyzeMarketLanguage } from "../worker/language-engine.js";

test("formal Arabic curriculum covers core morphology, syntax, inflection and rhetoric", () => {
  const titles = ARABIC_FORMAL_CURRICULUM.map(x => x.title);
  for (const expected of ["الإعراب وعلاماته","كان وأخواتها","إن وأخواتها","حروف الجر والإضافة","النعت والمطابقة","رفع المضارع ونصبه وجزمه","الأفعال الخمسة","المثنى والجمع السالم","المبني للمجهول ونائب الفاعل","أسلوب الشرط","الاستثناء","العدد والمعدود والتمييز","الصرف والأوزان والاشتقاق","البلاغة والأسلوب الصحفي الرسمي"]) {
    assert.ok(titles.includes(expected), "missing curriculum domain: " + expected);
  }
  assert.equal(ARABIC_FORMAL_GRAMMAR_VERSION, "arabic-formal-grammar-1.0.0");
});

test("formal Arabic diagnostics detect إن وأخواتها", () => {
  assert.ok(analyzeFormalArabicGrammar("إن التضخمَ مرتفعٌ.").detected_rules.some(x=>x.rule==="inna_sisters"));
});
test("formal Arabic diagnostics detect كان وأخواتها", () => {
  assert.ok(analyzeFormalArabicGrammar("كان التضخمُ مرتفعًا.").detected_rules.some(x=>x.rule==="kana_sisters"));
});
test("formal Arabic diagnostics distinguish subjunctive and jussive triggers", () => {
  assert.ok(analyzeFormalArabicGrammar("لم يرتفعْ السعرُ.").detected_rules.some(x=>x.rule==="jussive_particles"));
  assert.ok(analyzeFormalArabicGrammar("لن يرتفعَ السعرُ.").detected_rules.some(x=>x.rule==="subjunctive_particles"));
});
test("formal Arabic diagnostics detect idafa, prepositions, condition and exception", () => {
  const result=analyzeFormalArabicGrammar("في الأسواقِ، إذا استمر التضخم فلن ترتفع الأسعار إلا قليلًا، بحسب التقرير.");
  for(const rule of ["prepositions","conditional","negation","exception","attribution"]) {
    assert.ok(result.detected_rules.some(x=>x.rule===rule), "missing " + rule);
  }
});
test("formal grammar benchmark passes all curated rule triggers", () => {
  const result=runArabicFormalGrammarBenchmark();
  assert.equal(result.failed,0,JSON.stringify(result.failures));
});

test("official Arabic monetary-policy news preserves actor, direction, rates and basis points", () => {
  const text="أعلن البنك المركزي المصري رفع أسعار العائد الأساسية بمقدار 100 نقطة أساس؛ وبلغ سعر عائد الإيداع لليلة واحدة 20.0% وسعر عائد الإقراض 21.0%.";
  const result=analyzeMultilingualNews("قرار لجنة السياسة النقدية",text,"ar");
  assert.equal(result.language,"ar");
  assert.ok(result.summary.actor_candidates.includes("central_bank"));
  assert.ok(result.summary.action_concepts.includes("increase"));
  const nums=result.extracted_quantities.map(x=>x.value);
  for(const n of [100,20,21]) assert.ok(nums.includes(n),"missing number "+n+" in "+JSON.stringify(nums));
  assert.ok(result.arabic_academic_analysis.finance_domain.concepts.some(x=>x.concept==="interest_rate"));
  assert.equal(result.arabic_academic_analysis.formal_grammar.version,ARABIC_FORMAL_GRAMMAR_VERSION);
});

test("Persian inflation news preserves monthly and annual rates", () => {
  const text="بر اساس گزارش بانک مرکزی، تورم ماهانه در مهرماه به 4.6 درصد رسید و تورم سالانه 71.4 درصد اعلام شد. این داده‌ها از افزایش سطح عمومی قیمت‌ها حکایت دارد.";
  const result=analyzeMarketLanguage([{title:"گزارش تورم ایران",original_title:"گزارش تورم ایران",original_text:text,language_code:"fa"}],[]).per_news[0];
  const nums=result.numbers.map(x=>x.value);
  assert.ok(nums.includes(4.6));
  assert.ok(nums.includes(71.4));
  assert.ok(result.themes.includes("inflation"));
  assert.equal(result.language,"fa");
  assert.ok(result.content_chars>0);
});

test("Persian and Arabic versions of the CBE rate decision retain the same numeric facts", () => {
  const fa="بانک مرکزی مصر نرخ‌های سیاستی را 100 واحد پایه افزایش داد؛ نرخ سپرده شبانه به 20.0 درصد و نرخ تسهیلات شبانه به 21.0 درصد رسید.";
  const ar="أعلن البنك المركزي المصري رفع أسعار العائد الأساسية بمقدار 100 نقطة أساس؛ وبلغ سعر عائد الإيداع لليلة واحدة 20.0% وسعر عائد الإقراض 21.0%.";
  const faResult=analyzeMarketLanguage([{title:"تصمیم نرخ بهره بانک مرکزی مصر",original_title:"تصمیم نرخ بهره بانک مرکزی مصر",original_text:fa}],[]).per_news[0];
  const arResult=analyzeMultilingualNews("قرار لجنة السياسة النقدية",ar,"ar");
  const faNums=faResult.numbers.map(x=>x.value);
  const arNums=arResult.extracted_quantities.map(x=>x.value);
  for(const n of [100,20,21]) {
    assert.ok(faNums.includes(n),"Persian parser missed "+n);
    assert.ok(arNums.includes(n),"Arabic parser missed "+n);
  }
  assert.ok(arResult.summary.action_concepts.includes("increase"));
});

test("Arabic article analysis exposes grammar candidates but never claims final i'rab", () => {
  const result=analyzeArabicText("قال البنك المركزي إن التضخم لم يرتفع، لكن الأسعار قد تتغير.");
  assert.equal(result.quality.requires_human_review,true);
  assert.ok(result.formal_grammar.detected_rules.some(x=>x.rule==="inna_sisters"));
  assert.match(result.formal_grammar.confidence_policy,/لا تُصدر إعرابا نهائيا/);
});
