import { test } from "node:test";
import assert from "node:assert/strict";
import { analyzeNewsWithReasoning, retrieveHistoryContext, runReasoningSelfTest, saveReasoningFeedback, fetchArticleExcerpt, REASONING_VERSION } from "./news-reasoning-engine.js";

const json = value => new Response(JSON.stringify(value),{status:200,headers:{"content-type":"application/json"}});
const rss = `<?xml version="1.0"?><rss><channel><item><title>Central bank releases new inflation data</title><link>https://example.org/report</link><pubDate>Sun, 15 Nov 2026 10:00:00 GMT</pubDate><description>Central bank reports latest inflation and policy data.</description><source url="https://centralbank.example.org">Central Bank</source></item></channel></rss>`;
const historyIndex = {updated_at:"2026-11-13",items:[{id:"history-of-us-dollar",title:"تاریخچه دلار آمریکا",description:"نهادهای پولی و نظام ارزی",keywords:["دلار","ارز","نرخ بهره"],json_url:"https://amir-studio.github.io/History/data/articles/history-of-us-dollar.json"}]};
const historyArchiveIndex = {items:[{id:"news-central-bank-1",headline:"بانک مرکزی و نرخ بهره",summary:"گزارش تاریخی درباره سیاست پولی",category:"اقتصاد",json_url:"https://amir-studio.github.io/History/data/pending-review/news/news-central-bank-1.json"}]};
const historyArchiveRecord = {id:"news-central-bank-1",headline:"بانک مرکزی و نرخ بهره",status:"pending_review",published_at:"2026-11-15T10:00:00Z",summary:"گزارش ثبت‌شده برای بازبینی.",source_url:"https://example.org/archive",dollar_triage:{status:"summarize"}};
const historyDoc = {id:"history-of-us-dollar",title:"تاریخچه دلار آمریکا",status:"draft",lastVerified:"2026-11-13",summary:"زمینه تاریخی نظام پولی دلار.",sections:[{heading:"نقاط عطف",paragraphs:["تغییرات نظام پولی باید در زمینه نهادی بررسی شوند."]}],sources:[{title:"Federal Reserve History",publisher:"Federal Reserve",url:"https://example.org/history"}]};
const mockFetch = async url => {
  const value=String(url);
  if(value.includes("data/index.json")) return json(historyIndex);
  if(value.includes("history-of-us-dollar.json")) return json(historyDoc);
  if(value.includes("news-index.json")) return json(historyArchiveIndex);
  if(value.includes("news-central-bank-1.json")) return json(historyArchiveRecord);
  if(value.includes("news.google.com")) return new Response(rss,{status:200,headers:{"content-type":"application/xml"}});
  if(value.includes("example.org/report")) return new Response("<html><body><p>Central bank reports latest inflation and policy data in its official publication for the current reporting period.</p></body></html>",{status:200,headers:{"content-type":"text/html"}});
  throw new Error("unexpected URL "+value);
};

test("reasoning self-test is internally consistent",()=>{
  const result=runReasoningSelfTest();
  assert.equal(result.version,REASONING_VERSION);
  assert.equal(result.failed,0);
});

test("History retrieval preserves draft status and returns relevant source context",async()=>{
  const result=await retrieveHistoryContext([{title:"دلار و نرخ بهره آمریکا"}],mockFetch);
  assert.equal(result.status,"retrieved");
  assert.equal(result.documents[0].status,"draft");
  assert.equal(result.documents[0].sources[0].publisher,"Federal Reserve");
  assert.equal(result.news_archive[0].status,"pending_review");
  assert.equal(result.news_archive[0].triage.status,"summarize");
});

test("reasoner searches when first pass identifies an evidence gap and then revises",async()=>{
  const outputs=[
    {comprehension:{event:"تصمیم بانک مرکزی"},facts:[{statement:"دادهٔ رسمی تورم منتشر شده است.",source_ids:["news:1"],evidence:[]}],claims:[],causal_hypotheses:[],market_implications:[],alternatives:[],counter_evidence_needed:[],history_usage:[],evidence_gaps:["داده رسمی کم است"],search_queries:["central bank inflation data policy"],provisional_conclusion:"نامشخص",confidence:.25,abstain:true},
    {comprehension:{event:"گزارش داده تورم"},facts:[{statement:"یک گزارش مرتبط پیدا شد.",source_ids:["web:1"],evidence:[{source_id:"web:1",quote:"Central bank reports latest inflation and policy data in its official publication for the current reporting period."}]}],claims:[],causal_hypotheses:[],market_implications:[],alternatives:[],counter_evidence_needed:[],history_usage:[],source_assessment:[],unresolved_questions:[],conclusion:"هنوز برای نتیجه قطعی کافی نیست",confidence:.55,abstain:true,next_research:[]},
    {items:[{field:"facts",index:0,source_id:"web:1",verdict:"supports",reason:"نقل‌قول دقیقاً ادعای انتشار داده تورم را تأیید می‌کند."}]}
  ];
  const env={AI:{run:async()=>({response:JSON.stringify(outputs.shift())})}};
  const result=await analyzeNewsWithReasoning({
    news:[{id:"1",title:"بانک مرکزی و تورم",original_text:"بانک مرکزی داده‌های تورم را منتشر کرد.",language_code:"fa",domain:"example.org",url:"https://example.org/news",published_at:"2026-11-15T10:00:00Z"}],
    env,fetchImpl:mockFetch
  });
  assert.equal(result.ok,true);
  assert.equal(result.search.attempted,true);
  assert.equal(result.search.results.length,1);
  assert.match(result.search.results[0].snippet,/inflation and policy data/);
  assert.equal(result.search.results[0].publisher_domain,"centralbank.example.org");
  assert.equal(result.search.second_pass,"completed");
  assert.equal(result.abstained,true);
  assert.equal(result.analysis.conclusion,"هنوز برای نتیجه قطعی کافی نیست");
  assert.equal(result.evidence_audit.with_valid_references,1);
  assert.equal(result.evidence_audit.with_verified_quotes,1);
  assert.equal(result.entailment_audit.status,"completed");
  assert.equal(result.entailment_audit.supported_claims,1);
  assert.equal(result.evidence_audit.items[0].support_verified_source_ids[0],"web:1");
  assert.equal(result.evidence_sufficiency.verified_quote_coverage_pct,100);
  assert.equal(result.evidence_sufficiency.source_reference_coverage_pct,100);
});

test("reasoner fails closed when AI binding is missing",async()=>{
  const result=await analyzeNewsWithReasoning({news:[{title:"خبر"}],env:{},fetchImpl:mockFetch});
  assert.equal(result.ok,false);
  assert.equal(result.status,"workers_ai_unavailable");
});

test("only evidence-backed human corrections enter persistent reasoning memory",async()=>{
  const store=new Map();
  const env={MARKET_CACHE:{
    get:async key=>store.has(key)?JSON.parse(store.get(key)):null,
    put:async(key,value)=>store.set(key,value)
  }};
  const saved=await saveReasoningFeedback(env,{
    article_title:"گزارش نرخ بهره",issue_category:"causal_inference",
    correction:"هم‌زمانی دو رویداد برای اثبات رابطه علّی کافی نیست.",
    evidence_url:"https://example.org/primary-document"
  });
  assert.equal(saved.ok,true);
  assert.equal(saved.stored,1);
  const invalid=await saveReasoningFeedback(env,{
    article_title:"خبر",issue_category:"other",correction:"اصلاح کوتاه",
    evidence_url:"not-a-url"
  });
  assert.equal(invalid.ok,false);
});

test("headline-only History records force abstention before Workers AI is called",async()=>{
  let aiCalls=0;
  const env={AI:{run:async()=>{aiCalls++;throw new Error("AI must not run without source text");}}};
  const result=await analyzeNewsWithReasoning({
    news:[{id:"headline-only",title:"قیمت طلا و سکه امروز؛ بازار آرام شد",url:"https://example.org/news",
      domain:"example.org",language_code:"fa"}],
    env,fetchImpl:mockFetch
  });
  assert.equal(result.ok,true);
  assert.equal(result.status,"insufficient_source_text");
  assert.equal(result.abstained,true);
  assert.equal(result.confidence,0);
  assert.equal(result.source_coverage.title_or_metadata_only,1);
  assert.equal(aiCalls,0);
});

test("empty model analysis abstains when no evidence-backed claims exist",async()=>{
  const output={comprehension:{event:"گزارش اقتصادی"},facts:[],claims:[],causal_hypotheses:[],market_implications:[],
    alternatives:[],counter_evidence_needed:[],history_usage:[],evidence_gaps:[],search_queries:[],
    provisional_conclusion:"گزارش بررسی شد.",confidence:.9,abstain:false};
  const env={AI:{run:async()=>({response:JSON.stringify(output)})}};
  const result=await analyzeNewsWithReasoning({
    news:[{id:"1",title:"گزارش اقتصادی",original_text:"بانک مرکزی گزارش رسمی تازه‌ای درباره شاخص قیمت منتشر کرد.",language_code:"fa",domain:"example.org"}],
    env,fetchImpl:mockFetch
  });
  assert.equal(result.ok,true);
  assert.equal(result.abstained,true);
  assert.equal(result.evidence_audit.total,0);
});

test("invalid reasoning structure fails closed instead of inventing an analysis",async()=>{
  const env={AI:{run:async()=>({response:JSON.stringify({facts:[],claims:[],confidence:.9,abstain:false})})}};
  const result=await analyzeNewsWithReasoning({
    news:[{id:"1",title:"بانک مرکزی و تورم",original_text:"گزارش اقتصادی.",language_code:"fa",domain:"example.org"}],
    env,fetchImpl:mockFetch
  });
  assert.equal(result.ok,false);
  assert.equal(result.status,"initial_reasoning_failed");
});

test("unreferenced factual claims force abstention",async()=>{
  const output={comprehension:{event:"خبر اقتصادی"},facts:[{statement:"ادعای بدون منبع",source_ids:[],evidence:[]}],
    claims:[],causal_hypotheses:[],market_implications:[],alternatives:[],counter_evidence_needed:[],history_usage:[],
    evidence_gaps:[],search_queries:[],provisional_conclusion:"نامشخص",confidence:.95,abstain:false};
  const env={AI:{run:async()=>({response:JSON.stringify(output)})}};
  const result=await analyzeNewsWithReasoning({
    news:[{id:"1",title:"خبر اقتصادی",original_text:"متن خبر",language_code:"fa",domain:"example.org"}],
    env,fetchImpl:mockFetch
  });
  assert.equal(result.ok,true);
  assert.equal(result.abstained,true);
  assert.equal(result.evidence_audit.without_valid_references,1);
});

test("bounded payload remains valid JSON and keeps its article structure",async()=>{
  const output={comprehension:{event:"آزمون"},facts:[],claims:[],causal_hypotheses:[],market_implications:[],alternatives:[],
    counter_evidence_needed:[],history_usage:[],evidence_gaps:[],search_queries:[],provisional_conclusion:"نامشخص",confidence:.2,abstain:true};
  let received="";
  const env={AI:{run:async(_model,args)=>{received=args.messages[1].content;return {response:JSON.stringify(output)}}}};
  const news=Array.from({length:10},(_,i)=>({id:String(i),title:"خبر اقتصادی "+i,original_text:"متن ".repeat(800),language_code:"fa",domain:"example.org"}));
  const result=await analyzeNewsWithReasoning({news,env,fetchImpl:mockFetch});
  assert.equal(result.ok,true);
  assert.doesNotThrow(()=>JSON.parse(received));
  assert.ok(received.length<=18000);
});

test("publisher reader blocks redirects to private network addresses",async()=>{
  let calls=0;
  const result=await fetchArticleExcerpt("https://news.google.com/article",async()=>{
    calls++;
    return new Response(null,{status:302,headers:{location:"http://127.0.0.1/private"}});
  });
  assert.equal(result,"");
  assert.equal(calls,1);
});

test("publisher reader follows a bounded redirect to a public publisher",async()=>{
  let calls=0;
  const result=await fetchArticleExcerpt("https://news.google.com/article",async url=>{
    calls++;
    if(calls===1) return new Response(null,{status:302,headers:{location:"https://publisher.example.org/story"}});
    return new Response("<html><body><p>This is a sufficiently long publisher paragraph containing factual information about the central bank and its published inflation report.</p></body></html>",{status:200,headers:{"content-type":"text/html"}});
  });
  assert.match(result,/central bank/);
  assert.equal(calls,2);
});

test("source reference alone is not treated as verified evidence",async()=>{
  const output={comprehension:{event:"خبر"},facts:[{statement:"ادعای دارای لینک اما بدون نقل‌قول",source_ids:["news:1"],evidence:[]}],
    claims:[],causal_hypotheses:[],market_implications:[],alternatives:[],counter_evidence_needed:[],history_usage:[],
    evidence_gaps:[],search_queries:[],provisional_conclusion:"نامشخص",confidence:.99,abstain:false};
  const env={AI:{run:async()=>({response:JSON.stringify(output)})}};
  const result=await analyzeNewsWithReasoning({
    news:[{id:"1",title:"خبر اقتصادی",original_text:"متن خبر دارای اطلاعات واقعی برای بررسی.",language_code:"fa",domain:"example.org"}],
    env,fetchImpl:mockFetch
  });
  assert.equal(result.ok,true);
  assert.equal(result.abstained,true);
  assert.equal(result.evidence_audit.with_valid_references,1);
  assert.equal(result.evidence_audit.with_verified_quotes,0);
});

test("fabricated quote does not pass source evidence verification",async()=>{
  const output={comprehension:{event:"خبر"},facts:[{statement:"ادعای ساختگی",source_ids:["news:1"],
    evidence:[{source_id:"news:1",quote:"این جمله در متن منبع وجود ندارد و ساختگی است."}]}],
    claims:[],causal_hypotheses:[],market_implications:[],alternatives:[],counter_evidence_needed:[],history_usage:[],
    evidence_gaps:[],search_queries:[],provisional_conclusion:"نامشخص",confidence:.99,abstain:false};
  const env={AI:{run:async()=>({response:JSON.stringify(output)})}};
  const result=await analyzeNewsWithReasoning({
    news:[{id:"1",title:"خبر اقتصادی",original_text:"بانک مرکزی گزارش رسمی شاخص قیمت را در روز دوشنبه منتشر کرد.",language_code:"fa",domain:"example.org"}],
    env,fetchImpl:mockFetch
  });
  assert.equal(result.ok,true);
  assert.equal(result.abstained,true);
  assert.equal(result.evidence_audit.items[0].evidence_quotes[0].quote_verified,false);
});

test("evidence quote must refer to a declared source id",async()=>{
  const output={comprehension:{event:"خبر"},facts:[{statement:"ادعا",source_ids:["news:999"],
    evidence:[{source_id:"news:999",quote:"یک نقل قول فرضی با طول کافی برای بررسی تطبیق متن."}]}],
    claims:[],causal_hypotheses:[],market_implications:[],alternatives:[],counter_evidence_needed:[],history_usage:[],
    evidence_gaps:[],search_queries:[],provisional_conclusion:"نامشخص",confidence:.8,abstain:false};
  const env={AI:{run:async()=>({response:JSON.stringify(output)})}};
  const result=await analyzeNewsWithReasoning({
    news:[{id:"1",title:"خبر اقتصادی",original_text:"بانک مرکزی گزارش رسمی شاخص قیمت را منتشر کرد.",language_code:"fa",domain:"example.org"}],
    env,fetchImpl:mockFetch
  });
  assert.equal(result.ok,true);
  assert.equal(result.abstained,true);
  assert.equal(result.evidence_audit.items[0].evidence_quotes[0].source_exists,false);
});

test("semantic verifier rejects a quote that contradicts the claim",async()=>{
  const output={comprehension:{event:"نرخ بهره"},facts:[{statement:"بانک مرکزی نرخ بهره را افزایش داد.",
    source_ids:["news:1"],evidence:[{source_id:"news:1",quote:"بانک مرکزی اعلام کرد نرخ بهره بدون تغییر باقی می‌ماند و تصمیمی برای افزایش آن اتخاذ نشده است."}]}],
    claims:[],causal_hypotheses:[],market_implications:[],alternatives:[],counter_evidence_needed:[],history_usage:[],
    evidence_gaps:[],search_queries:[],provisional_conclusion:"نامشخص",confidence:.99,abstain:false};
  const verifier={items:[{field:"facts",index:0,source_id:"news:1",verdict:"contradicts",reason:"متن منبع صریحاً ثابت ماندن نرخ را اعلام می‌کند."}]};
  const env={AI:{run:async()=>({response:JSON.stringify(outputs.shift())})}};
  const outputs=[output,verifier];
  const result=await analyzeNewsWithReasoning({
    news:[{id:"1",title:"تصمیم نرخ بهره",original_text:"بانک مرکزی اعلام کرد نرخ بهره بدون تغییر باقی می‌ماند و تصمیمی برای افزایش آن اتخاذ نشده است.",language_code:"fa",domain:"example.org"}],
    env,fetchImpl:mockFetch
  });
  assert.equal(result.ok,true);
  assert.equal(result.entailment_audit.contradicted_claims,1);
  assert.equal(result.evidence_audit.items[0].support_verified_source_ids.length,0);
  assert.equal(result.abstained,true);
});

test("numeric claims cannot pass when cited evidence contains a different number",async()=>{
  const sourceQuote="بانک مرکزی نرخ تورم را ۵ درصد اعلام کرد.";
  const output={comprehension:{event:"اعلام نرخ تورم"},facts:[{statement:"بانک مرکزی نرخ تورم را ۱۰ درصد اعلام کرد.",
    source_ids:["news:1"],evidence:[{source_id:"news:1",quote:sourceQuote}]}],
    claims:[],causal_hypotheses:[],market_implications:[],alternatives:[],counter_evidence_needed:[],history_usage:[],
    evidence_gaps:[],search_queries:[],provisional_conclusion:"نامشخص",confidence:.99,abstain:false};
  const verifier={items:[{field:"facts",index:0,source_id:"news:1",verdict:"supports",reason:"فرض پاسخ‌دهندهٔ آزمون؛ باید کنترل عددی آن را رد کند."}]};
  const outputs=[output,verifier];
  const env={AI:{run:async()=>({response:JSON.stringify(outputs.shift())})}};
  const result=await analyzeNewsWithReasoning({
    news:[{id:"1",title:"نرخ تورم",original_text:sourceQuote,language_code:"fa",domain:"example.org"}],
    env,fetchImpl:mockFetch
  });
  assert.equal(result.ok,true);
  assert.equal(result.evidence_audit.items[0].evidence_quotes[0].numeric_fidelity,false);
  assert.equal(result.evidence_audit.items[0].support_verified_source_ids.length,0);
  assert.equal(result.abstained,true);
});

test("causal hypotheses require a mechanism, time order, confounders and falsification test",async()=>{
  const output={comprehension:{event:"تغییر نرخ بهره"},facts:[],claims:[],
    causal_hypotheses:[{statement:"افزایش نرخ بهره باعث تغییر ارز شد.",source_ids:[],evidence:[]}],market_implications:[],
    alternatives:[],counter_evidence_needed:[],history_usage:[],evidence_gaps:[],search_queries:[],
    provisional_conclusion:"نامشخص",confidence:.3,abstain:true};
  const env={AI:{run:async()=>({response:JSON.stringify(output)})}};
  const result=await analyzeNewsWithReasoning({
    news:[{id:"1",title:"نرخ بهره و ارز",original_text:"متن گزارش",language_code:"fa",domain:"example.org"}],
    env,fetchImpl:mockFetch
  });
  assert.equal(result.ok,false);
  assert.equal(result.status,"initial_reasoning_failed");
});
