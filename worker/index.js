import { handleForecastApi, runForecastCycle, isMarketRelevantHeadline } from "./forecast-engine.js";
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
  "access-control-allow-methods": "GET, OPTIONS",
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
  const raw = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : Array.isArray(payload?.history) ? payload.history : [];
  return raw.map(r => ({
    date: dateMs(r.date ?? r.datetime ?? r.timestamp ?? r.time ?? r.date_gregorian ?? r.t),
    close: n(r.close ?? r.c ?? r.price ?? r.value ?? r.last ?? r.close_price)
  })).filter(r => Number.isFinite(r.date) && Number.isFinite(r.close) && r.close > 0).sort((a,b) => a.date-b.date);
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
function citations(resp) {
  const out = [];
  const add = (url, title, publishedAt, snippet) => {
    if (!url || !/^https?:\/\//i.test(url)) return;
    let parsed; try { parsed = new URL(url); } catch { return; }
    const existing = out.find(x => x.url === url);
    const date = publishedAt ? String(publishedAt) : null;
    if (existing) {
      if (!existing.published_at && date) existing.published_at = date;
      if (!existing.snippet && snippet) existing.snippet = String(snippet).slice(0,360);
      return;
    }
    out.push({title:title || parsed.hostname, url, domain:parsed.hostname.replace(/^www\./,""),
      published_at:date, snippet:snippet ? String(snippet).slice(0,360) : null});
  };
  for (const item of resp.output || []) {
    const ss = item.type === "web_search_call" ? (item.action?.sources || item.results || []) : [];
    for (const s of ss) add(s.url || s.uri, s.title, s.published_date || s.publishedAt || s.date || s.last_updated, s.snippet || s.description);
    for (const c of (item.content || [])) for (const a of (c.annotations || [])) {
      if (a.type === "url_citation") add(a.url, a.title, a.published_at || a.published_date, a.snippet);
    }
  }
  return out.slice(0,12);
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
  {source_id:"google-news-fa",name:"Google News · Persian search (temporarily unavailable)",country_code:"IR",language_code:"fa",site_url:"https://news.google.com",feed_url:googleNewsUrl("(اقتصاد ایران OR بازار ارز OR دلار OR طلا OR تورم OR بانک مرکزی OR نرخ بهره OR نفت) when:3d","fa"),active:false,trust_tier:"unrated"},
  {source_id:"google-news-en",name:"Google News · Iran economy (temporarily unavailable)",country_code:"US",language_code:"en",site_url:"https://news.google.com",feed_url:googleNewsUrl("(Iran economy OR Iranian rial OR Iran currency OR Iran sanctions OR Iran oil OR Iran gold) when:3d","en"),active:false,trust_tier:"unrated"},
  {source_id:"google-news-global",name:"Google News · Global markets (temporarily unavailable)",country_code:"US",language_code:"en",site_url:"https://news.google.com",feed_url:googleNewsUrl("(gold price OR oil price OR inflation OR central bank OR interest rates OR currency markets) when:3d","en"),active:false,trust_tier:"unrated"},
  {source_id:"irna-fa",name:"IRNA Persian",country_code:"IR",language_code:"fa",site_url:"https://www.irna.ir",feed_url:"https://www.irna.ir/rss",active:true,trust_tier:"unrated"},
  {source_id:"isna-fa",name:"ISNA",country_code:"IR",language_code:"fa",site_url:"https://www.isna.ir",feed_url:"https://www.isna.ir/rss",active:true,trust_tier:"unrated"},
  {source_id:"yjc-fa",name:"YJC News",country_code:"IR",language_code:"fa",site_url:"https://www.yjc.ir",feed_url:"https://www.yjc.ir/fa/rss/allnews",active:true,trust_tier:"unrated"},
  {source_id:"tabnak-fa",name:"Tabnak",country_code:"IR",language_code:"fa",site_url:"https://www.tabnak.ir",feed_url:"https://www.tabnak.ir/fa/rss/allnews",active:true,trust_tier:"unrated"},
  {source_id:"khabaronline-fa",name:"Khabaronline",country_code:"IR",language_code:"fa",site_url:"https://www.khabaronline.ir",feed_url:"https://www.khabaronline.ir/rss",active:true,trust_tier:"unrated"},
  {source_id:"asriran-fa",name:"Asr Iran",country_code:"IR",language_code:"fa",site_url:"https://www.asriran.com",feed_url:"https://www.asriran.com/fa/rss/allnews",active:true,trust_tier:"unrated"},
  {source_id:"tasnim-fa",name:"Tasnim Persian",country_code:"IR",language_code:"fa",site_url:"https://www.tasnimnews.com",feed_url:"https://www.tasnimnews.com/fa/rss/feed/0/8/0/%D9%85%D9%87%D9%85%D8%AA%D8%B1%DB%8C%D9%86-%D8%A7%D8%AE%D8%A8%D8%A7%D8%B1-%D8%AA%D8%B3%D9%86%DB%8C%D9%85",active:true,trust_tier:"unrated"},
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
async function readNewsFeed(feed) {
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
    const publishedText=rssTag(block,"pubDate") || rssTag(block,"published") || rssTag(block,"updated") || rssTag(block,"dc:date") || rssTag(block,"date");
    const published=Date.parse(publishedText);
    if (!title || !/^https?:\/\//i.test(link) || !Number.isFinite(published)) { invalid++; continue; }
    if (published>Date.now()+5*60*1000 || Date.now()-published>72*60*60*1000) { outsideWindow++; continue; }
    if (!isMarketNews(title)) { irrelevant++; continue; }
    const sourceMatch=block.match(/<source\b([^>]*)>([\s\S]*?)<\/source>/i);
    const sourceUrl=sourceMatch?.[1]?.match(/\burl=["']([^"']+)["']/i)?.[1];
    let domain="";
    try { domain=new URL(sourceUrl || link).hostname.replace(/^www\./,""); } catch {}
    items.push({
      title,url:link,domain,published_at:new Date(published).toISOString(),
      source_id:feed.source_id,language_code:feed.language_code,original_title:title
    });
  }
  console.log("News feed parsed:",feed.source_id,"http",response.status,"raw",blocks.length,"accepted",items.length,"invalid",invalid,"outside_72h",outsideWindow,"irrelevant",irrelevant);
  return items;
}
async function collectNews() {
  const results=await Promise.allSettled(NEWS_FEEDS.map(readNewsFeed));
  const seenUrls=new Set(),seenTitles=new Set(),items=[];
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
      if(!urlKey || seenUrls.has(urlKey) || !titleKey || seenTitles.has(titleKey)) continue;
      seenUrls.add(urlKey);seenTitles.add(titleKey);items.push(item);
    }
  });
  const sorted=items.sort((a,b)=>Date.parse(b.published_at)-Date.parse(a.published_at)).slice(0,50);
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
    getJson((env.HISTORY_BASE_URL || HISTORY_URL) + encodeURIComponent(asset) + ".json"),
    readFreshCache(env,"news:latest",45*60*1000)
  ]);
  const market = cachedMarket?.payload || await getJson(env.MARKET_DATA_URL || MARKET_URL);
  const storedNews = cachedNews?.items ? [] : await readNewsFromSupabase(env).catch(() => []);
  const news = cachedNews?.items || (storedNews.length ? storedNews : await collectNews().catch(() => []));
  const item = (market.data || []).find(x => x.symbol === asset);
  if (!item || item.stale === true || market.meta?.stale === true) return reply({error:"منبع قیمت تازه نیست؛ تحلیل جدید ساخته نشد."},424);
  const price = n(item.price), stamp = dateMs(item.timestamp || market.meta?.published_at);
  if (!(price > 0) || !Number.isFinite(stamp) || Date.now()-stamp > 72*60*60*1000 || stamp>Date.now()+5*60*1000)
    return reply({error:"آخرین نرخ ثبت‌شده بیش از ۷۲ ساعت قدیمی است؛ تحلیل جدید ساخته نشد."},424);
  const rows = historyRows(rawHistory);
  if (rows.length < 12) return reply({error:"تاریخچه کافی برای تحلیل در دسترس نیست."},424);
  const model = stats(rows);
  const expected = Math.max(-15,Math.min(15,(model.baseline7/price-1)*100));
  const target = price*(1+expected/100);
  const uncertainty = Math.max(2.5,Math.min(18,model.sigma*Math.sqrt(7)*100*1.5));
  const recent = news.filter(x=>Date.now()-Date.parse(x.published_at)<=24*60*60*1000);
  const topics = newsTopics(news);
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
  risks.push("تیتر خبرها به‌تنهایی جهت اثر بر قیمت را مشخص نمی‌کند؛ اثر واقعی به متن کامل، زمان‌بندی و واکنش بازار بستگی دارد.");
  return reply({
    mode:"free-algorithmic",asset,asset_fa:ASSETS[asset],generated_at:new Date().toISOString(),
    quote:{price,source_time:new Date(stamp).toISOString(),source:"Iran Market Data / " + String(item.source || "unknown").toUpperCase()},
    forecast:{horizon_days:7,direction,headline_fa:directionFa,summary_fa:summary,
      expected_change_pct:Number(expected.toFixed(2)),target_price:Math.round(target),
      range_low:Math.round(target*(1-uncertainty/100)),range_high:Math.round(target*(1+uncertainty/100)),
      confidence:null,uncertainty_pct:Number(uncertainty.toFixed(2))},
    drivers:topics,risks_fa:risks,sources:news,
    news_sources_count:news.length,recent_sources_count:recent.length,news_window_hours:72,
    coverage_score:Math.min(100,recent.length*12),
    baseline:{daily_trend_pct:Number(model.daily_pct.toFixed(3)),
      momentum_7d_pct:model.momentum_7d_pct===null?null:Number(model.momentum_7d_pct.toFixed(3)),
      momentum_14d_pct:model.momentum_14d_pct===null?null:Number(model.momentum_14d_pct.toFixed(3)),
      momentum_30d_pct:model.momentum_30d_pct===null?null:Number(model.momentum_30d_pct.toFixed(3)),
      daily_volatility_pct:Number(model.daily_volatility_pct.toFixed(3)),
      max_drawdown_30d_pct:Number(model.max_drawdown_30d_pct.toFixed(3)),
      regression_target:Math.round(model.baseline7),observations:model.count},
    note_fa:"تحلیل الگوریتمی رایگان بر پایهٔ تاریخچه و تیتر خبرهاست؛ مدل زبانی یا توصیهٔ خریدوفروش نیست."
  },200,{"cache-control":"public, max-age=300","vary":"Origin"});
}

async function makeForecast(env, asset) {
  if (!ANALYSIS_ASSETS.has(asset)) return reply({error:"تاریخچهٔ معتبر این دارایی هنوز بررسی نشده است."},424);
  if (!env.OPENAI_API_KEY) return reply({error:"OPENAI_API_KEY secret is not configured."},503);
  const [market, rawHistory] = await Promise.all([
    getJson(env.MARKET_DATA_URL || MARKET_URL),
    getJson((env.HISTORY_BASE_URL || HISTORY_URL) + encodeURIComponent(asset) + ".json")
  ]);
  const item = (market.data || []).find(x => x.symbol === asset);
  if (!item || item.stale === true || market.meta?.stale === true) return reply({error:"منبع قیمت تازه نیست؛ پیش‌بینی جدید ساخته نشد."},424);
  const price = n(item.price), stamp = dateMs(item.timestamp || market.meta?.published_at);
  if (!(price > 0) || !Number.isFinite(stamp) || Date.now()-stamp > 45*60*1000 || stamp>Date.now()+5*60*1000) {
    return reply({error:"برای پیش‌بینی، قیمت معتبر و تازه لازم است."},424);
  }
  const rows = historyRows(rawHistory);
  if (rows.length < 12) return reply({error:"تاریخچه کافی برای پیش‌بینی در دسترس نیست."},424);
  const model = stats(rows);
  const recent = rows.slice(-30).map(x=>({date:new Date(x.date).toISOString().slice(0,10),close:x.close}));
  const prompt = [
    "تو تحلیلگر تخصصی بازار ارز و طلای ایران هستی؛ فقط پیش‌بینی احتمالی ۷ روز آینده ارائه می‌کنی.",
    "با ابزار جست‌وجوی زنده وب، ابتدا خبرهای منتشرشده در ۷۲ ساعت اخیر را بررسی کن و فقط در صورت نیاز برای زمینه به گزارش‌های قدیمی‌تر رجوع کن. رسانه‌های نوشتاری معتبر، منابع رسمی، اطلاعیه‌های بانک مرکزی، داده‌های تورم، نفت، تحریم‌ها، مذاکرات، سیاست داخلی و ریسک‌های منطقه‌ای را جست‌وجو کن. تا جای ممکن ۵ تا ۸ نتیجهٔ مرتبط از چند ناشر مستقل بررسی کن؛ خبر تکراری را چند شاهد حساب نکن. تاریخ انتشار را از تاریخ به‌روزرسانی جدا کن و اگر تاریخ روشن نیست، آن را تازه معرفی نکن. برای هر عامل مهم، شاهد و لینک واقعی منبع لازم است؛ شایعه را واقعیت تلقی نکن و اگر منبع قابل اتکا پیدا نشد، صریحاً بگو.",
    "خروجی فارسی و JSON مطابق schema باشد. expected_change_pct برآورد مستقل تو از درصد تغییر طی ۷ روز از قیمت فعلی است؛ آن را صرفاً برای تأیید فرض افزایش قیمت به سمت بالا منحرف نکن. به نرخ ارز ایران، تورم و ریسک‌های سیاسی توجه کن اما خبر منفی/مثبت را با شواهد بسنج. روند آماری فقط یک مبناست و سرور بعداً آن را با برآورد خبری ترکیب می‌کند. اگر خبرها متناقض یا کم‌کیفیت‌اند، تغییر را محتاطانه و confidence را پایین‌تر بگذار. confidence امتیاز اطمینان تحلیلی است، نه احتمال آماری کالیبره‌شده. از توصیه خریدوفروش پرهیز کن.",
    "دارایی: " + ASSETS[asset],
    "قیمت فعلی منبع: " + price,
    "زمان منبع: " + new Date(stamp).toISOString(),
    "تعداد نقاط تاریخچه: " + rows.length,
    "هدف مبنای رگرسیون ۷روزه: " + model.baseline7,
    "روند روزانه مبنا درصد: " + model.daily_pct,
    "بازده ۷ روز گذشته درصد: " + model.momentum_7d_pct,
    "بازده ۱۴ روز گذشته درصد: " + model.momentum_14d_pct,
    "بازده ۳۰ روز گذشته درصد: " + model.momentum_30d_pct,
    "نوسان روزانه بازده درصد: " + model.daily_volatility_pct,
    "بیشترین افت از سقف ۳۰ روزه درصد: " + model.max_drawdown_30d_pct,
    "نوسان باقیمانده لگاریتمی: " + model.sigma,
    "آخرین نقاط تاریخی: " + JSON.stringify(recent)
  ].join("\n");
  const schema = {
    type:"json_schema", name:"market_forecast", strict:true,
    schema:{type:"object",additionalProperties:false,properties:{
      headline_fa:{type:"string"},summary_fa:{type:"string"},expected_change_pct:{type:"number"},confidence:{type:"integer"},
      drivers:{type:"array",items:{type:"object",additionalProperties:false,properties:{
        title_fa:{type:"string"},impact:{type:"string",enum:["positive","negative","mixed","unknown"]},
        explanation_fa:{type:"string"},evidence:{type:"string"}
      },required:["title_fa","impact","explanation_fa","evidence"]}},
      risks_fa:{type:"array",items:{type:"string"}}
    },required:["headline_fa","summary_fa","expected_change_pct","confidence","drivers","risks_fa"]}
  };
  const api = await fetch("https://api.openai.com/v1/responses", {
    method:"POST",
    headers:{authorization:"Bearer "+env.OPENAI_API_KEY,"content-type":"application/json"},
    body:JSON.stringify({model:env.OPENAI_MODEL || "gpt-5.5",tools:[{type:"web_search"}],tool_choice:"required",include:["web_search_call.action.sources"],text:{format:schema},input:prompt,store:false}),
    signal:AbortSignal.timeout(90000)
  });
  if (!api.ok) return reply({error:"AI provider request failed.",detail:(await api.text()).slice(0,400)},502);
  const resp = await api.json();
  const text = resp.output_text || (resp.output || []).flatMap(x=>x.content || []).find(x=>x.type==="output_text")?.text;
  let ai;
  try { ai = JSON.parse(text); } catch { return reply({error:"ساختار پاسخ هوش مصنوعی قابل‌خواندن نبود."},502); }
  const aiChange = Math.max(-25,Math.min(25,n(ai.expected_change_pct)));
  const baselineChange = Math.max(-12,Math.min(12,model.daily_pct*7));
  const change = Math.max(-25,Math.min(25,aiChange*0.65+baselineChange*0.35));
  const target = price*(1+change/100);
  const rawConfidence = Math.max(0,Math.min(100,Math.round(n(ai.confidence))));
  const sources = citations(resp);
  const recentSources = sources.filter(s => {
    const published = s.published_at ? Date.parse(s.published_at) : NaN;
    return Number.isFinite(published) && published <= Date.now()+5*60*1000 && Date.now()-published <= 72*60*60*1000;
  });
  const conf = sources.length >= 4 && recentSources.length >= 2
    ? rawConfidence
    : Math.min(rawConfidence, sources.length >= 2 ? 50 : 30);
  const empiricalDailyVol = Math.max(model.sigma, model.daily_volatility_pct / 100);
  const uncertainty = Math.max(2.5,Math.min(20,(empiricalDailyVol*Math.sqrt(7)*100*1.45)+(100-conf)*0.04));
  return reply({
    asset,asset_fa:ASSETS[asset],generated_at:new Date().toISOString(),
    quote:{price,source_time:new Date(stamp).toISOString(),source:"Iran Market Data / " + String(item.source || "unknown").toUpperCase()},
    forecast:{horizon_days:7,direction:change>0.35?"up":change< -0.35?"down":"sideways",headline_fa:ai.headline_fa,summary_fa:ai.summary_fa,expected_change_pct:Number(change.toFixed(2)),target_price:Math.round(target),range_low:Math.round(target*(1-uncertainty/100)),range_high:Math.round(target*(1+uncertainty/100)),confidence:conf,uncertainty_pct:Number(uncertainty.toFixed(2))},
    drivers:ai.drivers,risks_fa:ai.risks_fa,
    baseline:{daily_trend_pct:Number(model.daily_pct.toFixed(3)),momentum_7d_pct:model.momentum_7d_pct===null?null:Number(model.momentum_7d_pct.toFixed(3)),momentum_14d_pct:model.momentum_14d_pct===null?null:Number(model.momentum_14d_pct.toFixed(3)),momentum_30d_pct:model.momentum_30d_pct===null?null:Number(model.momentum_30d_pct.toFixed(3)),daily_volatility_pct:Number(model.daily_volatility_pct.toFixed(3)),max_drawdown_30d_pct:Number(model.max_drawdown_30d_pct.toFixed(3)),regression_target:Math.round(model.baseline7),observations:model.count},
    sources,
    news_sources_count:sources.length,
    recent_sources_count:recentSources.length,
    news_window_hours:72,
    note_fa:"این یک برآورد احتمالی ۷روزه است، نه تضمین یا توصیه خریدوفروش."
  },200,{"cache-control":"private, max-age=300","vary":"Origin"});
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
    if (!Object.hasOwn(ASSETS, asset) || !(price > 0) || !Number.isFinite(stamp) ||
        stamp > Date.now() + 5 * 60 * 1000 || Date.now() - stamp > 72 * 60 * 60 * 1000) return [];
    return [{
      asset,
      price,
      source: "Iran Market Data / " + String(item.source || "unknown").toUpperCase(),
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
    select: "title,url,domain,published_at,source_id,language_code,original_title",
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

  const items = await collectNews();
  const fetchedAt = new Date().toISOString();
  if (items.length) {
    const rows = items.map(item => ({
      url:item.url, title:item.title, domain:item.domain || "unknown",
      published_at:item.published_at, fetched_at:fetchedAt,
      source_id:item.source_id || null, language_code:item.language_code || null,
      original_title:item.original_title || item.title, article_status:"headline_only"
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
  return { enabled:true, refreshed:true, items };
}

export async function refreshBackground(env) {
  const market = await getJson(env.MARKET_DATA_URL || MARKET_URL);
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
    if (request.method !== "GET") return reply({error:"Method not allowed"},405);
    if (url.pathname === "/forecast/v2") {
      const response = await handleForecastApi(url,env);
      let data = {};
      try { data = await response.json(); } catch {}
      const cachedNews = await readFreshCache(env,"news:latest",45*60*1000);
      const storedNews = cachedNews?.items ? [] : await readNewsFromSupabase(env).catch(() => []);
      const news = cachedNews?.items || (storedNews.length ? storedNews : await collectNews().catch(() => []));
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
    if (url.pathname === "/news") {
      const readOnly = url.searchParams.get("read_only") === "1";
      let sync = null;
      if (!readOnly) {
        try { sync = await syncNewsToSupabase(env); }
        catch (error) { console.error("On-demand news refresh failed:",error?.message || error); }
      }
      const stored = sync?.items?.length ? sync.items : await readNewsFromSupabase(env).catch(() => []);
      const items = cleanNewsItems(stored.length ? stored : await collectNews().catch(() => []));
      return reply({
        ok:true,window_hours:72,headline_count:items.length,
        recent_24h_count:items.filter(x => Date.now()-Date.parse(x.published_at) <= 24*60*60*1000).length,
        source_count:new Set(items.map(x=>x.source_id||x.domain)).size,
        refreshed:sync?.refreshed===true,
        topics:newsTopics(items),items
      },200,{"cache-control":"no-store"});
    }
    if (url.pathname === "/forecast/history" || url.pathname === "/forecast/performance") return handleForecastApi(url,env);
    if (url.pathname === "/health") {
      const databaseConfigured = Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
      const tableChecks = databaseConfigured ? await Promise.all([
        ["market_quotes", "asset"],
        ["market_forecast_runs", "id"],
        ["market_news_items", "id"],
        ["market_news_sync_state", "id"],
        ["market_news_sources", "source_id"]
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
      return reply({
        ok: true,
        service: "dollar-market-intelligence",
        configured: Boolean(env.OPENAI_API_KEY),
        llm_configured: Boolean(env.OPENAI_API_KEY),
        model: env.OPENAI_MODEL || null,
        free_mode: true,
        free_forecast_enabled: true,
        database_configured: databaseConfigured,
        database_schema_ready: databaseConfigured && forecastLedgerReady && quotePersistenceReady && newsStorageReady,
        database_tables: databaseTables,
        forecast_ledger_enabled: forecastLedgerReady,
        news_storage_enabled: newsStorageReady,
        news_pipeline_schema_ready: newsPipelineSchemaReady,
        forecast_ledger_table: "market_forecast_runs",
        news_store_table: "market_news_items",
        kv_binding_present: kvBindingPresent,
        background_refresh_enabled: backgroundRefreshEnabled,
        background_refresh_provider: schedulerEnabled ? "supabase-cron" : kvBindingPresent ? "cloudflare-cron" : "none",
        background_refresh_prerequisites_ready: backgroundRefreshEnabled && quotePersistenceReady,
        background_news_refresh_enabled: backgroundRefreshEnabled && newsStorageReady,
        quote_persistence_enabled: quotePersistenceReady,
        web_search_enabled: Boolean(env.OPENAI_API_KEY),
        capabilities: ["multi-asset-market-quotes","walk-forward-backtesting","adaptive-ensemble-forecast","forecast-ledger","automatic-forecast-evaluation","forecast-performance-api","free-news-rss","topic-classification","database-schema-diagnostics",...(env.OPENAI_API_KEY?["openai-web-search"]:[])]
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
    try { return url.pathname === "/analysis" ? await makeFreeAnalysis(env,asset) : await makeForecast(env,asset); }
    catch (e) { return reply({error:"سرویس پیش‌بینی کامل نشد.",detail:String(e?.message || e).slice(0,220)},502); }
  }
};
