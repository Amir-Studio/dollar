// Small, deterministic, trainable neural network for market-return forecasting.
// This is a supervised MLP, not a language model. It learns only from matured
// historical price windows available at each walk-forward origin.
export const NEURAL_MODEL_VERSION = "dollar-price-mlp-1.0.0";
const HIDDEN = 6;
const MAX_TRAINING_ROWS = 96;
const EPOCHS = 8;
const LEARNING_RATE = 0.012;
const DAY = 86400000;
function logReturn(a, b) { return a > 0 && b > 0 ? Math.log(a / b) : 0; }
function featuresAt(points, index) {
  const p = points[index]?.p;
  const at = days => {
    const target = points[index]?.t - days * DAY;
    let j = index;
    while (j > 0 && points[j - 1].t >= target) j--;
    return points[j]?.p || p;
  };
  const daily = [];
  for (let k = Math.max(1, index - 20); k <= index; k++) daily.push(logReturn(points[k].p, points[k - 1].p));
  const vol = window => {
    const sample = daily.slice(-window), m = sample.reduce((s, x) => s + x, 0) / Math.max(1, sample.length);
    return Math.sqrt(sample.reduce((s, x) => s + (x - m) ** 2, 0) / Math.max(1, sample.length));
  };
  const maWindow = points.slice(Math.max(0, index - 19), index + 1);
  const ma = maWindow.reduce((s, x) => s + x.p, 0) / Math.max(1, maWindow.length);
  const slope = logReturn(p, points[Math.max(0, index - 20)].p) / Math.max(1, Math.min(20, index));
  return [logReturn(p, at(1)), logReturn(p, at(3)), logReturn(p, at(7)), logReturn(p, at(14)),
    logReturn(p, at(30)), vol(7), vol(20), slope, ma > 0 ? Math.log(p / ma) : 0];
}
function standardize(rows) {
  const width = rows[0].length, mean = Array(width).fill(0), scale = Array(width).fill(0);
  for (const row of rows) for (let j = 0; j < width; j++) mean[j] += row[j] / rows.length;
  for (const row of rows) for (let j = 0; j < width; j++) scale[j] += (row[j] - mean[j]) ** 2 / rows.length;
  for (let j = 0; j < width; j++) scale[j] = Math.max(Math.sqrt(scale[j]), 1e-5);
  return { apply: row => row.map((x, j) => Math.max(-5, Math.min(5, (x - mean[j]) / scale[j]))) };
}
function makeNetwork(inputSize) {
  let seed = 0x51f15e;
  const random = () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 4294967296 - 0.5; };
  return {
    w1: Array.from({ length: HIDDEN }, () => Array.from({ length: inputSize }, () => random() * 0.35)),
    b1: Array(HIDDEN).fill(0), w2: Array.from({ length: HIDDEN }, () => random() * 0.25), b2: 0
  };
}
function forward(net, x) {
  const hidden = net.w1.map((weights, i) => Math.tanh(weights.reduce((s, w, j) => s + w * x[j], net.b1[i])));
  const output = Math.tanh(hidden.reduce((s, h, i) => s + h * net.w2[i], net.b2));
  return { hidden, output };
}
function train(rows, labels, inputSize) {
  const scaler = standardize(rows), x = rows.map(scaler.apply), net = makeNetwork(inputSize);
  let loss = 0;
  for (let epoch = 0; epoch < EPOCHS; epoch++) {
    const gw1 = net.w1.map(row => row.map(() => 0)), gb1 = Array(HIDDEN).fill(0), gw2 = Array(HIDDEN).fill(0);
    let gb2 = 0; loss = 0;
    for (let i = 0; i < x.length; i++) {
      const { hidden, output } = forward(net, x[i]), error = output - labels[i];
      loss += error * error;
      const delta2 = 2 * error * (1 - output * output); gb2 += delta2;
      for (let h = 0; h < HIDDEN; h++) {
        gw2[h] += delta2 * hidden[h];
        const delta1 = delta2 * net.w2[h] * (1 - hidden[h] * hidden[h]); gb1[h] += delta1;
        for (let j = 0; j < inputSize; j++) gw1[h][j] += delta1 * x[i][j];
      }
    }
    const rate = LEARNING_RATE / x.length;
    for (let h = 0; h < HIDDEN; h++) {
      net.w2[h] -= rate * (gw2[h] + 0.001 * net.w2[h]); net.b1[h] -= rate * gb1[h];
      for (let j = 0; j < inputSize; j++) net.w1[h][j] -= rate * (gw1[h][j] + 0.001 * net.w1[h][j]);
    }
    net.b2 -= rate * gb2;
  }
  return { net, scaler, train_loss: loss / Math.max(1, x.length) };
}
export function trainNeuralReturnModel(points, horizonDays) {
  if (!Array.isArray(points) || ![1, 3, 7].includes(Number(horizonDays)) || points.length < 90)
    return { available: false, reason: "insufficient_history", version: NEURAL_MODEL_VERSION };
  const examples = [], start = Math.max(31, points.length - 180);
  for (let i = start; i < points.length - 1; i++) {
    const targetTime = points[i].t + Number(horizonDays) * DAY;
    let j = i + 1;
    while (j < points.length && points[j].t < targetTime) j++;
    if (j >= points.length || (points[j].t - targetTime) / DAY > 1.5) continue;
    const target = logReturn(points[j].p, points[i].p);
    if (Number.isFinite(target)) examples.push({ features: featuresAt(points, i), target: Math.max(-0.30, Math.min(0.30, target)) });
  }
  const selected = examples.slice(-MAX_TRAINING_ROWS);
  if (selected.length < 55) return { available: false, reason: "fewer_than_55_matured_training_examples",
    training_samples: selected.length, version: NEURAL_MODEL_VERSION };
  const rows = selected.map(x => x.features), labels = selected.map(x => x.target / 0.08);
  const fitted = train(rows, labels, rows[0].length), current = fitted.scaler.apply(featuresAt(points, points.length - 1));
  const raw = forward(fitted.net, current).output * 0.08;
  const recent = points.slice(-21), dailyReturns = recent.slice(1).map((x, i) => logReturn(x.p, recent[i].p));
  const avg = dailyReturns.reduce((s, x) => s + x, 0) / Math.max(1, dailyReturns.length);
  const dailyVol = Math.sqrt(dailyReturns.reduce((s, x) => s + (x - avg) ** 2, 0) / Math.max(1, dailyReturns.length - 1));
  const cap = Math.min(0.30, Math.max(0.015, 3.5 * dailyVol * Math.sqrt(Number(horizonDays))));
  return { available: true, predicted_log_return: Math.max(-cap, Math.min(cap, raw)),
    training_samples: selected.length, train_loss: Number(fitted.train_loss.toFixed(8)), architecture: "9-6-1",
    epochs: EPOCHS, horizon_days: Number(horizonDays), version: NEURAL_MODEL_VERSION,
    training_method: "supervised_walk_forward_matured_price_windows" };
}
export function runNeuralForecastSelfTest() {
  const now = Date.UTC(2025, 0, 1), shortRows = Array.from({ length: 50 }, (_, i) => ({ t: now + i * DAY, p: 100 + i }));
  const sample = Array.from({ length: 320 }, (_, i) => ({ t: now + i * DAY, p: 100 * Math.exp(i * 0.001 + Math.sin(i / 9) * 0.012) }));
  const short = trainNeuralReturnModel(shortRows, 3), a = trainNeuralReturnModel(sample, 3), b = trainNeuralReturnModel(sample, 3);
  const flat = trainNeuralReturnModel(Array.from({ length: 320 }, (_, i) => ({ t: now + i * DAY, p: 100 * Math.exp(i * 0.0005) })), 7);
  const checks = [
    { name: "insufficient_history_is_withheld", passed: !short.available },
    { name: "deterministic_training", passed: a.available && a.predicted_log_return === b.predicted_log_return && Number.isFinite(a.train_loss) },
    { name: "finite_bounded_output", passed: flat.available && Number.isFinite(flat.predicted_log_return) && Math.abs(flat.predicted_log_return) <= 0.30 }
  ];
  return { version: NEURAL_MODEL_VERSION, total: checks.length, passed: checks.filter(x => x.passed).length,
    failed: checks.filter(x => !x.passed), architecture: "9-6-1" };
}
