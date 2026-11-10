# Multilingual Site Parity — Technical Specification

Date: 2026-11-10
Target locales: Russian (ru), English (en), Simplified Chinese (zh)
Scope: public school website, shared navigation, homepage, tracks, lesson catalog, knowledge map, authentication entry points, themes, responsive behavior and regression coverage.

## Goals
1. RU, EN and ZH are equivalent product experiences, not merely translated fragments.
2. Shared components have one implementation and one responsive layout.
3. A localized route must stay in its locale when navigating between equivalent pages.
4. All locales expose the same theme preference (system/light/dark), account entry point and navigation capabilities.
5. Published learning content must be equivalent in availability and status; unpublished/planned material must never be presented as published.
6. Content must remain accurate. Do not fabricate translations, lessons, publication status, or curriculum claims to make pages look symmetrical.

## Required parity contract
- Header: brand, menu toggle, navigation destinations, language switcher, account state and theme control.
- Homepage: hero, three learning tracks, knowledge universe preview, learning principles, latest publications, school introduction and footer.
- Track pages A/B/C: same section order and information architecture (overview, outcomes, curriculum/themes, publication status, prerequisites where applicable, related lessons).
- Lesson catalog: same published lesson IDs, status, and locale-specific URL mapping.
- Knowledge map: same published lesson set, detail information, list/map modes and navigation semantics in all locales.
- Authentication: same sign-in/account actions and equivalent localized UI text; do not change Supabase configuration, auth flows, RLS, or access policy in this work.
- Themes: system/light/dark, persisted preference, contrast-safe cards, diagrams, navigation and controls.
- Responsive: desktop, tablet and mobile; no horizontal page overflow; keyboard-accessible navigation and visible focus.
- Localization: correct lang attributes, translated interface labels, readable CJK fallback and no accidental mixed-language placeholders except established technical terms.

## Implementation sequence
### Phase 1 — shared shell and homepage parity (this PR)
- Align homepage section structure and navigation in all three locales.
- Use shared CSS for home knowledge cards and latest-publication grid; remove per-locale layout overrides.
- Expose theme and account controls in all three homepage locales.
- Localize account entry labels.
- Fix homepage locale-switcher URL resolution for both GitHub Pages project paths and root-hosted Preview/custom domains.
- Add static regression tests for homepage structural and shared-shell parity.

### Phase 2 — track pages (implemented in this PR)
- Bring Track A/B/C pages to a common information architecture across RU / EN / ZH.
- Preserve curriculum facts, module identifiers and published/unpublished status.
- Translate the approved curriculum structure and outcomes without creating lessons or inventing publication status.
- Load the same account, language and theme controls on every track page.
- Add regression tests for section parity, curriculum counts and shared controls.

### Phase 3 — knowledge map and catalog (implemented in this PR)
- Replaced the EN/ZH simplified card grids with the full RU map experience: orbital map, selectable planets, detail panel, list mode, map/list switching and lesson/track navigation.
- Localized the shared map controller for RU / EN / ZH, including lesson titles, descriptions, learning outcomes, metadata, prerequisites and action labels.
- Extracted the map layout into one shared `styles/knowledge-map.css`; all three pages also load the shared theme stylesheet.
- Kept the legacy-preserving catalog projection as the only map data source. Planet entries are filtered by the existing published state; no planned lessons are exposed.
- Added mobile position clamping so planet names remain inside the map viewport.
- Added regression tests for identical interactive controls, shared assets, localized pages/routes, and exact equality between Track A published lesson IDs and planet IDs.
- Updated the existing catalog UI test to expect the unified map rather than the former EN/ZH card-grid renderer.

### Phase 4 — auth and account localization
- Localize auth/account screens and labels.
- Verify Supabase session behavior in each locale without changing security policy.

### Phase 5 — acceptance
- CI and unit/static regression tests.
- Browser checks for all locales, light/dark/system themes, desktop/tablet/mobile.
- Check links, images, console/network errors, keyboard navigation, focus and contrast.
- Attach screenshots/evidence to the PR before marking ready.

## Constraints
- Work only in a dedicated feature branch and Draft PR.
- Do not merge, publish, promote, or modify main.
- Do not change Supabase schema, auth configuration, RLS, secrets, or registration policy.
- Do not create new lessons or mark planned content as published.
- Keep existing catalog IDs, URLs and compatibility contracts.
- Any visual acceptance claim requires real browser evidence; source inspection alone is not browser acceptance.

## Phase 1 acceptance criteria
- Three homepage pages contain the same ordered primary sections and IDs.
- All three load shared main CSS, menu JS, locale switcher, account UI and theme system.
- Exactly one language switcher is created by the shared script.
- Exactly one theme control is present after theme initialization.
- The homepage language switcher resolves correctly on /, /index.html and a GitHub Pages project subpath.
- EN and ZH have localized versions of the home sections; RU remains content-preserving.
- Static regression tests pass.

## Phase 3 acceptance criteria
- RU / EN / ZH map pages use the same interactive HTML contract and shared CSS/controller.
- All locales provide map mode, list mode, planet selection, details, lesson links and Track A navigation.
- The planet ID set exactly equals the set of published Track A lesson IDs in the v2 compatibility catalog.
- Every published Track A lesson has a non-empty localized title and a real RU / EN / ZH route.
- Map UI labels and learning outcomes are localized; EN/ZH pages contain no accidental Russian placeholders.
- Responsive styles and mobile planet positioning are covered by static regression assertions.
- Existing v1/v2/v3 catalog compatibility tests continue to pass.
