(()=>{'use strict';
const $=id=>document.getElementById(id);
const API='https://raw.githubusercontent.com/iran-market/iran-market.github.io/main/data/popular.json';
const SYMBOLS={usd:'USD_IRR_FREE',eur:'EUR_IRR_FREE',gbp:'GBP_IRR_FREE',gold:'GOLD_18K_IRR',coin:'COIN_EMAMI_IRR',usdt:'USDT_IRR'};
const CURRENCIES=[
 {symbol:'USD_IRR_FREE',code:'USD',fa:'دلار آمریکا',en:'US dollar',ticker:'usdPrice',move:'usdMove',fresh:'usdFresh'},
 {symbol:'EUR_IRR_FREE',code:'EUR',fa:'یورو',en:'Euro',ticker:'eurPrice',move:'eurMove',fresh:'eurFresh'},
 {symbol:'GBP_IRR_FREE',code:'GBP',fa:'پوند انگلیس',en:'British pound',ticker:'gbpPrice',move:'gbpMove',fresh:'gbpFresh'},
 {symbol:'USDT_IRR',code:'USDT',fa:'تتر',en:'Tether · دارایی دیجیتال',ticker:'usdtPrice',move:'usdtMove',fresh:'usdtFresh',digital:true}
];
let market=new Map(),language='fa',lastPayload=null;
const number=(n,d=0)=>Number.isFinite(Number(n))?new Intl.NumberFormat(language==='fa'?'fa-IR':'en-US',{maximumFractionDigits:d}).format(Number(n)):'—';
const toman=n=>Number.isFinite(Number(n))?number(Number(n))+(language==='fa'?' تومان':' toman'):'—';
const getItem=id=>market.get(id)||null;
const setText=(id,value)=>{const el=$(id);if(el)el.textContent=value};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function ageMinutes(t){const n=Date.parse(t);return Number.isFinite(n)?Math.max(0,(Date.now()-n)/60000):Infinity}
function stamp(item){return item?.timestamp_jalali|| (item?.timestamp?new Date(item.timestamp).toLocaleString(language==='fa'?'fa-IR':'en-GB',{timeZone:'Asia/Tehran'}):'—')}
function staleItem(item){return !item||item.stale===true||ageMinutes(item.timestamp)>45}
function change(item){if(!item||!Number.isFinite(Number(item.change_pct)))return '—';const n=Number(item.change_pct);return (n>0?'+':'')+number(n,2)+'%'}
function setMove(id,item){const el=$(id);if(!el)return;el.textContent=change(item);el.classList.toggle('down',Number(item?.change_pct)<0);el.classList.toggle('up',Number(item?.change_pct)>0)}
function renderTable(items){
 const body=$('fxTableBody');if(!body)return;
 const query=($('fxSearch')?.value||'').trim().toLocaleLowerCase();
 const filtered=items.filter(item=>{const c=CURRENCIES.find(x=>x.symbol===item.symbol);return c&&[c.code,c.fa,c.en,item.symbol].some(v=>v.toLocaleLowerCase().includes(query))});
 if(!filtered.length){body.innerHTML='<tr><td colspan="6" class="table-empty">ارزی مطابق جست‌وجو پیدا نشد.</td></tr>';return}
 body.innerHTML=filtered.map(item=>{
  const c=CURRENCIES.find(x=>x.symbol===item.symbol),old=staleItem(item),pct=Number(item.change_pct),moveClass=pct<0?'down':pct>0?'up':'';
  return '<tr><td><div class="currency-name"><span class="currency-code">'+c.code+'</span><span><strong>'+esc(language==='fa'?c.fa:c.en)+'</strong><small>'+(c.digital?'دارایی دیجیتال · بازار ایران':'بازار آزاد ایران')+'</small></span></div></td><td class="rate-cell">'+esc(toman(Number(item.price)))+'</td><td><span class="table-change '+moveClass+'">'+esc(change(item))+'</span></td><td>'+esc(toman(Number(item.high)))+'</td><td>'+esc(toman(Number(item.low)))+'</td><td><span class="time-cell">'+esc(stamp(item))+'</span><small class="row-state '+(old?'stale':'fresh')+'">'+(old?'قدیمی / با احتیاط':'تازه')+'</small></td></tr>';
 }).join('');
}
function render(payload){
 const rows=Array.isArray(payload.data)?payload.data:[];market=new Map(rows.map(x=>[x.symbol,x]));lastPayload=payload;
 const currencyItems=CURRENCIES.map(c=>getItem(c.symbol)).filter(Boolean);
 CURRENCIES.forEach(c=>{const item=getItem(c.symbol);setText(c.ticker,item?toman(Number(item.price)):'ناموجود');setMove(c.move,item);setText(c.fresh,item?(staleItem(item)?'داده قدیمی':'داده تازه'):'ناموجود')});
 const usd=getItem(SYMBOLS.usd),eur=getItem(SYMBOLS.eur),gbp=getItem(SYMBOLS.gbp),gold=getItem(SYMBOLS.gold),coin=getItem(SYMBOLS.coin),usdt=getItem(SYMBOLS.usdt);
 setMove('goldMove',gold);setText('goldFresh',gold?(staleItem(gold)?'داده قدیمی':'نرخ مرجع'):'ناموجود');
 setText('watchGold',gold?toman(Number(gold.price)):'ناموجود');setText('watchEur',eur?toman(Number(eur.price)):'ناموجود');setText('watchGbp',gbp?toman(Number(gbp.price)):'ناموجود');setText('watchJpy',usdt?toman(Number(usdt.price)):'ناموجود');
 setMove('watchUsdMove',usd);setMove('watchEurMove',eur);setMove('watchGbpMove',gbp);setMove('watchUsdtMove',usdt);
 const newest=currencyItems.map(x=>x.timestamp).filter(Boolean).sort().at(-1)||payload.meta?.updated_at;
 const observed=currencyItems.map(x=>x.timestamp).filter(Boolean).sort().at(-1),latest=currencyItems.find(x=>x.timestamp===observed);
 const time=stamp(latest),stale=Boolean(payload.meta?.stale)||currencyItems.some(staleItem)||ageMinutes(newest)>45;
 setText('updatedTop',(language==='fa'?'آخرین مشاهده: ':'Observed: ')+time);
 setText('sourceDetails','منبع: TGJU از طریق Iran Market Data · آخرین مشاهده: '+time+' · واحد: تومان');
 setText('sourceStatusBig',stale?'داده قدیمی؛ با احتیاط':'داده بازار دریافت شد');
 setText('topStatus',stale?'هشدار: نرخ‌ها قدیمی‌اند':'نرخ‌های بازار دریافت شد');
 setText('footerUpdate',stale?'داده قدیمی · '+time:'منبع: TGJU · '+time);
 setText('marketStatus',stale?'هشدار تازگی: یک یا چند نرخ قدیمی است یا از حد ۴۵ دقیقه عبور کرده؛ نرخ لحظه‌ای نیست.':'نرخ‌ها دریافت شده‌اند؛ زمان ثبت هر ارز در جدول آمده است.');
 setText('fxObservedAt','آخرین مشاهده: '+time);
 setText('fxWarning',stale?'هشدار مهم: داده فعلی قدیمی است و نباید نرخ لحظه‌ای تلقی شود. تا انتشار داده تازه، برای تصمیم‌گیری به آن اتکا نکنید.':'نرخ بازار آزاد ممکن است با قیمت معامله نهایی تفاوت داشته باشد.');
 const warning=$('fxWarning');if(warning)warning.classList.toggle('is-stale',stale);
 renderTable(currencyItems);
 setText('goldCalcStatus',stale?'هشدار: داده مبنا قدیمی است؛ این برآورد را قیمت فعلی در نظر نگیرید.':'برآورد بر پایه نرخ هر گرم طلای ۱۸ عیار؛ بدون اجرت، مالیات و اختلاف خریدوفروش.');
 setText('goldCalc',gold?'—':'ناموجود');setText('gramPrice',gold?toman(Number(gold.price)):'ناموجود');setText('goldPrice',coin?toman(Number(coin.price)):'ناموجود');
 setText('chartCaption','داده‌های بازار آزاد · '+time);setText('chartStart',time);setText('chartEnd',stale?'داده قدیمی':'آخرین مشاهده');
 drawChart(usd,eur,gbp,stale);updateFx();updateGoldCalc();renderChartQuoteStrip();
}
function drawChart(usd,eur,gbp,stale){/* Real daily history is rendered by drawHistoryChart. */}

const HISTORY_BASE='https://raw.githubusercontent.com/iran-market/iran-market.github.io/main/data/history/';
let historyCache=new Map(),historyRange=90,showForecast=true,historyLoadingSymbol=null;
const AI_ENDPOINT_KEY='dollar_ai_worker_endpoint_v1';
const aiForecastCache=new Map(),aiForecastPending=new Set();
function configuredAiEndpoint(){try{return localStorage.getItem(AI_ENDPOINT_KEY)||''}catch{return ''}}
async function loadAiForecast(symbol){
 const endpoint=configuredAiEndpoint();if(!endpoint)return;
 const cached=aiForecastCache.get(symbol);
 if(cached&&Date.now()-cached.fetchedAt<10*60*1000){if(($('chartAsset')?.value||'USD_IRR_FREE')===symbol)drawHistoryChart();return}
 if(aiForecastPending.has(symbol))return;
 aiForecastPending.add(symbol);
 try{
  const response=await fetch(endpoint.replace(/\/$/,'')+'/forecast?asset='+encodeURIComponent(symbol),{headers:{accept:'application/json'},cache:'no-store'});
  const data=await response.json();
  if(!response.ok||!data.forecast||!Number.isFinite(Number(data.forecast.target_price)))throw Error(data.error||'AI forecast unavailable');
  aiForecastCache.set(symbol,{data,fetchedAt:Date.now()});
  if(($('chartAsset')?.value||'USD_IRR_FREE')===symbol)drawHistoryChart();
 }catch(error){
  aiForecastCache.delete(symbol);
  if(($('chartAsset')?.value||'USD_IRR_FREE')===symbol)setText('historyStatus','پیش‌بینی هوش مصنوعی فعلاً در دسترس نیست؛ نمایش روند آماری');
 }finally{aiForecastPending.delete(symbol)}
}
window.addEventListener('dollar-ai-endpoint-updated',()=>{aiForecastCache.clear();loadAiForecast($('chartAsset')?.value||'USD_IRR_FREE')});
const hNum=v=>{if(v===null||v===undefined||v==='')return NaN;const n=Number(String(v).replace(/[,٬\s]/g,''));return Number.isFinite(n)?n:NaN};
function normalizeHistory(payload){
 const raw=Array.isArray(payload)?payload:(Array.isArray(payload.data)?payload.data:(Array.isArray(payload.history)?payload.history:[]));
 return raw.map((r,i)=>{const close=hNum(r.close??r.c??r.price??r.value??r.last??r.close_price);const d=r.date??r.datetime??r.timestamp??r.time??r.date_gregorian??r.date_jalali??r.t;let ms=Date.parse(d);if(!Number.isFinite(ms)&&/^\d{10,13}$/.test(String(d??''))){const n=Number(d);ms=Date.parse(new Date(String(d).length===13?n:n*1000).toISOString())}return {date:ms,rawDate:String(d??''),close,index:i}}).filter(r=>Number.isFinite(r.close)&&r.close>0).sort((a,b)=>(a.date||0)-(b.date||0));
}
async function fetchHistory(symbol){if(historyCache.has(symbol))return historyCache.get(symbol);const res=await fetch(HISTORY_BASE+encodeURIComponent(symbol)+'.json',{cache:'no-store'});if(!res.ok)throw Error('history unavailable');const rows=normalizeHistory(await res.json());if(rows.length<2)throw Error('history format unavailable');historyCache.set(symbol,rows);return rows}
function trendModel(rows){const p=rows.slice(-30).filter(r=>r.close>0),n=p.length;if(n<8)return null;const ys=p.map(r=>Math.log(r.close)),xm=(n-1)/2,ym=ys.reduce((a,b)=>a+b,0)/n;let num=0,den=0;ys.forEach((v,i)=>{num+=(i-xm)*(v-ym);den+=(i-xm)*(i-xm)});const slope=den?num/den:0,intercept=ym-slope*xm,err=ys.map((v,i)=>v-(intercept+slope*i)),sigma=Math.sqrt(err.reduce((a,b)=>a+b*b,0)/Math.max(1,n-2));return {n,slope,intercept,sigma,residuals:err,at:k=>Math.exp(intercept+slope*k)}}
function chartDate(ms){return Number.isFinite(ms)?new Date(ms).toLocaleDateString(language==='fa'?'fa-IR':'en-GB',{year:'2-digit',month:'short',day:'numeric',timeZone:'Asia/Tehran'}):'—'}
function drawHistoryChart(){
 const svg=$('historyChart');if(!svg)return;
 const symbol=$('chartAsset')?.value||'USD_IRR_FREE',all=historyCache.get(symbol)||[];
 const rows=historyRange==='all'?all:all.slice(-Number(historyRange));
 if(rows.length<2){svg.innerHTML='<text x="480" y="180" text-anchor="middle" fill="#a3a3a3" font-size="15">دادهٔ کافی برای نمایش نمودار وجود ندارد.</text>';return}
 const model=showForecast?trendModel(all):null,quote=liveQuotes.get(symbol);
 const quoteFresh=quote&&Date.now()-quote.receivedAt<8*60*1000&&Date.now()-quote.sourceTime<45*60*1000;
 const aiData=aiForecastCache.get(symbol)?.data,aiStamp=Date.parse(aiData?.quote?.source_time||''),aiFresh=!!(showForecast&&aiData?.forecast&&Number.isFinite(aiStamp)&&Date.now()-aiStamp<45*60*1000&&aiStamp<=Date.now()+5*60*1000);
 const aiForecast=aiFresh?aiData.forecast:null;
 const base=aiFresh&&Number(aiData.quote.price)>0?Number(aiData.quote.price):quoteFresh?quote.price:rows[rows.length-1].close;
 const W=960,H=360,L=82,R=25,T=22,B=38,ph=H-T-B;
 const futureSpace=showForecast&&model?180:0,pw=W-L-R-futureSpace;
 const vals=rows.map(r=>r.close);
 let projected=[];
 if(showForecast&&(model||aiForecast))for(let d=0;d<=7;d++){
  const fraction=d/7,residuals=model?.residuals||[],lastResidual=residuals.length?residuals[residuals.length-1]:0;
  const residual=residuals.length?residuals[(residuals.length-1+d)%residuals.length]-lastResidual:0;
  const wiggle=d===0||d===7?0:residual*.38*Math.sin(Math.PI*fraction);
  let value,low,high;
  if(aiForecast){
   const target=Math.max(1,Number(aiForecast.target_price)||base);
   value=Math.exp(Math.log(base)+(Math.log(target/base)*fraction)+wiggle);
   const finalLow=Math.max(1,Number(aiForecast.range_low)||target*.96),finalHigh=Math.max(finalLow,Number(aiForecast.range_high)||target*1.04);
   low=Math.exp(Math.log(base)+(Math.log(finalLow/base)*fraction)+wiggle);
   high=Math.exp(Math.log(base)+(Math.log(finalHigh/base)*fraction)+wiggle);
  }else{
   value=base*Math.exp(model.slope*d+wiggle);
   const sigma=Math.max(model.sigma,0.003)*Math.sqrt(d+1),spread=Math.exp(Math.min(.45,sigma*1.15));
   low=value/spread;high=value*spread;
  }
  projected.push({d,value,lo:Math.min(low,value),hi:Math.max(high,value)});
 }
 const pred=projected.length?projected[projected.length-1]:null;
 const down=!!(pred&&pred.value<base),direction=pred?(down?'تمایل نزولی احتمالی':'تمایل صعودی احتمالی'):'پیش‌بینی در دسترس نیست';
 const forecastColor='#f2cc4d';
 const allForScale=vals.concat(projected.flatMap(p=>[p.lo,p.hi,p.value]));
 const min=Math.min(...allForScale),max=Math.max(...allForScale),span=Math.max(1,max-min),lo=Math.max(0,min-span*.08),hi=max+span*.08;
 const x=i=>L+i/Math.max(1,rows.length-1)*pw,y=v=>T+(hi-v)/(hi-lo)*ph;
 const last=rows[rows.length-1],lx=x(rows.length-1),ly=y(last.close);
 let grid='',labels='';
 for(let i=0;i<5;i++){const v=lo+(hi-lo)*i/4,yy=y(v);grid+='<line x1="'+L+'" y1="'+yy+'" x2="'+(W-R)+'" y2="'+yy+'" stroke="#262626" stroke-width="1"/>';labels+='<text x="'+(L-12)+'" y="'+(yy+4)+'" text-anchor="end" fill="#a3a3a3" font-size="11">'+esc(number(v,0))+'</text>'}
 const pts=rows.map((r,i)=>x(i)+','+y(r.close)).join(' ');
 const area=L+','+(T+ph)+' '+pts+' '+lx+','+(T+ph);
 let historicalSegments='';
 for(let i=1;i<rows.length;i++){
  historicalSegments+='<line x1="'+x(i-1)+'" y1="'+y(rows[i-1].close)+'" x2="'+x(i)+'" y2="'+y(rows[i].close)+'" stroke="#29d879" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" filter="url(#greenGlow)"/>';
 }
 let future='';
 if(projected.length){
  const fx=d=>lx+(d/7)*futureSpace;
  const upper=projected.map(p=>fx(p.d)+','+y(p.hi)).join(' ');
  const lower=projected.slice().reverse().map(p=>fx(p.d)+','+y(p.lo)).join(' ');
  const center=projected.map(p=>fx(p.d)+','+y(p.value)).join(' ');
  const forecastFloor=T+ph,under=center+' '+fx(7)+','+forecastFloor+' '+fx(0)+','+forecastFloor;
  future='<polygon points="'+under+'" fill="url(#forecastAreaGradient)"/><polygon points="'+upper+' '+lower+'" fill="#f2cc4d" fill-opacity=".10" stroke="none"/><polyline points="'+center+'" fill="none" stroke="'+forecastColor+'" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" filter="url(#yellowGlow)"/><circle cx="'+fx(7)+'" cy="'+y(pred.value)+'" r="4.5" fill="'+forecastColor+'" stroke="#111" stroke-width="2" filter="url(#yellowGlow)"/>'
 }
 const currentMark=quoteFresh?'<circle cx="'+lx+'" cy="'+y(base)+'" r="5" fill="#f5f5f5" stroke="#111" stroke-width="2"/>':'';
 svg.innerHTML='<defs><linearGradient id="historyAreaGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#29d879" stop-opacity=".34"/><stop offset="62%" stop-color="#159957" stop-opacity=".13"/><stop offset="100%" stop-color="#159957" stop-opacity=".015"/></linearGradient><linearGradient id="forecastAreaGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f2cc4d" stop-opacity=".34"/><stop offset="58%" stop-color="#f2cc4d" stop-opacity=".14"/><stop offset="100%" stop-color="#f2cc4d" stop-opacity=".015"/></linearGradient><filter id="greenGlow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="yellowGlow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>'+grid+labels+'<polygon points="'+area+'" fill="url(#historyAreaGradient)"/>'+historicalSegments+future+'<circle cx="'+lx+'" cy="'+ly+'" r="3.5" fill="#eafff2" stroke="#159957" stroke-width="1.5"/>'+currentMark+'<text x="'+L+'" y="'+(H-10)+'" text-anchor="start" fill="#a3a3a3" font-size="11">'+esc(chartDate(rows[0].date))+'</text>';
 const detail=$('chartPointDetail');if(detail&&detail.dataset.ready!=='1'){detail.dataset.ready='1';detail.innerHTML='<span class="point-detail-label">جزئیات نقطهٔ نمودار</span><strong>روی هر نقطه بزن تا تاریخ و قیمت همان نقطه را ببینی.</strong>'}
 svg.onpointerdown=event=>{const rect=svg.getBoundingClientRect(),vx=(event.clientX-rect.left)/rect.width*W,vy=(event.clientY-rect.top)/rect.height*H;if(showForecast&&projected.length&&vx>=lx){const day=Math.max(0,Math.min(7,Math.round((vx-lx)/futureSpace*7))),p=projected[day];if(detail&&p)detail.innerHTML='<span class="point-detail-label">پیش‌بینی آماری · '+(day===0?'نقطهٔ آغاز':'روز '+number(day))+'</span><strong>'+esc(toman(p.value))+'</strong><span>بازهٔ عدم‌قطعیت: '+esc(toman(p.lo))+' تا '+esc(toman(p.hi))+'</span>';return}let best=0,dist=Infinity;rows.forEach((r,i)=>{const dx=x(i)-vx,dy=y(r.close)-vy,d=dx*dx+dy*dy;if(d<dist){dist=d;best=i}});const p=rows[best],prev=rows[Math.max(0,best-1)],pct=best?(p.close/prev.close-1)*100:0;if(detail)detail.innerHTML='<span class="point-detail-label">نقطهٔ تاریخی · '+esc(chartDate(p.date))+'</span><strong>'+esc(toman(p.close))+'</strong><span class="point-detail-change '+(pct>0?'up':pct<0?'down':'')+'">'+(best?(pct>0?'+':'')+esc(number(pct,2))+'٪ نسبت به نقطهٔ قبل':'نخستین نقطهٔ این بازه')+'</span>'};
 const shown=quoteFresh?base:last.close;
 setText('chartLatest',toman(shown));
 setText('chartLatestDate',quoteFresh?'نرخ منبع: '+quote.sourceLabel+' · '+quote.timeLabel:'آخرین تاریخچه: '+chartDate(last.date));
 const pct=(rows[rows.length-1].close/rows[0].close-1)*100,cp=$('chartPeriodChange');
 if(cp){cp.textContent=(pct>0?'+':'')+number(pct,2)+'%';cp.style.color=pct>0?'#25c46a':pct<0?'#ef5350':''}
 setText('chartPeriodLabel','از '+chartDate(rows[0].date)+' تا '+chartDate(last.date));
 setText('chartMinMax',number(Math.min(...vals),0)+' – '+number(Math.max(...vals),0));
 if(pred){
  const p=(pred.value/shown-1)*100,fc=$('forecastValue'),scenarioChange=$('scenarioChange');
  setText('forecastValue',toman(pred.value));
  if(fc)fc.style.color='#f2cc4d';
  setText('forecastRange',direction+' · '+(p>0?'+':'')+number(p,2)+'٪ · بازه: '+toman(pred.lo)+' تا '+toman(pred.hi));
  setText('scenarioTitle',down?'سناریوی غالب: احتمال کاهش':'سناریوی غالب: احتمال رشد');
  setText('scenarioPill',down?'روند نزولی':'روند صعودی');
  const pill=$('scenarioPill');if(pill){pill.classList.remove('neutral','up','down');pill.classList.add(down?'down':'up')}
  setText('scenarioSummary',aiForecast?'برآورد ۷روزه با ترکیب تحلیل هوش مصنوعی، خبرهای وب و روند آماری ساخته شده است. جهت نمودار سناریو است، نه تضمین قیمت.':'برآورد آماری تاریخچه برای ۷ روز آینده '+(down?'تمایل نزولی':'تمایل صعودی')+' نشان می‌دهد. برای تحلیل خبری زنده، سرویس Worker را متصل کن.');
  setText('scenarioTarget',toman(pred.value));
  setText('scenarioChange',(p>0?'+':'')+number(p,2)+'٪');
  if(scenarioChange){scenarioChange.classList.remove('up','down');scenarioChange.classList.add(down?'down':'up')}
  setText('scenarioRange',toman(pred.lo)+' تا '+toman(pred.hi));
  setText('scenarioMethod',aiForecast?'مبنا: قیمت تازه، تاریخچه، جست‌وجوی زنده وب و منابع لینک‌شده. بازه عدم‌قطعیت تقریبی است و دقت آینده باید با نتایج واقعی سنجیده شود.':'مبنا: روند آماری تاریخچه؛ تحلیل خبری زنده هنوز متصل نیست. این خروجی سیگنال قطعی یا توصیه معامله نیست.');
  const dot=document.querySelector('.scenario-dot');if(dot){dot.classList.remove('up','down');dot.classList.add(down?'down':'up')}
 }else{
  setText('forecastValue','—');setText('forecastRange','برای نمایش پیش‌بینی، تاریخچه لازم است.');
  setText('scenarioTitle','در انتظار دادهٔ معتبر');setText('scenarioPill','هنوز ارزیابی نشده');
  const pill=$('scenarioPill');if(pill){pill.classList.remove('up','down');pill.classList.add('neutral')}
  setText('scenarioSummary','برای ساخت سناریو، تاریخچهٔ کافی و معتبر لازم است.');
  setText('scenarioTarget','—');setText('scenarioChange','—');setText('scenarioRange','—');
  setText('scenarioMethod','سناریو تا زمان دریافت داده معتبر نمایش داده نمی‌شود.');
 }
 setText('historyStatus',aiForecast?'تحلیل خبری هوش مصنوعی + روند آماری · '+(aiData.generated_at||'برآورد ۷روزه'):quoteFresh?'نرخ تازهٔ منبع · '+quote.timeLabel:'روند تاریخی و سناریوی آماری ۷روزه');
}

let liveQuotes=new Map(),livePollBusy=false,lastLiveKey=new Map();
function renderChartQuoteStrip(){const usd=getItem('USD_IRR_FREE'),gold=getItem('GOLD_18K_IRR'),uq=liveQuotes.get('USD_IRR_FREE'),gq=liveQuotes.get('GOLD_18K_IRR');setText('chartUsdPrice',uq&&Date.now()-uq.receivedAt<480000?toman(uq.price):usd?toman(Number(usd.price)):'ناموجود');setText('chartGoldPrice',gq&&Date.now()-gq.receivedAt<480000?toman(gq.price):gold?toman(Number(gold.price)):'ناموجود');setMove('chartUsdChange',usd);setMove('chartGoldChange',gold);setText('chartUsdTime','زمان ثبت: '+(uq?.timeLabel||stamp(usd)));setText('chartGoldTime','زمان ثبت: '+(gq?.timeLabel||stamp(gold)));}
function readCurrentPrice(payload,symbol){
 const rows=Array.isArray(payload?.data)?payload.data:[];
 const item=rows.find(r=>r.symbol===symbol);
 if(!item||item.stale===true||payload.meta?.stale===true)return null;
 const price=hNum(item.price),sourceTime=Date.parse(item.timestamp||payload.meta?.published_at||'');
 if(!Number.isFinite(price)||price<=0||!Number.isFinite(sourceTime)||Date.now()-sourceTime>45*60*1000)return null;
 return {price,sourceTime,receivedAt:Date.now(),timeLabel:item.timestamp_jalali||chartDate(sourceTime),sourceLabel:'TGJU'};
}
async function refreshForecastQuotes(){
 if(livePollBusy)return;livePollBusy=true;
 try{
  const response=await fetch(API+'?t='+Date.now(),{cache:'no-store'});
  if(!response.ok)throw Error('quote feed unavailable');
  const payload=await response.json();
  const symbols=['USD_IRR_FREE','GOLD_18K_IRR','EUR_IRR_FREE','COIN_EMAMI_IRR'];
  let changed=false;
  for(const symbol of symbols){
   const quote=readCurrentPrice(payload,symbol);if(!quote)continue;
   const key=symbol+'|'+quote.sourceTime+'|'+quote.price;
   const previous=lastLiveKey.get(symbol);
   if(previous!==key){lastLiveKey.set(symbol,key);changed=true}
   const old=liveQuotes.get(symbol);
   liveQuotes.set(symbol,quote);
   if(old&&old.price!==quote.price)changed=true;
  }
  renderChartQuoteStrip();
  if(changed)drawHistoryChart();
  else if(!liveQuotes.has($('chartAsset')?.value||'USD_IRR_FREE'))setText('historyStatus','نمودار روند بازار و پیش‌بینی ۷روزه');
 }catch(e){setText('historyStatus','روند بازار و پیش‌بینی ۷روزه')}
 finally{livePollBusy=false}
}
async function loadHistory(){const symbol=$('chartAsset')?.value||'USD_IRR_FREE';if(historyCache.has(symbol)){drawHistoryChart();return}if(historyLoadingSymbol===symbol)return;historyLoadingSymbol=symbol;setText('historyStatus','در حال دریافت تاریخچهٔ روزانه…');try{const rows=await fetchHistory(symbol);if(($('chartAsset')?.value||'USD_IRR_FREE')===symbol){drawHistoryChart();setText('historyStatus','تاریخچهٔ روزانه · '+number(rows.length)+' مشاهده · تا '+chartDate(rows[rows.length-1].date))}}catch(e){if(($('chartAsset')?.value||'USD_IRR_FREE')===symbol){setText('historyStatus','تاریخچه قیمت‌ها در حال حاضر بارگذاری نشد.');const svg=$('historyChart');if(svg)svg.innerHTML='<text x="480" y="165" text-anchor="middle" fill="#a3a3a3" font-size="15">تاریخچه دریافت نشد</text><text x="480" y="194" text-anchor="middle" fill="#a3a3a3" font-size="12">اتصال یا قالب داده منبع را بررسی کنید.</text>';setText('chartLatest','—');setText('forecastValue','—');setText('forecastRange','برای سناریو، تاریخچه معتبر لازم است.')}}finally{historyLoadingSymbol=null;if(($('chartAsset')?.value||'USD_IRR_FREE')!==symbol)loadHistory()}}

function updateFx(){
 if(!market.size)return;
 const amount=Number($('amount')?.value),from=$('fromCurrency')?.value,to=$('toCurrency')?.value;
 const prices={USD:Number(getItem(SYMBOLS.usd)?.price),EUR:Number(getItem(SYMBOLS.eur)?.price),GBP:Number(getItem(SYMBOLS.gbp)?.price),IRT:1};
 const a=prices[from],b=prices[to];
 if(!Number.isFinite(amount)||amount<0||!Number.isFinite(a)||!Number.isFinite(b)||a<=0||b<=0){setText('fxResult','—');setText('converterStatus','برای این ارز نرخ بازار آزاد در منبع موجود نیست.');return}
 setText('fxResult',to==='IRT'?toman(amount*a/b):number(amount*a/b,2)+' '+to);
 setText('fxRateNote','۱ '+from+' ≈ '+number(a/b,5)+' '+to+' · نرخ بازار آزاد');
 setText('converterStatus','محاسبه بر پایه آخرین نرخ ثبت‌شده؛ وضعیت تازگی را در جدول بالا بررسی کنید.');
}
function updateGoldCalc(){if(!market.size)return;const grams=Number($('weight')?.value),purity=Number($('purity')?.value),base=Number(getItem(SYMBOLS.gold)?.price);if(!Number.isFinite(grams)||grams<0||!Number.isFinite(base)){setText('goldCalc','—');return}setText('goldCalc',toman(base*grams*purity/.75))}
function unavailable(){
 ['usdPrice','eurPrice','gbpPrice','usdtPrice','goldPrice','gramPrice','watchGold','watchEur','watchGbp','watchJpy'].forEach(id=>setText(id,'ناموجود'));
 ['usdMove','eurMove','gbpMove','usdtMove'].forEach(id=>setText(id,'—'));
 ['usdFresh','eurFresh','gbpFresh','usdtFresh'].forEach(id=>setText(id,'ناموجود'));
 setText('topStatus','دریافت داده ناموفق بود');setText('sourceStatusBig','منبع در دسترس نیست');setText('sourceDetails','دریافت از منبع ناموفق بود؛ هیچ قیمت قبلی به‌عنوان نرخ فعلی نمایش داده نمی‌شود.');
 setText('marketStatus','دریافت داده ناموفق بود؛ بعداً دوباره تلاش کنید.');setText('fxObservedAt','زمان مشاهده: ناموجود');
 setText('fxWarning','قیمت در دسترس نیست. تا اتصال مجدد منبع، از این صفحه به‌عنوان نرخ فعلی استفاده نکنید.');setText('footerUpdate','منبع در دسترس نیست');
 const body=$('fxTableBody');if(body)body.innerHTML='<tr><td colspan="6" class="table-empty">داده بازار دریافت نشد.</td></tr>';
 const w=$('fxWarning');if(w)w.classList.add('is-stale');
}
async function refresh(){const btn=$('refreshBtn');if(btn){btn.disabled=true;btn.textContent='در حال دریافت…'}try{const response=await fetch(API+'?v='+Date.now(),{cache:'no-store'});if(!response.ok)throw Error('source unavailable');const payload=await response.json();if(!Array.isArray(payload.data))throw Error('invalid data');render(payload)}catch(e){unavailable()}finally{if(btn){btn.disabled=false;btn.textContent=language==='fa'?'به‌روزرسانی ↻':'Refresh ↻'}}}
document.querySelectorAll('.navlinks a[href^="#"],.brand[href^="#"],.navright a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{const href=link.getAttribute('href');if(!href||href.length<2)return;const target=document.getElementById(href.slice(1));if(target){event.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'});history.replaceState(null,'',href);}}));
$('chartAsset')?.addEventListener('change',()=>{loadHistory();loadAiForecast($('chartAsset')?.value||'USD_IRR_FREE')});document.querySelectorAll('[data-range]').forEach(btn=>btn.addEventListener('click',()=>{historyRange=btn.dataset.range==='all'?'all':Number(btn.dataset.range);document.querySelectorAll('[data-range]').forEach(b=>b.classList.toggle('active',b===btn));drawHistoryChart()}));$('forecastToggle')?.addEventListener('click',()=>{showForecast=!showForecast;$('forecastToggle').classList.toggle('active',showForecast);$('forecastToggle').setAttribute('aria-pressed',String(showForecast));drawHistoryChart()});$('amount')?.addEventListener('input',updateFx);$('fromCurrency')?.addEventListener('change',updateFx);$('toCurrency')?.addEventListener('change',updateFx);$('weight')?.addEventListener('input',updateGoldCalc);$('purity')?.addEventListener('change',updateGoldCalc);
$('fxSearch')?.addEventListener('input',()=>renderTable(CURRENCIES.map(c=>getItem(c.symbol)).filter(Boolean)));$('refreshBtn')?.addEventListener('click',refresh);
$('langBtn')?.addEventListener('click',()=>{language=language==='en'?'fa':'en';document.documentElement.lang=language;document.documentElement.dir=language==='fa'?'rtl':'ltr';document.body.classList.toggle('rtl',language==='fa');$('langBtn').textContent=language==='en'?'فارسی':'English';document.querySelectorAll('[data-en][data-fa]').forEach(el=>{const v=el.getAttribute('data-'+language);if(v!==null)el.innerHTML=v});if(lastPayload)render(lastPayload)});
document.documentElement.lang='fa';document.documentElement.dir='rtl';document.body.classList.add('rtl');$('langBtn').textContent='English';document.querySelectorAll('[data-en][data-fa]').forEach(el=>{el.innerHTML=el.getAttribute('data-fa')});$('year').textContent=new Date().getFullYear();
refresh();loadHistory();loadAiForecast($('chartAsset')?.value||'USD_IRR_FREE');setInterval(refresh,5*60*1000);setInterval(()=>{historyCache.clear();loadHistory()},30*60*1000);setInterval(refreshForecastQuotes,30000);refreshForecastQuotes();
})();