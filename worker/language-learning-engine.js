// Retrieval-based multilingual vocabulary learner.
// It proposes definitions from a curated cross-language ontology or Wiktionary.
// Suggestions remain unverified until independently reviewed.
import { analyzeMarketLexicon, getMarketLexicon } from "./market-lexicon-ontology.js";

export const LANGUAGE_LEARNER_VERSION = "dollar-language-learner-1.0.0";
export const LEARNER_LANGUAGES = ["fa","en","ar","zh","de","fr","ru","ja","ko","hi","es","it","pt","tr","nl","pl"];
const LANGUAGE_NAMES = {fa:"Persian",en:"English",ar:"Arabic",zh:"Chinese",de:"German",fr:"French",ru:"Russian",ja:"Japanese",ko:"Korean",hi:"Hindi",es:"Spanish",it:"Italian",pt:"Portuguese",tr:"Turkish",nl:"Dutch",pl:"Polish"};
const STOP = {
 en:"the a an and or but if then than of to in on at for from by with without as is are was were be been being has have had do does did will would could should may might not no yes this that these those it its they their we you he she said says according after before about into over under between more most less very also".split(" "),
 fa:"و یا اما اگر که از به در با برای بر را این آن اینها آنها یک هر هیچ نه نمی است هستند بود شد شده می شود خواهد درباره همچنین طبق گفت گفته اعلام بانک قیمت بازار".split(" "),
 de:"der die das den dem des ein eine einer und oder aber wenn dass von zu im in am an auf für mit ohne als ist sind war waren wird werden nicht kein keine auch nach vor über unter zwischen mehr weniger laut sagte".split(" "),
 fr:"le la les un une des du de et ou mais si que qui dans sur avec sans pour par est sont était être avoir au aux ce cette ces il elle ils elles pas plus moins selon après avant".split(" "),
 es:"el la los las un una unos unas y o pero si que de del en con sin para por es son fue será no más menos según sobre entre".split(" "),
 it:"il lo la gli le un una e o ma se che di del della in con senza per è sono era non più meno secondo".split(" "),
 pt:"o a os as um uma uns umas e ou mas se que de do da em com sem para por é são não mais menos segundo".split(" "),
 ru:"и а но если что в на с со для от по из к как это тот эта не ни был была будут может также после до между более менее заявил согласно".split(" "),
 ar:"و أو لكن إذا أن في من على إلى عن مع هذا هذه ذلك التي الذي لا لم لن قد قال أعلنت بحسب بعد قبل أكثر أقل".split(" "),
 tr:"ve veya ama eğer için ile göre bu şu bir olan değil daha kadar sonra önce üzerinde altında".split(" "),
 nl:"de het een en of maar als dat van naar in op met voor door is zijn was niet geen meer minder volgens".split(" "),
 pl:"i oraz lub ale jeśli że w na z do dla przez jest są był nie więcej mniej według".split(" "),
 hi:"और या लेकिन यदि कि के को में से पर यह वह नहीं है हैं था थे अधिक कम अनुसार".split(" ")
};
const CJK = new Set(["zh","ja","ko"]);
const norm = (value, lang) => {
 let s=String(value||"").normalize("NFKC").toLocaleLowerCase();
 if(lang==="fa") s=s.replace(/[يى]/g,"ی").replace(/ك/g,"ک").replace(/[ۀة]/g,"ه").replace(/[\u200c\u200f]/g,"");
 if(lang==="ar") s=s.replace(/[أإآٱ]/g,"ا").replace(/ى/g,"ي").replace(/[\u064b-\u065f\u0670]/g,"").replace(/ـ/g,"");
 return s.trim().replace(/\s+/g," ");
};
const safeWord = value => String(value||"").trim().replace(/^[^\p{L}]+|[^\p{L}]+$/gu,"");
export function extractUnknownVocabularyCandidates(text, language, options={}) {
 const lang=String(language||"").toLowerCase();
 if(!LEARNER_LANGUAGES.includes(lang)) return [];
 const source=String(text||"").slice(0,12000);
 const known=new Set(getMarketLexicon({language:lang,limit:200}).concepts.flatMap(c=>[...(c.equivalents?.[lang]||[]),...(lang==="en"?[c.pivot?.term]:[])]).map(x=>norm(x,lang)));
 const counts=new Map();
 const add=raw=>{
   const term=safeWord(raw), key=norm(term,lang);
   if(!key || key.length<(CJK.has(lang)?2:4) || key.length>36 || STOP[lang]?.includes(key) || known.has(key) || /^\d+$/.test(key)) return;
   counts.set(key,{term,count:(counts.get(key)?.count||0)+1});
 };
 if(CJK.has(lang)) {
   const compact=source.replace(/\s+/g,"");
   const chars=[...compact];
   for(let n=2;n<=4;n++) for(let i=0;i+n<=chars.length;i++) add(chars.slice(i,i+n).join(""));
 } else {
   const tokens=source.match(/[\p{L}][\p{L}'’\-]{2,35}/gu)||[];
   for(const token of tokens) add(token);
 }
 return [...counts.entries()].filter(([,v])=>v.count>=2)
   .map(([normalized,v])=>({term:v.term,normalized_term:normalized,occurrences:v.count,language:lang,confidence_hint:Math.min(0.9,0.45+v.count*0.08)}))
   .sort((a,b)=>b.occurrences-a.occurrences||b.term.length-a.term.length)
   .slice(0,Math.max(1,Math.min(12,Number(options.limit)||8)));
}

export async function lookupVocabularyMeaning(term, language, fetchImpl=fetch) {
 const lang=String(language||"").toLowerCase();
 const clean=String(term||"").normalize("NFKC").trim().slice(0,100);
 if(!clean || !LEARNER_LANGUAGES.includes(lang)) return {ok:false,status:"invalid_input"};
 const lexical=analyzeMarketLexicon(clean,lang);
 const direct=lexical.matches?.[0];
 if(direct) {
   const concept=getMarketLexicon({language:lang,query:direct.pivot_term,limit:3}).concepts.find(x=>x.id===direct.concept_id);
   return {ok:true,term:clean,language:lang,definition_en:direct.definition,part_of_speech:null,source_provider:"internal_market_ontology",source_url:null,confidence:0.96,status:"candidate_review",concept_id:direct.concept_id,cross_language_equivalents:concept?.equivalents||{}};
 }
 const url="https://en.wiktionary.org/api/rest_v1/page/definition/"+encodeURIComponent(clean);
 try {
   const response=await fetchImpl(url,{headers:{accept:"application/json"},signal:AbortSignal.timeout(7000)});
   if(!response.ok) return {ok:false,status:response.status===404?"not_found":"dictionary_unavailable",term:clean,language:lang};
   const payload=await response.json();
   const all=Object.entries(payload||{}).flatMap(([entryLanguage,entries])=>(Array.isArray(entries)?entries:[]).flatMap(entry=>(entry.definitions||[]).map(def=>({entry_language:entryLanguage,part_of_speech:entry.partOfSpeech||null,definition:String(def.definition||"").replace(/<[^>]*>/g," ").trim()}))));
   const useful=all.filter(x=>x.definition).slice(0,6);
   if(!useful.length) return {ok:false,status:"definition_missing",term:clean,language:lang};
   return {ok:true,term:clean,language:lang,definition_en:useful.map(x=>x.definition).join(" | ").slice(0,1600),part_of_speech:useful[0].part_of_speech,source_provider:"Wiktionary",source_url:"https://en.wiktionary.org/wiki/"+encodeURIComponent(clean),dictionary_api_url:url,confidence:0.68,status:"candidate_review",dictionary_entry_languages:[...new Set(useful.map(x=>x.entry_language))],cross_language_equivalents:{}};
 } catch(error) {
   return {ok:false,status:"lookup_failed",term:clean,language:lang,error:String(error?.message||error).slice(0,120)};
 }
}
export function runLanguageLearnerSelfTest() {
 const candidates=extractUnknownVocabularyCandidates("Zinserhöhung Zinserhöhung und Zinserhöhung wirken auf die Refinanzierung.", "de");
 const passes=candidates.some(x=>x.normalized_term==="zinserhöhung"&&x.occurrences>=2);
 const rejects=extractUnknownVocabularyCandidates("the and or but the and or but", "en").length===0;
 return {version:LANGUAGE_LEARNER_VERSION,passed:passes&&rejects,checks:{repeated_unknown_term:passes,stopword_filter:rejects},scope:"Deterministic candidate-discovery regression only; not a language-proficiency score."};
}
