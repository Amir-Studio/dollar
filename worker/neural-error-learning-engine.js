// Neural semantic error memory for Dollar.
// Uses pretrained BGE-M3 embeddings to retrieve human-verified corrections.
// This is retrieval-based adaptation, not fine-tuning or automatic truth assignment.
export const NEURAL_ERROR_MEMORY_VERSION = "dollar-neural-error-memory-1.0.0";
const MODEL = "@cf/baai/bge-m3";
const KEY = "neural:error-memory:index:v1";
const TTL = 60 * 60 * 24 * 30;
const MAX_CASES = 120;
const BATCH = 32;

function vectorsOf(result) {
  const rows = result?.data || result?.embeddings || result?.result?.data;
  if (!Array.isArray(rows) || !Array.isArray(rows[0])) throw new Error("Unsupported BGE-M3 embedding response");
  return rows.map(row => Array.from(row, Number));
}
async function embed(ai, texts) {
  const rows = vectorsOf(await ai.run(MODEL, { text: texts }));
  if (rows.length !== texts.length || rows.some(row => !row.length || row.some(x => !Number.isFinite(x)))) {
    throw new Error("Invalid neural embedding batch");
  }
  return rows;
}
function cosine(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length || !a.length) return 0;
  let dot = 0, aa = 0, bb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; aa += a[i] * a[i]; bb += b[i] * b[i]; }
  return aa && bb ? dot / Math.sqrt(aa * bb) : 0;
}
function compactCase(item) {
  const input = String(item?.input_text || "").normalize("NFKC").trim().slice(0, 5000);
  const expected = item?.expected_output;
  if (!input || !expected || typeof expected !== "object" || Array.isArray(expected)) return null;
  const feedbackId = String(item.feedback_id || item.id || "");
  if (!feedbackId) return null;
  const category = String(item.category || "other").slice(0, 80);
  const results = Array.isArray(item.results) ? item.results : [];
  return {
    id: String(item.id || feedbackId).slice(0, 100),
    feedback_id: feedbackId.slice(0, 100),
    category,
    input,
    expected,
    corrected_paths: results.filter(x => !x.passed).slice(0, 8).map(x => ({
      path: String(x.path || "").slice(0, 120),
      expected: x.expected,
      previous_output: x.actual
    }))
  };
}
function fingerprint(items) {
  return items.map(x => x.feedback_id + ":" + x.id + ":" + x.category).sort().join("|").slice(0, 12000);
}
export async function refreshNeuralErrorMemory(evaluatedCases, env) {
  if (!env?.AI?.run) return { refreshed: false, reason: "workers_ai_unavailable", indexed: 0 };
  if (!env?.MARKET_CACHE) return { refreshed: false, reason: "market_cache_unavailable", indexed: 0 };
  const items = (Array.isArray(evaluatedCases) ? evaluatedCases : [])
    .map(compactCase).filter(Boolean)
    .filter(x => x.input.length >= 20)
    .slice(0, MAX_CASES);
  const signature = fingerprint(items);
  if (!items.length) {
    await env.MARKET_CACHE.put(KEY, JSON.stringify({ version: NEURAL_ERROR_MEMORY_VERSION, model: MODEL, signature, items: [], vectors: [], updated_at: new Date().toISOString() }), { expirationTtl: TTL });
    return { refreshed: true, indexed: 0, reason: "no_verified_corrections" };
  }
  const cached = await env.MARKET_CACHE.get(KEY, "json");
  if (cached?.signature === signature && cached?.items?.length === items.length && cached?.vectors?.length === items.length) {
    return { refreshed: false, cache_hit: true, indexed: items.length, model: MODEL };
  }
  const vectors = [];
  for (let i = 0; i < items.length; i += BATCH) {
    const batch = items.slice(i, i + BATCH);
    const texts = batch.map(x => "Verified news-analysis correction. Category: " + x.category + ". Input: " + x.input);
    vectors.push(...await embed(env.AI, texts));
  }
  const index = { version: NEURAL_ERROR_MEMORY_VERSION, model: MODEL, signature, items, vectors, updated_at: new Date().toISOString() };
  await env.MARKET_CACHE.put(KEY, JSON.stringify(index), { expirationTtl: TTL });
  return { refreshed: true, indexed: items.length, embedding_dimension: vectors[0]?.length || 0, model: MODEL };
}
export async function retrieveNeuralErrorGuidance(text, env, options = {}) {
  const source = String(text || "").normalize("NFKC").trim().slice(0, 10000);
  if (!source) return { status: "empty_input", matches: [], version: NEURAL_ERROR_MEMORY_VERSION };
  if (!env?.AI?.run || !env?.MARKET_CACHE) return {
    status: !env?.AI?.run ? "workers_ai_unavailable" : "market_cache_unavailable",
    matches: [], version: NEURAL_ERROR_MEMORY_VERSION
  };
  const index = await env.MARKET_CACHE.get(KEY, "json");
  if (!index?.items?.length || index.items.length !== index.vectors?.length) {
    return { status: "no_verified_error_memory", matches: [], version: NEURAL_ERROR_MEMORY_VERSION, indexed_cases: 0 };
  }
  const [query] = await embed(env.AI, ["News-analysis case for comparison: " + source]);
  const minimum = Number.isFinite(Number(options.minimumScore)) ? Number(options.minimumScore) : 0.56;
  const matches = index.items.map((item, i) => ({
    feedback_id: item.feedback_id,
    category: item.category,
    similarity: Number(cosine(query, index.vectors[i]).toFixed(5)),
    verified_correction: item.expected,
    corrected_paths: item.corrected_paths
  })).filter(x => x.similarity >= minimum)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, Math.max(1, Math.min(5, Number(options.limit) || 3)));
  return {
    status: matches.length ? "verified_error_memory_matches_found" : "no_close_verified_error_match",
    model: MODEL, version: NEURAL_ERROR_MEMORY_VERSION,
    indexed_cases: index.items.length, embedding_dimension: query.length,
    matches,
    policy: "Retrieved corrections are evidence for review, not automatic overrides of current analysis or verified market facts."
  };
}
export async function runNeuralErrorMemorySelfTest(ai) {
  if (!ai?.run) return { passed: false, skipped: true, reason: "Workers AI binding unavailable" };
  const vectors = await embed(ai, [
    "The central bank raised its policy interest rate.",
    "The monetary authority increased borrowing costs.",
    "A football club won its championship match."
  ]);
  const related = cosine(vectors[0], vectors[1]);
  const unrelated = cosine(vectors[0], vectors[2]);
  const checks = [
    { name: "valid_embedding_shape", passed: vectors[0].length > 0 },
    { name: "semantic_neighbor_beats_unrelated_text", passed: related > unrelated }
  ];
  return { version: NEURAL_ERROR_MEMORY_VERSION, model: MODEL, total: checks.length,
    passed: checks.filter(x => x.passed).length, failed: checks.filter(x => !x.passed), checks };
}
