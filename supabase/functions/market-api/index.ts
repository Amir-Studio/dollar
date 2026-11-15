import worker, { collectGlobalCountryTestBatch, reanalyzeCountryTestBatch, refreshBackground, runNewsLearningCycle } from "./worker/index.js";
import { runForecastCycle } from "./worker/forecast-engine.js";

const env = {
  SUPABASE_URL: Deno.env.get("SUPABASE_URL") ?? "",
  SUPABASE_SERVICE_ROLE_KEY: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  MARKET_DATA_URL: Deno.env.get("MARKET_DATA_URL") ?? "",
  HISTORY_BASE_URL: Deno.env.get("HISTORY_BASE_URL") ?? "",
  // The recurring refresh is scheduled by Supabase Cron, not by a browser timer.
  BACKGROUND_REFRESH_ENABLED: "true",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "access-control-allow-origin": "https://amir-studio.github.io", "access-control-allow-methods": "GET, POST, OPTIONS", "access-control-allow-headers": "Content-Type, apikey, x-learner-id, x-learner-token" },
  });

function routePath(url: URL) {
  const marker = url.pathname.indexOf("/market-api");
  return marker >= 0 ? (url.pathname.slice(marker + "/market-api".length) || "/") : (url.pathname || "/");
}

async function sha256Hex(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function constantTimeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

async function verifyRefreshSecret(request: Request) {
  const supplied = request.headers.get("x-cron-secret") ?? "";
  if (!supplied || !env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return false;
  const base = env.SUPABASE_URL.replace(/\/+$/, "");
  const response = await fetch(base + "/rest/v1/market_refresh_gate?select=secret_sha256&id=eq.1", {
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      authorization: "Bearer " + env.SUPABASE_SERVICE_ROLE_KEY,
      accept: "application/json",
    },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error("Refresh authorization store HTTP " + response.status);
  const rows = await response.json();
  if (!Array.isArray(rows) || rows.length !== 1 || typeof rows[0]?.secret_sha256 !== "string") return false;
  return constantTimeEqual(await sha256Hex(supplied), rows[0].secret_sha256);
}

Deno.serve(async (request: Request) => {
  const url = new URL(request.url);
  const route = routePath(url);

  if (route === "/language/german-progress") {
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: {
      "access-control-allow-origin": "https://amir-studio.github.io",
      "access-control-allow-methods": "GET, POST, OPTIONS",
      "access-control-allow-headers": "Content-Type, apikey, x-learner-id, x-learner-token",
      "access-control-max-age": "86400",
    }});
    if (request.method !== "GET" && request.method !== "POST") return json({ error: "Method not allowed" }, 405);
    const learnerId = request.headers.get("x-learner-id") || "";
    const learnerToken = request.headers.get("x-learner-token") || "";
    if (!/^[0-9a-f-]{36}$/i.test(learnerId) || !/^[A-Za-z0-9_-]{40,100}$/.test(learnerToken)) {
      return json({ error: "Invalid learner credentials" }, 400);
    }
    const tokenHash = await sha256Hex(learnerToken);
    const base = env.SUPABASE_URL.replace(/\\/+$/, "");
    const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
    if (!base || !serviceKey) return json({ error: "Progress storage unavailable" }, 503);
    const tableUrl = base + "/rest/v1/german_news_vocabulary_progress";
    const headers = { apikey: serviceKey, authorization: "Bearer " + serviceKey, "content-type": "application/json", accept: "application/json" };
    if (request.method === "GET") {
      const query = new URLSearchParams({ select: "progress,updated_at", learner_id: "eq." + learnerId, token_sha256: "eq." + tokenHash, limit: "1" });
      const response = await fetch(tableUrl + "?" + query.toString(), { headers, signal: AbortSignal.timeout(8000) });
      if (!response.ok) return json({ error: "Progress lookup failed" }, 502);
      const rows = await response.json();
      return json({ ok: true, progress: rows[0]?.progress || null, updated_at: rows[0]?.updated_at || null });
    }
    const declaredLength = Number(request.headers.get("content-length") || 0);
    if (declaredLength > 65536) return json({ error: "Progress payload too large" }, 413);
    let payload: any;
    try { payload = await request.json(); } catch { return json({ error: "Invalid JSON" }, 400); }
    const progress = payload?.progress;
    if (!progress || typeof progress !== "object" || Array.isArray(progress)) return json({ error: "Invalid progress object" }, 400);
    const ids = [
      ...(Array.isArray(progress.known) ? progress.known : []),
      ...(Array.isArray(progress.learning) ? progress.learning : []),
      ...(Array.isArray(progress.due) ? progress.due.map((item: any) => item?.id) : []),
    ];
    if (ids.length > 1000 || ids.some((id) => typeof id !== "string" || !/^de\\d{3}$/.test(id))) {
      return json({ error: "Progress contains invalid vocabulary identifiers" }, 400);
    }
    const body = { learner_id: learnerId, token_sha256: tokenHash, progress, updated_at: new Date().toISOString() };
    const response = await fetch(tableUrl + "?on_conflict=learner_id", {
      method: "POST", headers: { ...headers, prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(body), signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return json({ error: "Progress save failed" }, 502);
    return json({ ok: true, saved: true });
  }

  if (route === "/news/global-test/verify") {
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
    if (!(await verifyRefreshSecret(request))) return json({ error: "Unauthorized" }, 401);
    return json({ ok: true, service: "global-country-news-test-auth" });
  }

  if (route === "/news/global-test/reanalyze") {
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
    try {
      if (!(await verifyRefreshSecret(request))) return json({ error: "Unauthorized" }, 401);
      const result = await reanalyzeCountryTestBatch(env, 10);
      return json({ ok: true, service: "global-country-news-test", ...result });
    } catch (error) {
      console.error("Global country article reanalysis failed:", error);
      return json({ ok: false, error: "Global country article reanalysis failed", detail: String(error?.message ?? error).slice(0, 220) }, 502);
    }
  }

  if (route === "/news/global-test/refresh") {
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
    try {
      if (!(await verifyRefreshSecret(request))) return json({ error: "Unauthorized" }, 401);
      const result = await collectGlobalCountryTestBatch(env, request.headers.get("x-cron-secret") || "");
      return json({ ok: Boolean(result.ran || result.complete), service: "global-country-news-test", ...result });
    } catch (error) {
      console.error("Global country news test refresh failed:", error);
      return json({ ok: false, error: "Global country test batch failed", detail: String(error?.message ?? error).slice(0, 220) }, 502);
    }
  }

  if (route === "/refresh") {
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
    try {
      if (!(await verifyRefreshSecret(request))) return json({ error: "Unauthorized" }, 401);
      const market = await refreshBackground(env);
      const forecastCycle = await runForecastCycle(env, market);
      const newsLearningCycle = await runNewsLearningCycle(env);
      return json({
        ok: true,
        service: "dollar-market-intelligence",
        refreshed_at: new Date().toISOString(),
        quotes: Array.isArray(market?.data) ? market.data.length : 0,
        forecast_cycle: forecastCycle,
        news_learning_cycle: newsLearningCycle,
      });
    } catch (error) {
      console.error("Dollar scheduled refresh failed:", error);
      return json({ ok: false, error: "Market refresh failed", detail: String(error?.message ?? error).slice(0, 220) }, 502);
    }
  }

  if (((route === "/news/feedback" || route === "/news/learning/review") && request.method === "POST") ||
      (route === "/news/learning" && request.method === "GET")) {
    try { if (!(await verifyRefreshSecret(request))) return json({ error: "Unauthorized" }, 401); }
    catch (error) { console.error("News learning authorization failed:", error); return json({ error: "Authorization check failed" }, 503); }
    const headers = new Headers(request.headers);
    headers.delete("x-cron-secret");
    headers.set("x-internal-learning-authorized", "1");
    const body = request.method === "GET" || request.method === "HEAD" ? null : await request.arrayBuffer();
    const target = new URL(route + url.search, "https://dollar-api.internal");
    return worker.fetch(new Request(target, { method: request.method, headers, body }), env);
  }
  const target = new URL(route + url.search, "https://dollar-api.internal");
  const forwarded = new Request(target, request);
  return worker.fetch(forwarded, env);
});
