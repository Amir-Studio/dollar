// Retrieval-based multilingual vocabulary learner.
// It proposes definitions from a curated cross-language ontology or Wiktionary.
// Suggestions remain unverified until independently reviewed.
import { analyzeMarketLexicon, getMarketLexicon } from "./market-lexicon-ontology.js";
import { getGermanNewsVocabulary } from "./news-vocabulary-de.js";
import { getChineseNewsVocabulary } from "./news-vocabulary-zh.js";

export const LANGUAGE_LEARNER_VERSION = "dollar-language-learner-1.1.0";
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
const KNOWN_TERMS_CACHE=new Map();
function getKnownTerms(lang) {
 if(KNOWN_TERMS_CACHE.has(lang)) return KNOWN_TERMS_CACHE.get(lang);
 const known=new Set(getMarketLexicon({language:lang,limit:200}).concepts.flatMap(c=>[...(c.equivalents?.[lang]||[]),...(lang==="en"?[c.pivot?.term]:[])]).map(x=>norm(x,lang)));
 if(lang==="de") {
   for(const item of getGermanNewsVocabulary({limit:1000}).items) {
     for(const value of [item.word,item.form]) {
       const clean=String(value||"").replace(/^(der|die|das)\s+/i,"");
       for(const part of clean.split(/[·,;\s]+/)) if(part.length>=4) known.add(norm(part,lang));
       if(clean.length>=4) known.add(norm(clean,lang));
     }
   }
 }
 if(lang==="zh") {
   const terms=getChineseNewsVocabulary({limit:1000}).items.map(x=>x.zh);
   for(const value of terms) {
     const chars=[...norm(value,lang)];
     known.add(norm(value,lang));
     for(let n=2;n<=4;n++) for(let i=0;i+n<=chars.length;i++) known.add(chars.slice(i,i+n).join(""));
   }
 }
 KNOWN_TERMS_CACHE.set(lang,known);
 return known;
}
const safeWord = value => String(value||"").trim().replace(/^[^\p{L}]+|[^\p{L}]+$/gu,"");
const DOMAIN_CONTEXT = /(?:inflation|interest|rate|bond|yield|currency|monetary|fiscal|central bank|liquidity|sanction|tariff|trade|budget|debt|deficit|surplus|refinanc|credit|capital|market|exchange|forex|oil|energy|gold|تورم|بهره|نرخ|اوراق|بازده|ارز|پولی|مالی|بانک|نقدینگی|تحریم|تعرفه|تجارت|بودجه|بدهی|کسری|مازاد|اعتبار|سرمایه|بازار|نفت|انرژی|طلا|利率|通胀|货币|央行|债券|收益率|流动性|制裁|贸易|预算|债务|금리|물가|통화|중앙은행|채권|수익률|유동성|제재|무역|예산|부채)/i;
const TECHNICAL_MORPHEMES = {
 de: /(?:politik|wirtschaft|finanz|markt|steuer|verschuld|inflation|zinssatz|liquidität|risiko|prämie|ierung|isierung|ität|schaft|gesetz)$/i,
 en: /(?:tion|sion|ment|ance|ence|ity|ization|isation|ability|ibility|omics| monetary|ization)$/i,
 fr: /(?:tion|sion|ment|ance|ence|ité|isme|isation|eur|euse)$/i,
 es: /(?:ción|sión|miento|dad|ismo|ización|ancia|encia)$/i,
 it: /(?:zione|sione|mento|ità|ismo|anza|enza)$/i,
 pt: /(?:ção|são|mento|dade|ismo|ância|ência)$/i,
 ru: /(?:ция|ение|ость|изм|ирование|ность)$/i,
 fa: /(?:سازی|گرایی|پذیری|مندی|شناسی|گذاری|محور)$/i,
 ar: /(?:ية|يات|ات|ون|ين|ization)$/i,
 tr: /(?:laşma|leşme|lık|lik|sizlik|cilik)$/i,
 nl: /(?:heid|ing|iteit|isatie|isering)$/i,
 pl: /(?:acja|enie|ość|izm|owość)$/i
};
const COMMON_SHORT = new Set(["bank","rate","gold","oil","bond","debt","loan","tax","war","law","fund","cash","risk","trade","price","news","data","market","money","stock","share","cost","gain","loss","rise","fall","high","low","year","month","week","day","said","also","more","less","very","good","well","new","old","first","last"]);
function tokenLooksLikeName(token, index, lang) {
 if(index===0 && /^[A-Z][a-z]{2,}$/.test(token) && lang!=="de") return true;
 return false;
}
export function classifyVocabularyKnowledge(term, language, context="") {
 const lang=String(language||"").toLowerCase(), clean=String(term||"").normalize("NFKC").trim().slice(0,100);
 if(!clean || !LEARNER_LANGUAGES.includes(lang)) return {knowledge_state:"invalid",known:false,confidence:1,reason:"unsupported_or_empty_input"};
 const key=norm(clean,lang);
 if(STOP[lang]?.includes(key)) return {knowledge_state:"known_function_word",known:true,confidence:0.99,reason:"language_stopword"};
 if(getKnownTerms(lang).has(key)) return {knowledge_state:"known_in_internal_lexicon",known:true,confidence:0.99,reason:"curated_lexicon_match"};
 const lexical=analyzeMarketLexicon(clean,lang);
 if(lexical.matches?.length) return {knowledge_state:"known_in_internal_lexicon",known:true,confidence:0.96,reason:"ontology_semantic_match",concept_id:lexical.matches[0].concept_id};
 const signals=[];
 if([...key].length>=9) signals.push("long_lexical_form");
 if(TECHNICAL_MORPHEMES[lang]?.test(key)) signals.push("technical_morphology");
 if(DOMAIN_CONTEXT.test(context)) signals.push("market_domain_context");
 if(/[-_]/.test(key)||/\s/.test(key)) signals.push("compound_or_multiword_expression");
 if(/[0-9]/.test(key)) signals.push("alphanumeric_term");
 const score=Math.min(0.94,0.34+signals.reduce((sum,x)=>sum+({long_lexical_form:0.13,technical_morphology:0.23,market_domain_context:0.18,compound_or_multiword_expression:0.12,alphanumeric_term:0.08}[x]||0),0));
 return {knowledge_state:score>=0.65?"likely_unknown":"uncertain",known:false,confidence:Number(score.toFixed(2)),reason:signals.length?"not_in_lexicon_with_heuristic_evidence":"not_in_lexicon_only",signals};
}
export function extractUnknownVocabularyCandidates(text, language, options={}) {
 const lang=String(language||"").toLowerCase();
 if(!LEARNER_LANGUAGES.includes(lang)) return [];
 const source=String(text||"").slice(0,12000);
 const known=getKnownTerms(lang), counts=new Map();
 const add=(raw,index=0)=>{
   const term=safeWord(raw), key=norm(term,lang);
   if(!key || key.length<(CJK.has(lang)?2:4) || key.length>48 || STOP[lang]?.includes(key) || known.has(key) || /^\d+$/.test(key) || COMMON_SHORT.has(key)) return;
   const prior=counts.get(key)||{term,count:0,positions:[]};
   prior.count++; if(prior.positions.length<3) prior.positions.push(index); counts.set(key,prior);
 };
 if(CJK.has(lang)) {
   const chars=[...source.replace(/\s+/g,"")];
   // Prefer meaningful 2-4 character spans; reject spans that are substrings of curated vocabulary.
   for(let n=2;n<=4;n++) for(let i=0;i+n<=chars.length;i++) add(chars.slice(i,i+n).join(""),i);
 } else {
   const tokens=source.match(/[\p{L}][\p{L}'’\-]{2,47}/gu)||[];
   tokens.forEach((token,index)=>{ if(!tokenLooksLikeName(token,index,lang)) add(token,index); });
   // Multiword terminology is often unknown even when every component is familiar.
   if(DOMAIN_CONTEXT.test(source)) for(let i=0;i<tokens.length-1;i++) {
     const phrase=tokens.slice(i,i+2).join(" ");
     if(phrase.length>=9) add(phrase,i);
   }
 }
 const rows=[];
 for(const [normalized,v] of counts) {
   const knowledge=classifyVocabularyKnowledge(v.term,lang,source);
   const repeated=v.count>=2, morphology=knowledge.signals?.includes("technical_morphology");
   const contextual=knowledge.signals?.includes("market_domain_context");
   const long=knowledge.signals?.includes("long_lexical_form");
   // A single long/technical term can be surfaced, but a short unrecognized token needs repeated/contextual evidence.
   const eligible=CJK.has(lang)?v.count>=2:(repeated || (long&&(morphology||contextual)) || (morphology&&contextual) || (knowledge.signals?.includes("compound_or_multiword_expression")&&contextual));
   if(!eligible || knowledge.knowledge_state==="known_in_internal_lexicon") continue;
   const score=Math.min(0.97,knowledge.confidence+(repeated?0.12:0)+(morphology?0.06:0));
   rows.push({term:v.term,normalized_term:normalized,occurrences:v.count,language:lang,knowledge_state:score>=0.72?"likely_unknown":"uncertain",confidence_hint:Number(score.toFixed(2)),signals:[...(knowledge.signals||[]),...(repeated?["repeated_in_document"]:[])]});
 }
 return rows.sort((a,b)=>b.confidence_hint-a.confidence_hint||b.occurrences-a.occurrences||b.term.length-a.term.length)
   .slice(0,Math.max(1,Math.min(20,Number(options.limit)||8)));
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
   const definition_en=useful.map(x=>x.definition).join(" | ").slice(0,1600);
   const bridge=analyzeMarketLexicon(definition_en,"en");
   const bridgeMatch=bridge.matches?.[0]||null;
   const bridgedConcept=bridgeMatch?getMarketLexicon({language:lang,query:bridgeMatch.pivot_term,limit:3}).concepts.find(x=>x.id===bridgeMatch.concept_id):null;
   return {ok:true,term:clean,language:lang,definition_en,part_of_speech:useful[0].part_of_speech,source_provider:"Wiktionary",source_url:"https://en.wiktionary.org/wiki/"+encodeURIComponent(clean),dictionary_api_url:url,confidence:bridgeMatch?0.82:0.68,status:"candidate_review",dictionary_entry_languages:[...new Set(useful.map(x=>x.entry_language))],concept_id:bridgeMatch?.concept_id||null,cross_language_equivalents:bridgedConcept?.equivalents||{},cross_language_inference:bridgeMatch?"english_gloss_matched_to_internal_multilingual_ontology":"english_dictionary_gloss_only"};
 } catch(error) {
   return {ok:false,status:"lookup_failed",term:clean,language:lang,error:String(error?.message||error).slice(0,120)};
 }
}
export function runLanguageLearnerSelfTest() {
 const candidates=extractUnknownVocabularyCandidates("Klimarisikoprämie Klimarisikoprämie und Klimarisikoprämie wirken auf die Refinanzierung.", "de");
 const passes=candidates.some(x=>x.normalized_term==="klimarisikoprämie"&&x.occurrences>=2);
 const rejects=extractUnknownVocabularyCandidates("the and or but the and or but", "en").length===0;
 return {version:LANGUAGE_LEARNER_VERSION,passed:passes&&rejects,checks:{repeated_unknown_term:passes,stopword_filter:rejects},scope:"Deterministic candidate-discovery regression only; not a language-proficiency score."};
}
