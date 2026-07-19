# BWORIEY Portfolio

Portfolio editorial vanilla JavaScript + Vite yang mempertahankan desain utama `DESIGN.md`. Root Vite adalah aplikasi publik dan admin yang berjalan di Vercel; Supabase menjadi sumber data, Auth, RLS, dan Storage. Folder `backend/` tetap dipertahankan sebagai backend Laravel lokal yang sudah ada.

## Struktur aktual

```text
index.html              # entry publik dan fallback SPA
script.js               # entry router berdasarkan window.location.pathname
supabase.js             # client publishable Supabase
js/                     # auth, router, admin, public content, utilities
styles.css              # desain publik dan admin
supabase/migrations/    # schema, functions, seed role/permission, RLS, Storage
vercel.json             # rewrite direct route ke index.html
backend/                # Laravel auth/admin lokal yang sudah tersedia
```

## Instalasi dan lokal

```bash
npm install
copy .env.example .env.local
npm run dev
```

Isi `.env.local` dengan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY`. Jalankan migration Supabase sesuai [SUPABASE_SETUP.md](SUPABASE_SETUP.md), lalu buka:

- `/` — portfolio publik
- `/login` — Supabase Auth login
- `/forgot-password` — kirim reset password
- `/reset-password` — simpan password baru
- `/admin` — dashboard terlindungi

Subroute admin mencakup projects, articles, skills, experiences, educations, certificates, services, testimonials, messages, media, social links, settings, users, roles, permissions, security, dan login history.

## Role dan permission

Role bawaan: `super_admin`, `admin`, `editor`, dan `viewer`. Permission menggunakan format `module.action`, misalnya `projects.view`, `projects.create`, `settings.update`, `users.deactivate`, dan `security.view`. Menu, form, dan tombol admin memakai helper permission di frontend; keputusan akhir tetap dipaksa oleh RLS Supabase.

Daftar lengkap schema, permission, dan policy ada di file migration `supabase/migrations/`.

## Build dan deployment

```bash
npm ci
npm run build
```

Konfigurasi Vercel dijelaskan di [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md). Build output adalah `dist`. Environment variable frontend hanya `VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY`; jangan menaruh service-role key di repository atau bundle.

## Validasi

Build root Vite berhasil dengan Node lokal 22.11.0 dan menghasilkan warning rekomendasi Vite untuk Node 22.12+. Dependency binding Rolldown Windows tidak lagi menjadi dependency langsung backend.
