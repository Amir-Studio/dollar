const MARKET_URL = "https://raw.githubusercontent.com/iran-market/iran-market.github.io/main/data/popular.json";
const HISTORY_URL = "https://raw.githubusercontent.com/iran-market/iran-market.github.io/main/data/history/";
const MODEL_VERSION = "iran-ensemble-wf-1.0";
const ASSETS = new Set(["USD_IRR_FREE","EUR_IRR_FREE","GOLD_18K_IRR","COIN_EMAMI_IRR"]);
const HORIZONS = [1,3,7];
const DAY = 86400000;

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
function rowsFrom(payload) {
  const raw=Array.isArray(payload)?payload:Array.isArray(payload?.data)?payload.data:Array.isArray(payload?.history)?payload.history:[];
  const sorted=raw.map(r=>({t:dateMs(r.date??r.datetime??r.timestamp??r.time??r.date_gregorian??r.t),p:num(r.close??r.c??r.price??r.value??r.last??r.close_price)}))
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
function regression(points) {
  const p=points.slice(-45), x0=p[0].t/DAY, xs=p.map(r=>r.t/DAY-x0), ys=p.map(r=>Math.log(r.p));
  const xm=xs.reduce((a,b)=>a+b,0)/xs.length, ym=ys.reduce((a,b)=>a+b,0)/ys.length;
  let cov=0,vx=0;
  for(let i=0;i<xs.length;i++){cov+=(xs[i]-xm)*(ys[i]-ym);vx+=(xs[i]-xm)**2;}
  const slope=vx?cov/vx:0, intercept=ym-slope*xm;
  const residual=ys.map((v,i)=>v-(intercept+slope*xs[i]));
  const sigma=Math.sqrt(residual.reduce((s,v)=>s+v*v,0)/Math.max(1,residual.length-2));
  return {slope,intercept,x0,sigma,trendNow:intercept+slope*xs[xs.length-1]};
}
function candidates(points,h) {
  const p=points.slice(-45), lr=[];
  for(let i=1;i<p.length;i++){
    const days=(p[i].t-p[i-1].t)/DAY;
    if(days>0) lr.push(Math.log(p[i].p/p[i-1].p)/days);
  }
  const recent=lr.slice(-20), drift=median(recent);
  const reg=regression(p);
  const avg=(a)=>a.length?a.reduce((s,v)=>s+v,0)/a.length:drift;
  const mom=0.55*avg(lr.slice(-3))+0.30*avg(lr.slice(-7))+0.15*avg(lr.slice(-14));
  const deviation=Math.log(p[p.length-1].p)-reg.trendNow;
  const revert=reg.slope*h-deviation*(1-Math.exp(-h/14));
  const raw={drift:drift*h,trend:reg.slope*h,momentum:mom*h,reversion:revert};
  const dailyVol=Math.sqrt(lr.slice(-20).reduce((s,v)=>s+(v-drift)**2,0)/Math.max(1,Math.min(20,lr.length)-1));
  const cap=Math.min(0.30,Math.max(0.025,4*dailyVol*Math.sqrt(h)));
  for(const k of Object.keys(raw)) raw[k]=Math.max(-cap,Math.min(cap,raw[k]));
  return {raw,dailyVol};
}
function backtest(points,h) {
  const start=Math.max(18,points.length-100), records=[];
  for(let i=start;i<points.length-1;i++){
    const origin=points[i], targetTime=origin.t+h*DAY;
    let j=i+1; while(j<points.length&&points[j].t<targetTime) j++;
    if(j>=points.length) continue;
    const actual=Math.log(points[j].p/origin.p);
    const pred=candidates(points.slice(0,i+1),h).raw;
    records.push({actual,pred,baselineError:Math.abs((1-Math.exp(actual))*100)});
  }
  const n=records.length;
  if(n<10) return {eligible:false,samples:n,reason:"برای اعتبارسنجی خارج از نمونه، تاریخچه کافی نیست."};
  const keys=["drift","trend","momentum","reversion"];
  const candidateMae=Object.fromEntries(keys.map(k=>[k,records.reduce((s,r)=>s+Math.abs((Math.exp(r.pred[k])-Math.exp(r.actual))*100),0)/n]));
  const weightsFor=sample=>{
    const errors=Object.fromEntries(keys.map(k=>[k,sample.reduce((s,r)=>s+Math.abs((Math.exp(r.pred[k])-Math.exp(r.actual))*100),0)/Math.max(1,sample.length)]));
    const inv=Object.fromEntries(keys.map(k=>[k,1/Math.max(0.03,errors[k])**2]));
    const total=Object.values(inv).reduce((a,b)=>a+b,0);
    return Object.fromEntries(keys.map(k=>[k,inv[k]/total]));
  };
  const ensembleErrors=[], baselineErrors=records.map(r=>r.baselineError);
  let hits=0,directionalN=0;
  for(let i=0;i<n;i++){
    // Strict walk-forward: weights use only outcomes that were already known before this origin.
    const prior=records.slice(0,i);
    const weights=prior.length>=8?weightsFor(prior):Object.fromEntries(keys.map(k=>[k,1/keys.length]));
    const blend=keys.reduce((s,k)=>s+weights[k]*records[i].pred[k],0);
    const actual=records[i].actual;
    ensembleErrors.push(Math.abs((Math.exp(blend)-Math.exp(actual))*100));
    const actualPct=Math.exp(actual)-1, forecastPct=Math.exp(blend)-1;
    if(Math.abs(actualPct)>0.001){directionalN++;if(Math.sign(actualPct)===Math.sign(forecastPct))hits++;}
  }
  const ensembleMae=ensembleErrors.reduce((s,v)=>s+v,0)/n;
  const baselineMae=baselineErrors.reduce((s,v)=>s+v,0)/n;
  const liveWeights=weightsFor(records);
  const beatsNaive=ensembleMae<baselineMae*0.98;
  return {eligible:beatsNaive,samples:n,mae_pct:Number(ensembleMae.toFixed(4)),naive_mae_pct:Number(baselineMae.toFixed(4)),
    directional_accuracy_pct:directionalN?Number((hits/directionalN*100).toFixed(1)):null,directional_samples:directionalN,
    candidate_mae_pct:Object.fromEntries(Object.entries(candidateMae).map(([k,v])=>[k,Number(v.toFixed(4))])),
    weights:liveWeights,range_error_p80_pct:Number((quantile(ensembleErrors,0.8)??0).toFixed(4)),
    reason:beatsNaive?null:"در آزمون walk-forward، مدل هنوز از پیش‌بینی سادهٔ بدون تغییر بهتر نیست."};
}
export function buildForecast(points,price,horizon) {
  const min={1:25,3:35,7:45}[horizon]||45;
  if(points.length<min) return {eligible:false,reason:"تاریخچه برای این افق کافی نیست.",observations:points.length,required:min};
  const validation=backtest(points,horizon);
  if(!validation.eligible) return {...validation,observations:points.length};
  const {raw,dailyVol}=candidates(points,horizon);
  const logChange=Object.keys(validation.weights).reduce((s,k)=>s+validation.weights[k]*raw[k],0);
  const change=Math.exp(logChange)-1;
  const band=Math.max(validation.range_error_p80_pct/100,dailyVol*Math.sqrt(horizon)*1.28,0.003);
  const predicted=price*(1+change), low=price*Math.exp(logChange-band), high=price*Math.exp(logChange+band);
  const confidence=validation.samples>=40&&validation.mae_pct<validation.naive_mae_pct*0.8?"higher":validation.samples>=20?"moderate":"low";
  return {eligible:true,model_version:MODEL_VERSION,horizon_days:horizon,reference_price:price,predicted_price:predicted,
    predicted_change_pct:change*100,lower_price:low,upper_price:high,
    direction:change>0.001?"up":change< -0.001?"down":"sideways",
    model_weights:validation.weights,validation:{...validation,confidence_label:confidence},
    uncertainty_pct:band*100};
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
async function fetchInputs(env,asset,marketPayload) {
  const market=marketPayload||await json(env.MARKET_DATA_URL||MARKET_URL);
  const item=(market.data||[]).find(x=>x.symbol===asset);
  const stamp=dateMs(item?.timestamp||market.meta?.published_at||market.meta?.timestamp), price=num(item?.price);
  if(!item||!(price>0)||!Number.isFinite(stamp)||stamp>Date.now()+300000||Date.now()-stamp>45*60000) throw Error("قیمت منبع تازه و معتبر نیست.");
  const history=await json((env.HISTORY_BASE_URL||HISTORY_URL)+encodeURIComponent(asset)+".json");
  const points=rowsFrom(history);
  if(points.length>1&&points[points.length-1].t>Date.now()+300000) throw Error("تاریخچه شامل زمان آینده است.");
  return {price,stamp,source:String(item.source||"unknown"),points};
}
async function issueForecast(env,asset,horizon,input) {
  const issuedAt=new Date().toISOString(), targetAt=new Date(input.stamp+horizon*DAY).toISOString();
  const result=buildForecast(input.points,input.price,horizon);
  if(!result.eligible) return {asset,horizon_days:horizon,model_version:MODEL_VERSION,status:"withheld",reason:result.reason,validation:result,observations:input.points.length};
  const payload={asset,horizon_days:horizon,model_version:MODEL_VERSION,issued_at:issuedAt,target_at:targetAt,
    reference_price:input.price,quote_source:"Iran Market Data / "+input.source,quote_observed_at:new Date(input.stamp).toISOString(),predicted_price:result.predicted_price,predicted_change_pct:result.predicted_change_pct,
    lower_price:result.lower_price,upper_price:result.upper_price,direction:result.direction,
    model_weights:result.model_weights,validation:result.validation,input_fingerprint:input.stamp+":"+input.points.length+":"+input.points[input.points.length-1].t};
  const recent=await db(env,"market_forecast_runs?select=id&asset=eq."+encodeURIComponent(asset)+"&horizon_days=eq."+horizon+"&issued_at=gte."+encodeURIComponent(new Date(Date.now()-6*3600000).toISOString())+"&limit=1");
  if(!recent?.length) await db(env,"market_forecast_runs",{method:"POST",headers:{"prefer":"return=minimal"},body:JSON.stringify(payload)});
  return {asset,asset_fa:asset,horizon_days:horizon,status:"issued",issued_at:issuedAt,target_at:targetAt,
    reference_price:input.price,predicted_price:Math.round(result.predicted_price),predicted_change_pct:Number(result.predicted_change_pct.toFixed(3)),
    range:{low:Math.round(result.lower_price),high:Math.round(result.upper_price)},direction:result.direction,
    validation:result.validation,model_version:MODEL_VERSION,source:"Iran Market Data / "+input.source};
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
export async function runForecastCycle(env,marketPayload) {
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY) return {enabled:false,reason:"database-not-configured"};
  const market=marketPayload||await json(env.MARKET_DATA_URL||MARKET_URL);
  const evaluated=await evaluateDue(env,market);
  const issued=[];
  for(const asset of ASSETS){
    try{
      const since=new Date(Date.now()-6*3600000).toISOString();
      const recent=await db(env,"market_forecast_runs?select=horizon_days&asset=eq."+asset+"&issued_at=gte."+encodeURIComponent(since)+"&limit=10");
      const existing=new Set((recent||[]).map(x=>Number(x.horizon_days)));
      const missing=HORIZONS.filter(h=>!existing.has(h));
      if(!missing.length) continue;
      const input=await fetchInputs(env,asset,market);
      for(const horizon of missing) issued.push(await issueForecast(env,asset,horizon,input));
    }catch(error){console.log("Forecast cycle skipped",asset,error?.message||error);}
  }
  return {enabled:true,issued:issued.length,evaluated:evaluated.length};
}
export async function handleForecastApi(url,env) {
  const asset=url.searchParams.get("asset")||"USD_IRR_FREE";
  if(!ASSETS.has(asset)) return Response.json({error:"دارایی برای موتور پیش‌بینی تأیید نشده است."},{status:400});
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY) return Response.json({error:"پایگاه داده پیش‌بینی پیکربندی نشده است."},{status:503});
  try{
    if(url.pathname==="/forecast/performance"){
      const data=await db(env,"market_forecast_runs?select=horizon_days,absolute_error_pct,direction_correct,status,actual_at&asset=eq."+asset+"&status=eq.evaluated&order=actual_at.desc&limit=500");
      const grouped={};
      for(const row of data||[]){
        const key=String(row.horizon_days);
        (grouped[key] ||= []).push(row);
      }
      const metrics=Object.fromEntries(Object.entries(grouped).map(([h,items])=>{
        const errors=items.map(x=>Number(x.absolute_error_pct)).filter(Number.isFinite);
        const directional=items.filter(x=>typeof x.direction_correct==="boolean");
        return [h,{samples:items.length,mean_absolute_error_pct:errors.length?Number((errors.reduce((a,b)=>a+b,0)/errors.length).toFixed(4)):null,
          directional_accuracy_pct:directional.length?Number((directional.filter(x=>x.direction_correct).length/directional.length*100).toFixed(1)):null,
          directional_samples:directional.length}];
      }));
      return Response.json({asset,model_version:MODEL_VERSION,evaluated_forecasts:(data||[]).length,by_horizon_days:metrics,
        note_fa:"این معیارها فقط از پیش‌بینی‌های ثبت‌شده و ارزیابی‌شده محاسبه می‌شوند؛ با افزایش نمونه‌ها پایدارتر خواهند شد."},{headers:{"cache-control":"no-store"}});
    }
    if(url.pathname==="/forecast/history"){
      const horizon=Math.max(1,Math.min(7,Number(url.searchParams.get("horizon_days")||7)));
      const data=await db(env,"market_forecast_runs?select=asset,horizon_days,model_version,issued_at,target_at,reference_price,quote_source,quote_observed_at,predicted_price,predicted_change_pct,lower_price,upper_price,direction,status,actual_price,actual_at,absolute_error_pct,direction_correct,validation&asset=eq."+asset+"&horizon_days=eq."+horizon+"&order=issued_at.desc&limit=30");
      return Response.json({asset,horizon_days:horizon,forecasts:data||[]},{headers:{"cache-control":"no-store"}});
    }
    const horizon=Number(url.searchParams.get("horizon_days")||7);
    if(!HORIZONS.includes(horizon)) return Response.json({error:"افق باید ۱، ۳ یا ۷ روز باشد."},{status:400});
    const input=await fetchInputs(env,asset);
    const forecast=await issueForecast(env,asset,horizon,input);
    return Response.json({asset,forecast,generated_at:new Date().toISOString(),note_fa:"این خروجی آماری و آزمایش‌محور است؛ هیچ تضمین یا توصیه خریدوفروش نیست."},{headers:{"cache-control":"no-store"}});
  }catch(error){return Response.json({error:"پیش‌بینی قابل انتشار نیست.",detail:String(error?.message||error).slice(0,240)},{status:424});}
}
