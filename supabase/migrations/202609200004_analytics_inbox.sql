begin;
update storage.buckets set file_size_limit=52428800 where id='portfolio-private';
alter table public.contact_messages drop constraint if exists contact_messages_status_check;
alter table public.contact_messages add constraint contact_messages_status_check check(status in ('unread','read','followed_up','archived'));
alter table public.contact_messages add column if not exists internal_notes text;
create table public.portfolio_events (
 id uuid primary key, event_type text not null check(event_type in ('page_view','project_view','contact_click','contact_submit','portfolio_pdf_download','cv_download')),
 path text not null, created_at timestamptz not null default now()
);
alter table public.portfolio_events enable row level security;
create policy events_admin on public.portfolio_events for select to authenticated using(public.has_permission('dashboard.view'));
revoke all on public.portfolio_events from anon,authenticated;
grant select on public.portfolio_events to authenticated;
create index portfolio_events_date on public.portfolio_events(created_at);
create or replace function public.cms_record_event(p_id uuid,p_type text,p_path text) returns void
language plpgsql security definer set search_path='' as $$
begin
 if p_type not in ('page_view','project_view','contact_click','contact_submit','portfolio_pdf_download','cv_download')
 or p_path !~ '^/(en/)?(projects(/[a-z0-9-]+)?|articles(/[a-z0-9-]+)?|playground(/[a-z0-9-]+)?|portfolio/[a-z0-9-]+|privacy)?$'
 or length(p_path)>240 then raise exception 'Invalid event' using errcode='22023'; end if;
 if (select count(*) from public.portfolio_events where created_at>now()-interval '1 minute')>=1000 then return; end if;
 insert into public.portfolio_events(id,event_type,path) values(p_id,p_type,p_path) on conflict do nothing;
 delete from public.portfolio_events where created_at<now()-interval '90 days';
end $$;
revoke all on function public.cms_record_event(uuid,text,text) from public;
grant execute on function public.cms_record_event(uuid,text,text) to anon,authenticated;
notify pgrst,'reload schema';
commit;
