-- Next.js CMS: same canonical tables, private revisions, atomic publication.
-- Requires the existing content/Storage migrations. No content or identity seeds.
begin;
alter table public.media_assets add column if not exists verified_at timestamptz;
create table if not exists public.playground (
  id uuid primary key default gen_random_uuid(), title text not null, slug text not null unique,
  category text, description text, image_url text, image_path text, video_url text, link_url text,
  technologies jsonb not null default '[]', status text not null default 'draft'
    check(status in ('draft','published','hidden','archived')),
  sort_order integer not null default 0, is_featured boolean not null default false,
  created_by uuid references auth.users(id), updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), published_at timestamptz
);
alter table public.playground enable row level security;
drop policy if exists playground_public on public.playground;
create policy playground_public on public.playground for select to anon,authenticated
  using(status='published' and (published_at is null or published_at<=now()));
drop policy if exists playground_admin on public.playground;
create policy playground_admin on public.playground for all to authenticated
  using(public.has_permission('projects.create')) with check(public.has_permission('projects.create'));
grant select on public.playground to anon,authenticated;
grant insert,update,delete on public.playground to authenticated;

create or replace function public.cms_can_manage(target_table text) returns boolean
language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and public.has_permission(case target_table
    when 'projects' then 'projects.create' when 'project_media' then 'projects.create' when 'playground' then 'projects.create'
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

create table if not exists public.content_revisions (
  id uuid primary key default gen_random_uuid(), target_table text not null, target_id uuid not null,
  payload jsonb not null check(jsonb_typeof(payload)='object'), owner_id uuid not null references auth.users(id),
  base_updated_at timestamptz, updated_at timestamptz not null default now(), unique(target_table,target_id)
);
alter table public.content_revisions enable row level security;
drop policy if exists revisions_manage on public.content_revisions;
create policy revisions_manage on public.content_revisions for all to authenticated
  using(public.cms_can_manage(target_table)) with check(public.cms_can_manage(target_table) and owner_id=auth.uid());
revoke all on public.content_revisions from anon;
grant select,insert,update,delete on public.content_revisions to authenticated;

create or replace function public.cms_save_revision(p_table text,p_target uuid,p_payload jsonb,p_expected timestamptz,p_base timestamptz)
returns table(id uuid,updated_at timestamptz)
language plpgsql security definer set search_path='' as $$
declare prior public.content_revisions; canonical jsonb; result_id uuid; stamp timestamptz:=clock_timestamp();
begin
 if not public.cms_can_manage(p_table) or jsonb_typeof(p_payload)<>'object' then raise exception 'Draft not authorized' using errcode='42501'; end if;
 perform pg_advisory_xact_lock(hashtext(p_table||p_target::text));
 select * into prior from public.content_revisions r where r.target_table=p_table and r.target_id=p_target for update;
 if prior.updated_at is distinct from p_expected then raise exception 'Draft changed elsewhere. Reload before saving.' using errcode='40001'; end if;
 execute format('select to_jsonb(t) from public.%I t where id=$1',p_table) into canonical using p_target;
 if p_table='portfolio_versions' and canonical is not null and canonical->>'owner_id'<>auth.uid()::text then raise exception 'Version belongs to another owner' using errcode='42501'; end if;
 if prior.id is null and canonical is not null and (canonical->>'updated_at')::timestamptz is distinct from p_base then raise exception 'Published content changed. Reload before saving.' using errcode='40001'; end if;
 insert into public.content_revisions as r(target_table,target_id,payload,owner_id,base_updated_at,updated_at)
 values(p_table,p_target,p_payload,auth.uid(),coalesce(prior.base_updated_at,p_base),stamp)
 on conflict(target_table,target_id) do update set payload=excluded.payload,updated_at=excluded.updated_at
 returning r.id into result_id;
 return query select result_id,stamp;
end $$;
revoke all on function public.cms_save_revision(text,uuid,jsonb,timestamptz,timestamptz) from public;
grant execute on function public.cms_save_revision(text,uuid,jsonb,timestamptz,timestamptz) to authenticated;

create table if not exists public.slug_redirects (
  module text not null check(module in ('projects','articles','playground','portfolio_versions')),
  old_slug text not null, target_id uuid not null, created_at timestamptz not null default now(), primary key(module,old_slug)
);
alter table public.slug_redirects enable row level security;
drop policy if exists redirects_read on public.slug_redirects;
create policy redirects_read on public.slug_redirects for select to anon,authenticated using(true);
grant select on public.slug_redirects to anon,authenticated;

create or replace function public.cms_publish_revision(revision_id uuid) returns uuid
language plpgsql security definer set search_path = '' as $$
declare r public.content_revisions; previous jsonb; clean jsonb; column_names text; selected_names text;
  updates text; allowed_column text; target_exists boolean; published_field text; prior_slug text;
begin
  select * into r from public.content_revisions where id=revision_id for update;
  if not found or not public.cms_can_manage(r.target_table) then raise exception 'Publication not authorized' using errcode='42501'; end if;
  execute format('select to_jsonb(t) from public.%I t where id=$1 for update',r.target_table) into previous using r.target_id;
  target_exists := previous is not null;
  if r.target_table in ('projects','articles') and target_exists and not public.has_permission(r.target_table||'.update') then
    raise exception 'Update not authorized' using errcode='42501';
  end if;
  if r.target_table='portfolio_versions' and target_exists and previous->>'owner_id'<>auth.uid()::text then
    raise exception 'Version belongs to another owner' using errcode='42501';
  end if;
  if target_exists and r.base_updated_at is not null and (previous->>'updated_at')::timestamptz is distinct from r.base_updated_at then
    raise exception 'Content changed since this draft was opened. Reload before publishing.' using errcode='40001';
  end if;
  clean := r.payload - array['id','owner_id','created_by','created_at','updated_by','updated_at','status','visibility'];
  clean := clean || jsonb_build_object('id',r.target_id);
  if r.target_table='portfolio_versions' and not target_exists then clean:=clean||jsonb_build_object('owner_id',auth.uid()); end if;
  published_field := case r.target_table when 'profiles' then 'is_active' when 'page_sections' then 'is_visible'
    when 'navigation_items' then 'is_visible' when 'statistics' then 'is_visible' when 'social_links' then 'is_active'
    when 'portfolio_versions' then 'visibility' when 'site_settings' then 'is_public' when 'project_media' then null else 'status' end;
  if published_field in ('status','visibility') then clean:=clean||jsonb_build_object(published_field,'published');
  elsif published_field='is_public' then
    clean:=clean||jsonb_build_object('is_public',coalesce((clean->>'is_public')::boolean,(previous->>'is_public')::boolean,false));
    if clean->>'key' in ('appearance_draft') then clean:=clean||'{"is_public":false}'::jsonb; end if;
  elsif published_field is not null then clean:=clean||jsonb_build_object(published_field,true); end if;
  for allowed_column in select a.attname from pg_attribute a where a.attrelid=format('public.%I',r.target_table)::regclass and a.attnum>0 and not a.attisdropped loop
    if allowed_column='updated_at' then clean:=clean||jsonb_build_object(allowed_column,now()); end if;
    if allowed_column='updated_by' then clean:=clean||jsonb_build_object(allowed_column,auth.uid()); end if;
    if allowed_column='created_by' and not target_exists then clean:=clean||jsonb_build_object(allowed_column,auth.uid()); end if;
    if allowed_column='published_at' then clean:=clean||jsonb_build_object(allowed_column,coalesce(previous->>'published_at',now()::text)); end if;
  end loop;
  if clean ? 'slug' and r.target_table in ('projects','articles','playground','portfolio_versions') then
    if clean->>'slug' !~ '^[a-z0-9]+(-[a-z0-9]+)*$' then raise exception 'Invalid slug' using errcode='22023'; end if;
    if exists(select 1 from public.slug_redirects where module=r.target_table and old_slug=clean->>'slug' and target_id<>r.target_id) then
      raise exception 'Slug is reserved by a previous publication' using errcode='23505';
    end if;
  end if;
  -- Column names come from pg_catalog, values are parameterized, ownership is excluded.
  select string_agg(format('%I',a.attname),','),string_agg(format('x.%I',a.attname),','),
    string_agg(format('%I=x.%I',a.attname,a.attname),',') filter(where a.attname<>'id')
    into column_names,selected_names,updates
  from pg_attribute a where a.attrelid=format('public.%I',r.target_table)::regclass and a.attnum>0 and not a.attisdropped and clean ? a.attname;
  if target_exists then
    execute format('update public.%I t set %s from jsonb_populate_record(null::public.%I,$1) x where t.id=$2',r.target_table,updates,r.target_table) using clean,r.target_id;
  else
    execute format('insert into public.%I (%s) select %s from jsonb_populate_record(null::public.%I,$1) x',r.target_table,column_names,selected_names,r.target_table) using clean;
  end if;
  prior_slug:=previous->>'slug';
  if prior_slug is not null and clean->>'slug' is distinct from prior_slug and r.target_table in ('projects','articles','playground','portfolio_versions') then
    insert into public.slug_redirects(module,old_slug,target_id) values(r.target_table,prior_slug,r.target_id)
      on conflict(module,old_slug) do update set target_id=excluded.target_id;
  end if;
  delete from public.content_revisions where id=r.id;
  return r.target_id;
end $$;
revoke all on function public.cms_publish_revision(uuid) from public;
grant execute on function public.cms_publish_revision(uuid) to authenticated;

create or replace function public.cms_immutable_owner() returns trigger language plpgsql set search_path='' as $$
begin
  if auth.uid() is not null and ((to_jsonb(old)->>'id') is distinct from (to_jsonb(new)->>'id')
    or (to_jsonb(old)->>'created_by') is distinct from (to_jsonb(new)->>'created_by')
    or (to_jsonb(old)->>'owner_id') is distinct from (to_jsonb(new)->>'owner_id')) then
    raise exception 'Content ownership cannot be reassigned' using errcode='42501';
  end if; return new;
end $$;
do $$ declare tbl text; begin
  foreach tbl in array array['profiles','projects','articles','skills','experiences','educations','certificates','achievements','services','testimonials','social_links','page_sections','navigation_items','statistics','playground','portfolio_versions','media_assets'] loop
    execute format('drop trigger if exists cms_immutable_owner on public.%I',tbl);
    execute format('create trigger cms_immutable_owner before update on public.%I for each row execute function public.cms_immutable_owner()',tbl);
  end loop;
end $$;

-- Public profile queries cannot request login telemetry or future private columns.
revoke select on public.profiles from anon;
grant select(id,full_name,username,bio,avatar_url,avatar_path,phone,is_active,updated_at) on public.profiles to anon;

-- Draft uploads use a private bucket. Publication can reference the private path;
-- the media endpoint serves it only while a canonical public row references it.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('portfolio-private','portfolio-private',false,26214400,array['image/jpeg','image/png','image/webp','application/pdf','video/mp4','video/webm'])
on conflict(id) do nothing;
drop policy if exists cms_private_upload on storage.objects;
create policy cms_private_upload on storage.objects for insert to authenticated
  with check(bucket_id='portfolio-private' and public.has_permission('media.manage') and (storage.foldername(name))[1]=auth.uid()::text);
drop policy if exists cms_private_read on storage.objects;
create policy cms_private_read on storage.objects for select to authenticated
  using(bucket_id='portfolio-private' and public.has_permission('media.manage'));

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
  return exists(select 1 from public.project_media m join public.projects p on p.id=m.project_id
    where p.status='published' and (p.published_at is null or p.published_at<=now()) and m.media_url like needle);
end $$;
revoke all on function public.cms_media_is_public(uuid) from public;
grant execute on function public.cms_media_is_public(uuid) to anon,authenticated;
create or replace function public.cms_public_asset(asset_id uuid)
returns table(id uuid,bucket_id text,path text,file_name text,mime_type text)
language sql stable security definer set search_path='' as $$
  select a.id,a.bucket_id,a.path,a.file_name,a.mime_type from public.media_assets a
  where a.id=asset_id and (a.bucket_id<>'portfolio-private' or a.verified_at is not null)
  and (public.cms_media_is_public(a.id) or public.has_permission('media.manage'))
$$;
revoke all on function public.cms_public_asset(uuid) from public;
grant execute on function public.cms_public_asset(uuid) to anon,authenticated;
create or replace function public.cms_storage_is_public(object_name text) returns boolean
language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.media_assets a where a.bucket_id='portfolio-private' and a.verified_at is not null and a.path=object_name and public.cms_media_is_public(a.id))
$$;
revoke all on function public.cms_storage_is_public(text) from public;
grant execute on function public.cms_storage_is_public(text) to anon,authenticated;
drop policy if exists cms_published_private_media on storage.objects;
create policy cms_published_private_media on storage.objects for select to anon,authenticated
  using(bucket_id='portfolio-private' and public.cms_storage_is_public(name));

alter table public.contact_messages add column if not exists submission_id uuid unique;
create table if not exists public.contact_submission_limits(email_hash text not null,submitted_at timestamptz not null default now());
create index if not exists contact_limits_time on public.contact_submission_limits(submitted_at);
alter table public.contact_submission_limits enable row level security;
revoke all on public.contact_submission_limits from anon,authenticated;
create or replace function public.cms_submit_contact(p_name text,p_email text,p_subject text,p_message text,p_submission_id uuid)
returns uuid language plpgsql security definer set search_path='' as $$
declare existing uuid; message_id uuid;
begin
  if length(trim(p_name)) not between 2 and 120 or length(p_email)>254 or p_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    or length(trim(p_message)) not between 10 and 5000 or length(p_subject)>180 then raise exception 'Invalid message' using errcode='22023'; end if;
  perform pg_advisory_xact_lock(81923402);
  select id into existing from public.contact_messages where submission_id=p_submission_id;
  if existing is not null then return existing; end if;
  delete from public.contact_submission_limits where submitted_at<now()-interval '1 day';
  if (select count(*) from public.contact_submission_limits where submitted_at>now()-interval '1 hour')>=50
    or (select count(*) from public.contact_submission_limits where email_hash=md5(lower(trim(p_email))) and submitted_at>now()-interval '1 hour')>=3 then
    raise exception 'Too many messages. Please try again later.' using errcode='P0001';
  end if;
  insert into public.contact_messages(name,email,message,metadata,submission_id)
    values(trim(p_name),lower(trim(p_email)),trim(p_message),jsonb_build_object('subject',p_subject),p_submission_id) returning id into message_id;
  insert into public.contact_submission_limits(email_hash) values(md5(lower(trim(p_email))));
  return message_id;
end $$;
revoke all on function public.cms_submit_contact(text,text,text,text,uuid) from public;
grant execute on function public.cms_submit_contact(text,text,text,text,uuid) to anon,authenticated;
revoke insert on public.contact_messages from anon,authenticated;
-- Remove legacy anonymous RPC bypasses to the new validation/rate limit.
do $$ declare r record; begin
  for r in select oid::regprocedure as signature from pg_proc where pronamespace='public'::regnamespace and proname='submit_contact_message' loop
    execute format('revoke execute on function %s from public, anon, authenticated',r.signature);
  end loop;
end $$;
notify pgrst,'reload schema';
commit;
