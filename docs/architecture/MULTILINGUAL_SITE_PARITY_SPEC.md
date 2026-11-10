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

### Phase 3 — knowledge map and catalog
- Consolidate map rendering around one data source and shared behavior.
- Verify equal lesson IDs/statuses and correct localized links.
- Retain map/list/detail interactions and accessible fallback.

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
