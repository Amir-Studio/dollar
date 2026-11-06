import test from "node:test";
import assert from "node:assert/strict";
import { buildForecast } from "../worker/forecast-engine.js";

function series(count, dailyLogReturn = 0.002) {
  return Array.from({length:count},(_,i)=>({
    t:Date.UTC(2026,0,1+i),
    p:100*Math.exp(dailyLogReturn*i+0.001*Math.sin(i/3))
  }));
}

test("walk-forward ensemble emits a forecast only when it beats the no-change baseline",()=>{
  const result=buildForecast(series(120),series(120).at(-1).p,7);
  assert.equal(result.eligible,true);
  assert.ok(result.predicted_price>result.reference_price);
  assert.ok(result.validation.samples>=10);
  assert.ok(result.lower_price<result.predicted_price);
  assert.ok(result.upper_price>result.predicted_price);
});

test("engine withholds forecasts when history is too short",()=>{
  const result=buildForecast(series(20),series(20).at(-1).p,7);
  assert.equal(result.eligible,false);
  assert.match(result.reason,/تاریخچه/);
});

test("engine withholds forecasts when walk-forward evidence does not beat naive baseline",()=>{
  const flat=Array.from({length:120},(_,i)=>({t:Date.UTC(2026,0,1+i),p:100}));
  const result=buildForecast(flat,100,7);
  assert.equal(result.eligible,false);
  assert.match(result.reason,/ساده/);
});
