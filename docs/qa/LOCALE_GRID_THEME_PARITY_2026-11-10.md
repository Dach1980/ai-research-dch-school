# Locale grid, theme and catalogue parity — 2026-11-10

## Scope and publication

Changes were committed directly to `main`, as explicitly requested. No new branch was created for this work. The public GitHub Pages site now serves the updated main-branch files.

## Implemented

- Unified the homepage Knowledge Universe grid across RU / EN / 中文 with one shared `.home-knowledge-grid` component and `.home-planet` card class.
- Moved grid layout rules into `styles/main.css`: 4 columns by default, 3 at <=900px, 2 at <=620px, and 1 at <=380px.
- Connected `theme-system.js` to the three homepages, all three lesson catalogues, localized Track A/B/C pages, learning-map pages, and the inspected account/news pages.
- The theme preference remains in localStorage under `dch-school-theme`; switching languages now loads the same preference.
- Removed duplicate language-switcher script includes from localized pages in scope.
- Added consistent `account.css` includes to localized page variants in scope.
- Removed unused `catalog-compat.js` includes from homepage, track, lesson-catalogue and learning-map surfaces. The migration adapter remains in the repository for migration tooling, but these UI surfaces no longer call its legacy projection.
- Changed homepage, lesson catalogue and knowledge map readers to load `catalog-v3.json` directly.
- All three surfaces filter strictly on `status=published` and `content_state=published`.
- Each visible lesson uses its single V3 code. Legacy crosswalk codes are not rendered.
- Added RU / EN / 中文 titles for the four currently published lessons and localized theme/module headings.
- Removed duration estimates from lesson cards, map details and `catalog-v2.json` (18 duration fields removed). No unverified minute values are shown.
- Updated V3 JSON Schema to allow localized theme, module and lesson titles.
- Added regression tests for locale grid parity, theme persistence wiring, duplicate language scripts, V3-only reads, publication filtering, single lesson codes, localized routes, and absence of unverified durations.

## Public browser acceptance

Read-only public-site browser run (theme was changed only in the isolated test browser profile):

- Run: https://agent.tinyfish.ai/runs/60c2e775-c6c9-4fc6-8ad0-e0691c543332
- RU / EN / 中文 homepages each displayed four lesson cards with codes 1.1.1–1.1.4.
- All cards used the same `home-planet` class.
- Titles were localized; no durations appeared.
- Light theme selected on RU remained light after switching to EN and 中文.
- All three lesson catalogues displayed four lessons with single codes and no durations.
- All three learning maps displayed the four V3 published lessons with single codes and no duration metadata.
- No visible runtime errors were reported.

Note: labels such as “Начальный уровень / Beginner / 初级” and “Открытый урок / Open lesson / 免费课程” are level/access metadata, not legacy identifiers. The Russian map heading “Track A · ТЕМА 1 · МОДУЛЬ 1” is hierarchy metadata, not a composite lesson code.

## Responsive verification limitation

The browser automation environment could not resize the viewport or emulate devices. Therefore 1440px / 768px / 390px visual checks remain unverified.

- Responsive run: https://agent.tinyfish.ai/runs/8a743246-68be-49b1-8030-7807ee8dc5d5
- CSS source was updated and inspected directly: 4 → 3 → 2 → 1 columns at the breakpoints listed above.
- The browser run found no overflow or overlap at its available desktop viewport, but this is not a substitute for tablet/mobile visual acceptance.

## CI / deployment status

- Main-branch commit at the time of this report: `928c625c5637af354272e5868073d30214b6884f`.
- The Vercel status check reports a build-rate-limit failure; it did not produce a new Preview deployment for this commit.
- GitHub Pages public site did update and was inspected successfully in the browser.
- Regression tests were added/updated, but a successful automated test-suite run has not yet been confirmed. Do not treat the suite as passed until a CI result is available.

## Explicitly not changed

- No Supabase schema, Auth, RLS, secrets, or provider settings.
- No lesson publication statuses were promoted.
- No lesson content was invented or newly published.
- No changes were made to PR #3 merge state.
