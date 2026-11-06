// Private scheduled refresh endpoint. Requires the exact service-role bearer token.
import { refreshBackground } from "../../../worker/index.js";
import { runForecastCycle } from "../../../worker/forecast-engine.js";

const env = {
  SUPABASE_URL: Deno.env.get("SUPABASE_URL") ?? "",
  SUPABASE_SERVICE_ROLE_KEY: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  MARKET_DATA_URL: Deno.env.get("MARKET_DATA_URL") ?? "",
  HISTORY_BASE_URL: Deno.env.get("HISTORY_BASE_URL") ?? "",
};

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const apiKey = request.headers.get("apikey") ?? "";
    const authorization = request.headers.get("authorization") ?? "";
    const suppliedKey = apiKey || authorization.replace(/^Bearer\\s+/i, "");
    if (!serviceRoleKey || suppliedKey !== serviceRoleKey) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      return Response.json({ error: "Database configuration is incomplete" }, { status: 503 });
    }

    try {
      const market = await refreshBackground(env);
      const forecasts = await runForecastCycle(env, market);
      return Response.json({
        ok: true,
        refreshed_at: new Date().toISOString(),
        quotes: Array.isArray(market?.data) ? market.data.length : 0,
        forecast_cycle: forecasts,
      });
    } catch (error) {
      console.error("Supabase scheduled market refresh failed:", error);
      return Response.json(
        { ok: false, error: "Market refresh failed", detail: String(error?.message ?? error).slice(0, 240) },
        { status: 502 },
      );
    }
  },
};
