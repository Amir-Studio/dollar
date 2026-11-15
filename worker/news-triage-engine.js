// Dollar multilingual news triage: BGE-M3 semantic signals + a feedback-trained MLP.
export const NEWS_TRIAGE_VERSION = "dollar-news-triage-1.0.0";
export const TRIAGE_LABELS = ["keep", "summarize", "quarantine", "discard"];
const INPUTS = 8;
const HIDDEN = 12;
const clamp = (x, lo=0, hi=1) => Math.max(lo, Math.min(hi, Number(x) || 0));
const sigmoid = x => Math.tanh(x);

export function buildNewsTriageFeatures(item, signals={}) {
  const title = String(item?.title || item?.original_title || "");
  const text = String(item?.original_text || item?.translated_text_fa || "");
  const combined = (title + " " + text).normalize("NFKC").toLocaleLowerCase();
  const themes = Array.isArray(signals.themes) ? signals.themes : [];
  const ageHours = Math.max(0, (Date.now() - Date.parse(item?.published_at || "")) / 3600000);
  const sourceContext = item?.source_id ? 1 : (item?.domain ? 0.5 : 0);
  const extraction = /full|publisher_html|rss_content/i.test(String(item?.extraction_method || ""))
    ? 1 : text.length > 300 ? 0.65 : text.length > 0 ? 0.35 : 0;
  const features = [
    clamp(signals.semantic_score),
    clamp(themes.length / 4),
    clamp(text.length / 2200) * extraction,
    clamp(1 - ageHours / (24 * 14)),
    sourceContext,
    /\d/.test(combined) ? 1 : 0,
    /according to|said|reported|announced|به گفته|طبق گزارش|اعلام کرد|بر اساس گزارش|据|表示|laut|selon/i.test(combined) ? 1 : 0,
    signals.duplicate === true ? 1 : 0
  ];
  return {
    vector: features,
    names: ["semantic_relevance","market_theme_coverage","article_text_quality","recency","source_context","quantitative_anchor","attribution_signal","duplicate_signal"],
    values: Object.fromEntries(["semantic_relevance","market_theme_coverage","article_text_quality","recency","source_context","quantitative_anchor","attribution_signal","duplicate_signal"].map((k,i)=>[k,Number(features[i].toFixed(5))]))
  };
}

export function extractiveNewsSummary(item, maxChars=850) {
  const language = String(item?.language_code || "und");
  const source = String(item?.translated_text_fa || item?.original_text || item?.title || "").trim();
  if (!source) return {summary:"",language};
  const sentences = source.replace(/\s+/g," ").split(/(?<=[.!?؟。！？])\s+|(?<=؛)\s+/u).map(x=>x.trim()).filter(x=>x.length>=35);
  if (!sentences.length) return {summary:source.slice(0,maxChars),language:item?.translated_text_fa?"fa":language};
  const scored = sentences.map((sentence,index)=>{
    const len=sentence.length;
    const numberSignal=/\d/.test(sentence)?2:0;
    const actionSignal=/(increase|decrease|raise|cut|approve|ban|sanction|تأیید|افزایش|کاهش|تصویب|تحریم|涨|降|erhö|baisse|hausse)/i.test(sentence)?2:0;
    const attribution=/according to|said|reported|announced|به گفته|طبق گزارش|اعلام کرد|بر اساس|据|表示|laut|selon/i.test(sentence)?1.5:0;
    const structure=/because|therefore|however|result|در نتیجه|اما|با این حال|بنابراین|因此|但是|jedoch|cependant/i.test(sentence)?1:0;
    const lengthSignal=len>=65&&len<=420?1:len>420?0.3:0;
    return {sentence,index,score:numberSignal+actionSignal+attribution+structure+lengthSignal};
  }).sort((a,b)=>b.score-a.score||a.index-b.index);
  const chosen=[];
  let size=0;
  for(const row of scored){
    if(chosen.length>=3) break;
    if(chosen.some(x=>x.index===row.index)) continue;
    if(size+row.sentence.length+(chosen.length?2:0)>maxChars) continue;
    chosen.push(row);size+=row.sentence.length+2;
  }
  const summary=chosen.sort((a,b)=>a.index-b.index).map(x=>x.sentence).join(" ").slice(0,maxChars);
  return {summary:summary||source.slice(0,maxChars),language:item?.translated_text_fa?"fa":language};
}

function makeNetwork(seed=0x73a91f2d) {
  let state=seed>>>0;
  const random=()=>{state=(1664525*state+1013904223)>>>0;return state/4294967296;};
  const scale=Math.sqrt(6/(INPUTS+HIDDEN));
  return {
    w1:Array.from({length:HIDDEN},()=>Array.from({length:INPUTS},()=>((random()*2)-1)*scale)),
    b1:Array(HIDDEN).fill(0),
    w2:Array.from({length:TRIAGE_LABELS.length},()=>Array.from({length:HIDDEN},()=>((random()*2)-1)*Math.sqrt(6/(HIDDEN+TRIAGE_LABELS.length)))),
    b2:Array(TRIAGE_LABELS.length).fill(0)
  };
}
function forward(net,x) {
  const hidden=net.w1.map((row,i)=>sigmoid(row.reduce((s,w,j)=>s+w*x[j],net.b1[i])));
  const logits=net.w2.map((row,i)=>row.reduce((s,w,j)=>s+w*hidden[j],net.b2[i]));
  const peak=Math.max(...logits),exp=logits.map(v=>Math.exp(v-peak)),sum=exp.reduce((a,b)=>a+b,0)||1;
  return {hidden,probabilities:exp.map(v=>v/sum)};
}
export function trainNewsTriageModel(examples,options={}) {
  const valid=(Array.isArray(examples)?examples:[]).filter(x=>Array.isArray(x.features)&&x.features.length===INPUTS&&TRIAGE_LABELS.includes(x.decision));
  const classes=new Set(valid.map(x=>x.decision));
  if(valid.length<24||classes.size<3) return {trained:false,reason:"insufficient_human_labels",samples:valid.length,classes:[...classes]};
  const net=makeNetwork(),epochs=Math.max(40,Math.min(240,Number(options.epochs)||140)),rate=0.025;
  const rows=valid.map(x=>({x:x.features.map(v=>clamp(v,-1,1)),y:TRIAGE_LABELS.indexOf(x.decision)}));
  for(let epoch=0;epoch<epochs;epoch++){
    let loss=0;
    for(const row of rows){
      const {hidden,probabilities}=forward(net,row.x);
      loss-=Math.log(Math.max(1e-8,probabilities[row.y]));
      const delta=probabilities.map((p,i)=>p-(i===row.y?1:0));
      for(let o=0;o<TRIAGE_LABELS.length;o++){
        const d=delta[o];
        net.b2[o]-=rate*d/rows.length;
        for(let h=0;h<HIDDEN;h++){
          const old=net.w2[o][h];
          net.w2[o][h]-=rate*d*hidden[h]/rows.length;
          const dh=d*old*(1-hidden[h]*hidden[h]);
          net.b1[h]-=rate*dh/rows.length;
          for(let j=0;j<INPUTS;j++) net.w1[h][j]-=rate*dh*row.x[j]/rows.length;
        }
      }
    }
    if(!Number.isFinite(loss)) return {trained:false,reason:"non_finite_training_loss",samples:valid.length};
  }
  const correct=rows.filter(r=>TRIAGE_LABELS[forward(net,r.x).probabilities.indexOf(Math.max(...forward(net,r.x).probabilities))]===TRIAGE_LABELS[r.y]).length;
  return {trained:true,model:{version:NEWS_TRIAGE_VERSION,labels:TRIAGE_LABELS,inputs:INPUTS,hidden:HIDDEN,weights:net,trained_samples:valid.length,trained_at:new Date().toISOString()},
    metrics:{samples:valid.length,training_accuracy:Number((correct/valid.length).toFixed(4)),epochs}};
}
export function predictNewsTriageModel(model,features) {
  if(!model?.weights||!Array.isArray(features)||features.length!==INPUTS) return null;
  const result=forward(model.weights,features.map(v=>clamp(v,-1,1)));
  const best=result.probabilities.indexOf(Math.max(...result.probabilities));
  return {decision:TRIAGE_LABELS[best],confidence:Number(result.probabilities[best].toFixed(5)),
    probabilities:Object.fromEntries(TRIAGE_LABELS.map((x,i)=>[x,Number(result.probabilities[i].toFixed(5))]))};
}
export function fallbackNewsTriage(features,signals={}) {
  const [semantic,themes,textQuality,recency,source,quantitative,attribution,duplicate]=features;
  const score=clamp(semantic*.42+themes*.18+textQuality*.13+recency*.12+source*.05+quantitative*.05+attribution*.05)*100;
  let decision="quarantine";
  if(duplicate>=0.99) decision="discard";
  else if(score>=69&&textQuality>=0.35) decision="keep";
  else if(score>=42) decision="summarize";
  else if(score<22&&recency<0.2) decision="discard";
  return {decision,confidence:Number((score/100).toFixed(5)),score:Number(score.toFixed(2)),
    reason:{semantic_score:semantic,theme_coverage:themes,text_quality:textQuality,recency,source_context:source,
      quantitative_anchor:quantitative,attribution_signal:attribution,duplicate_signal:duplicate,
      rationale:signals.rationale||"Neural semantic relevance plus transparent quality and freshness signals; low-confidence cases are quarantined."}};
}

export function runNewsTriageSelfTest() {
  const strong=buildNewsTriageFeatures({title:"Central bank raises interest rates",original_text:"According to the central bank, rates increased by 2 percent after inflation data.",published_at:new Date().toISOString(),source_id:"official",extraction_method:"rss_content"},{semantic_score:.88,themes:["interest_rate","inflation"]});
  const low=fallbackNewsTriage(strong.vector,{});
  const summary=extractiveNewsSummary({language_code:"en",original_text:"The central bank announced a rate increase of 2 percent. The decision follows new inflation data and is expected to affect lending costs."});
  const tests=[
    {name:"feature_vector_has_fixed_shape",passed:strong.vector.length===INPUTS},
    {name:"relevant_article_not_discarded",passed:low.decision==="keep"||low.decision==="summarize"},
    {name:"summary_is_extractive",passed:summary.summary.includes("central bank")&&summary.summary.length<=850},
    {name:"duplicate_is_discard_candidate",passed:fallbackNewsTriage([.9,.9,.9,.9,.9,1,1,1]).decision==="discard"},
    {name:"model_requires_review_labels",passed:trainNewsTriageModel([]).trained===false}
  ];
  return {version:NEWS_TRIAGE_VERSION,total:tests.length,passed:tests.filter(x=>x.passed).length,failed:tests.filter(x=>!x.passed)};
}
