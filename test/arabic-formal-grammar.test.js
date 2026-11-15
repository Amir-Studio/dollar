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

test("formal Arabic register is separated from colloquial dialect", () => {
  const formal=analyzeFormalArabicGrammar("أعلن البنك المركزي قراره في ضوء بيانات التضخم.");
  const colloquial=analyzeFormalArabicGrammar("الجنيه مش مستقر والأسعار بتزيد دلوقتي.");
  assert.equal(formal.register,"formal_official_arabic_candidate");
  assert.equal(colloquial.register,"colloquial_or_mixed_candidate");
});

import {
  analyzeMarketLexicon,
  runMarketLexiconBenchmark,
  MARKET_CONCEPTS,
  SUPPORTED_LEXICON_LANGUAGES,
  MARKET_LEXICON_VERSION
} from "../worker/market-lexicon-ontology.js";

test("English-pivot market lexicon has broad language coverage and stable sense IDs", () => {
  assert.ok(MARKET_CONCEPTS.length >= 25);
  assert.equal(SUPPORTED_LEXICON_LANGUAGES.length,16);
  assert.equal(MARKET_LEXICON_VERSION,"market-lexicon-ontology-1.0.0");
  assert.ok(MARKET_CONCEPTS.every(x=>x.id&&x.pivot?.term&&x.pivot?.definition&&x.equivalents?.fa&&x.equivalents?.ar));
});

test("English synonyms and inflections map to canonical concepts", () => {
  const result=analyzeMarketLexicon("Inflation slowed while interest rates remained unchanged.","en");
  assert.ok(result.matched_concept_ids.includes("inflation"));
  assert.ok(result.matched_concept_ids.includes("interest_rate"));
});

test("Persian financial terms map to canonical English senses", () => {
  const result=analyzeMarketLexicon("بانک مرکزی نرخ بهره را افزایش داد و تورم کاهش یافت.","fa");
  for(const id of ["central_bank","interest_rate","inflation"]) assert.ok(result.matched_concept_ids.includes(id),id);
});

test("Arabic official news terms map to canonical English senses", () => {
  const result=analyzeMarketLexicon("أعلن البنك المركزي رفع سعر الفائدة لمواجهة التضخم.","ar");
  for(const id of ["central_bank","rate_hike","interest_rate","inflation"]) assert.ok(result.matched_concept_ids.includes(id),id);
});

test("Chinese and Russian rate policy terms are recognized", () => {
  const zh=analyzeMarketLexicon("央行宣布降息以应对通货膨胀。","zh");
  for(const id of ["central_bank","rate_cut","inflation"]) assert.ok(zh.matched_concept_ids.includes(id),id);
  const ru=analyzeMarketLexicon("Центральный банк повысил процентную ставку.","ru");
  for(const id of ["central_bank","interest_rate"]) assert.ok(ru.matched_concept_ids.includes(id),id);
});

test("Turkish and Spanish inflected/plural rate phrases are recognized", () => {
  const tr=analyzeMarketLexicon("Merkez bankası faiz oranını artırdı.","tr");
  for(const id of ["central_bank","rate_hike","interest_rate"]) assert.ok(tr.matched_concept_ids.includes(id),id);
  const es=analyzeMarketLexicon("El banco central anunció una subida de los tipos de interés.","es");
  for(const id of ["central_bank","rate_hike","interest_rate"]) assert.ok(es.matched_concept_ids.includes(id),id);
});

test("Disinflation and deflation are kept as distinct concepts", () => {
  const disinflation=MARKET_CONCEPTS.find(x=>x.id==="disinflation");
  const deflation=MARKET_CONCEPTS.find(x=>x.id==="deflation");
  assert.notEqual(disinflation.id,deflation.id);
  assert.match(disinflation.pivot.definition,/slowing rate of inflation/);
  assert.match(deflation.pivot.definition,/decline in the general price level/);
});

test("Curated multilingual lexicon benchmark has no misses", () => {
  const result=runMarketLexiconBenchmark();
  assert.equal(result.failed,0,JSON.stringify(result.cases.filter(x=>!x.passed)));
});

test("previously defined English market synonyms map to canonical action concepts", () => {
  const rise=analyzeMarketLexicon("Oil prices surged and gold climbed.","en");
  const fall=analyzeMarketLexicon("The dollar plunged and crude prices slid.","en");
  const hold=analyzeMarketLexicon("The central bank held rates unchanged.","en");
  assert.ok(rise.matched_concept_ids.includes("market_rise"));
  assert.ok(fall.matched_concept_ids.includes("market_fall"));
  assert.ok(hold.matched_concept_ids.includes("price_stability"));
});

test("lexicon output distinguishes English synonyms from cross-language equivalents", () => {
  const english=analyzeMarketLexicon("The market surged.","en").matches.find(x=>x.concept_id==="market_rise");
  const persian=analyzeMarketLexicon("قیمت‌ها افزایش یافت.","fa").matches.find(x=>x.concept_id==="market_rise");
  assert.equal(english.relation,"english_synonym_or_inflection");
  assert.equal(persian.relation,"contextual_equivalent");
});
