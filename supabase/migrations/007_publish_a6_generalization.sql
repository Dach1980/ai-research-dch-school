-- Publish A.6 in the public multilingual lesson catalogue.
-- Lesson body and SVG illustrations are served by GitHub Pages.
insert into public.lesson_catalog (id,title,visibility,is_published,sort_order)
values (
 'a-6-generalization-and-overfitting',
 '{"ru":"A.6 · Почему модель ошибается на новых данных?","en":"A.6 · Why Does a Model Fail on New Data?","zh":"A.6 · 为什么模型在新数据上会出错？"}'::jsonb,
 'public', true, 6
)
on conflict (id) do update set
 title=excluded.title,
 visibility=excluded.visibility,
 is_published=excluded.is_published,
 sort_order=excluded.sort_order,
 updated_at=now();
