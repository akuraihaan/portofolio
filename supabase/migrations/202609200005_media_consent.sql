begin;
create or replace function public.cms_media_is_public(asset_id uuid) returns boolean
language plpgsql stable security definer set search_path='' as $$
declare tbl text; found_reference boolean; condition text; needle text;
begin
  needle:='%/api/media/'||asset_id::text||'%';
  foreach tbl in array array['projects','articles','skills','experiences','educations','certificates','achievements','services','testimonials','playground','profiles','site_settings','page_sections'] loop
    condition:=case tbl when 'profiles' then 'is_active=true' when 'site_settings' then 'is_public=true'
      when 'page_sections' then 'is_visible=true' else 'status=''published'' and (published_at is null or published_at<=now())' end;
    execute format('select exists(select 1 from public.%I t where %s and to_jsonb(t)::text like $1)',tbl,condition) into found_reference using needle;
    if found_reference then return true; end if;
  end loop;
  if exists(select 1 from public.portfolio_versions v where v.visibility='published' and
    (v.expires_at is null or v.expires_at>now()) and public.cms_public_version_snapshot(v.id)::text like needle) then return true; end if;
  return exists(select 1 from public.project_media m join public.projects p on p.id=m.project_id
    where p.status='published' and (p.published_at is null or p.published_at<=now()) and m.media_url like needle);
end $$;

create or replace function public.cms_prevent_used_media_delete() returns trigger
language plpgsql security definer set search_path='' as $$
declare needle text;
begin
 needle:='%/api/media/'||old.id::text||'%';
 if public.cms_media_is_public(old.id)
 or exists(select 1 from public.content_revisions r where r.payload::text like needle)
 or exists(select 1 from public.content_history r where r.payload::text like needle)
 or exists(select 1 from public.content_trash r where r.expires_at>now() and r.payload::text like needle)
 then raise exception 'Media is still referenced by content, a revision, or a portfolio version' using errcode='23503'; end if;
 return old;
end $$;
create trigger prd_media_in_use before delete on public.media_assets for each row execute function public.cms_prevent_used_media_delete();

alter table public.testimonials add column if not exists publication_consent boolean not null default false;
create policy testimonials_consent on public.testimonials as restrictive for select to anon,authenticated
using(publication_consent or public.has_permission('testimonials.manage'));
notify pgrst,'reload schema';
commit;
