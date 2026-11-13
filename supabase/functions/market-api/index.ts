import worker, { refreshBackground } from "./worker/index.js";
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
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
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

  if (route === "/refresh") {
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
    try {
      if (!(await verifyRefreshSecret(request))) return json({ error: "Unauthorized" }, 401);
      const market = await refreshBackground(env);
      const forecastCycle = await runForecastCycle(env, market);
      return json({
        ok: true,
        service: "dollar-market-intelligence",
        refreshed_at: new Date().toISOString(),
        quotes: Array.isArray(market?.data) ? market.data.length : 0,
        forecast_cycle: forecastCycle,
      });
    } catch (error) {
      console.error("Dollar scheduled refresh failed:", error);
      return json({ ok: false, error: "Market refresh failed", detail: String(error?.message ?? error).slice(0, 220) }, 502);
    }
  }

  const target = new URL(route + url.search, "https://dollar-api.internal");
  const forwarded = new Request(target, request);
  return worker.fetch(forwarded, env);
});
