# School admin management Edge Function

## Purpose

school-admin-management is the trusted server-side boundary for Auth user administration and administrator-role changes. The public browser client must never use the Supabase service_role key.

## Deploy

From a trusted workstation with the Supabase CLI authenticated to the correct project:

    supabase functions deploy school-admin-management
    supabase secrets set SUPABASE_URL=https://YOUR_PROJECT.supabase.co
    supabase secrets set SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_OR_PUBLISHABLE_KEY
    supabase secrets set SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_SECRET
    supabase secrets set ADMIN_ALLOWED_ORIGIN=https://dach1980.github.io

Set secrets in the Supabase project environment, not in GitHub Pages or the repository. Restrict the allowed origin to the exact production website origin. For a custom domain, change it deliberately and redeploy.

## Authorization

- The request must carry a valid Supabase access token.
- The caller email must be confirmed.
- The caller must have an active owner row in public.school_admins.
- list_users returns only account identifiers and operational metadata; it never returns credentials.
- set_user_status suspends/reactivates Auth accounts.
- grant_admin requires an existing email-verified user and assigns owner or editor.
- revoke_admin deactivates an administrator role.
- The caller cannot suspend or revoke their own owner account through these actions.
- Every action writes an explicit actor-attributed record to school_admin_audit.

## Required tests

1. Anonymous request → 401.
2. Unverified account → 401.
3. Ordinary user/editor → 403.
4. Owner can list users and grant/revoke roles.
5. Owner can suspend/reactivate another user.
6. Self-suspension and self-revocation are rejected.
7. Every successful change produces an audit record with the actor UUID.
8. Service-role key is absent from all static assets and browser bundles.

## Limitations

Deployment and live tests are not complete merely because the source exists. Apply database migrations first, bootstrap the first owner, deploy the function, then run the tests above. The website public registration switch remains disabled until legal documents and SMTP are approved.
