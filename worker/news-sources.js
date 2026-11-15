// Curated news feeds for the six-language ingestion layer.
// Feed availability is verified at runtime; an active flag means "probe and ingest", not "guaranteed healthy".
export const NEWS_SOURCES = [
  // Persian (8)
  {source_id:"irna-fa",name:"IRNA Persian",country_code:"IR",language_code:"fa",site_url:"https://www.irna.ir",feed_url:"https://www.irna.ir/rss",active:true,trust_tier:"unrated"},
  {source_id:"isna-fa",name:"ISNA Persian",country_code:"IR",language_code:"fa",site_url:"https://www.isna.ir",feed_url:"https://www.isna.ir/rss",active:true,trust_tier:"unrated"},
  {source_id:"mehr-fa",name:"Mehr News Persian",country_code:"IR",language_code:"fa",site_url:"https://www.mehrnews.com",feed_url:"https://www.mehrnews.com/rss",active:true,trust_tier:"unrated"},
  {source_id:"yjc-fa",name:"YJC Persian",country_code:"IR",language_code:"fa",site_url:"https://www.yjc.ir",feed_url:"https://www.yjc.ir/fa/rss/allnews",active:true,trust_tier:"unrated"},
  {source_id:"khabaronline-fa",name:"Khabar Online",country_code:"IR",language_code:"fa",site_url:"https://www.khabaronline.ir",feed_url:"https://www.khabaronline.ir/rss",active:true,trust_tier:"unrated"},
  {source_id:"asriran-fa",name:"Asr Iran",country_code:"IR",language_code:"fa",site_url:"https://www.asriran.com",feed_url:"https://www.asriran.com/fa/rss/allnews",active:true,trust_tier:"unrated"},
  {source_id:"tabnak-fa",name:"Tabnak",country_code:"IR",language_code:"fa",site_url:"https://www.tabnak.ir",feed_url:"https://www.tabnak.ir/fa/rss/allnews",active:true,trust_tier:"unrated"},
  {source_id:"tasnim-fa",name:"Tasnim Persian",country_code:"IR",language_code:"fa",site_url:"https://www.tasnimnews.com",feed_url:"https://www.tasnimnews.com/fa/rss/feed/0/8/0/%D9%85%D9%87%D9%85%D8%AA%D8%B1%DB%8C%D9%86-%D8%A7%D8%AE%D8%A8%D8%A7%D8%B1-%D8%AA%D8%B3%D9%86%DB%8C%D9%85",active:true,trust_tier:"unrated"},

  // English (9)
  {source_id:"bbc-en",name:"BBC World",country_code:"GB",language_code:"en",site_url:"https://www.bbc.com/news",feed_url:"https://feeds.bbci.co.uk/news/world/rss.xml",active:true,trust_tier:"unrated"},
  {source_id:"guardian-en",name:"The Guardian World",country_code:"GB",language_code:"en",site_url:"https://www.theguardian.com/world",feed_url:"https://www.theguardian.com/world/rss",active:true,trust_tier:"unrated"},
  {source_id:"aljazeera-en",name:"Al Jazeera English",country_code:"QA",language_code:"en",site_url:"https://www.aljazeera.com",feed_url:"https://www.aljazeera.com/xml/rss/all.xml",active:true,trust_tier:"unrated"},
  {source_id:"npr-en",name:"NPR News",country_code:"US",language_code:"en",site_url:"https://www.npr.org",feed_url:"https://feeds.npr.org/1001/rss.xml",active:true,trust_tier:"unrated"},
  {source_id:"cnbc-en",name:"CNBC Markets",country_code:"US",language_code:"en",site_url:"https://www.cnbc.com/markets",feed_url:"https://www.cnbc.com/id/10001147/device/rss/rss.html",active:true,trust_tier:"unrated"},
  {source_id:"marketwatch-en",name:"MarketWatch",country_code:"US",language_code:"en",site_url:"https://www.marketwatch.com",feed_url:"https://feeds.marketwatch.com/marketwatch/topstories",active:true,trust_tier:"unrated"},
  {source_id:"dw-en",name:"Deutsche Welle English",country_code:"DE",language_code:"en",site_url:"https://www.dw.com/en",feed_url:"https://rss.dw.com/rdf/rss-en-all",active:true,trust_tier:"unrated"},
  {source_id:"france24-en",name:"France 24 English",country_code:"FR",language_code:"en",site_url:"https://www.france24.com/en",feed_url:"https://www.france24.com/en/rss",active:true,trust_tier:"unrated"},
  {source_id:"voa-en",name:"Voice of America",country_code:"US",language_code:"en",site_url:"https://www.voanews.com",feed_url:"https://www.voanews.com/api/zmgqoe$1",active:true,trust_tier:"unrated"},

  // Arabic (8)
  {source_id:"bbc-ar",name:"BBC Arabic",country_code:"GB",language_code:"ar",site_url:"https://www.bbc.com/arabic",feed_url:"https://feeds.bbci.co.uk/arabic/rss.xml",active:true,trust_tier:"unrated"},
  {source_id:"aljazeera-ar",name:"Al Jazeera Arabic",country_code:"QA",language_code:"ar",site_url:"https://www.aljazeera.net",feed_url:"https://www.aljazeera.net/aljazeerarss/a7c186be-1baa-4bd4-9d80-a84db769f779/73d0e1b4-532f-45ef-b135-bfdff8b8cab9",active:true,trust_tier:"unrated"},
  {source_id:"dw-ar",name:"DW Arabic",country_code:"DE",language_code:"ar",site_url:"https://www.dw.com/ar",feed_url:"https://rss.dw.com/rdf/rss-ar-all",active:true,trust_tier:"unrated"},
  {source_id:"france24-ar",name:"France 24 Arabic",country_code:"FR",language_code:"ar",site_url:"https://www.france24.com/ar",feed_url:"https://www.france24.com/ar/rss",active:true,trust_tier:"unrated"},
  {source_id:"skynews-ar",name:"Sky News Arabia",country_code:"AE",language_code:"ar",site_url:"https://www.skynewsarabia.com",feed_url:"https://www.skynewsarabia.com/web/rss",active:true,trust_tier:"unrated"},
  {source_id:"alarabiya-ar",name:"Al Arabiya",country_code:"AE",language_code:"ar",site_url:"https://www.alarabiya.net",feed_url:"https://www.alarabiya.net/tools/rss",active:true,trust_tier:"unrated"},
  {source_id:"asharq-ar",name:"Asharq",country_code:"SA",language_code:"ar",site_url:"https://asharq.com",feed_url:"https://asharq.com/rss",active:true,trust_tier:"unrated"},
  {source_id:"annahar-ar",name:"An-Nahar",country_code:"LB",language_code:"ar",site_url:"https://www.annahar.com",feed_url:"https://www.annahar.com/rss",active:true,trust_tier:"unrated"},

  // Chinese (8)
  {source_id:"bbc-zh",name:"BBC Chinese",country_code:"GB",language_code:"zh",site_url:"https://www.bbc.com/zhongwen",feed_url:"https://feeds.bbci.co.uk/zhongwen/simp/rss.xml",active:true,trust_tier:"unrated"},
  {source_id:"dw-zh",name:"DW Chinese",country_code:"DE",language_code:"zh",site_url:"https://www.dw.com/zh",feed_url:"https://rss.dw.com/rdf/rss-chi-all",active:true,trust_tier:"unrated"},
  {source_id:"rfi-zh",name:"RFI Chinese",country_code:"FR",language_code:"zh",site_url:"https://www.rfi.fr/cn",feed_url:"https://www.rfi.fr/cn/rss",active:true,trust_tier:"unrated"},
  {source_id:"chinadaily-zh",name:"China Daily Chinese",country_code:"CN",language_code:"zh",site_url:"https://cn.chinadaily.com.cn",feed_url:"https://www.chinadaily.com.cn/rss/china_rss.xml",active:true,trust_tier:"unrated"},
  {source_id:"cgtn-zh",name:"CGTN Chinese",country_code:"CN",language_code:"zh",site_url:"https://www.cgtn.com",feed_url:"https://www.cgtn.com/subscribe/rss/section/china.xml",active:true,trust_tier:"unrated"},
  {source_id:"chinanews-zh",name:"China News Service",country_code:"CN",language_code:"zh",site_url:"https://www.chinanews.com.cn",feed_url:"https://www.chinanews.com.cn/rss/scroll-news.xml",active:true,trust_tier:"unrated"},
  {source_id:"people-zh",name:"People's Daily Chinese",country_code:"CN",language_code:"zh",site_url:"https://www.people.com.cn",feed_url:"http://www.people.com.cn/rss/politics.xml",active:true,trust_tier:"unrated"},
  {source_id:"voa-zh",name:"VOA Chinese",country_code:"US",language_code:"zh",site_url:"https://www.voachinese.com",feed_url:"https://www.voachinese.com/api/zmgqoe$1",active:true,trust_tier:"unrated"},

  // German (8)
  {source_id:"tagesschau-de",name:"Tagesschau",country_code:"DE",language_code:"de",site_url:"https://www.tagesschau.de",feed_url:"https://www.tagesschau.de/index~rss2.xml",active:true,trust_tier:"unrated"},
  {source_id:"dw-de",name:"Deutsche Welle Deutsch",country_code:"DE",language_code:"de",site_url:"https://www.dw.com/de",feed_url:"https://rss.dw.com/rdf/rss-de-all",active:true,trust_tier:"unrated"},
  {source_id:"spiegel-de",name:"Der Spiegel",country_code:"DE",language_code:"de",site_url:"https://www.spiegel.de",feed_url:"https://www.spiegel.de/schlagzeilen/index.rss",active:true,trust_tier:"unrated"},
  {source_id:"zdf-de",name:"ZDF Heute",country_code:"DE",language_code:"de",site_url:"https://www.zdf.de/nachrichten",feed_url:"https://www.zdf.de/rss/zdf/nachrichten",active:true,trust_tier:"unrated"},
  {source_id:"dlf-de",name:"Deutschlandfunk",country_code:"DE",language_code:"de",site_url:"https://www.deutschlandfunk.de",feed_url:"https://www.deutschlandfunk.de/nachrichten-100.rss",active:true,trust_tier:"unrated"},
  {source_id:"faz-de",name:"Frankfurter Allgemeine",country_code:"DE",language_code:"de",site_url:"https://www.faz.net",feed_url:"https://www.faz.net/rss/aktuell/",active:true,trust_tier:"unrated"},
  {source_id:"handelsblatt-de",name:"Handelsblatt",country_code:"DE",language_code:"de",site_url:"https://www.handelsblatt.com",feed_url:"https://www.handelsblatt.com/contentexport/feed/top-themen",active:true,trust_tier:"unrated"},
  {source_id:"sueddeutsche-de",name:"Süddeutsche Zeitung",country_code:"DE",language_code:"de",site_url:"https://www.sueddeutsche.de",feed_url:"https://rss.sueddeutsche.de/rss/Topthemen",active:true,trust_tier:"unrated"},

  // French (9)
  {source_id:"france24-fr",name:"France 24 Français",country_code:"FR",language_code:"fr",site_url:"https://www.france24.com/fr",feed_url:"https://www.france24.com/fr/rss",active:true,trust_tier:"unrated"},
  {source_id:"lemonde-fr",name:"Le Monde",country_code:"FR",language_code:"fr",site_url:"https://www.lemonde.fr",feed_url:"https://www.lemonde.fr/rss/une.xml",active:true,trust_tier:"unrated"},
  {source_id:"rfi-fr",name:"RFI Français",country_code:"FR",language_code:"fr",site_url:"https://www.rfi.fr/fr",feed_url:"https://www.rfi.fr/fr/rss",active:true,trust_tier:"unrated"},
  {source_id:"tv5monde-fr",name:"TV5Monde Info",country_code:"FR",language_code:"fr",site_url:"https://information.tv5monde.com",feed_url:"https://information.tv5monde.com/rss.xml",active:true,trust_tier:"unrated"},
  {source_id:"franceinfo-fr",name:"franceinfo",country_code:"FR",language_code:"fr",site_url:"https://www.francetvinfo.fr",feed_url:"https://www.francetvinfo.fr/titres.rss",active:true,trust_tier:"unrated"},
  {source_id:"liberation-fr",name:"Libération",country_code:"FR",language_code:"fr",site_url:"https://www.liberation.fr",feed_url:"https://www.liberation.fr/arc/outboundfeeds/rss-all/?outputType=xml",active:true,trust_tier:"unrated"},
  {source_id:"figaro-fr",name:"Le Figaro",country_code:"FR",language_code:"fr",site_url:"https://www.lefigaro.fr",feed_url:"https://www.lefigaro.fr/rss/figaro_actualites.xml",active:true,trust_tier:"unrated"},
  {source_id:"lexpress-fr",name:"L'Express",country_code:"FR",language_code:"fr",site_url:"https://www.lexpress.fr",feed_url:"https://www.lexpress.fr/rss/alaune.xml",active:true,trust_tier:"unrated"},
  {source_id:"euronews-fr",name:"Euronews Français",country_code:"FR",language_code:"fr",site_url:"https://fr.euronews.com",feed_url:"https://fr.euronews.com/rss",active:true,trust_tier:"unrated"}
];
