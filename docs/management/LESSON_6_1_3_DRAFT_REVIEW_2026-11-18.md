# Lesson 6.1.3 — production acceptance record

**Date:** 2026-11-18  
**Canonical target:** Track A → Theme 6 «Интерпретируемые модели» → Module 1 «Основы интерпретируемости моделей» → Lesson 6.1.3  
**Title:** «Линейные модели как объяснимые модели»  
**UID:** `les-a-0016` — explicitly approved by the user for reuse and migration from legacy 4.1.3 on 2026-11-18.

## Production pages

- RU: `lessons/a-6-1-3.html`
- EN: `lessons/a-6-1-3-en.html`
- 中文: `lessons/a-6-1-3-zh.html`

## Expanded teaching design

The original draft was expanded before publication to make the core ideas more intuitive and practical. Each locale now includes:
- nine main learning sections and six learning outcomes;
- a gradual explanation of linearity in parameters versus linearity in raw features, with a squared-feature example;
- a worked comparison of three apartments, separating the fixed coefficient from the instance-level contribution;
- a unit-conversion mini-experiment showing why coefficient magnitudes cannot be compared without checking scales;
- a concrete multicollinearity case (floor area and number of rooms) with a short diagnostic procedure;
- an additional guided practice task and a five-part template for writing careful coefficient explanations;
- seven formula cards, one localized accessible SVG, nine glossary entries, five references, and seven self-check questions with localized feedback;
- an executable Python 3.10+ standard-library experiment.

The central teaching model remains explicitly illustrative, not fitted to market data:
`ŷ = 55 + 0.45 · (S − 50) − 1.2 · (D − 1.5)`
The lesson distinguishes coefficient interpretation from local contribution, and association from causation.

## Migration and publication

The user approved reuse of `les-a-0016`. The catalog owner was moved from legacy Theme 4 / Module 4.1 / 4.1.3 to Track A / Theme 6 / Module 6.1 / 6.1.3. The canonical curriculum, catalog, and migration crosswalk now agree on the UID and new ownership. The lesson is a prerequisite successor to published lesson 6.1.2 (`les-a-0148`); 6.1.4 remains unpublished and is not linked as a live destination.

## Automated contract

`tests/test_lesson_613_production_contract.py` checks all three production pages, locale parity, formulas, glossary, SVG accessibility, canonical URLs, switchers, previous-lesson navigation, worked calculations, and absence of draft-only metadata. The responsive browser test now includes all three production pages.

## Manual acceptance

Automated CI and deployment results are recorded separately in Audit & Roadmap. Manual visual review of the published RU / EN / 中文 pages remains pending user confirmation.
