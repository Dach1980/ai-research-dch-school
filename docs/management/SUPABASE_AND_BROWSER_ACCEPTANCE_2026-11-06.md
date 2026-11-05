# Supabase and browser acceptance — 2026-11-06

## Repository checks

- The public browser client is configured with the Supabase project URL and a publishable key. No service-role secret is stored in the repository.
- Public registration remains deliberately disabled in `scripts/supabase-config.js`; the existing code comment requires approved Terms/Privacy pages and live SMTP before enabling it.
- Migrations 001–006 and PostgreSQL 16 CI assertions existed before this change. Migration 007 adds public A.6 catalogue metadata.
- The GitHub Actions workflow applies migrations to an isolated PostgreSQL 16 service with an Auth schema bootstrap. This proves SQL compatibility and structural assertions only; it does not apply migrations to the live Supabase project.
- The latest completed Pages workflow before this update was run 42044567413 (2026-11-05), conclusion success.

## Live Supabase: not yet accepted

No Supabase management/database connector is available in this execution context. Outbound DNS/network access to the project endpoint is also unavailable. This run therefore could not inspect live migration history, apply migrations, inspect Auth settings, send a confirmation email, or verify deployed Edge Functions and secrets. The public client configuration is not proof that the live project is correctly configured.

Required live acceptance by an authorized project operator:

1. Apply migrations 001–007 in order, or verify remote migration history with Supabase CLI before applying pending migrations.
2. Confirm RLS and policy boundaries on every exposed table.
3. Confirm Auth Site URL and redirect allow-list include the production Pages origin and callback route.
4. Keep sign-up disabled until Terms/Privacy and SMTP are approved and tested; then deliberately enable sign-up and email confirmation.
5. Test registration with a dedicated account, confirmation link, callback, sign-in, sign-out and role boundaries.
6. Deploy and test the trusted admin Edge Function and server-side secrets without exposing service-role credentials to the browser or chat.
7. Bootstrap the first owner through the documented trusted procedure; verify owner/editor separation and audit logging.

## Browser acceptance: not completed

The Pages host could not be resolved from this execution environment, and the browser inspection service returned an access error. No desktop/mobile rendering, responsive layout, language-switcher interaction or live auth flow is claimed as visually accepted. After deployment, check RU/EN/ZH A.1–A.6, catalogue, knowledge map, account flow and admin/Roadmap on desktop and mobile.

## Decision

Keep live Supabase integration and browser acceptance in progress until the live checks are observed. CI success must not be treated as production acceptance.
