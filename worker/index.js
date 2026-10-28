const ORIGIN = "https://amir-studio.github.io";
const MARKET_URL = "https://raw.githubusercontent.com/iran-market/iran-market.github.io/main/data/popular.json";
const HISTORY_URL = "https://raw.githubusercontent.com/iran-market/iran-market.github.io/main/data/history/";
const ASSETS = {
  USD_IRR_FREE: "دلار آزاد (USD/IRR)",
  EUR_IRR_FREE: "یورو آزاد (EUR/IRR)",
  GOLD_18K_IRR: "طلای ۱۸ عیار",
  COIN_EMAMI_IRR: "سکه امامی"
};
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
async function makeForecast(env, asset) {
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
  const conf = sources.length >= 4 ? rawConfidence : Math.min(rawConfidence, sources.length >= 2 ? 55 : 35);
  const empiricalDailyVol = Math.max(model.sigma, model.daily_volatility_pct / 100);
  const uncertainty = Math.max(2.5,Math.min(20,(empiricalDailyVol*Math.sqrt(7)*100*1.45)+(100-conf)*0.04));
  return reply({
    asset,asset_fa:ASSETS[asset],generated_at:new Date().toISOString(),
    quote:{price,source_time:new Date(stamp).toISOString(),source:"Iran Market Data / TGJU"},
    forecast:{horizon_days:7,direction:change>0.35?"up":change< -0.35?"down":"sideways",headline_fa:ai.headline_fa,summary_fa:ai.summary_fa,expected_change_pct:Number(change.toFixed(2)),target_price:Math.round(target),range_low:Math.round(target*(1-uncertainty/100)),range_high:Math.round(target*(1+uncertainty/100)),confidence:conf,uncertainty_pct:Number(uncertainty.toFixed(2))},
    drivers:ai.drivers,risks_fa:ai.risks_fa,
    baseline:{daily_trend_pct:Number(model.daily_pct.toFixed(3)),momentum_7d_pct:model.momentum_7d_pct===null?null:Number(model.momentum_7d_pct.toFixed(3)),momentum_14d_pct:model.momentum_14d_pct===null?null:Number(model.momentum_14d_pct.toFixed(3)),momentum_30d_pct:model.momentum_30d_pct===null?null:Number(model.momentum_30d_pct.toFixed(3)),daily_volatility_pct:Number(model.daily_volatility_pct.toFixed(3)),max_drawdown_30d_pct:Number(model.max_drawdown_30d_pct.toFixed(3)),regression_target:Math.round(model.baseline7),observations:model.count},
    sources,
    news_sources_count:sources.length,
    news_window_hours:72,
    note_fa:"این یک برآورد احتمالی ۷روزه است، نه تضمین یا توصیه خریدوفروش."
  },200,{"cache-control":"private, max-age=300","vary":"Origin"});
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null,{status:204,headers:H});
    if (request.method !== "GET") return reply({error:"Method not allowed"},405);
    if (url.pathname === "/health") return reply({ok:true,service:"dollar-market-intelligence",configured:Boolean(env.OPENAI_API_KEY),model:env.OPENAI_MODEL || "gpt-5.5",capabilities:["fresh-market-quote","historical-momentum","live-web-search","source-links","seven-day-scenario"]},200,{"cache-control":"no-store"});
    if (url.pathname !== "/forecast") return reply({error:"Use /health or /forecast?asset=USD_IRR_FREE"},404);
    const asset = url.searchParams.get("asset") || "USD_IRR_FREE";
    if (!Object.hasOwn(ASSETS,asset)) return reply({error:"Unsupported asset"},400);
    try { return await makeForecast(env,asset); }
    catch (e) { return reply({error:"سرویس پیش‌بینی کامل نشد.",detail:String(e?.message || e).slice(0,220)},502); }
  }
};
