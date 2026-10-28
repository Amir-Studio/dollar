# Dollar Market Intelligence Worker

Backend for the Dollar GitHub Pages site. It combines fresh TGJU/Iran Market Data quotes, daily history, live web search for dated news, an AI assessment of relevant drivers, a capped statistical baseline, a blended 7-day scenario, uncertainty ranges, and source links.

## One-time deployment setup

1. In Cloudflare, create an API token with permission to edit Workers and obtain your Cloudflare Account ID.
2. In the GitHub repository, open **Settings → Secrets and variables → Actions** and add repository secrets named `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
3. Push a change under `worker/` or manually run **Actions → Deploy market intelligence Worker → Run workflow**. The workflow deploys `worker/index.js` using `worker/wrangler.toml`.
4. In Cloudflare Worker **Settings → Variables and Secrets**, add `OPENAI_API_KEY` as a **Secret**. Never store this key in GitHub source files or browser code. Optionally set `OPENAI_MODEL` to a model enabled for your API project that supports the Responses API and web search; the default is `gpt-5.5`.
5. Test `https://dollar-market-intelligence.<your-workers-subdomain>.workers.dev/health`, then test `/forecast?asset=USD_IRR_FREE`.
6. Open the website's **تحلیل هوشمند → تنظیم اتصال تحلیلگر**, enter the Worker URL, and save it. The same saved endpoint powers the news report and yellow chart forecast in that browser.

The allowed browser origin is currently `https://amir-studio.github.io`. If the website moves to a custom domain, update `ORIGIN` in `worker/index.js`.

## Supported assets

- `USD_IRR_FREE` — dollar
- `EUR_IRR_FREE` — euro
- `GOLD_18K_IRR` — 18-karat gold
- `COIN_EMAMI_IRR` — Emami coin

## Forecasting and limitations

- The endpoint refuses to generate a forecast if the source quote is stale or fewer than 12 valid historical points are available.
- The final percentage blends the model's news-informed estimate (65%) with a capped historical trend baseline (35%). This is a transparent heuristic, not a proven optimal weighting or a guarantee of accuracy.
- The chart interpolates the 7-day target and uncertainty range for visualization; intermediate points are not separate daily AI predictions.
- Web search can find public sources but cannot access every publication, private database, or paywalled article. Source links and publication dates should be reviewed.
- Backtest on held-out dates and compare against simple baselines before describing the model as accurate. Confidence is an analytical score, not a calibrated probability.
- The API key must remain a Cloudflare Worker Secret. Never paste it into GitHub source code or the website's endpoint field.
