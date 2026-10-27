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
 drawChart(usd,eur,gbp,stale);updateFx();updateGoldCalc();
}
function drawChart(usd,eur,gbp,stale){/* Real daily history is rendered by drawHistoryChart. */}

const HISTORY_BASE='https://raw.githubusercontent.com/iran-market/iran-market.github.io/main/data/history/';
let historyCache=new Map(),historyRange=90,showForecast=true,historyLoading=false;
const hNum=v=>{if(v===null||v===undefined||v==='')return NaN;const n=Number(String(v).replace(/[,٬\s]/g,''));return Number.isFinite(n)?n:NaN};
function normalizeHistory(payload){
 const raw=Array.isArray(payload)?payload:(Array.isArray(payload.data)?payload.data:(Array.isArray(payload.history)?payload.history:[]));
 return raw.map((r,i)=>{const close=hNum(r.close??r.c??r.price??r.value??r.last??r.close_price);const d=r.date??r.datetime??r.timestamp??r.time??r.date_gregorian??r.date_jalali??r.t;let ms=Date.parse(d);if(!Number.isFinite(ms)&&/^\d{10,13}$/.test(String(d??''))){const n=Number(d);ms=Date.parse(new Date(String(d).length===13?n:n*1000).toISOString())}return {date:ms,rawDate:String(d??''),close,index:i}}).filter(r=>Number.isFinite(r.close)&&r.close>0).sort((a,b)=>(a.date||0)-(b.date||0));
}
async function fetchHistory(symbol){if(historyCache.has(symbol))return historyCache.get(symbol);const res=await fetch(HISTORY_BASE+encodeURIComponent(symbol)+'.json',{cache:'no-store'});if(!res.ok)throw Error('history unavailable');const rows=normalizeHistory(await res.json());if(rows.length<2)throw Error('history format unavailable');historyCache.set(symbol,rows);return rows}
function trendModel(rows){const p=rows.slice(-30).filter(r=>r.close>0),n=p.length;if(n<8)return null;const ys=p.map(r=>Math.log(r.close)),xm=(n-1)/2,ym=ys.reduce((a,b)=>a+b,0)/n;let num=0,den=0;ys.forEach((v,i)=>{num+=(i-xm)*(v-ym);den+=(i-xm)*(i-xm)});const slope=den?num/den:0,intercept=ym-slope*xm,err=ys.map((v,i)=>v-(intercept+slope*i)),sigma=Math.sqrt(err.reduce((a,b)=>a+b*b,0)/Math.max(1,n-2));return {n,slope,intercept,sigma,at:k=>Math.exp(intercept+slope*k)}}
function chartDate(ms){return Number.isFinite(ms)?new Date(ms).toLocaleDateString(language==='fa'?'fa-IR':'en-GB',{year:'2-digit',month:'short',day:'numeric',timeZone:'Asia/Tehran'}):'—'}
function drawHistoryChart(){
 const svg=$('historyChart');if(!svg)return;const symbol=$('chartAsset')?.value||'USD_IRR_FREE',all=historyCache.get(symbol)||[],rows=historyRange==='all'?all:all.slice(-Number(historyRange));
 if(rows.length<2){svg.innerHTML='<text x="480" y="180" text-anchor="middle" fill="#7a7b70" font-size="15">تاریخچه کافی دریافت نشد.</text>';return}
 const W=960,H=360,L=82,R=25,T=22,B=38,pw=W-L-R,ph=H-T-B,vals=rows.map(r=>r.close),min=Math.min(...vals),max=Math.max(...vals),span=Math.max(1,max-min),lo=Math.max(0,min-span*.12),hi=max+span*.12;
 const x=i=>L+i/Math.max(1,rows.length-1)*pw,y=v=>T+(hi-v)/(hi-lo)*ph;
 let grid='',labels='';for(let i=0;i<5;i++){const v=lo+(hi-lo)*i/4,yy=y(v);grid+='<line x1="'+L+'" y1="'+yy+'" x2="'+(W-R)+'" y2="'+yy+'" stroke="#e9e9e1"/>';labels+='<text x="'+(L-12)+'" y="'+(yy+4)+'" text-anchor="end" fill="#8a8b80" font-size="11">'+esc(number(v,0))+'</text>'}
 const pts=rows.map((r,i)=>x(i)+','+y(r.close)).join(' '),last=rows[rows.length-1],lx=x(rows.length-1),ly=y(last.close),area=L+','+(T+ph)+' '+pts+' '+lx+','+(T+ph),model=showForecast?trendModel(all):null;let future='';
 if(model){const forecast=[];for(let d=0;d<=7;d++){const val=model.at(model.n-1+d),spread=Math.exp(Math.min(1.2,model.sigma*Math.sqrt(d+1)*1.4));forecast.push({x:lx+(d/7)*Math.min(95,pw*.13),y:y(val),upper:y(val*spread),lower:y(val/spread),value:val})}const top=forecast.map(p=>p.x+','+p.upper).join(' '),bottom=forecast.slice().reverse().map(p=>p.x+','+p.lower).join(' '),line=forecast.map(p=>p.x+','+p.y).join(' ');future='<polygon points="'+top+' '+bottom+'" fill="#c18b57" opacity=".13"/><polyline points="'+line+'" fill="none" stroke="#c18b57" stroke-width="3" stroke-dasharray="7 6" stroke-linecap="round"/><line x1="'+lx+'" y1="'+T+'" x2="'+lx+'" y2="'+(T+ph)+'" stroke="#c8c7bb" stroke-dasharray="3 5"/>'}
 svg.innerHTML='<defs><linearGradient id="chartAreaFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#89936a" stop-opacity=".28"/><stop offset="100%" stop-color="#89936a" stop-opacity=".015"/></linearGradient></defs>'+grid+labels+'<polygon points="'+area+'" fill="url(#chartAreaFill)"/><polyline points="'+pts+'" fill="none" stroke="#78835a" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>'+future+'<circle cx="'+lx+'" cy="'+ly+'" r="5" fill="#78835a" stroke="#fff" stroke-width="2"/><text x="'+L+'" y="'+(H-10)+'" text-anchor="start" fill="#8a8b80" font-size="11">'+esc(chartDate(rows[0].date))+'</text><text x="'+(W-R)+'" y="'+(H-10)+'" text-anchor="end" fill="#8a8b80" font-size="11">'+esc(chartDate(last.date))+'</text>';
 setText('chartLatest',toman(last.close));setText('chartLatestDate','تاریخ ثبت: '+chartDate(last.date));const pct=(last.close/rows[0].close-1)*100,cp=$('chartPeriodChange');if(cp){cp.textContent=(pct>0?'+':'')+number(pct,2)+'%';cp.style.color=pct>0?'#667a43':pct<0?'#a34f42':''}
 setText('chartPeriodLabel','از '+chartDate(rows[0].date)+' تا '+chartDate(last.date));setText('chartMinMax',number(min,0)+' – '+number(max,0));
 if(model&&showForecast){const pred=model.at(model.n+6),p=(pred/last.close-1)*100,band=Math.exp(Math.min(1.2,model.sigma*Math.sqrt(7)*1.4));setText('forecastValue',toman(pred));setText('forecastRange','روند مدل: '+(p>0?'+':'')+number(p,2)+'٪ · دامنه: '+toman(pred/band)+' تا '+toman(pred*band))}
 else{setText('forecastValue','مخفی');setText('forecastRange','سناریوی روند غیرفعال است.')}
}
async function loadHistory(){const symbol=$('chartAsset')?.value||'USD_IRR_FREE';if(historyLoading)return;if(historyCache.has(symbol)){drawHistoryChart();return}historyLoading=true;setText('historyStatus','در حال دریافت تاریخچهٔ روزانه…');try{const rows=await fetchHistory(symbol);drawHistoryChart();setText('historyStatus','تاریخچهٔ روزانه · '+number(rows.length)+' مشاهده · تا '+chartDate(rows[rows.length-1].date))}catch(e){setText('historyStatus','تاریخچه در دسترس نیست؛ منبع را دوباره بررسی کنید.');const svg=$('historyChart');if(svg)svg.innerHTML='<text x="480" y="165" text-anchor="middle" fill="#8a6558" font-size="15">تاریخچه دریافت نشد</text><text x="480" y="194" text-anchor="middle" fill="#8a8b80" font-size="12">اتصال یا قالب داده منبع را بررسی کنید.</text>';setText('chartLatest','—');setText('forecastValue','—');setText('forecastRange','برای سناریو، تاریخچه معتبر لازم است.')}finally{historyLoading=false}}
\nfunction updateFx(){
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
$('chartAsset')?.addEventListener('change',loadHistory);document.querySelectorAll('[data-range]').forEach(btn=>btn.addEventListener('click',()=>{historyRange=btn.dataset.range==='all'?'all':Number(btn.dataset.range);document.querySelectorAll('[data-range]').forEach(b=>b.classList.toggle('active',b===btn));drawHistoryChart()}));$('forecastToggle')?.addEventListener('click',()=>{showForecast=!showForecast;$('forecastToggle').classList.toggle('active',showForecast);$('forecastToggle').setAttribute('aria-pressed',String(showForecast));drawHistoryChart()});$('amount')?.addEventListener('input',updateFx);$('fromCurrency')?.addEventListener('change',updateFx);$('toCurrency')?.addEventListener('change',updateFx);$('weight')?.addEventListener('input',updateGoldCalc);$('purity')?.addEventListener('change',updateGoldCalc);
$('fxSearch')?.addEventListener('input',()=>renderTable(CURRENCIES.map(c=>getItem(c.symbol)).filter(Boolean)));$('refreshBtn')?.addEventListener('click',refresh);
$('langBtn')?.addEventListener('click',()=>{language=language==='en'?'fa':'en';document.documentElement.lang=language;document.documentElement.dir=language==='fa'?'rtl':'ltr';document.body.classList.toggle('rtl',language==='fa');$('langBtn').textContent=language==='en'?'فارسی':'English';document.querySelectorAll('[data-en][data-fa]').forEach(el=>{const v=el.getAttribute('data-'+language);if(v!==null)el.innerHTML=v});if(lastPayload)render(lastPayload)});
document.documentElement.lang='fa';document.documentElement.dir='rtl';document.body.classList.add('rtl');$('langBtn').textContent='English';document.querySelectorAll('[data-en][data-fa]').forEach(el=>{el.innerHTML=el.getAttribute('data-fa')});$('year').textContent=new Date().getFullYear();
refresh();loadHistory();setInterval(refresh,5*60*1000);setInterval(()=>{historyCache.clear();loadHistory()},30*60*1000);
})();