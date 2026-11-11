# A.6 — Generalization, underfitting and overfitting

**Date:** 2026-11-06  
**Track:** A — Understanding AI  
**Module:** 11  
**Status:** RU / EN / 中文 pages committed; CI acceptance pending.

## Scope

A.6 continues A.1–A.5 with generalization: why training performance does not guarantee performance on unseen data. It explains underfitting, useful fit, overfitting, the bias–variance trade-off, learning curves, regularization, early stopping, cross-validation, data leakage and task-appropriate splitting.

## Deliverables

- Three localized lesson pages: RU, EN and Chinese.
- Six inline SVG diagrams per page. Geometry and structure are shared; labels and accessibility text are localized.
- Learning outcomes, engineering example (building energy forecasting), diagnostic workflow, four self-check questions with answers and glossary.
- The lesson links back to A.5. It is designed as an open beginner lesson, 60–75 minutes.
- Supabase migration 007 publishes A.6 catalogue metadata only; the illustrated body remains on GitHub Pages.
- A dedicated validator checks locale, required vocabulary, six diagrams, SVG parity, content volume and local links.

## Pedagogical boundary

Bias–variance graphics are conceptual illustrations, not universal laws. A train/validation gap is not automatically overfitting; distribution shift, leakage, duplicates and label quality must also be checked. Split strategy must reflect the use case (grouped by building or ordered by time).

## Acceptance

GitHub Actions is expected to validate the new lesson after the catalog, migration and workflow integration are committed. Native-speaker editorial review and desktop/mobile browser acceptance are separate human acceptance steps.
