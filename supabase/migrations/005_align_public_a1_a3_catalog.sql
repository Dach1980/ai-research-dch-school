-- Align the Supabase metadata catalogue with the intentionally public A.1–A.3 pages.
-- The page payloads remain static/public on GitHub Pages; this migration only fixes metadata.
insert into public.lesson_catalog (id,title,visibility,is_published,sort_order)
values
  ('a-1-what-is-artificial-intelligence',
   '{"ru":"A.1 · Что такое искусственный интеллект?","en":"A.1 · What is artificial intelligence?","zh":"A.1 · 什么是人工智能？"}'::jsonb,
   'public',true,1),
  ('a-2-ai-ml-deep-learning',
   '{"ru":"A.2 · AI, Machine Learning и Deep Learning","en":"A.2 · AI, Machine Learning and Deep Learning","zh":"A.2 · AI、机器学习与深度学习"}'::jsonb,
   'public',true,2),
  ('a-3-how-machines-learn-from-data',
   '{"ru":"A.3 · Как машина учится на данных","en":"A.3 · How machines learn from data","zh":"A.3 · 机器如何从数据中学习"}'::jsonb,
   'public',true,3)
on conflict (id) do update set
  title = excluded.title,
  visibility = excluded.visibility,
  is_published = excluded.is_published,
  sort_order = excluded.sort_order,
  updated_at = now();
