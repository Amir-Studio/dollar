// Neural retrieval and evidence-based diagnostics over Dollar's complete English grammar curriculum.
import { getEnglishNewsVocabulary } from "./news-vocabulary-en.js";

export const ENGLISH_GRAMMAR_NEURAL_VERSION = "english-grammar-bge-m3-1.0.0";
const MODEL = "@cf/baai/bge-m3";
const INDEX_KEY = "language:english:grammar:bge-m3:v1";
const INDEX_TTL = 60 * 60 * 24 * 14;
const BATCH_SIZE = 32;

function cosine(a,b) {
  let dot=0,aa=0,bb=0;
  for(let i=0;i<Math.min(a.length,b.length);i++){dot+=a[i]*b[i];aa+=a[i]*a[i];bb+=b[i]*b[i];}
  return aa&&bb?dot/Math.sqrt(aa*bb):0;
}
function vectorsOf(result) {
  const data=result?.data||result?.embeddings||result?.result?.data;
  if(!Array.isArray(data)||!Array.isArray(data[0])) throw new Error("Invalid embedding response");
  return data.map(row=>Array.from(row,Number));
}
async function embed(ai,texts) {
  const result=vectorsOf(await ai.run(MODEL,{text:texts}));
  if(result.length!==texts.length) throw new Error("Embedding count mismatch");
  return result;
}
function curriculum() {
  const grammar=getEnglishNewsVocabulary({limit:1}).grammar;
  return grammar.rules.map((rule,index)=>({
    ...rule,
    curriculum_index:index,
    search_text:[rule.topic,rule.rule,rule.example,rule.exception].filter(Boolean).join(". ")
  }));
}
async function loadIndex(env, rules) {
  const fingerprint=rules.length+":"+rules.map(x=>x.id).join("|");
  if(env?.MARKET_CACHE) {
    try {
      const cached=await env.MARKET_CACHE.get(INDEX_KEY,"json");
      if(cached?.fingerprint===fingerprint&&cached?.vectors?.length===rules.length) return cached;
    } catch {}
  }
  const vectors=[];
  for(let i=0;i<rules.length;i+=BATCH_SIZE) {
    const batch=rules.slice(i,i+BATCH_SIZE);
    vectors.push(...await embed(env.AI,batch.map(x=>"English grammar topic: "+x.search_text)));
  }
  const index={model:MODEL,version:ENGLISH_GRAMMAR_NEURAL_VERSION,fingerprint,ids:rules.map(x=>x.id),vectors};
  if(env?.MARKET_CACHE) {
    try { await env.MARKET_CACHE.put(INDEX_KEY,JSON.stringify(index),{expirationTtl:INDEX_TTL}); } catch {}
  }
  return index;
}
function deterministicDiagnostics(text) {
  const s=String(text||"");
  const checks=[
    {id:"did_past_form",pattern:/\b(did|didn't|did not)\s+(went|saw|rose|fell|made|took|gave|became|was|were|had)\b/i,explanation:"پس از did/didn't فعل باید شکل ساده داشته باشد؛ مانند did go."},
    {id:"modal_to_infinitive",pattern:/\b(can|could|may|might|must|shall|should|will|would)\s+to\s+[a-z]+\b/i,explanation:"پس از modal معمولاً فعل ساده بدون to می‌آید."},
    {id:"third_person_missing_s",pattern:/\b(he|she|it|the bank|the government|the company)\s+(go|have|do|say|make|raise|fall|rise|increase|decrease)\b/i,explanation:"در حال ساده، فعل سوم‌شخص مفرد معمولاً s/es می‌گیرد؛ البته این الگو فقط یک هشدار احتمالی است."},
    {id:"article_before_singular_countable",pattern:/\b(a|an)\s+(information|advice|equipment|research|furniture)\b/i,explanation:"این اسم‌ها معمولاً غیرقابل‌شمارش‌اند و به‌طور معمول a/an مستقیم نمی‌گیرند."},
    {id:"double_comparative",pattern:/\b(more\s+\w+er|most\s+\w+est)\b/i,explanation:"از ساختار مقایسه‌ای یا عالی دوگانه پرهیز کنید."},
    {id:"despite_clause",pattern:/\bdespite\s+(the fact\s+)?(prices|rates|demand|inflation|they|the bank)\s+(fell|rose|increased|decreased|was|were|had)\b/i,explanation:"despite معمولاً اسم یا gerund می‌گیرد؛ برای جمله کامل از although استفاده کنید."}
  ];
  return checks.filter(x=>x.pattern.test(s)).map(x=>({id:x.id,explanation_fa:x.explanation,method:"high_precision_pattern_warning",certainty:"needs_context_review"}));
}
export async function analyzeEnglishGrammar(text,env,options={}) {
  const source=String(text||"").normalize("NFKC").trim().slice(0,5000);
  if(!source) return {status:"empty_input",version:ENGLISH_GRAMMAR_NEURAL_VERSION,matches:[],diagnostics:[]};
  const rules=curriculum();
  const diagnostics=deterministicDiagnostics(source);
  if(!env?.AI?.run) return {status:"neural_binding_not_configured",version:ENGLISH_GRAMMAR_NEURAL_VERSION,model:MODEL,rule_count:rules.length,matches:[],diagnostics,notice:"Rule-based warnings only; neural retrieval requires the Workers AI binding."};
  try {
    const [query,index]=await Promise.all([embed(env.AI,[source]),loadIndex(env,rules)]);
    const byId=new Map(rules.map(x=>[x.id,x]));
    const matches=index.vectors.map((vector,i)=>({...byId.get(index.ids[i]),semantic_score:Number(cosine(query[0],vector).toFixed(5)),match_type:"pretrained_neural_semantic_retrieval"}))
      .filter(x=>x.id).sort((a,b)=>b.semantic_score-a.semantic_score)
      .slice(0,Math.max(1,Math.min(12,Number(options.limit)||8)))
      .map(({search_text,...item})=>item);
    return {status:"neural_grammar_analysis_complete",version:ENGLISH_GRAMMAR_NEURAL_VERSION,model:MODEL,rule_count:rules.length,embedding_dimension:query[0].length,matches,diagnostics,interpretation:"Semantic retrieval finds relevant grammar knowledge; it does not by itself prove a sentence is correct or incorrect. Pattern warnings require contextual review."};
  } catch(error) {
    return {status:"neural_analysis_failed",version:ENGLISH_GRAMMAR_NEURAL_VERSION,model:MODEL,rule_count:rules.length,matches:[],diagnostics,error:String(error?.message||error).slice(0,180)};
  }
}
export function runEnglishGrammarNeuralSelfTest() {
  const rules=curriculum();
  const ids=new Set(rules.map(x=>x.id));
  const complete=rules.length>=200&&ids.size===rules.length&&rules.every(x=>x.topic&&x.rule&&x.example&&x.exception);
  const warnings=deterministicDiagnostics("The bank did went up. Investors must to wait. Despite prices fell, demand improved.");
  return {version:ENGLISH_GRAMMAR_NEURAL_VERSION,model:MODEL,total_rules:rules.length,unique_rules:ids.size,diagnostic_cases:3,diagnostics_detected:warnings.length,passed:complete&&warnings.length>=2,scope:"Curriculum coverage and deterministic warning regression; neural retrieval quality requires a live Workers AI benchmark."};
}
