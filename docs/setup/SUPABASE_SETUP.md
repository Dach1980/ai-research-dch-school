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

Run `supabase/migrations/001_learning_access.sql` in the Supabase SQL Editor. Inspect the result and verify that RLS is enabled on all four tables.

Seed the catalogue only after confirming the exact stable lesson IDs and publication status. Initial public IDs should correspond to the two intentionally open chapters:
- `module-00-introduction`
- `xai-01-what-and-why`

Keep all other lessons unpublished or marked `free_account` / `paid` as appropriate.

## 3. Configure email authentication

In Authentication → URL Configuration:
- Site URL: the production school URL (prefer a custom domain when ready).
- Redirect URL allow-list: exact production callback URL `https://YOUR_DOMAIN/auth/callback.html`.
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
