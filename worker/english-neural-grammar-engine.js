// Neural retrieval and evidence-based diagnostics over Dollar's complete English grammar curriculum.
import { getEnglishNewsVocabulary } from "./news-vocabulary-en.js";

export const ENGLISH_GRAMMAR_NEURAL_VERSION = "english-grammar-bge-m3-1.1.0";
const MODEL = "@cf/baai/bge-m3";
const INDEX_KEY = "language:english:grammar:bge-m3:v2";
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
  const grammarItems=grammar.rules.map(rule=>({...rule,knowledge_type:"grammar_rule"}));
  const verbItems=grammar.irregular_verbs.map((verb,index)=>({
    id:"V"+String(index+1).padStart(3,"0"),
    topic:"English irregular verb: "+verb.base,
    rule:"Base form (V1): "+verb.base+"; simple past (V2): "+verb.past+"; past participle (V3): "+verb.participle+".",
    example:"V1 → V2 → V3: "+verb.base+" → "+verb.past+" → "+verb.participle+".",
    exception:"Slash-separated forms are accepted variants; select the form appropriate to dialect, meaning, and context.",
    knowledge_type:"irregular_verb"
  }));
  return [...grammarItems,...verbItems].map((rule,index)=>({
    ...rule,
    curriculum_index:index,
    search_text:[rule.topic,rule.rule,rule.example,rule.exception].filter(Boolean).join(". ")
  }));
}
async function loadIndex(env, rules) {
  const fingerprintSource=rules.map(x=>x.id+":"+x.search_text).join("|");
  let fingerprintHash=2166136261;
  for(let i=0;i<fingerprintSource.length;i++) fingerprintHash=Math.imul(fingerprintHash^fingerprintSource.charCodeAt(i),16777619);
  const fingerprint=rules.length+":"+((fingerprintHash>>>0).toString(16));
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

    ,{id:"if_will_future",pattern:/\bif\s+[^,.!?;]{1,80}\bwill\s+[a-z]+/i,explanation:"در شرطی واقعی آینده، بند if معمولاً حال ساده می‌گیرد."}
    ,{id:"present_perfect_finished_time",pattern:/\b(has|have)\s+[a-z]+(?:ed|en)\s+(yesterday|last week|last month|in 2010|two days ago)\b/i,explanation:"با زمان گذشتهٔ تمام‌شده معمولاً past simple به‌کار می‌رود."}
    ,{id:"past_perfect_missing_participle",pattern:/\bhad\s+(went|saw|ate|wrote|spoke|took|gave|did|was|were)\b/i,explanation:"پس از had در past perfect شکل سوم فعل لازم است."}
    ,{id:"passive_missing_participle",pattern:/\b(is|are|was|were|be|been)\s+(announce|write|choose|take|give|make|build|speak)\b/i,explanation:"در مجهول، be با شکل سوم فعل می‌آید."}
    ,{id:"gerund_after_preposition",pattern:/\b(interested in|look forward to|committed to|good at|instead of)\s+(to\s+)?[a-z]+\b/i,explanation:"پس از این ترکیب‌ها معمولاً اسم یا gerund می‌آید."}
    ,{id:"indirect_question_inversion",pattern:/\b(know|explain|tell me|wonder|asked)\s+[^.!?]{0,30}\b(why|where|when|what|how)\s+(do|does|did|is|are|was|were)\s+[^.!?]{1,50}/i,explanation:"در سؤال غیرمستقیم ترتیب جمله خبری است."}
    ,{id:"used_to_confusion",pattern:/\b(be|am|is|are|was|were)\s+used to\s+[a-z]+\b/i,explanation:"be used to به معنی عادت داشتن است و پس از to اسم یا gerund می‌آید."}
    ,{id:"fewer_less",pattern:/\bless\s+(people|countries|companies|reports|jobs|students)\b/i,explanation:"برای اسم‌های جمع شمارش‌پذیر، fewer معیارتر است."}
    ,{id:"subject_verb_agreement",pattern:/\b(the number of|each of|every one of)\s+[^,;.!?]{1,45}\s+(are|were|have)\b/i,explanation:"هستهٔ فاعل در the number of و each/every one مفرد است."}
    ,{id:"double_negative",pattern:/\b(don't|doesn't|didn't|isn't|aren't|wasn't|weren't)\s+\w+\s+no\s+\w+/i,explanation:"در انگلیسی معیار معمولاً منفی مضاعف برای یک نفی به‌کار نمی‌رود."}
    ,{id:"adjective_adverb",pattern:/\b(fell|rose|increased|decreased|changed|moved)\s+(sharp|rapid|significant|dramatic|steady)\b/i,explanation:"برای توصیف فعل معمولاً قید لازم است."}
    ,{id:"comparative_irregular",pattern:/\b(gooder|more better|more worse|badder|most best|most worst)\b/i,explanation:"صورت‌های درست: good/better/best و bad/worse/worst."}
    ,{id:"article_uncountable",pattern:/\b(a|an|many|few)\s+(information|advice|equipment|furniture|research|evidence)\b/i,explanation:"این اسم‌ها در کاربرد معمول غیرقابل‌شمارش‌اند."}
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
  const grammarRuleCount=rules.filter(x=>x.knowledge_type==="grammar_rule").length;
  const irregularVerbCount=rules.filter(x=>x.knowledge_type==="irregular_verb").length;
  const complete=grammarRuleCount>=200&&irregularVerbCount>=180&&ids.size===rules.length&&rules.every(x=>x.topic&&x.rule&&x.example&&x.exception);
  const challenge="The bank did went up. Investors must to wait. Despite prices fell, demand improved. If rates will rise, demand may fall. The minister has announced yesterday. The agency had went home. The proposal was write yesterday. I look forward to meet them. Can you explain why did rates rise? They are used to work late. There are less jobs. Each of the reports are ready. Prices fell sharp. This is more better. We need an information.";
  const warnings=deterministicDiagnostics(challenge);
  const required=["did_past_form","modal_to_infinitive","despite_clause","if_will_future","present_perfect_finished_time","past_perfect_missing_participle","passive_missing_participle","gerund_after_preposition","indirect_question_inversion","used_to_confusion","fewer_less","subject_verb_agreement","adjective_adverb","comparative_irregular","article_uncountable"];
  const detected=new Set(warnings.map(x=>x.id));
  const missed=required.filter(x=>!detected.has(x));
  return {version:ENGLISH_GRAMMAR_NEURAL_VERSION,model:MODEL,total_knowledge_items:rules.length,grammar_rule_count:grammarRuleCount,irregular_verb_count:irregularVerbCount,unique_items:ids.size,diagnostic_cases:required.length,diagnostics_detected:required.length-missed.length,missed,passed:complete&&missed.length===0,scope:"Curriculum and deterministic regression integrity only; this does not establish general grammatical understanding or learner mastery."};
}
