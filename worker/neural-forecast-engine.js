// Deterministic supervised MLP for market-return forecasting.
// Training uses only matured labels available at the forecast origin.
// This is a price-series model, not a language model or a trading instruction.
export const NEURAL_MODEL_VERSION = "dollar-price-mlp-2.0.0";
const INPUTS = 9;
const HIDDEN = 8;
const MAX_TRAINING_ROWS = 240;
const MIN_TRAINING_ROWS = 70;
const MAX_EPOCHS = 40;
const PATIENCE = 6;
const LEARNING_RATE = 0.018;
const WEIGHT_DECAY = 0.001;
const GRADIENT_LIMIT = 2.5;
const DAY = 86400000;

const clamp = (x, low, high) => Math.max(low, Math.min(high, x));
const finite = x => Number.isFinite(Number(x));
function logReturn(a,b) { return a>0&&b>0?Math.log(a/b):0; }
function validSeries(points) {
  if(!Array.isArray(points)||points.length<2) return false;
  let previous=-Infinity;
  for(const point of points) {
    if(!finite(point?.t)||!finite(point?.p)||Number(point.p)<=0||Number(point.t)<=previous) return false;
    previous=Number(point.t);
  }
  return true;
}
function valueAtOrAfter(points,index,days) {
  const target=Number(points[index].t)-days*DAY;
  let low=0,high=index;
  while(low<high) {
    const mid=(low+high)>>1;
    if(Number(points[mid].t)<target) low=mid+1;
    else high=mid;
  }
  return Number(points[low]?.p)||Number(points[index].p);
}
function featuresAt(points,index) {
  const p=Number(points[index].p), daily=[];
  for(let k=Math.max(1,index-30);k<=index;k++) {
    const elapsed=(Number(points[k].t)-Number(points[k-1].t))/DAY;
    if(elapsed>0) daily.push(logReturn(Number(points[k].p),Number(points[k-1].p))/elapsed);
  }
  const volatility=window=>{
    const sample=daily.slice(-window);
    if(sample.length<2) return 0;
    const mean=sample.reduce((s,x)=>s+x,0)/sample.length;
    return Math.sqrt(sample.reduce((s,x)=>s+(x-mean)**2,0)/(sample.length-1));
  };
  const maRows=points.slice(Math.max(0,index-19),index+1);
  const ma=maRows.reduce((s,x)=>s+Number(x.p),0)/maRows.length;
  const old20=valueAtOrAfter(points,index,20);
  return [
    logReturn(p,valueAtOrAfter(points,index,1)),
    logReturn(p,valueAtOrAfter(points,index,3)),
    logReturn(p,valueAtOrAfter(points,index,7)),
    logReturn(p,valueAtOrAfter(points,index,14)),
    logReturn(p,valueAtOrAfter(points,index,30)),
    volatility(7),volatility(20),
    logReturn(p,old20)/Math.max(1,(Number(points[index].t)-Number(points[Math.max(0,index-20)].t))/DAY),
    ma>0?Math.log(p/ma):0
  ];
}
function fitScaler(rows) {
  const mean=Array(INPUTS).fill(0),scale=Array(INPUTS).fill(0);
  for(const row of rows) for(let j=0;j<INPUTS;j++) mean[j]+=row[j]/rows.length;
  for(const row of rows) for(let j=0;j<INPUTS;j++) scale[j]+=(row[j]-mean[j])**2/rows.length;
  for(let j=0;j<INPUTS;j++) scale[j]=Math.max(Math.sqrt(scale[j]),1e-6);
  return {mean,scale,apply(row){return row.map((x,j)=>clamp((x-mean[j])/scale[j],-5,5));}};
}
function makeNetwork() {
  let seed=0x6d2b79f5;
  const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
  const limit=Math.sqrt(6/(INPUTS+HIDDEN));
  return {
    w1:Array.from({length:HIDDEN},()=>Array.from({length:INPUTS},()=>((random()*2)-1)*limit)),
    b1:Array(HIDDEN).fill(0),
    w2:Array.from({length:HIDDEN},()=>((random()*2)-1)*Math.sqrt(6/(HIDDEN+1))),
    b2:0
  };
}
function forward(net,x) {
  const hidden=net.w1.map((weights,i)=>Math.tanh(weights.reduce((s,w,j)=>s+w*x[j],net.b1[i])));
  const output=Math.tanh(hidden.reduce((s,h,i)=>s+h*net.w2[i],net.b2));
  return {hidden,output};
}
function huber(error) {
  const a=Math.abs(error);
  return a<=1?0.5*error*error:a-0.5;
}
function fitCore(rows,labels,epochs) {
  const scaler=fitScaler(rows),x=rows.map(scaler.apply),net=makeNetwork();
  let loss=0;
  for(let epoch=0;epoch<epochs;epoch++) {
    const gw1=net.w1.map(row=>row.map(()=>0)),gb1=Array(HIDDEN).fill(0);
    const gw2=Array(HIDDEN).fill(0);let gb2=0;loss=0;
    for(let i=0;i<x.length;i++) {
      const {hidden,output}=forward(net,x[i]),error=output-labels[i];
      loss+=huber(error);
      const huberGrad=clamp(error,-1,1),delta2=huberGrad*(1-output*output);
      gb2+=delta2;
      for(let h=0;h<HIDDEN;h++) {
        gw2[h]+=delta2*hidden[h];
        const delta1=delta2*net.w2[h]*(1-hidden[h]*hidden[h]);
        gb1[h]+=delta1;
        for(let j=0;j<INPUTS;j++) gw1[h][j]+=delta1*x[i][j];
      }
    }
    const rate=LEARNING_RATE/x.length;
    for(let h=0;h<HIDDEN;h++) {
      net.w2[h]-=rate*clamp(gw2[h]+WEIGHT_DECAY*net.w2[h],-GRADIENT_LIMIT,GRADIENT_LIMIT);
      net.b1[h]-=rate*clamp(gb1[h],-GRADIENT_LIMIT,GRADIENT_LIMIT);
      for(let j=0;j<INPUTS;j++) net.w1[h][j]-=rate*clamp(gw1[h][j]+WEIGHT_DECAY*net.w1[h][j],-GRADIENT_LIMIT,GRADIENT_LIMIT);
    }
    net.b2-=rate*clamp(gb2,-GRADIENT_LIMIT,GRADIENT_LIMIT);
  }
  return {net,scaler,loss:loss/Math.max(1,x.length)};
}
function validationLoss(net,scaler,rows,labels) {
  let total=0;
  for(let i=0;i<rows.length;i++) total+=huber(forward(net,scaler.apply(rows[i])).output-labels[i]);
  return total/Math.max(1,rows.length);
}
function chooseEpochs(rows,labels) {
  const split=Math.floor(rows.length*0.8);
  const trainRows=rows.slice(0,split),trainLabels=labels.slice(0,split);
  const validRows=rows.slice(split),validLabels=labels.slice(split);
  if(trainRows.length<45||validRows.length<12) return {epochs:MAX_EPOCHS,validation_loss:null};
  let best=Infinity,bestEpoch=1,stale=0;
  for(let epoch=1;epoch<=MAX_EPOCHS;epoch++) {
    const fitted=fitCore(trainRows,trainLabels,epoch);
    const score=validationLoss(fitted.net,fitted.scaler,validRows,validLabels);
    if(score<best-1e-7){best=score;bestEpoch=epoch;stale=0;} else stale++;
    if(stale>=PATIENCE) break;
  }
  return {epochs:bestEpoch,validation_loss:Number(best.toFixed(8))};
}
function targetScale(labels) {
  const sorted=labels.map(Math.abs).sort((a,b)=>a-b);
  const medianAbs=sorted[Math.floor(sorted.length*0.5)]||0;
  return clamp(medianAbs*2.5,0.003,0.12);
}
function buildExamples(points,horizonDays) {
  const examples=[],start=Math.max(31,points.length-365);
  for(let i=start;i<points.length-1;i++) {
    const targetTime=Number(points[i].t)+horizonDays*DAY;
    let low=i+1,high=points.length;
    while(low<high){const mid=(low+high)>>1;if(Number(points[mid].t)<targetTime)low=mid+1;else high=mid;}
    const j=low;
    if(j>=points.length||(Number(points[j].t)-targetTime)/DAY>1.5) continue;
    const actualDays=(Number(points[j].t)-Number(points[i].t))/DAY;
    if(actualDays<horizonDays-0.25||actualDays>horizonDays+1.5) continue;
    const target=logReturn(Number(points[j].p),Number(points[i].p));
    const features=featuresAt(points,i);
    if(Number.isFinite(target)&&features.every(Number.isFinite))
      examples.push({features,target:clamp(target,-0.30,0.30)});
  }
  return examples.slice(-MAX_TRAINING_ROWS);
}
export function trainNeuralReturnModel(points,horizonDays) {
  const horizon=Number(horizonDays);
  if(![1,3,7].includes(horizon)) return {available:false,reason:"unsupported_horizon",version:NEURAL_MODEL_VERSION};
  if(!validSeries(points)) return {available:false,reason:"invalid_or_unsorted_price_history",version:NEURAL_MODEL_VERSION};
  if(points.length<90) return {available:false,reason:"insufficient_history",observations:points.length,version:NEURAL_MODEL_VERSION};
  const examples=buildExamples(points,horizon);
  if(examples.length<MIN_TRAINING_ROWS) return {available:false,reason:"insufficient_matured_examples",
    training_samples:examples.length,required_samples:MIN_TRAINING_ROWS,version:NEURAL_MODEL_VERSION};
  const rows=examples.map(x=>x.features),rawTargets=examples.map(x=>x.target);
  const scale=targetScale(rawTargets),labels=rawTargets.map(x=>clamp(x/scale,-0.98,0.98));
  const selection=chooseEpochs(rows,labels);
  const fitted=fitCore(rows,labels,selection.epochs);
  const prediction=forward(fitted.net,fitted.scaler.apply(featuresAt(points,points.length-1))).output*scale;
  const recent=points.slice(-31),returns=[];
  for(let i=1;i<recent.length;i++){
    const elapsed=(Number(recent[i].t)-Number(recent[i-1].t))/DAY;
    if(elapsed>0) returns.push(logReturn(Number(recent[i].p),Number(recent[i-1].p))/elapsed);
  }
  const mean=returns.reduce((s,x)=>s+x,0)/Math.max(1,returns.length);
  const vol=Math.sqrt(returns.reduce((s,x)=>s+(x-mean)**2,0)/Math.max(1,returns.length-1));
  const volatilityCap=clamp(3.5*vol*Math.sqrt(horizon),0.01,0.30);
  return {
    available:true,predicted_log_return:clamp(prediction,-volatilityCap,volatilityCap),
    training_samples:examples.length,architecture:`${INPUTS}-${HIDDEN}-1`,
    epochs:selection.epochs,validation_huber_loss:selection.validation_loss,
    final_training_huber_loss:Number(fitted.loss.toFixed(8)),target_scale:Number(scale.toFixed(6)),
    volatility_cap:Number(volatilityCap.toFixed(6)),horizon_days:horizon,
    version:NEURAL_MODEL_VERSION,training_method:"chronological_holdout_early_stopping_huber_backprop_walk_forward"
  };
}
export function runNeuralForecastSelfTest() {
  const now=Date.UTC(2025,0,1),daily=86400000;
  const short=Array.from({length:50},(_,i)=>({t:now+i*daily,p:100+i}));
  const sample=Array.from({length:420},(_,i)=>({t:now+i*daily,p:100*Math.exp(i*0.0007+Math.sin(i/11)*0.014+Math.sin(i/37)*0.009)}));
  const a=trainNeuralReturnModel(sample,3),b=trainNeuralReturnModel(sample,3);
  const flat=Array.from({length:420},(_,i)=>({t:now+i*daily,p:100*Math.exp(i*0.0003)}));
  const checks=[
    {name:"insufficient_history_is_withheld",passed:!trainNeuralReturnModel(short,3).available},
    {name:"deterministic_training",passed:a.available&&a.predicted_log_return===b.predicted_log_return&&Number.isFinite(a.final_training_huber_loss)},
    {name:"finite_volatility_bounded_output",passed:trainNeuralReturnModel(flat,7).available&&Math.abs(trainNeuralReturnModel(flat,7).predicted_log_return)<=0.30},
    {name:"unsorted_series_is_rejected",passed:!trainNeuralReturnModel([sample[1],sample[0],...sample.slice(2)],3).available},
    {name:"non_positive_price_is_rejected",passed:!trainNeuralReturnModel(sample.map((x,i)=>i===100?{...x,p:0}:x),3).available}
  ];
  return {version:NEURAL_MODEL_VERSION,total:checks.length,passed:checks.filter(x=>x.passed).length,
    failed:checks.filter(x=>!x.passed),architecture:`${INPUTS}-${HIDDEN}-1`};
}
