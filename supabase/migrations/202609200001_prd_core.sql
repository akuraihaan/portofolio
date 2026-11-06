-- PRD 1.0: contact contract, private history and recoverable deletion.
-- Additive; never seeds or republishes the owner's existing content.
begin;
create or replace function public.cms_submit_contact(p_name text,p_email text,p_subject text,p_message text,p_submission_id uuid)
returns uuid language plpgsql security definer set search_path='' as $$
declare existing uuid; message_id uuid;
begin
  if p_submission_id is null or p_name is null or p_email is null or p_message is null or p_subject is null
    or length(trim(p_name)) not between 2 and 100 or length(p_email)>254
    or p_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    or length(trim(p_message)) not between 20 and 5000
    or p_subject not in ('Pekerjaan','Kolaborasi','Pertanyaan proyek','Lainnya')
    then raise exception 'Invalid message' using errcode='22023'; end if;
  perform pg_advisory_xact_lock(81923402);
  select id into existing from public.contact_messages where submission_id=p_submission_id;
  if existing is not null then return existing; end if;
  delete from public.contact_submission_limits where submitted_at<now()-interval '1 day';
  if (select count(*) from public.contact_submission_limits where submitted_at>now()-interval '15 minutes')>=100
    or (select count(*) from public.contact_submission_limits where email_hash=md5(lower(trim(p_email))) and submitted_at>now()-interval '15 minutes')>=5 then
    raise exception 'Too many messages. Retry after 15 minutes.' using errcode='P0001';
  end if;
  insert into public.contact_messages(name,email,message,metadata,submission_id)
    values(trim(p_name),lower(trim(p_email)),trim(p_message),jsonb_build_object('subject',p_subject),p_submission_id) returning id into message_id;
  insert into public.contact_submission_limits(email_hash) values(md5(lower(trim(p_email))));
  return message_id;
end $$;

create table if not exists public.content_history (
  id uuid primary key default gen_random_uuid(), target_table text not null,
  target_id uuid not null, payload jsonb not null, action text not null,
  actor_id uuid, created_at timestamptz not null default clock_timestamp()
);
alter table public.content_history enable row level security;
create policy history_owner on public.content_history for select to authenticated using(public.cms_can_manage(target_table));
revoke all on public.content_history from anon,authenticated;
grant select on public.content_history to authenticated;
create index if not exists content_history_item on public.content_history(target_table,target_id,created_at desc);
create table if not exists public.content_trash (
  id uuid primary key default gen_random_uuid(), target_table text not null,
  target_id uuid not null, payload jsonb not null, deleted_by uuid,
  deleted_at timestamptz not null default clock_timestamp(),
  expires_at timestamptz not null default (now()+interval '30 days'), unique(target_table,target_id)
);
alter table public.content_trash enable row level security;
create policy trash_owner on public.content_trash for select to authenticated using(public.cms_can_manage(target_table));
revoke all on public.content_trash from anon,authenticated;
grant select on public.content_trash to authenticated;

create or replace function public.cms_record_history() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  if tg_op='UPDATE' then
    insert into public.content_history(target_table,target_id,payload,action,actor_id)
    values(tg_table_name,old.id,to_jsonb(old),'previous_publication',auth.uid());
  end if;
  insert into public.content_history(target_table,target_id,payload,action,actor_id)
  values(tg_table_name,new.id,to_jsonb(new),case when tg_op='INSERT' then 'created' else 'updated' end,auth.uid());
  return new;
end $$;
do $$ declare tbl text; begin
  foreach tbl in array array['projects','articles','skills','experiences','educations','certificates','achievements','services','testimonials','social_links','page_sections','navigation_items','statistics','playground','portfolio_versions'] loop
    execute format('create trigger prd_content_history after insert or update on public.%I for each row execute function public.cms_record_history()',tbl);
  end loop;
end $$;

create or replace function public.cms_trash_content(p_table text,p_target uuid) returns void
language plpgsql security definer set search_path='' as $$
declare payload jsonb; draft jsonb;
begin
  if not public.cms_can_manage(p_table) or p_table in ('profiles','media_assets') then raise exception 'Not authorized' using errcode='42501'; end if;
  execute format('select to_jsonb(t) from public.%I t where id=$1 for update',p_table) into payload using p_target;
  select r.payload into draft from public.content_revisions r where target_table=p_table and target_id=p_target for update;
  if payload is null and draft is null then raise exception 'Content not found'; end if;
  if p_table='portfolio_versions' and payload is not null and payload->>'owner_id'<>auth.uid()::text then raise exception 'Not authorized' using errcode='42501'; end if;
  insert into public.content_trash(target_table,target_id,payload,deleted_by)
    values(p_table,p_target,coalesce(payload,'{}'::jsonb)||coalesce(draft,'{}'::jsonb),auth.uid())
    on conflict(target_table,target_id) do update set payload=excluded.payload,deleted_at=clock_timestamp(),expires_at=now()+interval '30 days',deleted_by=auth.uid();
  execute format('delete from public.%I where id=$1',p_table) using p_target;
  delete from public.content_revisions where target_table=p_table and target_id=p_target;
end $$;
revoke all on function public.cms_trash_content(text,uuid) from public;
grant execute on function public.cms_trash_content(text,uuid) to authenticated;

create or replace function public.cms_restore_content(p_id uuid,p_trash boolean,p_expected timestamptz default null) returns uuid
language plpgsql security definer set search_path='' as $$
declare tbl text; target uuid; body jsonb; expiry timestamptz; canonical jsonb;
begin
  if p_trash then select target_table,target_id,payload,expires_at into tbl,target,body,expiry from public.content_trash where id=p_id for update;
  else select target_table,target_id,payload into tbl,target,body from public.content_history where id=p_id; end if;
  if tbl is null or not public.cms_can_manage(tbl) or (p_trash and expiry<=now()) then raise exception 'Not authorized or expired' using errcode='42501'; end if;
  execute format('select to_jsonb(t) from public.%I t where id=$1',tbl) into canonical using target;
  perform public.cms_save_revision(tbl,target,body-array['id','created_by','updated_by','created_at','updated_at','owner_id','status','visibility'],p_expected,(canonical->>'updated_at')::timestamptz);
  if p_trash then delete from public.content_trash where id=p_id; end if;
  return target;
end $$;
revoke all on function public.cms_restore_content(uuid,boolean,timestamptz) from public;
grant execute on function public.cms_restore_content(uuid,boolean,timestamptz) to authenticated;

-- Source selection is frozen on explicit publication, not on later source edits.
alter table public.portfolio_versions add column if not exists indexable boolean not null default false;
notify pgrst,'reload schema';
commit;
