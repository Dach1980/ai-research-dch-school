-- Public catalogue metadata only. Lesson bodies/assets must be uploaded separately
-- to protected Supabase storage/tables; do not copy private lesson payloads here.
insert into public.lesson_catalog (id,title,visibility,is_published,sort_order)
values
('module-00-introduction',
 '{"ru":"00 · Введение в курс","en":"00 · Course introduction","zh":"00 · 课程导论"}'::jsonb,
 'public',true,0),
('xai-01-what-and-why',
 '{"ru":"XAI · Что это и зачем нужно","en":"XAI · What it is and why it matters","zh":"XAI · 是什么以及为何重要"}'::jsonb,
 'public',true,1),
('a-1-what-is-artificial-intelligence',
 '{"ru":"A.1 · Что такое искусственный интеллект?","en":"A.1 · What is artificial intelligence?","zh":"A.1 · 什么是人工智能？"}'::jsonb,
 'free_account',true,2)
on conflict (id) do update set
 title=excluded.title,
 visibility=excluded.visibility,
 is_published=excluded.is_published,
 sort_order=excluded.sort_order,
 updated_at=now();
