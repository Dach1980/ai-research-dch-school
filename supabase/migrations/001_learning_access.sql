-- DCH School: identity profiles and server-enforced lesson access.
-- Run in Supabase SQL Editor. Do not expose the service_role key to the browser.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  preferred_locale text not null default 'ru' check (preferred_locale in ('ru','en','zh')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lesson_catalog (
  id text primary key,
  title jsonb not null default '{}'::jsonb,
  visibility text not null check (visibility in ('public','free_account','paid')),
  product_id text,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lesson_content (
  lesson_id text primary key references public.lesson_catalog(id) on delete cascade,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.lesson_entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text references public.lesson_catalog(id) on delete cascade,
  product_id text,
  status text not null check (status in ('active','revoked','expired')),
  granted_at timestamptz not null default now(),
  expires_at timestamptz,
  constraint entitlement_scope_check check (lesson_id is not null or product_id is not null)
);
create index if not exists lesson_entitlements_user_lesson_idx on public.lesson_entitlements(user_id,lesson_id,status);
create index if not exists lesson_entitlements_user_product_idx on public.lesson_entitlements(user_id,product_id,status);

create or replace function public.is_email_verified()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from auth.users u
    where u.id = (select auth.uid())
      and u.email_confirmed_at is not null
  );
$$;

create or replace function public.has_lesson_entitlement(target_lesson_id text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.lesson_entitlements e
    where e.user_id = (select auth.uid())
      and e.status = 'active'
      and (e.expires_at is null or e.expires_at > now())
      and (e.lesson_id = target_lesson_id or e.product_id = (select l.product_id from public.lesson_catalog l where l.id = target_lesson_id))
  );
$$;

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;

create or replace function public.create_profile_for_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(id,display_name,preferred_locale)
  values(new.id, new.raw_user_meta_data->>'display_name',
    case when new.raw_user_meta_data->>'preferred_locale' in ('ru','en','zh')
      then new.raw_user_meta_data->>'preferred_locale' else 'ru' end)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_dch on auth.users;
create trigger on_auth_user_created_dch after insert on auth.users
for each row execute procedure public.create_profile_for_new_user();

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at before update on public.profiles
for each row execute procedure public.touch_updated_at();

alter table public.profiles enable row level security;
alter table public.lesson_catalog enable row level security;
alter table public.lesson_content enable row level security;
alter table public.lesson_entitlements enable row level security;

revoke all on public.profiles from anon,authenticated;
grant select on public.profiles to authenticated;
grant update(display_name,preferred_locale) on public.profiles to authenticated;
grant select on public.lesson_catalog to anon,authenticated;
grant select on public.lesson_content to anon,authenticated;
grant select on public.lesson_entitlements to authenticated;

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile" on public.profiles for select to authenticated
using (id = (select auth.uid()));
drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile" on public.profiles for update to authenticated
using (id = (select auth.uid())) with check (id = (select auth.uid()));

drop policy if exists "Public lesson catalogue" on public.lesson_catalog;
create policy "Public lesson catalogue" on public.lesson_catalog for select to anon,authenticated
using (is_published = true);

drop policy if exists "Read accessible lesson content" on public.lesson_content;
create policy "Read accessible lesson content" on public.lesson_content for select to anon,authenticated
using (
  exists (
    select 1 from public.lesson_catalog l
    where l.id = lesson_content.lesson_id and l.is_published = true
      and (
        l.visibility = 'public'
        or (l.visibility = 'free_account' and (select public.is_email_verified()))
        or (l.visibility = 'paid' and (select public.is_email_verified())
            and (select public.has_lesson_entitlement(l.id)))
      )
  )
);

drop policy if exists "Users read own entitlements" on public.lesson_entitlements;
create policy "Users read own entitlements" on public.lesson_entitlements for select to authenticated
using (user_id = (select auth.uid()));

-- Deliberately no client INSERT/UPDATE/DELETE policies on entitlements or lesson content.
-- Grant/revoke entitlements only from a trusted admin/server process.
