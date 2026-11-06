-- Keep portfolio copy in page_sections and make content status transitions
-- explicit. This migration is additive/idempotent and never resets content.

do $$
begin
  if to_regclass('public.page_sections') is null or to_regclass('public.site_settings') is null then
    return;
  end if;

  -- Older installations may have hero copy only in site_settings. Move it
  -- into the section table when the canonical row does not exist yet.
  insert into public.page_sections (
    section_key, section_name, eyebrow, title, description, badge_text,
    is_visible, sort_order, custom_data
  )
  select
    'hero',
    'hero',
    (select value #>> '{}' from public.site_settings where key = 'hero_badge' limit 1),
    (select value #>> '{}' from public.site_settings where key = 'hero_title' limit 1),
    (select value #>> '{}' from public.site_settings where key = 'hero_description' limit 1),
    (select value #>> '{}' from public.site_settings where key = 'hero_badge' limit 1),
    true,
    1,
    jsonb_build_object(
      'roles', coalesce((select value from public.site_settings where key = 'professional_titles' and jsonb_typeof(value) = 'array' limit 1), '[]'::jsonb),
      'availability_status', coalesce((select value #>> '{}' from public.site_settings where key = 'availability_label' limit 1), '')
    )
  where not exists (select 1 from public.page_sections where section_key = 'hero');

  update public.page_sections as section
  set badge_text = coalesce(nullif(section.badge_text, ''), legacy.value #>> '{}')
  from public.site_settings as legacy
  where section.section_key = 'hero'
    and legacy.key = 'hero_badge'
    and legacy.value #>> '{}' is not null;

  update public.page_sections as section
  set title = coalesce(nullif(section.title, ''), legacy.value #>> '{}')
  from public.site_settings as legacy
  where section.section_key = 'hero'
    and legacy.key = 'hero_title'
    and legacy.value #>> '{}' is not null;

  update public.page_sections as section
  set description = coalesce(nullif(section.description, ''), legacy.value #>> '{}')
  from public.site_settings as legacy
  where section.section_key = 'hero'
    and legacy.key = 'hero_description'
    and legacy.value #>> '{}' is not null;

  update public.page_sections as section
  set custom_data = section.custom_data || jsonb_build_object('roles', legacy.value)
  from public.site_settings as legacy
  where section.section_key = 'hero'
    and legacy.key = 'professional_titles'
    and jsonb_typeof(legacy.value) = 'array'
    and jsonb_array_length(legacy.value) > 0
    and case
      when jsonb_typeof(section.custom_data -> 'roles') = 'array'
        then jsonb_array_length(section.custom_data -> 'roles') = 0
      else true
    end;

  update public.page_sections as section
  set custom_data = section.custom_data || jsonb_build_object('availability_status', legacy.value #>> '{}')
  from public.site_settings as legacy
  where section.section_key = 'hero'
    and legacy.key = 'availability_label'
    and legacy.value #>> '{}' is not null
    and coalesce(section.custom_data ->> 'availability_status', '') = '';

  -- Legacy keys remain recoverable for administrators but cannot be mistaken
  -- for public content after the page_sections migration.
  update public.site_settings
  set is_public = false,
      description = coalesce(description, 'Legacy hero setting. Edit dari page_sections/hero.')
  where key in ('hero_badge', 'hero_title', 'hero_description', 'professional_titles', 'availability_label');
end $$;

do $$
declare
  table_name text;
  constraint_name text;
begin
  foreach table_name in array array[
    'projects', 'articles', 'skills', 'experiences', 'educations',
    'certificates', 'achievements', 'services', 'testimonials'
  ] loop
    if to_regclass('public.' || table_name) is null then
      continue;
    end if;
    constraint_name := table_name || '_status_check';
    execute format('alter table public.%I drop constraint if exists %I', table_name, constraint_name);
    constraint_name := table_name || '_content_status_check';
    if not exists (
      select 1 from pg_constraint where conname = constraint_name
    ) then
      execute format(
        'alter table public.%I add constraint %I check (status in (''draft'', ''published'', ''hidden'', ''archived''))',
        table_name, constraint_name
      );
    end if;
  end loop;
end $$;

notify pgrst, 'reload schema';
