// Public, read-only market API. Privileged database credentials stay inside the Edge Function.
import marketWorker from "../../../worker/index.js";

const env = {
  SUPABASE_URL: Deno.env.get("SUPABASE_URL") ?? "",
  SUPABASE_SERVICE_ROLE_KEY: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  // Keep paid LLM access disabled on this public endpoint.
  MARKET_DATA_URL: Deno.env.get("MARKET_DATA_URL") ?? "",
  HISTORY_BASE_URL: Deno.env.get("HISTORY_BASE_URL") ?? "",
};

export default {
  fetch(request: Request): Promise<Response> {
    return marketWorker.fetch(request, env);
  },
};
