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
- After at least 24 reviewed examples across at least three classes, a small 8-12-4 MLP is trained and cached in Cloudflare KV.
- The MLP is not trained on its own predictions. Without sufficient human labels, the system uses BGE-M3 plus transparent fallback scoring and reports that the feedback-trained classifier is not ready.
- Use the authenticated `POST /news/triage/review` endpoint with an item ID, decision, and optional note to add a human label. It requires the existing worker cron secret.
- Model training accuracy is a development diagnostic, not a real-world accuracy claim. Keep a separate held-out reviewed set before trusting the classifier.

## Supabase retention

- Pending or quarantined articles are not deleted automatically.
- Discard decisions wait seven days, then only a compact audit record is written to `market_news_triage_archive` before the full news row is deleted.
- Kept/summarized records retain their summary and metadata. After 30 days, full original/translated article text is removed and the compact summary is preserved in the archive table.
- Every cycle is recorded in `market_news_triage_cycles`.
- No pre-existing news rows were deleted when the schema was added. They remain pending until the Cloudflare Worker processes them in bounded batches.

## Operational requirements

- Cloudflare Worker must have its Workers AI binding `AI`, Supabase service-role secret, and `MARKET_CACHE` KV binding.
- The Supabase migration is `20261115221117_market_news_triage_learning`.
- Run tests with:
  `node --experimental-default-type=module --test worker/news-triage-engine.test.mjs`.
