(()=>{'use strict';
const $=id=>document.getElementById(id);
let market=null,language='fa',lastPayload=null;
const api='https://raw.githubusercontent.com/iran-market/iran-market.github.io/main/data/popular.json';
const symbols={usd:'USD_IRR_FREE',eur:'EUR_IRR_FREE',gbp:'GBP_IRR_FREE',gold:'GOLD_18K_IRR',coin:'COIN_EMAMI_IRR',usdt:'USDT_IRR'};
const faNum=n=>Number.isFinite(n)?new Intl.NumberFormat('fa-IR',{maximumFractionDigits:0}).format(n):'—';
const enNum=n=>Number.isFinite(n)?new Intl.NumberFormat('en-US',{maximumFractionDigits:0}).format(n):'—';
const num=n=>language==='fa'?faNum(n):enNum(n);
const toman=n=>Number.isFinite(n)?num(n)+' '+(language==='fa'?'تومان':'IRT'):'—';
const getItem=(id)=>market?.get(id)||null;
function setText(id,v){const el=$(id);if(el)el.textContent=v}
function setStatus(text,error=false){setText('topStatus',text);setText('footerUpdate',error?'داده قدیمی یا ناقص':'منبع بررسی شد');const el=$('footerUpdate');if(el)el.style.color=error?'#a55f52':'';setText('sourceStatusBig',error?'نیازمند بررسی':'داده دریافت شد');}
function ageMinutes(t){const n=Date.parse(t);return Number.isFinite(n)?Math.max(0,(Date.now()-n)/60000):Infinity}
function moveText(item){if(!item||!Number.isFinite(Number(item.change_pct)))return '—';const n=Number(item.change_pct);return (n>0?'+':'')+(language==='fa'?new Intl.NumberFormat('fa-IR',{maximumFractionDigits:2}).format(n):n.toFixed(2))+'%'}
function renderCard(id,item,priceMode){const el=$(id);if(!el)return;if(!item){el.textContent='ناموجود';return}el.textContent=priceMode==='coin'?toman(item.price):toman(item.price)}
function renderMove(id,item){const el=$(id);if(!el)return;el.textContent=moveText(item);el.classList.toggle('down',Number(item?.change_pct)<0)}
function renderAll(payload){
 const rows=payload.data||[];market=new Map(rows.map(x=>[x.symbol,x]));lastPayload=payload;
 const usd=getItem(symbols.usd),eur=getItem(symbols.eur),gbp=getItem(symbols.gbp),gold=getItem(symbols.gold),coin=getItem(symbols.coin),usdt=getItem(symbols.usdt);
 renderCard('goldPrice',usd);renderCard('usdPrice',eur);renderCard('eurPrice',gold);renderCard('gramPrice',coin,'coin');
 setText('goldMove',usd?moveText(usd):'—');setText('usdMove',eur?moveText(eur):'—');setText('eurMove',gold?moveText(gold):'—');setText('gramMove',coin?moveText(coin):'—');
 setText('watchGold',usd?toman(usd.price):'—');setText('watchEur',eur?toman(eur.price):'—');setText('watchGbp',gbp?toman(gbp.price):'—');setText('watchJpy',usdt?toman(usdt.price):'—');
 renderMove('watchUsdMove',usd);renderMove('watchEurMove',eur);renderMove('watchGbpMove',gbp);renderMove('watchUsdtMove',usdt);
 const newest=rows.map(x=>x.timestamp).filter(Boolean).sort().at(-1)||payload.meta?.updated_at;
 const age=ageMinutes(newest),stale=Boolean(payload.meta?.stale)||rows.some(x=>x.stale)||age>45;
 const stamp=rows.find(x=>x.timestamp===newest)?.timestamp_jalali||new Date(newest).toLocaleString('fa-IR');
 setText('updatedTop',(language==='fa'?'آخرین ثبت: ':'Updated: ')+stamp);
 setText('sourceDetails','منبع: TGJU از طریق Iran Market Data · زمان آخرین ثبت: '+stamp+' · واحد قیمت: تومان');
 setText('fxStatus',stale?'هشدار: داده منبع قدیمی است؛ این ارقام را نرخ لحظه‌ای تلقی نکنید.':'نرخ‌ها از منبع منتشرشده دریافت شده‌اند؛ ممکن است با قیمت معامله تفاوت داشته باشند.');
 setText('fxRateNote','نرخ بر پایه قیمت بازار آزاد · تومان');
 setText('chartCaption','آخرین داده منتشرشده · '+stamp);
 setText('chartStart',stamp);setText('chartEnd',stale?'قدیمی':'آخرین ثبت');
 setText('goldCalcStatus',stale?'هشدار: قیمت مبنا قدیمی است؛ این فقط برآورد ریاضی است.':'برآورد بر پایه نرخ هر گرم طلای ۱۸ عیار؛ بدون اجرت، مالیات و اختلاف خریدوفروش.');
 setText('goldCalc',gold?'—':'ناموجود');
 setText('goldPrice',usd?toman(usd.price):'ناموجود');
 setText('usdPrice',eur?toman(eur.price):'ناموجود');
 setText('eurPrice',gold?toman(gold.price):'ناموجود');
 setText('gramPrice',coin?toman(coin.price):'ناموجود');
 setText('topStatus',stale?'منبع قدیمی · با احتیاط استفاده کنید':'داده بازار دریافت شد');
 setText('footerUpdate',stale?'داده قدیمی · '+stamp:'منبع: TGJU · '+stamp);
 setText('sourceStatusBig',stale?'آخرین داده قدیمی است':'منبع دریافت شد');
 setText('sourceDetails','منبع داده: TGJU · انتشار از طریق Iran Market Data · آخرین مشاهده: '+stamp+' · '+(stale?'داده از حد تازگی عبور کرده است.':'وضعیت تازگی در محدوده قابل قبول است.'));
 drawChart(usd,eur,gold,coin,stale);
 updateFx();updateGoldCalc();
}
function drawChart(usd,eur,gold,coin,stale){const svg=$('goldChart');if(!svg)return;const items=[['دلار آزاد',usd],['یورو',eur],['طلای ۱۸ عیار',gold],['سکه امامی',coin]].filter(x=>x[1]);svg.innerHTML='<g stroke="#e9e9e1" stroke-width="1"><path d="M0 25H620 M0 75H620 M0 125H620 M0 175H620"/></g>'+items.map((x,i)=>'<text x="600" y="'+(43+i*39)+'" text-anchor="end" fill="#777970" font-size="12">'+x[0]+'</text><text x="12" y="'+(43+i*39)+'" fill="#20221e" font-size="14">'+String(toman(Number(x[1].price))).replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</text>').join('')+'<text x="310" y="208" text-anchor="middle" fill="#a55f52" font-size="10">'+(stale?'منبع: داده قدیمی':'منبع: داده منتشرشده')+'</text>'}
function getPrice(code){return Number(getItem(symbols[code])?.price)}
function updateFx(){if(!market)return;const amount=Number($('amount')?.value),from=$('fromCurrency')?.value,to=$('toCurrency')?.value;const rates={USD:getPrice('usd'),EUR:getPrice('eur'),GBP:getPrice('gbp'),IRT:1};const a=rates[from],b=rates[to];if(!Number.isFinite(amount)||amount<0||!Number.isFinite(a)||!Number.isFinite(b)||a<=0){setText('fxResult','—');return}const result=amount*a/b;setText('fxResult',tomanOrCurrency(result,to));setText('fxRateNote','۱ '+from+' ≈ '+(language==='fa'?new Intl.NumberFormat('fa-IR',{maximumFractionDigits:5}).format(a/b):String((a/b).toFixed(5)))+' '+to)}
function tomanOrCurrency(value,code){if(!Number.isFinite(value))return '—';return code==='IRT'?toman(value):num(value)+' '+code}
function updateGoldCalc(){if(!market)return;const grams=Number($('weight')?.value),purity=Number($('purity')?.value),base=getPrice('gold');if(!Number.isFinite(grams)||grams<0||!Number.isFinite(base)){setText('goldCalc','—');return}setText('goldCalc',toman(base*grams*purity/.75))}
async function refresh(){try{const response=await fetch(api+'?v='+Date.now(),{cache:'no-store'});if(!response.ok)throw Error('source unavailable');const payload=await response.json();if(!Array.isArray(payload.data))throw Error('invalid data');renderAll(payload)}catch(e){setText('topStatus','دریافت داده ناموفق بود');setText('sourceStatusBig','منبع در دسترس نیست');setText('sourceDetails','اتصال به منبع داده ناموفق بود. قیمت قبلی به‌عنوان نرخ زنده نمایش داده نمی‌شود.');setText('fxStatus','دریافت داده ناموفق بود؛ بعداً دوباره تلاش کنید.');setText('footerUpdate','منبع در دسترس نیست')}}
$('amount')?.addEventListener('input',updateFx);$('fromCurrency')?.addEventListener('change',updateFx);$('toCurrency')?.addEventListener('change',updateFx);$('weight')?.addEventListener('input',updateGoldCalc);$('purity')?.addEventListener('change',updateGoldCalc);
document.querySelectorAll('[data-period]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-period]').forEach(x=>x.classList.remove('active'));b.classList.add('active');setText('chartCaption','برای نمودار تاریخی به داده تاریخچه نیاز است؛ این نما فعلاً نرخ‌های منتخب را نشان می‌دهد.')})); 
$('langBtn')?.addEventListener('click',()=>{language=language==='en'?'fa':'en';document.documentElement.lang=language;document.documentElement.dir=language==='fa'?'rtl':'ltr';document.body.classList.toggle('rtl',language==='fa');$('langBtn').textContent=language==='en'?'فارسی':'English';document.querySelectorAll('[data-en][data-fa]').forEach(el=>{const v=el.getAttribute('data-'+language);if(v!==null)el.innerHTML=v});if(lastPayload)renderAll(lastPayload)});
document.documentElement.lang='fa';document.documentElement.dir='rtl';document.body.classList.add('rtl');$('langBtn').textContent='English';document.querySelectorAll('[data-en][data-fa]').forEach(el=>{el.innerHTML=el.getAttribute('data-fa')});$('year').textContent=new Date().getFullYear();
refresh();setInterval(refresh,5*60*1000);
})();