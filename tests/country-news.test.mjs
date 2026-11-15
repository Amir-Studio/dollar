import test from "node:test";
import assert from "node:assert/strict";
import { COUNTRY_NEWS_SOURCES, validateCountryNewsSources } from "../worker/country-news-sources.js";
import { analyzeMultilingualNews } from "../worker/multilingual-engine.js";

test("country registry contains exactly one unique primary feed for each of 30 countries", () => {
  const result=validateCountryNewsSources();
  assert.equal(result.passed,true,JSON.stringify(result.errors));
  assert.equal(result.total,30);
  assert.equal(result.unique_countries,30);
  assert.equal(new Set(COUNTRY_NEWS_SOURCES.map(x=>x.country_code)).size,30);
  assert.ok(COUNTRY_NEWS_SOURCES.every(x=>x.active && x.trust_tier==="unrated"));
});

test("every country feed declares a supported language and HTTPS endpoint", () => {
  const supported=new Set(["fa","en","ar","zh","de","fr","ru","ja","ko","hi","es","it","pt","tr","nl","pl"]);
  for (const source of COUNTRY_NEWS_SOURCES) {
    assert.ok(supported.has(source.language_code),source.source_id+" has unsupported language");
    assert.ok(source.feed_url.startsWith("https://"),source.source_id+" must use HTTPS");
    assert.ok(source.site_url.startsWith("https://"),source.source_id+" must declare publisher site");
  }
});

const cases=[
  ["ru","Центральный банк заявил, что цены на нефть выросли на 3%, однако прогноз может измениться.",["central_bank","increase","oil"],["attributed","contrast","modality"]],
  ["ja","中央銀行は原油価格が上昇したと発表したが、来週は下落する可能性がある。",["central_bank","increase","decrease","oil"],["attributed","contrast","modality"]],
  ["ko","한국은행은 원유 가격이 상승했다고 발표했지만 다음 주 하락할 가능성이 있다.",["central_bank","increase","decrease","oil"],["attributed","contrast","modality"]],
  ["hi","केंद्रीय बैंक ने कहा कि तेल की कीमत बढ़ी, लेकिन अगले सप्ताह गिरावट की संभावना है।",["central_bank","increase","decrease","oil"],["attributed","contrast","modality"]],
  ["es","El banco central anunció que el precio del petróleo subió un 3%, pero podría caer la próxima semana.",["central_bank","increase","decrease","oil"],["attributed","contrast","modality"]],
  ["it","La banca centrale ha annunciato che il prezzo del petrolio è aumentato, tuttavia potrebbe diminuire la prossima settimana.",["central_bank","increase","decrease","oil"],["attributed","contrast","modality"]],
  ["pt","O banco central anunciou que o preço do petróleo aumentou, mas poderia cair na próxima semana.",["central_bank","increase","decrease","oil"],["attributed","contrast","modality"]],
  ["tr","Merkez bankası petrol fiyatının yükseldiğini açıkladı, ancak gelecek hafta düşebilir.",["central_bank","increase","decrease","oil"],["attributed","contrast","modality"]],
  ["nl","De centrale bank meldde dat de olieprijs steeg, maar volgende week mogelijk kan dalen.",["central_bank","increase","decrease","oil"],["attributed","contrast","modality"]],
  ["pl","Bank centralny ogłosił, że ceny ropy wzrosły, jednak w przyszłym tygodniu mogą spaść.",["central_bank","increase","decrease","oil"],["attributed","contrast","modality"]]
];

test("ten additional languages identify market actors, direction, and reporting nuance", () => {
  for (const [language,sentence,actions,flags] of cases) {
    const result=analyzeMultilingualNews(sentence,"",language);
    assert.equal(result.language,language,language+" language hint should be respected");
    assert.equal(result.reading_status,"parsed_linguistic_features",language);
    const frame=result.sentence_frames[0];
    for (const action of actions) assert.ok(frame.actors.includes(action)||frame.action_concepts.includes(action),language+" missing "+action);
    for (const flag of flags) assert.equal(frame[flag],true,language+" missing "+flag);
    assert.equal(frame.verification_state,"linguistic_features_only_claim_not_fact_checked");
  }
});

test("non-Latin scripts can be detected without a language hint", () => {
  assert.equal(analyzeMultilingualNews("Центральный банк повысил ставку.").language,"ru");
  assert.equal(analyzeMultilingualNews("中央銀行が金利を発表した。").language,"ja");
  assert.equal(analyzeMultilingualNews("한국은행이 금리를 발표했다.").language,"ko");
  assert.equal(analyzeMultilingualNews("सरकार ने नई नीति की घोषणा की।").language,"hi");
});
