# Phase 5 — Browser Acceptance Report

Date: 2026-11-10  
Repository: `Dach1980/ai-research-dch-school`  
Candidate branch: `feat/global-locale-parity-2026-11-10`  
Pull request: [#3](https://github.com/Dach1980/ai-research-dch-school/pull/3)  
Status: **PARTIAL — current candidate desktop checks pass; mobile/tablet and real Supabase email flows remain unverified**

## 1. Scope and safety boundaries

Phase 5 distinguishes the currently published GitHub Pages site from the unmerged PR #3 candidate.

- No changes were made to `main`.
- PR #3 remains Draft and unmerged.
- No Supabase migrations, tables, RLS policies, auth provider settings, secrets, or registration settings were changed.
- No user credentials or one-time email links were entered into the browser automation.
- No email was sent by the browser acceptance runs, no account data was changed, and no deployment was promoted.

## 2. Candidate deployment identity

Vercel deployment metadata was checked directly. The previously used preview URL `ai-research-dch-school-2izxkox9c-itprof80-6389.vercel.app` belongs to an older deployment of branch `fix/lesson-114-locale-layout-parity`, commit `c1c1c4d008ae3218fbb2477d07ad18b866c2e2fa`. Results from that URL must not be treated as acceptance evidence for PR #3.

The correct current candidate deployment is:

- URL: https://ai-research-dch-school-plibisw7j-itprof80-6389.vercel.app
- Deployment ID: `dpl_8PeVzGQo69JHhkX3VMzpPEJvL1oF`
- Branch: `feat/global-locale-parity-2026-11-10`
- Commit: `85c775c849ad359017bc6fbaa7f827695145a84f`
- Vercel state: `READY`
- Inspector: https://vercel.com/itprof80-6389/ai-research-dch-school/8PeVzGQo69JHhkX3VMzpPEJvL1oF

The latest browser runs below used this exact current candidate URL.

## 3. Automated checks

GitHub Actions run [#509](https://github.com/Dach1980/ai-research-dch-school/actions/runs/42733265877) completed successfully. It covered homepage, track, knowledge-map and auth/account locale parity, JavaScript syntax, catalog compatibility, lesson, diagram, quiz and design-system checks.

PR #3 remains open, Draft, and unmerged.

## 4. Current candidate — browser acceptance

### 4.1 Main pages, locales and tracks

Browser run: [TinyFish run 2ea350cf-f317-4f35-b3e0-3ba91dc55fb1](https://agent.tinyfish.ai/runs/2ea350cf-f317-4f35-b3e0-3ba91dc55fb1)

The current candidate homepage opened successfully. The browser observed the locale controls RU / EN / 中文 and the theme control. Track A, Track B, Track C and the knowledge map routes were reachable. The earlier extended run also inspected the three homepages, three localized knowledge-map pages, all three tracks in all three locales, sign-in, account and callback routes.

Browser run: [TinyFish run dc55b01c-eae1-4c05-aed5-15339d0339c6](https://agent.tinyfish.ai/runs/dc55b01c-eae1-4c05-aed5-15339d0339c6)

That extended run reported all three homepage locales, all three knowledge-map locales, Track A/B/C in RU / EN / 中文, auth, account and callback pages loaded without 404 errors. Theme switching and persistence were observed on the homepage. It reported no desktop horizontal overflow.

### 4.2 Callback, auth and account controls

Focused browser run: [TinyFish run 69f9ae09-3442-4ac7-9b97-2207f45435d7](https://agent.tinyfish.ai/runs/69f9ae09-3442-4ac7-9b97-2207f45435d7)

Observed on the current candidate:

- Callback page exposes RU / EN / 中文 language buttons and a theme control.
- Callback content is localized for `?lang=ru`, `?lang=en`, and `?lang=zh`.
- Clicking language controls updates localized callback content; the callback remains on its callback route.
- Callback theme control changes dark/light appearance; the selected dark theme persisted after reload.
- Auth page exposes language and theme controls, localized email/password labels, sign-in and password-reset entry points.
- Public registration remains unavailable, consistent with `registrationEnabled: false`.
- Account page exposes language and theme controls and shows the localized logged-out state in EN and ZH.
- No credentials were entered and no forms were submitted during this read-only check.

The no-token callback displays the expected invalid/expired-link message. This tests the error path only, not successful email confirmation.

Direct source inspection of `auth/callback.html`, `auth/index.html`, and `account/index.html` confirms the corresponding language and theme controls are present in the candidate HTML. The focused browser run confirms these controls are visible on the current candidate. Earlier observations claiming they were absent came from an older deployment/run and are superseded.

### 4.3 Desktop, mobile and tablet

Desktop browser observations (approximately 1280px or wider):

- No horizontal overflow was reported on the pages inspected.
- Navigation, locale controls, theme controls and page content were visible.
- Track cards/tags and content blocks appeared usable and legible.

Mobile (390px) and tablet (768px):

- **NOT VERIFIED in a real browser viewport.** The available browser automation did not expose viewport resizing or device emulation.
- Source CSS contains responsive breakpoints for auth/account and content components, but source inspection is not equivalent to visual mobile/tablet acceptance.
- No claim of mobile/tablet pass is made.

## 5. Supabase Auth — source review and live-test boundary

Source review confirms the candidate uses the configured Supabase project and the existing Supabase JS v2 client. The reviewed flows are:

- Password sign-in via `signInWithPassword`.
- Explicit rejection of an unconfirmed email session.
- Confirmation resend via `auth.resend({ type: "signup", ... })`.
- Password recovery email via `resetPasswordForEmail`.
- Callback verification via `verifyOtp` and `getSession`.
- Password update via `updateUser({ password })`, followed by sign-out.
- Session lookup and sign-out on the account page.

The public registration switch remains `registrationEnabled: false`; the registration path is intentionally closed. No test account was created.

**Live Supabase Auth tests are NOT VERIFIED:**

| Test | Status | Reason |
|---|---|---|
| Successful password sign-in | NOT TESTED | No test user's credentials were entered |
| Confirmed session visible on account page | NOT TESTED | No authenticated test session |
| Logout and session termination | NOT TESTED | No authenticated test session |
| Unconfirmed-email rejection / resend | NOT TESTED | No controlled unconfirmed test account or email link |
| Successful email confirmation callback | NOT TESTED | No valid one-time confirmation email link |
| Password recovery email delivery | NOT TESTED | No test mailbox interaction |
| Recovery callback and password update | NOT TESTED | No valid one-time recovery link and test password update |

A valid, user-controlled test account and access to its mailbox are required to complete these checks. Credentials and one-time links must be entered only by the user in the browser, never sent in chat or copied into this report.

## 6. Acceptance matrix

| Acceptance area | Status | Evidence / limitation |
|---|---|---|
| CI and static regression suite | PASS | GitHub Actions run #509 |
| Correct PR #3 deployment identified | PASS | Vercel metadata, commit `85c775c...` |
| Candidate desktop pages and routes | PASS (observed scope) | Browser runs above |
| Homepage / map / Track A-B-C locales | PASS (observed scope) | Browser runs above |
| Callback locale controls and translations | PASS | Focused browser run |
| Callback theme toggle and persistence | PASS | Focused browser run |
| Auth locale/theme controls | PASS | Focused browser run |
| Account locale/theme and logged-out state | PASS | Focused browser run |
| Public registration remains disabled | PASS | Browser and source review |
| Mobile 390px visual layout | NOT TESTED | Viewport emulation unavailable |
| Tablet 768px visual layout | NOT TESTED | Viewport emulation unavailable |
| Keyboard-only navigation / focus audit | NOT TESTED | No dedicated keyboard audit |
| Contrast audit with measured ratios | NOT TESTED | No contrast measurement |
| Console and network error audit | NOT TESTED | No reliable console/network capture |
| Successful Supabase sign-in/session/logout | NOT TESTED | Requires user-controlled test account |
| Valid email confirmation | NOT TESTED | Requires valid one-time email link |
| Password recovery and password update | NOT TESTED | Requires test mailbox and valid recovery link |
| Supabase schema, RLS and auth settings | UNCHANGED | No changes made |

## 7. Remaining actions before Phase 5 can pass

1. Run mobile and tablet visual checks at 390px and 768px using a browser with device emulation.
2. Perform keyboard/focus and measured contrast checks.
3. Inspect browser console and network errors on the current candidate.
4. Perform real Supabase sign-in, account session, and logout with a user-controlled test account.
5. Test confirmation/resend and password recovery using valid email links in a user-controlled mailbox.
6. Attach screenshots or other direct browser evidence for the remaining checks.

**Conclusion:** Candidate desktop localization, core page routing, callback localization, callback theme persistence, auth/account controls, and logged-out states have been browser-checked on the correct PR #3 deployment. Phase 5 remains **PARTIAL**, not passed, because mobile/tablet visual acceptance and live Supabase email/auth flows are still outstanding.


## 8. V3-only lesson catalogue correction — 2026-11-10

A user-reported defect showed composite legacy lesson identifiers and mixed lesson topics in the Track A catalogue. The catalogue UI has now been changed to read the V3 catalogue directly; it no longer calls the legacy projection for homepage cards, lesson cards, or the interactive knowledge map.

Implemented on the PR branch:
- V3 is the direct source for lesson, theme and module structure in the three catalogue surfaces.
- Each displayed lesson has one V3 code; legacy many-to-many mapping identifiers are not rendered.
- Only lessons with both `status=published` and `content_state=published` are shown as open lessons.
- The four currently published A.1 lessons have RU / EN / 中文 titles and localized routes.
- Duration metadata (40–50, 50–60, 60–75 minutes) was carried into V3 for these four lessons and added to the V3 schema.
- Theme and module titles support RU / EN / 中文.
- Planned lessons remain in the V3 data model but are not displayed as open lessons. No lesson status was promoted and no new lesson content was created.
- Regression coverage was added/updated for V3-only reads, one code per lesson, published filtering, localized titles/routes, and duration metadata.

### Browser evidence

Current Vercel Preview deployment:
- URL: https://ai-research-dch-school-3ix3eonkw-itprof80-6389.vercel.app
- Deployment ID: `dpl_6N2TsVT7MkZC48mfZJbNnBfmTHp1`
- Commit: `507b3d53e7fd2b09c1d31ec30da418d898f85eba`
- Vercel state: READY

Read-only browser runs:
- Track A catalogue: https://agent.tinyfish.ai/runs/50ae3069-0e6f-4900-ac14-4aa805623268
- RU / EN / 中文 lesson catalogue and knowledge maps: https://agent.tinyfish.ai/runs/017d89e3-f259-49f1-b094-0df06d7daf5e

Observed on the Preview:
- Four published A.1 lesson cards appear consistently in RU / EN / 中文, each with exactly one code: 1.1.1, 1.1.2, 1.1.3, 1.1.4.
- Titles, routes, durations and module/theme labels are localized.
- Four corresponding planets appear in each localized knowledge map.
- No planned lesson is displayed as published/open.
- No legacy or migration labels are visible in the catalogue.
- No visible broken links or runtime error messages were reported by the browser run.

The browser-tested deployment commit predates the final test-only and QA updates on this branch. The latest branch head still requires a fresh CI result and a fresh Preview build before this catalogue correction can be considered fully accepted.
