begin;
create table public.portfolio_snapshots (
  version_id uuid primary key references public.portfolio_versions(id) on delete cascade,
  content jsonb not null, created_at timestamptz not null default now()
);
alter table public.portfolio_snapshots enable row level security;
revoke all on public.portfolio_snapshots from anon,authenticated;
create policy snapshot_owner on public.portfolio_snapshots for select to authenticated
  using(exists(select 1 from public.portfolio_versions v where v.id=version_id and v.owner_id=auth.uid()));
grant select on public.portfolio_snapshots to authenticated;

create or replace function public.cms_capture_version() returns trigger
language plpgsql security definer set search_path='' as $$
declare tbl text; chosen jsonb; rows jsonb; contents jsonb:='{}';
begin
  if new.visibility<>'published' then return new; end if;
  foreach tbl in array array['projects','skills','experiences','educations','certificates','articles'] loop
    chosen:=coalesce(to_jsonb(new)->('selected_'||tbl),'[]'::jsonb);
    execute format('select coalesce(jsonb_agg(to_jsonb(t)-array[''created_by'',''updated_by'',''owner_id''] order by s.position),''[]''::jsonb) from jsonb_array_elements_text($1) with ordinality s(id,position) join public.%I t on t.id::text=s.id where t.status=''published'' and (t.published_at is null or t.published_at<=now())',tbl)
      into rows using chosen;
    contents:=contents||jsonb_build_object(tbl,rows);
  end loop;
  select jsonb_build_object('id',p.id,'full_name',p.full_name,'bio',p.bio,'avatar_url',p.avatar_url,'avatar_path',p.avatar_path,'phone',case when new.show_contact then p.phone else null end)
    into rows from public.profiles p where p.id=new.owner_id and p.is_active;
  contents:=contents||jsonb_build_object('_profile',rows);
  select coalesce(jsonb_agg(to_jsonb(s)-array['created_by','updated_by']), '[]'::jsonb) into rows from public.page_sections s where s.is_visible;
  contents:=contents||jsonb_build_object('_sections',rows);
  select coalesce(jsonb_agg(jsonb_build_object('id',s.id,'key',s.key,'value',s.value)), '[]'::jsonb) into rows from public.site_settings s where s.is_public;
  contents:=contents||jsonb_build_object('_settings',rows);
  insert into public.portfolio_snapshots(version_id,content,created_at) values(new.id,contents,clock_timestamp())
    on conflict(version_id) do update set content=excluded.content,created_at=excluded.created_at;
  return new;
end $$;
create trigger prd_capture_version after insert or update on public.portfolio_versions
  for each row when (new.visibility='published') execute function public.cms_capture_version();

create or replace function public.cms_public_version_snapshot(p_id uuid) returns jsonb
language plpgsql stable security definer set search_path='' as $$
declare v public.portfolio_versions; source jsonb; tbl text; rows jsonb; result jsonb:='{}';
begin
  select * into v from public.portfolio_versions where id=p_id and visibility='published' and (expires_at is null or expires_at>now());
  if not found then return null; end if;
  select content into source from public.portfolio_snapshots where version_id=p_id;
  if source is null then return null; end if;
  foreach tbl in array array['projects','skills','experiences','educations','certificates','articles'] loop
    execute format('select coalesce(jsonb_agg(s.item order by s.position),''[]''::jsonb) from jsonb_array_elements($1) with ordinality s(item,position) join public.%I t on t.id::text=s.item->>''id'' where t.status=''published'' and (t.published_at is null or t.published_at<=now())',tbl)
      into rows using source->tbl;
    result:=result||jsonb_build_object(tbl,rows);
  end loop;
  if exists(select 1 from public.profiles p where p.id::text=source->'_profile'->>'id' and p.is_active) then
    result:=result||jsonb_build_object('_profile',source->'_profile');
  end if;
  select coalesce(jsonb_agg(s.item),'[]'::jsonb) into rows from jsonb_array_elements(source->'_sections') s(item)
    join public.page_sections p on p.id::text=s.item->>'id' where p.is_visible;
  result:=result||jsonb_build_object('_sections',rows);
  select coalesce(jsonb_agg(s.item),'[]'::jsonb) into rows from jsonb_array_elements(source->'_settings') s(item)
    join public.site_settings p on p.id::text=s.item->>'id' where p.is_public;
  result:=result||jsonb_build_object('_settings',rows);
  return result;
end $$;
revoke all on function public.cms_public_version_snapshot(uuid) from public;
grant execute on function public.cms_public_version_snapshot(uuid) to anon,authenticated;
notify pgrst,'reload schema';
commit;
