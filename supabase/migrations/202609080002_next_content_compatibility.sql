-- Compatibility only: do not rerun historical hero backfills that fill blanks.
begin;
do $$ declare tbl text; begin
 foreach tbl in array array['projects','articles','skills','experiences','educations','certificates','achievements','services','testimonials'] loop
  execute format('alter table public.%I drop constraint if exists %I',tbl,tbl||'_status_check');
  execute format('alter table public.%I drop constraint if exists %I',tbl,tbl||'_content_status_check');
  execute format('alter table public.%I add constraint %I check(status in (''draft'',''published'',''hidden'',''archived''))',tbl,tbl||'_content_status_check');
  execute format('drop policy if exists %I on public.%I',tbl||'_public_read',tbl);
  execute format('create policy %I on public.%I for select to anon using(status=''published'' and (published_at is null or published_at<=now()))',tbl||'_public_read',tbl);
 end loop;
end $$;
-- Transfer legacy hero only if the canonical row is absent. An existing blank
-- or hidden hero is intentional and is never overwritten or re-enabled.
insert into public.page_sections(section_key,section_name,title,description,badge_text,is_visible,sort_order,custom_data)
select 'hero','Hero',
 (select value #>> '{}' from public.site_settings where key='hero_title'),
 (select value #>> '{}' from public.site_settings where key='hero_description'),
 (select value #>> '{}' from public.site_settings where key='hero_badge'),true,1,
 jsonb_build_object('roles',coalesce((select value from public.site_settings where key='professional_titles'),'[]'::jsonb),
 'availability_status',coalesce((select value #>> '{}' from public.site_settings where key='availability_label'),''))
where not exists(select 1 from public.page_sections where section_key='hero')
and exists(select 1 from public.site_settings where key='hero_title' and value #>> '{}' is not null);
notify pgrst,'reload schema';
commit;
