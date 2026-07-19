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

Cara yang direkomendasikan memakai Supabase CLI:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

Atau buka **SQL Editor**, tempel dan jalankan file tersebut satu per satu sesuai urutan. Migration membuat 20 tabel, trigger profile otomatis, default role viewer, function security-definer, RLS, dan bucket `portfolio-public` privat. Migration keempat mempertahankan ID UUID yang sudah dipakai schema ini, memastikan `dashboard.view` dan permission super admin tersedia, memperbaiki policy baca metadata akses, serta menetapkan user admin pertama jika UUID tersebut sudah ada di `auth.users`. Migration kelima memperbaiki kasus ketika user Auth dibuat setelah migration sebelumnya dijalankan.

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

Login di `/login`. User baru lainnya otomatis dibuatkan profile aktif dengan role `viewer` oleh trigger `on_auth_user_created`.

## 4. Auth URL Configuration

Buka **Authentication → URL Configuration**.

- Site URL produksi: `https://YOUR-VERCEL-DOMAIN.vercel.app` atau custom domain aktual.
- Redirect URLs: `http://localhost:5173/**`, `https://YOUR-VERCEL-DOMAIN.vercel.app/**`, dan custom domain `https://YOUR-CUSTOM-DOMAIN/**` bila digunakan.

Reset password memakai `/reset-password` sebagai redirect path.

## 5. Storage

Migration membuat bucket privat `portfolio-public` dengan batas 10 MB dan MIME type gambar/PDF. Metadata disimpan di `media_assets`; file tidak disimpan sebagai base64. Admin dengan `media.manage` mengunggah file memakai nama acak berbasis UUID. File published dibaca melalui policy Storage dan signed URL bila dibutuhkan.

## 6. Troubleshooting

- Pesan “Supabase belum dikonfigurasi”: isi dua environment variable Vite dan restart dev server.
- Login berhasil tetapi kembali ke login: pastikan row `profiles.is_active=true` dan ada row `user_roles`.
- CRUD ditolak: cek role, permission, dan policy RLS; jangan menonaktifkan RLS.
- Contact form gagal: pastikan migration function `submit_contact_message` sudah dijalankan.
- Setelah mengubah environment variable, restart lokal atau redeploy Vercel.
