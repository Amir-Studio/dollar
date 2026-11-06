import worker, { refreshBackground } from "../_shared/worker/index.js";
import { runForecastCycle } from "../_shared/worker/forecast-engine.js";

const FUNCTION_PREFIX = "/functions/v1/market-api";

function runtimeEnv() {
  return {
    SUPABASE_URL: Deno.env.get("SUPABASE_URL"),
    SUPABASE_SERVICE_ROLE_KEY: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
    SUPABASE_SECRET_KEYS: Deno.env.get("SUPABASE_SECRET_KEYS"),
    OPENAI_API_KEY: Deno.env.get("OPENAI_API_KEY"),
    OPENAI_MODEL: Deno.env.get("OPENAI_MODEL"),
    MARKET_DATA_URL: Deno.env.get("MARKET_DATA_URL"),
    HISTORY_BASE_URL: Deno.env.get("HISTORY_BASE_URL")
  };
}

function validServiceKey(request) {
  const supplied = request.headers.get("apikey") || "";
  if (!supplied) return false;
  const env = runtimeEnv();
  const accepted = [env.SUPABASE_SERVICE_ROLE_KEY];
  try {
    const keys = JSON.parse(env.SUPABASE_SECRET_KEYS || "{}");
    accepted.push(...Object.values(keys));
  } catch {
    // Ignore malformed optional key metadata; legacy service role key remains supported.
  }
  return accepted.some(key => typeof key === "string" && key.length > 0 && key === supplied);
}

Deno.serve(async request => {
  const incoming = new URL(request.url);
  const route = incoming.pathname.startsWith(FUNCTION_PREFIX)
    ? incoming.pathname.slice(FUNCTION_PREFIX.length) || "/"
    : incoming.pathname;

  const env = runtimeEnv();

  if (route === "/refresh") {
    if (request.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }
    if (!validServiceKey(request)) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
      const market = await refreshBackground(env);
      const forecast = await runForecastCycle(env, market);
      return Response.json({
        ok: true,
        service: "dollar-market-intelligence",
        refreshed_at: new Date().toISOString(),
        quote_assets: Array.isArray(market?.data) ? market.data.length : 0,
        forecast
      });
    } catch (error) {
      console.error("Scheduled market refresh failed:", error?.message || error);
      return Response.json({
        ok: false,
        error: "Scheduled market refresh failed",
        detail: String(error?.message || error).slice(0, 240)
      }, { status: 502 });
    }
  }

  const rewritten = new URL(request.url);
  rewritten.pathname = route;
  return worker.fetch(new Request(rewritten.toString(), request), env);
});
