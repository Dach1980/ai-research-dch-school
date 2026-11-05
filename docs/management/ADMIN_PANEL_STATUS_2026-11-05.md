# Administrator panel status — 2026-11-05

## Current implementation

The repository already contains a protected administrator page at `admin/index.html`. It is not a second public administrator site and should remain the single administration entry point.

Implemented in the repository:
- Supabase session gate in `scripts/admin-auth.js`;
- confirmation check for the signed-in email;
- active `school_admins` role lookup and owner/editor role label;
- tabs for overview, roadmap, audit, content, users, permissions and lesson entitlements;
- catalogue metadata and lesson JSON payload management in `scripts/admin-management.js`;
- owner-only Edge Function calls for user and role management;
- database audit display;
- static project Roadmap and dated report history loaded from `data/audit-roadmap.json`.

## Change delivered in this stage

A separate **Roadmap** tab has been added. The former combined “Аудит и roadmap” tab is split into:
- **Roadmap** — project milestones, status, acceptance criteria, and dated reports/results;
- **Аудит** — administrative operation audit log from Supabase.

The Roadmap view renders the project report history from `data/audit-roadmap.json`, including date, report ID, type, result, limitations and evidence file references. This keeps the durable project report history version-controlled in GitHub. It is not an editable in-browser form; repository commits remain the write path for the project Roadmap.

## Access and deployment prerequisites

The UI is protected, but its production readiness is not yet verified:
1. Apply all required Supabase migrations to the intended live project.
2. Verify RLS policies and the `school_admins` role table.
3. Create/confirm the initial owner account and grant the owner role explicitly through the trusted Supabase owner workflow.
4. Verify email confirmation and session lifecycle.
5. Test owner and editor permissions, including denial of unauthorized actions.
6. Verify the Edge Function `school-admin-management` is deployed and its JWT/role checks work.
7. Run live integration tests for catalogue, lesson payloads, user status, role management, entitlements and audit log.
8. Verify the GitHub Pages deployment and browser behavior.

The public client configuration exists in `scripts/supabase-config.js`; the presence of a URL and publishable key is not proof that migrations, SMTP, owner bootstrap, Edge Functions or RLS are configured correctly. Public registration remains disabled.

## Manus decision

A separate Manus implementation brief is not required for the Roadmap tab: the existing static admin page and JavaScript are sufficient for this view. Manus may be used later for visual refinement, but it must not become the source of truth for project history or bypass Supabase authorization.

## Acceptance checklist

- [x] Dedicated Roadmap tab exists in the existing administrator page.
- [x] Roadmap and administrative audit are separate tabs.
- [x] Roadmap renders dated reports with results and evidence.
- [x] Project Roadmap source is version-controlled JSON.
- [ ] Live Supabase migration and owner bootstrap verified.
- [ ] Owner/editor authorization integration tests passed.
- [ ] Edge Function deployment and security tests passed.
- [ ] GitHub Pages deployment and desktop/mobile browser acceptance passed.

**Status:** UI/code changes committed; live operational readiness remains IN PROGRESS.
