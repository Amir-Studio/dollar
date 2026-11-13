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
 if(String(f.model_version||'').startsWith('iran-ensemble-wf-')){
  const v=f.validation||{}, fa=n=>new Intl.NumberFormat('fa-IR',{maximumFractionDigits:2}).format(Number(n)||0);
  if(f.status==='withheld'){
   const news=data.news_context||{},headlines=Array.isArray(news.headlines)?news.headlines:[];
   const newsHtml=headlines.length?'<div class="ai-driver"><h4>خبرهای تازهٔ بازار · '+fa(news.headline_count)+' تیتر</h4><p>خبرها از چند خوراک خبری گردآوری شده‌اند؛ این تیترها به‌تنهایی مبنای پیش‌بینی عددی نیستند.</p><div class="ai-news-list">'+headlines.slice(0,8).map(item=>'<article class="ai-news-item"><div class="ai-news-meta"><span>'+escapeHtml(item.domain||'منبع خبری')+'</span><small>'+escapeHtml(item.published_at||'')+'</small></div><a href="'+escapeHtml(item.url||'#')+'" target="_blank" rel="noopener noreferrer">'+escapeHtml(item.title||'خبر')+' ↗</a></article>').join('')+'</div></div>':'<div class="ai-driver"><h4>خبرخوان بازار</h4><p>در بازهٔ ۷۲ ساعت اخیر، تیتر قابل‌تأییدی دریافت نشد.</p></div>';
   output.innerHTML='<div class="ai-kicker">ADAPTIVE FORECAST ENGINE · موتور پیش‌بینی تطبیقی</div><h3 class="ai-headline">فعلاً پیش‌بینی قابل‌اتکا منتشر نشد</h3><p class="ai-summary">'+escapeHtml(f.reason||'شواهد خارج از نمونه برای انتشار کافی نیست.')+'</p><div class="ai-metrics"><article><small>تعداد مشاهدات</small><b>'+fa(f.observations)+'</b></article><article><small>نمونه‌های آزمون</small><b>'+fa(v.samples)+'</b></article><article><small>خطای مدل</small><b>'+(v.mae_pct==null?'—':fa(v.mae_pct)+'٪')+'</b></article><article><small>خطای مدل ساده</small><b>'+(v.naive_mae_pct==null?'—':fa(v.naive_mae_pct)+'٪')+'</b></article><article><small>بهبود نسبت به مدل ساده</small><b>'+(v.skill_vs_no_change_pct==null?'—':fa(v.skill_vs_no_change_pct)+'٪')+'</b></article><article><small>پیش‌بینی با خطای زیر ۲٪</small><b>'+(v.within_2pct_pct==null?'—':fa(v.within_2pct_pct)+'٪')+'</b></article><article><small>پیش‌بینی با خطای زیر ۵٪</small><b>'+(v.within_5pct_pct==null?'—':fa(v.within_5pct_pct)+'٪')+'</b></article><article><small>پوشش پیش‌بینی جهت‌دار</small><b>'+(v.directional_coverage_pct==null?'—':fa(v.directional_coverage_pct)+'٪')+'</b></article></div><p>سیستم عمداً از حدس‌زدن بدون شواهد کافی خودداری کرد. این رفتار بخشی از کنترل کیفیت است. درصدهای بالا از آزمون تاریخی‌اند، نه تضمین نتیجهٔ آینده.</p>'+newsHtml;
   setStatus(headlines.length?'پیش‌بینی متوقف شد · خبرخوان فعال':'انتشار متوقف شد · شواهد ناکافی');return;
  }
if(f.forecast_mode==='baseline_only'){
    output.innerHTML='<div class="ai-kicker">ADAPTIVE FORECAST ENGINE · BASELINE CALIBRATION</div><h3 class="ai-headline">سناریوی مرجع خنثی؛ بدون سیگنال جهت‌دار</h3><p class="ai-summary">آزمون تاریخی هنوز نشان نداده که مدل از پیش‌بینی بدون تغییر بهتر است. بنابراین سیستم جهت یا تغییر قیمت را حدس نمی‌زند؛ فقط قیمت مرجع و بازهٔ عدم‌قطعیت را برای ارزیابی آینده ثبت می‌کند.</p><div class="ai-metrics"><article><small>قیمت مرجع</small><b>'+toman(f.reference_price)+'</b></article><article><small>سناریوی مرجع</small><b>'+toman(f.predicted_price)+'</b></article><article><small>تغییر جهت‌دار</small><b>منتشر نشده</b></article><article><small>بازهٔ عدم‌قطعیت</small><b>'+toman(f.range?.low)+' تا '+toman(f.range?.high)+'</b></article><article><small>نمونه‌های آزمون</small><b>'+fa(v.samples)+'</b></article><article><small>خطای این روش</small><b>'+fa(v.mae_pct)+'٪</b></article><article><small>خطای مبنای بدون تغییر</small><b>'+fa(v.naive_mae_pct)+'٪</b></article><article><small>مهارت نسبت به مبنا</small><b>'+fa(v.skill_vs_no_change_pct)+'٪</b></article></div><p>این رکورد برای سنجش خطای واقعی در موعد ۱، ۳ یا ۷ روزه ذخیره می‌شود. فقط پس از بهبود معتبر آزمون خارج از نمونه، سیگنال جهت‌دار فعال خواهد شد.</p>';
    setStatus('کالیبراسیون فعال · بدون سیگنال جهت‌دار');return;
   }
     const dir=f.direction==='up'?'تمایل صعودی':f.direction==='down'?'تمایل نزولی':'کم‌جهت';
  const acc=v.directional_accuracy_pct==null?'هنوز نمونه کافی نیست':fa(v.directional_accuracy_pct)+'٪';
  let html='<div class="ai-kicker">ADAPTIVE FORECAST ENGINE · '+escapeHtml(data.asset||'بازار')+' · '+fa(f.horizon_days)+' روز</div><h3 class="ai-headline">'+dir+'</h3><p class="ai-summary">برآورد آماری ترکیبی با وزن‌دهی بر اساس آزمون walk-forward. پیش‌بینی قبلی بازنویسی نمی‌شود و نتیجهٔ هر افق پس از رسیدن زمان هدف ارزیابی خواهد شد.</p><div class="ai-metrics"><article><small>قیمت مبنا</small><b>'+toman(f.reference_price)+'</b></article><article><small>قیمت برآوردی</small><b>'+toman(f.predicted_price)+'</b></article><article><small>تغییر برآوردی</small><b>'+(Number(f.predicted_change_pct)>0?'+':'')+fa(f.predicted_change_pct)+'٪</b></article><article><small>بازهٔ سناریو</small><b>'+toman(f.range?.low)+' تا '+toman(f.range?.high)+'</b></article></div><div class="ai-driver"><h4>کارنامهٔ آزمون تاریخی خارج از نمونه</h4><p>دقت تشخیص جهت: '+acc+' · تعداد نمونه‌های جهت: '+fa(v.directional_samples)+' · خطای مطلق مدل ترکیبی: '+fa(v.mae_pct)+'٪ · خطای مدل بدون تغییر: '+fa(v.naive_mae_pct)+'٪ · نمونه‌های آزمون: '+fa(v.samples)+'</p><p>مدل‌های ترکیبی: '+escapeHtml(JSON.stringify(f.model_weights||{}))+'</p></div><p>نسخهٔ مدل: '+escapeHtml(f.model_version)+' · زمان صدور: '+escapeHtml(f.issued_at||data.generated_at||'—')+' · منبع قیمت: '+escapeHtml(f.source||'—')+'</p><p>این خروجی سناریوی آماری است، نه تضمین یا توصیهٔ خریدوفروش.</p>';
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
 if(data.adaptive_reason){
  const v=data.adaptive_validation||{};
  html+='<div class="ai-driver"><h4>کنترل کیفیت مدل تطبیقی</h4><p>'+escapeHtml(data.adaptive_reason)+'</p><p>خطای مدل تطبیقی: '+(v.mae_pct==null?'—':new Intl.NumberFormat('fa-IR',{maximumFractionDigits:2}).format(v.mae_pct)+'٪')+' · خطای مدل بدون تغییر: '+(v.naive_mae_pct==null?'—':new Intl.NumberFormat('fa-IR',{maximumFractionDigits:2}).format(v.naive_mae_pct)+'٪')+'</p><p>به همین دلیل، عدد بالا فقط سناریوی روند آماریِ غیرتأییدشده است؛ نه پیش‌بینی معتبر و نه توصیهٔ خریدوفروش.</p></div>';
 }
 const quoteTime=data.quote?.source_time?new Intl.DateTimeFormat('fa-IR',{dateStyle:'short',timeStyle:'short'}).format(new Date(data.quote.source_time)):'نامشخص';
 if(data.quote?.warning_fa)html+='<p class="ai-summary">'+escapeHtml(data.quote.warning_fa)+'</p>';
 html+='<p>زمان نرخ مرجع: '+escapeHtml(quoteTime)+' · منبع قیمت: '+escapeHtml(data.quote?.source||'—')+'</p>';
 html+='<p>زمان تولید: '+escapeHtml(data.generated_at||'—')+' · منابع پیوندشده: '+escapeHtml(data.news_sources_count??sources.length)+' · منابع دارای تاریخِ قابل‌تأیید در ۷۲ ساعت اخیر: '+escapeHtml(data.recent_sources_count??'—')+' · '+escapeHtml(data.note_fa||'این خروجی احتمالی است، نه توصیهٔ معامله.')+'</p>';
 output.innerHTML=html;setStatus(data.adaptive_reason?'سناریوی آماری غیرتأییدشده · خبرخوان فعال':freeMode?'تحلیل رایگان آماده شد · بدون مدل مولد':(sources.length>=2?'گزارش هوش مصنوعی آماده شد · منابع پیوست شد':'گزارش آماده شد · منابع محدود'));
}

function formatNewsDate(value){
 const stamp=Date.parse(value||'');if(!Number.isFinite(stamp))return 'زمان انتشار نامشخص';
 return new Intl.DateTimeFormat('fa-IR',{dateStyle:'short',timeStyle:'short'}).format(new Date(stamp));
}
function safeNewsUrl(value){
 try{const url=new URL(value);return ['https:','http:'].includes(url.protocol)?url.href:''}catch{return ''}
}
function renderNews(data){
 const content=$('marketNewsContent'),status=$('marketNewsStatus');if(!content)return;
 const items=Array.isArray(data.items)?data.items:[],topics=Array.isArray(data.topics)?data.topics:[];
 if(status)status.textContent=items.length?new Intl.NumberFormat('fa-IR').format(items.length)+' خبر · '+new Intl.NumberFormat('fa-IR').format(data.source_count||0)+' منبع':'خبر تازه‌ای دریافت نشد';
 if(!items.length){content.innerHTML='<p class="market-news-empty">در ۷۲ ساعت اخیر خبر مرتبط و قابل‌تأییدی از منابع متصل پیدا نشد. خبر قدیمی یا نامرتبط به‌عنوان خبر تازه نمایش داده نمی‌شود.</p>';return}
 const topicHtml=topics.length?'<div class="market-news-topics">'+topics.slice(0,4).map(t=>'<span>'+escapeHtml(t.title_fa)+' · '+new Intl.NumberFormat('fa-IR').format(t.count||0)+'</span>').join('')+'</div>':'';
 content.innerHTML=topicHtml+'<div class="market-news-list">'+items.slice(0,8).map(item=>{
  const href=safeNewsUrl(item.url);if(!href)return '';
  return '<article class="market-news-item"><div class="market-news-meta"><span>'+escapeHtml(item.domain||'منبع خبری')+'</span><time>'+escapeHtml(formatNewsDate(item.published_at))+'</time></div><a href="'+escapeHtml(href)+'" target="_blank" rel="noopener noreferrer">'+escapeHtml(item.title||'خبر بازار')+' ↗</a></article>';
 }).join('')+'</div><p class="market-news-foot">خبرها از خوراک‌های خبری عمومی گردآوری شده‌اند؛ تیتر به‌تنهایی اثبات‌کنندهٔ اثر آن بر قیمت نیست.</p>';
}
async function loadNews(){
 const content=$('marketNewsContent'),status=$('marketNewsStatus'),base=endpoint();
 if(!content||!base)return;
 if(status)status.textContent='در حال به‌روزرسانی…';
 try{
  const response=await fetch(base.replace(/\/$/,'')+'/news',{headers:{accept:'application/json'},cache:'no-store',signal:AbortSignal.timeout(25000)});
  const data=await response.json();
  if(!response.ok||data.ok!==true)throw new Error(data.error||'خبرخوان پاسخ معتبر نداد.');
  renderNews(data);
 }catch(error){
  if(status)status.textContent='اتصال خبرخوان برقرار نشد';
  content.innerHTML='<p class="market-news-empty">خبرها فعلاً بارگیری نشدند. وضعیت سرویس تحلیل را بررسی کن؛ از نمایش تیترهای قدیمی به‌عنوان خبر تازه خودداری می‌شود.</p>';
 }
}

async function run(){
 const base=endpoint();
 if(!base){setStatus('اتصال سرویس تنظیم نشده');return}
 const asset=$('aiAsset')?.value||'USD_IRR_FREE';
 const horizon=$('aiHorizon')?.value||'7';
 runBtn.disabled=true;
 runBtn.innerHTML='<span class="ai-spark">✳</span> در حال ارزیابی موتور اختصاصی…';
 setStatus('در حال آزمون تاریخی و بررسی خبرها');
 output.innerHTML='<strong>در حال ارزیابی موتور اختصاصی بازار…</strong><p>قیمت، تاریخچه و خبرهای تازه بررسی می‌شوند. فقط اگر آزمون خارج از نمونه کیفیت کافی نشان بدهد، پیش‌بینی عددی منتشر خواهد شد.</p>';
 try{
  const root=base.replace(/\/$/,'');
  const healthRes=await fetch(root+'/health',{headers:{accept:'application/json'},cache:'no-store'});
  const health=await healthRes.json();
  if(!healthRes.ok||!health.ok)throw new Error('سرویس تحلیل در دسترس نیست.');
  const adaptive=Array.isArray(health.capabilities)&&health.capabilities.includes('adaptive-ensemble-forecast')&&health.forecast_ledger_enabled===true;
  if(!adaptive)throw new Error('موتور اختصاصی پیش‌بینی یا دفتر ثبت نتایج هنوز آماده نیست.');
  const res=await fetch(root+'/forecast/v2?asset='+encodeURIComponent(asset)+'&horizon_days='+encodeURIComponent(horizon),{headers:{accept:'application/json'},cache:'no-store'});
  const data=await res.json();
  if(!res.ok)throw new Error(data.error||'موتور اختصاصی پاسخ معتبر نداد ('+res.status+').');
  render(data);
  if(data.forecast?.status==='withheld')setStatus('کنترل کیفیت فعال · پیش‌بینی عددی تا تأیید شواهد متوقف است؛ خبرخوان مستقل روشن');
  else setStatus('موتور اختصاصی تطبیقی فعال · خبرخوان مستقل RSS روشن · بدون API خارجی');
 }catch(e){showError(e?.message||'اتصال ناموفق بود.');setStatus('خطای تحلیل')}
 finally{runBtn.disabled=false;runBtn.innerHTML='<span class="ai-spark">✳</span> تهیهٔ گزارش بازار <span>↗</span>'}
}
async function checkHealth(){
 const base=endpoint();
 if(!base){setStatus('اتصال سرویس تنظیم نشده');return}
 try{
  const res=await fetch(base.replace(/\/$/,'')+'/health',{headers:{accept:'application/json'},cache:'no-store'});
  const data=await res.json();
  if(!res.ok||!data.ok)throw Error('health check failed');
  if(data.database_configured!==true||data.database_schema_ready!==true){setStatus('پایگاه داده نیازمند بررسی است');return}
  const adaptive=Array.isArray(data.capabilities)&&data.capabilities.includes('adaptive-ensemble-forecast')&&data.forecast_ledger_enabled===true;
  if(!adaptive){setStatus('موتور اختصاصی هنوز آماده نیست');return}
  const refreshStatus=data.background_refresh_prerequisites_ready?'موتور آماری و خبرخوان RSS فعال · به‌روزرسانی خودکار روشن':'موتور آماری فعال · زمان‌بندی خودکار نیازمند بررسی';
  setStatus(refreshStatus+' · هوش تحلیلی اختصاصی فعال · بدون API خارجی');
 }catch{setStatus('سرویس در دسترس نیست')}
}
const saved=endpoint();if(endpointInput&&saved)endpointInput.value=saved;
$('saveAiEndpoint')?.addEventListener('click',saveEndpoint);runBtn?.addEventListener('click',run);
checkHealth();
loadNews();
window.setInterval(loadNews,15*60*1000);
window.addEventListener('dollar-ai-endpoint-updated',()=>{checkHealth();loadNews()});
})();