-- Reconcile the public learning catalog with data/catalog/lessons.json.
-- A.1 and A.2 are explicitly open lessons; no account entitlement is required.
-- This corrective migration is additive and leaves previously applied migrations intact.

insert into public.lesson_catalog (id, title, visibility, is_published, sort_order)
values
(
  'a-1-what-is-artificial-intelligence',
  '{"ru":"A.1 · Что такое искусственный интеллект?","en":"A.1 · What is artificial intelligence?","zh":"A.1 · 什么是人工智能？"}'::jsonb,
  'public',
  true,
  2
),
(
  'a-2-ai-ml-deep-learning',
  '{"ru":"A.2 · AI, Machine Learning и Deep Learning","en":"A.2 · AI, Machine Learning and Deep Learning","zh":"A.2 · 人工智能、机器学习与深度学习"}'::jsonb,
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
