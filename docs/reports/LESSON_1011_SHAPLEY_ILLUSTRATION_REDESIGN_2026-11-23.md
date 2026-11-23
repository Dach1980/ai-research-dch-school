# Lesson 10.1.1 — illustration redesign

**Date:** 2026-11-23  
**Status:** review — not accepted or published  
**Scope:** Track A, lesson UID `les-a-0182`, RU / EN / 中文.

## Changes
- Replaced the generic comparison-table/experiment-flow/causal-flow layouts for all five active lesson figures with five purpose-built Shapley layouts.
- Coalition figure now lists all eight coalitions in one-to-one rows with their value-function outputs.
- Marginal-contribution figure now shows before/after coalition, both values, and the computed difference.
- Permutation figure now contains six separate joining orders and explicit A/B/C contributions plus row total.
- Weight figure groups coalitions by size and exposes count, per-coalition weight, and subtotal.
- Axiom figure uses four independent cards with condition, mathematical consequence, and interpretation.
- Localized the five figures independently in Russian, English, and Chinese; removed the accidental Russian copy in EN/ZH diagram metadata.
- Updated the practice run command to work from the repository root.
- Added regression assertions for figure row/card counts and supported specialized layouts.

## Numerical checks
- Coalition values: 10, 14, 13, 11, 18, 16, 15, 20.
- Permutation contribution rows: (4,4,2), (4,4,2), (5,3,2), (5,3,2), (5,4,1), (5,4,1).
- Mean allocations: A=14/3, B=11/3, C=5/3; total gain = 10.
- Weight groups: 1/3, 2×1/6, 1/3; total weight = 1.

## Acceptance gates still required
- Run the full GitHub Actions validation suite.
- Inspect the deployed RU / EN / ZH pages visually at 375, 768, and 1440 px in light and dark themes.
- Confirm no SVG text clipping, contrast regression, or horizontal page overflow.
- Keep catalogue status `review` until explicit user acceptance.
