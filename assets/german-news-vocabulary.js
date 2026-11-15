(()=>{'use strict';
const $=id=>document.getElementById(id);
const API='https://oolfbjxclhzlbwjmzxxx.supabase.co/functions/v1/market-api/language/german-progress';
const PUBLISHABLE_KEY='sb_publishable_Q_eVY-Arb4hZQudDYrwy0Q_TbrUGAIv';
const LOCAL_KEY='dollar_german_news_progress_v1';
const ID_KEY='dollar_german_learner_id_v1';
const TOKEN_KEY='dollar_german_learner_token_v1';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const words=window.GERMAN_NEWS_VOCABULARY||[];
const categories={politics:'سیاست و دولت',economy:'اقتصاد',finance:'بودجه و مالیه',central_bank:'بانک مرکزی',labour:'بازار کار',energy:'انرژی و اقلیم',foreign_policy:'سیاست خارجی',society:'جامعه',justice:'حقوق و دادگستری',technology:'فناوری'};
let lesson=1,mode='learn',index=0,quiz=null,progress={known:[],learning:[],due:[],stats:{correct:0,attempted:0}},syncState='ذخیره محلی';
const now=()=>Date.now();
function readLocal(){try{const p=JSON.parse(localStorage.getItem(LOCAL_KEY)||'{}');if(p&&typeof p==='object')progress={...progress,...p,stats:{...progress.stats,...(p.stats||{})}};}catch{}}
function writeLocal(){try{localStorage.setItem(LOCAL_KEY,JSON.stringify(progress));}catch{}}
function learnerCredentials(){
 let id=localStorage.getItem(ID_KEY),token=localStorage.getItem(TOKEN_KEY);
 if(!id){id=crypto.randomUUID();localStorage.setItem(ID_KEY,id);}
 if(!token){const bytes=crypto.getRandomValues(new Uint8Array(32));token=btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');localStorage.setItem(TOKEN_KEY,token);}
 return {id,token};
}
async function sync(method='GET'){
 const {id,token}=learnerCredentials();
 try{
  const response=await fetch(API,{method,headers:{apikey:PUBLISHABLE_KEY,'content-type':'application/json','x-learner-id':id,'x-learner-token':token},...(method==='POST'?{body:JSON.stringify({progress})}:{})});
  if(!response.ok)throw Error('HTTP '+response.status);
  const result=await response.json();
  if(method==='GET'&&result.progress){progress={...progress,...result.progress,stats:{...progress.stats,...(result.progress.stats||{})}};writeLocal();}
  syncState=method==='GET'?'همگام‌سازی با Supabase انجام شد':'در Supabase ذخیره شد';
 }catch{syncState='ذخیره محلی؛ همگام‌سازی سرور در دسترس نیست';}
 updateProgress();
}
function updateProgress(){
 const known=new Set(progress.known||[]),count=known.size;
 $('germanKnown').textContent=count;
 $('germanDue').textContent=(progress.due||[]).length;
 $('germanPercent').textContent=Math.round(count/1000*100)+'٪';
 $('germanProgressFill').style.width=Math.min(100,count/1000*100)+'%';
 $('germanProgressNote').textContent=count+' واژه از هدف ۱۰۰۰ واژه ثبت شده · '+words.length+' واژه در نسخه فعلی آماده است';
 $('germanSync').textContent=syncState;
}
function currentWords(){return words.filter(w=>w.lesson===lesson);}
function renderLessons(){
 const holder=$('germanLessons');holder.innerHTML=Array.from({length:100},(_,i)=>{const n=i+1,available=n<=Math.ceil(words.length/10);return '<button class="german-lesson '+(n===lesson?'active':'')+'" data-lesson="'+n+'" '+(!available?'disabled':'')+'>درس '+String(n).padStart(2,'0')+(available?'':' · به‌زودی')+'</button>';}).join('');
 holder.querySelectorAll('[data-lesson]:not(:disabled)').forEach(b=>b.addEventListener('click',()=>{lesson=Number(b.dataset.lesson);index=0;renderLessons();renderLearn();}));
}
function renderLearn(){
 const list=currentWords();if(!list.length){$('germanContent').innerHTML='<div class="german-empty">این درس هنوز منتشر نشده است.</div>';return;}
 index=Math.max(0,Math.min(index,list.length-1));const w=list[index],known=new Set(progress.known||[]);
 $('germanContent').innerHTML='<div class="german-workspace-head"><span class="german-kicker">LESSON '+String(lesson).padStart(2,'0')+' / '+categories[w.category]+'</span><span class="german-sync">'+(index+1)+' از '+list.length+'</span></div><article class="german-word-card"><div class="german-category">'+esc(categories[w.category]||w.category)+'</div><h2 class="german-word" lang="de">'+esc(w.word)+'</h2><div class="german-forms">'+esc(w.form)+'</div><div class="german-ipa">'+esc(w.ipa)+'</div><div class="german-meaning">'+esc(w.fa)+'</div><div class="german-example"><p lang="de">'+esc(w.example)+'</p><p class="translation">'+esc(w.example_fa)+'</p></div><a class="inline-source" target="_blank" rel="noopener" href="'+esc(w.dictionary_url)+'">بررسی مدخل در DWDS ↗</a><div class="german-card-actions"><button class="german-action" id="germanPrev" '+(index===0?'disabled':'')+'>قبلی</button><button class="german-action" id="germanLearning">نیاز به مرور</button><button class="german-action primary" id="germanKnown">'+(known.has(w.id)?'یاد گرفتم ✓':'بلدم')+'</button><button class="german-action" id="germanNext" '+(index===list.length-1?'disabled':'')+'>بعدی</button></div></article>';
 $('germanPrev').onclick=()=>{index--;renderLearn();};
 $('germanNext').onclick=()=>{index++;renderLearn();};
 $('germanKnown').onclick=()=>{markKnown(w.id);};
 $('germanLearning').onclick=()=>{markLearning(w.id);};
}
function scheduleReview(id,repetitions=0,delayMs=86400000){
 const due=(progress.due||[]).filter(x=>x.id!==id);
 due.push({id,at:now()+delayMs,repetitions});
 progress.due=due;
}
function nextReviewDelay(repetitions){
 const days=[1,3,7,14,30];
 return days[Math.min(Math.max(0,repetitions-1),days.length-1)]*86400000;
}
function markKnown(id){
 const previous=(progress.due||[]).find(x=>x.id===id);
 const repetitions=(Number(previous?.repetitions)||0)+1;
 progress.known=[...new Set([...(progress.known||[]),id])];
 progress.learning=(progress.learning||[]).filter(x=>x!==id);
 scheduleReview(id,repetitions,nextReviewDelay(repetitions));
 writeLocal();sync('POST');const list=currentWords();if(index<list.length-1){index++;renderLearn();}else renderLearn();
}
function markLearning(id){
 progress.learning=[...new Set([...(progress.learning||[]),id])];
 scheduleReview(id,0,10*60*1000);
 writeLocal();sync('POST');renderLearn();
}
function chooseQuizQuestion(){
 const dueIds=new Set((progress.due||[]).filter(x=>x.at<=now()).map(x=>x.id));
 let pool=words.filter(w=>dueIds.has(w.id));
 if(!pool.length)pool=words.filter(w=>!(progress.known||[]).includes(w.id));
 if(!pool.length)pool=words;
 const target=pool[Math.floor(Math.random()*pool.length)];
 const distractors=words.filter(w=>w.id!==target.id).sort(()=>Math.random()-.5).slice(0,3);
 return {target,options:[target,...distractors].sort(()=>Math.random()-.5),answered:false};
}
function renderQuiz(){
 if(!quiz)quiz=chooseQuizQuestion();const w=quiz.target;
 $('germanContent').innerHTML='<div class="german-workspace-head"><span class="german-kicker">TRANSLATION QUIZ</span><span class="german-sync">درست: '+(progress.stats?.correct||0)+' / '+(progress.stats?.attempted||0)+'</span></div><div class="german-quiz"><div class="german-category">'+esc(categories[w.category])+'</div><h3 lang="de" dir="ltr">'+esc(w.word)+'</h3><p>معنی فارسی این واژه کدام است؟</p><div class="german-quiz-options">'+quiz.options.map((o,i)=>'<button data-option="'+i+'" '+(quiz.answered?'disabled':'')+'>'+esc(o.fa)+'</button>').join('')+'</div><div class="german-feedback" id="germanFeedback">'+(quiz.answered?'پاسخ ثبت شد.':'یک گزینه را انتخاب کن.')+'</div><div class="german-card-actions"><button class="german-action primary" id="germanNextQuestion">'+(quiz.answered?'سؤال بعدی':'رد شدن از سؤال')+'</button></div></div>';
 $('germanContent').querySelectorAll('[data-option]').forEach(btn=>btn.addEventListener('click',()=>answerQuiz(Number(btn.dataset.option))));
 $('germanNextQuestion').onclick=()=>{quiz=chooseQuizQuestion();renderQuiz();};
}
function answerQuiz(choice){
 if(!quiz||quiz.answered)return;quiz.answered=true;const selected=quiz.options[choice],correct=selected.id===quiz.target.id;
 progress.stats=progress.stats||{correct:0,attempted:0};progress.stats.attempted++;if(correct)progress.stats.correct++;
 if(correct){const previous=(progress.due||[]).find(x=>x.id===quiz.target.id);const repetitions=(Number(previous?.repetitions)||0)+1;progress.known=[...new Set([...(progress.known||[]),quiz.target.id])];progress.learning=(progress.learning||[]).filter(x=>x!==quiz.target.id);scheduleReview(quiz.target.id,repetitions,nextReviewDelay(repetitions));}
 else{progress.learning=[...new Set([...(progress.learning||[]),quiz.target.id])];scheduleReview(quiz.target.id,0,10*60*1000);}
 writeLocal();sync('POST');renderQuiz();
 $('germanFeedback').textContent=correct?'درست است! '+quiz.target.word+' — '+quiz.target.fa:'پاسخ درست: '+quiz.target.fa+' · '+quiz.target.word;
 const buttons=$('germanContent').querySelectorAll('[data-option]');
 buttons.forEach((b,i)=>{if(quiz.options[i].id===quiz.target.id)b.classList.add('correct');else if(i===choice)b.classList.add('wrong');});
}
function renderReview(){
 const dueRows=(progress.due||[]).filter(x=>Number(x.at)<=now());const ids=dueRows.map(x=>x.id);const due=words.filter(w=>ids.includes(w.id));
 if(!due.length){const upcoming=(progress.due||[]).length;$('germanContent').innerHTML='<div class="german-empty"><h3>واژه‌ای برای مرور در این لحظه سررسید نشده است.</h3><p>'+(upcoming?upcoming+' واژه برای مرور بعدی زمان‌بندی شده‌اند.':'واژه‌هایی که «نیاز به مرور» می‌زنند، در این بخش ظاهر می‌شوند.')+'</p><button class="german-action primary" id="germanReviewStart">شروع آزمون</button></div>';$('germanReviewStart').onclick=()=>{mode='quiz';renderTabs();quiz=chooseQuizQuestion();renderQuiz();};return;}
 $('germanContent').innerHTML='<div class="german-workspace-head"><span class="german-kicker">SPACED REVIEW</span><span class="german-sync">'+due.length+' واژه در صف مرور</span></div>'+due.map(w=>'<article class="german-example"><h3 class="german-word" lang="de">'+esc(w.word)+'</h3><p class="translation">'+esc(w.fa)+'</p><p lang="de">'+esc(w.example)+'</p><p class="translation">'+esc(w.example_fa)+'</p><div class="german-card-actions"><button class="german-action primary" data-reviewed="'+w.id+'">مرور شد</button></div></article>').join('');
 $('germanContent').querySelectorAll('[data-reviewed]').forEach(b=>b.onclick=()=>{const id=b.dataset.reviewed;const previous=(progress.due||[]).find(x=>x.id===id);const repetitions=(Number(previous?.repetitions)||0)+1;progress.known=[...new Set([...(progress.known||[]),id])];progress.learning=(progress.learning||[]).filter(x=>x!==id);scheduleReview(id,repetitions,nextReviewDelay(repetitions));writeLocal();sync('POST');renderReview();});
}
function renderTabs(){document.querySelectorAll('.german-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));}
function setMode(next){mode=next;renderTabs();if(mode==='learn')renderLearn();if(mode==='quiz'){quiz=chooseQuizQuestion();renderQuiz();}if(mode==='review')renderReview();}
document.querySelectorAll('.german-tabs button').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
$('germanSearch').addEventListener('input',e=>{
 const q=e.target.value.trim().toLocaleLowerCase('de');if(!q){renderLessons();setMode('learn');return;}
 const matches=words.filter(w=>[w.word,w.fa,w.example].join(' ').toLocaleLowerCase('de').includes(q));
 $('germanContent').innerHTML=matches.length?matches.map(w=>'<article class="german-example"><h3 class="german-word" lang="de">'+esc(w.word)+'</h3><p class="translation">'+esc(w.fa)+'</p><p lang="de">'+esc(w.example)+'</p><p class="translation">'+esc(w.example_fa)+'</p></article>').join(''):'<div class="german-empty">واژه‌ای پیدا نشد.</div>';
});
$('germanSearch').addEventListener('keydown',e=>{if(e.key==='Escape'){e.target.value='';renderLessons();setMode('learn');}});
$('germanExport').onclick=()=>{const blob=new Blob([JSON.stringify(progress,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='german-news-vocabulary-progress.json';a.click();URL.revokeObjectURL(url);};
readLocal();renderLessons();renderLearn();updateProgress();sync('GET');
window.addEventListener('online',()=>sync('POST'));
})();