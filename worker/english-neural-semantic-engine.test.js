import test from "node:test";
import assert from "node:assert/strict";
import { analyzeEnglishNewsNeurally, runEnglishNeuralSelfTest, researchEnglishTerm, ENGLISH_NEURAL_VERSION } from "./english-neural-semantic-engine.js";

function mockAI() {
  return {run:async (_model,{text})=>({data:text.map(value=>{
    const s=String(value).toLowerCase();
    if(s.includes("football team")) return [0,1,0];
    if(s.includes("central bank")||s.includes("interest rate")) return [1,0,0];
    return [0.8,0.2,0];
  })})};
}
function cache() { const values=new Map(); return {
  get:async key=>values.has(key)?values.get(key):null,
  put:async (key,value)=>{values.set(key,JSON.parse(value));}
};}

test("English pivot uses multilingual neural embeddings and returns ranked ontology concepts",async()=>{
  const result=await analyzeEnglishNewsNeurally("The central bank raises its interest rate.",{AI:mockAI(),MARKET_CACHE:cache()},{limit:5,minimumScore:0});
  assert.equal(result.status,"neural_semantic_analysis_complete");
  assert.equal(result.model,"@cf/baai/bge-m3");
  assert.equal(result.version,ENGLISH_NEURAL_VERSION);
  assert.equal(result.pivot_language,"en");
  assert.equal(result.embedding_dimension,3);
  assert.ok(result.matches.length>0);
  assert.ok(result.matches.every(x=>x.match_type==="pretrained_multilingual_neural_embedding"));
});

test("English neural self-test distinguishes a financial paraphrase from unrelated text",async()=>{
  const result=await runEnglishNeuralSelfTest(mockAI());
  assert.equal(result.passed,true,JSON.stringify(result));
});

test("English engine reports missing AI binding honestly",async()=>{
  const result=await analyzeEnglishNewsNeurally("Market liquidity is tightening.",{});
  assert.equal(result.status,"neural_binding_not_configured");
  assert.equal(result.matches.length,0);
});

test("English research combines dictionary lookup with independent news evidence without auto-learning",async()=>{
  const fakeFetch=async url=>{
    if(String(url).includes("wiktionary")) return new Response(JSON.stringify({English:[{partOfSpeech:"noun",definitions:[{definition:"A sustained increase in the general price level."}]}]}),{status:200,headers:{"content-type":"application/json"}});
    return new Response("<rss><channel><item><title>Inflation outlook changes</title><link>https://example.com/1</link><pubDate>Mon, 02 Nov 2026 10:00:00 GMT</pubDate></item><item><title>Central bank discusses inflation</title><link>https://example.com/2</link><pubDate>Mon, 02 Nov 2026 11:00:00 GMT</pubDate></item></channel></rss>",{status:200});
  };
  const result=await researchEnglishTerm("inflation","inflation outlook",{AI:{},},fakeFetch);
  assert.equal(result.ok,true);
  assert.equal(result.auto_learned,false);
  assert.equal(result.search_evidence.length,2);
});
