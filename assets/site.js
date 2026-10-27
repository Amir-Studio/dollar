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
function drawChart(usd,eur,gbp,stale){const svg=$('goldChart');if(!svg)return;const items=[['دلار آمریکا',usd],['یورو',eur],['پوند انگلیس',gbp]].filter(x=>x[1]);svg.innerHTML='<g stroke="#e9e9e1" stroke-width="1"><path d="M0 25H620 M0 75H620 M0 125H620 M0 175H620"/></g>'+items.map((x,i)=>'<text x="600" y="'+(43+i*49)+'" text-anchor="end" fill="#777970" font-size="12">'+x[0]+'</text><text x="12" y="'+(43+i*49)+'" fill="#20221e" font-size="14">'+esc(toman(Number(x[1].price)))+'</text>').join('')+'<text x="310" y="208" text-anchor="middle" fill="'+(stale?'#a55f52':'#667044')+'" font-size="10">'+(stale?'داده قدیمی · پیش از استفاده بررسی کنید':'نرخ‌های منتشرشده بازار آزاد')+'</text>'}
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
$('amount')?.addEventListener('input',updateFx);$('fromCurrency')?.addEventListener('change',updateFx);$('toCurrency')?.addEventListener('change',updateFx);$('weight')?.addEventListener('input',updateGoldCalc);$('purity')?.addEventListener('change',updateGoldCalc);
$('fxSearch')?.addEventListener('input',()=>renderTable(CURRENCIES.map(c=>getItem(c.symbol)).filter(Boolean)));$('refreshBtn')?.addEventListener('click',refresh);
$('langBtn')?.addEventListener('click',()=>{language=language==='en'?'fa':'en';document.documentElement.lang=language;document.documentElement.dir=language==='fa'?'rtl':'ltr';document.body.classList.toggle('rtl',language==='fa');$('langBtn').textContent=language==='en'?'فارسی':'English';document.querySelectorAll('[data-en][data-fa]').forEach(el=>{const v=el.getAttribute('data-'+language);if(v!==null)el.innerHTML=v});if(lastPayload)render(lastPayload)});
document.documentElement.lang='fa';document.documentElement.dir='rtl';document.body.classList.add('rtl');$('langBtn').textContent='English';document.querySelectorAll('[data-en][data-fa]').forEach(el=>{el.innerHTML=el.getAttribute('data-fa')});$('year').textContent=new Date().getFullYear();
refresh();setInterval(refresh,5*60*1000);
})();