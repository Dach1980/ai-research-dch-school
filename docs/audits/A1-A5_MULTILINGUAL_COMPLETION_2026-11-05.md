# A.1–A.5 — multilingual content and visual acceptance

**Date:** 2026-11-05  
**Branch:** `main`  
**Scope:** Track A lessons A.1–A.5 in RU / EN / 中文, lesson catalog, knowledge map, language navigation and automated checks.

## 1. Content coverage

The EN and ZH pages were not removed or replaced with short placeholders. They have been expanded to provide full learning coverage for the core concepts, examples, practice tasks, self-checks and terminology. The English versions were extended to cover the same learning outcomes and technical concepts as the Russian originals. The Chinese versions were expanded with corresponding explanations, examples and exercises.

Approximate visible-text measurements after the changes:

| Lesson | RU words | EN words | EN/RU | ZH CJK characters |
|---|---:|---:|---:|---:|
| A.1 | 3,413 | 2,511 | 73.6% | 4,256 |
| A.2 | 2,134 | 1,876 | 87.9% | 3,147 |
| A.3 | 2,831 | 2,344 | 82.8% | 3,774 |
| A.4 | 2,377 | 2,038 | 85.7% | 3,340 |
| A.5 | 1,514 | 1,665 | 110.0% | 1,933 |

The Chinese metric counts CJK characters rather than whitespace-delimited words. These figures are volume checks, not a substitute for expert proofreading.

### A.1
Expanded EN and ZH coverage includes the engineering definition and system boundary of AI, rule-based and expert systems, search and planning, ML/DL, task types, applications, narrow AI versus AGI, the distinction between AI and human thought, an engineering case study, XAI relevance, a three-approach mini-experiment and self-check questions.

### A.2
Expanded EN and ZH coverage explains the nested AI → ML → DL relationship, why not every AI system uses ML and why not every ML system uses DL, supervised/unsupervised/self-supervised/reinforcement learning, feature engineering versus representation learning, generative AI, system selection and a building-engineering case study.

### A.3
Expanded EN and ZH coverage explains dataset rows, features and targets, algorithms/models/parameters/loss, gradient descent, learning settings, generalization, underfitting/overfitting, data splitting and leakage, a building-energy example, practical Python work and experiment-record requirements.

### A.4
Expanded EN and ZH coverage explains the difference between data, learning algorithm and model; architecture, parameters and hyperparameters; linear models, decision trees and neural networks; training versus inference; reproducible model artifacts; the complete AI pipeline; model comparison and deployment acceptance questions.

### A.5
The earlier content expansion remains in all three versions: ROC-AUC, Precision–Recall / Average Precision, class imbalance, K-fold and stratified/group/time-aware validation, and a scikit-learn classification practice comparing a baseline with logistic regression. It includes confusion matrix, precision, recall, F1, ROC-AUC and AP.

## 2. Shared diagrams

The three language versions now use the same diagram structure and geometry for each lesson. Text labels, captions and accessibility descriptions are localized; the diagram composition is not independently redesigned per language.

| Lesson | Diagrams in each language |
|---|---:|
| A.1 | 2 |
| A.2 | 3 |
| A.3 | 4 |
| A.4 | 6 |
| A.5 | 6 |

The automated parity check removes localized text, title, description and accessibility attributes, then compares the remaining SVG structure and geometry. The check also rejects Russian text left inside EN/ZH diagram labels and generic placeholder captions.

Responsive sizing and a common caption style were applied to the diagrams.

## 3. Catalog, map and language navigation

- `data/catalog/lessons.json` contains RU / EN / ZH titles and URLs for A.1–A.5.
- `data/catalog/planets.json` contains five planet records linked to A.1–A.5.
- The knowledge-map page and its catalog-driven script remain the navigation source for the planet view.
- `scripts/validate-catalog.py` now checks that each localized URL exists and that the language list is exactly RU / EN / ZH.
- `scripts/validate-multilingual-lessons.py` checks HTML language attributes, local links, language-switcher destinations, diagram counts and geometry, localized diagram labels, and minimum text coverage.
- A broken static navigation path in the Russian A.5 page (`index-.html`) was found by the new link check and corrected.

## 4. CI and deployment gate

The GitHub Pages workflow now runs before deployment:
1. Catalog unit tests.
2. Catalog schema, relationships and localized URL validation.
3. Multilingual lesson, link, switcher and diagram-parity validation.
4. A separate PostgreSQL 16 migration smoke test for the Supabase schema.

Deployment is blocked unless the validation jobs succeed.

## 5. Remaining acceptance limits

- Automated source validation is not a substitute for a native-speaker editorial proofread of every paragraph.
- The live site could not be independently inspected in a browser from this execution environment. A successful GitHub Pages deployment confirms the deployment workflow, not pixel-level browser acceptance on desktop and mobile.
- Catalog and map integrity are source-tested; a final visual interaction pass on the live map is still recommended.

**Status:** content expansion, catalog-source checks, multilingual/diagram parity validation and GitHub Pages deployment passed in Actions run `42044025429` (commit `db8746e8c9deb9a780aff311f7390badbd2647e5`). Browser-level visual acceptance on desktop/mobile and native-speaker editorial proofreading remain separate final checks.
