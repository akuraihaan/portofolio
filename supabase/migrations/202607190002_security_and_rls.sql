-- Security-definer helpers avoid recursive RLS checks. They never expose
-- passwords or service-role credentials to the browser.

create or replace function public.is_active_user(target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
    select coalesce(
        exists (
            select 1 from public.profiles p
            where p.id = coalesce(target_user_id, auth.uid())
              and p.is_active = true
        ), false
    );
$$;

create or replace function public.has_role(required_role text, target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
    select public.is_active_user(target_user_id)
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
    select public.has_role('super_admin', target_user_id)
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
        );
$$;

create or replace function public.user_permissions(target_user_id uuid default auth.uid())
returns table (permission_key text, module text, action text)
language sql
stable
security definer
set search_path = public, auth
as $$
    select distinct p.key, p.module, p.action
    from public.user_roles ur
    join public.role_permissions rp on rp.role_id = ur.role_id
    join public.permissions p on p.id = rp.permission_id
    where ur.user_id = coalesce(target_user_id, auth.uid())
      and public.is_active_user(target_user_id);
$$;

create or replace function public.is_public_media(file_path text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1 from public.media_assets m
        where m.bucket_id = 'portfolio-public'
          and m.path = file_path
          and m.status = 'published'
    );
$$;

create or replace function public.can_assign_role(target_role_id uuid, target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
    select target_user_id <> auth.uid()
       and (
            public.has_role('super_admin')
            or (
                public.has_permission('users.update')
                and not exists (
                    select 1 from public.roles r
                    where r.id = target_role_id and r.name = 'super_admin'
                )
            )
       );
$$;

create or replace function public.can_remove_user_role(target_user_id uuid, target_role_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
    select target_user_id <> auth.uid()
       and (
            public.has_role('super_admin')
            or public.has_permission('users.update')
       )
       and (
            not exists (
                select 1 from public.roles r
                where r.id = target_role_id and r.name = 'super_admin'
            )
            or (
                public.has_role('super_admin')
                and (select count(*) from public.user_roles ur join public.roles r on r.id = ur.role_id where r.name = 'super_admin') > 1
            )
       );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
    new.updated_at = timezone('utc', now());
    return new;
end;
$$;

create or replace function public.audit_row_change()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
    old_record jsonb;
    new_record jsonb;
    changed_record_id uuid;
begin
    if tg_op = 'INSERT' then
        new_record := to_jsonb(new);
        changed_record_id := (new_record ->> 'id')::uuid;
    elsif tg_op = 'UPDATE' then
        old_record := to_jsonb(old);
        new_record := to_jsonb(new);
        changed_record_id := (new_record ->> 'id')::uuid;
    else
        old_record := to_jsonb(old);
        changed_record_id := (old_record ->> 'id')::uuid;
    end if;

    insert into public.audit_logs (actor_id, action, table_name, record_id, old_data, new_data)
    values (auth.uid(), lower(tg_op), tg_table_name, changed_record_id, old_record, new_record);

    if tg_op = 'DELETE' then
        return old;
    end if;
    return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
    viewer_role_id uuid;
begin
    insert into public.profiles (id, full_name, username, is_active)
    values (
        new.id,
        nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
        nullif(trim(new.raw_user_meta_data ->> 'username'), ''),
        true
    )
    on conflict (id) do nothing;

    select id into viewer_role_id from public.roles where name = 'viewer';
    if viewer_role_id is not null then
        insert into public.user_roles (user_id, role_id, assigned_by)
        values (new.id, viewer_role_id, null)
        on conflict (user_id, role_id) do nothing;
    end if;

    return new;
end;
$$;

create or replace function public.record_login(
    login_success boolean,
    login_email text default null,
    failure_reason_value text default null,
    user_agent_value text default null
)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
    history_id uuid;
begin
    if auth.uid() is null then
        raise exception 'Authentication required';
    end if;

    insert into public.login_history (user_id, email, was_successful, failure_reason, user_agent)
    values (auth.uid(), login_email, login_success, failure_reason_value, user_agent_value)
    returning id into history_id;

    if login_success then
        update public.profiles
        set last_login_at = timezone('utc', now()), updated_at = timezone('utc', now())
        where id = auth.uid();
    end if;

    return history_id;
end;
$$;

create or replace function public.submit_contact_message(
    message_name text,
    message_email text,
    message_body text,
    honeypot text default ''
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
    message_id uuid;
begin
    if coalesce(trim(honeypot), '') <> '' then
        raise exception 'Invalid contact request';
    end if;

    if length(trim(message_name)) not between 2 and 120
       or length(trim(message_email)) not between 5 and 255
       or length(trim(message_body)) not between 10 and 5000
       or trim(message_email) !~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
        raise exception 'Invalid contact data';
    end if;

    if exists (
        select 1 from public.contact_messages
        where lower(email) = lower(trim(message_email))
          and created_at > timezone('utc', now()) - interval '1 minute'
    ) then
        raise exception 'Please wait before sending another message';
    end if;

    insert into public.contact_messages (name, email, message)
    values (trim(message_name), lower(trim(message_email)), trim(message_body))
    returning id into message_id;

    return message_id;
end;
$$;

grant execute on function public.submit_contact_message(text, text, text, text) to anon, authenticated;
grant execute on function public.is_active_user(uuid) to anon, authenticated;
grant execute on function public.has_role(text, uuid) to authenticated;
grant execute on function public.has_permission(text, uuid) to authenticated;
grant execute on function public.user_permissions(uuid) to authenticated;
grant execute on function public.record_login(boolean, text, text, text) to authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

do $$
declare
    table_name text;
begin
    foreach table_name in array array[
        'profiles', 'roles', 'permissions', 'projects', 'articles', 'skills', 'experiences',
        'educations', 'certificates', 'services', 'testimonials', 'contact_messages',
        'social_links', 'site_settings', 'media_assets'
    ] loop
        execute format('drop trigger if exists set_updated_at on public.%I', table_name);
        execute format('create trigger set_updated_at before update on public.%I for each row execute procedure public.set_updated_at()', table_name);
    end loop;
end;
$$;

do $$
declare
    table_name text;
begin
    foreach table_name in array array[
        'profiles', 'roles', 'projects', 'articles', 'skills', 'experiences', 'educations',
        'certificates', 'services', 'testimonials', 'contact_messages', 'social_links',
        'site_settings', 'media_assets'
    ] loop
        execute format('drop trigger if exists audit_changes on public.%I', table_name);
        execute format('create trigger audit_changes after insert or update or delete on public.%I for each row execute procedure public.audit_row_change()', table_name);
    end loop;
end;
$$;

alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.user_roles enable row level security;
alter table public.projects enable row level security;
alter table public.articles enable row level security;
alter table public.skills enable row level security;
alter table public.experiences enable row level security;
alter table public.educations enable row level security;
alter table public.certificates enable row level security;
alter table public.services enable row level security;
alter table public.testimonials enable row level security;
alter table public.contact_messages enable row level security;
alter table public.social_links enable row level security;
alter table public.site_settings enable row level security;
alter table public.media_assets enable row level security;
alter table public.login_history enable row level security;
alter table public.security_events enable row level security;
alter table public.audit_logs enable row level security;

-- Profiles and access-control tables.
drop policy if exists profiles_public_read on public.profiles;
create policy profiles_public_read on public.profiles for select to anon using (is_active = true);
drop policy if exists profiles_authenticated_read on public.profiles;
create policy profiles_authenticated_read on public.profiles for select to authenticated using (id = auth.uid() or public.has_permission('users.view'));
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles for update to authenticated using (id = auth.uid() or public.has_permission('users.update')) with check (id = auth.uid() or public.has_permission('users.update'));

drop policy if exists roles_read on public.roles;
create policy roles_read on public.roles for select to authenticated using (public.has_permission('roles.view') or public.has_permission('roles.manage') or exists (select 1 from public.user_roles ur where ur.user_id = auth.uid() and ur.role_id = roles.id));
drop policy if exists roles_insert on public.roles;
create policy roles_insert on public.roles for insert to authenticated with check (public.has_permission('roles.manage') and (is_system = false or public.has_role('super_admin')));
drop policy if exists roles_update on public.roles;
create policy roles_update on public.roles for update to authenticated using (public.has_permission('roles.manage') and (not is_system or public.has_role('super_admin'))) with check (public.has_permission('roles.manage') and (not is_system or public.has_role('super_admin')));
drop policy if exists roles_delete on public.roles;
create policy roles_delete on public.roles for delete to authenticated using (public.has_role('super_admin') and not is_system);

drop policy if exists permissions_read on public.permissions;
create policy permissions_read on public.permissions for select to authenticated using (public.has_permission('permissions.view') or public.is_active_user());
drop policy if exists permissions_insert on public.permissions;
create policy permissions_insert on public.permissions for insert to authenticated with check (public.has_role('super_admin'));
drop policy if exists permissions_update on public.permissions;
create policy permissions_update on public.permissions for update to authenticated using (public.has_role('super_admin')) with check (public.has_role('super_admin'));
drop policy if exists permissions_delete on public.permissions;
create policy permissions_delete on public.permissions for delete to authenticated using (public.has_role('super_admin'));

drop policy if exists role_permissions_read on public.role_permissions;
create policy role_permissions_read on public.role_permissions for select to authenticated using (public.has_permission('roles.view') or public.has_permission('permissions.view') or exists (select 1 from public.user_roles ur where ur.user_id = auth.uid() and ur.role_id = role_permissions.role_id));
drop policy if exists role_permissions_insert on public.role_permissions;
create policy role_permissions_insert on public.role_permissions for insert to authenticated with check (public.has_permission('roles.manage'));
drop policy if exists role_permissions_delete on public.role_permissions;
create policy role_permissions_delete on public.role_permissions for delete to authenticated using (public.has_permission('roles.manage'));

drop policy if exists user_roles_read on public.user_roles;
create policy user_roles_read on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_permission('users.view') or public.has_permission('roles.view'));
drop policy if exists user_roles_insert on public.user_roles;
create policy user_roles_insert on public.user_roles for insert to authenticated with check (public.can_assign_role(role_id, user_id));
drop policy if exists user_roles_delete on public.user_roles;
create policy user_roles_delete on public.user_roles for delete to authenticated using (public.can_remove_user_role(user_id, role_id));

-- Published public content plus permission-gated authenticated content.
drop policy if exists projects_public_read on public.projects;
create policy projects_public_read on public.projects for select to anon using (status = 'published' and (published_at is null or published_at <= timezone('utc', now())));
drop policy if exists projects_authenticated_read on public.projects;
create policy projects_authenticated_read on public.projects for select to authenticated using (public.has_permission('projects.view') or (status = 'published' and (published_at is null or published_at <= timezone('utc', now()))));
drop policy if exists projects_insert on public.projects;
create policy projects_insert on public.projects for insert to authenticated with check (public.has_permission('projects.create'));
drop policy if exists projects_update on public.projects;
create policy projects_update on public.projects for update to authenticated using (public.has_permission('projects.update')) with check (public.has_permission('projects.update'));
drop policy if exists projects_delete on public.projects;
create policy projects_delete on public.projects for delete to authenticated using (public.has_permission('projects.delete'));

drop policy if exists articles_public_read on public.articles;
create policy articles_public_read on public.articles for select to anon using (status = 'published' and (published_at is null or published_at <= timezone('utc', now())));
drop policy if exists articles_authenticated_read on public.articles;
create policy articles_authenticated_read on public.articles for select to authenticated using (public.has_permission('articles.view') or (status = 'published' and (published_at is null or published_at <= timezone('utc', now()))));
drop policy if exists articles_insert on public.articles;
create policy articles_insert on public.articles for insert to authenticated with check (public.has_permission('articles.create'));
drop policy if exists articles_update on public.articles;
create policy articles_update on public.articles for update to authenticated using (public.has_permission('articles.update')) with check (public.has_permission('articles.update'));
drop policy if exists articles_delete on public.articles;
create policy articles_delete on public.articles for delete to authenticated using (public.has_permission('articles.delete'));

drop policy if exists skills_public_read on public.skills;
create policy skills_public_read on public.skills for select to anon using (status = 'published' and (published_at is null or published_at <= timezone('utc', now())));
drop policy if exists skills_authenticated_read on public.skills;
create policy skills_authenticated_read on public.skills for select to authenticated using (public.has_permission('skills.manage') or (status = 'published' and (published_at is null or published_at <= timezone('utc', now()))));
drop policy if exists skills_insert on public.skills;
create policy skills_insert on public.skills for insert to authenticated with check (public.has_permission('skills.manage'));
drop policy if exists skills_update on public.skills;
create policy skills_update on public.skills for update to authenticated using (public.has_permission('skills.manage')) with check (public.has_permission('skills.manage'));
drop policy if exists skills_delete on public.skills;
create policy skills_delete on public.skills for delete to authenticated using (public.has_permission('skills.manage'));

drop policy if exists experiences_public_read on public.experiences;
create policy experiences_public_read on public.experiences for select to anon using (status = 'published' and (published_at is null or published_at <= timezone('utc', now())));
drop policy if exists experiences_authenticated_read on public.experiences;
create policy experiences_authenticated_read on public.experiences for select to authenticated using (public.has_permission('experiences.manage') or (status = 'published' and (published_at is null or published_at <= timezone('utc', now()))));
drop policy if exists experiences_insert on public.experiences;
create policy experiences_insert on public.experiences for insert to authenticated with check (public.has_permission('experiences.manage'));
drop policy if exists experiences_update on public.experiences;
create policy experiences_update on public.experiences for update to authenticated using (public.has_permission('experiences.manage')) with check (public.has_permission('experiences.manage'));
drop policy if exists experiences_delete on public.experiences;
create policy experiences_delete on public.experiences for delete to authenticated using (public.has_permission('experiences.manage'));

drop policy if exists educations_public_read on public.educations;
create policy educations_public_read on public.educations for select to anon using (status = 'published' and (published_at is null or published_at <= timezone('utc', now())));
drop policy if exists educations_authenticated_read on public.educations;
create policy educations_authenticated_read on public.educations for select to authenticated using (public.has_permission('educations.manage') or (status = 'published' and (published_at is null or published_at <= timezone('utc', now()))));
drop policy if exists educations_insert on public.educations;
create policy educations_insert on public.educations for insert to authenticated with check (public.has_permission('educations.manage'));
drop policy if exists educations_update on public.educations;
create policy educations_update on public.educations for update to authenticated using (public.has_permission('educations.manage')) with check (public.has_permission('educations.manage'));
drop policy if exists educations_delete on public.educations;
create policy educations_delete on public.educations for delete to authenticated using (public.has_permission('educations.manage'));

drop policy if exists certificates_public_read on public.certificates;
create policy certificates_public_read on public.certificates for select to anon using (status = 'published' and (published_at is null or published_at <= timezone('utc', now())));
drop policy if exists certificates_authenticated_read on public.certificates;
create policy certificates_authenticated_read on public.certificates for select to authenticated using (public.has_permission('certificates.manage') or (status = 'published' and (published_at is null or published_at <= timezone('utc', now()))));
drop policy if exists certificates_insert on public.certificates;
create policy certificates_insert on public.certificates for insert to authenticated with check (public.has_permission('certificates.manage'));
drop policy if exists certificates_update on public.certificates;
create policy certificates_update on public.certificates for update to authenticated using (public.has_permission('certificates.manage')) with check (public.has_permission('certificates.manage'));
drop policy if exists certificates_delete on public.certificates;
create policy certificates_delete on public.certificates for delete to authenticated using (public.has_permission('certificates.manage'));

drop policy if exists services_public_read on public.services;
create policy services_public_read on public.services for select to anon using (status = 'published' and (published_at is null or published_at <= timezone('utc', now())));
drop policy if exists services_authenticated_read on public.services;
create policy services_authenticated_read on public.services for select to authenticated using (public.has_permission('services.manage') or (status = 'published' and (published_at is null or published_at <= timezone('utc', now()))));
drop policy if exists services_insert on public.services;
create policy services_insert on public.services for insert to authenticated with check (public.has_permission('services.manage'));
drop policy if exists services_update on public.services;
create policy services_update on public.services for update to authenticated using (public.has_permission('services.manage')) with check (public.has_permission('services.manage'));
drop policy if exists services_delete on public.services;
create policy services_delete on public.services for delete to authenticated using (public.has_permission('services.manage'));

drop policy if exists testimonials_public_read on public.testimonials;
create policy testimonials_public_read on public.testimonials for select to anon using (status = 'published' and (published_at is null or published_at <= timezone('utc', now())));
drop policy if exists testimonials_authenticated_read on public.testimonials;
create policy testimonials_authenticated_read on public.testimonials for select to authenticated using (public.has_permission('testimonials.manage') or (status = 'published' and (published_at is null or published_at <= timezone('utc', now()))));
drop policy if exists testimonials_insert on public.testimonials;
create policy testimonials_insert on public.testimonials for insert to authenticated with check (public.has_permission('testimonials.manage'));
drop policy if exists testimonials_update on public.testimonials;
create policy testimonials_update on public.testimonials for update to authenticated using (public.has_permission('testimonials.manage')) with check (public.has_permission('testimonials.manage'));
drop policy if exists testimonials_delete on public.testimonials;
create policy testimonials_delete on public.testimonials for delete to authenticated using (public.has_permission('testimonials.manage'));

drop policy if exists social_links_public_read on public.social_links;
create policy social_links_public_read on public.social_links for select to anon using (is_active = true);
drop policy if exists social_links_authenticated_read on public.social_links;
create policy social_links_authenticated_read on public.social_links for select to authenticated using (public.has_permission('social_links.manage') or is_active = true);
drop policy if exists social_links_insert on public.social_links;
create policy social_links_insert on public.social_links for insert to authenticated with check (public.has_permission('social_links.manage'));
drop policy if exists social_links_update on public.social_links;
create policy social_links_update on public.social_links for update to authenticated using (public.has_permission('social_links.manage')) with check (public.has_permission('social_links.manage'));
drop policy if exists social_links_delete on public.social_links;
create policy social_links_delete on public.social_links for delete to authenticated using (public.has_permission('social_links.manage'));

drop policy if exists site_settings_public_read on public.site_settings;
create policy site_settings_public_read on public.site_settings for select to anon using (is_public = true);
drop policy if exists site_settings_authenticated_read on public.site_settings;
create policy site_settings_authenticated_read on public.site_settings for select to authenticated using (is_public = true or public.has_permission('settings.view'));
drop policy if exists site_settings_insert on public.site_settings;
create policy site_settings_insert on public.site_settings for insert to authenticated with check (public.has_permission('settings.update'));
drop policy if exists site_settings_update on public.site_settings;
create policy site_settings_update on public.site_settings for update to authenticated using (public.has_permission('settings.update')) with check (public.has_permission('settings.update'));
drop policy if exists site_settings_delete on public.site_settings;
create policy site_settings_delete on public.site_settings for delete to authenticated using (public.has_permission('settings.update'));

drop policy if exists media_assets_public_read on public.media_assets;
create policy media_assets_public_read on public.media_assets for select to anon using (status = 'published');
drop policy if exists media_assets_authenticated_read on public.media_assets;
create policy media_assets_authenticated_read on public.media_assets for select to authenticated using (public.has_permission('media.manage') or status = 'published');
drop policy if exists media_assets_insert on public.media_assets;
create policy media_assets_insert on public.media_assets for insert to authenticated with check (public.has_permission('media.manage') and created_by = auth.uid());
drop policy if exists media_assets_update on public.media_assets;
create policy media_assets_update on public.media_assets for update to authenticated using (public.has_permission('media.manage') and (owner_id = auth.uid() or public.has_role('admin') or public.has_role('super_admin'))) with check (public.has_permission('media.manage'));
drop policy if exists media_assets_delete on public.media_assets;
create policy media_assets_delete on public.media_assets for delete to authenticated using (public.has_permission('media.manage') and (owner_id = auth.uid() or public.has_role('admin') or public.has_role('super_admin')));

drop policy if exists contact_messages_read on public.contact_messages;
create policy contact_messages_read on public.contact_messages for select to authenticated using (public.has_permission('messages.view'));
drop policy if exists contact_messages_update on public.contact_messages;
create policy contact_messages_update on public.contact_messages for update to authenticated using (public.has_permission('messages.update')) with check (public.has_permission('messages.update'));
drop policy if exists contact_messages_delete on public.contact_messages;
create policy contact_messages_delete on public.contact_messages for delete to authenticated using (public.has_permission('messages.delete'));

drop policy if exists login_history_read on public.login_history;
create policy login_history_read on public.login_history for select to authenticated using (user_id = auth.uid() or public.has_permission('login_history.view'));
drop policy if exists security_events_read on public.security_events;
create policy security_events_read on public.security_events for select to authenticated using (user_id = auth.uid() or public.has_permission('security.view'));
drop policy if exists audit_logs_read on public.audit_logs;
create policy audit_logs_read on public.audit_logs for select to authenticated using (public.has_permission('security.view'));

-- Storage remains private; published assets are readable through this policy and
-- the frontend creates short-lived signed URLs for them.
drop policy if exists portfolio_public_media_read on storage.objects;
create policy portfolio_public_media_read on storage.objects for select to anon, authenticated using (bucket_id = 'portfolio-public' and public.is_public_media(name));
drop policy if exists portfolio_media_upload on storage.objects;
create policy portfolio_media_upload on storage.objects for insert to authenticated with check (bucket_id = 'portfolio-public' and public.has_permission('media.manage') and owner_id = auth.uid());
drop policy if exists portfolio_media_update on storage.objects;
create policy portfolio_media_update on storage.objects for update to authenticated using (bucket_id = 'portfolio-public' and public.has_permission('media.manage') and (owner_id = auth.uid() or public.has_role('admin') or public.has_role('super_admin'))) with check (bucket_id = 'portfolio-public' and public.has_permission('media.manage'));
drop policy if exists portfolio_media_delete on storage.objects;
create policy portfolio_media_delete on storage.objects for delete to authenticated using (bucket_id = 'portfolio-public' and public.has_permission('media.manage') and (owner_id = auth.uid() or public.has_role('admin') or public.has_role('super_admin')));

grant usage on schema public to anon, authenticated;
grant select on public.profiles, public.projects, public.articles, public.skills, public.experiences, public.educations, public.certificates, public.services, public.testimonials, public.social_links, public.site_settings, public.media_assets to anon;
grant select on public.profiles, public.roles, public.permissions, public.role_permissions, public.user_roles, public.projects, public.articles, public.skills, public.experiences, public.educations, public.certificates, public.services, public.testimonials, public.social_links, public.site_settings, public.media_assets, public.contact_messages, public.login_history, public.security_events, public.audit_logs to authenticated;
grant insert, update, delete on public.profiles, public.projects, public.articles, public.skills, public.experiences, public.educations, public.certificates, public.services, public.testimonials, public.social_links, public.site_settings, public.media_assets, public.contact_messages to authenticated;
grant insert, update, delete on public.roles, public.permissions, public.role_permissions, public.user_roles to authenticated;
