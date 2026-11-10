# Phase 5 — Browser Acceptance Report

Date: 2026-11-10  
Repository: `Dach1980/ai-research-dch-school`  
Candidate branch: `feat/global-locale-parity-2026-11-10`  
Pull request: [#3](https://github.com/Dach1980/ai-research-dch-school/pull/3)  
Status: **PARTIAL — public baseline checked; authenticated Preview and live Supabase flow pending**

## 1. Scope and test boundaries

Two different targets must not be conflated:

1. **Published GitHub Pages production baseline** — browser-tested at `https://dach1980.github.io/ai-research-dch-school/` (the browser resolved the root route to `https://dch.ai/`). This is the currently published site, not the unmerged PR branch.
2. **PR #3 candidate** — source-inspected on `feat/global-locale-parity-2026-11-10`; its Vercel deployment is protected by Vercel Authentication and the available browser profile has no recorded Vercel sign-in. No application UI from the PR preview could therefore be browser-tested.

No sign-in form was submitted, no credentials were handled, no Supabase data or settings were changed, and no deployment was promoted.

## 2. Automated checks

GitHub Actions run [#509](https://github.com/Dach1980/ai-research-dch-school/actions/runs/42733265877) completed successfully. Its validation job and all listed steps completed with `success`, including:

- homepage locale parity;
- track locale parity;
- knowledge-map locale and published-catalog equality;
- auth/account locale parity;
- JavaScript syntax checks;
- production and staging catalog compatibility checks;
- lesson, diagram, quiz and design-system checks.

PR #3 remains open and in Draft state. No changes were made to `main`.

## 3. Public production baseline — browser observations

Browser run: [TinyFish run 03c6d14a-6882-4f99-827c-6b3aa40d4946](https://agent.tinyfish.ai/runs/03c6d14a-6882-4f99-827c-6b3aa40d4946)

| Area | Observation |
|---|---|
| RU homepage | Loaded; header, locale switcher and theme control visible; major sections and images rendered; no desktop horizontal overflow observed. |
| EN homepage | Loaded; header and locale switcher visible; no theme control observed on the published baseline; no desktop horizontal overflow observed. |
| ZH homepage | Loaded; header and locale switcher visible; no theme control observed on the published baseline; no desktop horizontal overflow observed. |
| Locale switching | RU ↔ EN ↔ 中文 destinations exercised; observed destinations were correct. |
| Theme | RU homepage changed from system/light to dark; visual change and persistence after reload observed. |
| Track A | `/tracks/understanding-ai.html` loaded. |
| Track B | `/tracks/inside-ai.html` loaded. |
| Track C | The test initially probed the wrong route `/tracks/llm-engineering.html` (404). This is **not evidence of a missing Track C page**: repository source identifies Track C as Building with AI at `/tracks/building-with-ai.html`. |
| Knowledge maps | RU, EN and ZH routes loaded; the published EN/ZH baseline did not expose a theme control during the run. |
| Sign-in / account | Auth and account routes loaded. Account showed the logged-out state. |
| Email callback | Callback route loaded and showed an invalid/expired-link message. This is expected without a valid Supabase email link; it does not verify successful confirmation or recovery. |

### Corrections to unreliable browser-agent observations

The browser agent reported that all pages lacked an HTML `lang` attribute. This was contradicted by direct inspection of the corresponding `main` HTML source: tested homepages and sub-pages declare locale values such as `ru`, `en` and `zh-CN`. Therefore, **missing HTML lang is not recorded as a confirmed defect**.

The reported Track C 404 was caused by probing `llm-engineering.html`, not the repository's actual Track C route, `building-with-ai.html`. It is not recorded as a confirmed defect.

## 4. Candidate branch — source inspection

The candidate branch was inspected directly through GitHub source:

- Homepage files declare `lang="ru"`, `lang="en"` and `lang="zh-CN"`.
- All three homepage files load the shared `scripts/theme-system.js`.
- All three localized knowledge-map pages load the shared theme stylesheet and theme-system script.
- Auth, account and callback pages expose RU / EN / 中文 controls and theme controls in their HTML.
- Track C localized pages exist as `tracks/building-with-ai.html`, `tracks/building-with-ai-en.html` and `tracks/building-with-ai-zh.html`.

This source inspection is not a substitute for browser testing the candidate branch.

## 5. Vercel Preview access check

Browser run: [TinyFish run 97f5cef8-7937-4223-8850-cd7bd724ee9b](https://agent.tinyfish.ai/runs/97f5cef8-7937-4223-8850-cd7bd724ee9b)

The PR candidate deployment at `https://ai-research-dch-school-2izxkox9c-itprof80-6389.vercel.app` redirects to Vercel Authentication/SSO. The available TinyFish profile has no recorded sign-in for this deployment. The application itself was not visible, so no candidate-branch visual or interaction result is claimed.

## 6. Acceptance matrix

| Acceptance area | Status | Evidence / limitation |
|---|---|---|
| CI and static regression suite | PASS | GitHub Actions run #509 |
| Public production desktop smoke test | PARTIAL PASS | RU/EN/ZH homepages and selected routes loaded |
| Public locale navigation | PASS (observed paths) | Browser run above |
| Public theme behavior | PARTIAL | RU theme toggled and persisted; EN/ZH controls absent on currently published baseline |
| Candidate branch HTML locale metadata | PASS (source) | Direct source inspection |
| Candidate branch shared theme wiring | PASS (source) | Direct source inspection |
| Candidate branch browser rendering | BLOCKED | Vercel Authentication/SSO |
| Mobile / tablet layout | NOT TESTED | Requires candidate preview browser access and viewport checks |
| Keyboard navigation / focus | NOT TESTED | Requires browser acceptance |
| Contrast and image rendering on candidate | NOT TESTED | Requires browser acceptance |
| Console and network error audit on candidate | NOT TESTED | Requires browser acceptance |
| Supabase sign-in / session / logout | NOT TESTED | No authenticated test account/session used |
| Real email confirmation / password recovery | NOT TESTED | No valid one-time email link used |
| Supabase schema, RLS, policies and provider settings | UNCHANGED | No changes made |

## 7. Remaining actions before Phase 5 can pass

1. Authorize a browser-profile sign-in to the protected Vercel deployment, then repeat the checks against the actual PR #3 preview.
2. Check desktop, tablet and mobile layouts in all three locales, including theme switching and persistence.
3. Inspect console/network failures, links, images, keyboard navigation, focus visibility and contrast.
4. Perform a real Supabase sign-in/session/logout test and a valid email confirmation or recovery test using the user's own browser session. Do not expose credentials or one-time links in this report.
5. Attach candidate-branch screenshots/evidence and update this report before marking Phase 5 complete.

**Conclusion:** Phase 5 is not complete. CI and a limited production baseline smoke test pass, but the PR candidate is still behind an authentication wall and the critical responsive, accessibility and real-auth acceptance checks remain outstanding.
