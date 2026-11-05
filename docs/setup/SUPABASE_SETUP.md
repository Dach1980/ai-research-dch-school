# Supabase project setup — DCH School

**State:** Frontend and initial SQL migration scaffolded. Live email delivery and protected lesson delivery are NOT active until the external Supabase project is configured and tested.

## 1. Create the Supabase project

1. Create a project at https://supabase.com/dashboard.
2. Select a region appropriate for the school's audience and applicable privacy requirements.
3. Save the database password in a password manager; never commit it.
4. In Project Settings → API, copy the Project URL and publishable/anon key.
5. Put those two public values in `scripts/supabase-config.js`.
6. Never copy the `service_role` secret into the website or repository.

The browser key is not an access-control mechanism. Security depends on the RLS policies in the migration.

## 2. Apply the database migration

Run the migrations in order: 001_learning_access.sql, 002_seed_lesson_catalog.sql, 003_reconcile_public_lessons.sql, 004_school_admin_roles.sql, 005_align_public_a1_a3_catalog.sql, and 006_multilingual_catalog_and_admin_audit.sql. The duplicate 003_publish_a3_lesson.sql was consolidated into migration 003 and removed so the migration version is unique. Apply each file once in the Supabase SQL Editor (or use the CLI after reconciling migration history). Inspect the result and verify RLS on profiles, lesson_catalog, lesson_content, lesson_entitlements, school_admins and school_admin_audit.

Migration 006 synchronizes public multilingual metadata for A.1–A.5, creates the database audit log and owner-only profile metadata policy. Migrations 003/005 are retained for compatibility and reconciliation. This is metadata only: all lesson HTML bodies remain in the public GitHub repository and are NOT protected by database policies. Do not treat the access gate as production-secure until its lesson payload and assets have been moved out of the public repository and the old public copies/history have been addressed.

## 3. Configure email authentication

In Authentication → URL Configuration:
- Site URL: `https://dach1980.github.io/ai-research-dch-school/` for the current GitHub Pages deployment (replace it when a production custom domain is configured).
- Redirect URL allow-list: `https://dach1980.github.io/ai-research-dch-school/auth/callback.html` for the current GitHub Pages deployment; add the exact custom-domain callback URL after domain setup.
- Add the GitHub Pages callback URL only if it is deliberately used for production testing.

In Authentication → Sign In / Providers:
- Enable Email provider.
- Require email confirmation.
- Keep password minimum length at least 8 characters (consider a stronger policy and breached-password protection where available).

In Authentication → Emails:
- Customize Confirm signup and Reset password templates.
- Confirmation template should link through Supabase's verification endpoint and redirect to `{{ .RedirectTo }}`; do not replace the verification endpoint with a direct link to the static callback.
- Configure a verified sender and custom SMTP before public launch. Test inbox and spam placement, link expiry, single-use behavior, and resend throttling.
- Prepare localized RU / EN / ZH email templates or a language-aware mail workflow.

## 4. Configure callback and client

The frontend uses the Supabase JS v2 client loaded from esm.sh and reads only the public URL/key from `scripts/supabase-config.js`. Confirm that the CDN is permitted by the school's content-security policy and available in the target regions.

The registration callback is `auth/callback.html`. The app stores the selected locale and theme in browser storage and passes locale through the callback.

## 5. Current public-content limitation — do not skip

GitHub Pages is public static hosting. The current lesson data files are committed to this public repository, so they are downloadable regardless of any login form. The SQL RLS policies cannot protect files that remain in GitHub.

Before claiming that account-only or paid content is protected:
1. Move restricted lesson payloads and their private assets into Supabase tables/private Storage or a trusted API.
2. Remove restricted copies from the public repository and its published Pages artifact.
3. Update the lesson reader to fetch protected content from Supabase after authentication.
4. Verify anonymous direct requests to restricted table rows and storage objects are denied.
5. Check repository history and deployment artifacts for accidental exposure; deleting a file from the latest commit does not erase prior public Git history.

Until this migration is complete, the two public chapters are the only materials that can safely be treated as intentionally public. Do not publish paid or sensitive lesson content in the repository.

## 6. Required tests before production

- Sign up with a new email; confirmation email is delivered.
- Account cannot read account-only lesson content before confirmation.
- Expired/invalid confirmation link is handled safely.
- Successful confirmation returns to the school and enables sign-in.
- Sign-in, sign-out, session refresh, password reset and resend work.
- Verified user can read free-account lesson payload.
- Anonymous and unverified users cannot read free-account payload by direct REST/API request.
- User A cannot read User B's profile or entitlements.
- Client cannot create or modify entitlements.
- Paid content is denied without an active entitlement and after revocation/expiry.
- RU, EN, ZH and both themes work throughout the flow.


## 7. Legal publication gate

The registration checkbox links to `docs/legal/TERMS_DRAFT.md` and `docs/legal/PRIVACY_POLICY_DRAFT.md`. These are checklists, not final legal documents. Before enabling public sign-up, replace them with approved user-facing pages containing the operator identity, contact details, applicable jurisdiction, processing purposes/legal bases, retention, user rights, Supabase region/subprocessors, account deletion procedure, and other required disclosures. Registration must not be promoted publicly while these documents remain drafts.


## 8. Initial administrator

After applying migrations 004 and 006, follow [ADMIN_BOOTSTRAP.md](ADMIN_BOOTSTRAP.md) to grant the first owner role from the trusted Supabase SQL Editor. Then deploy the school-admin-management Edge Function using ADMIN_EDGE_FUNCTION.md. The migration deliberately creates no administrator. The /admin/ page stays hidden until a verified user session has an active owner or editor row in public.school_admins.


## 9. Administrative management

The repository contains a protected management interface for lesson catalogue metadata, JSON lesson payloads, learner account status, administrator roles, learning entitlements and the PostgreSQL audit log. User/role actions call a trusted Edge Function; the browser never receives the service-role key. See ADMIN_EDGE_FUNCTION.md.

This is not yet a production-ready content publishing pipeline. The website is static GitHub Pages: changing Supabase catalogue metadata or a JSON payload does not rebuild the public HTML page. Protected lesson delivery remains blocked until restricted bodies/assets are moved out of the public repository and direct-access tests pass. Keep registration disabled until SMTP, legal documents, email lifecycle and privacy requirements are approved.
