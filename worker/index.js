import { handleForecastApi, runForecastCycle, isMarketRelevantHeadline, getMarketSnapshot, headlineConflictCandidates, runUnifiedNewsPipelineSelfTest } from "./forecast-engine.js";
import { analyzeMarketLanguage, VERSION as LANGUAGE_ENGINE_VERSION } from "./language-engine.js";
import { analyzeNewsReading, NEWS_READING_VERSION, runNewsReadingBenchmark } from "./news-reading-engine.js";
import { runMultilingualBenchmark, MULTILINGUAL_VERSION } from "./multilingual-engine.js";
import { PRAGMATICS_VERSION, PRAGMATICS_PHRASE_COUNT } from "./pragmatics-engine.js";
import { analyzeConversationContext, CONVERSATION_CONTEXT_VERSION } from "./conversation-context-engine.js";
import { buildDecisionBrief, DECISION_ENGINE_VERSION, runDecisionEngineSelfTest } from "./decision-engine.js";
import { NEWS_SOURCES as CURATED_NEWS_SOURCES } from "./news-sources.js";
import { GLOBAL_TEST_COUNTRIES } from "./global-country-test.js";
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
const NEWS_SOURCES = CURATED_NEWS_SOURCES;
const NEWS_FEEDS = NEWS_SOURCES.filter(source => source.active)
  .map(({source_id,language_code,feed_url}) => ({source_id,language_code,url:feed_url}));
function isMarketNews(title) { return isMarketRelevantHeadline(title); }
function rssTag(block, tag) {
  const safe = tag.replace(/[.*+?^$()|[\]\\]/g,"\\$&");
  const match = block.match(new RegExp("<" + safe + "(?:\\s[^>]*)?>([\\s\\S]*?)</" + safe + ">", "i"));
  return match ? xmlText(match[1]) : "";
}
function decodeArticleEntities(value) {
  return String(value||"")
    .replace(/&nbsp;|&#160;/gi," ")
    .replace(/&amp;/gi,"&").replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'")
    .replace(/&lt;/gi,"<").replace(/&gt;/gi,">")
    .replace(/&#(\d+);/g,(_,n)=>{try{return String.fromCodePoint(Number(n));}catch{return " ";}})
    .replace(/&#x([0-9a-f]+);/gi,(_,n)=>{try{return String.fromCodePoint(parseInt(n,16));}catch{return " ";}});
}
function selectArticleParagraphs(groups) {
  const clean=(value)=>decodeArticleEntities(value).replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
  const isSentence=(value)=>/[.!?؟…][”"')\]]?$/.test(value) || /[.!?؟]/.test(value);
  const preferred=(groups.preferred||[]).map(clean).filter(x=>x.length>=55&&isSentence(x));
  if(preferred.length) return [...new Set(preferred)].join(String.fromCharCode(10)).slice(0,16000);
  const article=(groups.article||[]).map(clean).filter(x=>x.length>=140&&isSentence(x));
  if(article.length) return [...new Set(article)].join(String.fromCharCode(10)).slice(0,16000);
  const main=(groups.main||[]).map(clean).filter(x=>x.length>=180&&isSentence(x));
  return [...new Set(main)].join(String.fromCharCode(10)).slice(0,16000);
}
function parseArticleParagraphGroups(html) {
  const groups={preferred:[],article:[],main:[]};
  const tokens=String(html||"").match(/<!--[\s\S]*?-->|<\/?[^>]+>|[^<]+/g)||[];
  const stack=[];
  let current=null;
  const voidTags=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);
  const finish=()=>{
    if(!current) return;
    const value=decodeArticleEntities(current.text).replace(/\s+/g," ").trim();
    if(value.length>=35){
      if(current.preferred) groups.preferred.push(value);
      if(current.article) groups.article.push(value);
      if(current.main) groups.main.push(value);
    }
    current=null;
  };
  for(const token of tokens){
    if(token.startsWith("<!--")||token.startsWith("<!")) continue;
    if(token.startsWith("</")){
      const tag=token.match(/^<\/\s*([a-z0-9:-]+)/i)?.[1]?.toLowerCase();
      if(tag==="p") finish();
      if(tag){
        for(let i=stack.length-1;i>=0;i--){
          if(stack[i].tag===tag){stack.length=i;break;}
        }
      }
      continue;
    }
    if(token.startsWith("<")){
      const tag=token.match(/^<\s*([a-z0-9:-]+)/i)?.[1]?.toLowerCase();
      if(!tag) continue;
      const attrs=token.slice(tag.length+1);
      const classes=(attrs.match(/\bclass\s*=\s*["']([^"']*)["']/i)?.[1]||"").toLowerCase();
      const itemprop=(attrs.match(/\bitemprop\s*=\s*["']([^"']*)["']/i)?.[1]||"").toLowerCase();
      const parent=stack[stack.length-1]||{preferred:false,article:false,main:false};
      const preferred=parent.preferred||/entry-content|post-content|article-content|article-body|story-body|article__body|article-body__content/.test(classes)||itemprop==="articlebody";
      const article=parent.article||tag==="article";
      const main=parent.main||tag==="main";
      if(tag==="p") current={text:"",preferred,article,main};
      if(!voidTags.has(tag)&&!/\/\s*>$/.test(token)) stack.push({tag,preferred,article,main});
      continue;
    }
    if(current) current.text+=token;
  }
  finish();
  return groups;
}
async function fetchFullArticleText(url) {
  try {
    const response=await fetch(url,{
      headers:{accept:"text/html,application/xhtml+xml","user-agent":"Mozilla/5.0 (compatible; DollarNewsReader/1.0)"},
      signal:AbortSignal.timeout(6000)
    });
    if(!response.ok || !response.headers.get("content-type")?.includes("text/html")) return "";
    if (typeof HTMLRewriter !== "undefined") {
      const groups={preferred:[],article:[],main:[]};
      const handlerFor=(key)=>{
        let current="";
        return {
          element(element){
            current="";
            element.onEndTag(()=>{
              const paragraph=current.replace(/\s+/g," ").trim();
              if(paragraph.length>=35) groups[key].push(paragraph);
              current="";
            });
          },
          text(chunk){current+=chunk.text;}
        };
      };
      const transformed=new HTMLRewriter()
        .on("[itemprop='articleBody'] p, .entry-content p, .post-content p, .article-content p, .article-body p, .story-body p, .article__body p",handlerFor("preferred"))
        .on("article p",handlerFor("article"))
        .on("main p",handlerFor("main"))
        .transform(response);
      await transformed.text();
      return selectArticleParagraphs(groups);
    }
    const html=await response.text();
    const withoutNoise=html.replace(/<(script|style|noscript|svg)\b[^>]*>[\s\S]*?<\/\1>/gi," ");
    return selectArticleParagraphs(parseArticleParagraphGroups(withoutNoise));
  } catch(error) {
    console.warn("Full article extraction failed:",new URL(url).hostname,String(error?.message||error).slice(0,100));
    return "";
  }
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
  // Enrich the lead story from the publisher page, not just the RSS description.
  // The full text is used for analysis; the persistent record remains compact.
  if(items.length){
    const lead=items.sort((a,b)=>Date.parse(b.published_at)-Date.parse(a.published_at))[0];
    if((lead.original_text||"").length<1200){
      const fullText=await fetchFullArticleText(lead.url);
      if(fullText.length>=(lead.original_text||"").length+250){
        lead.original_text=fullText;
        lead.article_status=fullText.length>=1000?"full_article_extracted":"partial_article_extracted";
        lead.article_chars=fullText.length;
      } else {
        lead.article_status="rss_excerpt_only";
        lead.article_chars=(lead.original_text||"").length;
      }
    } else {
      lead.article_status="rss_content";
      lead.article_chars=lead.original_text.length;
    }
  }
  console.log("News feed parsed:",feed.source_id,"http",response.status,"raw",blocks.length,"accepted",items.length,"invalid",invalid,"outside_archive_window_hours",maxAgeHours,"outside_window",outsideWindow,"irrelevant",irrelevant);
  return items;
}
async function collectNews({ maxAgeHours = 72, limit = 50 } = {}) {
  // Rotate through four feed batches to keep 50-source collection within Worker limits.
  // Every feed is probed once per hour when the scheduled refresh runs at least every 15 minutes.
  const batchIndex=Math.floor(Date.now()/(15*60*1000))%4;
  const selectedFeeds=NEWS_FEEDS.filter((_,index)=>index%4===batchIndex);
  const results=await Promise.allSettled(selectedFeeds.map(feed => readNewsFeed(feed,maxAgeHours)));
  const seenUrls=new Set(),items=[];
  results.forEach((result,index)=>{
    const sourceId=selectedFeeds[index].source_id;
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
  const sorted=items.sort((a,b)=>Date.parse(b.published_at)-Date.parse(a.published_at)).slice(0,Math.max(1,Math.min(200,Number(limit)||50)));
  console.log("News collection completed:","feeds",results.filter(x=>x.status==="fulfilled").length,"failed",results.filter(x=>x.status==="rejected").length,"batch",batchIndex+1,"of",4,"unique",sorted.length);
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
  }).sort((a,b) => Date.parse(b.published_at)-Date.parse(a.published_at)).slice(0,100);
}


async function learningRest(env, path, options = {}) {
  const base = String(env.SUPABASE_URL || "").replace(/\/+$/, "");
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) throw Error("Learning storage is not configured");
  const response = await fetch(base + "/rest/v1/" + path, {
    method: options.method || "GET",
    headers: { apikey:key, authorization:"Bearer "+key, accept:"application/json", "content-type":"application/json", ...(options.headers || {}) },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: AbortSignal.timeout(10000)
  });
  const raw = await response.text();
  if (!response.ok) throw Error("Learning storage HTTP " + response.status + ": " + raw.slice(0,180));
  return raw ? JSON.parse(raw) : [];
}
async function verifyWorkerCronSecret(request) {
  const supplied=request.headers.get("x-cron-secret")||"";
  if(!supplied) return false;
  const response=await fetch("https://oolfbjxclhzlbwjmzxxx.supabase.co/functions/v1/market-api/news/global-test/verify",{
    method:"POST",headers:{"x-cron-secret":supplied,"content-type":"application/json"},
    body:"{}",signal:AbortSignal.timeout(8000)
  });
  return response.ok;
}
function safeJsonSize(value) { try { return new TextEncoder().encode(JSON.stringify(value)).length; } catch { return Infinity; } }
async function fingerprintLearningCase(title, excerpt, expected) {
  const raw = [title,excerpt,JSON.stringify(expected)].join("\n").normalize("NFKC").toLocaleLowerCase("en-US").replace(/\s+/g," ").trim();
  const digest = await crypto.subtle.digest("SHA-256",new TextEncoder().encode(raw));
  return [...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,"0")).join("");
}
function getPathValue(object, path) { return String(path||"").split(".").reduce((value,key)=>value == null ? undefined : value[key],object); }
function compareLearningAssertions(analysis, expected) {
  const assertions = Array.isArray(expected?.assertions) ? expected.assertions : [];
  const results = assertions.map(assertion => {
    const actual = getPathValue(analysis,assertion.path);
    return {path:assertion.path,expected:assertion.equals,actual,passed:JSON.stringify(actual)===JSON.stringify(assertion.equals)};
  });
  return {total:results.length,passed:results.filter(x=>x.passed).length,failed:results.filter(x=>!x.passed).length,results};
}

function buildRuleChangeCandidates(evaluated) {
  const groups = new Map();
  for (const item of evaluated) {
    for (const result of item.results || []) {
      if (result.passed) continue;
      const key = String(item.category || "other") + "::" + String(result.path || "unknown");
      if (!groups.has(key)) groups.set(key,{category:item.category || "other",path:result.path || "unknown",caseIds:new Set(),examples:[]});
      const group = groups.get(key);
      group.caseIds.add(item.feedback_id || item.id);
      if (group.examples.length < 3) group.examples.push({
        expected:result.expected,
        actual:result.actual
      });
    }
  }
  return [...groups.values()].map(group => ({
    category:group.category,
    output_path:group.path,
    independent_case_count:group.caseIds.size,
    status:group.caseIds.size >= 3 ? "recurring_candidate_needs_holdout_test" : "insufficient_recurrence",
    examples:group.examples,
    automatic_rule_change:false,
    required_next_step:group.caseIds.size >= 3
      ? "Draft a narrowly scoped rule, test on unseen holdout articles and the full regression suite, then require human approval."
      : "Collect more independently verified cases before proposing a rule."
  })).sort((a,b)=>b.independent_case_count-a.independent_case_count);
}
function evaluateNewsLearningCase(item) {
  const parts=String(item.input_text||"").split("\n");
  const title=parts[0]||"", body=parts.slice(1).join("\n");
  if(item.category==="topic_classification") {
    const actual=analyzeMarketLanguage([{title,original_title:title,original_text:body}]).per_news[0] || {};
    return {id:item.id,feedback_id:item.feedback_id,category:item.category,status:item.validation_status,...compareLearningAssertions(actual,item.expected_output)};
  }
  if(item.category==="contradiction") {
    // A single article cannot establish a cross-source contradiction.
    return {id:item.id,feedback_id:item.feedback_id,category:item.category,status:"not_evaluable_single_article",total:0,passed:0,failed:0,results:[],evaluation_note:"Requires at least two independently sourced article claims; never mark a single-article case as passed."};
  }
  const actual=analyzeNewsReading(title,body);
  return {id:item.id,feedback_id:item.feedback_id,category:item.category,status:item.validation_status,...compareLearningAssertions(actual,item.expected_output)};
}

function runNewsLearningEvaluationSelfTest() {
  const topic=evaluateNewsLearningCase({id:"synthetic-topic",feedback_id:"synthetic-topic",category:"topic_classification",
    input_text:"بازار ارز و نرخ دلار\nقیمت دلار آزاد در بازار ارز بررسی شد.",
    expected_output:{assertions:[{path:"themes",equals:["fx_policy"]}]},validation_status:"verified"});
  const contradiction=evaluateNewsLearningCase({id:"synthetic-conflict",feedback_id:"synthetic-conflict",category:"contradiction",
    input_text:"دو خبر متناقض\nخبر اول می‌گوید نرخ ثابت ماند.",expected_output:{assertions:[{path:"possible_conflicts",equals:[]}]},validation_status:"verified"});
  const results=[
    {name:"topic_feedback_uses_topic_classifier",passed:topic.total===1&&topic.passed===1},
    {name:"single_article_cannot_pass_cross_source_contradiction",passed:contradiction.total===0&&contradiction.status==="not_evaluable_single_article"},
    {name:"wrong_expected_topic_is_counted_as_failure",passed:evaluateNewsLearningCase({id:"synthetic-wrong-topic",feedback_id:"synthetic-wrong-topic",category:"topic_classification",input_text:"بازار ارز و نرخ دلار\\nقیمت دلار آزاد در بازار ارز بررسی شد.",expected_output:{assertions:[{path:"themes",equals:["gold"]}]},validation_status:"verified"}).failed===1},
    {name:"missing_assertions_is_not_a_pass",passed:evaluateNewsLearningCase({id:"synthetic-no-assertions",feedback_id:"synthetic-no-assertions",category:"topic_classification",input_text:"بازار ارز و نرخ دلار\\nقیمت دلار آزاد در بازار ارز بررسی شد.",expected_output:{themes:["fx_policy"]},validation_status:"verified"}).total===0}
  ];
  return {total:results.length,passed:results.filter(x=>x.passed).length,failed:results.filter(x=>!x.passed).length,results};
}

async function newsLearningReport(env) {
  const [feedback,cases,cycles] = await Promise.all([
    learningRest(env,"market_news_feedback?select=id,status,issue_categories,created_at,reviewed_at&order=created_at.desc&limit=200"),
    learningRest(env,"market_news_learning_cases?select=id,feedback_id,category,input_text,expected_output,validation_status,created_at&order=created_at.desc&limit=200"),
    learningRest(env,"market_news_learning_cycles?select=cycle_at,analyzer_version,feedback_seen,verified_cases,pending_cases,rejected_cases,benchmark_before,benchmark_after,actions,notes&order=cycle_at.desc&limit=20")
  ]);
  const benchmark=runNewsReadingBenchmark();
  const learningEvaluationBenchmark=runNewsLearningEvaluationSelfTest();
  const verifiedFeedbackIds=new Set(feedback.filter(x=>x.status==="verified").map(x=>x.id));
  const evaluated=cases.filter(item=>verifiedFeedbackIds.has(item.feedback_id)).map(evaluateNewsLearningCase);
  const checks=evaluated.flatMap(x=>x.results);
  return {
    ok:true,engine:"persistent-news-feedback-loop",
    mode:"human_verified_supervised_error_memory_with_regression_evaluation",
    versions:{language:LANGUAGE_ENGINE_VERSION,reading:NEWS_READING_VERSION},
    summary:{
      feedback_total:feedback.length,
      feedback_submitted:feedback.filter(x=>x.status==="submitted").length,
      feedback_verified:feedback.filter(x=>x.status==="verified").length,
      feedback_rejected:feedback.filter(x=>x.status==="rejected").length,
      learning_cases:cases.length,
      verified_cases:evaluated.length,
      evaluated_cases:evaluated.filter(x=>x.total>0).length,
      cases_passed:evaluated.filter(x=>x.total>0&&x.failed===0).length,
      cases_failed:evaluated.filter(x=>x.failed>0).length,
      cases_unscorable:evaluated.filter(x=>x.total===0).length,
      cases_pending_validation:cases.filter(x=>x.validation_status==="pending").length,
      cases_with_assertions:evaluated.filter(x=>x.total>0).length,
      real_case_assertions:checks.length,
      real_case_assertions_passed:checks.filter(x=>x.passed).length,
      real_case_assertions_failed:checks.filter(x=>!x.passed).length,
      benchmark:{version:benchmark.version,total:benchmark.total,passed:benchmark.passed,failed:benchmark.failed,score_pct:benchmark.score_pct},
      learning_evaluation_benchmark:learningEvaluationBenchmark
    },
    benchmark_failures:benchmark.failures,real_case_results:evaluated,
    rule_change_candidates:buildRuleChangeCandidates(evaluated),
    feedback:feedback.slice(0,30),cycles
  };
}


export async function runNewsLearningCycle(env) {
  try {
    const report=await newsLearningReport(env);
    const s=report.summary;
    const actions=[];
    if(s.feedback_submitted>0) actions.push({action:"human_review_required",count:s.feedback_submitted});
    if(s.real_case_assertions_failed>0) actions.push({action:"review_failed_cases_before_rule_change",failed_assertions:s.real_case_assertions_failed});
    if(s.cases_unscorable>0) actions.push({action:"add_explicit_test_assertions",unscorable_cases:s.cases_unscorable});
    const ruleCandidates=report.rule_change_candidates.filter(x=>x.status==="recurring_candidate_needs_holdout_test");
    if(ruleCandidates.length>0) actions.push({action:"candidate_requires_holdout_validation",count:ruleCandidates.length});
    if(s.verified_cases<30) actions.push({action:"collect_more_verified_real_cases",current:s.verified_cases,minimum_target:30});
    if(report.summary.benchmark.failed>0) actions.push({action:"regression_block",failures:report.summary.benchmark.failed});
    if(!actions.length) actions.push({action:"no_change_required",reason:"current checked cases pass; keep monitoring unseen news"});
    for(const item of report.real_case_results) {
      await learningRest(env,"market_news_learning_cases?id=eq."+encodeURIComponent(item.id),{
        method:"PATCH",headers:{"prefer":"return=minimal"},
        body:{validation_report:{total:item.total,passed:item.passed,failed:item.failed,results:item.results,evaluation_status:item.total===0?"unscorable":item.failed>0?"failed":"passed"},
          validation_status:item.total===0?"unscorable":item.failed>0?"needs_revision":"approved",validated_at:new Date().toISOString()}
      });
    }
    const saved=await learningRest(env,"market_news_learning_cycles",{
      method:"POST",headers:{"prefer":"return=representation"},
      body:{analyzer_version:NEWS_READING_VERSION,feedback_seen:s.feedback_total,verified_cases:s.verified_cases,
        pending_cases:s.cases_pending_validation,rejected_cases:s.feedback_rejected,
        benchmark_before:report.summary.benchmark,benchmark_after:report.summary.benchmark,
        actions,notes:"This cycle evaluates human-verified corrections against the current deterministic parser. It records learning evidence; it does not rewrite parser rules or train model weights automatically."}
    });
    return {ran:true,cycle_id:saved?.[0]?.id??null,summary:s,actions};
  } catch(error) {
    console.error("News learning cycle failed:",error?.message||error);
    return {ran:false,error:String(error?.message||error).slice(0,180)};
  }
}

async function readNewsFromSupabase(env) {
  const base = String(env.SUPABASE_URL || "").replace(/\/+$/, "");
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) return [];
  const params = new URLSearchParams({
    select: "title,url,domain,published_at,source_id,language_code,original_title,original_text,translated_text_fa,summary_fa,article_status",
    published_at: "gte." + new Date(Date.now()-72*60*60*1000).toISOString(),
    order: "published_at.desc",
    limit: "100"
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
  // Keep the database registry aligned with the exact 50 curated feeds.
  // Older legacy rows remain stored for history but are no longer polled.
  const curatedIds = NEWS_SOURCES.map(source => source.source_id);
  const staleSources = await fetch(
    base + "/rest/v1/market_news_sources?source_id=not.in.(" + curatedIds.map(encodeURIComponent).join(",") + ")",
    {method:"PATCH",headers:{...headers,prefer:"return=minimal"},body:JSON.stringify({active:false}),signal:AbortSignal.timeout(12000)}
  );
  if (!staleSources.ok) throw Error("Supabase stale news source deactivation HTTP " + staleSources.status);
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
      original_text:String(item.original_text || "").slice(0,15000) || null,
      article_status:item.article_status || (item.original_text ? "rss_excerpt_only" : "headline_only"),
      extraction_method:item.article_status?.includes("article_extracted") ? "publisher_html_article_paragraphs" : (item.original_text ? "rss_content" : "headline_only")
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

function normalizeGdeltLanguage(value) {
  const key=String(value||"").trim().toLowerCase();
  const map={english:"en",en:"en",french:"fr",fr:"fr",german:"de",de:"de",arabic:"ar",ar:"ar",chinese:"zh",zh:"zh",persian:"fa",farsi:"fa",fa:"fa"};
  return map[key]||null;
}
function parseGdeltDate(value) {
  const s=String(value||"");
  const m=s.length>=15 && s[8]==="T" ? [s,s.slice(0,4),s.slice(4,6),s.slice(6,8),s.slice(9,11),s.slice(11,13),s.slice(13,15)] : null;
  if(m) return new Date(Date.UTC(Number(m[1]),Number(m[2])-1,Number(m[3]),Number(m[4]),Number(m[5]),Number(m[6]))).toISOString();
  const parsed=Date.parse(s);
  return Number.isFinite(parsed)?new Date(parsed).toISOString():null;
}
const COUNTRY_LANGUAGE_HINTS = {
  AT:"de",DE:"de",CH:"de",
  FR:"fr",BE:"fr",CA:"fr",CI:"fr",SN:"fr",MA:"fr",TN:"fr",DZ:"fr",
  CN:"zh",TW:"zh",HK:"zh",
  SA:"ar",AE:"ar",EG:"ar",IQ:"ar",JO:"ar",KW:"ar",BH:"ar",OM:"ar",QA:"ar",LB:"ar",SY:"ar",YE:"ar",PS:"ar",SD:"ar",LY:"ar",
  IR:"fa"
};
const COUNTRY_TLD_OVERRIDES = {GB:"uk",US:"us",KR:"kr",GR:"gr",CZ:"cz",CD:"cd",CG:"cg",CI:"ci",MK:"mk",PS:"ps"};
const COUNTRY_QUERY_TERMS = {
  en:"economy OR business OR trade OR inflation OR technology OR health OR policy",
  fa:"اقتصاد OR تجارت OR تورم OR فناوری OR سلامت OR سیاست",
  ar:"اقتصاد OR تجارة OR تضخم OR تقنية OR صحة OR سياسة",
  zh:"经济 OR 商业 OR 贸易 OR 通胀 OR 科技 OR 健康 OR 政策",
  de:"Wirtschaft OR Handel OR Inflation OR Technologie OR Gesundheit OR Politik",
  fr:"économie OR commerce OR inflation OR technologie OR santé OR politique"
};
function countryNewsLocale(country) {
  const language=COUNTRY_LANGUAGE_HINTS[country.code]||"en";
  const tld=COUNTRY_TLD_OVERRIDES[country.code]||String(country.code).toLowerCase();
  const hl={en:"en-US",fa:"fa",ar:"ar",zh:"zh-CN",de:"de",fr:"fr"}[language];
  const ceidLanguage={en:"en",fa:"fa",ar:"ar",zh:"zh-Hans",de:"de",fr:"fr"}[language];
  return {language,tld,hl,gl:country.code,ceid:country.code+":"+ceidLanguage};
}
function countryPublisherMatches(domain,tld,countryCode) {
  const host=String(domain||"").toLowerCase().replace(/^www\./,"");
  if(host===tld||host.endsWith("."+tld)) return true;
  return countryCode==="US" && (host.endsWith(".gov")||host.endsWith(".mil"));
}
async function fetchGoogleNewsCountryArticle(country) {
  const locale=countryNewsLocale(country);
  const query="site:."+locale.tld+" ("+COUNTRY_QUERY_TERMS[locale.language]+") when:30d";
  const params=new URLSearchParams({q:query,hl:locale.hl,gl:locale.gl,ceid:locale.ceid});
  const feedUrl="https://news.google.com/rss/search?"+params.toString();
  const response=await fetch(feedUrl,{
    headers:{accept:"application/rss+xml,application/xml,text/xml","user-agent":"Mozilla/5.0 (compatible; DollarNewsReader/1.0)"},
    signal:AbortSignal.timeout(10000)
  });
  if(!response.ok) throw Error("Google News RSS HTTP "+response.status);
  const xml=await response.text();
  const blocks=[...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map(match=>match[0]);
  for(const block of blocks.slice(0,8)){
    const title=rssTag(block,"title");
    const url=rssLink(block,feedUrl);
    const sourceMatch=block.match(/<source\b([^>]*)>([\s\S]*?)<\/source>/i);
    const sourceUrl=sourceMatch?.[1]?.match(/\burl=["']([^"']+)["']/i)?.[1]||"";
    let domain="";
    try{domain=new URL(xmlText(sourceUrl)).hostname.replace(/^www\./,"");}catch{}
    if(!title||!url||!countryPublisherMatches(domain,locale.tld,country.code)) continue;
    const fullText=await fetchFullArticleText(url);
    if(fullText.length<1000) continue;
    const publishedAt=parseGdeltDate(rssTag(block,"pubDate"));
    const analyzed=analyzeMarketLanguage([{
      title,original_title:title,original_text:fullText,full_text_mode:true,
      language_code:locale.language,url,published_at:publishedAt,domain
    }]).per_news?.[0]||null;
    return {
      country_code:country.code,country_name:country.name,gdelt_country:country.gdelt,
      language_code:locale.language,publisher_domain:domain.slice(0,200),
      article_url:url,title:title.slice(0,500),published_at:publishedAt,
      article_text:fullText.slice(0,15000),article_chars:fullText.length,
      extraction_status:"full_article_extracted",collection_provider:"google_news_rss",
      source_country_verified:true,model_version:LANGUAGE_ENGINE_VERSION,
      model_output:analyzed,evaluation_status:"pending_review",evaluation_notes:null,
      collected_at:new Date().toISOString(),updated_at:new Date().toISOString()
    };
  }
  return null;
}
async function fetchCountryNewsArticle(country, proxySecret=null) {
  if(proxySecret) {
    try {
      const proxyUrl="https://dollar-market-intelligence.kabiri1489.workers.dev/news/global-test/fetch?country="+encodeURIComponent(country.code);
      const proxyResponse=await fetch(proxyUrl,{
        method:"POST",headers:{"x-cron-secret":proxySecret,"content-type":"application/json"},
        body:"{}",signal:AbortSignal.timeout(45000)
      });
      if(proxyResponse.ok) {
        const proxied=await proxyResponse.json();
        if(proxied?.country_code===country.code && proxied?.extraction_status) return proxied;
      }
      console.warn("Cloudflare country article proxy returned:",country.code,proxyResponse.status);
    } catch(error) {
      console.warn("Cloudflare country article proxy failed:",country.code,String(error?.message||error).slice(0,140));
    }
  }
  // Prefer Google News RSS first: GDELT enforces a strict request rate limit.
  // The publisher domain is checked against the country's local news domain before accepting an article.
  try {
    const googleResult=await fetchGoogleNewsCountryArticle(country);
    if(googleResult) return googleResult;
  } catch(error) {
    console.warn("Google News country lookup failed:",country.code,String(error?.message||error).slice(0,120));
  }
  const query="(economy OR business OR trade OR inflation OR technology OR education OR health OR climate OR policy) sourcecountry:"+country.gdelt;
  const api=new URL("https://api.gdeltproject.org/api/v2/doc/doc");
  api.searchParams.set("query",query);
  api.searchParams.set("mode","ArtList");
  api.searchParams.set("format","json");
  api.searchParams.set("maxrecords","5");
  api.searchParams.set("timespan","30d");
  api.searchParams.set("sort","DateDesc");
  const response=await fetch(api.toString(),{headers:{accept:"application/json"},signal:AbortSignal.timeout(15000)});
  if(!response.ok){const detail=(await response.text()).slice(0,180);throw Error("Google News had no full local article; GDELT HTTP "+response.status+": "+detail);}
  const payload=await response.json();
  const articles=Array.isArray(payload?.articles)?payload.articles:[];
  for(const article of articles.slice(0,2)){
    const language=normalizeGdeltLanguage(article.language);
    const url=String(article.url||"");
    if(!language || !(url.startsWith("https://") || url.startsWith("http://")) || !article.title) continue;
    const fullText=await fetchFullArticleText(url);
    if(fullText.length<1000) continue;
    const title=String(article.title).slice(0,500);
    const analyzed=analyzeMarketLanguage([{
      title,original_title:title,original_text:fullText,full_text_mode:true,language_code:language,
      url,published_at:parseGdeltDate(article.seendate),domain:article.domain||""
    }]).per_news?.[0] || null;
    return {
      country_code:country.code,country_name:country.name,gdelt_country:country.gdelt,
      language_code:language,publisher_domain:String(article.domain||"").slice(0,200),
      article_url:url,title,published_at:parseGdeltDate(article.seendate),
      article_text:fullText.slice(0,15000),article_chars:fullText.length,
      extraction_status:"full_article_extracted",collection_provider:"gdelt",
      source_country_verified:true,model_version:LANGUAGE_ENGINE_VERSION,
      model_output:analyzed,evaluation_status:"pending_review",evaluation_notes:null,
      collected_at:new Date().toISOString(),updated_at:new Date().toISOString()
    };
  }
  return {
    country_code:country.code,country_name:country.name,gdelt_country:country.gdelt,
    extraction_status:articles.length?"no_full_article_or_unsupported_language":"no_recent_article",
    article_chars:0,evaluation_status:"not_evaluable",
    collected_at:new Date().toISOString(),updated_at:new Date().toISOString()
  };
}

export async function reanalyzeCountryTestBatch(env, limit=10) {
  const rows=await learningRest(env,"market_news_country_test_corpus?select=country_code,language_code,publisher_domain,article_url,title,published_at,article_text,article_chars&article_chars=gte.1000&order=country_code.asc&limit="+Math.max(1,Math.min(10,Number(limit)||10)));
  let updated=0;
  for(const row of rows||[]) {
    if(!row.article_text || row.article_text.length<1000) continue;
    const refreshedText=await fetchFullArticleText(row.article_url);
    const fullText=refreshedText.length>=1000?refreshedText:row.article_text;
    const output=analyzeMarketLanguage([{
      title:row.title,original_title:row.title,original_text:fullText,
      full_text_mode:true,language_code:row.language_code,url:row.article_url,
      published_at:row.published_at,domain:row.publisher_domain
    }]).per_news?.[0] || null;
    if(!output) continue;
    await learningRest(env,"market_news_country_test_corpus?country_code=eq."+encodeURIComponent(row.country_code),{
      method:"PATCH",headers:{prefer:"return=minimal"},
      body:{article_text:fullText,article_chars:fullText.length,extraction_status:"full_article_extracted",model_output:output,model_version:LANGUAGE_ENGINE_VERSION,evaluation_notes:null,updated_at:new Date().toISOString()}
    });
    updated++;
  }
  return {updated,scanned:(rows||[]).length,analysis_mode:"full_article",max_article_chars:15000};
}

export async function collectGlobalCountryTestBatch(env,proxySecret=null) {
  const attemptAt = new Date().toISOString();
  try {
    await learningRest(env,"market_news_country_test_state?id=eq.1",{
      method:"PATCH",headers:{prefer:"return=minimal"},
      body:{last_attempt_at:attemptAt,last_error:null,updated_at:attemptAt}
    });
    const state=await learningRest(env,"market_news_country_test_state?select=next_index,total_countries,last_attempt_at,last_error&id=eq.1&limit=1");
    const start=Math.max(0,Number(state?.[0]?.next_index)||0);
    if(start>=GLOBAL_TEST_COUNTRIES.length) return {ran:false,complete:true,next_index:start};
    const batch=GLOBAL_TEST_COUNTRIES.slice(start,start+1);
    const results=await Promise.allSettled(batch.map(country=>fetchCountryNewsArticle(country,proxySecret)));
    const rows=results.map((result,index)=>{
      if(result.status==="fulfilled") return result.value;
      const country=batch[index];
      console.error("Global country article failed:",country.code,String(result.reason?.message||result.reason).slice(0,160));
      return {country_code:country.code,country_name:country.name,gdelt_country:country.gdelt,
        extraction_status:"collection_error",article_chars:0,evaluation_status:"not_evaluable",
        evaluation_notes:String(result.reason?.message||result.reason).slice(0,300),
        collected_at:new Date().toISOString(),updated_at:new Date().toISOString()};
    });
    await learningRest(env,"market_news_country_test_corpus?on_conflict=country_code",{
      method:"POST",headers:{prefer:"resolution=merge-duplicates,return=minimal"},body:rows
    });
    const next=Math.min(start+batch.length,GLOBAL_TEST_COUNTRIES.length);
    await learningRest(env,"market_news_country_test_state?id=eq.1",{
      method:"PATCH",headers:{prefer:"return=minimal"},
      body:{next_index:next,total_countries:GLOBAL_TEST_COUNTRIES.length,updated_at:new Date().toISOString()}
    });
    const full=rows.filter(row=>row.extraction_status==="full_article_extracted").length;
    console.log("Global country news test batch:",start+1,"-",next,"full_articles",full,"failed_or_missing",rows.length-full);
    return {ran:true,start,next,batch_size:batch.length,full_articles:full};
  } catch(error) {
    const message=String(error?.message||error).slice(0,500);
    console.error("Global country news test batch failed:",message);
    try {
      await learningRest(env,"market_news_country_test_state?id=eq.1",{
        method:"PATCH",headers:{prefer:"return=minimal"},
        body:{last_attempt_at:attemptAt,last_error:message,updated_at:new Date().toISOString()}
      });
    } catch(stateError) {
      console.error("Could not persist global country test error:",stateError?.message||stateError);
    }
    return {ran:false,error:message.slice(0,180)};
  }
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
    ctx.waitUntil(refreshBackground(env).then(async market => {
      await runForecastCycle(env,market);
      await runNewsLearningCycle(env);
    }).catch(error => console.error("Scheduled market/forecast cycle failed:",error?.message || error)));
    ctx.waitUntil(collectGlobalCountryTestBatch(env).then(result => {
      console.log("Global country test collector:", JSON.stringify(result));
    }).catch(error => console.error("Global country test collector crashed:",error?.message || error)));
  },
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null,{status:204,headers:H});
    if (url.pathname === "/news/global-test/fetch") {
      if (request.method !== "POST") return reply({error:"Method not allowed"},405);
      try {
        if (!(await verifyWorkerCronSecret(request))) return reply({error:"Unauthorized"},401);
        const code=String(url.searchParams.get("country")||"").toUpperCase();
        const country=GLOBAL_TEST_COUNTRIES.find(item=>item.code===code);
        if(!country) return reply({error:"Unknown country code"},400);
        const result=await fetchCountryNewsArticle(country);
        return reply(result,200,{"cache-control":"no-store"});
      } catch(error) {
        console.error("Country article proxy failed:",error?.message||error);
        return reply({error:"Country article fetch failed",detail:String(error?.message||error).slice(0,220)},502);
      }
    }
    if (url.pathname === "/news/global-test/status") {
      try {
        const [rows,state]=await Promise.all([
          learningRest(env,"market_news_country_test_corpus?select=country_code,country_name,language_code,publisher_domain,title,article_chars,extraction_status,evaluation_status,collected_at&order=country_name.asc&limit=120"),
          learningRest(env,"market_news_country_test_state?select=next_index,total_countries&id=eq.1&limit=1")
        ]);
        return reply({ok:true,total_countries:GLOBAL_TEST_COUNTRIES.length,processed_countries:state?.[0]?.next_index||0,last_attempt_at:state?.[0]?.last_attempt_at||null,last_error:state?.[0]?.last_error||null,
          full_articles:rows.filter(x=>x.extraction_status==="full_article_extracted").length,
          pending_review:rows.filter(x=>x.evaluation_status==="pending_review").length,
          not_evaluable:rows.filter(x=>x.evaluation_status==="not_evaluable").length,
          countries:rows.map(({country_code,country_name,language_code,publisher_domain,title,article_chars,extraction_status,evaluation_status,collected_at})=>({country_code,country_name,language_code,publisher_domain,title,article_chars,extraction_status,evaluation_status,collected_at}))});
      } catch(error) { return reply({ok:false,error:"Global test status unavailable"},503); }
    }
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
    if (request.method !== "GET" && !(request.method === "POST" && ["/news/feedback","/news/learning/review"].includes(url.pathname))) return reply({error:"Method not allowed"},405);
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
      const combinedLanguageAnalysis = analyzeMarketLanguage(news, []);
      data.news_context = {
        collected_at: cachedNews?.fetched_at || new Date().toISOString(),
        window_hours: 72,
        headline_count: news.length,
        recent_24h_count: news.filter(x => Date.now()-Date.parse(x.published_at) <= 24*60*60*1000).length,
        topics: newsTopics(news),
        language_intelligence:{
          engine:"dollar-domain-nlp",version:LANGUAGE_ENGINE_VERSION,mode:"deterministic_domain_nlp_not_llm",
          analyzed_articles:combinedLanguageAnalysis.news_analyzed,
          excerpt_articles:combinedLanguageAnalysis.news_with_excerpt,
          excerpt_coverage_pct:combinedLanguageAnalysis.excerpt_coverage_pct,
          themes:combinedLanguageAnalysis.themes,
          events:combinedLanguageAnalysis.events,
          possible_conflicts:combinedLanguageAnalysis.possible_conflicts,
          formal_language:combinedLanguageAnalysis.formal_language,
          bilingual_lexicon:combinedLanguageAnalysis.bilingual_lexicon,
          hard_news_comprehension:combinedLanguageAnalysis.hard_news_comprehension,
          news_reading_comprehension:combinedLanguageAnalysis.news_reading_comprehension,
          structured_claim_conflicts:combinedLanguageAnalysis.structured_claim_conflicts,
          structured_conflict_benchmark:combinedLanguageAnalysis.structured_conflict_benchmark,
          theme_classification_benchmark:combinedLanguageAnalysis.theme_classification_benchmark,
          quality:combinedLanguageAnalysis.quality
        },
        headlines: news.slice(0,12)
      };
      if (!response.ok && !data.forecast) {
        data.forecast = {status:"withheld",reason:data.error || "برای انتشار پیش‌بینی، دادهٔ کافی در دسترس نیست."};
      }
      return reply(data,200,{"cache-control":"no-store"});
    }

    if (url.pathname === "/news/feedback") {
      if(request.method!=="POST") return reply({error:"Method not allowed"},405);
      if(request.headers.get("x-internal-learning-authorized")!=="1") return reply({error:"Unauthorized"},401);
      if(Number(request.headers.get("content-length")||0)>16000) return reply({error:"Feedback payload too large"},413);
      let payload; try { payload=await request.json(); } catch { return reply({error:"Invalid JSON"},400); }
      const title=String(payload?.article_title||"").trim(), excerpt=String(payload?.input_excerpt||"").trim();
      const categories=Array.isArray(payload?.issue_categories)?[...new Set(payload.issue_categories.map(x=>String(x).trim()).filter(Boolean))].slice(0,8):[];
      const allowed=new Set(["wrong_actor","wrong_action","negation","modality","conditionality","attribution","time_scope","numeric_value","unit_mismatch","causal_inference","topic_classification","contradiction","translation","missing_context","other"]);
      if(!title||title.length>500||excerpt.length>5000||!payload?.predicted_output||!payload?.corrected_output||safeJsonSize(payload.predicted_output)>5000||safeJsonSize(payload.corrected_output)>5000||categories.some(x=>!allowed.has(x))) return reply({error:"Invalid feedback payload"},400);
      try {
        const saved=await learningRest(env,"market_news_feedback",{method:"POST",headers:{"prefer":"return=representation"},body:{
          article_url:typeof payload.article_url==="string"?payload.article_url.slice(0,1500):null,
          article_title:title,input_excerpt:excerpt,analyzer_version:String(payload.analyzer_version||LANGUAGE_ENGINE_VERSION).slice(0,80),
          predicted_output:payload.predicted_output,corrected_output:payload.corrected_output,issue_categories:categories,
          evidence_url:typeof payload.evidence_url==="string"?payload.evidence_url.slice(0,1500):null,
          reviewer_note:String(payload.reviewer_note||"").slice(0,1500),status:"submitted"
        }});
        const item=Array.isArray(saved)?saved[0]:null;
        if(item?.id) await learningRest(env,"market_news_learning_cases",{method:"POST",headers:{"prefer":"resolution=ignore-duplicates,return=minimal"},body:{
          feedback_id:item.id,category:categories[0]||"other",input_text:title+"\n"+excerpt,
          expected_output:payload.corrected_output,case_fingerprint:await fingerprintLearningCase(title,excerpt,payload.corrected_output),validation_status:"pending"
        }});
        return reply({ok:true,feedback_id:item?.id||null,status:"submitted",note_fa:"بازخورد ذخیره شد؛ تا تأیید انسانی، برچسب حقیقت قطعی محسوب نمی‌شود و هیچ قاعده‌ای خودکار تغییر نمی‌کند."},201);
      } catch(error) { console.error("News feedback write failed:",error); return reply({error:"Could not save feedback"},503); }
    }
    if (url.pathname === "/news/learning/review") {
      if(request.method!=="POST") return reply({error:"Method not allowed"},405);
      if(request.headers.get("x-internal-learning-authorized")!=="1") return reply({error:"Unauthorized"},401);
      let payload; try { payload=await request.json(); } catch { return reply({error:"Invalid JSON"},400); }
      const id=String(payload?.feedback_id||""), status=payload?.status;
      if(!/^[0-9a-f-]{36}$/i.test(id)||!["verified","rejected"].includes(status)) return reply({error:"feedback_id and verified/rejected status are required"},400);
      try {
        const updated=await learningRest(env,"market_news_feedback?id=eq."+encodeURIComponent(id),{method:"PATCH",headers:{"prefer":"return=representation"},body:{status,reviewed_at:new Date().toISOString(),reviewer_note:String(payload.reviewer_note||"").slice(0,1500)}});
        if(!updated.length) return reply({error:"Feedback not found"},404);
        return reply({ok:true,feedback_id:id,status,note_fa:status==="verified"?"بازخورد انسانی تأیید شد و وارد مجموعهٔ ارزیابی می‌شود؛ تغییر خودکار موتور انجام نشده است.":"بازخورد رد شد و در ارزیابی معتبر شمرده نمی‌شود."});
      } catch(error) { console.error("News feedback review failed:",error); return reply({error:"Could not review feedback"},503); }
    }
    if (url.pathname === "/news/learning") {
      if(request.method!=="GET") return reply({error:"Method not allowed"},405);
      if(request.headers.get("x-internal-learning-authorized")!=="1") return reply({error:"Unauthorized"},401);
      try { return reply(await newsLearningReport(env),200,{"cache-control":"no-store"}); }
      catch(error) { console.error("News learning report failed:",error); return reply({error:"Learning report unavailable"},503); }
    }

    if (url.pathname === "/news") {
      // Public GET requests are read-only. RSS ingestion runs only in the
      // scheduled refresh path, not on arbitrary visitor traffic.
      const stored = await readNewsFromSupabase(env).catch(() => []);
      const items = cleanNewsItems(stored);
      const conflicts = headlineConflictCandidates(items);
      const languageAnalysis = analyzeMarketLanguage(items, []);
      return reply({
        ok:true,window_hours:72,headline_count:items.length,
        recent_24h_count:items.filter(x => Date.now()-Date.parse(x.published_at) <= 24*60*60*1000).length,
        source_count:new Set(items.map(x=>x.source_id||x.domain)).size,
        potential_conflicts:conflicts,
        potential_conflict_count:conflicts.length,
        language_intelligence:{engine:"dollar-domain-nlp",version:LANGUAGE_ENGINE_VERSION,mode:"deterministic_domain_nlp_not_llm",analyzed_articles:languageAnalysis.news_analyzed,excerpt_articles:languageAnalysis.news_with_excerpt,excerpt_coverage_pct:languageAnalysis.excerpt_coverage_pct,themes:languageAnalysis.themes,
          topic_evidence:languageAnalysis.per_news.map(article=>({title:article.title,source:article.source,themes:article.theme_evidence||[],input_mode:article.input_mode,content_chars:article.content_chars})),
          events:languageAnalysis.events,possible_conflicts:languageAnalysis.possible_conflicts,structured_claim_conflicts:languageAnalysis.structured_claim_conflicts,structured_conflict_benchmark:languageAnalysis.structured_conflict_benchmark,formal_language:languageAnalysis.formal_language,bilingual_lexicon:languageAnalysis.bilingual_lexicon,hard_news_comprehension:languageAnalysis.hard_news_comprehension,news_reading_comprehension:languageAnalysis.news_reading_comprehension,quality:languageAnalysis.quality,theme_classification_benchmark:languageAnalysis.theme_classification_benchmark},
        refreshed:false,
        refresh_mode:"scheduled_only",
        topics:newsTopics(items),items
      },200,{"cache-control":"no-store"});
    }
    if (url.pathname === "/forecast/history" || url.pathname === "/forecast/performance" || url.pathname === "/forecast/learning" || url.pathname === "/forecast/diagnostics") return handleForecastApi(url,env);
    if (url.pathname === "/health") {
      const databaseConfigured = Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
      const tableChecks = databaseConfigured ? await Promise.all([
        ["market_quotes", "asset"],
        ["market_forecast_runs", "id"],
        ["market_news_items", "id"],
        ["market_news_sync_state", "id"],
        ["market_news_sources", "source_id"],
        ["market_learning_cycles", "id"]
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
      return reply({
        ok: true,
        service: "dollar-market-intelligence",
        configured: databaseConfigured,
        llm_configured: false,
        translation_pipeline:{enabled:false,reason:"No translation-provider secret is configured; English source text is analyzed directly without fabricating a Persian translation."},
        model: null,
        language_model: {
          enabled: false,
          status: "not_deployed",
          provider: null,
          external_api: false,
          note_fa: "مدل زبانی مولد مستقلی مستقر نیست."
        },
        history_parser_self_test: runHistoryParserSelfTest(),
        unified_news_pipeline_self_test: runUnifiedNewsPipelineSelfTest(),
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
          languages: ["fa", "en", "ar", "zh", "de", "fr"],
          multilingual_news_engine: {version:MULTILINGUAL_VERSION,languages:["ar","zh","de","fr"],mode:"deterministic_rule_based_not_llm",benchmark:(()=>{const b=runMultilingualBenchmark();return {total:b.total,passed:b.passed,failed:b.failed,score_pct:b.score_pct,by_language:b.by_language,scope:b.scope};})()},
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
        web_search_enabled: false,
        capabilities: ["multi-asset-market-quotes","walk-forward-backtesting","adaptive-ensemble-forecast","forecast-ledger","automatic-forecast-evaluation","continuous-learning-audit","forecast-drift-monitoring","forecast-performance-api","free-news-rss","topic-classification","domain-language-understanding","historical-context-extraction","news-to-price-event-linking","news-price-evidence-synthesis","decision-quality-gates","database-schema-diagnostics","no-external-language-model"]
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
