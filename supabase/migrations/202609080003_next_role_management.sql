begin;
create or replace function public.cms_update_role(p_id bigint,p_name text,p_label text,p_description text,p_permissions bigint[])
returns bigint language plpgsql security definer set search_path='' as $$
declare result_id bigint; existing public.roles; permission_key text;
begin
 if not public.has_permission('roles.manage') then raise exception 'Role management not authorized' using errcode='42501'; end if;
 if p_name !~ '^[a-z][a-z0-9_]{1,63}$' or length(trim(p_label)) not between 1 and 120 then raise exception 'Invalid role' using errcode='22023'; end if;
 select * into existing from public.roles where id=p_id for update;
 if p_id is not null and not found then raise exception 'Role not found'; end if;
 if not public.has_role('super_admin') and (existing.is_system or p_name in ('super_admin','admin','editor','viewer') or exists(select 1 from public.user_roles where user_id=auth.uid() and role_id=p_id)) then raise exception 'System and own roles cannot be changed' using errcode='42501'; end if;
 if existing.is_system and existing.name<>p_name then raise exception 'System role name is immutable'; end if;
 foreach result_id in array coalesce(p_permissions,'{}'::bigint[]) loop
  select key into permission_key from public.permissions where id=result_id;
  if not found or not public.has_permission(permission_key) then raise exception 'Cannot grant a permission you do not hold' using errcode='42501'; end if;
 end loop;
 if p_id is null then insert into public.roles(name,label,description,is_system) values(p_name,p_label,p_description,false) returning id into result_id;
 else update public.roles set name=p_name,label=p_label,description=p_description where id=p_id returning id into result_id; end if;
 delete from public.role_permissions where role_id=result_id;
 insert into public.role_permissions(role_id,permission_id) select result_id,unnest(coalesce(p_permissions,'{}'::bigint[]));
 return result_id;
end $$;
revoke all on function public.cms_update_role(bigint,text,text,text,bigint[]) from public;
grant execute on function public.cms_update_role(bigint,text,text,text,bigint[]) to authenticated;
notify pgrst,'reload schema';
commit;
