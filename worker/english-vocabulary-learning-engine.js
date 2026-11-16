// Persistent adaptive review memory for Dollar's curated English news vocabulary.
import { getEnglishNewsVocabulary } from "./news-vocabulary-en.js";

export const ENGLISH_VOCABULARY_LEARNING_VERSION = "english-vocabulary-learning-1.0.0";
const KEY = "neural:english:vocabulary:learning:v1";
const TTL = 60 * 60 * 24 * 365;
const clamp = (n,min,max) => Math.max(min,Math.min(max,n));
function curriculumMap(){return new Map(getEnglishNewsVocabulary({limit:1000}).items.map(x=>[x.id,x]));}
async function readState(env){
  if(!env?.MARKET_CACHE) return {version:ENGLISH_VOCABULARY_LEARNING_VERSION,terms:{},updated_at:null,storage_available:false};
  try {const saved=await env.MARKET_CACHE.get(KEY,"json");return {...(saved||{}),version:ENGLISH_VOCABULARY_LEARNING_VERSION,terms:saved?.terms&&typeof saved.terms==="object"?saved.terms:{},storage_available:true};}
  catch {return {version:ENGLISH_VOCABULARY_LEARNING_VERSION,terms:{},updated_at:null,storage_available:false};}
}
async function writeState(env,state){
  if(!env?.MARKET_CACHE) return false;
  try {state.updated_at=new Date().toISOString();await env.MARKET_CACHE.put(KEY,JSON.stringify(state),{expirationTtl:TTL});return true;}
  catch {return false;}
}
export async function recordEnglishVocabularyExposure(termIds,env,context=""){
  const ids=[...new Set((Array.isArray(termIds)?termIds:[]).filter(x=>typeof x==="string"))].slice(0,30);
  if(!ids.length||!env?.MARKET_CACHE) return {recorded:0,storage_available:Boolean(env?.MARKET_CACHE)};
  const valid=curriculumMap(),state=await readState(env),now=Date.now();let recorded=0;
  for(const id of ids){if(!valid.has(id))continue;const old=state.terms[id]||{};state.terms[id]={...old,exposure_count:(old.exposure_count||0)+1,last_exposed_at:new Date(now).toISOString(),last_context:String(context||"").slice(0,180)};recorded++;}
  if(recorded) await writeState(env,state);
  return {recorded,storage_available:true};
}
export async function recordEnglishVocabularyFeedback({term_id,correct,context=""}={},env){
  if(typeof term_id!=="string"||typeof correct!=="boolean") return {ok:false,status:"invalid_feedback",required:["term_id:string","correct:boolean"]};
  const item=curriculumMap().get(term_id);
  if(!item) return {ok:false,status:"unknown_term_id"};
  if(!env?.MARKET_CACHE) return {ok:false,status:"learning_storage_unavailable",term_id};
  const state=await readState(env),old=state.terms[term_id]||{};
  const correctCount=(old.correct_count||0)+(correct?1:0),incorrectCount=(old.incorrect_count||0)+(correct?0:1);
  const streak=correct?(old.streak||0)+1:0;
  const ease=correct?clamp((old.ease||2.5)+0.05,1.3,3.0):clamp((old.ease||2.5)-0.2,1.3,3.0);
  const intervalDays=correct?(streak===1?1:streak===2?3:Math.max(1,Math.round((old.interval_days||3)*ease))):0.25;
  const now=Date.now(),dueAt=new Date(now+intervalDays*86400000).toISOString();
  state.terms[term_id]={...old,correct_count:correctCount,incorrect_count:incorrectCount,streak,ease,interval_days:intervalDays,
    confidence:Number(((correctCount+1)/(correctCount+incorrectCount+2)).toFixed(4)),last_feedback:correct?"correct":"incorrect",
    last_reviewed_at:new Date(now).toISOString(),due_at:dueAt,last_context:String(context||"").slice(0,180)};
  const saved=await writeState(env,state);
  return {ok:saved,status:saved?"feedback_recorded":"storage_write_failed",term_id,term:item.term,meaning_fa:item.meaning_fa,
    correct_count:correctCount,incorrect_count:incorrectCount,streak,ease,interval_days:intervalDays,due_at:dueAt,
    confidence:state.terms[term_id].confidence,mastery_state:correct?(streak>=3?"consolidating":"learning"):"needs_remediation"};
}
export async function getEnglishVocabularyLearningStatus(env,{limit=20}={}){
  const curriculum=getEnglishNewsVocabulary({limit:1000}).items,state=await readState(env),now=Date.now();
  const rows=curriculum.map(item=>({id:item.id,term:item.term,meaning_fa:item.meaning_fa,category:item.category,...(state.terms[item.id]||{})}));
  const reviewed=rows.filter(x=>(x.correct_count||0)+(x.incorrect_count||0)>0);
  const due=reviewed.filter(x=>x.due_at&&Date.parse(x.due_at)<=now).sort((a,b)=>Date.parse(a.due_at)-Date.parse(b.due_at));
  const mastered=reviewed.filter(x=>(x.streak||0)>=3&&(x.confidence||0)>=0.8);
  const struggling=reviewed.filter(x=>(x.incorrect_count||0)>(x.correct_count||0)).sort((a,b)=>(b.incorrect_count||0)-(a.incorrect_count||0));
  const exposures=rows.reduce((sum,x)=>sum+(x.exposure_count||0),0);
  return {version:ENGLISH_VOCABULARY_LEARNING_VERSION,model_support:"BGE-M3 pretrained semantic embeddings",curriculum_total:curriculum.length,
    storage_available:state.storage_available,reviewed_terms:reviewed.length,exposure_events:exposures,due_for_review:due.length,
    consolidating_terms:mastered.length,needs_remediation:struggling.length,
    accuracy_pct:reviewed.length?Number((reviewed.reduce((s,x)=>s+(x.correct_count||0),0)/Math.max(1,reviewed.reduce((s,x)=>s+(x.correct_count||0)+(x.incorrect_count||0),0))*100).toFixed(1)):null,
    due_terms:due.slice(0,Math.max(1,Math.min(100,Number(limit)||20))),struggling_terms:struggling.slice(0,Math.max(1,Math.min(100,Number(limit)||20))),
    scope:"News exposure is tracked separately from verified recall. A term is never marked mastered merely because it appeared in an article."};
}
export function runEnglishVocabularyLearningSelfTest(){
  const correct=(old={})=>{const streak=(old.streak||0)+1;const ease=clamp((old.ease||2.5)+0.05,1.3,3.0);return{streak,ease,interval_days:streak===1?1:streak===2?3:Math.max(1,Math.round((old.interval_days||3)*ease))};};
  const first=correct(),second=correct({...first,interval_days:first.interval_days}),third=correct({...second,interval_days:second.interval_days});
  const wrong={streak:0,ease:clamp(2.5-0.2,1.3,3.0),interval_days:0.25};
  return {total:4,passed:first.interval_days===1&&second.interval_days===3&&third.interval_days>=7&&wrong.interval_days<1&&wrong.ease<2.5,
    checks:{first_review_1_day:first.interval_days===1,second_review_3_days:second.interval_days===3,spacing_expands:third.interval_days>=7,errors_trigger_fast_review:wrong.interval_days<1}};
}
