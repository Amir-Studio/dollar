(()=>{'use strict';
const $=id=>document.getElementById(id);
const endpointInput=$('aiEndpoint'),runBtn=$('runAiBtn'),output=$('aiOutput'),pill=$('aiStatusPill');
const STORAGE_KEY='dollar_ai_worker_endpoint_v1';
const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const toman=n=>Number.isFinite(Number(n))?new Intl.NumberFormat('fa-IR',{maximumFractionDigits:0}).format(Number(n))+' تومان':'—';
function setStatus(t){if(pill)pill.textContent=t}
function endpoint(){try{return localStorage.getItem(STORAGE_KEY)||''}catch{return ''}}
function validUrl(s){try{const u=new URL(s);return u.protocol==='https:'&&u.hostname.endsWith('.workers.dev')||u.protocol==='https:'&&u.hostname.includes('.')}catch{return false}}
function saveEndpoint(){const v=(endpointInput?.value||'').trim().replace(/\/$/,'');if(!v){setStatus('آدرس تنظیم نشده');return}if(!validUrl(v)){setStatus('آدرس HTTPS معتبر وارد کن');return}try{localStorage.setItem(STORAGE_KEY,v);window.dispatchEvent(new CustomEvent('dollar-ai-endpoint-updated'));setStatus('آدرس ذخیره شد');if(output)output.innerHTML='<strong>اتصال ذخیره شد.</strong><p>اکنون می‌توانی گزارش هوشمند را اجرا کنی. اگر سرویس هنوز مستقر نشده باشد، خطای اتصال نشان داده می‌شود.</p>'}catch{setStatus('ذخیره‌سازی در دسترس نیست')}}
function showError(message){output.innerHTML='<span class="ai-error">گزارش آماده نشد</span><p>'+escapeHtml(message)+'</p><p>آدرس Worker و وضعیت سرویس را بررسی کن. کلید API را داخل سایت وارد نکن.</p>'}
function render(data){
 const f=data.forecast||{},drivers=Array.isArray(data.drivers)?data.drivers:[],risks=Array.isArray(data.risks_fa)?data.risks_fa:[];
 const direction=f.direction==='up'?'تمایل صعودی':f.direction==='down'?'تمایل نزولی':'روند خنثی';
 const metrics=[['قیمت مرجع',toman(data.quote?.price)],['برآورد ۷روزه',toman(f.target_price)],['تغییر برآوردی',(Number(f.expected_change_pct)>0?'+':'')+new Intl.NumberFormat('fa-IR',{maximumFractionDigits:2}).format(Number(f.expected_change_pct))+'٪'],['اطمینان تحلیلی',new Intl.NumberFormat('fa-IR').format(Number(f.confidence)||0)+' از ۱۰۰']];
 let html='<div class="ai-kicker">AI MARKET BRIEFING · '+escapeHtml(data.asset_fa||data.asset||'بازار')+'</div><h3 class="ai-headline">'+escapeHtml(f.headline_fa||direction)+'</h3><p class="ai-summary">'+escapeHtml(f.summary_fa||'')+'</p><div class="ai-metrics">'+metrics.map(m=>'<article><small>'+m[0]+'</small><b>'+escapeHtml(m[1])+'</b></article>').join('')+'</div>';
 if(drivers.length)html+='<div class="ai-driver"><h4>عوامل اثرگذار</h4>'+drivers.map(d=>'<div class="ai-driver"><h4>'+escapeHtml(d.title_fa)+' · '+escapeHtml(({positive:'مثبت',negative:'منفی',mixed:'ترکیبی',unknown:'نامشخص'})[d.impact]||'ترکیبی')+'</h4><p>'+escapeHtml(d.explanation_fa)+' '+escapeHtml(d.evidence)+'</p></div>').join('')+'</div>';
 if(risks.length)html+='<div class="ai-driver"><h4>ریسک‌ها و محدودیت‌ها</h4><p>'+risks.map(escapeHtml).join(' · ')+'</p></div>';
 const sources=Array.isArray(data.sources)?data.sources:[];
 if(sources.length){
  html+='<div class="ai-driver"><h4>خبرها و گزارش‌های رسانه‌ای بررسی‌شده · '+escapeHtml(data.news_window_hours||72)+' ساعت اخیر</h4><p>لینک‌ها از جست‌وجوی وبِ همین گزارش گرفته شده‌اند. تاریخ انتشار فقط وقتی نشان داده می‌شود که منبع آن را ارائه کرده باشد.</p><div class="ai-news-list">'+sources.map(s=>{
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
 html+='<p>زمان تولید: '+escapeHtml(data.generated_at||'—')+' · منابع بررسی‌شده: '+escapeHtml(data.news_sources_count??sources.length)+' · این خروجی احتمالی است، نه توصیهٔ معامله.</p>';
 output.innerHTML=html;setStatus(sources.length>=2?'گزارش آماده شد · منابع پیوست شد':'گزارش آماده شد · منابع محدود');
}
async function run(){
 const base=endpoint();if(!base){setStatus('نیازمند اتصال');output.innerHTML='<strong>سرویس هوش مصنوعی هنوز به این سایت متصل نشده.</strong><p>در بخش «تنظیم اتصال تحلیلگر»، آدرس Worker مستقرشده را وارد و ذخیره کن. برای امنیت، کلید API فقط باید در Secretهای Cloudflare باشد.</p>';document.querySelector('.ai-setup details')?.setAttribute('open','');return}
 const asset=$('aiAsset')?.value||'USD_IRR_FREE';runBtn.disabled=true;runBtn.innerHTML='<span class="ai-spark">✳</span> در حال تحلیل خبرها و داده‌ها…';setStatus('در حال بررسی');output.innerHTML='<strong>در حال ساخت گزارش بازار…</strong><p>قیمت و تاریخچه بررسی می‌شود و سپس تحلیل خبری و منابع جمع‌بندی می‌شوند. این کار ممکن است کمی طول بکشد.</p>';
 try{const res=await fetch(base.replace(/\/$/,'')+'/forecast?asset='+encodeURIComponent(asset),{headers:{accept:'application/json'},cache:'no-store'});const data=await res.json();if(!res.ok)throw new Error(data.error||'سرویس پاسخ موفق نداد ('+res.status+')');render(data)}
 catch(e){showError(e?.message||'اتصال ناموفق بود.');setStatus('خطای اتصال')}
 finally{runBtn.disabled=false;runBtn.innerHTML='<span class="ai-spark">✳</span> تهیهٔ گزارش هوشمند <span>↗</span>'}
}
async function checkHealth(){
 const base=endpoint();
 if(!base){setStatus('نیازمند اتصال');return}
 try{
  const res=await fetch(base.replace(/\/$/,'')+'/health',{headers:{accept:'application/json'},cache:'no-store'});
  const data=await res.json();
  if(!res.ok||!data.ok)throw Error('health check failed');
  if(!data.configured){setStatus('کلید هوش مصنوعی تنظیم نشده');return}
  setStatus('سرویس متصل است');
 }catch{setStatus('سرویس در دسترس نیست')}
}
const saved=endpoint();if(endpointInput&&saved)endpointInput.value=saved;
$('saveAiEndpoint')?.addEventListener('click',saveEndpoint);runBtn?.addEventListener('click',run);
checkHealth();
window.addEventListener('dollar-ai-endpoint-updated',checkHealth);
})();