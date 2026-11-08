-- Supplemental assertions for migration 008; included by ci_assertions.sql after migration.
do $$
begin
  if (select count(*) from public.lesson_content_mapping_groups) <> 29 then
    raise exception 'Unexpected content mapping group count';
  end if;
  if (select count(*) from public.lesson_content_mapping_targets) <> 58 then
    raise exception 'Unexpected content mapping target count';
  end if;
  if (select count(*) from public.lesson_legacy_aliases where source_system='static_site' and alias_kind='localized_url') = 0 then
    raise exception 'Localized static-site URL aliases are missing';
  end if;
  if exists (select 1 from public.course_lesson_uid_registry where is_published) then
    raise exception 'Staging v3 lessons must remain unpublished';
  end if;
end $$;
