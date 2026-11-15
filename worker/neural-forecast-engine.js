// Deterministic supervised MLP for market-return forecasting.
// Training uses only matured labels available at the forecast origin.
// This is a price-series model, not a language model or a trading instruction.
export const NEURAL_MODEL_VERSION = "dollar-price-mlp-3.0.0-temporal-multifold";
const INPUTS = 15;
const HIDDEN = 24;
const HIDDEN2 = 12;
const ENSEMBLE_SIZE = 9;
const MAX_TRAINING_ROWS = 300;
const MIN_TRAINING_ROWS = 90;
const MAX_EPOCHS = 40;
const PATIENCE = 6;
const LEARNING_RATE = 0.003;
const WEIGHT_DECAY = 0.0003;
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
  const recentReturns=daily.slice(-14);
  const gains=recentReturns.filter(x=>x>0),losses=recentReturns.filter(x=>x<0).map(Math.abs);
  const avgGain=gains.reduce((s,x)=>s+x,0)/Math.max(1,recentReturns.length);
  const avgLoss=losses.reduce((s,x)=>s+x,0)/Math.max(1,recentReturns.length);
  const rsi=avgGain+avgLoss>0?(avgGain-avgLoss)/(avgGain+avgLoss):0;
  const downside=Math.sqrt(recentReturns.reduce((s,x)=>s+Math.min(0,x)**2,0)/Math.max(1,recentReturns.length));
  const upside=Math.sqrt(recentReturns.reduce((s,x)=>s+Math.max(0,x)**2,0)/Math.max(1,recentReturns.length));
  const high30=Math.max(...points.slice(Math.max(0,index-29),index+1).map(x=>Number(x.p)));
  const vol7=volatility(7),vol20=volatility(20);
  return [
    logReturn(p,valueAtOrAfter(points,index,1)),
    logReturn(p,valueAtOrAfter(points,index,3)),
    logReturn(p,valueAtOrAfter(points,index,7)),
    logReturn(p,valueAtOrAfter(points,index,14)),
    logReturn(p,valueAtOrAfter(points,index,30)),
    vol7,vol20,
    logReturn(p,old20)/Math.max(1,(Number(points[index].t)-Number(points[Math.max(0,index-20)].t))/DAY),
    ma>0?Math.log(p/ma):0,
    vol20>1e-9?vol7/vol20:1,
    rsi,
    downside,
    upside,
    downside+upside>1e-9?(upside-downside)/(upside+downside):0,
    high30>0?Math.log(p/high30):0
  ];
}
function fitScaler(rows) {
  const mean=Array(INPUTS).fill(0),scale=Array(INPUTS).fill(0);
  for(const row of rows) for(let j=0;j<INPUTS;j++) mean[j]+=row[j]/rows.length;
  for(const row of rows) for(let j=0;j<INPUTS;j++) scale[j]+=(row[j]-mean[j])**2/rows.length;
  for(let j=0;j<INPUTS;j++) scale[j]=Math.max(Math.sqrt(scale[j]),1e-6);
  return {mean,scale,apply(row){return row.map((x,j)=>clamp((x-mean[j])/scale[j],-5,5));}};
}
function makeNetwork(initialSeed=0x6d2b79f5) {
  let seed=initialSeed>>>0;
  const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
  const matrix=(rows,cols)=>Array.from({length:rows},()=>Array.from({length:cols},()=>((random()*2)-1)*Math.sqrt(6/(rows+cols))));
  return {
    w1:matrix(HIDDEN,INPUTS),b1:Array(HIDDEN).fill(0),
    w2:matrix(HIDDEN2,HIDDEN),b2:Array(HIDDEN2).fill(0),
    w3:Array.from({length:HIDDEN2},()=>((random()*2)-1)*Math.sqrt(6/(HIDDEN2+1))),b3:0
  };
}
function forward(net,x) {
  const hidden1=net.w1.map((weights,i)=>Math.tanh(weights.reduce((sum,w,j)=>sum+w*x[j],net.b1[i])));
  const hidden2=net.w2.map((weights,i)=>Math.tanh(weights.reduce((sum,w,j)=>sum+w*hidden1[j],net.b2[i])));
  const output=Math.tanh(hidden2.reduce((sum,h,i)=>sum+h*net.w3[i],net.b3));
  return {hidden1,hidden2,output};
}
function zerosLike(value) {
  return Array.isArray(value)?value.map(zerosLike):0;
}
function makeAdamState(value) {
  return Array.isArray(value)?value.map(makeAdamState):{m:0,v:0};
}
function applyAdam(parameter,gradient,state,step,decay=false) {
  if(Array.isArray(parameter)) {
    for(let i=0;i<parameter.length;i++) {
      if(Array.isArray(parameter[i])) applyAdam(parameter[i],gradient[i],state[i],step,decay);
      else parameter[i]=applyAdam(parameter[i],gradient[i],state[i],step,decay);
    }
    return parameter;
  }
  const g=clamp(gradient+(decay?WEIGHT_DECAY*parameter:0),-GRADIENT_LIMIT,GRADIENT_LIMIT);
  state.m=0.9*state.m+0.1*g;
  state.v=0.999*state.v+0.001*g*g;
  const mHat=state.m/(1-Math.pow(0.9,step));
  const vHat=state.v/(1-Math.pow(0.999,step));
  return parameter-LEARNING_RATE*mHat/(Math.sqrt(vHat)+1e-8);
}
function huber(error) {
  const a=Math.abs(error);
  return a<=1?0.5*error*error:a-0.5;
}
function makeOptimizer(net) {
  return {w1:makeAdamState(net.w1),b1:makeAdamState(net.b1),w2:makeAdamState(net.w2),b2:makeAdamState(net.b2),
    w3:makeAdamState(net.w3),b3:{m:0,v:0}};
}
function trainOneEpoch(net,x,labels,optimizer,step) {
  const g={w1:zerosLike(net.w1),b1:zerosLike(net.b1),w2:zerosLike(net.w2),b2:zerosLike(net.b2),
    w3:zerosLike(net.w3),b3:0};
  let loss=0;
  for(let i=0;i<x.length;i++) {
    const {hidden1,hidden2,output}=forward(net,x[i]),error=output-labels[i];
    loss+=huber(error);
    const delta3=clamp(error,-1,1)*(1-output*output);
    g.b3+=delta3;
    for(let k=0;k<HIDDEN2;k++) {
      g.w3[k]+=delta3*hidden2[k];
      const delta2=delta3*net.w3[k]*(1-hidden2[k]*hidden2[k]);
      g.b2[k]+=delta2;
      for(let j=0;j<HIDDEN;j++) {
        g.w2[k][j]+=delta2*hidden1[j];
        const delta1=delta2*net.w2[k][j]*(1-hidden1[j]*hidden1[j]);
        g.b1[j]+=delta1;
        for(let f=0;f<INPUTS;f++) g.w1[j][f]+=delta1*x[i][f];
      }
    }
  }
  const inv=1/Math.max(1,x.length);
  const scale=value=>Array.isArray(value)?value.map(scale):value*inv;
  for(const key of ["w1","b1","w2","b2","w3","b3"]) g[key]=scale(g[key]);
  net.w1=applyAdam(net.w1,g.w1,optimizer.w1,step,true);
  net.b1=applyAdam(net.b1,g.b1,optimizer.b1,step);
  net.w2=applyAdam(net.w2,g.w2,optimizer.w2,step,true);
  net.b2=applyAdam(net.b2,g.b2,optimizer.b2,step);
  net.w3=applyAdam(net.w3,g.w3,optimizer.w3,step,true);
  net.b3=applyAdam(net.b3,g.b3,optimizer.b3,step);
  return loss/Math.max(1,x.length);
}
function fitCore(rows,labels,epochs,seed=0x6d2b79f5) {
  const scaler=fitScaler(rows),x=rows.map(scaler.apply),net=makeNetwork(seed),optimizer=makeOptimizer(net);
  let loss=0;
  for(let epoch=0;epoch<epochs;epoch++) loss=trainOneEpoch(net,x,labels,optimizer,epoch+1);
  return {net,scaler,loss};
}
function validationLoss(net,scaler,rows,labels) {
  let total=0;
  for(let i=0;i<rows.length;i++) total+=huber(forward(net,scaler.apply(rows[i])).output-labels[i]);
  return total/Math.max(1,rows.length);
}
function chooseEpochs(examples,labels,horizonDays) {
  const fractions=[0.60,0.72,0.84],folds=[];
  for(let fold=0;fold<fractions.length;fold++) {
    const split=Math.floor(examples.length*fractions[fold]);
    const end=fold===fractions.length-1?examples.length:Math.floor(examples.length*fractions[fold+1]);
    const validStart=examples[split]?.origin_time;
    const trainIndices=examples.slice(0,split).map((item,index)=>({item,index}))
      .filter(x=>x.item.target_time<validStart).map(x=>x.index);
    const validIndices=Array.from({length:Math.max(0,end-split)},(_,i)=>split+i);
    const trainRows=trainIndices.map(i=>examples[i].features),trainLabels=trainIndices.map(i=>labels[i]);
    const validRows=validIndices.map(i=>examples[i].features),validLabels=validIndices.map(i=>labels[i]);
    if(trainRows.length<35||validRows.length<10) continue;
    const scaler=fitScaler(trainRows),x=trainRows.map(scaler.apply);
    const net=makeNetwork((0x6d2b79f5+Math.imul(fold+1,0x9e3779b9))>>>0);
    const optimizer=makeOptimizer(net);
    let best=Infinity,bestEpoch=1,stale=0,bestNet=null;
    for(let epoch=1;epoch<=epochLimit;epoch++) {
      trainOneEpoch(net,x,trainLabels,optimizer,epoch);
      const score=validationLoss(net,scaler,validRows,validLabels);
      if(score<best-1e-7){best=score;bestEpoch=epoch;stale=0;bestNet=structuredClone(net);} else stale++;
      if(stale>=PATIENCE) break;
    }
    if(bestNet) Object.assign(net,bestNet);
    const baseline=validLabels.reduce((sum,y)=>sum+huber(y),0)/validLabels.length;
    folds.push({epochs:bestEpoch,loss:best,baseline,samples:validRows.length,
      purged_training_samples:trainRows.length,checkpoint_restored:Boolean(bestNet)});
  }
  if(!folds.length) return {epochs:Math.min(12,MAX_EPOCHS),validation_loss:null,
    baseline_loss:null,validation_skill:null,purged_training_samples:0,validation_samples:0,validation_folds:0};
  const orderedEpochs=folds.map(x=>x.epochs).sort((a,b)=>a-b);
  const epochs=orderedEpochs[Math.floor(orderedEpochs.length/2)];
  const totalSamples=folds.reduce((sum,x)=>sum+x.samples,0);
  const loss=folds.reduce((sum,x)=>sum+x.loss*x.samples,0)/totalSamples;
  const baseline=folds.reduce((sum,x)=>sum+x.baseline*x.samples,0)/totalSamples;
  return {epochs,validation_loss:Number(loss.toFixed(8)),baseline_loss:Number(baseline.toFixed(8)),
    validation_skill:Number((baseline>0?1-loss/baseline:0).toFixed(6)),
    purged_training_samples:Math.min(...folds.map(x=>x.purged_training_samples)),
    validation_samples:totalSamples,validation_folds:folds.length,
    checkpoint_restored_folds:folds.filter(x=>x.checkpoint_restored).length};
}
function targetScale(labels) {
  const sorted=labels.map(Math.abs).sort((a,b)=>a-b);
  const medianAbs=sorted[Math.floor(sorted.length*0.5)]||0;
  return clamp(medianAbs*2.5,0.003,0.12);
}
function buildExamples(points,horizonDays,maxRows=MAX_TRAINING_ROWS) {
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
      examples.push({features,target:clamp(target,-0.30,0.30),origin_time:Number(points[i].t),target_time:Number(points[j].t)});
  }
  return examples.slice(-maxRows);
}
export function trainNeuralReturnModel(points,horizonDays,options={}) {
  const horizon=Number(horizonDays);
  if(![1,3,7].includes(horizon)) return {available:false,reason:"unsupported_horizon",version:NEURAL_MODEL_VERSION};
  if(!validSeries(points)) return {available:false,reason:"invalid_or_unsorted_price_history",version:NEURAL_MODEL_VERSION};
  if(points.length<90) return {available:false,reason:"insufficient_history",observations:points.length,version:NEURAL_MODEL_VERSION};
  const fast=options.fast===true;
  const examples=buildExamples(points,horizon,fast?140:MAX_TRAINING_ROWS);
  if(examples.length<MIN_TRAINING_ROWS) return {available:false,reason:"insufficient_matured_examples",
    training_samples:examples.length,required_samples:MIN_TRAINING_ROWS,version:NEURAL_MODEL_VERSION};
  const rows=examples.map(x=>x.features),rawTargets=examples.map(x=>x.target);
  const scale=targetScale(rawTargets),labels=rawTargets.map(x=>clamp(x/scale,-0.98,0.98));
  const selection=chooseEpochs(examples,labels,horizon);
  const latestFeatures=featuresAt(points,points.length-1);
  const members=Array.from({length:ENSEMBLE_SIZE},(_,i)=>
    fitCore(rows,labels,selection.epochs,(0x6d2b79f5+Math.imul(i+1,0x9e3779b9))>>>0));
  const memberPredictions=members.map(member=>forward(member.net,member.scaler.apply(latestFeatures)).output*scale);
  const ensembleMean=memberPredictions.reduce((sum,x)=>sum+x,0)/memberPredictions.length;
  const ensembleStd=Math.sqrt(memberPredictions.reduce((sum,x)=>sum+(x-ensembleMean)**2,0)/memberPredictions.length);
  const fitted=members[0];
  const validationSkill=Number(selection.validation_skill);
  const skillGate=Number.isFinite(validationSkill)?clamp((validationSkill+0.05)/0.55,0,1):0;
  const prediction=ensembleMean*skillGate;
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
    training_samples:examples.length,architecture:`${INPUTS}-${HIDDEN}-${HIDDEN2}-1`,ensemble_size:ENSEMBLE_SIZE,
    epochs:selection.epochs,validation_huber_loss:selection.validation_loss,
    validation_baseline_huber_loss:selection.baseline_loss,validation_skill:selection.validation_skill,
    ensemble_prediction_std:Number(ensembleStd.toFixed(8)),validation_skill_gate:Number(skillGate.toFixed(4)),
    purged_training_samples:selection.purged_training_samples,validation_samples:selection.validation_samples,
    validation_folds:selection.validation_folds,
    final_training_huber_loss:Number(fitted.loss.toFixed(8)),target_scale:Number(scale.toFixed(6)),
    volatility_cap:Number(volatilityCap.toFixed(6)),horizon_days:horizon,
    version:NEURAL_MODEL_VERSION,compute_mode:fast?"single_member_walkforward_proxy":"full_ensemble",
    training_method:fast?"deep_15_24_12_1_adam_huber_sparse_walkforward_proxy":"deep_15_24_12_1_adam_huber_purged_expanding_walk_forward"
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
    failed:checks.filter(x=>!x.passed),architecture:`${INPUTS}-${HIDDEN}-1`,ensemble_size:ENSEMBLE_SIZE};
}
