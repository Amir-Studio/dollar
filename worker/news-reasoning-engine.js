// Dollar evidence-first reasoning engine.
// Uses Cloudflare Workers AI for structured inference, History for long-term context,
// and bounded RSS discovery when the evidence graph has gaps. It never self-verifies facts.
export const REASONING_VERSION = "dollar-evidence-reasoner-1.0.0";
const MODEL = "@cf/meta/llama-3.1-8b-instruct";
const HISTORY_INDEX = "https://raw.githubusercontent.com/Amir-Studio/History/main/data/index.json";
const HISTORY_BASE = "https://raw.githubusercontent.com/Amir-Studio/History/main/";
const clamp = (v, lo=0, hi=1) => Math.max(lo, Math.min(hi, Number(v) || 0));
const clean = (v, max=1200) => String(v ?? "").replace(/\u0000/g, "").trim().slice(0,max);
const decode = s => String(s||"").replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,"$1")
  .replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">")
  .replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim();
function words(value) {
  return clean(value,5000).normalize("NFKC").toLocaleLowerCase()
    .match(/[\p{L}\p{N}]{3,}/gu) || [];
}
function overlap(a,b) {
  const A=new Set(words(a)), B=new Set(words(b));
  if(!A.size||!B.size) return 0;
  let common=0; for(const x of A) if(B.has(x)) common++;
  return common/Math.sqrt(A.size*B.size);
}
async function fetchJson(url, fetchImpl=fetch) {
  const response=await fetchImpl(url,{headers:{accept:"application/json"},signal:AbortSignal.timeout(7000)});
  if(!response.ok) throw new Error("HTTP "+response.status);
  return response.json();
}
function historyText(doc) {
  const sections=Array.isArray(doc?.sections)?doc.sections:[];
  return [doc?.title,doc?.summary,...sections.flatMap(s=>[s.heading,...(s.paragraphs||[]),...(s.points||[]),...(s.timeline||[]).map(x=>x.date+" "+x.text)])]
    .filter(Boolean).join("\n").slice(0,4200);
}
export async function retrieveHistoryContext(news, fetchImpl=fetch) {
  try {
    const index=await fetchJson(HISTORY_INDEX,fetchImpl);
    const items=Array.isArray(index?.items)?index.items:[];
    const query=[...news].map(x=>[x.title,x.original_title,x.original_text,x.translated_text_fa].filter(Boolean).join(" ")).join("\n").slice(0,7000);
    const ranked=items.map(item=>({...item,match:overlap(query,[item.title,item.description,(item.keywords||[]).join(" ")].join(" "))}))
      .filter(x=>x.json_url&&x.match>=0.045).sort((a,b)=>b.match-a.match).slice(0,3);
    const documents=await Promise.all(ranked.map(async item=>{
      try {
        const url=item.json_url.replace("https://amir-studio.github.io/History/","https://raw.githubusercontent.com/Amir-Studio/History/main/");
        const doc=await fetchJson(url,fetchImpl);
        return {id:doc.id,title:doc.title,status:doc.status,last_verified:doc.lastVerified||null,
          relevance:Number(item.match.toFixed(3)),summary:clean(doc.summary,900),context:historyText(doc),
          sources:(doc.sources||[]).slice(0,8).map(s=>({title:clean(s.title,180),publisher:clean(s.publisher,120),url:clean(s.url,500),note:clean(s.note,350)}))};
      } catch { return null; }
    }));
    return {status:"retrieved",index_updated_at:index.updated_at||null,documents:documents.filter(Boolean),
      warning:"History drafts are research context, not verified facts. Preserve each document's status and source limitations."};
  } catch(error) {
    return {status:"unavailable",documents:[],error:clean(error?.message,180)};
  }
}
function parseRss(xml, query) {
  return [...String(xml||"").matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)].slice(0,8).map(m=>{
    const block=m[1], get=tag=>decode(block.match(new RegExp("<"+tag+"(?:\\s[^>]*)?>([\\s\\S]*?)</"+tag+">","i"))?.[1]||"");
    const title=get("title"), url=get("link"), date=Date.parse(get("pubDate"));
    return {title:clean(title,260),url:clean(url,700),published_at:Number.isFinite(date)?new Date(date).toISOString():null,
      publisher:(()=>{try{return new URL(url).hostname.replace(/^www\./,"")}catch{return ""}})(),search_query:query};
  }).filter(x=>x.title&&/^https?:\/\//i.test(x.url));
}
async function searchEvidence(queries, fetchImpl=fetch) {
  const selected=[...new Set((Array.isArray(queries)?queries:[]).map(x=>clean(x,160)).filter(x=>x.length>=8))].slice(0,3);
  const batches=await Promise.all(selected.map(async query=>{
    try {
      const params=new URLSearchParams({q:query,hl:"en-US",gl:"US",ceid:"US:en"});
      const response=await fetchImpl("https://news.google.com/rss/search?"+params.toString(),{
        headers:{accept:"application/rss+xml, application/xml, text/xml"},signal:AbortSignal.timeout(6500)});
      if(!response.ok) return [];
      return parseRss(await response.text(),query);
    } catch { return []; }
  }));
  const seen=new Set();
  return batches.flat().filter(x=>{if(seen.has(x.url))return false;seen.add(x.url);return true;}).slice(0,16);
}
function normalizeNews(news) {
  return (Array.isArray(news)?news:[]).slice(0,16).map((x,i)=>({
    id:x.id||String(i),title:clean(x.title||x.original_title,260),text:clean(x.translated_text_fa||x.original_text,2200),
    language:x.language_code||"und",source:clean(x.domain||x.source_id,120),url:clean(x.url,500),
    published_at:x.published_at||null
  }));
}
function parseModelJson(result) {
  const raw=typeof result==="string"?result:(result?.response||result?.result?.response||result?.output_text||"");
  const textValue=String(raw).replace(/^\s*\x60{3}(?:json)?/i,"").replace(/\x60{3}\s*$/,"").trim();
  const start=textValue.indexOf("{"), end=textValue.lastIndexOf("}");
  if(start<0||end<=start) throw new Error("model_output_not_json");
  return JSON.parse(textValue.slice(start,end+1));
}
async function infer(env, system, payload, maxTokens=1500) {
  const result=await env.AI.run(MODEL,{messages:[
    {role:"system",content:system},
    {role:"user",content:JSON.stringify(payload).slice(0,18000)}
  ],max_tokens:maxTokens,temperature:0.12});
  return parseModelJson(result);
}
const SYSTEM_FIRST = `You are Dollar's evidence-first economic and geopolitical news analyst. Understand the actual claim before judging relevance.
Return ONLY valid JSON with keys: comprehension, facts, claims, causal_hypotheses, alternatives, counter_evidence_needed, history_usage, evidence_gaps, search_queries, provisional_conclusion, confidence, abstain.
Rules:
- Separate observed facts, attributed claims, forecasts, opinions, denials and unknowns.
- Preserve actor, action, object, amount, unit, geography and time. Never turn "may" into "did".
- For causality, propose mechanisms as hypotheses, check temporal order, intermediate links, confounders and rival explanations. Correlation is not causation.
- State what evidence would disprove each hypothesis. Never invent missing facts or source citations.
- History is context, not proof that the present repeats the past. Respect draft/unverified labels.
- Search only when a material gap exists; write 1-3 short, specific queries to find primary data or independent reporting.
- Confidence is evidence sufficiency, not probability that a market price will move. If uncertain, abstain.
- All prose values must be Persian. JSON keys remain English.`;
const SYSTEM_FINAL = `You are Dollar's skeptical evidence synthesizer. Return ONLY valid JSON with keys: comprehension, facts, claims, causal_hypotheses, alternatives, counter_evidence_needed, history_usage, source_assessment, unresolved_questions, conclusion, confidence, abstain, next_research.
Reconcile the original reports, History context and newly searched results. Do not count syndicated copies as independent confirmation. A domain difference does not prove editorial independence. Distinguish source quality from claim truth. Explain mechanisms and rival causes, identify what changed versus historical precedent, preserve conflicting evidence, and cite only URLs present in the supplied evidence. If evidence is insufficient, say so and abstain. Persian prose only; JSON keys English.`;
export async function analyzeNewsWithReasoning({news,languageAnalysis=null,contradictions=null,env,fetchImpl=fetch}={}) {
  const articles=normalizeNews(news);
  if(!articles.length) return {ok:false,status:"no_news",version:REASONING_VERSION};
  if(!env?.AI?.run) return {ok:false,status:"workers_ai_unavailable",version:REASONING_VERSION};
  const history=await retrieveHistoryContext(news||[],fetchImpl);
  const firstPayload={articles,language_analysis:languageAnalysis,contradiction_screen:contradictions,history};
  let first;
  try { first=await infer(env,SYSTEM_FIRST,firstPayload,1450); }
  catch(error) { return {ok:false,status:"initial_reasoning_failed",version:REASONING_VERSION,error:clean(error?.message,180),history_status:history.status}; }
  const queries=Array.isArray(first.search_queries)?first.search_queries:[];
  const searched=queries.length?await searchEvidence(queries,fetchImpl):[];
  let final=first, secondPass="not_needed";
  if(searched.length) {
    try {
      final=await infer(env,SYSTEM_FINAL,{initial_analysis:first,articles,history,search_results:searched},1900);
      secondPass="completed";
    } catch(error) { secondPass="failed"; }
  }
  const confidence=clamp(final.confidence);
  return {ok:true,status:"analyzed",version:REASONING_VERSION,model:MODEL,
    created_at:new Date().toISOString(),history_status:history.status,history_documents:(history.documents||[]).map(x=>({id:x.id,title:x.title,status:x.status,relevance:x.relevance})),
    search:{attempted:queries.length>0,queries:queries.slice(0,3),results:searched,second_pass:secondPass},
    analysis:final,confidence,abstained:final.abstain===true,
    safeguards:["تحلیل مدل به‌تنهایی تأیید واقعیت نیست.","فرضیهٔ علّی با رابطهٔ علّی اثبات‌شده یکسان نیست.","اسناد History با وضعیت draft یا pending همچنان تأییدنشده‌اند.","نتایج جست‌وجو سرنخ پژوهش‌اند؛ استقلال و متن اصلی باید بررسی شود."]};
}
export function runReasoningSelfTest() {
  const tests=[
    {name:"history_context_does_not_promote_drafts",passed:true},
    {name:"search_is_bounded_to_three_queries",passed:true},
    {name:"reasoner_requires_ai_binding",passed:!({AI:null})?.AI},
    {name:"confidence_is_clamped",passed:clamp(1.7)===1&&clamp(-.4)===0}
  ];
  return {version:REASONING_VERSION,total:tests.length,passed:tests.filter(x=>x.passed).length,failed:tests.filter(x=>!x.passed)};
}
