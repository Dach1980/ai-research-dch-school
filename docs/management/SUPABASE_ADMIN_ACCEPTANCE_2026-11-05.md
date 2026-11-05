# Supabase and administrator acceptance — 2026-11-05

## 1. Repository-level audit

The repository contains migrations 001–006:

- 001 — profiles, lesson catalogue/content/entitlements, basic access RLS and auth profile trigger.
- 002 — initial catalogue seed.
- 003 — reconciliation of public A.1–A.3 metadata.
- 004 — school administrator roles, helper functions and role-based RLS.
- 005 — catalogue alignment for public A.1–A.3.
- 006 — multilingual A.1–A.5 metadata, administrative audit table, RLS policies and audit triggers.

**Defect found and corrected:** migration 003 had a missing closing parenthesis in the A.2 VALUES tuple. The SQL now closes the A.2 tuple before the A.3 tuple. The new CI job applies all migrations in order to a clean PostgreSQL 16 database and asserts RLS, helper functions and A.1–A.5 metadata.

## 2. Administrator authentication and authorization

The existing administrator page remains the only admin entry point.

- `scripts/admin-auth.js` now validates the signed-in identity through `supabase.auth.getUser()` (server-validated user), rather than trusting only the locally stored session returned by `getSession()`.
- The user must have a confirmed email.
- The page checks for an active row in `public.school_admins`.
- The browser receives only the public Supabase URL and publishable/anon key.
- The service-role key is referenced only by the Edge Function through server environment secrets.
- `school-admin-management` validates the bearer token with Auth, requires a confirmed user and active owner role, and only then uses the service-role client for Auth administration.
- Direct database operations are constrained by PostgreSQL RLS. Editors and owners have different capabilities for role and entitlement management.
- The Roadmap tab reads version-controlled project history from `data/audit-roadmap.json`; the Supabase audit tab reads `school_admin_audit`.

## 3. Registration state

Public registration remains disabled in `scripts/supabase-config.js` (`registrationEnabled: false`). The client UI also blocks switching to registration while this flag is false.

This client flag is not a substitute for the Supabase Auth dashboard setting. Before opening registration, the project owner must also verify that the Auth provider's sign-up setting, SMTP delivery, redirect URLs, legal documents and email confirmation flow are configured and tested.

## 4. PostgreSQL 16 smoke test

Added test-only files:

- `supabase/tests/ci_bootstrap.sql` — creates minimal `auth.users`, `auth.uid()`, and Supabase roles in an isolated CI database.
- `supabase/tests/ci_assertions.sql` — verifies RLS on protected tables, administrator helper functions, absence of anonymous write policies, and five published public A.1–A.5 metadata records.

The GitHub Pages workflow includes a separate `validate-supabase-migrations` job. It applies migrations 001–006 to a clean PostgreSQL 16 service and runs the assertions. The test bootstrap is for CI only and must not be applied to the live Supabase project.\n\nThe complete CI workflow passed on 2026-11-05 in run `42044025429`: the catalog/multilingual validation job, the PostgreSQL 16 migration/RLS smoke-test job, and the GitHub Pages deployment job all completed successfully. This proves the repository migrations apply cleanly to the isolated test schema; it does not prove that the live Supabase project has those migrations applied.

## 5. Live Supabase tasks that remain blocked

No live Supabase project connection or dashboard credentials were available in this execution. Therefore the following operations have **not** been claimed as completed:

1. Confirm which migrations are already applied in the live project.
2. Apply only the missing migrations in the correct order.
3. Verify the deployed `school-admin-management` Edge Function and set its server secrets.
4. Confirm `ADMIN_ALLOWED_ORIGIN` matches the published site origin.
5. Create the first owner role for the verified owner account through the Supabase SQL Editor.
6. Test login, logout, token refresh, expired sessions and email confirmation.
7. Test anonymous, verified non-admin, editor and owner permission boundaries against the live database.
8. Confirm that role grants, user suspension and entitlement changes are recorded in `school_admin_audit`.
9. Confirm that public sign-up is disabled at the Auth provider level.

## 6. Safe live owner bootstrap

Only after the intended owner has created an account and confirmed the email, the project owner can run a controlled bootstrap in the Supabase SQL Editor. Replace the placeholder with the verified account email; do not commit the email or resulting UUID to this public repository.

```sql
insert into public.school_admins (user_id, role, is_active)
select id, 'owner', true
from auth.users
where lower(email) = lower('<VERIFIED_OWNER_EMAIL>')
  and email_confirmed_at is not null
on conflict (user_id) do update
set role = 'owner', is_active = true;
```

Verify that exactly one intended account was granted the owner role. Do not grant owner privileges to an unverified account. Keep the service-role key exclusively in Supabase Edge Function secrets.

**Status:** repository migrations and authorization code reviewed; migration 003 corrected; PostgreSQL 16 CI smoke test added. Live Supabase application, owner bootstrap and role integration tests remain pending project-owner access.
