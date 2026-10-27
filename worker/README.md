# Dollar Market Intelligence Worker

Backend for the Dollar GitHub Pages site. It combines a current quote and historical series from Iran Market Data/TGJU, the OpenAI Responses API with required live web search, a statistical trend baseline, an uncertainty range, news drivers, risks, and cited sources.

## Deploy

1. Create a Cloudflare Worker named dollar-market-intelligence.
2. Paste the contents of worker/index.js into its editor and deploy.
3. In Worker Settings → Variables and Secrets, add a Secret named OPENAI_API_KEY with your own API key.
4. Optionally add OPENAI_MODEL. The default is gpt-5.5; choose a model available to your API project that supports Responses web search.
5. Test https://YOUR-WORKER.workers.dev/health
6. Test https://YOUR-WORKER.workers.dev/forecast?asset=USD_IRR_FREE

The allowed browser origin is currently https://amir-studio.github.io. If the website moves to a custom domain, update ORIGIN in worker/index.js.

## Supported asset symbols

- USD_IRR_FREE — dollar
- EUR_IRR_FREE — euro
- GOLD_18K_IRR — 18k gold
- COIN_EMAMI_IRR — Emami coin

## Important

- The endpoint refuses to forecast if the source quote is stale or fewer than 12 valid historical points are available.
- Never put the API key in HTML, browser JavaScript, a public repository, or a chat message. Store it only as a Cloudflare Worker secret.
- Live search can cover many public sources, but cannot access literally every article, private database, or paywalled feed.
- The forecast is probabilistic, not guaranteed. Track out-of-sample forecast errors before claiming high accuracy.
- The frontend is intentionally not wired to an unverified endpoint. After deployment, the Worker URL can be connected to the chart and AI insight panel.
