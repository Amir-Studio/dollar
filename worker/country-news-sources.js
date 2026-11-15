// One primary publisher feed per priority country.
// Daily ingestion: Iran/Persian 30, United States 10, and 2 for each of 16 priority countries.
export const COUNTRY_NEWS_SOURCES_VERSION = "priority-country-feeds-2.0.0";
export const NEWS_DAILY_QUOTAS = Object.freeze({
  IR:30, US:10,
  GB:2, CN:2, DE:2, FR:2, RU:2, JP:2, IN:2, KR:2,
  CA:2, AU:2, BR:2, IT:2, ES:2, TR:2, SA:2, AE:2
});
export const COUNTRY_NEWS_SOURCES = [
  {source_id:"irna-fa",country_code:"IR",country_name:"Iran",name:"IRNA",language_code:"fa",site_url:"https://www.irna.ir",feed_url:"https://www.irna.ir/rss",active:true,trust_tier:"unrated"},
  {source_id:"npr-en",country_code:"US",country_name:"United States",name:"NPR",language_code:"en",site_url:"https://www.npr.org",feed_url:"https://feeds.npr.org/1001/rss.xml",active:true,trust_tier:"unrated"},
  {source_id:"bbc-en",country_code:"GB",country_name:"United Kingdom",name:"BBC News",language_code:"en",site_url:"https://www.bbc.com",feed_url:"https://feeds.bbci.co.uk/news/rss.xml",active:true,trust_tier:"unrated"},
  {source_id:"cgtn-zh",country_code:"CN",country_name:"China",name:"CGTN",language_code:"zh",site_url:"https://www.cgtn.com",feed_url:"https://www.cgtn.com/subscribe/rss/section/china.xml",active:true,trust_tier:"unrated"},
  {source_id:"tagesschau-de",country_code:"DE",country_name:"Germany",name:"Tagesschau",language_code:"de",site_url:"https://www.tagesschau.de",feed_url:"https://www.tagesschau.de/index~rss2.xml",active:true,trust_tier:"unrated"},
  {source_id:"france24-fr",country_code:"FR",country_name:"France",name:"France 24",language_code:"fr",site_url:"https://www.france24.com",feed_url:"https://www.france24.com/fr/rss",active:true,trust_tier:"unrated"},
  {source_id:"lenta-ru",country_code:"RU",country_name:"Russia",name:"Lenta.ru",language_code:"ru",site_url:"https://lenta.ru",feed_url:"https://lenta.ru/rss",active:true,trust_tier:"unrated"},
  {source_id:"nhk-ja",country_code:"JP",country_name:"Japan",name:"NHK News",language_code:"ja",site_url:"https://www.nhk.or.jp",feed_url:"https://www.nhk.or.jp/rss/news/cat0.xml",active:true,trust_tier:"unrated"},
  {source_id:"toi-en",country_code:"IN",country_name:"India",name:"The Times of India",language_code:"en",site_url:"https://timesofindia.indiatimes.com",feed_url:"https://timesofindia.indiatimes.com/rssfeedstopstories.cms",active:true,trust_tier:"unrated"},
  {source_id:"yonhap-ko",country_code:"KR",country_name:"South Korea",name:"Yonhap News",language_code:"ko",site_url:"https://www.yna.co.kr",feed_url:"https://www.yna.co.kr/rss/news.xml",active:true,trust_tier:"unrated"},
  {source_id:"cbc-en",country_code:"CA",country_name:"Canada",name:"CBC News",language_code:"en",site_url:"https://www.cbc.ca",feed_url:"https://www.cbc.ca/webfeed/rss/rss-topstories",active:true,trust_tier:"unrated"},
  {source_id:"abc-au",country_code:"AU",country_name:"Australia",name:"ABC News Australia",language_code:"en",site_url:"https://www.abc.net.au",feed_url:"https://www.abc.net.au/news/feed/45910/rss.xml",active:true,trust_tier:"unrated"},
  {source_id:"agencia-brasil-pt",country_code:"BR",country_name:"Brazil",name:"Agência Brasil",language_code:"pt",site_url:"https://agenciabrasil.ebc.com.br",feed_url:"https://agenciabrasil.ebc.com.br/rss/ultimasnoticias/feed.xml",active:true,trust_tier:"unrated"},
  {source_id:"ansa-it",country_code:"IT",country_name:"Italy",name:"ANSA",language_code:"it",site_url:"https://www.ansa.it",feed_url:"https://www.ansa.it/sito/ansait_rss.xml",active:true,trust_tier:"unrated"},
  {source_id:"elpais-es",country_code:"ES",country_name:"Spain",name:"El País",language_code:"es",site_url:"https://elpais.com",feed_url:"https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/internacional/portada",active:true,trust_tier:"unrated"},
  {source_id:"trthaber-tr",country_code:"TR",country_name:"Türkiye",name:"TRT Haber",language_code:"tr",site_url:"https://www.trthaber.com",feed_url:"https://www.trthaber.com/sondakika.rss",active:true,trust_tier:"unrated"},
  {source_id:"arabnews-en",country_code:"SA",country_name:"Saudi Arabia",name:"Arab News",language_code:"en",site_url:"https://www.arabnews.com",feed_url:"https://www.arabnews.com/rss.xml",active:true,trust_tier:"unrated"},
  {source_id:"skynews-ar",country_code:"AE",country_name:"United Arab Emirates",name:"Sky News Arabia",language_code:"ar",site_url:"https://www.skynewsarabia.com",feed_url:"https://www.skynewsarabia.com/web/rss",active:true,trust_tier:"unrated"}
];
export function validateCountryNewsSources(sources=COUNTRY_NEWS_SOURCES) {
  const ids=new Set(),countries=new Set(),errors=[];
  const required=Object.keys(NEWS_DAILY_QUOTAS);
  for (const source of sources) {
    if (!source.source_id || ids.has(source.source_id)) errors.push("duplicate_or_missing_source_id:"+String(source.source_id));
    if (!source.country_code || countries.has(source.country_code)) errors.push("duplicate_or_missing_country:"+String(source.country_code));
    if (!required.includes(source.country_code)) errors.push("country_not_in_daily_quota:"+String(source.country_code));
    if (!/^[A-Z]{2}$/.test(source.country_code||"")) errors.push("invalid_country_code:"+String(source.country_code));
    try { const feed=new URL(source.feed_url); if(feed.protocol!=="https:") errors.push("non_https_feed:"+source.source_id); }
    catch { errors.push("invalid_feed_url:"+source.source_id); }
    ids.add(source.source_id); countries.add(source.country_code);
  }
  for (const country of required) if(!countries.has(country)) errors.push("missing_priority_country:"+country);
  const totalQuota=Object.values(NEWS_DAILY_QUOTAS).reduce((sum,value)=>sum+value,0);
  return {version:COUNTRY_NEWS_SOURCES_VERSION,total:sources.length,unique_countries:countries.size,unique_source_ids:ids.size,daily_quotas:NEWS_DAILY_QUOTAS,total_daily_quota:totalQuota,errors,passed:errors.length===0&&sources.length===required.length&&countries.size===required.length};
}
