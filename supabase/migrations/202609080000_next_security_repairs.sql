-- Additive repair. No existing identity, role assignment or content is changed.
begin;
create or replace function public.audit_row_change() returns trigger
language plpgsql security definer set search_path='' as $$
declare old_record jsonb; new_record jsonb; raw_id text; changed_record_id uuid;
begin
 if tg_op<>'INSERT' then old_record:=to_jsonb(old); end if;
 if tg_op<>'DELETE' then new_record:=to_jsonb(new); end if;
 raw_id:=coalesce(new_record->>'id',old_record->>'id');
 if raw_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then changed_record_id:=raw_id::uuid; end if;
 insert into public.audit_logs(actor_id,action,table_name,record_id,old_data,new_data)
 values(auth.uid(),lower(tg_op),tg_table_name,changed_record_id,old_record,new_record);
 if tg_op='DELETE' then return old; end if; return new;
end $$;
-- Signup cannot grant administrator roles through email or user metadata.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 insert into public.profiles(id,full_name,avatar_url,is_active)
 values(new.id,new.raw_user_meta_data->>'full_name',new.raw_user_meta_data->>'avatar_url',true)
 on conflict(id) do nothing;
 insert into public.user_roles(user_id,role_id)
 select new.id,id from public.roles where name='viewer' on conflict do nothing;
 return new;
end $$;
create or replace function public.cms_guard_privileges() returns trigger
language plpgsql security definer set search_path='' as $$
declare role_key bigint;
begin
 if auth.uid() is null then if tg_op='DELETE' then return old; else return new; end if; end if;
 if tg_table_name='profiles' then
   if new.is_active is distinct from old.is_active and not public.has_permission('users.update') then
     raise exception 'Account activation requires an administrator' using errcode='42501';
   end if;
 elsif tg_table_name='role_permissions' then
   role_key:=case when tg_op='DELETE' then old.role_id else new.role_id end;
   if not public.has_role('super_admin') and exists(select 1 from public.user_roles where user_id=auth.uid() and role_id=role_key) then
     raise exception 'Cannot change permissions of your own role' using errcode='42501';
   end if;
 elsif tg_table_name='roles' and tg_op='UPDATE' and new.name is distinct from old.name and (old.is_system or new.name='super_admin') then
   raise exception 'System role names cannot be reassigned' using errcode='42501';
 end if;
 if tg_op='DELETE' then return old; end if; return new;
end $$;
drop trigger if exists cms_profile_privileges on public.profiles;
create trigger cms_profile_privileges before update on public.profiles for each row execute function public.cms_guard_privileges();
drop trigger if exists cms_role_privileges on public.role_permissions;
create trigger cms_role_privileges before insert or update or delete on public.role_permissions for each row execute function public.cms_guard_privileges();
drop trigger if exists cms_role_names on public.roles;
create trigger cms_role_names before update on public.roles for each row execute function public.cms_guard_privileges();
commit;
