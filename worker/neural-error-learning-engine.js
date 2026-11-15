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
    validation_report: item.validation_report && typeof item.validation_report === "object" ? item.validation_report : {},
    total: Number(item.total) || 0, passed: Number(item.passed) || 0, failed: Number(item.failed) || 0,
    results: Array.isArray(item.results) ? item.results.slice(0, 24) : [],
    corrected_paths: results.filter(x => !x.passed).slice(0, 8).map(x => ({
      path: String(x.path || "").slice(0, 120),
      expected: x.expected,
      previous_output: x.actual
    }))
  };
}
function fingerprint(items) {
  return items.map(x => x.feedback_id + ":" + x.id + ":" + x.category + ":" + JSON.stringify(x.expected) + ":" + x.input.slice(0, 160)).sort().join("|").slice(0, 12000);
}
async function supabaseRequest(env, path, options = {}) {
  const base = String(env?.SUPABASE_URL || "").replace(/\/+$/, "");
  const key = env?.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) throw new Error("Neural error memory storage is not configured");
  const response = await fetch(base + "/rest/v1/" + path, {
    method: options.method || "GET",
    headers: { apikey: key, authorization: "Bearer " + key, accept: "application/json",
      "content-type": "application/json", ...(options.headers || {}) },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: AbortSignal.timeout(10000)
  });
  const raw = await response.text();
  if (!response.ok) throw new Error("Neural memory database HTTP " + response.status + ": " + raw.slice(0,160));
  return raw ? JSON.parse(raw) : [];
}
function storedVector(item) {
  const memory = item?.validation_report?.neural_error_memory;
  return memory?.version === NEURAL_ERROR_MEMORY_VERSION && memory.signature === fingerprint([item]) && Array.isArray(memory.vector) &&
    memory.vector.length > 0 && memory.vector.every(Number.isFinite) ? memory.vector : null;
}
export async function refreshNeuralErrorMemory(evaluatedCases, env) {
  if (!env?.AI?.run) return { refreshed: false, reason: "workers_ai_unavailable", indexed: 0 };
  if (!env?.MARKET_CACHE && !(env?.SUPABASE_URL && env?.SUPABASE_SERVICE_ROLE_KEY)) {
    return { refreshed: false, reason: "persistent_storage_unavailable", indexed: 0 };
  }
  const items = (Array.isArray(evaluatedCases) ? evaluatedCases : [])
    .filter(item => Number(item?.total) > 0)
    .map(compactCase).filter(Boolean)
    .filter(x => x.input.length >= 20)
    .slice(0, MAX_CASES);
  if (!items.length) return { refreshed: false, indexed: 0, reason: "no_scorable_verified_corrections" };

  if (env.MARKET_CACHE) {
    const signature = fingerprint(items);
    const cached = await env.MARKET_CACHE.get(KEY, "json");
    if (cached?.signature === signature && cached?.items?.length === items.length && cached?.vectors?.length === items.length) {
      return { refreshed: false, cache_hit: true, indexed: items.length, storage: "cloudflare_kv", model: MODEL };
    }
    const vectors = [];
    for (let i = 0; i < items.length; i += BATCH) {
      const batch = items.slice(i, i + BATCH);
      const texts = batch.map(x => "Verified news-analysis correction. Category: " + x.category + ". Input: " + x.input);
      vectors.push(...await embed(env.AI, texts));
    }
    const index = { version: NEURAL_ERROR_MEMORY_VERSION, model: MODEL, signature, items, vectors, updated_at: new Date().toISOString() };
    await env.MARKET_CACHE.put(KEY, JSON.stringify(index), { expirationTtl: TTL });
    return { refreshed: true, indexed: items.length, embedding_dimension: vectors[0]?.length || 0, storage: "cloudflare_kv", model: MODEL };
  }

  const vectors = items.map(storedVector);
  const missing = [];
  for (let i = 0; i < items.length; i++) if (!vectors[i]) missing.push(i);
  if (!missing.length) return { refreshed: false, cache_hit: true, indexed: items.length, storage: "supabase_validation_report", model: MODEL };
  for (let offset = 0; offset < missing.length; offset += BATCH) {
    const indices = missing.slice(offset, offset + BATCH);
    const texts = indices.map(i => "Verified news-analysis correction. Category: " + items[i].category + ". Input: " + items[i].input);
    const encoded = await embed(env.AI, texts);
    for (let j = 0; j < indices.length; j++) vectors[indices[j]] = encoded[j];
  }
  const now = new Date().toISOString();
  for (let i = 0; i < items.length; i++) {
    if (storedVector(items[i])) continue;
    const item = items[i];
    const validationReport = {
      ...(item.validation_report || {}),
      total: item.total, passed: item.passed, failed: item.failed,
      results: item.results,
      evaluation_status: item.failed > 0 ? "failed" : "passed",
      neural_error_memory: {
        version: NEURAL_ERROR_MEMORY_VERSION, model: MODEL,
        signature: fingerprint([item]), vector: vectors[i], embedded_at: now
      }
    };
    await supabaseRequest(env, "market_news_learning_cases?id=eq." + encodeURIComponent(item.id), {
      method: "PATCH", headers: { prefer: "return=minimal" }, body: { validation_report: validationReport }
    });
  }
  return { refreshed: true, indexed: items.length, newly_embedded: missing.length,
    embedding_dimension: vectors.find(Boolean)?.length || 0, storage: "supabase_validation_report", model: MODEL };
}
export async function retrieveNeuralErrorGuidance(text, env, options = {}) {
  const source = String(text || "").normalize("NFKC").trim().slice(0, 10000);
  if (!source) return { status: "empty_input", matches: [], version: NEURAL_ERROR_MEMORY_VERSION };
  if (!env?.AI?.run || (!env?.MARKET_CACHE && !(env?.SUPABASE_URL && env?.SUPABASE_SERVICE_ROLE_KEY))) return {
    status: !env?.AI?.run ? "workers_ai_unavailable" : "persistent_storage_unavailable",
    matches: [], version: NEURAL_ERROR_MEMORY_VERSION
  };
  let items = [], vectors = [];
  if (env.MARKET_CACHE) {
    const index = await env.MARKET_CACHE.get(KEY, "json");
    items = Array.isArray(index?.items) ? index.items : [];
    vectors = Array.isArray(index?.vectors) ? index.vectors : [];
  } else {
    const rows = await supabaseRequest(env, "market_news_learning_cases?select=id,feedback_id,category,input_text,expected_output,validation_report&order=created_at.desc&limit=" + MAX_CASES);
    for (const row of rows || []) {
      const memory = row?.validation_report?.neural_error_memory;
      if (memory?.version !== NEURAL_ERROR_MEMORY_VERSION || !Array.isArray(memory.vector)) continue;
      items.push({feedback_id:row.feedback_id,category:row.category,expected:row.expected_output,corrected_paths:[]});
      vectors.push(memory.vector);
    }
  }
  if (!items.length || items.length !== vectors.length) {
    return { status: "no_verified_error_memory", matches: [], version: NEURAL_ERROR_MEMORY_VERSION, indexed_cases: 0 };
  }
  const [query] = await embed(env.AI, ["News-analysis case for comparison: " + source]);
  const minimum = Number.isFinite(Number(options.minimumScore)) ? Number(options.minimumScore) : 0.56;
  const matches = items.map((item, i) => ({
    feedback_id: item.feedback_id,
    category: item.category,
    similarity: Number(cosine(query, vectors[i]).toFixed(5)),
    verified_correction: item.expected,
    corrected_paths: item.corrected_paths || []
  })).filter(x => x.similarity >= minimum)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, Math.max(1, Math.min(5, Number(options.limit) || 3)));
  return {
    status: matches.length ? "verified_error_memory_matches_found" : "no_close_verified_error_match",
    model: MODEL, version: NEURAL_ERROR_MEMORY_VERSION,
    indexed_cases: items.length, embedding_dimension: query.length,
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
