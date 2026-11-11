# Live Supabase inspection and consumer migration gate

**Date:** 8 November 2026  
**Status:** trusted resolver implemented in repository; live project not inspected from this environment; admin alias diagnostics are read-only; lesson reader remains on its existing static-content/local-progress contract.

## Trusted alias resolver

A new Edge Function, `resolve-lesson-alias`, calls the SQL function `public.resolve_lesson_uid_aliases` with the service-role client. It:
- requires a valid JWT and a verified email;
- requires an active `owner` or `editor` row in `school_admins`;
- validates source-system, alias-kind, locale and input length against allowlists;
- exposes only UID, display code, mapping state and publication flag;
- returns `access_behavior: resolve_only`; it never grants, copies or checks entitlements;
- does not return lesson payloads or learner data;
- maps a missing/unavailable registry to a generic 503 response.

The service-role secret is read only from Edge Function environment variables. It is not added to browser configuration. JWT verification is enabled in `supabase/config.toml`.

## Admin panel

The existing admin catalogue/editor still reads and writes the original `lesson_catalog` and `lesson_content` slugs. A new read-only alias diagnostic was added to the content tab. It can resolve:
- v2 legacy IDs and v2 IDs;
- static localized page paths;
- Supabase `lesson_id` slugs.

This is deliberately a diagnostic/shadow step, not a UID-based editor cutover. Existing edit, publish, payload and entitlement operations are unchanged. This avoids writing v3 UIDs into legacy primary/foreign keys or silently broadening access for split lessons.

## Lesson reader: why it is not switched yet

The current `scripts/lesson-reader.js` is not a Supabase content reader. It renders `window.DCH_DEMO_LESSON` embedded in lesson pages and stores page completion, scroll positions and quiz answers in browser `localStorage`, keyed by the legacy lesson ID. The checked-in schema has no server-side progress, bookmark or quiz-attempt tables.

A direct switch to a v3 UID would orphan existing local browser state. A legacy lesson can map to multiple v3 UIDs, so there is no safe one-to-one replacement key. The reader therefore remains unchanged until the live data inventory and explicit historical-progress policy are approved. Its next safe migration needs:
1. an explicit legacy lesson identity on every page;
2. a versioned local-state migration that retains the original key and copies state only under an approved one-to-one rule;
3. a many-to-many policy for split lessons (no automatic completion of every child);
4. separate content delivery and entitlement checks before any protected payload is fetched.

## Live project verification is still a hard gate

The repository contains a Supabase project reference and public publishable key, but no live database credential or connected Supabase administration tool was available in this run. Therefore migration 008 has **not** been applied, the Edge Function has **not** been deployed, and the live schema/data cannot honestly be reported as verified.

Run the read-only script `supabase/ops/inspect_live_catalog_v3.sql` in the Supabase SQL Editor for the configured project. It reports migration versions, table presence/counts, candidate learner-state table/column names, RLS/policies and resolver grants. It deliberately returns no learner-level rows or personal data.

## Deployment order after live inspection

1. Confirm the live migration history and schema match migrations 001–007.
2. Review the read-only inspection output, especially learner-state stores and any tables outside this repository.
3. Apply migration 008 only after confirming the target project and backup/rollback plan.
4. Deploy `resolve-lesson-alias` and configure the same server-side secrets used by the existing admin Edge Function.
5. Test anonymous, unverified, ordinary-user, editor and owner calls; confirm anon/authenticated cannot execute the SQL resolver directly.
6. Validate the alias diagnostic on real A.3/A.4/A.5 slugs and localized URLs.
7. Only then design a separately tested UID-aware admin editor and reader/content migration. Keep the legacy routes and entitlements intact throughout.
