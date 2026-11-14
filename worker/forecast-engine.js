const MARKET_URL = "https://raw.githubusercontent.com/iran-market/iran-market.github.io/main/data/popular.json";
const HISTORY_URL = "https://raw.githubusercontent.com/iran-market/iran-market.github.io/main/data/history/";
const NERKHARA_URL = "https://nerkhara.com/api/v1/latest.json";
const NERKHARA_HISTORY_URL = "https://nerkhara.com/api/v1/history/";
const NERKHARA_IDS = {USD_IRR_FREE:"usd",EUR_IRR_FREE:"eur",GOLD_18K_IRR:"gold-18k",COIN_EMAMI_IRR:"coin-emami"};
const MODEL_VERSION = "iran-ensemble-wf-2.7-maturity-safe-walkforward";
const ASSETS = new Set(["USD_IRR_FREE","EUR_IRR_FREE","GOLD_18K_IRR","COIN_EMAMI_IRR"]);
const HORIZONS = [1,3,7];
const DAY = 86400000;

const MARKET_NEWS_TERMS = [
  "دلار","یورو","پوند","درهم","ریال","نرخ ارز","قیمت ارز","بازار ارز","ارز آزاد","نرخ دلار","قیمت دلار",
  "سکه","قیمت سکه","قیمت طلا","بازار طلا","طلای ۱۸ عیار","اونس طلا","تورم","نرخ تورم","بانک مرکزی",
  "مرکز مبادله","نرخ بهره","نرخ سود","تسهیلات بانکی","نقدینگی","کسری بودجه","بودجه","اقتصاد ایران",
  "اقتصاد جهانی","رشد اقتصادی","تولید ناخالص","بازار سرمایه","بورس","شاخص کل بورس","سهام","صادرات نفت",
  "نفت ایران","واردات نفت","قیمت نفت","نفت خام","برنت","قیمت گاز","گاز طبیعی","سیاست پولی","پایه پولی",
  "تجارت خارجی","گمرک","مالیات","یارانه","دستمزد","قیمت مسکن","بازار مسکن","قیمت خودرو","بازار خودرو",
  "صنعت خودرو","صنعت فولاد","صنعت نفت","صنعت پتروشیمی","قیمت کالا","بازار جهانی","تحریم اقتصادی",
  "تحریم‌های ایران","ارزش پول ملی","فشار اقتصادی",
  "currency","exchange rate","inflation","gold price","gold futures","gold bullion","gold market",
  "precious metals","central bank","interest rate","interest rates","rate hike","rate hikes","rate cut",
  "rate cuts","federal reserve","fed rate","fed rates","treasury yield","treasury yields","bond yield",
  "bond yields","oil price","oil prices","brent crude","crude oil","oil futures","oil supply","oil production",
  "oil exports","oil demand","oil shock","fuel prices","diesel prices","energy prices","energy shock",
  "energy market","energy supply","trade deficit","budget deficit","gdp","forex","stock market","stocks",
  "shares","bonds","monetary policy","commodity prices","opec","dollar index","us dollar","dollar exchange",
  "dollar rate","dollar price","eurozone","euro currency","euro exchange rate","sterling exchange rate",
  "pound sterling","economic growth","recession","cpi","ppi","employment report","jobs report",
  "market volatility","tariffs","export prices","import prices","sanctions","sanction relief","iran sanctions",
  "iran talks","iran negotiations","iran nuclear","iranian economy","iranian rial","iran currency",
  "foreign exchange","currency market","exchange market","oil market","iran economy","iran oil","iran gold","fx market"
];
const EXCLUDED_NEWS_TERMS = [
  "missile","casualties","killed","shooting","armed","police","explosion","bombing","court case",
  "lawsuit","fraud","theft","criminal","arrest","drug","حادثه","تصادف","حمله","مسلحانه","سلاح",
  "موشک","انفجار","کشته","پلیس","درگیری مسلحانه","تشییع","شهید"
];
export function isMarketRelevantHeadline(title) {
  const value=String(title||"").normalize("NFKC").toLocaleLowerCase();
  if(!value || EXCLUDED_NEWS_TERMS.some(term=>value.includes(term.toLocaleLowerCase()))) return false;
  return MARKET_NEWS_TERMS.some(term=>value.includes(term.toLocaleLowerCase()));
}

const num = v => {
  const x = Number(String(v ?? "").replace(/[٬,\s]/g,"").replace(/٫/g,"."));
  return Number.isFinite(x) ? x : NaN;
};
const dateMs = v => {
  if (typeof v === "number" || /^\d{10,13}$/.test(String(v ?? ""))) {
    const s=String(v), x=Number(v); return s.length===10 ? x*1000 : x;
  }
  return Date.parse(String(v ?? ""));
};
async function json(url) {
  const r=await fetch(url,{headers:{accept:"application/json"},signal:AbortSignal.timeout(15000)});
  if(!r.ok) throw Error("HTTP "+r.status+" from market source");
  return r.json();
}
function utcStamp(value) {
  const text=String(value??"");
  return dateMs(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?$/.test(text)?text+"Z":text);
}
function normalizeNerkhara(payload) {
  const items=Array.isArray(payload?.items)?payload.items:payload?.item?[payload.item]:[];
  const byId=new Map(items.map(item=>[item.id,item]));
  const data=Object.entries(NERKHARA_IDS).flatMap(([symbol,id])=>{
    const item=byId.get(id),price=Number(item?.price),timestamp=utcStamp(item?.updated_utc||payload?.generated_utc);
    if(!item||!(price>0)||!Number.isFinite(timestamp)) return [];
    return [{symbol,price,timestamp:new Date(timestamp).toISOString(),stale:item.stale===true,
      source:"NerkhAra",provider_meta:{provider:"NerkhAra",unit:item.unit,method:item.method,source_count:Number(item.sources)||0,
        spread_pct:Number.isFinite(Number(item.spread_pct))?Number(item.spread_pct):null,updated_utc:item.updated_utc||payload?.generated_utc,
        page:item.page?.en||item.page?.fa||null}}];
  });
  if(!data.length) throw Error("NerkhAra returned no supported market symbols");
  return {meta:{source:"NerkhAra",published_at:payload.generated_utc||null},data};
}
export async function getMarketSnapshot(env,supplied=null) {
  if(supplied?.data?.length) return supplied;
  try { return normalizeNerkhara(await json(env.NERKHARA_URL||NERKHARA_URL)); }
  catch(primaryError) {
    try { return await json(env.MARKET_DATA_URL||MARKET_URL); }
    catch(fallbackError) { throw Error("هر دو منبع قیمت در دسترس نیستند؛ NerkhAra: "+String(primaryError.message||primaryError).slice(0,90)+"؛ پشتیبان: "+String(fallbackError.message||fallbackError).slice(0,90)); }
  }
}
function rowsFrom(payload) {
  const raw=Array.isArray(payload)?payload:Array.isArray(payload?.data)?payload.data:Array.isArray(payload?.history)?payload.history:Array.isArray(payload?.items)?payload.items:Array.isArray(payload?.points)?payload.points:Array.isArray(payload?.samples)?payload.samples:[];
  const sorted=raw.map(r=>({t:utcStamp(r.date??r.datetime??r.timestamp??r.time??r.date_gregorian??r.observed_at??r.day??r.t),p:num(r.close??r.c??r.price??r.value??r.last??r.close_price??r.mean??r.average??r.avg)}))
    .filter(x=>Number.isFinite(x.t)&&x.p>0).sort((a,b)=>a.t-b.t);
  const byDay=new Map();
  for(const r of sorted) byDay.set(new Date(r.t).toISOString().slice(0,10),r);
  return [...byDay.values()].sort((a,b)=>a.t-b.t);
}
function median(a) {
  if(!a.length) return 0;
  const s=[...a].sort((x,y)=>x-y), m=Math.floor(s.length/2);
  return s.length%2?s[m]:(s[m-1]+s[m])/2;
}
function quantile(a,q) {
  if(!a.length) return null;
  const s=[...a].sort((x,y)=>x-y), i=(s.length-1)*q, lo=Math.floor(i), hi=Math.ceil(i);
  return s[lo]+(s[hi]-s[lo])*(i-lo);
}
function regression(points,window=45) {
  const p=points.slice(-window), x0=p[0].t/DAY, xs=p.map(r=>r.t/DAY-x0), ys=p.map(r=>Math.log(r.p));
  const xm=xs.reduce((a,b)=>a+b,0)/xs.length, ym=ys.reduce((a,b)=>a+b,0)/ys.length;
  let cov=0,vx=0;
  for(let i=0;i<xs.length;i++){cov+=(xs[i]-xm)*(ys[i]-ym);vx+=(xs[i]-xm)**2;}
  const slope=vx?cov/vx:0, intercept=ym-slope*xm;
  const residual=ys.map((v,i)=>v-(intercept+slope*xs[i]));
  const sigma=Math.sqrt(residual.reduce((s,v)=>s+v*v,0)/Math.max(1,residual.length-2));
  return {slope,intercept,x0,sigma,trendNow:intercept+slope*xs[xs.length-1]};
}

function candidates(points,h) {
  const p=points.slice(-260), returns=[];
  for(let i=1;i<p.length;i++){
    const days=(p[i].t-p[i-1].t)/DAY;
    if(days>0) returns.push({value:Math.log(p[i].p/p[i-1].p)/days,days});
  }
  const raw={no_change:0};
  const clamp=(v,cap)=>Math.max(-cap,Math.min(cap,v));
  const recent=returns.slice(-20);
  const recentMean=recent.reduce((s,r)=>s+r.value,0)/Math.max(1,recent.length);
  const dailyVol=Math.sqrt(recent.reduce((s,r)=>s+(r.value-recentMean)**2,0)/Math.max(1,recent.length-1));
  const cap=Math.min(0.30,Math.max(0.015,3.5*dailyVol*Math.sqrt(h)));
  const medianWindow=(window)=>median(returns.slice(-window).map(r=>r.value));
  for(const window of [5,10,20,40,80,120]){
    raw["median_"+window]=clamp(medianWindow(window)*h,cap);
  }
  for(const halfLife of [2,4,8,16,32]){
    const sample=returns.slice(-160);
    let total=0,weighted=0;
    for(let i=0;i<sample.length;i++){
      const age=sample.length-1-i;
      const w=Math.pow(0.5,age/halfLife);
      weighted+=sample[i].value*w;total+=w;
    }
    raw["ewma_"+halfLife]=clamp((total?weighted/total:0)*h,cap);
  }
  for(const window of [15,30,60,120]){
    if(p.length<window) continue;
    const reg=regression(p,window);
    raw["trend_"+window]=clamp(reg.slope*h,cap);
    const deviation=Math.log(p[p.length-1].p)-reg.trendNow;
    for(const halfLife of [7,14,28]){
      raw["revert_"+window+"_"+halfLife]=clamp((reg.slope*h)-deviation*(1-Math.exp(-h/halfLife)),cap);
    }
  }
  for(const window of [3,5,10,20,40]){
    const sample=returns.slice(-window);
    const avg=sample.reduce((s,r)=>s+r.value,0)/Math.max(1,sample.length);
    raw["momentum_"+window]=clamp(avg*h,cap);
  }
  return {raw,dailyVol};
}

function relativeErrorPct(predictedLogReturn,actualLogReturn) {
  return Math.abs(Math.expm1(predictedLogReturn-actualLogReturn))*100;
}
function baselineWeights(keys) {
  return Object.fromEntries(keys.map(k=>[k,k==="no_change"?1:0]));
}
function selectWeights(sample,keys) {
  if(sample.length<40) return baselineWeights(keys);
  const baselineMae=sample.reduce((s,r)=>s+relativeErrorPct(0,r.actual),0)/sample.length;
  const ranked=keys.filter(k=>k!=="no_change").map(k=>({
    key:k,mae:sample.reduce((s,r)=>s+relativeErrorPct(r.preds[k]??0,r.actual),0)/sample.length
  })).filter(x=>x.mae<baselineMae*0.95).sort((a,b)=>a.mae-b.mae).slice(0,3);
  if(!ranked.length) return baselineWeights(keys);
  const inverse=ranked.map(x=>1/Math.pow(0.05+x.mae,2));
  const sum=inverse.reduce((a,b)=>a+b,0);
  const weights=Object.fromEntries(keys.map(k=>[k,0]));
  weights.no_change=0.15;
  ranked.forEach((x,i)=>weights[x.key]=0.85*inverse[i]/sum);
  // Keep the selected model from taking nearly all weight on a small sample.
  for(let pass=0;pass<6;pass++){
    const over=ranked.filter(x=>weights[x.key]>0.60);
    if(!over.length) break;
    let excess=0;
    over.forEach(x=>{excess+=weights[x.key]-0.60;weights[x.key]=0.60;});
    const under=ranked.filter(x=>weights[x.key]<0.60);
    const underTotal=under.reduce((s,x)=>s+weights[x.key],0);
    if(!underTotal) break;
    under.forEach(x=>weights[x.key]+=excess*weights[x.key]/underTotal);
  }
  const total=Object.values(weights).reduce((a,b)=>a+b,0);
  return Object.fromEntries(keys.map(k=>[k,weights[k]/total]));
}

function backtest(points,h) {
  // Evaluate the latest 730 calendar days, with at least 260 prior observations
  // available for feature construction. Origins are advanced by observed target
  // timestamps, not row counts, so missing dates cannot create overlapping tests.
  const evaluationWindowDays=730;
  const latestTime=points[points.length-1]?.t||0;
  const cutoff=latestTime-evaluationWindowDays*DAY;
  let start=0;
  while(start<points.length&&points[start].t<cutoff) start++;
  start=Math.max(260,start);
  const records=[];
  let nextAllowedOrigin=-Infinity;
  const targetToleranceDays=1.5;
  for(let i=start;i<points.length-1;i++){
    const origin=points[i];
    if(origin.t<nextAllowedOrigin) continue;
    const targetTime=origin.t+h*DAY;
    let j=i+1;
    while(j<points.length&&points[j].t<targetTime) j++;
    if(j>=points.length) continue;
    const targetDelayDays=(points[j].t-targetTime)/DAY;
    if(targetDelayDays>targetToleranceDays) continue;
    const actual=Math.log(points[j].p/origin.p);
    const preds=candidates(points.slice(0,i+1),h).raw;
    records.push({
      originTime:origin.t,targetTime,actualTime:points[j].t,
      effectiveHorizonDays:(points[j].t-origin.t)/DAY,actual,preds
    });
    // Do not start the next test until the actual target observation has arrived.
    nextAllowedOrigin=points[j].t;
  }
  const keys=records.length?Object.keys(records[0].preds):["no_change"];
  const n=records.length;
  if(n<30) return {
    eligible:false,samples:n,evaluation_method:"non_overlapping_rolling_origin",
    evaluation_window_days:evaluationWindowDays,target_tolerance_days:targetToleranceDays,
    overlapping_test_windows:false,
    reason:"برای ارزیابی معتبر حداقل ۳۰ نمونهٔ خارج از نمونه و تاریخچهٔ کافی لازم است."
  };
  const candidateMae=Object.fromEntries(keys.map(k=>[
    k,records.reduce((s,r)=>s+relativeErrorPct(r.preds[k]??0,r.actual),0)/n
  ]));
  const ensembleErrors=[],baselineErrors=[];
  let hits=0,directionalN=0,within1=0,within2=0,within5=0;
  for(let i=0;i<n;i++){
    const origin=records[i].originTime;
    // Critical maturity guard: only outcomes whose actual observation timestamp
    // was already available at this origin may train the ensemble weights.
    const matured=records.filter((r,j)=>j<i&&r.actualTime<=origin);
    const weights=selectWeights(matured,keys);
    const blend=keys.reduce((s,k)=>s+(weights[k]||0)*(records[i].preds[k]??0),0);
    const actual=records[i].actual;
    const error=relativeErrorPct(blend,actual);
    ensembleErrors.push(error);
    baselineErrors.push(relativeErrorPct(0,actual));
    if(error<=1) within1++;
    if(error<=2) within2++;
    if(error<=5) within5++;
    const actualMove=Math.expm1(actual), predictedMove=Math.expm1(blend);
    if(Math.abs(actualMove)>0.001&&Math.abs(predictedMove)>0.0005){
      directionalN++;
      if(Math.sign(actualMove)===Math.sign(predictedMove)) hits++;
    }
  }
  const mae=ensembleErrors.reduce((s,v)=>s+v,0)/n;
  const naiveMae=baselineErrors.reduce((s,v)=>s+v,0)/n;
  const skill=naiveMae>0?(1-mae/naiveMae)*100:0;
  const maturedAll=records.filter(r=>r.actualTime<=latestTime);
  const liveWeights=selectWeights(maturedAll,keys);
  const effectiveHorizons=records.map(r=>r.effectiveHorizonDays);
  const eligible=n>=30&&skill>=2;
  const selected=Object.entries(liveWeights).filter(([k,v])=>k!=="no_change"&&v>0).map(([model,weight])=>({model,weight:Number(weight.toFixed(3))}));
  return {
    eligible,samples:n,mae_pct:Number(mae.toFixed(4)),naive_mae_pct:Number(naiveMae.toFixed(4)),
    evaluation_method:"non_overlapping_rolling_origin_maturity_guard",
    evaluation_window_days:evaluationWindowDays,
    target_tolerance_days:targetToleranceDays,
    effective_horizon_days:{min:Number(Math.min(...effectiveHorizons).toFixed(3)),max:Number(Math.max(...effectiveHorizons).toFixed(3)),mean:Number((effectiveHorizons.reduce((a,b)=>a+b,0)/n).toFixed(3))},
    overlapping_test_windows:false,
    skill_vs_no_change_pct:Number(skill.toFixed(2)),
    directional_accuracy_pct:directionalN?Number((hits/directionalN*100).toFixed(1)):null,
    directional_samples:directionalN,
    directional_coverage_pct:Number((directionalN/n*100).toFixed(1)),
    within_1pct_pct:Number((within1/n*100).toFixed(1)),
    within_2pct_pct:Number((within2/n*100).toFixed(1)),
    within_5pct_pct:Number((within5/n*100).toFixed(1)),
    median_error_pct:Number((quantile(ensembleErrors,0.5)??0).toFixed(4)),
    range_error_p80_pct:Number((quantile(ensembleErrors,0.8)??0).toFixed(4)),
    candidate_mae_pct:Object.fromEntries(Object.entries(candidateMae).map(([k,v])=>[k,Number(v.toFixed(4))])),
    selected_models:selected,weights:liveWeights,
    reason:eligible?null:"هیچ ترکیب/مدل منتخب در آزمون walk-forward دست‌کم ۲٪ بهتر از پیش‌بینی بدون تغییر نشده؛ خروجی جهت‌دار منتشر نمی‌شود."
  };
}

function buildForecastPoint(points,price,horizon,newsContext=null) {
  const min={1:300,3:300,7:300}[horizon]||300;
  if(points.length<min) return {eligible:false,reason:"تاریخچه برای این افق کافی نیست.",observations:points.length,required:min};
  const validation=backtest(points,horizon);
  if(!validation.eligible) {
    // Keep the honest no-change benchmark in the live ledger when the model
    // has enough out-of-sample evidence but has not beaten that benchmark.
    // This creates measurable future feedback without inventing a directional signal.
    if(validation.samples>=30 && Number.isFinite(validation.mae_pct) &&
       Number.isFinite(validation.range_error_p80_pct)) {
      const {dailyVol}=candidates(points,horizon);
      const band=Math.max(validation.range_error_p80_pct/100,dailyVol*Math.sqrt(horizon)*1.28,0.003);
      const weights=baselineWeights(Object.keys(validation.weights||{no_change:1}));
      const baselineValidation={
        ...validation,
        eligible:false,
        forecast_mode:"baseline_only",
        directional_signal:false,
        confidence_label:"baseline",
        reason:"مدل هنوز در آزمون خارج از نمونه از مبنای بدون تغییر بهتر نشده است؛ فقط سناریوی مرجع خنثی برای سنجش خطای آینده ثبت می‌شود."
      };
      return {
        eligible:true,forecast_mode:"baseline_only",model_version:MODEL_VERSION,
        horizon_days:horizon,reference_price:price,predicted_price:price,
        predicted_change_pct:0,lower_price:price*Math.exp(-band),
        upper_price:price*Math.exp(band),direction:"sideways",
        model_weights:weights,validation:baselineValidation,
        uncertainty_pct:band*100,news_context:newsContext||null
      };
    }
    return {...validation,observations:points.length};
  }
  const {raw,dailyVol}=candidates(points,horizon);
  const logChange=Object.keys(validation.weights).reduce((s,k)=>s+validation.weights[k]*raw[k],0);
  const change=Math.expm1(logChange);
  const eventRisk=Math.max(0,Math.min(100,Number(newsContext?.event_risk_score)||0));
  const newsMultiplier=1+eventRisk/100*0.25;
  const baseBand=Math.max(validation.range_error_p80_pct/100,dailyVol*Math.sqrt(horizon)*1.28,0.003);
  const band=baseBand*newsMultiplier;
  const predicted=price*Math.exp(logChange), low=price*Math.exp(logChange-band), high=price*Math.exp(logChange+band);
  const confidence=validation.samples>=100&&validation.skill_vs_no_change_pct>=15?"higher":
    validation.samples>=60&&validation.skill_vs_no_change_pct>=8?"moderate":"low";
  validation.confidence_label=confidence;
  validation.news_risk_score=eventRisk;
  validation.news_used_for_direction=false;
  return {
    eligible:true,model_version:MODEL_VERSION,horizon_days:horizon,reference_price:price,
    predicted_price:predicted,predicted_change_pct:change*100,lower_price:low,upper_price:high,
    direction:change>0.001?"up":change< -0.001?"down":"sideways",
    model_weights:validation.weights,validation,
    uncertainty_pct:band*100,news_context:newsContext||null
  };
}


export function buildForecast(points,price,horizon,newsContext=null) {
  const base=buildForecastPoint(points,price,horizon,newsContext);
  if(horizon!==7 || !base.eligible) return base;
  const curve=[{day:0,price,lower:price,upper:price,kind:"observed"}];
  for(let day=1;day<=7;day++) {
    const step=buildForecastPoint(points,price,day,newsContext);
    if(!step.eligible) {
      curve.push({day,available:false,reason:step.reason||"insufficient_validation"});
      continue;
    }
    curve.push({
      day,
      price:Number(step.predicted_price.toFixed(4)),
      lower:Number(step.lower_price.toFixed(4)),
      upper:Number(step.upper_price.toFixed(4)),
      kind:step.forecast_mode||"adaptive_directional",
      validation_samples:step.validation?.samples??0,
      skill_vs_no_change_pct:step.validation?.skill_vs_no_change_pct??null
    });
  }
  const available=curve.filter(x=>x.available!==false).length-1;
  return {
    ...base,
    forecast_curve:curve,
    forecast_curve_meta:{
      method:"daily_walk_forward_revalidated",
      available_days:available,
      complete:available===7,
      note_fa:"هر نقطه با آزمون تاریخی افق همان روز محاسبه شده است؛ نوار بالا و پایین محدودهٔ عدم‌قطعیت بر پایهٔ خطای خارج از نمونه و نوسان تاریخی است، نه تضمین پوشش."
    }
  };
}

function headers(env,extra={}) {
  const key=env.SUPABASE_SERVICE_ROLE_KEY, base=String(env.SUPABASE_URL||"").replace(/\/+$/,"");
  if(!key||!base) throw Error("Supabase service credentials are not configured");
  return {apikey:key,authorization:"Bearer "+key,"content-type":"application/json",...extra};
}
async function db(env,path,options={}) {
  const base=String(env.SUPABASE_URL||"").replace(/\/+$/,"");
  const r=await fetch(base+"/rest/v1/"+path,{...options,headers:headers(env,options.headers),signal:AbortSignal.timeout(15000)});
  if(!r.ok) throw Error("Forecast database HTTP "+r.status+": "+(await r.text()).slice(0,240));
  if(r.status===204) return null;
  const text=await r.text(); return text?JSON.parse(text):null;
}
function headlineTokens(value) {
  const stop=new Set(["the","and","for","from","with","that","this","در","از","به","با","برای","و","را","که","این","آن","یک","های","شود","شد"]);
  return String(value||"").normalize("NFKC").toLocaleLowerCase("fa").replace(/[ي]/g,"ی").replace(/[ك]/g,"ک")
    .match(/[\p{L}\p{N}]{2,}/gu)?.filter(x=>!stop.has(x))||[];
}
export function headlineConflictCandidates(items) {
  const positive=["افزایش","رشد","صعود","بالا رفت","تقویت","increase","rise","rises","surge","gain","up"];
  const negative=["کاهش","افت","نزول","پایین آمد","تضعیف","decrease","fall","falls","drop","decline","down"];
  const pairs=[];
  for(let i=0;i<items.length;i++) for(let j=i+1;j<items.length;j++) {
    const a=items[i],b=items[j],da=String(a.domain||a.source_id||"").toLowerCase(),dbb=String(b.domain||b.source_id||"").toLowerCase();
    if(!da||!dbb||da===dbb) continue;
    const ta=headlineTokens(a.title||a.original_title),tb=headlineTokens(b.title||b.original_title);
    const A=new Set(ta),B=new Set(tb),shared=[...A].filter(x=>B.has(x));
    const similarity=shared.length/Math.max(1,new Set([...A,...B]).size);
    if(similarity<0.28||shared.length<2) continue;
    const at=String(a.title||a.original_title||"").toLocaleLowerCase(),bt=String(b.title||b.original_title||"").toLocaleLowerCase();
    const polarity=text=>({positive:positive.some(x=>text.includes(x)),negative:negative.some(x=>text.includes(x))});
    const pa=polarity(at),pb=polarity(bt);
    const na=(at.match(/\d+(?:[.,]\d+)?/g)||[]).sort().join(","),nb=(bt.match(/\d+(?:[.,]\d+)?/g)||[]).sort().join(",");
    const opposite=(pa.positive&&pb.negative)||(pa.negative&&pb.positive),numeric=Boolean(na&&nb&&na!==nb);
    if(!opposite&&!numeric) continue;
    pairs.push({headline_a:at.slice(0,240),headline_b:bt.slice(0,240),source_a:da,source_b:dbb,
      similarity:Number(similarity.toFixed(2)),signals:[...(opposite?["opposing_direction_words"]:[]),...(numeric?["different_numeric_values"]:[])],
      status:"needs_human_review",note:"هشدار الگوریتمی است؛ تناقض واقعی یا نادرستی هیچ‌یک از خبرها را اثبات نمی‌کند."});
    if(pairs.length>=12) return pairs;
  }
  return pairs;
}
async function fetchNewsContext(env,asset,asOf) {
  try {
    const since=new Date(asOf-72*60*60*1000).toISOString();
    const rows=await db(env,"market_news_items?select=url,title,original_title,domain,source_id,published_at&published_at=gte."+encodeURIComponent(since)+"&order=published_at.desc&limit=100");
    const seen=new Set();
    const items=(Array.isArray(rows)?rows:[]).filter(item=>{
      const title=String(item.title||item.original_title||"").trim();
      const published=Date.parse(item.published_at||"");
      if(!isMarketRelevantHeadline(title)||!Number.isFinite(published)||published>asOf+5*60*1000||asOf-published>72*60*60*1000) return false;
      const key=String(item.url||"").toLowerCase().replace(/[?#].*$/,"")||title.toLocaleLowerCase().replace(/\s+/g," ").trim();
      if(!key||seen.has(key)) return false;
      seen.add(key);
      return true;
    }).sort((a,b)=>Date.parse(b.published_at)-Date.parse(a.published_at));
    const riskTerms=[
      "sanction","تحریم","war","جنگ","conflict","درگیری","escalation","تشدید",
      "nuclear","هسته‌ای","negotiation","مذاکره","inflation","تورم","interest rate","نرخ بهره",
      "central bank","بانک مرکزی","oil shock","شوک نفتی","policy change","تغییر سیاست",
      "budget deficit","کسری بودجه","currency crisis","بحران ارزی","rate hike","افزایش نرخ بهره",
      "trade war","جنگ تجاری","export ban","ممنوعیت صادرات"
    ];
    let weightedRisk=0;
    for(const item of items){
      const title=String(item.title||item.original_title||"").toLocaleLowerCase();
      const hits=riskTerms.filter(term=>title.includes(term.toLocaleLowerCase())).length;
      if(!hits) continue;
      const ageHours=Math.max(0,(asOf-Date.parse(item.published_at||""))/3600000);
      weightedRisk+=Math.min(2,hits*0.55)*Math.exp(-ageHours/36);
    }
    const domains=[...new Set(items.map(x=>String(x.domain||x.source_id||"").toLowerCase()).filter(Boolean))];
    const conflicts=headlineConflictCandidates(items);
    const score=Math.max(0,Math.min(100,weightedRisk*5));
    return {
      window_hours:72,headline_count:items.length,source_count:domains.length,
      potential_conflict_count:conflicts.length,potential_conflicts:conflicts,
      event_risk_score:Number(score.toFixed(1)),
      interpretation:score>=65?"elevated":score>=30?"moderate":"limited",
      directional_use:"disabled_until_historically_validated",
      headlines:items.slice(0,8).map(x=>({
        title:String(x.title||x.original_title||"").slice(0,240),
        url:String(x.url||""),domain:String(x.domain||"unknown"),published_at:x.published_at
      }))
    };
  } catch(error) {
    return {window_hours:72,headline_count:0,source_count:0,event_risk_score:0,
      directional_use:"disabled_until_historically_validated",error:String(error?.message||error).slice(0,120)};
  }
}
async function fetchInputs(env,asset,marketPayload) {
  const market=await getMarketSnapshot(env,marketPayload);
  const item=(market.data||[]).find(x=>x.symbol===asset);
  const stamp=dateMs(item?.timestamp||market.meta?.published_at||market.meta?.timestamp), price=num(item?.price);
  if(!item||item.stale===true||!(price>0)||!Number.isFinite(stamp)||stamp>Date.now()+300000||Date.now()-stamp>24*60*60*1000) throw Error("آخرین نرخ ثبت‌شده بیش از ۲۴ ساعت قدیمی یا نامعتبر است؛ برای جلوگیری از تحلیل با قیمت کهنه، پیش‌بینی متوقف شد.");
  let points=[],historyProvider="NerkhAra";
  try { points=rowsFrom(await json((env.NERKHARA_HISTORY_URL||NERKHARA_HISTORY_URL)+encodeURIComponent(NERKHARA_IDS[asset])+".json")); } catch {}
  if(points.length<300) {
    try { const fallback=rowsFrom(await json((env.HISTORY_BASE_URL||HISTORY_URL)+encodeURIComponent(asset)+".json"));
      if(fallback.length>points.length){points=fallback;historyProvider="Iran Market Data";}
    } catch {}
  }
  if(points.length>1&&points[points.length-1].t>Date.now()+300000) throw Error("تاریخچه شامل زمان آینده است.");
  const latest=points[points.length-1];
  if(!latest||stamp-latest.t>10*DAY||latest.t>stamp+300000) throw Error("تاریخچهٔ روزانه قدیمی یا ناسازگار با زمان نرخ مرجع است.");
  const divergence=Math.abs(price/latest.p-1);
  if(divergence>0.25) throw Error("اختلاف نرخ زنده و آخرین بسته‌شدن تاریخی بیش از ۲۵٪ است؛ احتمال اختلاف واحد یا منبع وجود دارد.");
  const newsContext=await fetchNewsContext(env,asset,stamp);
  return {price,stamp,source:String(item.source||"unknown"),provider_meta:item.provider_meta||null,history_provider:historyProvider,points,newsContext};
}

async function liveBiasCalibration(env,asset,horizon) {
  try {
    const rows=await db(env,"market_forecast_runs?select=predicted_price,actual_price,actual_at&asset=eq."+encodeURIComponent(asset)+"&horizon_days=eq."+horizon+"&status=eq.evaluated&actual_price=not.is.null&validation->>forecast_mode=eq.adaptive_directional&model_version=eq."+encodeURIComponent(MODEL_VERSION)+"&order=actual_at.desc&limit=60");
    const valid=(Array.isArray(rows)?rows:[]).filter(x=>Number(x.predicted_price)>0&&Number(x.actual_price)>0);
    if(valid.length<30) return {samples:valid.length,applied:false,log_bias:0};
    const errors=valid.map(x=>Math.log(Number(x.actual_price)/Number(x.predicted_price)));
    const mean=errors.reduce((a,b)=>a+b,0)/errors.length,shrink=Math.min(0.5,valid.length/60);
    const adjustment=Math.max(-0.015,Math.min(0.015,mean*shrink));
    return {samples:valid.length,applied:true,log_bias:Number(mean.toFixed(6)),adjustment_log:Number(adjustment.toFixed(6))};
  } catch(error) { return {samples:0,applied:false,log_bias:0,error:String(error?.message||error).slice(0,100)}; }
}
async function issueForecast(env,asset,horizon,input) {
  const issuedAt=new Date().toISOString();
  // The horizon starts when the forecast is issued; stale quotes are rejected in fetchInputs.
  const targetAt=new Date(Date.parse(issuedAt)+horizon*DAY).toISOString();
  const result=buildForecast(input.points,input.price,horizon,input.newsContext);
  if(!result.eligible) return {
    asset,horizon_days:horizon,model_version:MODEL_VERSION,status:"withheld",
    reason:result.reason,validation:result,observations:input.points.length,
    news_context:input.newsContext
  };
  const quoteAgeHours=Math.max(0,(Date.parse(issuedAt)-input.stamp)/3600000);
  const calibration=result.forecast_mode==="baseline_only"?{samples:0,applied:false,log_bias:0,reason:"baseline-only forecasts are not directionally adjusted"}:await liveBiasCalibration(env,asset,horizon);
  if(calibration.applied) {
    const shift=calibration.adjustment_log;
    result.predicted_price*=Math.exp(shift);result.lower_price*=Math.exp(shift);result.upper_price*=Math.exp(shift);
    result.predicted_change_pct=(result.predicted_price/input.price-1)*100;
    result.direction=result.predicted_change_pct>0.1?"up":result.predicted_change_pct< -0.1?"down":"sideways";
  }
  const validation={...result.validation,forecast_mode:result.forecast_mode||"adaptive_directional",live_error_feedback:calibration,quote_quality:input.provider_meta?{provider:input.provider_meta.provider||"unknown",method:input.provider_meta.method||null,source_count:input.provider_meta.source_count??null,spread_pct:input.provider_meta.spread_pct??null,unit:input.provider_meta.unit||null}:null,history_provider:input.history_provider||"unknown",quote_age_hours:Number(quoteAgeHours.toFixed(2)),reference_quote_stale:quoteAgeHours>24,news_context:{
    event_risk_score:input.newsContext?.event_risk_score??0,
    headline_count:input.newsContext?.headline_count??0,
    source_count:input.newsContext?.source_count??0,
    directional_use:"disabled_until_historically_validated"
  }};
  const payload={
    asset,horizon_days:horizon,model_version:MODEL_VERSION,issued_at:issuedAt,target_at:targetAt,
    status:"pending",reference_price:input.price,
    quote_source:input.source,
    quote_observed_at:new Date(input.stamp).toISOString(),
    predicted_price:result.predicted_price,predicted_change_pct:result.predicted_change_pct,
    lower_price:result.lower_price,upper_price:result.upper_price,direction:result.direction,
    model_weights:result.model_weights,validation,
    input_fingerprint:input.stamp+":"+input.points.length+":"+input.points[input.points.length-1].t
  };
  const recent=await db(env,"market_forecast_runs?select=id&asset=eq."+encodeURIComponent(asset)+"&horizon_days=eq."+horizon+"&status=in.(pending,evaluated)&issued_at=gte."+encodeURIComponent(new Date(Date.now()-6*3600000).toISOString())+"&limit=1");
  if(!recent?.length) await db(env,"market_forecast_runs",{method:"POST",headers:{"prefer":"return=minimal"},body:JSON.stringify(payload)});
  return {
    asset,asset_fa:asset,horizon_days:horizon,status:"issued",
    forecast_mode:result.forecast_mode||"adaptive_directional",
    issued_at:issuedAt,target_at:targetAt,reference_price:input.price,
    predicted_price:Math.round(result.predicted_price),
    predicted_change_pct:Number(result.predicted_change_pct.toFixed(3)),
    range:{low:Math.round(result.lower_price),high:Math.round(result.upper_price)},
    direction:result.direction,validation,news_context:input.newsContext,
    forecast_curve:result.forecast_curve||null,
    forecast_curve_meta:result.forecast_curve_meta||null,
    model_version:MODEL_VERSION,source:input.source,provider_meta:input.provider_meta,history_provider:input.history_provider
  };
}

async function evaluateDue(env,market) {
  const items=market.data||[], done=[];
  for(const asset of ASSETS){
    const item=items.find(x=>x.symbol===asset), actual=num(item?.price), stamp=dateMs(item?.timestamp||market.meta?.published_at||market.meta?.timestamp);
    if(!(actual>0)||!Number.isFinite(stamp)||Date.now()-stamp>45*60000) continue;
    const due=await db(env,"market_forecast_runs?select=id,asset,horizon_days,reference_price,predicted_price,predicted_change_pct,target_at&asset=eq."+asset+"&status=eq.pending&target_at=lte."+encodeURIComponent(new Date(stamp).toISOString())+"&limit=100");
    for(const f of due||[]){
      const actualChange=(actual/Number(f.reference_price)-1)*100;
      const error=Math.abs((actual/Number(f.predicted_price)-1)*100);
      const sign=x=>x>0.1?"up":x< -0.1?"down":"sideways";
      const patch={status:"evaluated",actual_price:actual,actual_at:new Date(stamp).toISOString(),absolute_error_pct:Number(error.toFixed(5)),
        direction_correct:sign(actualChange)===f.direction};
      await db(env,"market_forecast_runs?id=eq."+f.id,{method:"PATCH",headers:{"prefer":"return=minimal"},body:JSON.stringify(patch)});
      done.push({id:f.id,asset,horizon_days:f.horizon_days,error_pct:patch.absolute_error_pct,direction_correct:patch.direction_correct});
    }
  }
  return done;
}
async function runContinuousLearning(env, evaluatedNow) {
  if (!evaluatedNow?.length) return {ran:false,reason:"no-new-evaluations"};
  try {
    const rows = await db(env,"market_forecast_runs?select=asset,horizon_days,predicted_price,reference_price,actual_price,direction_correct,validation,actual_at&status=eq.evaluated&actual_price=not.is.null&order=actual_at.desc&limit=1500");
    const groups = new Map();
    for (const row of (Array.isArray(rows)?rows:[])) {
      const key = row.asset + ":" + row.horizon_days;
      if (!groups.has(key)) groups.set(key,[]);
      const group=groups.get(key);
      if (group.length<60 && Number(row.predicted_price)>0 && Number(row.reference_price)>0 && Number(row.actual_price)>0) group.push(row);
    }
    const assetMetrics={}, actions=[];
    for (const [key,sample] of groups) {
      if (!sample.length) continue;
      const errors=sample.map(r=>Math.abs((Number(r.actual_price)/Number(r.predicted_price)-1)*100));
      const baseline=sample.map(r=>Math.abs((Number(r.actual_price)/Number(r.reference_price)-1)*100));
      const mae=errors.reduce((a,b)=>a+b,0)/errors.length;
      const baselineMae=baseline.reduce((a,b)=>a+b,0)/baseline.length;
      const skill=baselineMae>0?(1-mae/baselineMae)*100:0;
      const directional=sample.filter(r=>typeof r.direction_correct==="boolean");
      const accuracy=directional.length?directional.filter(r=>r.direction_correct).length/directional.length*100:null;
      const recent=errors.slice(0,20), older=errors.slice(20);
      const recentMae=recent.length?recent.reduce((a,b)=>a+b,0)/recent.length:null;
      const olderMae=older.length?older.reduce((a,b)=>a+b,0)/older.length:null;
      const drift=recentMae!==null&&olderMae!==null&&olderMae>0&&recentMae>olderMae*1.5;
      const [asset,horizonText]=key.split(":");
      assetMetrics[key]={
        samples:sample.length,mae_pct:Number(mae.toFixed(5)),
        no_change_mae_pct:Number(baselineMae.toFixed(5)),
        skill_vs_no_change_pct:Number(skill.toFixed(3)),
        directional_accuracy_pct:accuracy===null?null:Number(accuracy.toFixed(2)),
        directional_samples:directional.length,
        recent_20_mae_pct:recentMae===null?null:Number(recentMae.toFixed(5)),
        previous_40_mae_pct:olderMae===null?null:Number(olderMae.toFixed(5)),
        performance_drift:drift
      };
      if(sample.length>=30 && skill>=2) actions.push({asset,horizon_days:Number(horizonText),action:"retain_validated_model",reason:"rolling live MAE beats no-change baseline",skill_pct:Number(skill.toFixed(3))});
      else if(sample.length>=30) actions.push({asset,horizon_days:Number(horizonText),action:"keep_directional_signal_withheld",reason:"live model has not beaten no-change baseline by the 2% safety margin",skill_pct:Number(skill.toFixed(3))});
      if(drift) actions.push({asset,horizon_days:Number(horizonText),action:"performance_drift_warning",reason:"recent 20 forecasts have >1.5x MAE of previous sample"});
    }
    const payload={
      model_version:MODEL_VERSION,evaluated_count:evaluatedNow.length,
      asset_metrics:assetMetrics,learning_actions:actions
    };
    await db(env,"market_learning_cycles",{method:"POST",headers:{"prefer":"return=minimal"},body:JSON.stringify({
      model_version:MODEL_VERSION,evaluated_count:evaluatedNow.length,
      asset_metrics:assetMetrics,learning_actions:actions
    })});
    return {ran:true,evaluated:evaluatedNow.length,groups:Object.keys(assetMetrics).length,actions:actions.length};
  } catch(error) {
    console.error("Continuous learning cycle failed:",error?.message||error);
    return {ran:false,error:String(error?.message||error).slice(0,180)};
  }
}
export async function runForecastCycle(env,marketPayload) {
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY) return {enabled:false,reason:"database-not-configured"};
  const market=await getMarketSnapshot(env,marketPayload);
  const evaluated=await evaluateDue(env,market);
  const learning=await runContinuousLearning(env,evaluated);
  const issued=[],withheld=[];
  for(const asset of ASSETS){
    try{
      const since=new Date(Date.now()-6*3600000).toISOString();
      const recent=await db(env,"market_forecast_runs?select=horizon_days&asset=eq."+asset+"&status=in.(pending,evaluated)&issued_at=gte."+encodeURIComponent(since)+"&limit=10");
      const existing=new Set((recent||[]).map(x=>Number(x.horizon_days)));
      const missing=HORIZONS.filter(h=>!existing.has(h));
      if(!missing.length) continue;
      const input=await fetchInputs(env,asset,market);
      for(const horizon of missing){
        const result=await issueForecast(env,asset,horizon,input);
        if(result?.status==="issued") issued.push(result);
        else if(result?.status==="withheld") withheld.push({asset,horizon_days:horizon,reason:result.reason});
      }
    }catch(error){const reason=String(error?.message||error).slice(0,180);withheld.push({asset,reason});console.log("Forecast cycle skipped",asset,reason);}
  }
  console.log("Forecast cycle completed: published",issued.length,"withheld",withheld.length,"evaluated",evaluated.length);
  return {enabled:true,issued:issued.length,withheld:withheld.length,evaluated:evaluated.length,
    withheld_reasons:withheld.slice(0,8),learning};
}
export async function handleForecastApi(url,env) {
  const asset=url.searchParams.get("asset")||"USD_IRR_FREE";
  if(!ASSETS.has(asset)) return Response.json({error:"دارایی برای موتور پیش‌بینی تأیید نشده است."},{status:400});
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY) return Response.json({error:"پایگاه داده پیش‌بینی پیکربندی نشده است."},{status:503});
  try{
    if(url.pathname==="/forecast/performance"){
      const horizon=Number(url.searchParams.get("horizon_days")||7);
      if(!HORIZONS.includes(horizon)) return Response.json({error:"افق باید ۱، ۳ یا ۷ روز باشد."},{status:400});
      const [data,input]=await Promise.all([
        db(env,"market_forecast_runs?select=horizon_days,absolute_error_pct,direction_correct,status,actual_at&asset=eq."+asset+"&horizon_days=eq."+horizon+"&status=eq.evaluated&order=actual_at.desc&limit=500"),
        fetchInputs(env,asset)
      ]);
      const rows=Array.isArray(data)?data:[];
      const errors=rows.map(x=>Number(x.absolute_error_pct)).filter(Number.isFinite);
      const directional=rows.filter(x=>typeof x.direction_correct==="boolean");
      const validation=backtest(input.points,horizon);
      return Response.json({
        asset,model_version:MODEL_VERSION,horizon_days:horizon,
        evaluated_forecasts:rows.length,
        live_ledger:{
          samples:rows.length,
          mean_absolute_error_pct:errors.length?Number((errors.reduce((a,b)=>a+b,0)/errors.length).toFixed(4)):null,
          within_2pct_pct:errors.length?Number((errors.filter(x=>x<=2).length/errors.length*100).toFixed(1)):null,
          within_5pct_pct:errors.length?Number((errors.filter(x=>x<=5).length/errors.length*100).toFixed(1)):null,
          directional_accuracy_pct:directional.length?Number((directional.filter(x=>x.direction_correct).length/directional.length*100).toFixed(1)):null,
          directional_samples:directional.length
        },
        walk_forward_backtest:validation,
        news_context:input.newsContext,
        note_fa:"آزمون walk-forward از داده‌های تاریخی استفاده می‌کند؛ دفتر زنده فقط پیش‌بینی‌هایی را می‌شمارد که موعدشان رسیده و با قیمت واقعی ارزیابی شده‌اند."
      },{headers:{"cache-control":"no-store"}});
    }
    if(url.pathname==="/forecast/learning"){
      const data=await db(env,"market_learning_cycles?select=cycle_at,model_version,evaluated_count,asset_metrics,learning_actions&order=cycle_at.desc&limit=100");
      return Response.json({model_version:MODEL_VERSION,cycles:data||[],note_fa:"وزن‌های مدل با آزمون walk-forward و فقط با داده‌های بالغ‌شده دوباره محاسبه می‌شوند؛ این گزارش، عملکرد زنده و هشدار افت کیفیت را ثبت می‌کند."},{headers:{"cache-control":"no-store"}});
    }
    if(url.pathname==="/forecast/history"){
      const horizon=Number(url.searchParams.get("horizon_days")||7);
      if(!HORIZONS.includes(horizon)) return Response.json({error:"افق باید ۱، ۳ یا ۷ روز باشد."},{status:400});
      const requestedLimit=Number(url.searchParams.get("limit")||500);
      if(!Number.isInteger(requestedLimit)||requestedLimit<1||requestedLimit>500) return Response.json({error:"limit باید عددی بین ۱ تا ۵۰۰ باشد."},{status:400});
      const query=new URLSearchParams({
        select:"id,asset,horizon_days,model_version,issued_at,target_at,reference_price,quote_source,quote_observed_at,predicted_price,predicted_change_pct,lower_price,upper_price,direction,model_weights,status,actual_price,actual_at,absolute_error_pct,direction_correct,validation",
        asset:"eq."+asset,
        horizon_days:"eq."+horizon,
        order:"issued_at.desc",
        limit:String(requestedLimit)
      });
      const data=await db(env,"market_forecast_runs?"+query.toString());
      return Response.json({
        asset,horizon_days:horizon,forecasts:data||[],
        ledger_meta:{returned_rows:Array.isArray(data)?data.length:0,limit:requestedLimit,active_model_version:MODEL_VERSION,generated_at:new Date().toISOString(),truncated:Array.isArray(data)&&data.length===requestedLimit}
      },{headers:{"cache-control":"no-store"}});
    }
    const horizon=Number(url.searchParams.get("horizon_days")||7);
    if(!HORIZONS.includes(horizon)) return Response.json({error:"افق باید ۱، ۳ یا ۷ روز باشد."},{status:400});
    const input=await fetchInputs(env,asset);
    const forecast=await issueForecast(env,asset,horizon,input);
    return Response.json({asset,forecast,generated_at:new Date().toISOString(),note_fa:"این خروجی آماری و آزمایش‌محور است؛ هیچ تضمین یا توصیه خریدوفروش نیست."},{headers:{"cache-control":"no-store"}});
  }catch(error){return Response.json({error:"پیش‌بینی قابل انتشار نیست.",detail:String(error?.message||error).slice(0,240)},{status:424});}
}
