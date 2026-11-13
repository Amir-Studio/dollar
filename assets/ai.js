(()=>{'use strict';
const $=id=>document.getElementById(id);
const endpointInput=$('aiEndpoint'),runBtn=$('runAiBtn'),output=$('aiOutput'),pill=$('aiStatusPill');
const STORAGE_KEY='dollar_ai_worker_endpoint_v1';
const DEFAULT_ENDPOINT='https://oolfbjxclhzlbwjmzxxx.supabase.co/functions/v1/market-api';
const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const toman=n=>Number.isFinite(Number(n))?new Intl.NumberFormat('fa-IR',{maximumFractionDigits:0}).format(Number(n))+' تومان':'—';
function setStatus(t){if(pill)pill.textContent=t}
function endpoint(){try{return localStorage.getItem(STORAGE_KEY)||DEFAULT_ENDPOINT}catch{return DEFAULT_ENDPOINT}}
function validUrl(s){try{const u=new URL(s);return u.protocol==='https:'&&u.hostname.endsWith('.workers.dev')||u.protocol==='https:'&&u.hostname.includes('.')}catch{return false}}
function saveEndpoint(){const v=(endpointInput?.value||'').trim().replace(/\/$/,'');if(!v){setStatus('آدرس تنظیم نشده');return}if(!validUrl(v)){setStatus('آدرس HTTPS معتبر وارد کن');return}try{localStorage.setItem(STORAGE_KEY,v);window.dispatchEvent(new CustomEvent('dollar-ai-endpoint-updated'));setStatus('آدرس ذخیره شد');if(output)output.innerHTML='<strong>اتصال ذخیره شد.</strong><p>اکنون می‌توانی گزارش هوشمند را اجرا کنی. اگر سرویس هنوز مستقر نشده باشد، خطای اتصال نشان داده می‌شود.</p>'}catch{setStatus('ذخیره‌سازی در دسترس نیست')}}
function showError(message){output.innerHTML='<span class="ai-error">گزارش آماده نشد</span><p>'+escapeHtml(message)+'</p><p>آدرس Worker و وضعیت سرویس را بررسی کن. کلید API را داخل سایت وارد نکن.</p>'}
function render(data){
 const f=data.forecast||{};
 if(f.model_version==='iran-ensemble-wf-1.0'){
  const v=f.validation||{}, fa=n=>new Intl.NumberFormat('fa-IR',{maximumFractionDigits:2}).format(Number(n)||0);
  if(f.status==='withheld'){
   const news=data.news_context||{},headlines=Array.isArray(news.headlines)?news.headlines:[];
   const newsHtml=headlines.length?'<div class="ai-driver"><h4>خبرهای تازهٔ بازار · '+fa(news.headline_count)+' تیتر</h4><p>خبرها از چند خوراک خبری گردآوری شده‌اند؛ این تیترها به‌تنهایی مبنای پیش‌بینی عددی نیستند.</p><div class="ai-news-list">'+headlines.slice(0,8).map(item=>'<article class="ai-news-item"><div class="ai-news-meta"><span>'+escapeHtml(item.domain||'منبع خبری')+'</span><small>'+escapeHtml(item.published_at||'')+'</small></div><a href="'+escapeHtml(item.url||'#')+'" target="_blank" rel="noopener noreferrer">'+escapeHtml(item.title||'خبر')+' ↗</a></article>').join('')+'</div></div>':'<div class="ai-driver"><h4>خبرخوان بازار</h4><p>در بازهٔ ۷۲ ساعت اخیر، تیتر قابل‌تأییدی دریافت نشد.</p></div>';
   output.innerHTML='<div class="ai-kicker">ADAPTIVE FORECAST ENGINE · موتور پیش‌بینی تطبیقی</div><h3 class="ai-headline">فعلاً پیش‌بینی قابل‌اتکا منتشر نشد</h3><p class="ai-summary">'+escapeHtml(f.reason||'شواهد خارج از نمونه برای انتشار کافی نیست.')+'</p><div class="ai-metrics"><article><small>تعداد مشاهدات</small><b>'+fa(f.observations)+'</b></article><article><small>نمونه‌های آزمون</small><b>'+fa(v.samples)+'</b></article><article><small>خطای مدل</small><b>'+(v.mae_pct==null?'—':fa(v.mae_pct)+'٪')+'</b></article><article><small>خطای مدل ساده</small><b>'+(v.naive_mae_pct==null?'—':fa(v.naive_mae_pct)+'٪')+'</b></article></div><p>سیستم عمداً از حدس‌زدن بدون شواهد کافی خودداری کرد. این رفتار بخشی از کنترل کیفیت است.</p>'+newsHtml;
   setStatus(headlines.length?'پیش‌بینی متوقف شد · خبرخوان فعال':'انتشار متوقف شد · شواهد ناکافی');return;
  }
  const dir=f.direction==='up'?'تمایل صعودی':f.direction==='down'?'تمایل نزولی':'کم‌جهت';
  const acc=v.directional_accuracy_pct==null?'هنوز نمونه کافی نیست':fa(v.directional_accuracy_pct)+'٪';
  const html='<div class="ai-kicker">ADAPTIVE FORECAST ENGINE · '+escapeHtml(data.asset||'بازار')+' · '+fa(f.horizon_days)+' روز</div><h3 class="ai-headline">'+dir+'</h3><p class="ai-summary">برآورد آماری ترکیبی با وزن‌دهی بر اساس آزمون walk-forward. پیش‌بینی قبلی بازنویسی نمی‌شود و نتیجهٔ هر افق پس از رسیدن زمان هدف ارزیابی خواهد شد.</p><div class="ai-metrics"><article><small>قیمت مبنا</small><b>'+toman(f.reference_price)+'</b></article><article><small>قیمت برآوردی</small><b>'+toman(f.predicted_price)+'</b></article><article><small>تغییر برآوردی</small><b>'+(Number(f.predicted_change_pct)>0?'+':'')+fa(f.predicted_change_pct)+'٪</b></article><article><small>بازهٔ سناریو</small><b>'+toman(f.range?.low)+' تا '+toman(f.range?.high)+'</b></article></div><div class="ai-driver"><h4>کارنامهٔ آزمون تاریخی خارج از نمونه</h4><p>دقت تشخیص جهت: '+acc+' · تعداد نمونه‌های جهت: '+fa(v.directional_samples)+' · خطای مطلق مدل ترکیبی: '+fa(v.mae_pct)+'٪ · خطای مدل بدون تغییر: '+fa(v.naive_mae_pct)+'٪ · نمونه‌های آزمون: '+fa(v.samples)+'</p><p>مدل‌های ترکیبی: '+escapeHtml(JSON.stringify(f.model_weights||{}))+'</p></div><p>نسخهٔ مدل: '+escapeHtml(f.model_version)+' · زمان صدور: '+escapeHtml(f.issued_at||data.generated_at||'—')+' · منبع قیمت: '+escapeHtml(f.source||'—')+'</p><p>این خروجی سناریوی آماری است، نه تضمین یا توصیهٔ خریدوفروش.</p>';
  const news=data.news_context||{},topics=Array.isArray(news.topics)?news.topics:[],headlines=Array.isArray(news.headlines)?news.headlines:[];
  if(topics.length){
   html+='<div class="ai-driver"><h4>زمینهٔ خبری ۷۲ ساعت اخیر · '+fa(news.headline_count)+' تیتر</h4><p>خبرها از RSS گردآوری و موضوع‌بندی شده‌اند؛ به‌دلیل نبود ارزیابی معتبر اثر خبر، در جهت یا عدد پیش‌بینی دخالت داده نشده‌اند.</p>'+topics.map(t=>'<div class="ai-driver"><b>'+escapeHtml(t.title_fa)+'</b><p>'+fa(t.count)+' تیتر · '+escapeHtml(t.explanation_fa||'')+'</p></div>').join('')+'</div>';
  }
  if(headlines.length){
   html+='<div class="ai-driver"><h4>تیترهای قابل‌ردیابی</h4><div class="ai-news-list">'+headlines.slice(0,8).map(item=>'<article class="ai-news-item"><div class="ai-news-meta"><span>'+escapeHtml(item.domain||'منبع خبری')+'</span><small>'+escapeHtml(item.published_at||'')+'</small></div><a href="'+escapeHtml(item.url||'#')+'" target="_blank" rel="noopener noreferrer">'+escapeHtml(item.title||'خبر')+' ↗</a></article>').join('')+'</div></div>';
  }
  output.innerHTML=html;setStatus('مدل تطبیقی فعال · پیش‌بینی و زمینه خبری آماده');return;
 }
 const drivers=Array.isArray(data.drivers)?data.drivers:[],risks=Array.isArray(data.risks_fa)?data.risks_fa:[];
 const direction=f.direction==='up'?'تمایل صعودی':f.direction==='down'?'تمایل نزولی':'روند خنثی';
 const freeMode=data.mode==='free-algorithmic';
 const metrics=[['قیمت مرجع',toman(data.quote?.price)],[freeMode?'برآورد آماری ۷روزه':'برآورد ۷روزه',toman(f.target_price)],['تغییر برآوردی',(Number(f.expected_change_pct)>0?'+':'')+new Intl.NumberFormat('fa-IR',{maximumFractionDigits:2}).format(Number(f.expected_change_pct))+'٪'],[freeMode?'خبرهای تازه در ۲۴ ساعت': 'اطمینان تحلیلی',freeMode?new Intl.NumberFormat('fa-IR').format(Number(data.recent_sources_count)||0)+' خبر':new Intl.NumberFormat('fa-IR').format(Number(f.confidence)||0)+' از ۱۰۰']];
 let html='<div class="ai-kicker">'+(freeMode?'FREE MARKET ANALYSIS · تحلیل الگوریتمی رایگان':'AI MARKET BRIEFING · تحلیل هوش مصنوعی')+' · '+escapeHtml(data.asset_fa||data.asset||'بازار')+'</div><h3 class="ai-headline">'+escapeHtml(f.headline_fa||direction)+'</h3><p class="ai-summary">'+escapeHtml(f.summary_fa||'')+'</p><div class="ai-metrics">'+metrics.map(m=>'<article><small>'+m[0]+'</small><b>'+escapeHtml(m[1])+'</b></article>').join('')+'</div>';
 if(drivers.length)html+='<div class="ai-driver"><h4>'+(freeMode?'موضوعات خبری شناسایی‌شده':'عوامل اثرگذار')+'</h4>'+drivers.map(d=>'<div class="ai-driver"><h4>'+escapeHtml(d.title_fa)+' · '+escapeHtml(({positive:'مثبت',negative:'منفی',mixed:'ترکیبی',unknown:'نیازمند بررسی'})[d.impact]||'نیازمند بررسی')+'</h4><p>'+escapeHtml(d.explanation_fa)+' '+escapeHtml(d.evidence)+'</p></div>').join('')+'</div>';
 if(risks.length)html+='<div class="ai-driver"><h4>ریسک‌ها و محدودیت‌ها</h4><p>'+risks.map(escapeHtml).join(' · ')+'</p></div>';
 const sources=Array.isArray(data.sources)?data.sources:[];
 if(sources.length){
  html+='<div class="ai-driver"><h4>خبرها و گزارش‌های رسانه‌ای بررسی‌شده</h4><p>اولویت جست‌وجو با خبرهای '+escapeHtml(data.news_window_hours||72)+' ساعت اخیر است؛ گزارش‌های زمینه‌ای قدیمی‌تر هم ممکن است نمایش داده شوند. تاریخ انتشار فقط وقتی نشان داده می‌شود که منبع آن را ارائه کرده باشد.</p><div class="ai-news-list">'+sources.map(s=>{
   const title=escapeHtml(s.title||s.domain||new URL(s.url).hostname),domain=escapeHtml(s.domain||new URL(s.url).hostname);
   const date=s.published_at?escapeHtml(s.published_at):'تاریخ انتشار در دادهٔ منبع مشخص نبود';
   const snippet=s.snippet?'<p>'+escapeHtml(s.snippet)+'</p>':'';
   return '<article class="ai-news-item"><div class="ai-news-meta"><span>'+domain+'</span><small>'+date+'</small></div><a href="'+escapeHtml(s.url)+'" target="_blank" rel="noopener noreferrer">'+title+' ↗</a>'+snippet+'</article>';
  }).join('')+'</div></div>';
 }else{
  html+='<div class="ai-driver"><h4>منابع خبری</h4><p>این اجرا لینک رسانه‌ای قابل‌تأییدی برنگرداند؛ به همین دلیل امتیاز اطمینان محدود شده است. گزارش را قطعی تلقی نکن.</p></div>';
 }
 if(data.baseline){
  const fmt=v=>v===null||v===undefined?'—':(Number(v)>0?'+':'')+new Intl.NumberFormat('fa-IR',{maximumFractionDigits:2}).format(Number(v))+'٪';
  html+='<div class="ai-driver"><h4>شاخص‌های مستقل روند</h4><p>روند ۳۰ نقطهٔ اخیر: '+fmt(data.baseline.daily_trend_pct)+' در روز · بازده ۷روزه: '+fmt(data.baseline.momentum_7d_pct)+' · نوسان روزانه: '+fmt(data.baseline.daily_volatility_pct)+' · دادهٔ مبنا: '+escapeHtml(data.baseline.observations||'—')+' نقطه</p></div>';
 }
 html+='<p>زمان تولید: '+escapeHtml(data.generated_at||'—')+' · منابع پیوندشده: '+escapeHtml(data.news_sources_count??sources.length)+' · منابع دارای تاریخِ قابل‌تأیید در ۷۲ ساعت اخیر: '+escapeHtml(data.recent_sources_count??'—')+' · '+escapeHtml(data.note_fa||'این خروجی احتمالی است، نه توصیهٔ معامله.')+'</p>';
 output.innerHTML=html;setStatus(freeMode?'تحلیل رایگان آماده شد · بدون مدل مولد':(sources.length>=2?'گزارش هوش مصنوعی آماده شد · منابع پیوست شد':'گزارش آماده شد · منابع محدود'));
}
async function run(){
 const base=endpoint();if(!base){setStatus('نیازمند اتصال');output.innerHTML='<strong>سرویس هوش مصنوعی هنوز به این سایت متصل نشده.</strong><p>در بخش «تنظیم اتصال تحلیلگر»، آدرس Worker مستقرشده را وارد و ذخیره کن. برای امنیت، کلید API فقط باید در Secretهای Cloudflare باشد.</p>';document.querySelector('.ai-setup details')?.setAttribute('open','');return}
 const asset=$('aiAsset')?.value||'USD_IRR_FREE';const horizon=$('aiHorizon')?.value||'7';runBtn.disabled=true;runBtn.innerHTML='<span class="ai-spark">✳</span> در حال آزمون مدل و داده‌ها…';setStatus('در حال بررسی');output.innerHTML='<strong>در حال ارزیابی بازار…</strong><p>قیمت و تاریخچه بررسی می‌شود؛ سپس مدل‌های آماری با آزمون walk-forward و معیارهای خطا سنجیده می‌شوند. اگر شواهد کافی نباشد، پیش‌بینی منتشر نمی‌شود.</p>';
 try{const healthRes=await fetch(base.replace(/\/$/,'')+'/health',{headers:{accept:'application/json'},cache:'no-store'});const health=await healthRes.json();if(!healthRes.ok||!health.ok)throw new Error('سرویس تحلیل در دسترس نیست.');const adaptive=Array.isArray(health.capabilities)&&health.capabilities.includes('adaptive-ensemble-forecast')&&health.forecast_ledger_enabled===true;const route=adaptive?'/forecast/v2?asset='+encodeURIComponent(asset)+'&horizon_days='+encodeURIComponent(horizon):'/analysis?asset='+encodeURIComponent(asset);const res=await fetch(base.replace(/\/$/,'')+route,{headers:{accept:'application/json'},cache:'no-store'});const data=await res.json();if(!res.ok)throw new Error(data.error||'سرویس پاسخ موفق نداد ('+res.status+')');render(data)}
 catch(e){showError(e?.message||'اتصال ناموفق بود.');setStatus('خطای اتصال')}
 finally{runBtn.disabled=false;runBtn.innerHTML='<span class="ai-spark">✳</span> تهیهٔ گزارش بازار <span>↗</span>'}
}
async function checkHealth(){
 const base=endpoint();
 if(!base){setStatus('نیازمند اتصال');return}
 try{
  const res=await fetch(base.replace(/\/$/,'')+'/health',{headers:{accept:'application/json'},cache:'no-store'});
  const data=await res.json();
  if(!res.ok||!data.ok)throw Error('health check failed');
  if(data.free_forecast_enabled){if(!data.database_configured){setStatus('تحلیل رایگان آماده · پایگاه داده متصل نیست');return}if(data.database_schema_ready!==true){setStatus('تحلیل رایگان آماده · طرح پایگاه داده ناقص است');return}setStatus(data.background_refresh_prerequisites_ready?'پیش‌بینی تطبیقی · زمان‌بندی خودکار فعال':'پیش‌بینی تطبیقی · زمان‌بندی خودکار غیرفعال');return}
  setStatus('سرویس تحلیل در دسترس نیست');
 }catch{setStatus('سرویس در دسترس نیست')}
}
const saved=endpoint();if(endpointInput&&saved)endpointInput.value=saved;
$('saveAiEndpoint')?.addEventListener('click',saveEndpoint);runBtn?.addEventListener('click',run);
checkHealth();
window.addEventListener('dollar-ai-endpoint-updated',checkHealth);
})();