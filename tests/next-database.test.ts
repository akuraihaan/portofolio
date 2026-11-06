import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
test("isolated PostgreSQL: atomic publication, RLS, media visibility, ownership, contact idempotency", async () => {
  const db = new PGlite();
  try {
    await db.exec(`set timezone='UTC'; create role anon; create role authenticated; create role service_role;
 create schema auth; create schema storage;
 create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb default '{}',raw_app_meta_data jsonb default '{}',created_at timestamptz default now(),last_sign_in_at timestamptz);
 create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
 create function auth.role() returns text language sql stable as $$ select current_user::text $$;
 create table auth.mfa_factors(id uuid primary key default gen_random_uuid(),user_id uuid,status text);
 create function auth.jwt() returns jsonb language sql stable as $$ select jsonb_build_object('aal',coalesce(nullif(current_setting('request.jwt.claim.aal',true),''),'aal1')) $$;
 create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
 create table storage.objects(id uuid default gen_random_uuid(),bucket_id text,name text,owner_id uuid,owner uuid);
 alter table storage.objects enable row level security;
 create function storage.foldername(text) returns text[] language sql as $$ select string_to_array($1,'/') $$;
 grant usage on schema auth,storage,public to anon,authenticated; grant select,insert,update,delete on storage.objects to anon,authenticated;
 `);
    const files = [
      "202607190001_initial_schema.sql",
      "202607190002_security_and_rls.sql",
      "202609080000_next_security_repairs.sql",
      "202607190003_seed_roles_permissions.sql",
      "202607200008_create_dynamic_content_schema.sql",
      "202607200009_repair_admin_authorization.sql",
      "202607210001_storage_uploads_and_image_paths.sql",
      "202607210002_sync_dynamic_media_schema.sql",
      "202607210003_dynamic_site_sections.sql",
      "202609030001_portfolio_versions.sql",
      "202609040001_admin_content_expansion.sql",
      "202609080001_next_cms_revisions.sql",
      "202609080002_next_content_compatibility.sql",
      "202609080003_next_role_management.sql",
      "202609200001_prd_core.sql",
      "202609200002_version_snapshots.sql",
      "202609200003_translations.sql",
      "202609200004_analytics_inbox.sql",
      "202609200005_media_consent.sql",
      "202609200006_mfa_audit.sql",
    ];
    for (const file of files) {
      let sql = await readFile(
        new URL("../supabase/migrations/" + file, import.meta.url),
        "utf8",
      );
      sql = sql.replace(/create extension if not exists pgcrypto;/gi, "");
      try {
        await db.exec(sql);
      } catch (e) {
        throw new Error("Migration " + file + ": " + (e as Error).message);
      }
    }
    const admin = "11111111-1111-4111-8111-111111111111",
      ordinary = "22222222-2222-4222-8222-222222222222",
      project = "33333333-3333-4333-8333-333333333333",
      revision = "44444444-4444-4444-8444-444444444444",
      asset = "55555555-5555-4555-8555-555555555555";
    await db.exec(
      `insert into auth.users(id,email) values('${admin}','admin@example.test'),('${ordinary}','reader@example.test'); insert into public.user_roles(user_id,role_id) select '${admin}',id from public.roles where name='super_admin' on conflict do nothing; insert into public.projects(id,title,slug,status,created_by) values('${project}','Original','original','published','${admin}'); insert into public.media_assets(id,owner_id,bucket_id,path,file_name,mime_type,created_by,verified_at) values('${asset}','${admin}','portfolio-private','${admin}/test.png','test.png','image/png','${admin}',now());`,
    );
    const role = async (name: string, id = "") =>
      db.exec(
        `reset role; select set_config('request.jwt.claim.sub','${id}',false); set role ${name}`,
      );
    await role("authenticated", admin);
    await db.exec(
      `insert into public.content_revisions(id,target_table,target_id,payload,owner_id,base_updated_at) select '${revision}','projects',id,'{"title":"Revised","slug":"revised","cover_url":"/api/media/${asset}"}','${admin}',updated_at from public.projects where id='${project}'`,
    );
    await role("anon");
    assert.equal(
      (
        await db.query<{ title: string }>(
          `select title from public.projects where id='${project}'`,
        )
      ).rows[0].title,
      "Original",
    );
    await assert.rejects(db.query("select * from public.content_revisions"));
    assert.equal(
      (await db.query(`select * from public.cms_public_asset('${asset}')`)).rows
        .length,
      0,
    );
    await role("authenticated", ordinary);
    await assert.rejects(
      db.query(`select public.cms_publish_revision('${revision}')`),
    );
    await assert.rejects(
      db.query(
        `insert into public.user_roles(user_id,role_id) select '${ordinary}',id from public.roles where name='super_admin'`,
      ),
    );
    await role("authenticated", admin);
    await db.query(`select public.cms_publish_revision('${revision}')`);
    await assert.rejects(
      db.query(
        `update public.projects set created_by='${ordinary}' where id='${project}'`,
      ),
    );
    await role("anon");
    assert.equal(
      (
        await db.query<{ title: string }>(
          `select title from public.projects where id='${project}'`,
        )
      ).rows[0].title,
      "Revised",
    );
    assert.equal(
      (await db.query(`select * from public.cms_public_asset('${asset}')`)).rows
        .length,
      1,
    );
    assert.equal(
      (
        await db.query(
          `select * from public.slug_redirects where old_slug='original'`,
        )
      ).rows.length,
      1,
    );
    await assert.rejects(db.query("select last_login_at from public.profiles"));
    await role("authenticated", admin);
    await db.query(
      `update public.projects set status='hidden' where id='${project}'`,
    );
    await role("anon");
    assert.equal(
      (await db.query(`select * from public.projects where id='${project}'`))
        .rows.length,
      0,
    );
    assert.equal(
      (await db.query(`select * from public.cms_public_asset('${asset}')`)).rows
        .length,
      0,
    );
    await role("authenticated", admin);
    const stamp = (
      await db.query<{ updated_at: string }>(
        `select updated_at::text as updated_at from public.projects where id='${project}'`,
      )
    ).rows[0].updated_at;
    const draft = await db.query<{ id: string; updated_at: string }>(
      "select id,updated_at::text as updated_at from public.cms_save_revision($1,$2,$3,$4,$5)",
      [
        "projects",
        project,
        { title: "Next revision", slug: "revised" },
        null,
        stamp,
      ],
    );
    await assert.rejects(
      db.query("select * from public.cms_save_revision($1,$2,$3,$4,$5)", [
        "projects",
        project,
        { title: "Stale overwrite" },
        null,
        stamp,
      ]),
    );
    await db.query("select * from public.cms_save_revision($1,$2,$3,$4,$5)", [
      "projects",
      project,
      { title: "Updated revision", slug: "revised" },
      draft.rows[0].updated_at,
      stamp,
    ]);
    await db.query(
      `select public.cms_update_role(null,'isolated_custom','Isolated custom','Test only','{}'::bigint[])`,
    );
    await role("authenticated", ordinary);
    await assert.rejects(
      db.query(
        `select public.cms_update_role(null,'rogue','Rogue','Test only','{}'::bigint[])`,
      ),
    );
    await assert.rejects(
      db.query(
        `update public.profiles set is_active=false where id='${ordinary}'`,
      ),
    );
    await role("authenticated", admin);
    const snapshotVersion = "77777777-7777-4777-8777-777777777777";
    await db.query(
      `update public.projects set status='published' where id='${project}'`,
    );
    await db.query(
      `insert into public.portfolio_versions(id,owner_id,title,slug,visibility,selected_projects) values('${snapshotVersion}','${admin}','Snapshot test','snapshot-test','published','["${project}"]')`,
    );
    await db.query(
      `update public.projects set title='Newer source' where id='${project}'`,
    );
    await role("anon");
    const frozen = await db.query<{
      content: { projects: { title: string }[] };
    }>(
      `select public.cms_public_version_snapshot('${snapshotVersion}') as content`,
    );
    assert.equal(frozen.rows[0].content.projects[0].title, "Revised");
    await role("authenticated", admin);
    await db.query(
      `update public.projects set status='hidden' where id='${project}'`,
    );
    await role("anon");
    const revoked = await db.query<{ content: { projects: unknown[] } }>(
      `select public.cms_public_version_snapshot('${snapshotVersion}') as content`,
    );
    assert.equal(revoked.rows[0].content.projects.length, 0);
    await assert.rejects(db.query("select * from public.portfolio_snapshots"));
    await assert.rejects(db.query("select * from public.content_trash"));
    await role("authenticated", admin);
    await db.query(`select public.cms_trash_content('projects','${project}')`);
    const trash = await db.query<{ id: string }>(
      `select id from public.content_trash where target_id='${project}'`,
    );
    assert.equal(trash.rows.length, 1);
    await db.query("select public.cms_restore_content($1,true,null)", [
      trash.rows[0].id,
    ]);
    assert.equal(
      (await db.query(`select * from public.projects where id='${project}'`))
        .rows.length,
      0,
    );
    assert.equal(
      (
        await db.query(
          `select * from public.content_revisions where target_id='${project}'`,
        )
      ).rows.length,
      1,
    );
    await db.exec(`reset role; insert into auth.mfa_factors(user_id,status) values('${admin}','verified')`);
    await role("authenticated",admin);
    const aal1 = await db.query<{allowed:boolean}>("select public.has_permission('projects.create') as allowed");
    assert.equal(aal1.rows[0].allowed,false);
    await db.query("select set_config('request.jwt.claim.aal','aal2',false)");
    const aal2 = await db.query<{allowed:boolean}>("select public.has_permission('projects.create') as allowed");
    assert.equal(aal2.rows[0].allowed,true);
    await db.query("select set_config('request.jwt.claim.aal','aal1',false)");
    await role("anon");
    const submit = (id: string) =>
      db.query(
        `select public.cms_submit_contact('Test Sender','sender@example.test','Lainnya','Isolated contact test only.','${id}') as id`,
      );
    const a = await submit(project),
      b = await submit(project);
    assert.deepEqual(a.rows, b.rows);
    await submit(revision);
    await submit(asset);
    await submit(admin);
    await submit(ordinary);
    await assert.rejects(submit("66666666-6666-4666-8666-666666666666"));
    await assert.rejects(db.query("select * from public.contact_messages"));
    await assert.rejects(
      db.query(
        `insert into public.contact_messages(name,email,message) values('x','x@x.test','test')`,
      ),
    );
  } finally {
    await db.close();
  }
});
