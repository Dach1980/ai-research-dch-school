# Lesson 6.1.3 — draft production review

**Date:** 2026-11-18  
**Canonical target:** Track A → Theme 6 «Интерпретируемые модели» → Module 1 «Основы интерпретируемости моделей» → Lesson 6.1.3  
**Title:** «Линейные модели как объяснимые модели»  
**UID:** not assigned. The migration crosswalk identifies `les-a-0016` as an exact-title legacy candidate, but its reuse has not been approved. It remains associated with legacy Theme 4 / Module 4.1 pending explicit approval.

## Draft pages

- RU: `drafts/lessons/a-6-1-3-ru.html`
- EN: `drafts/lessons/a-6-1-3-en.html`
- 中文: `drafts/lessons/a-6-1-3-zh.html`

## Learning map

- 6.1.1 introduced model interpretability.
- 6.1.2 distinguished interpretability and explainability.
- 6.1.3 teaches the linear prediction formula, coefficient meaning, local contributions, units/scaling, and limits.
- 6.1.4 is reserved for interpreting decision trees.

The lesson deliberately focuses on the first item in the DCH breakdown. Detailed loss functions, Pearson/VIF/condition-number diagnostics, Ridge/Lasso, logistic regression, GLM/GAM, EBM, and rule-based models remain for later lessons.

## Teaching design

Nine sections, five learning outcomes, a centered rental-price example, five formula cards, one localized SVG, an executable Python 3.10+ standard-library experiment, eight glossary entries, five references, and seven single-answer self-check questions with feedback.

The illustrative model is:
`ŷ = 55 + 0.45 · (S − 50) − 1.2 · (D − 1.5)`
Output is in thousands of rubles; area is in square metres; distance is in kilometres. Coefficients are explicitly labelled as invented teaching values, not empirical estimates. The lesson distinguishes model coefficients from instance-level contributions and does not imply causality.

The lesson covers unit dependence, standardization, categorical encoding, multicollinearity, functional-form error, omitted/poorly measured features, extrapolation, and statistical significance. Regularization is mentioned only as a limitation; its detailed treatment remains for later units.

## Automated contract

`tests/test_lesson_613_draft_contract.py` checks locale structure, section/quiz/glossary/figure/formula/definition parity, switchers, previous-lesson links, absence of a link to unpublished 6.1.4, accessible SVG and formula markup, and the worked calculation/code consistency.

## Acceptance still required

- User approval to reuse UID `les-a-0016` or assignment of another approved UID.
- Subject review and requested edits.
- Promotion to canonical routes `lessons/a-6-1-3.html`, `lessons/a-6-1-3-en.html`, and `lessons/a-6-1-3-zh.html`.
- Catalog, canonical curriculum, crosswalk, and navigation migration after UID approval.
- User approval of UID reuse and any final subject edits.
- Promotion to canonical production routes and catalog after UID approval.
- Manual visual review of the production pages by the user; automated responsive browser checks already pass.
