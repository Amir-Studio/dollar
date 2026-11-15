// Dollar cross-source contradiction screening engine.
// Deterministic, high-precision candidate detection; it does not decide which publisher is truthful.
export const NEWS_CONTRADICTION_VERSION = "dollar-cross-source-verification-1.0.0";

const normalize = value => String(value ?? "")
  .normalize("NFKC")
  .replace(/[ي]/g, "ی").replace(/[ك]/g, "ک")
  .replace(/[\u064B-\u065F\u0670]/g, "")
  .replace(/\u200c/g, " ")
  .toLocaleLowerCase("en-US")
  .replace(/[^\p{L}\p{N}%$€£.+-]+/gu, " ")
  .replace(/\s+/g, " ").trim();

const TOPICS = [
  {id:"interest_rate", terms:["interest rate","policy rate","rates","rate hike","rate cut","نرخ بهره","نرخ سود","نرخ سیاستی"]},
  {id:"fx_rate", terms:["exchange rate","currency rate","dollar rate","usd irr","نرخ ارز","نرخ دلار","قیمت دلار","دلار آزاد"]},
  {id:"oil_price", terms:["oil price","crude price","brent","wti","قیمت نفت","نفت برنت","نفت خام"]},
  {id:"oil_export", terms:["oil exports","crude exports","oil shipment","صادرات نفت","صادرات نفت خام","محموله نفتی"]},
  {id:"inflation", terms:["inflation","consumer prices","cpi","تورم","شاخص قیمت مصرف کننده"]},
  {id:"gold_price", terms:["gold price","gold bullion","قیمت طلا","اونس طلا","طلای ۱۸ عیار"]},
  {id:"sanctions", terms:["sanctions","sanction package","تحریم","تحریم‌ها","تحریم ها"]},
  {id:"nuclear_talks", terms:["nuclear talks","nuclear negotiations","مذاکرات هسته‌ای","مذاکرات هسته ای","گفت‌وگوهای هسته‌ای","گفتگوهای هسته ای"]},
  {id:"agreement", terms:["agreement","deal","توافق","توافق‌نامه","توافق نامه"]}
];

const ACTORS = [
  {id:"central_bank",terms:["central bank","federal reserve","the fed","ecb","بانک مرکزی","فدرال رزرو","بانک مرکزی آمریکا","بانک مرکزی اروپا"]},
  {id:"government",terms:["government","administration","cabinet","دولت","کابینه","دولت آمریکا","دولت ایران"]},
  {id:"opec",terms:["opec","اوپک"]},
  {id:"iran",terms:["iran","iranian","ایران","ایرانی"]},
  {id:"united_states",terms:["united states","u.s. government","washington","آمریکا","ایالات متحده","واشنگتن"]},
  {id:"european_union",terms:["european union","eu commission","اتحادیه اروپا","کمیسیون اروپا"]},
  {id:"parliament",terms:["parliament","congress","مجلس","پارلمان","کنگره"]},
  {id:"company",terms:["company","firm","corporation","شرکت"]}
];

const DIRECTIONS = [
  {id:"increase",terms:["raised","raise","raises","increased","increase","increases","hiked","hike","rose","rises","surged","افزایش داد","افزایش یافت","بالا برد","بالا رفت","رشد کرد","صعود کرد"]},
  {id:"decrease",terms:["cut","cuts","cutting","lowered","lower","reduced","reduce","fell","declined","decreased","کاهش داد","کاهش یافت","پایین آورد","افت کرد","سقوط کرد"]},
  {id:"hold",terms:["held steady","held unchanged","left unchanged","kept unchanged","remained unchanged","remain unchanged","held rates","ثابت نگه داشت","بدون تغییر باقی ماند","تغییری نداد","ثابت ماند"]},
  {id:"approve",terms:["approved","approve","passed","ratified","تصویب کرد","تصویب شد","تأیید کرد","تایید کرد"]},
  {id:"reject",terms:["rejected","reject","vetoed","رفض","رد کرد","رد شد","مخالفت کرد"]},
  {id:"resume",terms:["resumed","resume","restarted","از سر گرفت","ازسرگرفت","از سر گرفته شد"]},
  {id:"suspend",terms:["suspended","suspend","halted","paused","متوقف کرد","تعلیق کرد","متوقف شد"]},
  {id:"impose",terms:["imposed","impose","introduced sanctions","اعمال کرد","وضع کرد","تحمیل کرد"]},
  {id:"lift",terms:["lifted","lift","removed sanctions","لغو کرد","برداشت","رفع کرد"]}
];

const MODAL = /\b(may|might|could|would|should|possibly|potentially|expected to|projected to|forecast to|plans to|will)\b|ممکن است|احتمال دارد|احتمالا|پیش‌بینی می‌شود|پیش بینی می شود|قرار است|قصد دارد|خواهد/u;
const CONDITIONAL = /\b(if|unless|provided that|subject to|conditional on)\b|اگر|در صورت|مشروط به|به شرط/u;
const NEGATION = /\b(did not|does not|do not|not|never|no longer|has not|have not|was not|were not|denied|denies|ruled out)\b|نکرد|نمی‌کند|نمی کند|نشده|نیست|نخواهد|تکذیب|رد کرد/u;

function includesTerm(text, term) {
  const needle = normalize(term);
  if (!needle) return false;
  return (" " + text + " ").includes(" " + needle + " ");
}
function firstMatch(text, rows) {
  for (const row of rows) if (row.terms.some(term => includesTerm(text, term))) return row.id;
  return null;
}
function sourceDomain(article) {
  try {
    const host = new URL(article.url || (String(article.domain || "").startsWith("http") ? article.domain : "https://" + (article.domain || ""))).hostname.toLowerCase().replace(/^www\./, "");
    const bits = host.split(".");
    return bits.length > 2 ? bits.slice(-2).join(".") : host;
  } catch { return String(article.domain || article.source_id || "").toLowerCase().replace(/^www\./, ""); }
}
function sentenceSplit(text) {
  return String(text || "").replace(/\s+/g, " ")
    .split(/(?<=[.!?؟؛])\s+/u).map(x => x.trim()).filter(x => x.length >= 12).slice(0, 40);
}
function extractNumbers(text) {
  const out = [];
  const re = /(?:[$€£]\s*)?\b\d{1,3}(?:,\d{3})*(?:\.\d+)?\s*(?:%|percent|per cent|percentage points?|basis points?|bps|million|billion|trillion|usd|eur|دلار|یورو|درصد|واحد درصد|میلیون|میلیارد|هزار)?/giu;
  for (const match of text.matchAll(re)) {
    const raw = match[0].trim();
    if (!/\d/.test(raw)) continue;
    const value = Number((raw.match(/\d{1,3}(?:,\d{3})*(?:\.\d+)?/) || [""])[0].replace(/,/g, ""));
    const unit = (raw.match(/%|percent|per cent|percentage points?|basis points?|bps|million|billion|trillion|usd|eur|دلار|یورو|درصد|واحد درصد|میلیون|میلیارد|هزار/iu) || [null])[0];
    out.push({value, unit:unit ? normalize(unit) : null, raw});
  }
  return out.slice(0, 8);
}
function extractClaims(article, articleIndex) {
  const title = String(article.title || article.original_title || "").trim();
  const body = String(article.original_text || article.translated_text_fa || article.summary_fa || article.description || "").slice(0, 12000);
  const domain = sourceDomain(article);
  const publishedAt = Date.parse(article.published_at || "");
  const claims = [];
  const sentences = sentenceSplit([title, body].filter(Boolean).join(". "));
  for (let i = 0; i < sentences.length; i++) {
    const raw = sentences[i], text = normalize(raw);
    const topic = firstMatch(text, TOPICS);
    const actor = firstMatch(text, ACTORS);
    const direction = firstMatch(text, DIRECTIONS);
    if (!topic || !direction) continue;
    const conditional = CONDITIONAL.test(text);
    const modal = MODAL.test(text);
    const negated = NEGATION.test(text);
    const years = [...text.matchAll(/\b(?:19|20)\d{2}\b/g)].map(m => Number(m[0]));
    claims.push({
      claim_id: "a" + articleIndex + "_s" + (i + 1),
      article_index: articleIndex,
      sentence_index: i + 1,
      text: raw.slice(0, 700),
      actor,
      topic,
      direction,
      negated,
      certainty: conditional ? "conditional" : modal ? "possible_or_forecast" : "asserted",
      years,
      quantities: extractNumbers(text),
      domain,
      source_id: article.source_id || null,
      source: article.domain || article.source_id || domain || "unknown",
      url: article.url || null,
      published_at: Number.isFinite(publishedAt) ? new Date(publishedAt).toISOString() : null,
      published_ms: Number.isFinite(publishedAt) ? publishedAt : null
    });
  }
  return claims;
}
function timeCompatible(a, b) {
  if (a.years.length && b.years.length && !a.years.some(y => b.years.includes(y))) return false;
  if (a.published_ms && b.published_ms && Math.abs(a.published_ms - b.published_ms) > 7 * 24 * 60 * 60 * 1000) return false;
  return true;
}
function sameClaimScope(a, b) {
  return a.actor && b.actor && a.actor === b.actor && a.topic === b.topic && timeCompatible(a, b);
}
function oppositeDirections(a, b) {
  const pairs = new Set(["increase|decrease","decrease|increase","increase|hold","hold|increase","decrease|hold","hold|decrease","approve|reject","reject|approve","resume|suspend","suspend|resume","impose|lift","lift|impose"]);
  if (pairs.has(a.direction + "|" + b.direction)) return true;
  return a.direction === b.direction && a.negated !== b.negated;
}
function pairClassification(a, b) {
  if (!sameClaimScope(a, b)) return null;
  const differentPublishers = a.domain && b.domain && a.domain !== b.domain;
  if (!differentPublishers) return null;
  if (a.certainty !== "asserted" || b.certainty !== "asserted") {
    return {status:"needs_context",kind:"certainty_or_condition_mismatch",reason:"At least one claim is conditional, forecast, or otherwise uncertain; this is not a confirmed factual contradiction."};
  }
  if (oppositeDirections(a, b)) {
    return {status:"potential_contradiction",kind:"opposite_event_directions",reason:"Two distinct publisher domains describe opposing outcomes for the same detected actor, topic, and compatible time scope."};
  }
  const qa = a.quantities.find(x => x.unit), qb = b.quantities.find(x => x.unit);
  if (qa && qb && qa.unit === qb.unit && qa.value !== qb.value) {
    return {status:"needs_context",kind:"numeric_discrepancy",reason:"The sources report different values with the same detected unit; period, base, methodology, and later revisions must be checked before calling this a contradiction."};
  }
  return null;
}

export function analyzeCrossSourceContradictions(inputArticles, options = {}) {
  const articles = (Array.isArray(inputArticles) ? inputArticles : []).slice(0, Math.max(2, Math.min(100, Number(options.maxArticles) || 80)));
  const claims = articles.flatMap((article, index) => extractClaims(article || {}, index));
  const buckets = new Map();
  for (const claim of claims) {
    const key = claim.actor + "|" + claim.topic;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(claim);
  }
  const comparisons = [];
  for (const group of buckets.values()) {
    for (let i = 0; i < group.length; i++) for (let j = i + 1; j < group.length; j++) {
      const a = group[i], b = group[j];
      if (a.article_index === b.article_index) continue;
      const result = pairClassification(a, b);
      if (!result) continue;
      comparisons.push({
        ...result,
        actor:a.actor, topic:a.topic,
        source_a:{domain:a.domain,source:a.source,url:a.url,published_at:a.published_at,claim:a.text},
        source_b:{domain:b.domain,source:b.source,url:b.url,published_at:b.published_at,claim:b.text},
        source_independence:"different_domains_detected_but_editorial_independence_not_established",
        verification_note_fa:"تفاوت دامنهٔ ناشر به‌تنهایی استقلال تحریریه یا صحت هیچ‌یک از دو ادعا را ثابت نمی‌کند."
      });
    }
  }
  const priority = {potential_contradiction:0,needs_context:1};
  comparisons.sort((a,b) => priority[a.status]-priority[b.status]);
  const capped = comparisons.slice(0, 40);
  return {
    version:NEWS_CONTRADICTION_VERSION,
    mode:"deterministic_cross_source_claim_screening_not_llm_fact_verdict",
    articles_examined:articles.length,
    structured_claims:claims.length,
    claim_coverage:articles.length ? Number((new Set(claims.map(x=>x.article_index)).size / articles.length * 100).toFixed(1)) : 0,
    comparisons:capped,
    potential_contradiction_count:capped.filter(x=>x.status==="potential_contradiction").length,
    needs_context_count:capped.filter(x=>x.status==="needs_context").length,
    limitations:[
      "Only explicit actor-topic-direction claims covered by the current Persian/English rule set are compared.",
      "Different publisher domains do not prove editorial independence.",
      "The engine identifies candidates; it does not determine which claim is true.",
      "Conditional and forecast claims are kept separate from asserted facts.",
      "Numerical differences are review flags, not automatic contradictions."
    ]
  };
}

export function runNewsContradictionBenchmark() {
  const cases = [
    {name:"opposite_interest_rate_decision",articles:[
      {title:"Central bank raised interest rates",original_text:"The central bank raised interest rates by 1 percentage point.",domain:"a.example",url:"https://a.example/1",published_at:"2026-11-15T10:00:00Z"},
      {title:"Central bank cut interest rates",original_text:"The central bank cut interest rates by 1 percentage point.",domain:"b.example",url:"https://b.example/1",published_at:"2026-11-15T11:00:00Z"}],expected:"potential_contradiction"},
    {name:"same_direction_is_not_conflict",articles:[
      {title:"Central bank raised interest rates",domain:"a.example",url:"https://a.example/2",published_at:"2026-11-15T10:00:00Z"},
      {title:"Central bank raised interest rates",domain:"b.example",url:"https://b.example/2",published_at:"2026-11-15T11:00:00Z"}],expected:null},
    {name:"conditional_vs_asserted_is_not_confirmed_conflict",articles:[
      {title:"Central bank may raise interest rates",domain:"a.example",url:"https://a.example/3",published_at:"2026-11-15T10:00:00Z"},
      {title:"Central bank cut interest rates",domain:"b.example",url:"https://b.example/3",published_at:"2026-11-15T11:00:00Z"}],expected:"needs_context"},
    {name:"same_publisher_is_not_independent_cross_source",articles:[
      {title:"Central bank raised interest rates",domain:"a.example",url:"https://a.example/4",published_at:"2026-11-15T10:00:00Z"},
      {title:"Central bank cut interest rates",domain:"a.example",url:"https://a.example/5",published_at:"2026-11-15T11:00:00Z"}],expected:null},
    {name:"different_years_are_not_same_time_scope",articles:[
      {title:"Central bank raised interest rates in 2025",domain:"a.example",url:"https://a.example/6",published_at:"2026-11-15T10:00:00Z"},
      {title:"Central bank cut interest rates in 2026",domain:"b.example",url:"https://b.example/6",published_at:"2026-11-15T11:00:00Z"}],expected:null},
    {name:"persian_opposite_fx_claims",articles:[
      {title:"بانک مرکزی نرخ دلار را افزایش داد",domain:"a.example",url:"https://a.example/fa1",published_at:"2026-11-15T10:00:00Z"},
      {title:"بانک مرکزی نرخ دلار را کاهش داد",domain:"b.example",url:"https://b.example/fa1",published_at:"2026-11-15T11:00:00Z"}],expected:"potential_contradiction"},
    {name:"numeric_difference_is_review_not_truth_verdict",articles:[
      {title:"Central bank rate is 5%",domain:"a.example",url:"https://a.example/7",published_at:"2026-11-15T10:00:00Z"},
      {title:"Central bank rate is 6%",domain:"b.example",url:"https://b.example/7",published_at:"2026-11-15T11:00:00Z"}],expected:"needs_context"}
  ];
  const results = cases.map(item => {
    const report = analyzeCrossSourceContradictions(item.articles);
    const actual = report.comparisons[0]?.status || null;
    return {name:item.name,expected:item.expected,actual,passed:actual===item.expected};
  });
  return {version:NEWS_CONTRADICTION_VERSION,total:results.length,passed:results.filter(x=>x.passed).length,failed:results.filter(x=>!x.passed).length,results};
}
