// Dollar news reading-comprehension engine v1.0
// Sentence-local discourse and claim extraction. Deterministic and explicitly non-LLM.
export const NEWS_READING_VERSION = "dollar-news-reading-1.0.0";

const norm = value => String(value ?? "")
  .replace(/[ي]/g,"ی").replace(/[ك]/g,"ک").replace(/\u200c/g," ")
  .replace(/[۰-۹٠-٩]/g,c=>String(c.charCodeAt(0)-(c.charCodeAt(0)>=0x06f0?0x06f0:0x0660)))
  .replace(/[ًٌٍَُِّْ]/g,"").toLocaleLowerCase("en-US")
  .replace(/\s+/g," ").trim();

const PATTERNS = {
  modalityEn:/\b(may|might|could|would|should|possibly|potentially|likely|unlikely|expected to|projected to|forecast to|plans to|intends to|is set to|is due to)\b/i,
  modalityFa:/(?:ممکن است|احتمال دارد|احتمالا|احتمالاً|پیش‌بینی می‌شود|پیش بینی می شود|برآورد می‌شود|برآورد می شود|شاید|می‌تواند|می توانند|قرار است|قصد دارد|درصدد است|بعید است)/i,
  conditionalEn:/\b(if|unless|provided that|subject to|in the event that|assuming that)\b/i,
  conditionalFa:/(?:اگر|مگر اینکه|در صورت|مشروط به|به شرط اینکه|چنانچه)/,
  negationEn:/\b(not|no|never|neither|nor|cannot|can't|won't|wouldn't|didn't|doesn't|don't|hasn't|haven't|hadn't|isn't|aren't|wasn't|weren't|denied|ruled out|failed to)\b/i,
  negationFa:/(?:نیست|نبود|نشد|نمی‌شود|نمی شود|نخواهد|نکرد|نکرده|ن(?:می|خواهد|تواند)|نداد|نپذیرفت|تکذیب|رد کرد|منتفی|به تصویب نرسیده|تصویب نشده|هرگز|هیچ‌کدام|هیچ کدام)/,
  attributionEn:/\b(according to|said|says|say|reported|reports|announced|announces|denied|warned|claimed|stated|noted|estimated|projected|forecast|forecasts|disclosed|confirmed)\b/i,
  attributionFa:/(?:به گفته|طبق گزارش|بر اساس گزارش|گزارش داد|گزارش می‌دهد|اعلام کرد|اعلام کردند|اظهار کرد|اظهار داشت|گفت|هشدار داد|هشدار دادند|تأکید کرد|تصریح کرد|مدعی شد|تکذیب کرد|برآورد کرد|پیش‌بینی کرد|پیش بینی کرد)/,
  causalEn:/\b(because|because of|due to|owing to|therefore|thereby|as a result|consequently|led to|leads to|resulted in|contributed to|stemming from|driven by)\b/i,
  causalFa:/(?:زیرا|چون|به دلیل|در نتیجه|از این رو|بنابراین|باعث شد|منجر به|ناشی از|در پیِ|در پی)/,
  contrastEn:/\b(however|although|though|whereas|while|nevertheless|nonetheless|despite|but|by contrast|on the other hand)\b/i,
  contrastFa:/(?:با این حال|بااین‌حال|اگرچه|هرچند|در حالی که|درحالیکه|برخلاف|از سوی دیگر|(?:^|[\s،؛,.])(?:اما|ولی)(?=$|[\s،؛,.]))/,
  comparisonEn:/\b(compared|comparison|compares|compare|compared with|compared to|higher than|lower than|more than|less than|as much as|as many as|one third|one-third|twice as|half as|versus|vs\.?)\b/i,
  comparisonFa:/(?:در مقایسه با|مقایسه می‌کند|مقایسه کرد|مقایسه|بیشتر از|کمتر از|بالاتر از|پایین‌تر از|دو برابر|نصفِ|یک‌سوم|یک سوم|در برابر)/,
  forecastEn:/\b(forecast|forecasts|forecasted|project|projects|projected|outlook|expects|expected|anticipates|anticipate)\b/i,
  forecastFa:/(?:پیش‌بینی|پیش بینی|چشم‌انداز|چشم انداز|انتظار می‌رود|انتظار می رود|برآورد)/,
  pastEn:/\b(yesterday|last week|last month|last year|previously|earlier|ago|was|were|announced|rose|fell|increased|decreased|resumed|suspended|halted|delayed|approved|rejected|denied|remained|stated|warned)\b/i,
  futureEn:/\b(tomorrow|next week|next month|next year|will|going to|by \d{4})\b/i,
  pastFa:/(?:دیروز|هفته گذشته|ماه گذشته|سال گذشته|پیش‌تر|قبلاً|اعلام کرد|افزایش (?:یافت|داد|دادند|پیدا کرد)|کاهش (?:یافت|داد|دادند|پیدا کرد)|بالا رفت|افت کرد|کاهش پیدا کرد|تعلیق درآورد|از سر گرفت|ازسرگرفت|تکذیب کرد|تصویب کرد|هشدار داد|شد|بود)/,
  futureFa:/(?:فردا|هفته آینده|ماه آینده|سال آینده|خواهد|قرار است|تا پایان سال|تا سال آینده)/
};

const ACTIONS = [
  {id:"increase",en:/\b(raise|raises|raised|increase|increases|increased|rise|rises|rose|surge|surged|climb|climbed|expand|expanded)\b/i,fa:/(?:افزایش (?:یافت|داد|دهد|یابد|داده|پیدا کرد|نداد|نمی‌دهد|نمی دهد)|بالا رفت|صعود کرد|رشد کرد|گسترش یافت|بیشتر شد)/},
  {id:"decrease",en:/\b(cut|cuts|cutting|reduce|reduces|reduced|fall|falls|fell|decline|declined|drop|dropped|slump|slumped|ease|eased)\b/i,fa:/(?:کاهش (?:یافت|داد|دهد|دهند|پیدا کرد|پیدا می‌کند|پیدا می کند|می‌یابد|می یابد)|پایین آمد|افت کرد|سقوط کرد|کم شد|کمتر شد)/},
  {id:"hold",en:/\b(hold|held|keep unchanged|remain unchanged|remained unchanged|maintain|maintained)\b/i,fa:/(?:بدون تغییر نگه داشت|ثابت ماند|بدون تغییر باقی ماند|بدون تغییر ماند|حفظ کرد)/},
  {id:"deny",en:/\b(deny|denies|denied|reject|rejected|rule out|ruled out)\b/i,fa:/(?:تکذیب کرد|رد کرد|منتفی دانست)/},
  {id:"announce",en:/\b(announce|announces|announced|state|stated|say|said|reported)\b/i,fa:/(?:اعلام کرد|اعلام کردند|گفت(?:\s|:|$)|گزارش داد|اظهار کرد)/},
  {id:"expect",en:/\b(expect|expects|expected|forecast|forecasts|project|projects|projected|anticipate|anticipates)\b/i,fa:/(?:انتظار می‌رود|پیش‌بینی می‌شود|برآورد می‌شود|پیش‌بینی کرد)/},
  {id:"approve",en:/\b(approve|approves|approved|authorize|authorized|pass|passed)\b/i,fa:/(?:تصویب کرد|تصویب شد|تصویب نشده|به تصویب نرسیده|موافقت کرد|مجوز داد)/},
  {id:"delay",en:/\b(delay|delays|delayed|postpone|postponed|defer|deferred)\b/i,fa:/(?:به تعویق انداخت|تعویق افتاد|به تأخیر انداخت|تأخیر|تاخیر)/},
  {id:"resume",en:/\b(resume|resumes|resumed|restart|restarted|reopen|reopened)\b/i,fa:/(?:از سر گرفت|ازسرگرفت|از سر گرفته شد|ازسرگیری)/},
  {id:"halt",en:/\b(halt|halts|halted|suspend|suspends|suspended|stop|stopped|freeze|froze)\b/i,fa:/(?:متوقف کرد|متوقف شد|تعلیق کرد|تعلیق شد|تعلیق درآورد|توقف یافت)/},
  {id:"fund",en:/\b(fund|funds|funded|funding|finance|financed)\b/i,fa:/(?:تأمین مالی|تامین مالی|بودجه تأمین|بودجه تامین|تأمین بودجه|تامین بودجه|تأمین اعتبار کرد|تامین اعتبار کرد|تأمین اعتبار|تامین اعتبار|بودجه اختصاص داد)/},
  {id:"request",en:/\b(request|requests|requested|ask|asks|asked|seek|seeks|sought)\b/i,fa:/(?:درخواست کرد|درخواست کردند|درخواست داده|خواستار شد|خواسته‌ایم|خواسته اند|تقاضا کرد)/},
  {id:"provide",en:/\b(provide|provides|provided|supply|supplies|supplied)\b/i,fa:/(?:فراهم کرد|فراهم کند|ارائه کرد|ارائه دهد|تأمین کند|تامین کند)/},
  {id:"upgrade",en:/\b(upgrade|upgrades|upgraded|modernize|modernized|improve|improved)\b/i,fa:/(?:ارتقا داد|ارتقاء داد|به‌روزرسانی کرد|نوسازی کرد|بهبود داد)/},
  {id:"negotiate",en:/\b(negotiate|negotiates|negotiated|discuss|discussed)\b/i,fa:/(?:مذاکره کرد|گفتگو کرد|گفت‌وگو کرد|رایزنی کرد|صحبت کرد)/},
  {id:"sign",en:/\b(sign|signs|signed|signing)\b/i,fa:/(?:امضا کرد|امضا شد|امضا کردند)/},
  {id:"invest",en:/\b(invest|invests|invested|investment)\b/i,fa:/(?:سرمایه‌گذاری کرد|سرمایه گذاری کرد|سرمایه‌گذاری شد)/},
  {id:"borrow",en:/\b(borrow|borrows|borrowed|borrowing)\b/i,fa:/(?:وام گرفت|قرض گرفت|استقراض کرد)/},
  {id:"pay",en:/\b(pay|pays|paid|repay|repaid)\b/i,fa:/(?:پرداخت کرد|پرداخت شد|بازپرداخت کرد)/},
  {id:"buy",en:/\b(buy|buys|bought|purchase|purchased)\b/i,fa:/(?:خرید|خریداری کرد|خریداری شد)/},
  {id:"sell",en:/\b(sell|sells|sold)\b/i,fa:/(?:فروخت|به فروش رساند|فروش رفت)/},
  {id:"sanction",en:/\b(sanction|sanctions|sanctioned|impose sanctions|lift sanctions)\b/i,fa:/(?:تحریم کرد|تحریم‌ها را اعمال کرد|تحریم را لغو کرد)/},
  {id:"launch",en:/\b(launch|launches|launched|introduce|introduced|roll out|rolled out)\b/i,fa:/(?:راه‌اندازی کرد|راه اندازی کرد|معرفی کرد|عرضه کرد)/},
  {id:"allocate",en:/\b(allocate|allocates|allocated|earmark|earmarked|assign|assigned)\b/i,fa:/(?:اختصاص یافت|اختصاص داد|اختصاص داده شد|تخصیص یافت|تخصیص داد|تأمین اعتبار کرد|تامین اعتبار کرد|تامین اعتبار شد|تأمین اعتبار شد)/},
  {id:"continue",en:/\b(continue|continues|continued|remain in operation|keep operating)\b/i,fa:/(?:ادامه پیدا کند|ادامه می‌دهد|ادامه دهد|ادامه یافت|ادامه دارد|تداوم فعالیت|بدون وقفه ادامه)/},
  {id:"export",en:/\b(export|exports|exported|ship|ships|shipped)\b/i,fa:/(?:صادرات[^،؛.]{0,60}انجام می‌شود|صادر می‌شود|صادر شد)/},
  {id:"reduce",en:/\b(reduction|reducing|reduced|cutting)\b/i,fa:/(?:کاهش(?:\s|\u200c|ِ|ی|\d|۲۰|۲۵))/},
  {id:"reach",en:/\b(reach|reaches|reached|hit|hits|amounted to)\b/i,fa:/(?:رسید|می‌رسد|خواهد رسید|به فروش معادل)/},
  {id:"operate",en:/\b(operate|operates|operated|run|runs|ran)\b/i,fa:/(?:فعالیت می‌کند|فعالیت دارند|فعالیت کند|فعالیت کنند|به فعالیت ادامه)/}
];

function detectLanguage(text) {
  const fa=(String(text).match(/[\u0600-\u06ff]/g)||[]).length;
  const en=(String(text).match(/[A-Za-z]/g)||[]).length;
  return fa>=en?"fa":"en";
}
function splitSentences(text) {
  return String(text||"").replace(/\s+/g," ").split(/(?<=[.!?؟])\s+|(?<=؛)\s+/u).map(x=>x.trim()).filter(Boolean).slice(0,30);
}
function extractAnchors(sentence) {
  const numbers=[];
  const re=/(?:[$€£]\s?)?\b\d{1,3}(?:,\d{3})*(?:\.\d+)?\s?(?:%|percent|per cent|percentage points?|basis points?|bps|million|billion|trillion|USD|EUR|dollars?|euros?|barrels?|bbl|دلار|یورو|درصد|واحد درصد|میلیون|میلیارد|هزار|بشکه)?/gi;
  for(const m of sentence.matchAll(re)){
    const raw=m[0].trim();
    if(!/\d/.test(raw)) continue;
    const value=Number((raw.match(/\d{1,3}(?:,\d{3})*(?:\.\d+)?/)||[""])[0].replace(/,/g,""));
    const unit=(raw.match(/%|percent|per cent|percentage points?|basis points?|bps|million|billion|trillion|USD|EUR|dollars?|euros?|barrels?|bbl|دلار|یورو|درصد|واحد درصد|میلیون|میلیارد|هزار|بشکه/i)||[])[0]||null;
    const at=m.index||0;
    numbers.push({raw,value,unit,context:sentence.slice(Math.max(0,at-45),Math.min(sentence.length,at+raw.length+45)).trim()});
  }
  const wordDurations=[];
  const enNums={one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,twenty:20,thirty:30};
  const faNums={"یک":1,"دو":2,"سه":3,"چهار":4,"پنج":5,"شش":6,"هفت":7,"هشت":8,"نه":9,"ده":10,"یازده":11,"دوازده":12,"بیست":20,"سی":30};
  for(const m of sentence.matchAll(/\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|twenty|thirty)\s+(days?|weeks?|months?|years?)\b/gi)) wordDurations.push({value:enNums[m[1].toLowerCase()],unit:m[2].toLowerCase(),raw:m[0]});
  for(const m of sentence.matchAll(/(یک|دو|سه|چهار|پنج|شش|هفت|هشت|نه|ده|یازده|دوازده|بیست|سی)\s+(روز|هفته|ماه|سال)/g)) wordDurations.push({value:faNums[m[1]],unit:m[2],raw:m[0]});
  const years=[...norm(sentence).matchAll(/\b(?:19|20)\d{2}\b/g)].map(m=>Number(m[0]));
  const relativeTime=[...sentence.matchAll(/\b(today|yesterday|tomorrow|last week|next week|last month|next month|last year|next year|currently|previously|later|earlier|by year-end|over the coming months)\b/gi)].map(m=>m[0].toLowerCase());
  const relativeFa=[...sentence.matchAll(/(امروز|دیروز|فردا|هفته گذشته|هفته آینده|ماه گذشته|ماه آینده|سال گذشته|سال آینده|در حال حاضر|اکنون|پیش‌تر|بعداً|تا پایان سال)/g)].map(m=>m[0]);
  return {numbers,years,word_durations:wordDurations,relative_time:[...relativeTime,...relativeFa]};
}
function splitClauses(sentence) {
  const marker=/(,|،|;|؛|\b(?:although|however|whereas|while|but|because|if|unless|therefore|despite|nevertheless|as a result)\b|(?<![\p{L}\p{N}])(?:با این حال|بااین‌حال|اما|ولی|اگرچه|هرچند|در حالی که|درحالیکه|اگر|مگر اینکه|زیرا|چون|بنابراین|در نتیجه)(?![\p{L}\p{N}]))/giu;
  const pieces=[];
  let last=0, pending=null, match;
  while((match=marker.exec(sentence))!==null){
    const before=sentence.slice(last,match.index).trim();
    if(before) pieces.push({text:before,connector_before:pending});
    pending=match[0].trim().toLowerCase();
    last=marker.lastIndex;
  }
  const tail=sentence.slice(last).trim();
  if(tail) pieces.push({text:tail,connector_before:pending});
  return pieces.length?pieces:[{text:sentence,connector_before:null}];
}
function clauseRelation(marker) {
  if(!marker) return "main_clause_or_unmarked";
  if(/^(although|however|whereas|while|but|nevertheless|اما|ولی|اگرچه|هرچند|با این حال|بااین‌حال|در حالی که|درحالیکه)$/i.test(marker)) return "contrast_or_concession";
  if(/^(if|unless|اگر|مگر اینکه)$/i.test(marker)) return "condition";
  if(/^(because|زیرا|چون)$/i.test(marker)) return "cause_or_reason";
  if(/^(therefore|as a result|بنابراین|در نتیجه)$/i.test(marker)) return "result_or_conclusion";
  return "clause_boundary";
}
function inspectSentence(sentence,index) {
  const language=detectLanguage(sentence);
  const p=PATTERNS;
  const modality=p.modalityFa.test(sentence)||p.modalityEn.test(sentence);
  const conditional=p.conditionalFa.test(sentence)||p.conditionalEn.test(sentence);
  const negated=(p.negationFa.test(sentence)||p.negationEn.test(sentence)) && !/\bnot only\b/i.test(sentence);
  const attributed=p.attributionFa.test(sentence)||p.attributionEn.test(sentence);
  const causal=p.causalFa.test(sentence)||p.causalEn.test(sentence);
  const contrast=p.contrastFa.test(sentence)||p.contrastEn.test(sentence);
  const comparison=p.comparisonFa.test(sentence)||p.comparisonEn.test(sentence);
  const forecast=p.forecastFa.test(sentence)||p.forecastEn.test(sentence);
  const tense=(p.futureFa.test(sentence)||p.futureEn.test(sentence))?"future":(p.pastFa.test(sentence)||p.pastEn.test(sentence))?"past":"unspecified";
  const actions=ACTIONS.filter(a=>a.fa.test(sentence)||a.en.test(sentence)).map(a=>a.id);
  const anchors=extractAnchors(norm(sentence));
  const actorMatches=[
    ["federal_reserve",/\b(federal reserve|fed)\b/i,/فدرال رزرو|بانک مرکزی آمریکا/],
    ["central_bank",/\bcentral bank\b/i,/بانک مرکزی/],
    ["government",/\bgovernment|ministry|cabinet\b/i,/دولت|وزارتخانه|وزارت/],
    ["imf",/\b(imf|international monetary fund)\b/i,/صندوق بین‌المللی پول|صندوق بین المللی پول/],
    ["opec",/\bopec\+?\b/i,/اوپک/],
    ["company",/\b(company|firm|corporation)\b/i,/شرکت/],
    ["congress",/\b(congress|u\.s\. congress|senate|house of representatives)\b/i,/کنگره|مجلس سنا|مجلس نمایندگان/],
    ["transport_ministry",/\b(transport minister|ministry of transport|transportation department)\b/i,/وزیر حمل و نقل|وزیر راه|وزارت حمل و نقل|وزارت راه/],
    ["minister",/\b(minister|secretary)\b/i,/وزیر|دبیر/],
    ["regulator",/\b(regulator|regulatory authority|watchdog)\b/i,/نهاد ناظر|رگولاتور|سازمان ناظر/],
    ["parliament",/\b(parliament|legislature)\b/i,/پارلمان|مجلس/],
    ["air_traffic_control",/\b(air traffic control|air navigation)\b/i,/کنترل تردد هوایی|کنترل ترافیک هوایی/],
    ["investors",/\binvestors?\b/i,/سرمایه‌گذاران|سرمایه گذاران/],
    ["meta",/\bmeta platforms?\b/i,/متا/],
    ["us_government",/\b(us government|u\.s\. government|united states government|state department)\b/i,/دولت آمریکا|وزارت خارجه آمریکا|وزارت امور خارجه آمریکا/],
    ["nuclear_program",/\b(nuclear program|nuclear activities)\b/i,/فعالیت‌های هسته‌ای|فعالیت های هسته ای|برنامه هسته‌ای|برنامه هسته ای/],
    ["gas_industry",/\b(natural gas|gas consumption|industrial units)\b/i,/گاز طبیعی|مصرف گاز|واحدهای صنعتی|صنایع/],
    ["customs",/\b(customs|customs authority)\b/i,/گمرک|گمرکات/],
    ["province",/\b(provincial|province)\b/i,/استان|استانداری/],
    ["film_industry",/\b(cinema|box office|film industry)\b/i,/سینما|فروش فیلم|مخاطب/],
    ["construction_projects",/\bconstruction projects?\b/i,/پروژه‌های عمرانی|پروژه های عمرانی|طرح‌های عمرانی|طرح های عمرانی/]
  ];
  const actors=actorMatches.filter(x=>x[1].test(sentence)||x[2].test(sentence)).map(x=>x[0]);
  const pronounAmbiguity=(language==="fa"?/\b(آن|این|آنها|ایشان|وی|او)\b/:/\b(it|they|them|this|that|these|those|he|she)\b/i).test(sentence);
  const sourceCue=(sentence.match(/(?:به گفته|طبق گزارش|بر اساس گزارش|گزارش|اعلام کرد|گفت|اظهار داشت|هشدار داد)[^،؛.]*/)||sentence.match(/(?:according to|[^,;]{1,70}\b(?:said|reported|announced|stated|warned|denied|forecast)\b)[^,;.]*/i)||[])[0]||null;
  const assertionClass=conditional?"conditional":modality?"possible_or_forecast":negated?"negated_or_denied":attributed?"attributed_statement":"asserted_in_text";
  const clauses=splitClauses(sentence).map((part,clauseIndex)=>{
    const clause=part.text;
    return {
      clause_index:clauseIndex+1,
      text:clause,
      connector_before:part.connector_before,
      relation_to_previous:clauseRelation(part.connector_before),
      actor_candidates:actorMatches.filter(x=>x[1].test(clause)||x[2].test(clause)).map(x=>x[0]),
      action_concepts:ACTIONS.filter(a=>a.fa.test(clause)||a.en.test(clause)).map(a=>a.id),
      negated:(p.negationFa.test(clause)||p.negationEn.test(clause))&&!/\bnot only\b/i.test(clause),
      conditional:p.conditionalFa.test(clause)||p.conditionalEn.test(clause),
      modal:p.modalityFa.test(clause)||p.modalityEn.test(clause)
    };
  });
  return {
    sentence_index:index+1,language,text:sentence,
    actors:[...new Set(actors)],action_concepts:[...new Set(actions)],
    assertion_class:assertionClass,
    modality,conditional,negated,attributed,causal,contrast,comparison,forecast,tense,
    source_cue:sourceCue,
    clauses,
    anchors,
    ambiguity_flags:[
      ...(pronounAmbiguity?["pronoun_reference_requires_context"]:[]),
      ...(anchors.numbers.some(n=>!n.unit)?["number_without_explicit_unit"]:[]),
      ...(sentence.length>420?["long_sentence_may_need_clause_split"]:[])
    ]
  };
}
function extractDiscourseLinks(frames) {
  const links=[];
  for(let i=0;i<frames.length;i++){
    const f=frames[i];
    if(f.conditional) links.push({from_sentence:f.sentence_index,relation:"condition",to_sentence:f.sentence_index,certainty:"explicit_marker"});
    if(f.causal) links.push({from_sentence:f.sentence_index,relation:"causal_claim_in_text",to_sentence:f.sentence_index,certainty:"linguistic_marker_only"});
    if(f.contrast) links.push({from_sentence:f.sentence_index,relation:"contrast_or_concession",to_sentence:f.sentence_index,certainty:"explicit_marker"});
    if(f.attributed) links.push({from_sentence:f.sentence_index,relation:"source_attribution",to_sentence:f.sentence_index,source_cue:f.source_cue});
    if(i>0 && f.anchors.years.length && frames[i-1].anchors.years.length && f.anchors.years[0]!==frames[i-1].anchors.years[0]){
      links.push({from_sentence:frames[i-1].sentence_index,relation:"different_time_anchor",to_sentence:f.sentence_index,certainty:"explicit_years"});
    }
  }
  return links;
}
export function analyzeNewsReading(title,body,publishedAt=null) {
  const cleanTitle=String(title||"").trim();
  const cleanBody=String(body||"").trim();
  const content=[cleanTitle,cleanBody].filter(Boolean).join(". ");
  const sentences=splitSentences(content);
  const frames=sentences.map(inspectSentence);
  const allText=content;
  const lang=detectLanguage(allText);
  const counts={
    sentences:frames.length,
    conditional:frames.filter(x=>x.conditional).length,
    possible_or_forecast:frames.filter(x=>x.modality||x.forecast).length,
    negated:frames.filter(x=>x.negated).length,
    attributed:frames.filter(x=>x.attributed).length,
    causal:frames.filter(x=>x.causal).length,
    contrast:frames.filter(x=>x.contrast).length,
    comparisons:frames.filter(x=>x.comparison).length
  };
  const allNumbers=frames.flatMap(f=>f.anchors.numbers.map(n=>({...n,sentence_index:f.sentence_index})));
  const claims=frames.map(frame=>({
    claim_id:"sentence_"+frame.sentence_index,
    sentence_index:frame.sentence_index,
    text:frame.text,
    actor_candidates:frame.actors,
    action_concepts:frame.action_concepts,
    clauses:frame.clauses,
    polarity:frame.negated?"negated":"not_explicitly_negated",
    certainty:frame.conditional?"conditional":frame.modality?"uncertain_or_possible":frame.forecast?"forecast_or_projection":frame.attributed?"attributed_statement":"asserted_in_text",
    claim_source_status:frame.attributed?"attributed_in_article_not_independently_verified":"no_explicit_source_marker",
    attribution:frame.attributed?{present:true,source_cue:frame.source_cue}:{present:false,source_cue:null},
    temporal_scope:{tense:frame.tense,years:frame.anchors.years,relative_time:frame.anchors.relative_time},
    quantities:frame.anchors.numbers,
    word_durations:frame.anchors.word_durations,
    completeness:frame.actors.length&&frame.action_concepts.length?"partial_structured_claim":"incomplete_claim_frame",
    verification_state:"not_verified_by_text_parser"
  }));
  const referenceDate=publishedAt&&Number.isFinite(Date.parse(publishedAt))?new Date(publishedAt):new Date();
  const referenceYear=referenceDate.getUTCFullYear();
  for(const frame of frames){
    frame.anchors.year_directions=frame.anchors.years.map(year=>({year,direction:year<referenceYear?"before_reference_year":year>referenceYear?"after_reference_year":"reference_year"}));
  }
  const issues=[];
  if(!cleanBody) issues.push("headline_only_no_article_body");
  if(cleanBody.length>0&&cleanBody.length<220) issues.push("short_excerpt_may_omit_qualifications");
  if(frames.some(f=>f.ambiguity_flags.includes("pronoun_reference_requires_context"))) issues.push("some_pronoun_references_need_prior_context");
  if(frames.some(f=>f.ambiguity_flags.includes("number_without_explicit_unit"))) issues.push("some_numbers_have_no_explicit_unit");
  if(frames.length>=30) issues.push("sentence_limit_reached");
  const status=cleanBody.length===0?"insufficient_text":issues.includes("short_excerpt_may_omit_qualifications")?"partial_text":"parsed_excerpt";
  return {
    version:NEWS_READING_VERSION,
    language:lang,
    input_coverage:{title_chars:cleanTitle.length,body_chars:cleanBody.length,total_chars:content.length,mode:cleanBody.length?"headline_plus_excerpt":"headline_only"},
    reading_status:status,
    sentence_frames:frames,
    claims,
    discourse_links:extractDiscourseLinks(frames),
    extracted_numbers:allNumbers.slice(0,50),
    counts,
    limitations:issues,
    interpretation_policy:"A detected linguistic marker is not proof that the underlying claim is true. Attribution is not independent verification. Modality and condition must be preserved. Missing context requires abstention."
  };
}

const CASES = [
  {lang:"en",text:"The central bank raised rates yesterday.",expected:{tense:"past",actions:["increase"],modality:false,conditional:false,negated:false,attributed:false}},
  {lang:"en",text:"The central bank may raise rates next month.",expected:{tense:"future",actions:["increase"],modality:true,conditional:false,negated:false,attributed:false}},
  {lang:"en",text:"The central bank did not raise rates.",expected:{actions:["increase"],negated:true}},
  {lang:"en",text:"According to the ministry, inflation fell by 2%.",expected:{actions:["decrease"],attributed:true}},
  {lang:"en",text:"If oil prices rise, inflation could accelerate.",expected:{conditional:true,modality:true,actions:["increase"]}},
  {lang:"en",text:"Although exports increased, imports fell.",expected:{contrast:true,actions:["increase","decrease"]}},
  {lang:"en",text:"The report does not say that the policy failed.",expected:{negated:true,attributed:true}},
  {lang:"en",text:"The forecast projects growth of 2.5% in 2027.",expected:{forecast:true,anchors_year:2027}},
  {lang:"en",text:"The company denied that it had delayed the project.",expected:{negated:true,attributed:true,actions:["delay"]}},
  {lang:"en",text:"Gold rose 3%, while the dollar fell 1%.",expected:{contrast:true,actions:["increase","decrease"]}},
  {lang:"en",text:"The proposal is subject to parliamentary approval.",expected:{conditional:true}},
  {lang:"en",text:"The government plans to cut spending.",expected:{modality:true,actions:["decrease"]}},
  {lang:"en",text:"The rate remained unchanged.",expected:{actions:["hold"]}},
  {lang:"en",text:"The report compared inflation in 2025 with inflation in 2026.",expected:{comparison:true,anchors_year:2025}},
  {lang:"en",text:"The agreement has not yet been approved.",expected:{negated:true,actions:["approve"]}},
  {lang:"en",text:"Officials warned that the outlook remains uncertain.",expected:{attributed:true}},
  {lang:"en",text:"Oil shipments resumed after the disruption.",expected:{actions:["resume"],tense:"past"}},
  {lang:"en",text:"The regulator suspended the company's license.",expected:{actions:["halt"],tense:"past"}},
  {lang:"en",text:"The measure could reduce inflation, but the effect is uncertain.",expected:{modality:true,contrast:true,actions:["decrease"]}},
  {lang:"en",text:"The IMF forecast growth at 3% next year.",expected:{forecast:true,attributed:true}},
  {lang:"fa",text:"بانک مرکزی دیروز نرخ بهره را افزایش داد.",expected:{tense:"past",actions:["increase"]}},
  {lang:"fa",text:"بانک مرکزی ممکن است ماه آینده نرخ بهره را افزایش دهد.",expected:{modality:true,actions:["increase"]}},
  {lang:"fa",text:"بانک مرکزی نرخ بهره را افزایش نداد.",expected:{negated:true,actions:["increase"]}},
  {lang:"fa",text:"طبق گزارش وزارت اقتصاد، تورم دو درصد کاهش یافت.",expected:{attributed:true,actions:["decrease"]}},
  {lang:"fa",text:"اگر قیمت نفت افزایش یابد، تورم ممکن است بیشتر شود.",expected:{conditional:true,modality:true,actions:["increase"]}},
  {lang:"fa",text:"اگرچه صادرات افزایش یافت، واردات کاهش پیدا کرد.",expected:{contrast:true,actions:["increase","decrease"]}},
  {lang:"fa",text:"دولت اعلام کرد که این طرح هنوز تصویب نشده است.",expected:{attributed:true,negated:true,actions:["approve"]}},
  {lang:"fa",text:"پیش‌بینی می‌شود رشد اقتصادی در سال ۲۰۲۷ به سه درصد برسد.",expected:{forecast:true,modality:true}},
  {lang:"fa",text:"شرکت تأخیر در اجرای پروژه را تکذیب کرد.",expected:{attributed:true,negated:true,actions:["deny","delay"]}},
  {lang:"fa",text:"قیمت طلا سه درصد افزایش یافت، اما نرخ دلار یک درصد کاهش پیدا کرد.",expected:{contrast:true,actions:["increase","decrease"]}},
  {lang:"fa",text:"اجرای این تصمیم مشروط به تصویب مجلس است.",expected:{conditional:true}},
  {lang:"fa",text:"دولت قصد دارد هزینه‌ها را کاهش دهد.",expected:{modality:true,actions:["decrease"]}},
  {lang:"fa",text:"نرخ ارز بدون تغییر باقی ماند.",expected:{actions:["hold"]}},
  {lang:"fa",text:"این گزارش تورم سال ۲۰۲۵ را با سال ۲۰۲۶ مقایسه می‌کند.",expected:{comparison:true,anchors_year:2025}},
  {lang:"fa",text:"این توافق هنوز به تصویب نرسیده است.",expected:{negated:true,actions:["approve"]}},
  {lang:"fa",text:"مقام‌ها هشدار دادند که چشم‌انداز اقتصادی نامطمئن است.",expected:{attributed:true}},
  {lang:"fa",text:"ارسال محموله‌های نفتی پس از اختلال از سر گرفته شد.",expected:{actions:["resume"],tense:"past"}},
  {lang:"fa",text:"نهاد ناظر مجوز شرکت را به حالت تعلیق درآورد.",expected:{actions:["halt"],tense:"past"}},
  {lang:"fa",text:"این سیاست ممکن است تورم را کاهش دهد، اما نتیجه قطعی نیست.",expected:{modality:true,contrast:true,actions:["decrease"]}},
  {lang:"fa",text:"صندوق بین‌المللی پول رشد اقتصادی را برای سال آینده سه درصد پیش‌بینی کرد.",expected:{forecast:true,attributed:true}},
  {lang:"fa",text:"دو سال است که درباره ارتقای سامانه گفت‌وگو می‌کنیم.",expected:{duration_value:2}},
  {lang:"en",text:"The agency requested funding two years ago.",expected:{duration_value:2,tense:"past",actions:["request"]}},
  {lang:"en",text:"The central bank اعلام کرد rates will remain unchanged.",expected:{attributed:true,actions:["hold"]}},
  {lang:"fa",text:"اگر oil prices rise, the dollar may weaken.",expected:{conditional:true,modality:true,actions:["increase"]}},
  {lang:"en",text:"Although exports increased, imports fell.",expected:{clause_count:2,clause_actions:[["increase"],["decrease"]]}},
  {lang:"en",text:"The bank did not raise rates, but it cut lending.",expected:{clause_count:2,clause_polarity:["negative","positive"]}},
  {lang:"fa",text:"اگر قیمت نفت افزایش یابد، بانک مرکزی ممکن است نرخ بهره را افزایش دهد.",expected:{clause_count:2,conditional_clause:true}},
  {lang:"fa",text:"دولت این خبر را تکذیب کرد، اما مذاکرات ادامه یافت.",expected:{clause_count:2,clause_relation:"contrast_or_concession",first_action:"deny"}},
  {lang:"fa",text:"فعالیت واحدهای صنعتی و تولیدی بدون وقفه ادامه پیدا کند.",expected:{negated:false,clause_negated:false,clause_count:1,actions:["continue"]}},
  {lang:"fa",text:"کالاهای تولیدی خوزستان با شرایط مشخص امکان صادرات دارند.",expected:{clause_count:1}},
  {lang:"fa",text:"صادرات از مرزهای خوزستان انجام می‌شود.",expected:{actions:["export"]}},
  {lang:"fa",text:"استان ۳۲ پروژه را از محل مالیات تأمین اعتبار کرد.",expected:{actions:["allocate","fund"]}}
];

export function runNewsReadingBenchmark() {
  const results=CASES.map((item,index)=>{
    const frame=inspectSentence(item.text,0);
    const e=item.expected;
    const checks=[];
    for(const key of ["tense","modality","conditional","negated","attributed","causal","contrast","comparison","forecast"]){
      if(e[key]!==undefined) checks.push({key,passed:frame[key]===e[key]});
    }
    if(e.actions) checks.push({key:"actions",passed:e.actions.every(x=>frame.action_concepts.includes(x))});
    if(e.anchors_year) checks.push({key:"anchors_year",passed:frame.anchors.years.includes(e.anchors_year)});
    if(e.duration_value) checks.push({key:"duration_value",passed:frame.anchors.word_durations.some(x=>x.value===e.duration_value)});
    if(e.clause_count) checks.push({key:"clause_count",passed:frame.clauses.length===e.clause_count});
    if(e.clause_actions) checks.push({key:"clause_actions",passed:e.clause_actions.every((actions,i)=>actions.every(a=>frame.clauses[i]?.action_concepts.includes(a)))});
    if(e.clause_polarity) checks.push({key:"clause_polarity",passed:e.clause_polarity.every((polarity,i)=>frame.clauses[i]&&(polarity==="negative"?frame.clauses[i].negated:!frame.clauses[i].negated))});
    if(e.clause_relation) checks.push({key:"clause_relation",passed:frame.clauses[1]?.relation_to_previous===e.clause_relation});
    if(e.conditional_clause) checks.push({key:"conditional_clause",passed:frame.clauses.some(c=>c.conditional||c.relation_to_previous==="condition")});
    if(e.first_action) checks.push({key:"first_action",passed:frame.clauses[0]?.action_concepts.includes(e.first_action)});
    if(e.clause_negated!==undefined) checks.push({key:"clause_negated",passed:frame.clauses[0]?.negated===e.clause_negated});
    return {id:index+1,language:item.lang,text:item.text,passed:checks.every(x=>x.passed),checks,actual:{tense:frame.tense,modality:frame.modality,conditional:frame.conditional,negated:frame.negated,attributed:frame.attributed,causal:frame.causal,contrast:frame.contrast,comparison:frame.comparison,forecast:frame.forecast,actions:frame.action_concepts,years:frame.anchors.years}};
  });
  const passed=results.filter(x=>x.passed).length;
  const byLanguage={};
  for(const lang of ["en","fa"]){
    const subset=results.filter(x=>x.language===lang);
    byLanguage[lang]={total:subset.length,passed:subset.filter(x=>x.passed).length,failed:subset.filter(x=>!x.passed).map(x=>({id:x.id,text:x.text,checks:x.checks.filter(c=>!c.passed)}))};
  }
  return {version:NEWS_READING_VERSION,benchmark:"sentence_level_bilingual_reading_comprehension_regression",total:results.length,passed,failed:results.length-passed,score_pct:Number((passed/results.length*100).toFixed(1)),by_language:byLanguage,failures:results.filter(x=>!x.passed)};
}
