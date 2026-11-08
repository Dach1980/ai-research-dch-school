# Editorial reconciliation: A.4 and A.5 → Track A v3

**Date:** 8 November 2026
**Status:** editorial mapping approved for staging; no page URL or publication state changed.

## 1. Evidence and publication-state correction

The repository contains expanded editorial drafts and six published localized A.4/A.5 page files (RU, EN, 中文). The draft headers still say “не опубликован”, which is stale metadata: the live HTML files exist and Supabase migration 006 marks A.4/A.5 public and published. This document records the discrepancy; it does not alter the published pages or Supabase rows.

The Russian A.4 page contains additional Python practice and five quiz items beyond the draft outline. A.5 has a published 16-section Russian page; its EN and ZH pages also exist. The A.4 EN/ZH pages exist and contain the same broad lesson structure. Existing URLs are preserved.

## 2. A.4 — What is a machine-learning model?

The draft explains model vs. training algorithm vs. data; model function and parameters; architecture families; hyperparameters; training vs. inference; the model boundary in a larger AI system; comparison of linear/tree/neural models; a tree-depth experiment; limitations and vocabulary.

| Source content | v3 target | Decision |
|---|---|---|
| Model definition; data/model/training-algorithm distinction; parameters | 1.4.1 | Primary destination |
| Training process, inference, saved model, preprocessing/postprocessing | 1.4.2 | Primary destination; connect to loss/training content |
| Hyperparameters and tuning examples | 1.4.5 | Primary destination |
| Linear, tree and neural model family overview; compare three models | 3.1.6 | Introductory overview; do not replace dedicated model lessons |
| Neural-network layers/weights primer | 3.1.6 as context | Detailed neuron/perceptron/NN content remains in Theme 3 Module 2 |

A.4 is not a single replacement lesson. Its content is distributed across model definition, training, tuning and model-family comparison. The Python experiment and five quiz items remain reusable lesson resources and should be split/retagged when new lesson pages are authored.

## 3. A.5 — Evaluating a model

The draft and published page cover train/validation/test separation, baseline, regression metrics, classification confusion matrix and metrics, class imbalance, decision threshold, over/underfitting, leakage, split strategies, ROC-AUC/PR-AUC, cross-validation, experiment and evaluation limitations.

| Source content | v3 target | Decision |
|---|---|---|
| Train/validation/test roles and independence | 1.2.4 | Move the basic dataset-role concept earlier, before model evaluation |
| Baseline and evaluation protocol | 1.5.1 | Primary destination |
| MAE, MSE, RMSE, R² | 1.5.7 | New explicit curriculum lesson; required because the initial module outline did not name regression metrics |
| Confusion matrix, TP/TN/FP/FN | 1.5.2 | Primary destination |
| Accuracy, precision, recall, F1, decision threshold and error cost | 1.5.3 | Primary destination |
| ROC-AUC and Precision–Recall AUC | 1.5.4 | Primary destination |
| Class imbalance and misleading accuracy | 1.5.5 | Primary destination |
| Underfitting/overfitting reminder | 1.4.3 | Introductory cross-reference; A.6 remains detailed source |
| Data leakage examples | 1.2.6 | Primary destination; avoid duplicating full leakage lesson |
| Random/time/group split and cross-validation | 1.5.6 | Primary destination for evaluation protocol and stability |

The new 1.5.7 is an additive refinement of the approved curriculum, not a new module. Track A remains five themes and 27 modules.

## 4. Editorial quality controls

- Keep regression metrics distinct from classification metrics; R² is not percent correct and may be negative.
- Explain test data as a final independent evaluation; repeated tuning against test scores contaminates the estimate.
- Distinguish data split strategy (random/time/group) from cross-validation.
- Do not claim a train/validation gap alone proves overfitting.
- Explain that the preferred precision/recall trade-off depends on false-positive and false-negative costs.
- Fit preprocessing only on training data; apply fitted transforms to validation/test.
- A.4 linear weights are not causal effects.
- A.4's three-family comparison is orientation, not a substitute for detailed Theme 3 content.

## 5. Supabase and legacy alias boundary

The legacy Supabase IDs are slugs (a-1-... through a-6-..., plus xai-01-what-and-why), separate from v2 display IDs and static page URLs. They are included as explicit aliases in the v3 manifest. Each alias resolves to one or more target lesson UIDs, but is resolve-only.

No lesson_entitlements.lesson_id is rewritten. A legacy entitlement continues to authorize the legacy lesson row under the existing RLS policy; it does not automatically grant access to every child lesson after a split. New entitlement grants must target a concrete lesson UID/registry entry through a future reviewed policy. This avoids accidental entitlement expansion.

module-00-introduction is deliberately not mapped to a Track A lesson; it remains a separate legacy course entry pending its own editorial destination.

## 6. Acceptance

- A.4/A.5 no longer appear in the unresolved editorial mapping list.
- Their fragment mappings target existing v3 UIDs and have editorial-approved confidence.
- 1.5.7 exists as an outline-only lesson UID and is included in the curriculum.
- Legacy RU/EN/ZH URLs and Supabase slugs are represented as aliases.
- All alias rows use resolve_only; no entitlement inheritance is encoded.
- Existing public pages, IDs, content and entitlements remain unchanged.