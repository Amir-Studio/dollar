const STOP = new Set([
  "the","a","an","and","or","of","to","in","on","at","for","from","by","with","as","is","was","were","be","been","will","has","have","had",
  "در","از","به","با","برای","و","یا","را","که","این","آن","یک","های","ها","شد","شده","می","شود","است","هست","بود","بر","تا","پس","اما"
]);
const POSITIVE = ["افزایش","افزود","بالا رفت","رشد","صعود","تقویت","گران شد","increase","increased","rises","rose","surge","gain","gains","up"];
const NEGATIVE = ["کاهش","کاهش یافت","افت","نزول","پایین آمد","تضعیف","ارزان شد","decrease","decreased","falls","fell","drop","decline","down"];
const METRICS = [
  {id:"usd_irr",terms:["دلار","usd","iranian rial","exchange rate","نرخ ارز","ارز آزاد"]},
  {id:"eur_irr",terms:["یورو","eur","euro"]},
  {id:"gold",terms:["طلا","سکه","gold","bullion","اونس"]},
  {id:"oil",terms:["نفت","برنت","oil","crude"]},
  {id:"inflation",terms:["تورم","inflation","cpi","شاخص قیمت"]},
  {id:"interest_rate",terms:["نرخ بهره","نرخ سود","interest rate","policy rate"]},
  {id:"central_bank",terms:["بانک مرکزی","central bank","فدرال رزرو","federal reserve"]},
  {id:"budget",terms:["بودجه","کسری بودجه","budget","fiscal deficit"]},
  {id:"sanctions",terms:["تحریم","sanction"]},
  {id:"exports",terms:["صادرات","export"]},
  {id:"imports",terms:["واردات","import"]}
];
const OFFICIAL_DOMAINS = new Set([
  "cbi.ir","imf.org","worldbank.org","opec.org","eia.gov","fred.stlouisfed.org",
  "federalreserve.gov","bls.gov","bea.gov","treasury.gov","ec.europa.eu","gov.uk",
  "ons.gov.uk","data.gov.ir","amar.org.ir","mimt.gov.ir","tsetmc.com"
]);
const digitMap = {"۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9","٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9"};
const normalizeDigits = value => String(value ?? "").replace(/[۰-۹٠-٩]/g,ch=>digitMap[ch]||ch);
export function normalizeNewsText(value) {
  return normalizeDigits(String(value ?? "").normalize("NFKC"))
    .replace(/[يى]/g,"ی").replace(/ك/g,"ک").toLocaleLowerCase()
    .replace(/[‌ـ]/g," ").replace(/[^\p{L}\p{N}%.,+\- ]/gu," ")
    .replace(/\s+/g," ").trim();
}
function tokens(value) {
  return (normalizeNewsText(value).match(/[\p{L}\p{N}]{2,}/gu)||[]).filter(token=>!STOP.has(token));
}
function unique(values) { return [...new Set(values)]; }
function metricOf(text) {
  const value=normalizeNewsText(text);
  const matches=METRICS.filter(metric=>metric.terms.some(term=>value.includes(normalizeNewsText(term)))).map(x=>x.id);
  return matches.length===1?matches[0]:matches.length? "multiple:"+matches.sort().join(","):"unknown";
}
function polarityOf(text) {
  const value=normalizeNewsText(text);
  const pos=POSITIVE.some(term=>value.includes(normalizeNewsText(term)));
  const neg=NEGATIVE.some(term=>value.includes(normalizeNewsText(term)));
  if(pos&&neg) return "mixed";
  return pos?"positive":neg?"negative":"neutral";
}
function numberFacts(text) {
  const value=normalizeDigits(String(text??"").normalize("NFKC"));
  const matches=[...value.matchAll(/(\d+(?:[.,]\d+)?)\s*(میلیارد|میلیون|هزار|تریلیون|billion|million|thousand|trillion|درصد|٪|percent|ریال|تومان|دلار|دلار|usd|eur|برنت|تن|بشکه)?/giu)];
  return matches.map(match=>{
    let amount=Number(match[1].replace(/,/g,""));
    const unit=String(match[2]||"").toLocaleLowerCase();
    if(["هزار","thousand"].includes(unit)) amount*=1e3;
    if(["میلیون","million"].includes(unit)) amount*=1e6;
    if(["میلیارد","billion"].includes(unit)) amount*=1e9;
    if(["تریلیون","trillion"].includes(unit)) amount*=1e12;
    return {value:amount,unit:unit||"unspecified"};
  }).filter(x=>Number.isFinite(x.value));
}
function dateKey(value) {
  const time=Date.parse(value||"");
  return Number.isFinite(time)?new Date(time).toISOString().slice(0,10):null;
}
function sourceDomain(item) {
  try { return new URL(item?.url||"").hostname.toLowerCase().replace(/^www\./,""); }
  catch { return String(item?.domain||item?.source_id||"unknown").toLowerCase(); }
}
function sourceClass(domain) {
  return [...OFFICIAL_DOMAINS].some(official=>domain===official||domain.endsWith("."+official))
    ?"primary_official_domain":"publisher_unrated";
}
function similarity(a,b) {
  const A=new Set(tokens(a)),B=new Set(tokens(b));
  const common=[...A].filter(x=>B.has(x)).length;
  return common/Math.max(1,new Set([...A,...B]).size);
}
function sameSyndicatedStory(a,b) {
  return similarity(a?.title||a?.original_title,b?.title||b?.original_title)>=0.88;
}
export function extractNewsClaim(item) {
  const title=String(item?.title||item?.original_title||"").trim();
  const text=String(item?.original_text||item?.summary_fa||"").trim();
  const combined=[title,text].filter(Boolean).join(" ");
  const domain=sourceDomain(item);
  const facts=numberFacts(combined);
  const metric=metricOf(combined);
  const polarity=polarityOf(combined);
  const checkable=metric!=="unknown"&&(polarity!=="neutral"||facts.length>0||/اعلام کرد|تصویب|لغو|منع|ممنوع|تعیین کرد|announced|approved|banned|cut|hike/i.test(combined));
  return {
    id:String(item?.id||item?.url||title).slice(0,240),
    title:title.slice(0,500),url:String(item?.url||"").slice(0,2000),
    domain,published_at:item?.published_at||null,published_day:dateKey(item?.published_at),
    source_class:sourceClass(domain),evidence_depth:text.length>160?"rss_excerpt":"headline_only",
    metric,polarity,numbers:facts,checkable,
    tokens:unique(tokens(combined)).slice(0,40)
  };
}
function relation(a,b) {
  const sim=similarity(a.title,b.title);
  if(sim<0.24||a.metric==="unknown"||b.metric==="unknown"||a.metric!==b.metric)
    return {relation:"unrelated",similarity:Number(sim.toFixed(3))};
  if(a.published_day&&b.published_day&&a.published_day!==b.published_day)
    return {relation:"different_publication_day",similarity:Number(sim.toFixed(3))};
  if(a.polarity!=="neutral"&&b.polarity!=="neutral"&&a.polarity!==b.polarity&&a.polarity!=="mixed"&&b.polarity!=="mixed")
    return {relation:"contradicts",similarity:Number(sim.toFixed(3)),reason:"opposite_direction_same_metric_and_day"};
  if(a.numbers.length&&b.numbers.length){
    const sameUnits=a.numbers.some(x=>b.numbers.some(y=>x.unit===y.unit));
    const equal=a.numbers.some(x=>b.numbers.some(y=>x.unit===y.unit&&Math.abs(x.value-y.value)<=Math.max(0.01,Math.abs(x.value)*0.001)));
    if(sameUnits&&!equal)
      return {relation:"numeric_disagreement",similarity:Number(sim.toFixed(3)),reason:"different_numeric_values_same_unit"};
  }
  if(a.polarity!=="neutral"&&a.polarity===b.polarity)
    return {relation:"supports",similarity:Number(sim.toFixed(3)),reason:"same_direction_same_metric_and_day"};
  return {relation:"related_unclear",similarity:Number(sim.toFixed(3))};
}
function independentEvidence(claim, peers) {
  const selected=[];
  for(const peer of peers){
    if(peer.id===claim.id||peer.domain===claim.domain||peer.domain==="unknown") continue;
    if(selected.some(existing=>sameSyndicatedStory(existing,peer))) continue;
    selected.push(peer);
  }
  return selected;
}
export function verifyNewsItems(items) {
  const claims=(Array.isArray(items)?items:[]).map(extractNewsClaim);
  const results=claims.map(claim=>{
    if(!claim.checkable) return {...claim,verdict:"not_checkable_from_headline",confidence_band:"none",supporting_sources:[],contradicting_sources:[],related_sources:[]};
    const peers=independentEvidence(claim,claims).map(peer=>({peer,...relation(claim,peer)})).filter(x=>x.relation!=="unrelated");
    const support=peers.filter(x=>x.relation==="supports");
    const contradiction=peers.filter(x=>x.relation==="contradicts"||x.relation==="numeric_disagreement");
    const unclear=peers.filter(x=>x.relation==="related_unclear"||x.relation==="different_publication_day");
    const verdict=support.length&&contradiction.length?"mixed_evidence":
      contradiction.length>=2&&!support.length?"contradicted_by_independent_headlines":
      support.length>=2&&!contradiction.length?"corroborated_by_independent_headlines":
      contradiction.length||support.length?"single_independent_signal":"insufficient_independent_evidence";
    const decisive=Math.max(support.length,contradiction.length);
    return {
      ...claim,verdict,confidence_band:decisive>=3?"moderate":"low",
      supporting_sources:support.slice(0,5).map(x=>({title:x.peer.title,url:x.peer.url,domain:x.peer.domain,relation:x.relation})),
      contradicting_sources:contradiction.slice(0,5).map(x=>({title:x.peer.title,url:x.peer.url,domain:x.peer.domain,relation:x.relation,reason:x.reason})),
      related_sources:unclear.slice(0,5).map(x=>({title:x.peer.title,url:x.peer.url,domain:x.peer.domain,relation:x.relation})),
      verdict_caution:"این برچسب فقط مقایسهٔ تیترها و گزیده‌های RSS است؛ اثبات حقیقت نیست. متن کامل، تعریف شاخص، واحد و زمان مشاهده باید بررسی شود."
    };
  });
  const conflicts=[];
  for(let i=0;i<claims.length;i++) for(let j=i+1;j<claims.length;j++){
    if(claims[i].domain===claims[j].domain) continue;
    const result=relation(claims[i],claims[j]);
    if(["contradicts","numeric_disagreement"].includes(result.relation)){
      conflicts.push({
        claim_a:{title:claims[i].title,url:claims[i].url,domain:claims[i].domain,published_at:claims[i].published_at},
        claim_b:{title:claims[j].title,url:claims[j].url,domain:claims[j].domain,published_at:claims[j].published_at},
        relation:result.relation,reason:result.reason,similarity:result.similarity,
        status:"potential_conflict_requires_full_text_review"
      });
    }
    if(conflicts.length>=20) break;
  }
  return {
    engine:"dollar-news-verification",version:"1.0.0",
    article_count:claims.length,checkable_count:claims.filter(x=>x.checkable).length,
    verdict_counts:results.reduce((acc,item)=>(acc[item.verdict]=(acc[item.verdict]||0)+1,acc),{}),
    claims:results,conflicts,
    limitations:["تیتر یا چکیده جای متن کامل و سند اولیه را نمی‌گیرد.","تفاوت تاریخ، واحد، تعریف شاخص یا بازهٔ زمانی به‌تنهایی تناقض نیست.","تکرار یک خبر در چند رسانه، چند شاهد مستقل محسوب نمی‌شود.","امتیاز اطمینان کالیبره‌شده نیست و حکم قطعی صادر نمی‌شود."]
  };
}
const SEARCH_STOP=new Set([...STOP,"ایران","iran","بازار","market","گزارش","report","خبر","news","اعلام","گفت","گفته","according","said"]);
export function buildGdeltQuery(claim) {
  const words=unique(tokens(claim).filter(x=>!SEARCH_STOP.has(x)));
  return words.slice(0,8).join(" ").slice(0,180);
}
export function compareClaimToSearchEvidence(claimText, articles) {
  const claim=extractNewsClaim({title:claimText,published_at:new Date().toISOString(),url:"https://claim.invalid/"});
  const evidence=(Array.isArray(articles)?articles:[]).map(extractNewsClaim)
    .filter(item=>item.domain!=="claim.invalid"&&item.domain!=="unknown");
  const comparisons=evidence.map(item=>({item,...relation(claim,item)}))
    .filter(item=>item.relation!=="unrelated")
    .sort((a,b)=>b.similarity-a.similarity);
  const supports=comparisons.filter(x=>x.relation==="supports");
  const contradicts=comparisons.filter(x=>["contradicts","numeric_disagreement"].includes(x.relation));
  const independent=(rows)=>rows.filter((row,index)=>rows.findIndex(other=>other.item.domain===row.item.domain)===index);
  const supportSources=independent(supports),contradictSources=independent(contradicts);
  const verdict=supportSources.length&&contradictSources.length?"mixed_evidence":
    contradictSources.length>=2?"contradicted_by_retrieved_headlines":
    supportSources.length>=2?"corroborated_by_retrieved_headlines":"insufficient_or_ambiguous_evidence";
  return {
    claim:claimText,verdict,confidence_band:"low",
    search_result_count:evidence.length,supporting_count:supportSources.length,contradicting_count:contradictSources.length,
    evidence:comparisons.slice(0,12).map(x=>({
      title:x.item.title,url:x.item.url,domain:x.item.domain,published_at:x.item.published_at,
      relation:x.relation,reason:x.reason||null,source_class:x.item.source_class
    })),
    caution:"نتایج جست‌وجو فقط سرنخ‌اند. موتور از روی تیترهای بازیابی‌شده نمی‌تواند خبر را قطعی درست یا دروغ اعلام کند؛ برای ادعای مهم باید متن کامل و منبع اولیه بررسی شود."
  };
}
