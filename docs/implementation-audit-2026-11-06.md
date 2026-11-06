# Nabz Bazaar implementation audit — 2026-11-06

## Scope

This audit describes the repository code, not a live production verification. The Cloudflare Worker and Supabase configuration cannot be confirmed from source files alone. Secrets are intentionally not requested or stored in GitHub source.

## What already exists

- Static Persian-first website in GitHub Pages, with market cards, charts, converter tools and an analysis panel.
- Browser-side quote refresh from the public Iran Market Data JSON feed, approximately every five minutes while the page is open.
- Daily historical series for USD, EUR, 18K gold and Emami coin.
- Cloudflare Worker with a five-minute Cron declaration.
- Quote persistence code for `market_quotes`, conditional on Supabase credentials and the table existing.
- RSS headline collection via four broad Google News RSS searches (Persian and English), with a 72-hour filter and simple title deduplication.
- A statistical ensemble using drift, trend, momentum and mean reversion, with walk-forward validation and 1-, 3- and 7-day horizons.
- Forecast ledger, due-forecast evaluation and performance endpoints, conditional on Supabase configuration.
- Additive schema for a news-source registry and article-processing fields in migration `004_news_intelligence_pipeline.sql`.

## Important gaps and risks

1. **The site and Worker are not yet one unified data path.** The public page reads the quote JSON directly from the browser. The Worker separately fetches the same upstream feed. A later phase should make the Worker the site's stable data API, with clear source timestamps and stale-state reporting.
2. **The market quote feed is not multi-source.** The current implementation relies on one upstream market-data project. Independent quote sources, unit checks and disagreement handling are still needed.
3. **News collection is headline-only.** It uses broad aggregator searches, not a verified publisher-specific source registry. It does not currently provide reliable full-text extraction, language detection, Persian translation, article summarization, claim extraction or cross-source corroboration.
4. **Migration 004 is only committed to GitHub.** It is not proof that the SQL has been run in Supabase. The news-source registry and processing columns are unavailable until the migration succeeds.
5. **Forecast storage depends on database schema.** The repository contains both `002_market_forecast_runs.sql` and `202611060002_market_forecast_learning.sql`, which each declare `market_forecast_runs` with overlapping but non-identical definitions. Do not assume that running the later `CREATE TABLE IF NOT EXISTS` changes an already-created table. Reconcile the live schema with the Worker queries before applying more migrations.
6. **The legacy `/forecast` route uses a paid OpenAI API.** The current frontend prefers the free `/forecast/v2` adaptive statistical route when the Worker advertises it. The paid route is not required for the zero-budget path and should not be treated as active self-hosted AI.
7. **There is no self-hosted language model yet.** Translation and semantic news analysis must be implemented as a separate inference service; a Cloudflare Worker should orchestrate jobs rather than host a large model.
8. **Housing and vehicle schemas are only foundations.** No validated live data connectors or reliable ingestion jobs exist for those categories.
9. **The health endpoint previously treated the presence of credentials as proof that database tables existed.** It now probes the required Supabase tables and reports their availability separately. This source change still needs a successful deployment and live check.

## Work completed in this audit

- Updated `/health` to check whether `market_quotes`, `market_forecast_runs`, `market_news_items`, `market_news_sync_state` and `market_news_sources` are actually queryable with the Worker credentials.
- Added separate flags for forecast ledger, news storage, news pipeline schema, KV binding and background-refresh prerequisites.
- Added a smoke test for an unconfigured health endpoint. CI must pass before the change is considered verified.

## Delivery order

### Phase 1 — make the existing foundation observable and stable
- Confirm the deployed Worker version and all health flags.
- Reconcile Supabase migrations and confirm the actual columns/indexes in use.
- Configure the Cloudflare KV binding using a real namespace ID from the account.
- Route website quote/history requests through the Worker API and expose source timestamp, received timestamp and stale status.

### Phase 2 — complete market data
- Register each market source with its market type, unit, update cadence and provenance.
- Add at least one independent cross-check for each important quote series where a legitimate source is available.
- Store raw observations separately from normalized observations.
- Reject stale, implausible, mismatched-unit or conflicting data instead of silently selecting a value.

### Phase 3 — complete the news intelligence pipeline
- Verify publisher feeds and permitted access before enabling each source.
- Store publisher identity, original URL, publication time, retrieval time, language and source lineage.
- Deduplicate syndicated copies and distinguish independent corroboration from repeated wire stories.
- Extract only content permitted by the publisher's terms; keep links and metadata where full-text storage is not permitted.
- Add language detection, Persian translation, concise summaries, event/claim extraction and evidence links.
- Keep original text, translation and summary as separate fields. Do not let a headline alone determine a market impact.

### Phase 4 — forecasting and measured learning
- Keep the current statistical model as a baseline.
- Add feature sets only after the corresponding data is available and timestamped.
- Evaluate every horizon with rolling out-of-sample tests and compare against naive baselines.
- Track errors by asset, horizon, volatility regime and data quality.
- Change model weights only from outcomes already observed; preserve every issued forecast.

### Phase 5 — self-hosted language intelligence and product APIs
- Benchmark an open-weight multilingual model locally before selecting it.
- Run inference on a local machine for development; plan separate always-on compute only when needed.
- Expose product-specific APIs over the shared, permission-aware data core.
- Build additional websites only after the first product's collection, storage, monitoring and evaluation loops are reliable.

## Acceptance criteria

A feature is not considered complete merely because its schema or UI exists. It must have: a verified source, a working ingestion job, persisted records, timestamps and provenance, a health signal, tests, and a live end-to-end check. Forecast accuracy must be reported from actual held-out results, not from model confidence labels or synthetic data.
