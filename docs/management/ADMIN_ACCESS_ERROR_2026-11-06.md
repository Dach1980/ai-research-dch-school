# Administrator access error — 2026-11-06

## Observed error

The published admin page reports:

\`Could not find the table 'public.school_admins' in the schema cache\`

The browser code successfully gets past the initial Supabase configuration and user lookup, then requests:

\`\`\`js
supabase.from("school_admins")
  .select("role")
  .eq("user_id", user.id)
  .eq("is_active", true)
  .maybeSingle()
\`\`\`

The response is consistent with PostgREST error PGRST205: the API schema cache does not contain the relation. This is not evidence that the signed-in account lacks an owner/editor role. A missing relation or stale schema cache prevents the role check from reaching RLS.

## Source audit

Migration \`004_school_admin_roles.sql\` creates \`public.school_admins\`, enables RLS, grants SELECT to authenticated users, and creates the \`Admins read own role\` policy. It also creates \`is_school_admin()\` and \`is_school_owner()\`.

Migrations 006 and 007 rely on the administrator table/functions and add the audit table and A.6 catalogue metadata. The repository CI applies migrations in order to an isolated PostgreSQL 16 database. That does not mean the live Supabase database has received them.

## Safe live diagnosis

Run \`supabase/ops/diagnose_admin_access.sql\` in the live Supabase SQL Editor. It is read-only. Confirm:

1. \`school_admins_table\` is not NULL.
2. \`school_admins\` has RLS enabled.
3. \`authenticated\` has SELECT privilege.
4. Policy \`Admins read own role\` exists.
5. Both helper functions exist.
6. The migration history records 004 (and, before A.6 is considered live, 005–007).

If the table exists but the API still reports PGRST205, reload the PostgREST schema cache:

\`\`\`sql
notify pgrst, 'reload schema';
\`\`\`

Then wait briefly and reload the admin page.

If the table is absent, apply the missing migrations in order. Do not blindly re-run the entire migration set against a live database. First inspect migration history and compare it with \`supabase/migrations\`. When migrations 001–003 are confirmed present and the dependencies exist, apply \`004_school_admin_roles.sql\`; then apply any remaining pending migrations 005–007 in order. Prefer the Supabase CLI migration workflow and verify the remote history before \`db push\`.

If the migration history is unavailable or inconsistent, stop and inspect the live schema before changing it. Do not create a second table manually or disable RLS to bypass the error.

## After the table becomes visible

The first owner role is intentionally not created by migration 004. After the intended user has registered and confirmed their email, use the safe owner bootstrap SQL in \`docs/management/SUPABASE_ADMIN_ACCEPTANCE_2026-11-05.md\`. Then test:
- signed-in confirmed non-admin: no admin panel;
- active editor: editor capabilities only;
- active owner: owner capabilities;
- revoked/inactive admin: access denied.

Never place the service-role key in browser code, Git, issues, or chat.

## Code change

\`scripts/admin-auth.js\` now distinguishes missing-table/schema-cache errors (PGRST205) from permission/RLS errors (42501), and displays actionable diagnostics rather than telling every user simply to check migration 004.

## Current limitation

No live Supabase management/database connection is available in this execution context. The live database was not modified, and the fix is not claimed as deployed until the read-only diagnosis and pending migrations are completed against the actual project.
