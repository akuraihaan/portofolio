begin;
-- Once a verified factor exists, AAL1 tokens lose admin permissions at the DB
-- boundary as well as in the Next.js UI. Unenrolled owners can still enroll.
create or replace function public.cms_mfa_satisfied() returns boolean
language sql stable security definer set search_path='' as $$
 select coalesce(auth.jwt()->>'aal','aal1')='aal2'
 or not exists(select 1 from auth.mfa_factors f where f.user_id=auth.uid() and f.status='verified')
$$;
revoke all on function public.cms_mfa_satisfied() from public;
grant execute on function public.cms_mfa_satisfied() to anon,authenticated;
create or replace function public.has_role(required_role text, target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
    select public.cms_mfa_satisfied() and public.is_active_user(target_user_id)
       and exists (
            select 1
            from public.user_roles ur
            join public.roles r on r.id = ur.role_id
            where ur.user_id = coalesce(target_user_id, auth.uid())
              and r.name = required_role
       );
$$;

create or replace function public.has_permission(required_permission text, target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
    select public.cms_mfa_satisfied() and (public.has_role('super_admin', target_user_id)
        or (
            public.is_active_user(target_user_id)
            and exists (
                select 1
                from public.user_roles ur
                join public.role_permissions rp on rp.role_id = ur.role_id
                join public.permissions p on p.id = rp.permission_id
                where ur.user_id = coalesce(target_user_id, auth.uid())
                  and p.key = required_permission
            )
        ));
$$;


-- Audit metadata describes an action; it must not duplicate inbox messages or secrets.
create or replace function public.audit_row_change() returns trigger
language plpgsql security definer set search_path='' as $$
declare row_id text; record_id uuid;
begin
 row_id:=case when tg_op='DELETE' then to_jsonb(old)->>'id' else to_jsonb(new)->>'id' end;
 if row_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then record_id:=row_id::uuid; end if;
 insert into public.audit_logs(actor_id,action,table_name,record_id,old_data,new_data)
 values(auth.uid(),lower(tg_op),tg_table_name,record_id,null,null);
 if tg_op='DELETE' then return old; end if; return new;
end $$;
notify pgrst,'reload schema';
commit;
