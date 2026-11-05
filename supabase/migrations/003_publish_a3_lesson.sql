-- Add the newly published public A.3 lesson to the Supabase metadata catalogue.
-- The static HTML lesson is public by design. This migration does not copy lesson content.
insert into public.lesson_catalog (id,title,visibility,is_published,sort_order)
values (
  'a-3-how-machines-learn-from-data',
  '{"ru":"A.3 · Как машина учится на данных","en":"A.3 · How machines learn from data","zh":"A.3 · 机器如何从数据中学习"}'::jsonb,
  'public',
  true,
  3
)
on conflict (id) do update set
  title = excluded.title,
  visibility = excluded.visibility,
  is_published = excluded.is_published,
  sort_order = excluded.sort_order,
  updated_at = now();
