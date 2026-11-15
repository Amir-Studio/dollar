// English-pivot neural semantic engine for Dollar's multilingual news learner.
// BGE-M3 supplies pretrained multilingual semantic representations; reviewed ontology
// concepts provide grounded labels. External dictionary/news evidence is never auto-promoted.
import { getMarketLexicon } from "./market-lexicon-ontology.js";
import { extractUnknownVocabularyCandidates, lookupVocabularyMeaning } from "./language-learning-engine.js";

export const ENGLISH_NEURAL_VERSION = "bge-m3-en-pivot-1.0.0";
const MODEL = "@cf/baai/bge-m3";
const INDEX_KEY = "neural:english:bge-m3:index:v1";
const TTL = 60 * 60 * 24 * 30;
const BATCH = 48;

function vectorsOf(result) {
  const data = result?.data || result?.embeddings || result?.result?.data;
  if (!Array.isArray(data) || !Array.isArray(data[0])) throw new Error("Unsupported embedding response");
  return data.map(row => Array.from(row, Number));
}
function cosine(a,b) {
  let dot=0,aa=0,bb=0;
  for(let i=0;i<Math.min(a.length,b.length);i++){dot+=a[i]*b[i];aa+=a[i]*a[i];bb+=b[i]*b[i];}
  return aa&&bb?dot/Math.sqrt(aa*bb):0;
}
async function embed(ai,texts) {
  const out=vectorsOf(await ai.run(MODEL,{text:texts}));
  if(out.length!==texts.length) throw new Error("Embedding count mismatch");
  return out;
}
function concepts() {
  return getMarketLexicon({language:"en",limit:1000}).concepts
    .filter(x=>x.pivot?.term&&x.pivot?.definition)
    .map(x=>({id:x.id,term:x.pivot.term,definition:x.pivot.definition,
      equivalents:x.equivalents||{},near_miss:x.near_miss||x.pivot.near_miss||null,
      domain:x.domain||x.category||"financial_news"}));
}
async function loadIndex(env,rows) {
  if(env.MARKET_CACHE) {
    const saved=await env.MARKET_CACHE.get(INDEX_KEY,"json");
    if(saved?.ids?.length===rows.length&&saved?.vectors?.length===rows.length) return saved;
  }
  const vectors=[];
  for(let i=0;i<rows.length;i+=BATCH) {
    const part=rows.slice(i,i+BATCH);
    const input=part.map(x=>`Financial news concept: ${x.term}. Definition: ${x.definition}. Domain: ${x.domain}. Related language equivalents: ${Object.entries(x.equivalents).map(([k,v])=>k+":"+v.join(", ")).join("; ")}`);
    vectors.push(...await embed(env.AI,input));
  }
  const index={model:MODEL,version:ENGLISH_NEURAL_VERSION,ids:rows.map(x=>x.id),vectors};
  if(env.MARKET_CACHE) await env.MARKET_CACHE.put(INDEX_KEY,JSON.stringify(index),{expirationTtl:TTL});
  return index;
}
export async function analyzeEnglishNewsNeurally(text,env,options={}) {
  const source=String(text||"").normalize("NFKC").trim().slice(0,12000);
  if(!source) return {status:"empty_input",model:MODEL,matches:[],unknown_candidates:[]};
  if(!env?.AI?.run) return {status:"neural_binding_not_configured",model:MODEL,matches:[],unknown_candidates:[]};
  const rows=concepts();
  const additionalQueries=(Array.isArray(options.additionalQueries)?options.additionalQueries:[])
    .filter(x=>x&&typeof x.text==="string"&&x.text.trim())
    .slice(0,12).map(x=>({language:String(x.language||"und").slice(0,12),article_count:Number(x.article_count)||0,text:x.text.trim().slice(0,6000)}));
  const queryTexts=[source,...additionalQueries.map(x=>x.text)];
  const [queries,index]=await Promise.all([embed(env.AI,queryTexts),loadIndex(env,rows)]);
  const byId=new Map(rows.map(x=>[x.id,x]));
  const minimum=Number.isFinite(Number(options.minimumScore))?Number(options.minimumScore):0.30;
  const rankMatches=(query,limit)=>index.vectors.map((v,i)=>({...byId.get(index.ids[i]),
    semantic_score:Number(cosine(query,v).toFixed(5)),match_type:"pretrained_multilingual_neural_embedding"}))
    .filter(x=>x.id&&x.semantic_score>=minimum).sort((a,b)=>b.semantic_score-a.semantic_score)
    .slice(0,Math.max(1,Math.min(30,Number(limit)||15)));
  const query=queries[0];
  const matches=rankMatches(query,options.limit);
  const crossLanguageAnalyses=additionalQueries.map((item,i)=>({
    language:item.language,article_count:item.article_count,
    matches:rankMatches(queries[i+1],8),
    model:MODEL,semantic_mode:"cross_lingual_embedding_against_english_market_ontology"
  }));
  const unknown=extractUnknownVocabularyCandidates(source,"en",{limit:Math.max(1,Math.min(12,Number(options.unknownLimit)||8))});
  const termResearch = options.researchUnknown
    ? await Promise.all(unknown.slice(0,Math.max(0,Math.min(3,Number(options.researchLimit)||2))).map(x=>researchEnglishTerm(x.term,source,env)))
    : [];
  return {status:"neural_semantic_analysis_complete",model:MODEL,version:ENGLISH_NEURAL_VERSION,
    pivot_language:"en",concept_count:rows.length,embedding_dimension:query.length,matches,
    cross_language_analyses:crossLanguageAnalyses,
    analyzed_language_count:1+crossLanguageAnalyses.length,
    unknown_candidates:unknown,term_research:termResearch,
    learning_policy:"Multilingual inputs are compared with the reviewed English market ontology; unknown terms remain candidates and require evidence and review."};
}
export async function researchEnglishTerm(term,context="",env,fetchImpl=fetch) {
  const clean=String(term||"").normalize("NFKC").trim().slice(0,100);
  if(!clean) return {ok:false,status:"empty_term"};
  const cacheKey="neural:english:term-research:"+clean.toLowerCase().replace(/\\s+/g," ").slice(0,100);
  if(env?.MARKET_CACHE && fetchImpl===fetch) {
    const cached=await env.MARKET_CACHE.get(cacheKey,"json");
    if(cached) return {...cached,cache_hit:true};
  }
  const dictionary=await lookupVocabularyMeaning(clean,"en",fetchImpl);
  const query=new URLSearchParams({q:`"${clean}" economy OR finance OR markets OR policy`,hl:"en-US",gl:"US",ceid:"US:en"});
  let evidence=[];
  try {
    const response=await fetchImpl("https://news.google.com/rss/search?"+query.toString(),{
      headers:{accept:"application/rss+xml, application/xml, text/xml"},
      signal:AbortSignal.timeout(7000)
    });
    if(response.ok) {
      const xml=await response.text();
      const blocks=[...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)].slice(0,8);
      evidence=blocks.map(m=>{
        const title=m[1].match(/<title>([\s\S]*?)<\/title>/i)?.[1]||"";
        const link=m[1].match(/<link>([\s\S]*?)<\/link>/i)?.[1]||"";
        const date=m[1].match(/<pubDate>([\s\S]*?)<\/pubDate>/i)?.[1]||"";
        const decode=s=>s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,"$1").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&lt;/g,"<").replace(/&gt;/g,">").trim();
        return {title:decode(title).replace(/<[^>]*>/g,"").slice(0,260),url:decode(link).slice(0,1000),published_at:Date.parse(decode(date))?new Date(Date.parse(decode(date))).toISOString():null};
      }).filter(x=>x.title&&x.url);
    }
  } catch {}
  const result={ok:Boolean(dictionary.ok),term:clean,language:"en",dictionary,
    search_evidence:evidence,context_excerpt:String(context||"").slice(0,500),
    status:dictionary.ok&&evidence.length>=2?"candidate_review_with_dictionary_and_news_evidence":
      dictionary.ok?"candidate_review_dictionary_only":"needs_more_evidence",
    auto_learned:false};
  if(env?.MARKET_CACHE && fetchImpl===fetch) {
    try { await env.MARKET_CACHE.put(cacheKey,JSON.stringify(result),{expirationTtl:60*60*12}); } catch {}
  }
  return result;
}
export async function runEnglishNeuralSelfTest(ai) {
  if(!ai?.run) return {passed:false,skipped:true,reason:"Workers AI binding unavailable"};
  const v=await embed(ai,["Central bank raises its policy interest rate.","The monetary authority increases borrowing costs.","A football team wins its final match."]);
  const related=cosine(v[0],v[1]),unrelated=cosine(v[0],v[2]);
  return {passed:v[0].length>0&&related>unrelated,
    checks:{embedding_shape:v[0].length>0,financial_paraphrase_similarity:related,unrelated_similarity:unrelated},
    model:MODEL,version:ENGLISH_NEURAL_VERSION,
    scope:"Live model sanity check; not a measured translation or news-understanding accuracy score."};
}
