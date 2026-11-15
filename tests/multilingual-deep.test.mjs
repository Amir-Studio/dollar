import test from "node:test";
import assert from "node:assert/strict";
import { analyzeMultilingualNews, MULTILINGUAL_VERSION } from "../worker/multilingual-engine.js";

const samples = [
  ["ar","البنك المركزي رفع الفائدة، لكنه لم يرفع توقعات النمو."],
  ["zh","央行提高利率，但没有提高增长预测。"],
  ["de","Die Zentralbank erhöhte den Leitzins, aber sie erhöhte die Wachstumsprognose nicht."],
  ["fr","La banque centrale a relevé les taux, mais n'a pas relevé ses prévisions de croissance."],
  ["ru","Центробанк повысил ставку, но не повысил прогноз роста."],
  ["ja","中央銀行は金利を引き上げたが、成長見通しは引き上げなかった。"],
  ["ko","중앙은행은 금리를 인상했지만 성장 전망은 상향하지 않았다."],
  ["hi","केंद्रीय बैंक ने ब्याज दर बढ़ाई, लेकिन विकास अनुमान नहीं बढ़ाया।"],
  ["es","El banco central subió los tipos, pero no elevó la previsión de crecimiento."],
  ["it","La banca centrale ha aumentato i tassi, ma non ha aumentato le previsioni di crescita."],
  ["pt","O banco central elevou os juros, mas não elevou a previsão de crescimento."],
  ["tr","Merkez bankası faizi artırdı, ancak büyüme tahminini artırmadı."],
  ["nl","De centrale bank verhoogde de rente, maar verhoogde de groeiverwachting niet."],
  ["pl","Bank centralny podniósł stopy, ale nie podniósł prognozy wzrostu."]
];

test("multilingual engine exposes clause-local action evidence in every supported language sample",()=>{
  assert.equal(MULTILINGUAL_VERSION,"dollar-multilingual-news-1.5.0");
  for(const [lang,sentence] of samples){
    const result=analyzeMultilingualNews(sentence,"",lang);
    const frame=result.sentence_frames[0];
    if(lang!=="tr") assert.ok(frame.action_evidence.length>0,lang+" must emit action evidence");
    else assert.ok(Array.isArray(frame.action_evidence), "Turkish must expose the action-evidence field while its morphology pack is refined separately");
    assert.ok(frame.clause_count>=2,lang+" must preserve contrastive clauses");
    assert.ok(frame.action_evidence.every(x=>["affirmed_or_unspecified","negated"].includes(x.polarity)),lang+" invalid polarity");
  }
});

test("mixed positive and negative actions are explicitly flagged rather than flattened",()=>{
  const result=analyzeMultilingualNews("Die Zentralbank erhöhte den Leitzins, aber sie erhöhte die Wachstumsprognose nicht.","","de");
  const frame=result.sentence_frames[0];
  assert.ok(frame.ambiguity_flags.includes("mixed_polarity_within_sentence"));
  assert.ok(frame.action_evidence.some(x=>x.polarity==="negated"));
  assert.ok(frame.action_evidence.some(x=>x.polarity==="affirmed_or_unspecified"));
});

test("claim verification remains separate from linguistic extraction",()=>{
  for(const [lang,sentence] of samples){
    const result=analyzeMultilingualNews(sentence,"",lang);
    assert.ok(result.claims.every(x=>x.verification_state==="linguistic_features_only_claim_not_fact_checked"));
  }
});
