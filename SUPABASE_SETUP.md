# Supabase setup BWORIEY

## 1. Buat project dan ambil key

Buat project baru di Supabase, lalu buka **Project Settings → API**. Gunakan:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Key publishable boleh dipakai frontend. Jangan gunakan `service_role`, `secret`, atau key privat pada `.env.local`, Vercel, atau source code frontend.

## 2. Jalankan migration

Urutan migration:

1. `supabase/migrations/202607190001_initial_schema.sql`
2. `supabase/migrations/202607190002_security_and_rls.sql`
3. `supabase/migrations/202607190003_seed_roles_permissions.sql`
4. `supabase/migrations/202607190004_fix_admin_authorization.sql`
5. `supabase/migrations/202607190005_repair_known_admin_role.sql`
6. `supabase/migrations/202607200006_repair_all_auth_access.sql`
7. `supabase/migrations/202607200007_finalize_auth_access_and_rls.sql`
8. `supabase/migrations/202607200008_create_dynamic_content_schema.sql`
9. `supabase/migrations/202607200009_repair_admin_authorization.sql`
10. `supabase/migrations/202607210001_storage_uploads_and_image_paths.sql`
11. `supabase/migrations/202607210002_sync_dynamic_media_schema.sql`
12. `supabase/migrations/202607210003_dynamic_site_sections.sql`
13. `supabase/migrations/202607220004_repair_portfolio_storage.sql`
14. `supabase/migrations/202609030001_portfolio_versions.sql`
15. `supabase/migrations/202609040001_admin_content_expansion.sql`

Cara yang direkomendasikan memakai Supabase CLI:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

Atau buka **SQL Editor**, tempel dan jalankan file tersebut satu per satu sesuai urutan. Migration membuat tabel konten dinamis, trigger profile otomatis, default role viewer, function security-definer, RLS, bucket `portfolio-public`, serta tabel `portfolio_versions` dan `achievements`. Role dan permission memakai `bigint`, sedangkan user/Auth memakai `uuid`. Migration terakhir menambah field CMS untuk SEO, studi kasus, CV PDF, dan pilihan konten pada portfolio versi.

## 3. Buat Super Admin pertama

1. Buka **Authentication → Users → Add user** dan buat user dengan email yang kamu miliki. Jangan menaruh password-nya di repository.
2. Salin UUID user tersebut.
3. Jalankan SQL berikut dengan UUID milikmu:

```sql
update public.profiles
set is_active = true
where id = 'USER_UUID';

delete from public.user_roles
where user_id = 'USER_UUID';

insert into public.user_roles (user_id, role_id)
select 'USER_UUID', id
from public.roles
where name = 'super_admin';
```

4. Pastikan hasilnya:

```sql
select p.id, p.is_active, r.name
from public.profiles p
join public.user_roles ur on ur.user_id = p.id
join public.roles r on r.id = ur.role_id
where p.id = 'USER_UUID';
```

Login di `/login`. Migration keenam juga memperbaiki semua user lama yang belum
memiliki role dengan role `admin`, melengkapi mapping permission setiap role,
dan memastikan user baru otomatis dibuatkan profile aktif dengan role `viewer`.

## 4. Auth URL Configuration

Buka **Authentication → URL Configuration**.

- Site URL produksi: `https://YOUR-VERCEL-DOMAIN.vercel.app` atau custom domain aktual.
- Redirect URLs: `http://localhost:5173/**`, `https://YOUR-VERCEL-DOMAIN.vercel.app/**`, dan custom domain `https://YOUR-CUSTOM-DOMAIN/**` bila digunakan.

Reset password memakai `/reset-password` sebagai redirect path.

## 5. Storage

Migration `202607210001_storage_uploads_and_image_paths.sql` memastikan bucket publik `portfolio-public` tersedia, menambah policy Storage berbasis permission `media.manage`, dan menambah path gambar tanpa menghapus URL lama. Frontend menerima JPG, PNG, dan WebP untuk gambar dengan batas 5 MB, serta PDF CV/dokumen dengan batas 8 MB; file tidak disimpan sebagai base64.

Untuk project yang sudah menjalankan migration lama, jalankan migration tambahan `202609030001_portfolio_versions.sql` lalu `202609040001_admin_content_expansion.sql` dari SQL Editor dan refresh schema cache. Migration tambahan bersifat additive: data lama tidak dihapus, permission `achievements.manage` ditambahkan, dan bucket diperbarui agar menerima PDF.

## 6. Troubleshooting

- Pesan “Supabase belum dikonfigurasi”: isi dua environment variable Vite dan restart dev server.
- Login berhasil tetapi kembali ke login: pastikan row `profiles.is_active=true` dan ada row `user_roles`.
- CRUD ditolak: cek role, permission, dan policy RLS; jangan menonaktifkan RLS.
- Contact form gagal: pastikan migration function `submit_contact_message` sudah dijalankan.
- Setelah mengubah environment variable, restart lokal atau redeploy Vercel.
