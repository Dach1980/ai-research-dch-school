# Initial administrator bootstrap

**Security rule:** do not grant administrator permissions from browser code, public JSON, GitHub Pages, or a user-editable profile field.

## Deployment order

1. Configure the Supabase project URL and publishable key in `scripts/supabase-config.js`.
2. Apply migrations `001_learning_access.sql` through `004_school_admin_roles.sql` in order.
3. Create the intended owner account through the normal email sign-up flow.
4. Confirm the email address and sign in once.
5. In Supabase Dashboard → SQL Editor, identify the exact UUID for that verified account:

```sql
select id, email, email_confirmed_at
from auth.users
where lower(email) = lower('OWNER_EMAIL_HERE');
```

6. Verify the returned email and non-null `email_confirmed_at`. Then grant the owner role using the exact UUID returned by the query:

```sql
insert into public.school_admins (user_id, role, is_active)
values ('VERIFIED_AUTH_USER_UUID_HERE', 'owner', true)
on conflict (user_id) do update
set role = 'owner', is_active = true;
```

7. Sign out and sign in again, then open `/admin/`. The browser UI checks the verified session and reads the user's active role. PostgreSQL RLS independently enforces write permissions.

## Role boundaries

- `owner`: administers lesson catalogue/content and manages learning entitlements.
- `editor`: administers lesson catalogue/content and can inspect entitlements, but cannot grant or revoke them.
- ordinary authenticated user: no access to administrative writes.
- anonymous user: no access to the administrator role table or administrative operations.

The migration intentionally creates no initial owner. The first grant must be performed by the Supabase project owner in the trusted Dashboard SQL Editor. Never add a self-service role-grant endpoint.

## Production gates still required

- Configure and verify SMTP delivery, email confirmation, password reset and throttling.
- Replace draft Terms and Privacy Policy with approved public documents before enabling public registration.
- Move any account-only or paid lesson bodies out of the public GitHub Pages repository.
- Test anonymous, ordinary-user, editor and owner access directly against the Supabase REST API.
- Add an audit trail for administrative changes and test role revocation.
