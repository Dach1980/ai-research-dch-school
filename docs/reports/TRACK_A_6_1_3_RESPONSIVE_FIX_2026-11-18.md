# Technical report — responsive fix for Track A lesson 6.1.3

Date: 2026-11-18  
Scope: published lesson 6.1.3, RU / EN / 中文  
Lesson UID: `les-a-0016`  
Lesson publication state: `published` (unchanged)

## Findings

The three lesson pages contained a wide six-column comparison table (`lesson-comparison-table`) directly inside the article flow. The existing shared CSS applied horizontal overflow to table elements themselves, but there was no dedicated wrapper that reliably contained horizontal scrolling at narrow viewport widths.

The glossary responsive grid had already been corrected in shared CSS by commit `bac09b4d124f36d46d1d05a2a002b3949a9e777d`; this task preserves that fix and addresses the separate comparison-table layout.

## Changes committed

- `lessons/a-6-1-3.html` — table wrapped in a focusable `.lesson-table-wrap` region.
- `lessons/a-6-1-3-en.html` — same structural fix, English accessible label.
- `lessons/a-6-1-3-zh.html` — same structural fix, Chinese accessible label.
- `styles/lesson-design-system.css` — dedicated wrapper rules: `width/max-width: 100%`, `min-width: 0`, local horizontal scrolling, touch scrolling, contained overscroll; table uses `width: max-content`, `min-width: 100%` and preserves readable column widths.

Commits:
- RU: `22a9d51b2f4acb17822857863ce6321f1848dceb`
- EN: `419bfe179c8e7584cef17b778794278063a0b2d3`
- 中文: `9048540a82221440436bb37094035f1e81e9774c`
- shared CSS: `b5ee3e880267cd19a39c96d7a37e8502fa103cc0`
- curriculum / roadmap: `c65e7a465d53de56bab728162fc5618ad09ea44c`

## Validation status

Static repository inspection confirms:
- all three localized pages contain the new wrapper;
- each wrapper encloses the existing comparison table without changing its content;
- the shared stylesheet defines a constrained scrolling region and table sizing;
- lesson UID, catalog entry, publication state, and canonical URLs were not changed.

**Not yet verified:** live browser regression. A real browser session was not available in this run, so no viewport measurements or visual PASS claim is made.

## Remaining acceptance checks

Run browser regression on all three published pages at viewport widths 1440, 1024, 768, 650, 390 and 320 px:
1. Check `document.documentElement.scrollWidth <= window.innerWidth` (no page-level horizontal overflow).
2. Confirm the table scrolls horizontally inside `.lesson-table-wrap`, not across the page.
3. Confirm keyboard focus can reach the region and its scroll behaviour is usable.
4. Inspect glossary layout and surrounding article for clipping, overlap, or regressions.
5. Record screenshots/results for RU, EN and 中文; close this item only after PASS.

## Decision

The responsive code fix is implemented and committed. Lesson 6.1.3 remains counted as published. Browser regression remains an explicit open acceptance task and does not block beginning the next planned lesson, 7.1.2.
