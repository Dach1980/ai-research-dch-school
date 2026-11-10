# A.1.1 localized lesson parity — 2026-11-10

## Scope

Aligned the lesson page layout for Russian, English and Chinese:
- `lessons/a-1-what-is-artificial-intelligence.html`
- `lessons/a-1-what-is-artificial-intelligence-en.html`
- `lessons/a-1-what-is-artificial-intelligence-zh.html`

## Changes

- Added the same localized hero structure to EN and 中文 as RU: back link, eyebrow, title, lead, metadata and planet banner.
- Added the planet illustration with lesson code `1.1.1` to EN and 中文.
- Added localized links from each planet banner to the matching knowledge map.
- Moved the planet banner component styles into the shared `styles/lesson-design-system.css` stylesheet so all three pages use the same component rules.
- Wrapped EN and 中文 lesson content in the same `article-body` content container used by RU.
- Preserved the existing text-only self-check inside the lesson material.
- Preserved the final interactive self-check: three questions, eight checkbox options, localized check buttons and feedback.
- Added regression coverage requiring the shared hero/planet, one H1, text-only in-content check, final interactive check and assessment script on all three localized pages.

## Browser acceptance

Public browser run: https://agent.tinyfish.ai/runs/a47cccbc-69f8-4ae9-905c-d0376758c6ad

Confirmed:
- Planet illustration `1.1.1` is visible on all three localized pages.
- Hero structure and content width are consistent.
- Text-only self-check remains without checkbox inputs.
- Final self-check has three interactive questions and checkbox controls in all locales.
- Localized knowledge-map links are present.
- No visible JavaScript errors.

The browser report also identified repeated topic headings/sections in the English and Chinese lesson body (for example, Narrow AI/general intelligence and the energy-assistant case). This is a separate content-deduplication issue and was not removed as part of the layout fix, to avoid deleting lesson material without a deliberate content review.

## CI

Regression tests were added to `tests/test_locale_grid_theme_parity.py`. A successful automated test-suite run is not yet confirmed. The latest commit reports a Vercel build-rate-limit failure, not a confirmed test failure.

## Safety boundaries

No Supabase schema, Auth, RLS, secrets, provider settings, or lesson publication status were changed.
