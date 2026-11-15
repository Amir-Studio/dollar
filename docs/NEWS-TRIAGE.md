# Dollar multilingual news triage

## Pipeline

1. New RSS articles enter `market_news_items` with `triage_status=pending`.
2. Cloudflare Workers AI runs the multilingual BGE-M3 encoder (`@cf/baai/bge-m3`) against the reviewed English market ontology. This produces semantic relevance candidates across supported languages.
3. Existing market-language analysis extracts themes, numeric anchors and attribution cues.
4. The triage engine combines semantic relevance with recency, source context, text coverage, attribution and duplicate signals.
5. Decisions are `keep`, `summarize`, `quarantine`, or `discard`. Uncertain items are quarantined; low confidence is never treated as proof of falsehood.
6. Summaries are extractive: selected sentences are copied from the source text, not invented. Persian summaries are created only when a Persian translation already exists or the original article is Persian.
7. History reads only `keep` and `summarize` records from `/news/triage?limit=30`. History keeps them in its pending-review area; the AI score does not verify claims or publish them as facts.

## Learning from mistakes

- Human corrections are stored in `market_news_triage_feedback` with the feature vector and explicit decision.
- After at least 24 reviewed examples across at least three classes, a small 8-12-4 MLP is trained and persisted in the private Supabase table `market_news_triage_models`; Cloudflare KV is an optional cache.
- The MLP is not trained on its own predictions. Without sufficient human labels, the system uses BGE-M3 plus transparent fallback scoring and reports that the feedback-trained classifier is not ready.
- Use the authenticated `POST /news/triage/review` endpoint with an item ID, decision, and optional note to add a human label. It requires the existing worker cron secret.
- Model training accuracy is a development diagnostic, not a real-world accuracy claim. Keep a separate held-out reviewed set before trusting the classifier.

## Supabase retention

- Pending articles are processed in small batches. Low-confidence items enter quarantine rather than being deleted immediately; low-score quarantined items are reconsidered after 14 days.
- Discard decisions wait seven days, then only a compact audit record is written to `market_news_triage_archive` before the full news row is deleted.
- Kept/summarized records retain their summary and metadata. After 30 days, full original/translated article text is removed and the compact summary is preserved in the archive table.
- Every cycle is recorded in `market_news_triage_cycles`.
- No pre-existing news rows were deleted when the schema was added. They remain pending until the Cloudflare Worker processes them in bounded batches.

## Operational requirements

- Cloudflare Worker must have its Workers AI binding `AI`, Supabase service-role secret, and `MARKET_CACHE` KV binding.
- The Supabase migrations are `20261115221117_market_news_triage_learning` and `20261115221348_market_news_triage_model_store`.
- Run tests with:
  `node --experimental-default-type=module --test worker/news-triage-engine.test.mjs`.

## Evidence-first reasoning and active research

- `worker/news-reasoning-engine.js` adds a separate reasoning layer; it is not the triage MLP and does not change triage labels by itself.
- It uses Cloudflare Workers AI `@cf/meta/llama-3.3-70b-instruct-fp8-fast` for structured comprehension, causal hypotheses, alternative explanations, counter-evidence and abstention.
- It retrieves up to three relevant History dossiers from `data/index.json` and their JSON records. Draft/pending status and source limitations are preserved; History is context, never automatic proof.
- When the first pass identifies a material evidence gap, it issues at most three targeted Google News RSS searches and performs a second synthesis pass. Search results remain leads, not independent verification.
- The scheduled Worker stores the latest reasoning result in `MARKET_CACHE` under `news:reasoning:latest`; `/news` exposes the cached result and its freshness status.
- Missing AI binding, failed retrieval, malformed model output or weak evidence must produce an unavailable/abstaining result rather than fabricated certainty.
- The model is not continuously fine-tuned from its own answers. Persistent learning still requires reviewed corrections and a held-out evaluation set; self-confirmation is explicitly avoided.
- Regression tests: `node --experimental-default-type=module --test worker/news-triage-engine.test.mjs worker/news-reasoning-engine.test.mjs`.

- Authenticated `POST /news/reason/feedback` accepts a correction only with a valid evidence URL and an allowed error category. It stores up to 80 human-reviewed examples in `MARKET_CACHE`; the next reasoning cycle can retrieve the latest 15 as contextual lessons. This is retrieval-based memory, not fine-tuning. The route uses the existing Worker cron-secret verification.
