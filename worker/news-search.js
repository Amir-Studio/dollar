import { isMarketRelevantHeadline } from "./forecast-engine.js";

const LOCALES = {
  fa:{hl:"fa",gl:"IR",ceid:"IR:fa"},
  en:{hl:"en-US",gl:"US",ceid:"US:en"},
  ar:{hl:"ar",gl:"AE",ceid:"AE:ar"},
  zh:{hl:"zh-CN",gl:"CN",ceid:"CN:zh-Hans"},
  de:{hl:"de",gl:"DE",ceid:"DE:de"},
  fr:{hl:"fr",gl:"FR",ceid:"FR:fr"}
};

const normalizeText = value => String(value ?? "")
  .normalize("NFKC")
  .replace(/[ي]/g,"ی").replace(/[ك]/g,"ک")
  .replace(/[\u200c\u200f\u202a-\u202e]/g," ")
  .replace(/[\u0000-\u001f\u007f]/g," ")
  .replace(/\s+/g," ").trim().toLocaleLowerCase();

export function normalizeMarketNewsSearchQuery(value) {
  const query=normalizeText(value).slice(0,100);
  if(query.length<2) return {ok:false,query,searchQuery:query,reason:"عبارت جست‌وجو باید دست‌کم دو نویسه داشته باشد."};
  const expansions={
    gold:"gold price OR spot gold OR gold market OR gold futures",
    oil:"oil prices OR crude oil OR Brent crude OR oil market",
    dollar:"US dollar OR dollar exchange rate OR dollar index",
    euro:"euro exchange rate OR euro currency OR eurozone",
    rial:"Iranian rial OR rial exchange rate",
    yuan:"Chinese yuan OR yuan exchange rate"
  };
  const searchQuery=expansions[query]||query;
  if(!isMarketRelevantHeadline(searchQuery)) return {ok:false,query,searchQuery,reason:"جست‌وجو فقط برای موضوعات مرتبط با بازار، ارز، طلا، اقتصاد و سیاست پولی فعال است."};
  return {ok:true,query,searchQuery,reason:null};
}

export function detectMarketNewsLocale(value) {
  const query=String(value||"");
  if(/[\u4e00-\u9fff]/.test(query)) return "zh";
  if(/[پچژگکی]/.test(query)) return "fa";
  if(/[\u0600-\u06ff]/.test(query)) return "ar";
  if(/\b(goldpreis|zentralbank|wechselkurs|ölpreis|wirtschaft|devisen|dollarkurs)\b/i.test(query)||/[äöüß]/i.test(query)) return "de";
  if(/\b(prix|cours|banque centrale|taux de change|pétrole|économie|devises|marchés)\b/i.test(query)||/[àâçéèêëîïôûùüÿœ]/i.test(query)) return "fr";
  return "en";
}

export function buildGoogleNewsSearchUrl(query, locale="fa") {
  const safeLocale=Object.hasOwn(LOCALES,locale)?locale:"fa";
  const params=new URLSearchParams({
    q:String(query||"").slice(0,100),
    hl:LOCALES[safeLocale].hl,
    gl:LOCALES[safeLocale].gl,
    ceid:LOCALES[safeLocale].ceid
  });
  return "https://news.google.com/rss/search?"+params.toString();
}

function decodeXml(value) {
  return String(value||"")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,"$1")
    .replace(/&#(\d+);/g,(_,n)=>{try{return String.fromCodePoint(Number(n));}catch{return " ";}})
    .replace(/&#x([\da-f]+);/gi,(_,n)=>{try{return String.fromCodePoint(parseInt(n,16));}catch{return " ";}})
    .replace(/&amp;/gi,"&").replace(/&lt;/gi,"<").replace(/&gt;/gi,">")
    .replace(/&quot;/gi,'"').replace(/&apos;/gi,"'")
    .replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim();
}

function tag(block,name) {
  const safe=name.replace(/[.*+?^$()|[\]\\]/g,"\\$&");
  const match=block.match(new RegExp("<"+safe+"(?:\\s[^>]*)?>([\\s\\S]*?)</"+safe+">","i"));
  return match?decodeXml(match[1]):"";
}

function itemLink(block,feedUrl) {
  const text=tag(block,"link");
  const atom=block.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*\/?\s*>/i)?.[1]||"";
  const raw=text||atom||tag(block,"guid");
  try {
    const url=new URL(decodeXml(raw),feedUrl);
    return ["http:","https:"].includes(url.protocol)?url.href:"";
  } catch { return ""; }
}

export function parseGoogleNewsSearchFeed(xml,feedUrl,options={}) {
  const now=Number(options.now)||Date.now();
  const maxAgeHours=Math.max(1,Math.min(24*30,Number(options.maxAgeHours)||24*14));
  const blocks=[...String(xml||"").matchAll(/<(item|entry)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi)];
  const items=[];
  for(const match of blocks) {
    const block=match[2];
    const title=tag(block,"title");
    const url=itemLink(block,feedUrl);
    const publishedText=tag(block,"pubDate")||tag(block,"published")||tag(block,"updated");
    const published=Date.parse(publishedText);
    if(!title||!url||!Number.isFinite(published)) continue;
    if(published>now+5*60*1000||now-published>maxAgeHours*60*60*1000) continue;
    if(!isMarketRelevantHeadline(title)) continue;
    const sourceMatch=block.match(/<source\b([^>]*)>([\s\S]*?)<\/source>/i);
    const sourceUrl=sourceMatch?.[1]?.match(/\burl=["']([^"']+)["']/i)?.[1]||"";
    let domain="";
    try { domain=new URL(decodeXml(sourceUrl)).hostname.replace(/^www\./,""); }
    catch { try { domain=new URL(url).hostname.replace(/^www\./,""); } catch {} }
    const description=tag(block,"description").slice(0,1800);
    items.push({
      title,url,domain:domain||"Google News",
      published_at:new Date(published).toISOString(),
      source_id:"google-news-live-search",
      language_code:options.locale||"fa",
      original_title:title,
      original_text:description||null,
      article_status:description?"extracted":"headline_only",
      extraction_method:description?"google_news_rss_excerpt":"headline_only",
      search_provider:"Google News RSS"
    });
  }
  const seen=new Set();
  return items.sort((a,b)=>Date.parse(b.published_at)-Date.parse(a.published_at))
    .filter(item=>{
      const key=item.url.toLowerCase().replace(/[?#].*$/,"");
      if(!key||seen.has(key)) return false;
      seen.add(key);return true;
    }).slice(0,20);
}

export async function searchMarketNews(rawQuery,fetcher=fetch,now=Date.now()) {
  const checked=normalizeMarketNewsSearchQuery(rawQuery);
  if(!checked.ok) return {ok:false,query:checked.query,reason:checked.reason,locale:null,items:[]};
  const locale=detectMarketNewsLocale(checked.query);
  const url=buildGoogleNewsSearchUrl(checked.searchQuery,locale);
  const response=await fetcher(url,{
    headers:{accept:"application/rss+xml,application/atom+xml,application/xml,text/xml","user-agent":"DollarMarketSearch/1.0"},
    signal:AbortSignal.timeout(12000)
  });
  if(!response.ok) throw Error("Google News search HTTP "+response.status);
  const xml=await response.text();
  const items=parseGoogleNewsSearchFeed(xml,url,{now,maxAgeHours:24*14,locale});
  return {ok:true,query:checked.query,search_query:checked.searchQuery,locale,provider:"Google News RSS",items};
}
