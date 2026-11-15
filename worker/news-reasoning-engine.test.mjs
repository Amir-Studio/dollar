import { test } from "node:test";
import assert from "node:assert/strict";
import { analyzeNewsWithReasoning, retrieveHistoryContext, runReasoningSelfTest, REASONING_VERSION } from "./news-reasoning-engine.js";

const json = value => new Response(JSON.stringify(value),{status:200,headers:{"content-type":"application/json"}});
const rss = `<?xml version="1.0"?><rss><channel><item><title>Central bank releases new inflation data</title><link>https://example.org/report</link><pubDate>Sun, 15 Nov 2026 10:00:00 GMT</pubDate></item></channel></rss>`;
const historyIndex = {updated_at:"2026-11-13",items:[{id:"history-of-us-dollar",title:"تاریخچه دلار آمریکا",description:"نهادهای پولی و نظام ارزی",keywords:["دلار","ارز","نرخ بهره"],json_url:"https://amir-studio.github.io/History/data/articles/history-of-us-dollar.json"}]};
const historyDoc = {id:"history-of-us-dollar",title:"تاریخچه دلار آمریکا",status:"draft",lastVerified:"2026-11-13",summary:"زمینه تاریخی نظام پولی دلار.",sections:[{heading:"نقاط عطف",paragraphs:["تغییرات نظام پولی باید در زمینه نهادی بررسی شوند."]}],sources:[{title:"Federal Reserve History",publisher:"Federal Reserve",url:"https://example.org/history"}]};
const mockFetch = async url => {
  const value=String(url);
  if(value.includes("data/index.json")) return json(historyIndex);
  if(value.includes("history-of-us-dollar.json")) return json(historyDoc);
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
});

test("reasoner searches when first pass identifies an evidence gap and then revises",async()=>{
  const outputs=[
    {comprehension:{event:"تصمیم بانک مرکزی"},facts:[],claims:[],causal_hypotheses:[],alternatives:[],counter_evidence_needed:[],history_usage:[],evidence_gaps:["داده رسمی کم است"],search_queries:["central bank inflation data policy"],provisional_conclusion:"نامشخص",confidence:.25,abstain:true},
    {comprehension:{event:"گزارش داده تورم"},facts:["یک گزارش مرتبط پیدا شد"],claims:[],causal_hypotheses:[],alternatives:["عوامل دیگر"],counter_evidence_needed:[],history_usage:[],source_assessment:[],unresolved_questions:[],conclusion:"هنوز برای نتیجه قطعی کافی نیست",confidence:.55,abstain:true,next_research:[]}
  ];
  const env={AI:{run:async()=>({response:JSON.stringify(outputs.shift())})}};
  const result=await analyzeNewsWithReasoning({
    news:[{id:"1",title:"بانک مرکزی و تورم",original_text:"بانک مرکزی داده‌های تورم را منتشر کرد.",language_code:"fa",domain:"example.org",url:"https://example.org/news",published_at:"2026-11-15T10:00:00Z"}],
    env,fetchImpl:mockFetch
  });
  assert.equal(result.ok,true);
  assert.equal(result.search.attempted,true);
  assert.equal(result.search.results.length,1);
  assert.equal(result.search.second_pass,"completed");
  assert.equal(result.abstained,true);
  assert.equal(result.analysis.conclusion,"هنوز برای نتیجه قطعی کافی نیست");
});

test("reasoner fails closed when AI binding is missing",async()=>{
  const result=await analyzeNewsWithReasoning({news:[{title:"خبر"}],env:{},fetchImpl:mockFetch});
  assert.equal(result.ok,false);
  assert.equal(result.status,"workers_ai_unavailable");
});
