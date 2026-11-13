-- Read-only diagnostics for the live Supabase project.
-- Run in Supabase Dashboard → SQL Editor. This script grants no permissions and changes no data.

select
  current_database() as database_name,
  current_user as executing_role,
  to_regclass('public.school_admins') as school_admins_table,
  to_regclass('public.lesson_catalog') as lesson_catalog_table,
  to_regclass('public.lesson_content') as lesson_content_table,
  to_regclass('public.lesson_entitlements') as lesson_entitlements_table,
  to_regclass('auth.users') as auth_users_table;

select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in ('school_admins','school_admin_audit','lesson_catalog','lesson_content','lesson_entitlements')
order by tablename;

select schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename in ('school_admins','school_admin_audit','lesson_catalog','lesson_content','lesson_entitlements')
order by tablename, policyname;

select
  routine_schema, routine_name, security_type
from information_schema.routines
where routine_schema = 'public'
  and routine_name in ('is_school_admin','is_school_owner')
order by routine_name;

select
  grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name = 'school_admins'
order by grantee, privilege_type;

-- Inspect migration history if Supabase CLI migrations are being tracked.
select to_regclass('supabase_migrations.schema_migrations') as migration_history_table;
