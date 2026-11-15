# Dollar reasoning evaluation protocol

This benchmark measures the news reasoner against **human-reviewed gold labels**. It does not train the model and does not convert heuristic confidence into a calibrated probability.

## Required case format

Each case belongs in a private/reviewed dataset first; publish only material that may legally be redistributed.

```json
{
  "case_id": "unique-id",
  "source": {
    "url": "https://publisher.example/article",
    "publisher": "Publisher",
    "published_at": "2026-11-01T10:00:00Z",
    "text_sha256": "sha256-of-exact-captured-source-text",
    "language": "en",
    "text": "Exact source text or a legally stored excerpt"
  },
  "asset": "USD/IRR",
  "horizon": "1d",
  "review": {
    "annotator_count": 2,
    "adjudication": "How disagreements were resolved",
    "reviewed_at": "2026-11-02T12:00:00Z"
  },
  "gold": {
    "expected_abstain": false,
    "expected_correct": true,
    "expected_market_direction": "unclear",
    "facts": ["reviewed fact labels"],
    "claims": ["reviewed attributed claims"],
    "causal_links": ["reviewed causal links and caveats"],
    "disconfirming_signals": ["signals that would falsify the interpretation"]
  }
}
```

## Metrics

- **Abstention accuracy:** does the engine abstain when evidence is insufficient, and speak only when the case supports it?
- **Evidence quote precision:** exact source quotations that pass quote and numeric-fidelity checks.
- **Market direction accuracy:** scored only when two reviewers agree on a direction for the stated asset and horizon. Mixed/unclear cases are excluded from this denominator.
- **Causal structure rate:** causal hypotheses with mechanism, time order, confounders and a falsification test.
- **Confidence Brier score:** diagnostic comparison between reported confidence and a reviewed correct/incorrect label. Lower is better; do not call this calibrated until a large, time-separated dataset validates it.

## Anti-leakage and evaluation rules

1. Use chronological splits: older cases for development, later unseen cases for final evaluation.
2. Keep the same event and syndicated copies in one split only.
3. Freeze the source text, capture timestamp, model version, prompt version and History snapshot for every run.
4. Two independent reviewers label each case; disagreements require adjudication.
5. Score each asset/horizon separately. Do not mix USD/IRR, gold and global FX into one accuracy number.
6. Report sample sizes and denominators beside every metric. Missing labels are not zero and must not be silently counted.
7. A synthetic fixture validates the scoring code only. It is never included in reported real-news performance.
8. Do not feed final test labels back into prompts, History or training.

## Current status

The scoring functions and unit tests are infrastructure only. No real-news performance score is published until a reviewed gold dataset exists. The engine's current confidence ceiling is heuristic, not a calibrated probability.
