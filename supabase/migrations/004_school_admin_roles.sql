-- DCH School: database-enforced school administrator roles.
-- No administrator is created by this migration. Bootstrap must be performed
-- explicitly by the project owner after a verified account has been created.

create table if not exists public.school_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','editor')),
  is_active boolean not null default true,
  granted_at timestamptz not null default now(),
  granted_by uuid references auth.users(id) on delete set null
);

create index if not exists school_admins_active_role_idx
  on public.school_admins(role, is_active);

alter table public.school_admins enable row level security;
revoke all on public.school_admins from anon, authenticated;
grant select on public.school_admins to authenticated;

create or replace function public.is_school_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.school_admins a
    where a.user_id = (select auth.uid())
      and a.is_active = true
      and a.role in ('owner','editor')
  );
$$;

create or replace function public.is_school_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.school_admins a
    where a.user_id = (select auth.uid())
      and a.is_active = true
      and a.role = 'owner'
  );
$$;

revoke all on function public.is_school_admin() from public;
revoke all on function public.is_school_owner() from public;
grant execute on function public.is_school_admin() to authenticated;
grant execute on function public.is_school_owner() to authenticated;

drop policy if exists "Admins read own role" on public.school_admins;
create policy "Admins read own role" on public.school_admins
for select to authenticated
using (user_id = (select auth.uid()) or (select public.is_school_owner()));

-- Only active administrators may manage the catalogue and lesson payloads.
grant insert, update, delete on public.lesson_catalog to authenticated;
drop policy if exists "School admins manage lesson catalogue" on public.lesson_catalog;
create policy "School admins manage lesson catalogue" on public.lesson_catalog
for all to authenticated
using ((select public.is_school_admin()))
with check ((select public.is_school_admin()));

grant insert, update, delete on public.lesson_content to authenticated;
drop policy if exists "School admins manage lesson content" on public.lesson_content;
create policy "School admins manage lesson content" on public.lesson_content
for all to authenticated
using ((select public.is_school_admin()))
with check ((select public.is_school_admin()));

-- Editors can inspect entitlements but only an owner can grant, change or revoke them.
grant insert, update, delete on public.lesson_entitlements to authenticated;
drop policy if exists "School admins read all entitlements" on public.lesson_entitlements;
create policy "School admins read all entitlements" on public.lesson_entitlements
for select to authenticated
using ((select public.is_school_admin()));
drop policy if exists "School owners insert entitlements" on public.lesson_entitlements;
create policy "School owners insert entitlements" on public.lesson_entitlements
for insert to authenticated
with check ((select public.is_school_owner()));
drop policy if exists "School owners update entitlements" on public.lesson_entitlements;
create policy "School owners update entitlements" on public.lesson_entitlements
for update to authenticated
using ((select public.is_school_owner()))
with check ((select public.is_school_owner()));
drop policy if exists "School owners delete entitlements" on public.lesson_entitlements;
create policy "School owners delete entitlements" on public.lesson_entitlements
for delete to authenticated
using ((select public.is_school_owner()));

-- Deliberately no client policy permits users to grant themselves a role.
-- Bootstrap an initial owner only from the Supabase SQL Editor as project owner.
