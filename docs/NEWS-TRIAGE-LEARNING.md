# Dollar news triage: supervised neural learning

## What learns

The triage classifier is a compact feed-forward neural network (8 input features, 12 hidden units, 4 output classes). Its inputs combine BGE-M3 semantic relevance with explicit signals for market-topic coverage, article-text quality, recency, source context, numeric anchors, attribution and duplication.

The classifier learns only the editorial triage decision: `keep`, `summarize`, `quarantine`, or `discard`. It does **not** fine-tune the Llama news reasoner or the BGE-M3 encoder, and it does not learn market direction or investment advice.

## Supervision and safeguards

- Training examples come from the human feedback table. Automatically assigned triage labels are not fed back as ground truth.
- At least 24 reviewed examples are required, at least three classes must be represented, and each represented class must have at least three examples.
- Each class gets a deterministic stratified holdout; training and validation counts are recorded separately.
- Class weighting reduces majority-class dominance.
- Training uses validation-loss early stopping.
- Metrics include training accuracy, held-out accuracy, held-out macro-F1, held-out loss, a confusion matrix, and class counts.
- A candidate is not promoted unless it has at least three held-out cases, held-out macro-F1 of at least 0.30, and does not regress more than 0.03 against the previous model's held-out macro-F1.
- If a candidate fails the gate, the previously deployed model remains active.

## Runtime lifecycle

A human feedback submission triggers a retraining attempt. The latest reviewed examples are loaded, the candidate is trained, and a passing candidate is saved to Supabase and Cloudflare KV. News triage uses the learned decision only above its existing confidence threshold; otherwise it uses the transparent fallback rules. Duplicate and stale-content safety overrides still apply.

## What the metrics do and do not mean

The holdout is a useful guard against obvious overfitting, but it is not a substitute for a large chronological test set. The current feature vector is deliberately compact and can miss subtle context. The classifier does not become a general reasoning model through this training. No real-world accuracy claim should be made until enough diverse, independently reviewed examples have accumulated and a separate time-based evaluation has been completed.

## Current limitation

This network learns editorial triage decisions, not whether a news claim is true and not whether an asset price will rise or fall. The evidence-first reasoning engine remains separately evaluated against human-reviewed gold cases.
