-- Read-only live Supabase inspection for the catalog v3 cutover gate.
-- Run in Supabase SQL Editor. This script does not modify data or schema.

select current_database() as database_name, current_user as sql_role, now() as inspected_at;

-- Confirm migration history and the presence of catalog-v3 relations.
select to_regclass('supabase_migrations.schema_migrations') as migration_history_table,
       to_regclass('public.course_lesson_uid_registry') as uid_registry,
       to_regclass('public.lesson_legacy_aliases') as legacy_aliases,
       to_regclass('public.lesson_content_mapping_groups') as mapping_groups,
       to_regclass('public.lesson_content_mapping_targets') as mapping_targets;

-- List applied migration versions when the standard Supabase history table exists.
select version
from supabase_migrations.schema_migrations
order by version;

-- Report exact row counts for relevant tables without exposing learner data.
do $$
declare
  table_name text;
  row_count bigint;
begin
  foreach table_name in array array[
    'lesson_catalog','lesson_content','lesson_entitlements','school_admins',
    'school_admin_audit','course_lesson_uid_registry','lesson_legacy_aliases',
    'lesson_content_mapping_groups','lesson_content_mapping_targets'
  ] loop
    if to_regclass('public.' || quote_ident(table_name)) is not null then
      execute format('select count(*) from public.%I', table_name) into row_count;
      raise notice 'public.%.row_count=%', table_name, row_count;
    else
      raise notice 'public.%.MISSING', table_name;
    end if;
  end loop;
end $$;

-- Find possible learner-state stores by table/column names; this returns names only.
select table_schema, table_name, column_name
from information_schema.columns
where table_schema in ('public','storage')
  and (
    table_name ilike any(array['%progress%','%bookmark%','%quiz%','%attempt%','%completion%','%learning%'])
    or column_name ilike any(array['%progress%','%bookmark%','%quiz%','%attempt%','%completion%'])
  )
order by table_schema, table_name, ordinal_position;

-- RLS and policies on the catalog-v3 registry.
select c.relname as table_name, c.relrowsecurity as rls_enabled,
       c.relforcerowsecurity as rls_forced
from pg_class c
join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public'
  and c.relname in ('course_lesson_uid_registry','lesson_legacy_aliases',
                    'lesson_content_mapping_groups','lesson_content_mapping_targets')
order by c.relname;

select tablename, policyname, roles, cmd
from pg_policies
where schemaname='public'
  and tablename in ('course_lesson_uid_registry','lesson_legacy_aliases',
                    'lesson_content_mapping_groups','lesson_content_mapping_targets')
order by tablename, policyname;

-- Verify resolver existence and service_role-only EXECUTE grant.
select to_regprocedure('public.resolve_lesson_uid_aliases(text,text,text,text)') as resolver_function;
select has_function_privilege('service_role',
       'public.resolve_lesson_uid_aliases(text,text,text,text)', 'EXECUTE') as service_role_can_execute,
       has_function_privilege('authenticated',
       'public.resolve_lesson_uid_aliases(text,text,text,text)', 'EXECUTE') as authenticated_can_execute,
       has_function_privilege('anon',
       'public.resolve_lesson_uid_aliases(text,text,text,text)', 'EXECUTE') as anon_can_execute;
