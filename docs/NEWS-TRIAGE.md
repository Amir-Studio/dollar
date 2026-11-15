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
  `node --experimental-default-type=module --test worker/news-triage-engine.test.mjs worker/news-reasoning-engine.test.mjs`.

## Evidence-first reasoning and active research

- `worker/news-reasoning-engine.js` adds a separate reasoning layer; it is not the triage MLP and does not change triage labels by itself.
- It uses the active Cloudflare Workers AI model `@cf/meta/llama-3.3-70b-instruct-fp8-fast` for structured comprehension, causal hypotheses, alternative explanations, counter-evidence and abstention. Its documented context window is 24,000 tokens; the application imposes a stricter 18,000-character JSON payload budget and rejects oversized payloads rather than cutting JSON mid-stream. <https://developers.cloudflare.com/workers-ai/models/llama-3.3-70b-instruct-fp8-fast/>
- It retrieves up to three relevant History research dossiers and up to four matching items from History's pending-review news archive. Draft/pending status and source limitations are preserved; History is context, never automatic proof.
- When the first pass identifies a material evidence gap, it issues at most three targeted Google News RSS searches, reads available snippets and up to four publisher-page excerpts, then performs a second synthesis pass. Search results remain leads, not independent verification. Similar headlines are clustered as possible syndication, and different domains are not automatically counted as independent evidence. Every fact/claim/hypothesis must include source IDs from the supplied evidence catalogue; unknown IDs are flagged, and unsupported assertions trigger abstention. A valid ID is only a reference check, not proof that the source text substantiates the claim.
- The scheduled Worker stores the latest reasoning result in `MARKET_CACHE` under `news:reasoning:latest`; `/news` exposes the cached result and its freshness status.
- Missing AI binding, malformed model output, failed second-pass verification or unreferenced assertions must produce an unavailable/abstaining result rather than fabricated certainty. Publisher-page redirects are followed only through bounded, revalidated public HTTP(S) destinations; private-network destinations are blocked. Scheduled inference has a 15-minute cooldown to avoid repeatedly spending model calls on unchanged news.
- The model is not continuously fine-tuned from its own answers. Persistent learning still requires reviewed corrections and a held-out evaluation set; self-confirmation is explicitly avoided.
- Regression tests: `node --experimental-default-type=module --test worker/news-triage-engine.test.mjs worker/news-reasoning-engine.test.mjs`.

- Authenticated `POST /news/reason/feedback` accepts a correction only with a valid evidence URL and an allowed error category. It stores up to 80 human-reviewed examples in `MARKET_CACHE`; the next reasoning cycle can retrieve the latest 15 as contextual lessons. This is retrieval-based memory, not fine-tuning. The route uses the existing Worker cron-secret verification.

- Reasoning hardening release `dollar-evidence-reasoner-1.1.0` adds strict structured-output validation, evidence-ID audits, probable-syndication detection, History archive retrieval tests, payload-budget tests, and redirect/SSRF regression tests. GitHub Actions runs these tests on relevant pushes; a passing run and a live Cloudflare deployment must still be checked separately.


### Evidence reasoning hardening 1.2.0

- A source ID alone is not accepted as evidence. Each factual statement, attributed claim, causal hypothesis and alternative must carry a source ID plus an exact quote copied from the supplied source excerpt.
- Quote matching is deterministic after Unicode normalization. It proves only that the quote occurs in the supplied excerpt; it does not prove that the quote entails the claim.
- A separate skeptical entailment pass classifies each claim/source pair as supports, contradicts, context-only or unclear. Missing or malformed verifier output fails closed.
- The evidence report distinguishes reference coverage, exact-quote coverage and semantic support coverage. A claim with a matching quote but no entailment support does not raise the evidence strength.
- The model's self-reported confidence is capped by a conservative evidence-strength heuristic. This is explicitly not a statistically calibrated probability.
- Draft and pending-review History material remains context-only unless actual source content is separately retrieved and quoted. Source metadata alone cannot substantiate a claim.
- Regression tests cover fabricated quotes, unknown source IDs, reference-only claims and directly contradictory quotations.

- Version `1.2.2` adds numeric-token fidelity checks between claims and exact cited quotations. A mismatch blocks evidence support even if the semantic verifier mistakenly labels the quote as supporting. Causal hypotheses now require an explicit mechanism, temporal order, confounders, and a falsification test.

- Version `1.3.0` adds structured market-transmission implications for tracked assets: impact direction, horizon, transmission channel, causal chain, preconditions and disconfirming signals. These are conditional explanations, not price targets or price forecasts. `/news` exposes the latest cached reasoning result; `/health` reports reasoning-engine diagnostics and its structural self-test.
