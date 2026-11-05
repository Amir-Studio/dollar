# Dollar Market Intelligence Worker

Backend for the Dollar GitHub Pages site. It combines fresh TGJU/Iran Market Data quotes, daily history, live web search for dated news, an AI assessment of relevant drivers, a capped statistical baseline, a blended 7-day scenario, uncertainty ranges, and source links.

## One-time deployment setup

1. In Cloudflare, create an API token with permission to edit Workers and obtain your Cloudflare Account ID.
2. In Cloudflare, open **Workers & Pages → KV** and create a namespace named `DOLLAR_MARKET_CACHE`. Copy its namespace ID.
3. Add this binding to `worker/wrangler.toml` (replace the placeholder with the real ID; never invent one):
   ```toml
   [[kv_namespaces]]
   binding = "MARKET_CACHE"
   id = "YOUR_REAL_NAMESPACE_ID"
   ```
4. Create a Cloudflare API token with permission to deploy Workers and write to Workers KV. In the GitHub repository, open **Settings → Secrets and variables → Actions** and add repository secrets named `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
5. Push a change under `worker/` or manually run **Actions → Deploy market intelligence Worker → Run workflow**. The workflow deploys `worker/index.js` using `worker/wrangler.toml`.
6. The free scheduled mode needs no OpenAI key. The Cron Trigger runs every 5 minutes, stores the latest market feed in KV, and refreshes the news feed when its cache is older than 15 minutes. Health must report `background_refresh_enabled: true`. If the KV binding is absent, the on-demand `/analysis` route still works but background refresh is skipped.
7. Optional: in Cloudflare Worker **Settings → Variables and Secrets**, add `OPENAI_API_KEY` as a **Secret** only if you intentionally want the paid model-based `/forecast` route. Never store this key in GitHub source files or browser code. Optionally set `OPENAI_MODEL` to a model enabled for your API project that supports the Responses API and web search.
8. Test `https://dollar-market-intelligence.<your-workers-subdomain>.workers.dev/health`, then `/analysis?asset=USD_IRR_FREE`. If the optional AI secret is configured, also test `/forecast?asset=USD_IRR_FREE`.
9. Open the website's **تحلیل داده‌محور بازار → تنظیم اتصال تحلیلگر**, enter the Worker URL, and save it. The same saved endpoint powers the free report and chart scenario in that browser.

The allowed browser origin is currently `https://amir-studio.github.io`. If the website moves to a custom domain, update `ORIGIN` in `worker/index.js`.

## Supported assets

- `USD_IRR_FREE` — dollar
- `EUR_IRR_FREE` — euro
- `GOLD_18K_IRR` — 18-karat gold
- `COIN_EMAMI_IRR` — Emami coin

## Forecasting and limitations

- The free endpoint refuses to generate a report if the source quote is stale or fewer than 12 valid historical points are available. RSS items are filtered to a 72-hour window and retain their publisher links and publication timestamps. The free mode classifies headline topics only; it does not claim to understand the full article or infer a causal price impact.
- The final percentage blends the model's news-informed estimate (65%) with a capped historical trend baseline (35%). Recent 7/14/30-day momentum, daily volatility and drawdown are additional diagnostics. This is a transparent heuristic, not a proven optimal weighting or a guarantee of accuracy.
- The chart interpolates the 7-day target and uncertainty range for visualization; intermediate points are not separate daily AI predictions.
- Web search can find public sources but cannot access every publication, private database, or paywalled article. The report displays actual source links and publication dates only when the search provider supplies them; it never invents missing dates. Fewer than four extracted sources lowers the displayed confidence score. This is a guardrail, not statistical calibration.
- Backtest on held-out dates and compare against simple baselines before describing the model as accurate. Confidence is an analytical score, not a calibrated probability.
- The API key must remain a Cloudflare Worker Secret. Never paste it into GitHub source code or the website's endpoint field.
