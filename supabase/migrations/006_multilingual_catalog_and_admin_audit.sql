-- DCH School: multilingual A.1-A.5 catalogue metadata and administrative audit trail.
-- Apply after migrations 001, 002, 003 reconciliation, 004 and 005.

insert into public.lesson_catalog (id,title,visibility,is_published,sort_order)
values
 ('a-1-what-is-artificial-intelligence',
  '{"ru":"A.1 · Что такое искусственный интеллект?","en":"A.1 · What Is Artificial Intelligence?","zh":"A.1 · 什么是人工智能？"}'::jsonb,
  'public',true,1),
 ('a-2-ai-ml-deep-learning',
  '{"ru":"A.2 · AI, Machine Learning и Deep Learning","en":"A.2 · AI, Machine Learning and Deep Learning","zh":"A.2 · AI、机器学习与深度学习"}'::jsonb,
  'public',true,2),
 ('a-3-how-machines-learn-from-data',
  '{"ru":"A.3 · Как машина учится на данных","en":"A.3 · How Machines Learn from Data","zh":"A.3 · 机器如何从数据中学习"}'::jsonb,
  'public',true,3),
 ('a-4-what-is-machine-learning-model',
  '{"ru":"A.4 · Что такое модель машинного обучения?","en":"A.4 · What Is a Machine Learning Model?","zh":"A.4 · 什么是机器学习模型？"}'::jsonb,
  'public',true,4),
 ('a-5-how-to-evaluate-a-model',
  '{"ru":"A.5 · Как проверяют качество модели","en":"A.5 · How to Evaluate a Machine Learning Model","zh":"A.5 · 如何评估机器学习模型？"}'::jsonb,
  'public',true,5)
on conflict (id) do update set
 title=excluded.title, visibility=excluded.visibility,
 is_published=excluded.is_published, sort_order=excluded.sort_order,
 updated_at=now();

create table if not exists public.school_admin_audit (
 id bigint generated always as identity primary key,
 actor_user_id uuid references auth.users(id) on delete set null,
 action text not null,
 entity_type text not null,
 entity_id text,
 before_data jsonb,
 after_data jsonb,
 created_at timestamptz not null default now()
);
create index if not exists school_admin_audit_created_idx
 on public.school_admin_audit(created_at desc);
create index if not exists school_admin_audit_entity_idx
 on public.school_admin_audit(entity_type,entity_id,created_at desc);
alter table public.school_admin_audit enable row level security;
revoke all on public.school_admin_audit from anon,authenticated;
grant select on public.school_admin_audit to authenticated;
drop policy if exists "School admins read audit log" on public.school_admin_audit;
create policy "School admins read audit log" on public.school_admin_audit
 for select to authenticated using ((select public.is_school_admin()));

-- Editors may inspect learner profiles; only owners may correct display metadata.
drop policy if exists "School admins read profiles" on public.profiles;
create policy "School admins read profiles" on public.profiles
 for select to authenticated using ((select public.is_school_admin()));
grant update(display_name,preferred_locale) on public.profiles to authenticated;
drop policy if exists "School owners update profile metadata" on public.profiles;
create policy "School owners update profile metadata" on public.profiles
 for update to authenticated
 using ((select public.is_school_owner()))
 with check ((select public.is_school_owner()));

create or replace function public.audit_school_admin_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
 old_json jsonb;
 new_json jsonb;
 key_value text;
begin
 if tg_op <> 'INSERT' then old_json := to_jsonb(old); end if;
 if tg_op <> 'DELETE' then new_json := to_jsonb(new); end if;
 key_value := coalesce(new_json->>'id',new_json->>'lesson_id',new_json->>'user_id',
                       old_json->>'id',old_json->>'lesson_id',old_json->>'user_id');
 insert into public.school_admin_audit(actor_user_id,action,entity_type,entity_id,before_data,after_data)
 values ((select auth.uid()),lower(tg_op),tg_table_name,key_value,old_json,new_json);
 if tg_op = 'DELETE' then return old; else return new; end if;
end;
$$;
revoke all on function public.audit_school_admin_change() from public;
drop trigger if exists audit_lesson_catalog_changes on public.lesson_catalog;
create trigger audit_lesson_catalog_changes after insert or update or delete on public.lesson_catalog
 for each row execute function public.audit_school_admin_change();
drop trigger if exists audit_lesson_content_changes on public.lesson_content;
create trigger audit_lesson_content_changes after insert or update or delete on public.lesson_content
 for each row execute function public.audit_school_admin_change();
drop trigger if exists audit_lesson_entitlement_changes on public.lesson_entitlements;
create trigger audit_lesson_entitlement_changes after insert or update or delete on public.lesson_entitlements
 for each row execute function public.audit_school_admin_change();
drop trigger if exists audit_school_admin_role_changes on public.school_admins;
create trigger audit_school_admin_role_changes after insert or update or delete on public.school_admins
 for each row execute function public.audit_school_admin_change();

-- Auth user bans and role grants are intentionally handled by the trusted Edge Function,
-- never by exposing the service_role key or granting direct browser access to auth.users.
