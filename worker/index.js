import { handleForecastApi, runForecastCycle, isMarketRelevantHeadline, getMarketSnapshot, headlineConflictCandidates } from "./forecast-engine.js";
import { verifyNewsItems, compareClaimToSearchEvidence, buildGdeltQuery } from "./news-verification-engine.js";
import { analyzeMarketLanguage, VERSION as LANGUAGE_ENGINE_VERSION } from "./language-engine.js";
import { PRAGMATICS_VERSION, PRAGMATICS_PHRASE_COUNT } from "./pragmatics-engine.js";
import { analyzeConversationContext, CONVERSATION_CONTEXT_VERSION } from "./conversation-context-engine.js";
import { buildDecisionBrief, DECISION_ENGINE_VERSION, runDecisionEngineSelfTest } from "./decision-engine.js";
const ORIGIN = "https://amir-studio.github.io";
const MARKET_URL = "https://raw.githubusercontent.com/iran-market/iran-market.github.io/main/data/popular.json";
const HISTORY_URL = "https://raw.githubusercontent.com/iran-market/iran-market.github.io/main/data/history/";
const ASSETS = {
  USD_IRR_FREE: "دلار آزاد (USD/IRR)",
  EUR_IRR_FREE: "یورو آزاد (EUR/IRR)",
  GBP_IRR_FREE: "پوند آزاد (GBP/IRR)",
  GOLD_18K_IRR: "طلای ۱۸ عیار",
  COIN_EMAMI_IRR: "سکه امامی",
  USDT_IRR: "تتر به تومان"
};
// Only assets whose historical-series endpoint has been verified are enabled for forecasts.
const ANALYSIS_ASSETS = new Set([
  "USD_IRR_FREE", "EUR_IRR_FREE", "GOLD_18K_IRR", "COIN_EMAMI_IRR"
]);
const H = {
  "content-type": "application/json; charset=utf-8",
  "access-control-allow-origin": ORIGIN,
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "Content-Type",
  "x-content-type-options": "nosniff"
};
const reply = (body, status = 200, extra = {}) =>
  new Response(JSON.stringify(body), { status, headers: { ...H, ...extra } });
const n = v => {
  const x = Number(String(v ?? "").replace(/[٬,\s]/g, "").replace(/٫/g, "."));
  return Number.isFinite(x) ? x : NaN;
};
function dateMs(v) {
  if (typeof v === "number" || /^\d{10,13}$/.test(String(v ?? ""))) {
    const s = String(v), x = Number(v);
    return s.length === 10 ? x * 1000 : x;
  }
  return Date.parse(String(v ?? ""));
}
async function getJson(url) {
  const r = await fetch(url, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(12000) });
  if (!r.ok) throw Error("Source HTTP " + r.status);
  return r.json();
}
function historyRows(payload) {
  const raw = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : Array.isArray(payload?.history) ? payload.history : Array.isArray(payload?.items) ? payload.items : Array.isArray(payload?.points) ? payload.points : Array.isArray(payload?.samples) ? payload.samples : [];
  return raw.map(r => {
    // NerkhAra's documented history format is [YYYY-MM-DD, price], while
    // the fallback provider uses objects such as { t, close }.
    const dateValue = Array.isArray(r) ? r[0] : r.date ?? r.datetime ?? r.timestamp ?? r.time ?? r.date_gregorian ?? r.observed_at ?? r.day ?? r.t;
    const priceValue = Array.isArray(r) ? r[1] : r.close ?? r.c ?? r.price ?? r.value ?? r.last ?? r.close_price ?? r.mean ?? r.average ?? r.avg ?? r.p;
    return { date:dateMs(dateValue), close:n(priceValue) };
  }).filter(r => Number.isFinite(r.date) && Number.isFinite(r.close) && r.close > 0).sort((a,b) => a.date-b.date);
}
function runHistoryParserSelfTest() {
  const tupleRows = historyRows({points:[["2026-11-12",100],["2026-11-13",101]]});
  const objectRows = historyRows({data:[{t:"2026-11-12T00:00:00.000Z",close:100},{t:"2026-11-13T00:00:00.000Z",close:101}]});
  const compactRows = historyRows([{timestamp:"2026-11-12T00:00:00.000Z",p:100}]);
  const tests = [
    {name:"nerkhara_date_price_tuples",passed:tupleRows.length===2&&tupleRows[1].close===101},
    {name:"fallback_ohlc_objects",passed:objectRows.length===2&&objectRows[1].close===101},
    {name:"compact_price_objects",passed:compactRows.length===1&&compactRows[0].close===100}
  ];
  return {total:tests.length,passed:tests.filter(x=>x.passed).length,failed:tests.filter(x=>!x.passed)};
}
function stats(rows) {
  const p = rows.slice(-30), y = p.map(x => Math.log(x.close)), len = y.length;
  if (len < 8) return null;
  const xm = (len - 1) / 2, ym = y.reduce((a,b) => a+b, 0) / len;
  let a = 0, b = 0;
  y.forEach((v,i) => { a += (i-xm)*(v-ym); b += (i-xm)**2; });
  const slope = b ? a/b : 0, intercept = ym - slope*xm;
  const residual = y.map((v,i) => v - (intercept+slope*i));
  const sigma = Math.sqrt(residual.reduce((s,v)=>s+v*v,0)/Math.max(1,len-2));
  const pctBack = days => p.length > days ? (p[p.length-1].close/p[p.length-1-days].close-1)*100 : null;
  const returns = p.slice(1).map((r,i)=>Math.log(r.close/p[i].close));
  const meanReturn = returns.reduce((s,v)=>s+v,0)/Math.max(1,returns.length);
  const dailyVol = Math.sqrt(returns.reduce((s,v)=>s+(v-meanReturn)**2,0)/Math.max(1,returns.length-1))*100;
  let peak = 0, maxDrawdown = 0;
  p.forEach(r=>{peak=Math.max(peak,r.close);if(peak>0)maxDrawdown=Math.min(maxDrawdown,(r.close/peak-1)*100)});
  return {
    count: len, daily_pct: (Math.exp(slope)-1)*100,
    baseline7: Math.exp(intercept+slope*(len-1+7)), sigma,
    momentum_7d_pct: pctBack(7), momentum_14d_pct: pctBack(14), momentum_30d_pct: pctBack(29),
    daily_volatility_pct: dailyVol, max_drawdown_30d_pct: maxDrawdown
  };
}
function xmlText(value) {
  return String(value || "").replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n,16)))
    .replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">")
    .replace(/&quot;/g,'"').replace(/&apos;/g,"'")
    .replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim();
}
function googleNewsUrl(query, locale) {
  const params = new URLSearchParams({
    q: query,
    hl: locale === "fa" ? "fa" : "en-US",
    gl: locale === "fa" ? "IR" : "US",
    ceid: locale === "fa" ? "IR:fa" : "US:en"
  });
  return "https://news.google.com/rss/search?" + params.toString();
}
const NEWS_SOURCES = [
  {source_id:"gdelt-doc-2",name:"GDELT DOC 2.0 web search",country_code:"ZZ",language_code:"und",site_url:"https://www.gdeltproject.org",feed_url:"https://api.gdeltproject.org/api/v2/doc/doc",active:false,trust_tier:"unrated"},
  {source_id:"google-news-fa",name:"Google News · Persian search (temporarily unavailable)",country_code:"IR",language_code:"fa",site_url:"https://news.google.com",feed_url:googleNewsUrl("(اقتصاد ایران OR بازار ارز OR دلار OR طلا OR تورم OR بانک مرکزی OR نرخ بهره OR نفت) when:3d","fa"),active:false,trust_tier:"unrated"},
  {source_id:"google-news-en",name:"Google News · Iran economy (temporarily unavailable)",country_code:"US",language_code:"en",site_url:"https://news.google.com",feed_url:googleNewsUrl("(Iran economy OR Iranian rial OR Iran currency OR Iran sanctions OR Iran oil OR Iran gold) when:3d","en"),active:false,trust_tier:"unrated"},
  {source_id:"google-news-global",name:"Google News · Global markets (temporarily unavailable)",country_code:"US",language_code:"en",site_url:"https://news.google.com",feed_url:googleNewsUrl("(gold price OR oil price OR inflation OR central bank OR interest rates OR currency markets) when:3d","en"),active:false,trust_tier:"unrated"},
  {source_id:"irna-fa",name:"IRNA Persian",country_code:"IR",language_code:"fa",site_url:"https://www.irna.ir",feed_url:"https://www.irna.ir/rss",active:true,trust_tier:"unrated"},
  {source_id:"isna-fa",name:"ISNA",country_code:"IR",language_code:"fa",site_url:"https://www.isna.ir",feed_url:"https://www.isna.ir/rss",active:true,trust_tier:"unrated"},
  {source_id:"yjc-fa",name:"YJC News",country_code:"IR",language_code:"fa",site_url:"https://www.yjc.ir",feed_url:"https://www.yjc.ir/fa/rss/allnews",active:true,trust_tier:"unrated"},
  {source_id:"tabnak-fa",name:"Tabnak",country_code:"IR",language_code:"fa",site_url:"https://www.tabnak.ir",feed_url:"https://www.tabnak.ir/fa/rss/allnews",active:true,trust_tier:"unrated"},
  {source_id:"khabaronline-fa",name:"Khabaronline",country_code:"IR",language_code:"fa",site_url:"https://www.khabaronline.ir",feed_url:"https://www.khabaronline.ir/rss",active:true,trust_tier:"unrated"},
  {source_id:"asriran-fa",name:"Asr Iran",country_code:"IR",language_code:"fa",site_url:"https://www.asriran.com",feed_url:"https://www.asriran.com/fa/rss/allnews",active:true,trust_tier:"unrated"},
  {source_id:"tasnim-fa",name:"Tasnim Persian (temporarily unavailable)",country_code:"IR",language_code:"fa",site_url:"https://www.tasnimnews.com",feed_url:"https://www.tasnimnews.com/fa/rss/feed/0/8/0/%D9%85%D9%87%D9%85%D8%AA%D8%B1%DB%8C%D9%86-%D8%A7%D8%AE%D8%A8%D8%A7%D8%B1-%D8%AA%D8%B3%D9%86%DB%8C%D9%85",active:false,trust_tier:"unrated"},
  {source_id:"mehr-fa",name:"Mehr News",country_code:"IR",language_code:"fa",site_url:"https://www.mehrnews.com",feed_url:"https://www.mehrnews.com/rss",active:true,trust_tier:"unrated"},
  {source_id:"irna-en",name:"IRNA English",country_code:"IR",language_code:"en",site_url:"https://en.irna.ir",feed_url:"https://en.irna.ir/rss",active:true,trust_tier:"unrated"},
  {source_id:"tasnim-en",name:"Tasnim English",country_code:"IR",language_code:"en",site_url:"https://www.tasnimnews.ir/en",feed_url:"https://www.tasnimnews.ir/en/rss",active:false,trust_tier:"unrated"},
  {source_id:"bbc-business",name:"BBC Business",country_code:"GB",language_code:"en",site_url:"https://www.bbc.com/news/business",feed_url:"https://feeds.bbci.co.uk/news/business/rss.xml",active:true,trust_tier:"unrated"},
  {source_id:"aljazeera-all",name:"Al Jazeera",country_code:"QA",language_code:"en",site_url:"https://www.aljazeera.com",feed_url:"https://www.aljazeera.com/xml/rss/all.xml",active:true,trust_tier:"unrated"},
  {source_id:"guardian-business",name:"The Guardian · Business",country_code:"GB",language_code:"en",site_url:"https://www.theguardian.com/business",feed_url:"https://www.theguardian.com/business/rss",active:true,trust_tier:"unrated"},
  {source_id:"marketwatch-top",name:"MarketWatch",country_code:"US",language_code:"en",site_url:"https://www.marketwatch.com",feed_url:"https://feeds.marketwatch.com/marketwatch/topstories",active:true,trust_tier:"unrated"},
  {source_id:"cnbc-markets",name:"CNBC Markets",country_code:"US",language_code:"en",site_url:"https://www.cnbc.com/markets",feed_url:"https://www.cnbc.com/id/10001147/device/rss/rss.html",active:true,trust_tier:"unrated"}
];
const NEWS_FEEDS = NEWS_SOURCES.filter(source => source.active)
  .map(({source_id,language_code,feed_url}) => ({source_id,language_code,url:feed_url}));
function isMarketNews(title) { return isMarketRelevantHeadline(title); }
function rssTag(block, tag) {
  const safe = tag.replace(/[.*+?^$()|[\]\\]/g,"\\$&");
  const match = block.match(new RegExp("<" + safe + "(?:\\s[^>]*)?>([\\s\\S]*?)</" + safe + ">", "i"));
  return match ? xmlText(match[1]) : "";
}
function rssLink(block, feedUrl) {
  const textLink = rssTag(block,"link");
  const atomLink = block.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*\/?>/i)?.[1] || "";
  const raw = textLink || atomLink || rssTag(block,"guid");
  try { return new URL(xmlText(raw),feedUrl).href; } catch { return ""; }
}
async function readNewsFeed(feed, maxAgeHours = 72) {
  const response = await fetch(feed.url, {
    headers: { accept:"application/rss+xml, application/atom+xml, application/xml, text/xml", "user-agent":"DollarMarketBrief/2.0" },
    signal:AbortSignal.timeout(12000)
  });
  if (!response.ok) throw Error("News feed HTTP " + response.status);
  const xml = await response.text(), items = [];
  const blocks = [...xml.matchAll(/<(item|entry)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi)];
  let invalid=0, outsideWindow=0, irrelevant=0;
  for (const match of blocks) {
    const block=match[2], title=rssTag(block,"title"), link=rssLink(block,feed.url);
    const articleText=(rssTag(block,"content:encoded") || rssTag(block,"description") || rssTag(block,"summary") || rssTag(block,"content")).slice(0,3000);
    const publishedText=rssTag(block,"pubDate") || rssTag(block,"published") || rssTag(block,"updated") || rssTag(block,"dc:date") || rssTag(block,"date");
    const published=Date.parse(publishedText);
    if (!title || !/^https?:\/\//i.test(link) || !Number.isFinite(published)) { invalid++; continue; }
    if (published>Date.now()+5*60*1000 || Date.now()-published>maxAgeHours*60*60*1000) { outsideWindow++; continue; }
    if (!isMarketNews(title)) { irrelevant++; continue; }
    const sourceMatch=block.match(/<source\b([^>]*)>([\s\S]*?)<\/source>/i);
    const sourceUrl=sourceMatch?.[1]?.match(/\burl=["']([^"']+)["']/i)?.[1];
    let domain="";
    try { domain=new URL(sourceUrl || link).hostname.replace(/^www\./,""); } catch {}
    items.push({
      title,url:link,domain,published_at:new Date(published).toISOString(),
      source_id:feed.source_id,language_code:feed.language_code,original_title:title,
      original_text:articleText
    });
  }
  console.log("News feed parsed:",feed.source_id,"http",response.status,"raw",blocks.length,"accepted",items.length,"invalid",invalid,"outside_archive_window_hours",maxAgeHours,"outside_window",outsideWindow,"irrelevant",irrelevant);
  return items;
}
function gdeltTimestamp(value) {
  const raw=String(value||"");
  const match=raw.match(/^(\d{4})(\d{2})(\d{2})T?(\d{2})(\d{2})(\d{2})Z?$/);
  if(match) return Date.UTC(Number(match[1]),Number(match[2])-1,Number(match[3]),Number(match[4]),Number(match[5]),Number(match[6]));
  return Date.parse(raw);
}
async function searchGdelt(query,{timespan="3d",limit=75}={}) {
  const params=new URLSearchParams({query:String(query||"").slice(0,500),mode:"ArtList",format:"json",maxrecords:String(Math.max(1,Math.min(100,Number(limit)||75))),timespan:String(timespan),sort:"HybridRel"});
  const endpoint="https://api.gdeltproject.org/api/v2/doc/doc?"+params.toString();
  const response=await fetch(endpoint,{headers:{accept:"application/json","user-agent":"DollarMarketNewsVerifier/1.0 (+https://amir-studio.github.io/dollar/)"},signal:AbortSignal.timeout(12000)});
  if(!response.ok) throw Error("GDELT search HTTP "+response.status);
  const contentType=String(response.headers.get("content-type")||"").toLowerCase();
  if(contentType&&!contentType.includes("json")) throw Error("GDELT returned non-JSON content");
  const payload=await response.json();
  const docs=Array.isArray(payload?.articles)?payload.articles:Array.isArray(payload?.docs)?payload.docs:[];
  const now=Date.now();
  return docs.flatMap(doc=>{
    const title=String(doc?.title||"").trim(),url=String(doc?.url||"").trim(),stamp=gdeltTimestamp(doc?.seendate||doc?.published_at||doc?.date);
    if(!title||!/^https?:\/\//i.test(url)||!Number.isFinite(stamp)||stamp>now+5*60000) return [];
    let domain=String(doc?.domain||"");
    try{domain=domain||new URL(url).hostname.replace(/^www\./,"");}catch{return [];}
    return [{
      title,url,domain,published_at:new Date(stamp).toISOString(),
      source_id:"gdelt-doc-2",language_code:String(doc?.language||"unknown").toLowerCase(),
      original_title:title,original_text:null,article_status:"headline_only",
      search_provider:"GDELT DOC 2.0",source_country:String(doc?.sourcecountry||"unknown")
    }];
  });
}
async function collectNews({ maxAgeHours = 72, limit = 50 } = {}) {
  const results=await Promise.allSettled(NEWS_FEEDS.map(feed => readNewsFeed(feed,maxAgeHours)));
  let discovery=[];
  try {
    const days=Math.max(1,Math.min(30,Math.ceil(maxAgeHours/24)));
    discovery=await searchGdelt('("Iran economy" OR "Iranian rial" OR "gold price" OR "oil price" OR inflation OR "central bank" OR "currency market")',{timespan:days+"d",limit:75});
    console.log("GDELT discovery completed:","items",discovery.length,"window_days",days);
  } catch(error) {
    console.error("GDELT discovery unavailable:",String(error?.message||error).slice(0,180));
  }
  const seenUrls=new Set(),items=[];
  results.forEach((result,index)=>{
    const sourceId=NEWS_FEEDS[index].source_id;
    if(result.status!=="fulfilled"){
      console.error("News feed failed:",sourceId,String(result.reason?.message || result.reason).slice(0,180));
      return;
    }
    console.log("News feed completed:",sourceId,"items",result.value.length);
    for(const item of result.value){
      const urlKey=item.url.toLowerCase().replace(/[?#].*$/,"");
      const titleKey=item.title.toLocaleLowerCase().replace(/\s+/g," ").trim();
      if(!urlKey || seenUrls.has(urlKey) || !titleKey) continue;
      // Preserve the same event reported by different publishers; only exact URLs are deduplicated.
      seenUrls.add(urlKey);items.push(item);
    }
  });
  for(const item of discovery){
    const urlKey=item.url.toLowerCase().replace(/[?#].*$/,"");
    if(urlKey&&!seenUrls.has(urlKey)){seenUrls.add(urlKey);items.push(item);}
  }
  const sorted=items.sort((a,b)=>Date.parse(b.published_at)-Date.parse(a.published_at)).slice(0,Math.max(1,Math.min(200,Number(limit)||50)));
  console.log("News collection completed:","feeds",results.filter(x=>x.status==="fulfilled").length,"failed",results.filter(x=>x.status==="rejected").length,"unique",sorted.length);
  return sorted;
}
function newsTopics(items) {
  const groups = [
    {name:"ارز و سیاست پولی",terms:["دلار","ارز","بانک مرکزی","نرخ بهره","currency","central bank","exchange rate","federal reserve"]},
    {name:"طلا و فلزات گران‌بها",terms:["طلا","سکه","اونس","gold","bullion","precious metal"]},
    {name:"تورم و اقتصاد",terms:["تورم","قیمت‌ها","اقتصاد","inflation","economy","prices","cpi"]},
    {name:"انرژی و نفت",terms:["نفت","انرژی","oil","energy","opec"]},
    {name:"تجارت و اقتصاد داخلی",terms:["اقتصاد","اقتصادی","بودجه","صادرات","واردات","تجارت","گمرک","اشتغال","تولید","مالیات","یارانه"]},
    {name:"مسکن و خودرو",terms:["مسکن","خودرو","housing","property","vehicle","car prices"]},
    {name:"سیاست خارجی و ریسک منطقه‌ای",terms:["تحریم","تحریم اقتصادی","مذاکره","جنگ","سیاست خارجی","ریسک منطقه‌ای","sanction","iran sanctions","iran war","war","nuclear","geopolit"]}
  ];
  return groups.map(group => {
    const matches = items.filter(item => {
      const text = (item.title+" "+item.domain).toLocaleLowerCase();
      return group.terms.some(term=>text.includes(term.toLocaleLowerCase()));
    });
    return {title_fa:group.name,impact:"unknown",
      explanation_fa:matches.length
        ? "این موضوع در تیترهای خبرهای گردآوری‌شده دیده شده است؛ اثر آن بر قیمت باید با متن کامل خبر و داده‌های بازار سنجیده شود."
        : "در خبرهای تازهٔ دریافت‌شده، اشارهٔ برجسته‌ای به این موضوع پیدا نشد.",
      evidence:matches.slice(0,2).map(x=>x.title).join("؛ "),count:matches.length};
  }).filter(x=>x.count>0).sort((a,b)=>b.count-a.count).slice(0,5);
}
async function makeFreeAnalysis(env, asset) {
  if (!ANALYSIS_ASSETS.has(asset)) return reply({error:"تاریخچهٔ معتبر این دارایی هنوز بررسی نشده؛ فقط قیمت آن در کاتالوگ ثبت می‌شود."},424);
  const [cachedMarket, rawHistory, cachedNews] = await Promise.all([
    readFreshCache(env,"market:latest",10*60*1000),
    getJson((env.NERKHARA_HISTORY_URL || "https://nerkhara.com/api/v1/history/") + ({USD_IRR_FREE:"usd",EUR_IRR_FREE:"eur",GOLD_18K_IRR:"gold-18k",COIN_EMAMI_IRR:"coin-emami"}[asset]) + ".json").catch(() => getJson((env.HISTORY_BASE_URL || HISTORY_URL) + encodeURIComponent(asset) + ".json")),
    readFreshCache(env,"news:latest",45*60*1000)
  ]);
  const market = cachedMarket?.payload || await getMarketSnapshot(env);
  const storedNews = cachedNews?.items ? [] : await readNewsFromSupabase(env).catch(() => []);
  const news = cachedNews?.items || storedNews;
  const item = (market.data || []).find(x => x.symbol === asset);
  if (!item || item.stale === true || market.meta?.stale === true) return reply({error:"منبع قیمت تازه نیست؛ تحلیل جدید ساخته نشد."},424);
  const price = n(item.price), stamp = dateMs(item.timestamp || market.meta?.published_at);
  if (!(price > 0) || !Number.isFinite(stamp) || Date.now()-stamp > 24*60*60*1000 || stamp>Date.now()+5*60*1000)
    return reply({error:"آخرین نرخ ثبت‌شده بیش از ۲۴ ساعت قدیمی یا نامعتبر است؛ تحلیل جدید ساخته نشد."},424);
  const rows = historyRows(rawHistory);
  if (rows.length < 12) return reply({error:"تاریخچه کافی برای تحلیل در دسترس نیست."},424);
  const model = stats(rows);
  const expected = Math.max(-15,Math.min(15,(model.baseline7/price-1)*100));
  const target = price*(1+expected/100);
  const uncertainty = Math.max(2.5,Math.min(18,model.sigma*Math.sqrt(7)*100*1.5));
  const recent = news.filter(x=>Date.now()-Date.parse(x.published_at)<=24*60*60*1000);
  const languageAnalysis = analyzeMarketLanguage(news, rows);
  const topics = languageAnalysis.themes;
  const decisionBrief = buildDecisionBrief({
    asset,
    quote:{price,source_time:new Date(stamp).toISOString(),source:String(item.source || "unknown")},
    history:{rows,summary:{observations:model.count,last_price:model.last_price,daily_trend_pct:model.daily_pct,momentum_7d_pct:model.momentum_7d_pct,momentum_14d_pct:model.momentum_14d_pct,momentum_30d_pct:model.momentum_30d_pct,daily_volatility_pct:model.daily_volatility_pct,max_drawdown_30d_pct:model.max_drawdown_30d_pct}},
    news,languageAnalysis
  });
  const direction = expected>0.35?"up":expected< -0.35?"down":"sideways";
  const directionFa = direction==="up"?"تمایل آماری صعودی":direction==="down"?"تمایل آماری نزولی":"روند آماری کم‌جهت";
  const summary = "بر پایهٔ رگرسیون لگاریتمی " + model.count + " مشاهدهٔ اخیر، روند روزانه حدود " +
    model.daily_pct.toFixed(2) + "٪ و تغییر ۷روزهٔ گذشته " +
    (model.momentum_7d_pct===null?"نامشخص":model.momentum_7d_pct.toFixed(2)+"٪") +
    " بوده است. برآورد آماری ۷روزه " + directionFa + " را نشان می‌دهد. این گزارش از مدل زبانی استفاده نمی‌کند؛ خبرها فقط گردآوری و بر اساس موضوع دسته‌بندی شده‌اند.";
  const risks = [];
  if (recent.length < 3) risks.push("پوشش خبرهای دارای تاریخ در ۲۴ ساعت اخیر محدود است؛ ممکن است رویداد مهمی از دست رفته باشد.");
  if (rows.length < 30) risks.push("تاریخچه کمتر از ۳۰ مشاهده دارد؛ برآورد آماری ناپایدارتر است.");
  if (model.daily_volatility_pct > 2) risks.push("نوسان روزانهٔ تاریخی بالاست؛ محدودهٔ سناریو را با احتیاط بخوان.");
  risks.push("هستهٔ زبانی نسخهٔ ۰.۱ تیترها را تحلیل می‌کند، نه متن کامل مقاله‌ها؛ جهت اثر خبر بدون شواهد تکمیلی قطعی نیست.");
  if (languageAnalysis.possible_conflicts.length) risks.push("چند تیتر با چارچوب رویدادی متفاوت شناسایی شد؛ این موارد تناقض قطعی نیستند و نیاز به بررسی متن کامل دارند.");
  return reply({
    mode:"free-algorithmic",asset,asset_fa:ASSETS[asset],generated_at:new Date().toISOString(),
    quote:{price,source_time:new Date(stamp).toISOString(),source:String(item.source || "unknown"),provider_meta:item.provider_meta||null},
    forecast:{horizon_days:7,direction,headline_fa:directionFa,summary_fa:summary,
      expected_change_pct:Number(expected.toFixed(2)),target_price:Math.round(target),
      range_low:Math.round(target*(1-uncertainty/100)),range_high:Math.round(target*(1+uncertainty/100)),
      confidence:null,uncertainty_pct:Number(uncertainty.toFixed(2))},
    drivers:topics,risks_fa:risks,sources:news,
    decision_brief:decisionBrief,
    language_analysis:languageAnalysis,
    news_sources_count:news.length,recent_sources_count:recent.length,news_window_hours:72,
    coverage_score:Math.min(100,recent.length*12),
    baseline:{daily_trend_pct:Number(model.daily_pct.toFixed(3)),
      momentum_7d_pct:model.momentum_7d_pct===null?null:Number(model.momentum_7d_pct.toFixed(3)),
      momentum_14d_pct:model.momentum_14d_pct===null?null:Number(model.momentum_14d_pct.toFixed(3)),
      momentum_30d_pct:model.momentum_30d_pct===null?null:Number(model.momentum_30d_pct.toFixed(3)),
      daily_volatility_pct:Number(model.daily_volatility_pct.toFixed(3)),
      max_drawdown_30d_pct:Number(model.max_drawdown_30d_pct.toFixed(3)),
      regression_target:Math.round(model.baseline7),observations:model.count},
    note_fa:"تحلیل نسخهٔ نخست هستهٔ پردازش زبان تخصصی فارسی و انگلیسی به‌همراه تاریخچهٔ قیمت است؛ هنوز مدل زبانی مولد نیست و توصیهٔ خریدوفروش ارائه نمی‌کند."
  },200,{"cache-control":"public, max-age=300","vary":"Origin"});
}

async function readFreshCache(env, key, maxAgeMs) {
  if (!env.MARKET_CACHE) return null;
  try {
    const value = await env.MARKET_CACHE.get(key,"json");
    const fetchedAt = Date.parse(value?.fetched_at || "");
    if (!value || !Number.isFinite(fetchedAt) || Date.now()-fetchedAt > maxAgeMs || fetchedAt > Date.now()+60000) return null;
    return value;
  } catch { return null; }
}
async function persistQuotesToSupabase(env, market) {
  const baseUrl = String(env.SUPABASE_URL || "").replace(/\/+$/, "");
  const secretKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!baseUrl || !secretKey) {
    console.log("Supabase quote persistence skipped: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing.");
    return { enabled: false, saved: 0 };
  }

  const rows = (market.data || []).flatMap(item => {
    const asset = item?.symbol;
    const price = n(item?.price);
    const stamp = dateMs(item?.timestamp || market.meta?.published_at || market.meta?.timestamp);
    if (!Object.hasOwn(ASSETS, asset) || item?.stale === true || !(price > 0) || !Number.isFinite(stamp) ||
        stamp > Date.now() + 5 * 60 * 1000 || Date.now() - stamp > 24 * 60 * 60 * 1000) return [];
    return [{
      asset,
      price,
      source: String(item.source || "unknown"),
      observed_at: new Date(stamp).toISOString()
    }];
  });

  if (!rows.length) return { enabled: true, saved: 0 };
  const response = await fetch(baseUrl + "/rest/v1/market_quotes?on_conflict=asset,source,observed_at", {
    method: "POST",
    headers: {
      apikey: secretKey,
      authorization: "Bearer " + secretKey,
      "content-type": "application/json",
      prefer: "resolution=ignore-duplicates,return=minimal"
    },
    body: JSON.stringify(rows),
    signal: AbortSignal.timeout(15000)
  });
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 240);
    throw Error("Supabase insert HTTP " + response.status + (detail ? ": " + detail : ""));
  }
  return { enabled: true, saved: rows.length };
}

function cleanNewsItems(items) {
  const seen = new Set();
  return (Array.isArray(items) ? items : []).filter(item => {
    const title = String(item?.title || "").trim();
    const published = Date.parse(item?.published_at || "");
    let url;
    try { url = new URL(item?.url || ""); } catch { return false; }
    if (!title || !Number.isFinite(published) || published > Date.now() + 5*60*1000 || Date.now()-published > 72*60*60*1000) return false;
    if (!["https:","http:"].includes(url.protocol) || !isMarketNews(title)) return false;
    const key = url.href.toLowerCase().replace(/[?#].*$/, "");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).sort((a,b) => Date.parse(b.published_at)-Date.parse(a.published_at)).slice(0,30);
}

async function readNewsFromSupabase(env) {
  const base = String(env.SUPABASE_URL || "").replace(/\/+$/, "");
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) return [];
  const params = new URLSearchParams({
    select: "title,url,domain,published_at,source_id,language_code,original_title,original_text,translated_text_fa,summary_fa,article_status",
    published_at: "gte." + new Date(Date.now()-72*60*60*1000).toISOString(),
    order: "published_at.desc",
    limit: "30"
  });
  const response = await fetch(base + "/rest/v1/market_news_items?" + params.toString(), {
    headers: { apikey:key, authorization:"Bearer "+key, accept:"application/json" },
    signal: AbortSignal.timeout(12000)
  });
  if (!response.ok) throw Error("Supabase news read HTTP " + response.status);
  return cleanNewsItems(await response.json());
}

async function syncNewsToSupabase(env) {
  const base = String(env.SUPABASE_URL || "").replace(/\/+$/, "");
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) return { enabled:false, refreshed:false, items:[] };
  const headers = { apikey:key, authorization:"Bearer "+key, "content-type":"application/json" };
  const sourceResponse = await fetch(base + "/rest/v1/market_news_sources?on_conflict=source_id", {
    method:"POST",headers:{...headers,prefer:"resolution=merge-duplicates,return=minimal"},
    body:JSON.stringify(NEWS_SOURCES),signal:AbortSignal.timeout(12000)
  });
  if (!sourceResponse.ok) throw Error("Supabase news source registry HTTP " + sourceResponse.status + ": " + (await sourceResponse.text()).slice(0,180));
  const stateResponse = await fetch(base + "/rest/v1/market_news_sync_state?select=last_fetched_at&id=eq.1&limit=1", {
    headers, signal:AbortSignal.timeout(12000)
  });
  if (!stateResponse.ok) throw Error("Supabase news state HTTP " + stateResponse.status);
  const stateRows = await stateResponse.json();
  const lastFetched = Date.parse(stateRows?.[0]?.last_fetched_at || "");
  if (Number.isFinite(lastFetched) && Date.now()-lastFetched < 15*60*1000) {
    return { enabled:true, refreshed:false, items:await readNewsFromSupabase(env) };
  }

  const items = await collectNews({maxAgeHours:30*24,limit:100});
  const fetchedAt = new Date().toISOString();
  if (items.length) {
    const rows = items.map(item => ({
      url:item.url, title:item.title, domain:item.domain || "unknown",
      published_at:item.published_at, fetched_at:fetchedAt,
      source_id:item.source_id || null, language_code:item.language_code || null,
      original_title:item.original_title || item.title,
      original_text:String(item.original_text || "").slice(0,3000) || null,
      article_status:item.original_text ? "extracted" : "headline_only"
    }));
    const response = await fetch(base + "/rest/v1/market_news_items?on_conflict=url", {
      method:"POST",
      headers:{ ...headers, prefer:"resolution=merge-duplicates,return=minimal" },
      body:JSON.stringify(rows), signal:AbortSignal.timeout(15000)
    });
    if (!response.ok) throw Error("Supabase news insert HTTP " + response.status + ": " + (await response.text()).slice(0,180));
  }
  const stateUpdate = await fetch(base + "/rest/v1/market_news_sync_state?on_conflict=id", {
    method:"POST", headers:{ ...headers, prefer:"resolution=merge-duplicates,return=minimal" },
    body:JSON.stringify({id:1,last_fetched_at:fetchedAt}), signal:AbortSignal.timeout(12000)
  });
  if (!stateUpdate.ok) throw Error("Supabase news state update HTTP " + stateUpdate.status);
  return { enabled:true, refreshed:true, items:await readNewsFromSupabase(env), archived_items:items.length };
}

export async function refreshBackground(env) {
  const market = await getMarketSnapshot(env);
  const persistence = await persistQuotesToSupabase(env, market);
  if (persistence.enabled) console.log("Supabase market quote sync completed:", persistence.saved);

  let backgroundNews = null;
  try {
    const sync = await syncNewsToSupabase(env);
    if (sync.enabled) {
      backgroundNews = sync.items;
      console.log("Supabase market news sync:", sync.refreshed ? "refreshed" : "within 15-minute cache", sync.items.length);
    }
  } catch (error) {
    console.error("Background news sync failed:",error?.message || error);
  }

  if (env.MARKET_CACHE) {
    await env.MARKET_CACHE.put("market:latest",JSON.stringify({
      fetched_at:new Date().toISOString(),payload:market
    }),{expirationTtl:3600});
    const cachedNews = await readFreshCache(env,"news:latest",15*60*1000);
    if (!cachedNews) {
      const items = backgroundNews || await collectNews();
      await env.MARKET_CACHE.put("news:latest",JSON.stringify({
        fetched_at:new Date().toISOString(),items
      }),{expirationTtl:3600});
    }
  } else {
    console.log("MARKET_CACHE KV is not configured; Supabase is used for persistent quotes and RSS headlines.");
  }
  return market;
}

export default {
  async scheduled(controller, env, ctx) {
    ctx.waitUntil(refreshBackground(env).then(market => runForecastCycle(env,market)).catch(error => console.error("Scheduled market/forecast cycle failed:",error?.message || error)));
  },
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null,{status:204,headers:H});
    if (url.pathname === "/language/conversation") {
      if (request.method !== "POST") return reply({error:"Method not allowed"},405);
      const declaredLength = Number(request.headers.get("content-length") || 0);
      if (declaredLength > 20000) return reply({error:"Request body too large"},413);
      let payload;
      try { payload = await request.json(); }
      catch { return reply({error:"Invalid JSON body"},400); }
      const turns = payload?.turns;
      if (!Array.isArray(turns) || turns.length === 0 || turns.length > 100) {
        return reply({error:"turns must be a non-empty array with at most 100 entries"},400);
      }
      const totalChars = turns.reduce((sum,turn)=>sum+String(turn?.content ?? turn?.text ?? "").length,0);
      if (totalChars > 20000) return reply({error:"Conversation text exceeds the 20,000 character limit"},413);
      const result = analyzeConversationContext(turns,payload?.language);
      return reply({ok:true,engine:"dollar-conversation-context",version:CONVERSATION_CONTEXT_VERSION,result},200,{"cache-control":"no-store"});
    }
    if (request.method !== "GET") return reply({error:"Method not allowed"},405);
    if (url.pathname === "/forecast/v2") {
      const asset = url.searchParams.get("asset") || "USD_IRR_FREE";
      if (!Object.hasOwn(ASSETS,asset)) return reply({error:"Unsupported asset"},400);
      const response = await handleForecastApi(url,env);
      let data = {};
      try { data = await response.json(); } catch {}
      const cachedNews = await readFreshCache(env,"news:latest",45*60*1000);
      const storedNews = cachedNews?.items ? [] : await readNewsFromSupabase(env).catch(() => []);
      const news = cachedNews?.items || storedNews;
      try {
        const analysisResponse = await makeFreeAnalysis(env, asset);
        if (analysisResponse.ok) {
          const analysisBody = await analysisResponse.json();
          data.decision_brief = analysisBody.decision_brief || null;
          data.decision_brief_source = "same_asset_quote_and_history_analysis";
        }
      } catch (error) {
        data.decision_brief = null;
        data.decision_brief_error = String(error?.message || error).slice(0,120);
      }
      const newsVerification=verifyNewsItems(news);
      data.news_verification_summary={engine:newsVerification.engine,version:newsVerification.version,checkable_count:newsVerification.checkable_count,conflict_count:newsVerification.conflicts.length,verdict_counts:newsVerification.verdict_counts};
      data.news_context = {
        collected_at: cachedNews?.fetched_at || new Date().toISOString(),
        window_hours: 72,
        headline_count: news.length,
        recent_24h_count: news.filter(x => Date.now()-Date.parse(x.published_at) <= 24*60*60*1000).length,
        topics: newsTopics(news),
        headlines: news.slice(0,12)
      };
      if (!response.ok && !data.forecast) {
        data.forecast = {status:"withheld",reason:data.error || "برای انتشار پیش‌بینی، دادهٔ کافی در دسترس نیست."};
      }
      return reply(data,200,{"cache-control":"no-store"});
    }
    if(url.pathname==="/news/verify"){
      const claim=String(url.searchParams.get("claim")||"").trim();
      if(!claim) return reply({error:"پارامتر claim الزامی است."},400);
      if(claim.length>500) return reply({error:"طول ادعا نباید بیشتر از ۵۰۰ نویسه باشد."},413);
      const query=buildGdeltQuery(claim);
      if(!query) return reply({error:"از متن ادعا عبارت قابل جست‌وجویی استخراج نشد."},400);
      try{
        const evidence=await searchGdelt(query,{timespan:"7d",limit:75});
        const result=compareClaimToSearchEvidence(claim,evidence);
        return reply({...result,search_provider:"GDELT DOC 2.0",search_query:query,search_window:"7d",retrieved_at:new Date().toISOString(),search_status:evidence.length?"completed":"no_results"},200,{"cache-control":"no-store"});
      }catch(error){
        return reply({claim,verdict:"search_unavailable",search_provider:"GDELT DOC 2.0",error:String(error?.message||error).slice(0,160),caution:"به‌دلیل در دسترس نبودن جست‌وجو هیچ نتیجه‌ای دربارهٔ درستی ادعا صادر نشد."},503,{"cache-control":"no-store"});
      }
    }
    if (url.pathname === "/news") {
      // Public GET requests are read-only. RSS ingestion runs only in the
      // scheduled refresh path, not on arbitrary visitor traffic.
      const stored = await readNewsFromSupabase(env).catch(() => []);
      const items = cleanNewsItems(stored);
      const verification=verifyNewsItems(items);
      const conflicts=verification.conflicts;
      return reply({
        ok:true,window_hours:72,headline_count:items.length,
        recent_24h_count:items.filter(x => Date.now()-Date.parse(x.published_at) <= 24*60*60*1000).length,
        source_count:new Set(items.map(x=>x.source_id||x.domain)).size,
        potential_conflicts:conflicts,
        potential_conflict_count:conflicts.length,
        verification,
        refreshed:false,
        refresh_mode:"scheduled_only",
        topics:newsTopics(items),items
      },200,{"cache-control":"no-store"});
    }
    if (url.pathname === "/forecast/history" || url.pathname === "/forecast/performance" || url.pathname === "/forecast/learning") return handleForecastApi(url,env);
    if (url.pathname === "/health") {
      const databaseConfigured = Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
      const tableChecks = databaseConfigured ? await Promise.all([
        ["market_quotes", "asset"],
        ["market_forecast_runs", "id"],
        ["market_news_items", "id"],
        ["market_news_sync_state", "id"],
        ["market_news_sources", "source_id"],
        ["market_learning_cycles", "id"],
        ["market_forecast_error_diagnostics", "id"]
      ].map(async ([table, column]) => {
        try {
          const base = String(env.SUPABASE_URL).replace(/\/+$/, "");
          const query = new URLSearchParams({ select: column, limit: "1" });
          const response = await fetch(base + "/rest/v1/" + table + "?" + query, {
            headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, authorization: "Bearer " + env.SUPABASE_SERVICE_ROLE_KEY, accept: "application/json" },
            signal: AbortSignal.timeout(6000)
          });
          return [table, response.ok];
        } catch { return [table, false]; }
      })) : [];
      const databaseTables = Object.fromEntries(tableChecks);
      const has = table => databaseTables[table] === true;
      const kvBindingPresent = Boolean(env.MARKET_CACHE);
      const schedulerEnabled = env.BACKGROUND_REFRESH_ENABLED === "true";
      const backgroundRefreshEnabled = kvBindingPresent || schedulerEnabled;
      const forecastLedgerReady = databaseConfigured && has("market_forecast_runs");
      const quotePersistenceReady = databaseConfigured && has("market_quotes");
      const newsStorageReady = databaseConfigured && has("market_news_items") && has("market_news_sync_state");
      const newsPipelineSchemaReady = newsStorageReady && has("market_news_sources");
      const learningStorageReady = databaseConfigured && has("market_learning_cycles");
      const errorDiagnosticsReady = databaseConfigured && has("market_forecast_error_diagnostics");
      return reply({
        ok: true,
        service: "dollar-market-intelligence",
        configured: databaseConfigured,
        llm_configured: false,
        model: null,
        language_model: {
          enabled: false,
          status: "not_deployed",
          provider: null,
          external_api: false,
          note_fa: "مدل زبانی مولد مستقلی مستقر نیست."
        },
        history_parser_self_test: runHistoryParserSelfTest(),
        decision_engine: {
          enabled: true,
          name: "Dollar Evidence Decision Engine",
          version: DECISION_ENGINE_VERSION,
          mode: "deterministic_evidence_synthesis_not_llm",
          probability_calibrated: false,
          uses_news_and_price_history: true,
          self_test: runDecisionEngineSelfTest()
        },
        language_engine: {
          enabled: true,
          name: "Dollar Domain NLP",
          version: LANGUAGE_ENGINE_VERSION,
          mode: "deterministic_domain_nlp_not_llm",
          languages: ["fa", "en"],
          news_input: "rss_excerpt_or_headline",
          history_analysis: true,
          pragmatics: {
            enabled: true,
            version: PRAGMATICS_VERSION,
            curated_phrase_count: PRAGMATICS_PHRASE_COUNT,
            capabilities: ["idioms","metaphors","irony_candidates","sarcasm_candidates","indirect_requests","taarof","politeness","rhetorical_questions","conversational_implicature","hedging","contextual_ambiguity"]
          }
        },
        free_mode: true,
        free_forecast_enabled: true,
        database_configured: databaseConfigured,
        database_schema_ready: databaseConfigured && forecastLedgerReady && quotePersistenceReady && newsStorageReady,
        database_tables: databaseTables,
        forecast_ledger_enabled: forecastLedgerReady,
        continuous_learning_ready: learningStorageReady,
        forecast_error_diagnostics_ready: errorDiagnosticsReady,
        news_storage_enabled: newsStorageReady,
        news_pipeline_schema_ready: newsPipelineSchemaReady,
        forecast_ledger_table: "market_forecast_runs",
        news_store_table: "market_news_items",
        kv_binding_present: kvBindingPresent,
        background_refresh_enabled: backgroundRefreshEnabled,
        background_refresh_provider: schedulerEnabled ? "supabase-cron" : kvBindingPresent ? "cloudflare-cron" : "none",
        background_refresh_prerequisites_ready: backgroundRefreshEnabled && quotePersistenceReady,
        background_news_refresh_enabled: backgroundRefreshEnabled && newsStorageReady,
        multi_source_quotes_enabled: true,
        quote_freshness_guard_hours: 24,
        news_conflict_screening_enabled: true,
        live_error_feedback_min_samples: 30,
        quote_persistence_enabled: quotePersistenceReady,
        web_search_enabled: true,
        news_verification_engine:{enabled:true,name:"Dollar Evidence-Aware News Verifier",version:"1.0.0",provider:"GDELT DOC 2.0",verdicts:["corroborated_by_independent_headlines","contradicted_by_independent_headlines","mixed_evidence","insufficient_independent_evidence","not_checkable_from_headline"],full_text_verification:false},
        capabilities: ["multi-asset-market-quotes","walk-forward-backtesting","adaptive-ensemble-forecast","forecast-ledger","automatic-forecast-evaluation","continuous-learning-audit","forecast-error-root-cause-diagnostics","forecast-drift-monitoring","forecast-performance-api","free-news-rss","gdelt-web-search","evidence-aware-news-verification","cross-source-contradiction-screening","topic-classification","domain-language-understanding","historical-context-extraction","news-to-price-event-linking","news-price-evidence-synthesis","decision-quality-gates","database-schema-diagnostics","no-external-language-model"]
      }, 200, { "cache-control": "no-store" });
    }
    if (url.pathname === "/catalog") return reply({
      currency_and_gold:{tracked_quote_assets:Object.keys(ASSETS).map(symbol=>({symbol,name_fa:ASSETS[symbol],quote_tracking:true,analysis_enabled:ANALYSIS_ASSETS.has(symbol)}))},
      housing:{status:"planned",frequency:"monthly_or_quarterly",required_dimensions:["province","city","property_type","transaction_or_listing","price_per_sqm","sample_count","source","observed_at"]},
      vehicles:{status:"planned",frequency:"monthly_or_weekly_when_reliable",required_dimensions:["province","city","make","model","model_year","condition","transaction_or_listing","price","sample_count","source","observed_at"]},
      note_fa:"قیمت مسکن و خودرو تا زمان تأمین دادهٔ معتبر و قابل‌مقایسه، به‌عنوان قیمت زنده منتشر نمی‌شود."
    },200,{"cache-control":"no-store"});
    if (url.pathname !== "/forecast" && url.pathname !== "/analysis") return reply({error:"Use /health, /catalog, /analysis?asset=USD_IRR_FREE or /forecast?asset=USD_IRR_FREE"},404);
    const asset = url.searchParams.get("asset") || "USD_IRR_FREE";
    if (!Object.hasOwn(ASSETS,asset)) return reply({error:"Unsupported asset"},400);
    try {
      if(url.pathname === "/analysis") return await makeFreeAnalysis(env,asset);
      const response=await handleForecastApi(new URL("https://dollar-api.internal/forecast?asset="+encodeURIComponent(asset)),env);
      let body={};try{body=await response.json();}catch{}
      return reply(body,response.status,{"cache-control":"no-store"});
    }
    catch (e) { return reply({error:"سرویس پیش‌بینی کامل نشد.",detail:String(e?.message || e).slice(0,220)},502); }
  }
};
