begin;
create table public.translations (
 id uuid primary key default gen_random_uuid(), title text not null, slug text not null unique,
 source_type text not null check(source_type in ('home','projects','articles','playground')),
 project_id uuid references public.projects(id) on delete cascade,
 article_id uuid references public.articles(id) on delete cascade,
 playground_id uuid references public.playground(id) on delete cascade,
 summary text, content text, category text, language text not null default 'en' check(language='en'),
 status text not null default 'draft' check(status in ('draft','published','hidden','archived')),
 source_updated_at timestamptz, sort_order integer not null default 0,
 created_by uuid references auth.users(id), updated_by uuid references auth.users(id),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), published_at timestamptz,
 check((source_type='home' and project_id is null and article_id is null and playground_id is null)
 or (source_type='projects' and project_id is not null and article_id is null and playground_id is null)
 or (source_type='articles' and article_id is not null and project_id is null and playground_id is null)
 or (source_type='playground' and playground_id is not null and project_id is null and article_id is null))
);
create unique index translations_home on public.translations(language) where source_type='home';
create unique index translations_project on public.translations(project_id) where project_id is not null;
create unique index translations_article on public.translations(article_id) where article_id is not null;
create unique index translations_playground on public.translations(playground_id) where playground_id is not null;
alter table public.translations enable row level security;
create policy translations_public on public.translations for select to anon,authenticated using(status='published' and (published_at is null or published_at<=now()) and (
 source_type='home' or exists(select 1 from public.projects p where p.id=project_id and p.status='published' and (p.published_at is null or p.published_at<=now()))
 or exists(select 1 from public.articles a where a.id=article_id and a.status='published' and (a.published_at is null or a.published_at<=now()))
 or exists(select 1 from public.playground p where p.id=playground_id and p.status='published' and (p.published_at is null or p.published_at<=now()))));
create policy translations_admin on public.translations for all to authenticated using(public.has_permission('settings.update')) with check(public.has_permission('settings.update'));
grant select on public.translations to anon,authenticated;
grant insert,update,delete on public.translations to authenticated;
create or replace function public.cms_can_manage(target_table text) returns boolean
language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and public.has_permission(case target_table
    when 'translations' then 'settings.update' when 'projects' then 'projects.create' when 'project_media' then 'projects.create' when 'playground' then 'projects.create'
    when 'articles' then 'articles.create' when 'skills' then 'skills.manage'
    when 'experiences' then 'experiences.manage' when 'educations' then 'educations.manage'
    when 'certificates' then 'certificates.manage' when 'achievements' then 'achievements.manage'
    when 'services' then 'services.manage' when 'testimonials' then 'testimonials.manage'
    when 'social_links' then 'social_links.manage' when 'profiles' then 'users.update'
    when 'site_settings' then 'settings.update' when 'page_sections' then 'settings.update'
    when 'navigation_items' then 'settings.update' when 'statistics' then 'settings.update'
    when 'portfolio_versions' then 'settings.update' else 'cms.invalid' end)
$$;
revoke all on function public.cms_can_manage(text) from public;
grant execute on function public.cms_can_manage(text) to authenticated;
create trigger prd_translation_history after insert or update on public.translations for each row execute function public.cms_record_history();
notify pgrst,'reload schema';
commit;
