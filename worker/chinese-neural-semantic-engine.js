// Pretrained multilingual neural-semantic retrieval for Chinese market news.
// Uses Cloudflare Workers AI BGE-M3 embeddings; no hand-written phrase rules are used
// for semantic ranking. The curated vocabulary supplies reviewed concept labels.
import { getChineseNewsVocabulary } from "./news-vocabulary-zh.js";

export const CHINESE_NEURAL_VERSION = "bge-m3-zh-semantic-1.0.0";
const MODEL = "@cf/baai/bge-m3";
const INDEX_KEY = "neural:zh:bge-m3:index:v1";
const CACHE_TTL = 60 * 60 * 24 * 30;
const BATCH_SIZE = 48;

function vectorFrom(result) {
  const vectors = result?.data || result?.embeddings || result?.result?.data;
  if (!Array.isArray(vectors) || !Array.isArray(vectors[0])) {
    throw new Error("Workers AI returned an unsupported embedding response");
  }
  return vectors.map(v => Array.from(v, Number));
}
function cosine(a, b) {
  let dot = 0, aa = 0, bb = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    dot += a[i] * b[i]; aa += a[i] * a[i]; bb += b[i] * b[i];
  }
  return aa && bb ? dot / Math.sqrt(aa * bb) : 0;
}
async function embed(ai, texts) {
  const result = await ai.run(MODEL, { text: texts });
  return vectorFrom(result);
}
async function loadIndex(env, rows) {
  if (env.MARKET_CACHE) {
    const cached = await env.MARKET_CACHE.get(INDEX_KEY, "json");
    if (cached?.ids?.length === rows.length && cached?.vectors?.length === rows.length) return cached;
  }
  const vectors = [];
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const texts = batch.map(x => [x.zh, x.english, x.fa, x.category.replaceAll("_", " ")].join(" | "));
    const encoded = await embed(env.AI, texts);
    if (encoded.length !== batch.length) throw new Error("Embedding batch size mismatch");
    vectors.push(...encoded);
  }
  const index = { model: MODEL, version: CHINESE_NEURAL_VERSION, ids: rows.map(x => x.id), vectors };
  if (env.MARKET_CACHE) {
    await env.MARKET_CACHE.put(INDEX_KEY, JSON.stringify(index), { expirationTtl: CACHE_TTL });
  }
  return index;
}

export async function analyzeChineseNewsNeurally(text, env, options = {}) {
  const source = String(text || "").normalize("NFKC").trim().slice(0, 6000);
  if (!source) return { status: "empty_input", model: MODEL, matches: [] };
  if (!env?.AI?.run) return {
    status: "neural_binding_not_configured", model: MODEL, matches: [],
    setup: "Configure the Cloudflare Workers AI binding named AI before enabling neural semantic analysis."
  };
  const rows = getChineseNewsVocabulary({ limit: 1000 }).items;
  const [queryVector, index] = await Promise.all([
    embed(env.AI, [source]).then(x => x[0]),
    loadIndex(env, rows)
  ]);
  const byId = new Map(rows.map(x => [x.id, x]));
  const matches = index.vectors.map((vector, i) => ({
    ...byId.get(index.ids[i]), semantic_score: Number(cosine(queryVector, vector).toFixed(5)),
    match_type: "pretrained_neural_embedding"
  })).sort((a, b) => b.semantic_score - a.semantic_score)
    .filter(x => x.semantic_score >= (Number(options.minimumScore) || 0.30))
    .slice(0, Math.max(1, Math.min(30, Number(options.limit) || 12)));
  return {
    status: "neural_semantic_analysis_complete", model: MODEL,
    model_version: CHINESE_NEURAL_VERSION, vocabulary_size: rows.length,
    embedding_dimension: queryVector.length, matches
  };
}

export async function runChineseNeuralSelfTest(ai) {
  if (!ai?.run) return { passed: false, skipped: true, reason: "Workers AI binding unavailable" };
  const vectors = await embed(ai, ["通货膨胀与利率政策", "通货膨胀与利率政策", "足球比赛结果"]);
  const same = cosine(vectors[0], vectors[1]);
  const unrelated = cosine(vectors[0], vectors[2]);
  return {
    passed: vectors.length === 3 && vectors[0].length > 0 && same > unrelated,
    checks: { vector_shape: vectors[0].length > 0, identical_text_similarity: same, unrelated_text_similarity: unrelated },
    model: MODEL, version: CHINESE_NEURAL_VERSION
  };
}
