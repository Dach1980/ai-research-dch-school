# Authentication and learning access control

**Project:** AI Research DCH School  
**Status:** Architecture proposal — provider project and protected-content backend are not configured yet.  
**Current hosting:** GitHub Pages (static).  
**Recommended identity provider:** Supabase Auth (email + password with mandatory email confirmation).

## 1. Product decision

The first two published learning chapters remain openly accessible without an account:

1. Module 00 — Introduction (`lessons/reader.html`)
2. XAI Foundation — What is XAI and why it matters (`lessons/xai/01-what-and-why.html`)

After the second open chapter, show a clear registration invitation. Registration is required to continue to the remaining free chapters. Paid chapters are visible in the catalogue but require both an authenticated, email-confirmed account and an active purchase/subscription entitlement.

Do not force a visitor into a registration screen immediately after finishing the second chapter. Let them read the whole chapter, show a registration CTA at its end, and require registration only when they choose another account-only lesson. This preserves the learning experience and makes the access boundary understandable.

## 2. Access policy

| Visitor/account state | Open chapters 00 and XAI 01 | Other free chapters | Paid chapters |
|---|---:|---:|---:|
| Anonymous visitor | Allow | Registration required | Purchase + account required |
| Registered, email not confirmed | Allow | Block; show confirmation notice | Block |
| Registered, email confirmed | Allow | Allow | Only with active entitlement |
| Email-confirmed account without purchase | Allow | Allow | Show purchase/access page |
| Account with active paid entitlement | Allow | Allow | Allow only for entitled products |

The access decision must be enforced by a trusted backend or storage policy, not by hiding links or checking browser storage.

## 3. Registration and email confirmation

### Registration form

Required fields:
- Email address
- Password
- Password confirmation
- Acceptance of Terms and Privacy Policy (links to published documents)

Optional:
- Display name

After successful registration:
1. Create the account with email confirmation required.
2. Send a confirmation email with a single-use, time-limited verification link.
3. Redirect to a confirmation-pending page.
4. Show a clear message in the selected interface language.
5. Do not grant account-only lesson access until the provider reports the email as verified.

Suggested English microcopy retained from the reference interface:
- Pending notice: **Your email isn't confirmed yet — we won't be able to reach you about access or new modules.**
- Link-sent status: **Link sent — check your inbox.**

Localized Russian:
- Pending notice: **Ваш email ещё не подтверждён — мы не сможем сообщать вам об открытии доступа и новых учебных модулей.**
- Link-sent status: **Ссылка отправлена — проверьте почту.**

Localized Chinese (Simplified):
- Pending notice: **您的邮箱尚未验证——我们将无法向您发送访问权限和新课程模块的通知。**
- Link-sent status: **验证链接已发送，请检查您的收件箱。**

### Confirmation flow

- The email link returns to a dedicated callback route on the school domain.
- The callback validates the one-time token with the identity provider.
- On success, show a localized success state and a button to continue to the learning library.
- On expired/invalid link, show a safe error and a resend-confirmation action.
- Resend must be rate-limited and must not reveal whether an arbitrary email address has an account.
- Never place passwords, service-role keys, or private tokens in the public repository.

### Sign-in

- Email + password.
- Email verification is mandatory before account-only content is available.
- If credentials are valid but email is not confirmed, show the pending notice and a resend-link action.
- Include password reset by email, sign-out, and session refresh.
- Keep the interface localized in RU (default), EN, and Simplified Chinese.

## 4. Screens and states

1. Registration
2. Sign in
3. Email confirmation pending
4. Confirmation callback: success / expired / invalid
5. Forgot password / reset password
6. Account profile and sign out
7. Access required (free account)
8. Purchase required (paid module)
9. Session expired / service unavailable

All screens use the existing DCH School visual system, logo, typography, responsive layouts, and light/dark theme. Preserve the language and theme selection across navigation and the authentication callback.

## 5. Backend and data model

Recommended initial managed backend: Supabase.

Use Supabase Auth for identity and email verification. Use a database with Row Level Security (RLS) for:
- profiles (user id, display name, preferred locale, created timestamp)
- lessons (stable lesson id, title, visibility: public/free/paid, publication status)
- products or access plans
- entitlements (user id, product/lesson scope, status, granted_at, expires_at)
- purchases (provider reference, status, amount/currency, timestamps) when payment integration is added

The public client may use only the Supabase project URL and anon/publishable key. A service-role key must exist only in a trusted server environment.

RLS policies must:
- allow anonymous reads only for the two explicitly public chapters and public catalogue metadata;
- allow verified users to read free account-only lesson content;
- allow paid lesson content only when a matching active entitlement exists;
- prevent users from reading or changing another user's profile, purchases, or entitlements;
- prevent clients from granting themselves entitlements.

## 6. Protected lesson delivery — mandatory architectural change

GitHub Pages serves static files publicly. If private lesson text, images, JSON, JavaScript bundles, or downloadable assets are committed to a public repository, a frontend login screen cannot protect them.

Before enabling real account/paid gating:
1. Keep only the two public lessons and public catalogue metadata in the public GitHub Pages repository.
2. Move account-only and paid lesson payloads to protected storage or a backend API.
3. Deliver lesson content only after server-side authentication and RLS/entitlement checks.
4. Keep private media in protected storage and issue short-lived signed URLs where appropriate.
5. Verify that direct unauthenticated requests to protected content return an authorization error.

The existing static reader may remain the presentation layer, but it must load protected lesson payloads from the authorized endpoint rather than from public JavaScript files.

## 7. Email delivery and domain configuration

- Configure a verified sender domain and SMTP provider in the authentication service before production.
- Configure allowed redirect URLs for local development, GitHub Pages preview if used, and the production school domain.
- Customize confirmation, password-reset, and security emails in RU / EN / ZH where supported; otherwise send a neutral language-aware template from a trusted mail service.
- Configure SPF, DKIM, and DMARC for the sender domain.
- Test delivery, spam placement, link expiry, resend throttling, and single-use behavior.
- Never promise delivery until SMTP and DNS are configured and verified.

## 8. Privacy, security, and operational requirements

- Publish Terms, Privacy Policy, and contact details before collecting accounts.
- Collect only necessary account information.
- Use HTTPS, secure provider-managed sessions, and short-lived access tokens.
- Apply rate limits to sign-in, registration, password reset, and resend confirmation.
- Use generic responses to avoid account enumeration.
- Add basic abuse protection (provider CAPTCHA / bot protection where available).
- Provide account deletion and data export procedures.
- Do not log passwords, confirmation tokens, access tokens, or full email links.
- Add audit events for entitlement changes and administrative access grants.
- Payment integration is a separate milestone; never infer paid access from a client-side flag.

## 9. Implementation phases

### Phase A — product and UI
- Add the registration invitation after the second public chapter.
- Add localized registration, sign-in, pending-confirmation, callback, and password-reset screens.
- Add access-state components to the lesson catalogue and reader.
- Preserve RU/EN/ZH, theme, reading progress, and return-to-lesson destination.

### Phase B — identity provider
- Create/configure Supabase project.
- Enable email confirmation and password recovery.
- Configure SMTP, sender domain, redirect URLs, and localized email templates.
- Add client configuration using public environment/build settings only.
- Test registration, verification, sign-in, sign-out, refresh, and reset flows.

### Phase C — protected content
- Move restricted lesson payloads out of the public repository.
- Implement protected content delivery and RLS policies.
- Add free-user and paid-entitlement authorization checks.
- Test direct URL/API/storage access while anonymous, unverified, verified-free, and paid.

### Phase D — payments and administration
- Select payment provider and supported geographies/currencies.
- Verify payment events server-side before granting entitlements.
- Add an admin workflow for manual grants, revocations, refunds, and audit history.

## 10. Acceptance criteria

- Anonymous users can read both public chapters without registration.
- At the end of XAI 01, a localized registration CTA explains that an account opens the remaining free modules.
- Clicking a restricted free chapter opens registration and preserves the intended destination.
- Paid modules clearly indicate that purchase is required.
- New accounts cannot access account-only material before email confirmation.
- The confirmation email contains a valid single-use link; the callback handles success, expiry, and invalid tokens.
- The pending page displays the localized equivalent of the specified English notice and link-sent status.
- Verified users can access free account-only lessons.
- Paid content is inaccessible without a valid entitlement, including by direct URL/API/storage request.
- RU is the default locale; EN and Simplified Chinese are supported on every auth/access screen and email.
- Theme, locale, reading progress, and return destination survive the auth journey.
- No secrets or protected lesson payloads are present in the public repository.
- Tests cover anonymous, unverified, verified-free, paid, expired-session, and revoked-entitlement cases.

## 11. Current limitations and decision required

The current website is GitHub Pages only. It cannot itself send verification emails, validate identity securely, keep secrets, or protect static files. This document describes the required target architecture; no production authentication is active yet.

**Recommended next implementation decision:** approve Supabase as the identity and database provider, then configure the project and sender domain. The provider project URL, public key, SMTP sender configuration, production domain, and payment provider are not present in this repository and must not be fabricated.
