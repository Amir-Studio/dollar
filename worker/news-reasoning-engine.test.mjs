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
    {comprehension:{event:"تصمیم بانک مرکزی"},facts:[{statement:"دادهٔ رسمی تورم منتشر شده است.",source_ids:["news:1"]}],claims:[],causal_hypotheses:[],alternatives:[],counter_evidence_needed:[],history_usage:[],evidence_gaps:["داده رسمی کم است"],search_queries:["central bank inflation data policy"],provisional_conclusion:"نامشخص",confidence:.25,abstain:true},
    {comprehension:{event:"گزارش داده تورم"},facts:[{statement:"یک گزارش مرتبط پیدا شد.",source_ids:["web:1"]}],claims:[],causal_hypotheses:[],alternatives:[],counter_evidence_needed:[],history_usage:[],source_assessment:[],unresolved_questions:[],conclusion:"هنوز برای نتیجه قطعی کافی نیست",confidence:.55,abstain:true,next_research:[]}
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
  const output={comprehension:{event:"خبر اقتصادی"},facts:[{statement:"ادعای بدون منبع",source_ids:[]}],
    claims:[],causal_hypotheses:[],alternatives:[],counter_evidence_needed:[],history_usage:[],
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
  const output={comprehension:{event:"آزمون"},facts:[],claims:[],causal_hypotheses:[],alternatives:[],
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
