-- Post-migration structural assertions for the DCH School schema.
do $$
declare
  relation_name text;
  expected text[] := array[
    'profiles','lesson_catalog','lesson_content','lesson_entitlements',
    'school_admins','school_admin_audit'
  ];
  item text;
  public_lesson_count integer;
begin
  foreach item in array expected loop
    if not exists (
      select 1
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relname = item and c.relkind = 'r' and c.relrowsecurity
    ) then
      raise exception 'RLS is not enabled on public.%', item;
    end if;
  end loop;

  if to_regprocedure('public.is_school_admin()') is null then
    raise exception 'public.is_school_admin() is missing';
  end if;
  if to_regprocedure('public.is_school_owner()') is null then
    raise exception 'public.is_school_owner() is missing';
  end if;

  select count(*) into public_lesson_count
  from public.lesson_catalog
  where id in (
    'a-1-what-is-artificial-intelligence',
    'a-2-ai-ml-deep-learning',
    'a-3-how-machines-learn-from-data',
    'a-4-what-is-machine-learning-model',
    'a-5-how-to-evaluate-a-model',
    'a-6-generalization-and-overfitting'
  ) and visibility = 'public' and is_published = true;

  if public_lesson_count <> 6 then
    raise exception 'Expected 6 published public A.1-A.6 metadata rows, got %', public_lesson_count;
  end if;

  if exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename in ('profiles','lesson_catalog','lesson_content','lesson_entitlements','school_admins','school_admin_audit')
      and 'anon' = any(roles)
      and cmd in ('INSERT','UPDATE','DELETE','ALL')
  ) then
    raise exception 'Anonymous role has a write policy on a protected public table';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='school_admins'
      and policyname='Admins read own role' and cmd='SELECT'
  ) then
    raise exception 'school_admins self/owner read policy is missing';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='school_admin_audit'
      and policyname='School admins read audit log' and cmd='SELECT'
  ) then
    raise exception 'school_admin_audit admin read policy is missing';
  end if;
end $$;

select 'DCH School migrations and RLS assertions passed' as result;
