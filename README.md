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

## Persyaratan runtime

- Node.js `22.12+` (Vite 7.3 membutuhkan Node.js `20.19+` atau `22.12+`).
- PHP `8.3+` dan Composer untuk aplikasi Laravel di `backend/`.
- Project Supabase dengan Auth, database, RLS, dan Storage aktif.

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

## Menjalankan lewat Laragon

Laragon melayani file secara langsung, sehingga gunakan konfigurasi runtime berikut:

1. Salin nilai `VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY` dari `.env.local` ke `portfolio.config.js`.
2. Pastikan folder proyek menjadi document root virtual host `portofolio.test`.
3. Buka `http://portofolio.test:8080/` dan lakukan hard refresh.

`portfolio.config.js` diabaikan Git karena berisi konfigurasi lokal. Jika hanya ingin melihat fallback tanpa Supabase, biarkan nilainya kosong. Alternatif untuk deployment adalah menjalankan `npm run build`, lalu arahkan document root Laragon ke folder `dist`.

Subroute admin mencakup dashboard, profile, sections, skills, projects, experiences, educations, certificates, achievements, services, articles, portfolio versions, preview, PDF export, appearance, navigation, SEO, media, social links, contact, account, messages, users, roles, permissions, security, dan login history. Migration `202609040001_admin_content_expansion.sql` menambah field studi kasus, SEO, CV PDF, dan modul prestasi secara additive.

## Role dan permission

Role bawaan: `super_admin`, `admin`, `editor`, dan `viewer`. Permission menggunakan format `module.action`, misalnya `projects.view`, `projects.create`, `settings.update`, `users.deactivate`, dan `security.view`. Menu, form, dan tombol admin memakai helper permission di frontend; keputusan akhir tetap dipaksa oleh RLS Supabase.

Daftar lengkap schema, permission, dan policy ada di file migration `supabase/migrations/`.

## Pengujian

Root app tidak memiliki script lint atau typecheck terpisah; pemeriksaan sintaks dan production build dilakukan oleh Vite.

```bash
npm ci
npm run build
npm audit

cd backend
composer install
php artisan test --no-ansi
npm ci
npm run build
npm audit
```

Uji browser pada `/`, `/projects`, `/projects/<slug>`, `/portfolio-builder`, `/login`, `/admin`, dan route 404. CRUD admin, upload Storage, serta form kontak membutuhkan akun dan project Supabase yang sudah dikonfigurasi; gunakan data uji yang aman dan hapus hanya data uji tersebut.

## Media, Portfolio Versions, dan PDF

Upload gambar, PDF sertifikat, CV, dan aset Open Graph dikelola dari `/admin/media` atau form modul terkait dan disimpan di bucket `portfolio-public`. File PDF dibatasi 8 MB oleh migration.

`/portfolio-builder` dipakai untuk memilih tipe portfolio, proyek, keahlian, pengalaman, pendidikan, sertifikat, artikel, urutan section, tema, bahasa, dan slug. Versi yang disimpan dapat dibuka melalui `/portfolio/<slug>` dan dicetak atau diekspor sebagai PDF dari toolbar/preview browser.

## Build dan deployment

```bash
npm ci
npm run build
```

Konfigurasi Vercel dijelaskan di [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md). Build output adalah `dist`. Environment variable frontend hanya `VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY`; jangan menaruh service-role key di repository atau bundle.

Untuk deployment, gunakan project Vercel yang sudah terhubung, Root Directory `.`, Install command `npm ci`, Build command `npm run build`, dan Output Directory `dist`. Isi environment variable pada Production, Preview, dan Development. Setelah deployment, verifikasi route publik, `/admin` tanpa session, refresh nested route, `robots.txt`, `sitemap.xml`, dan console browser.

## Troubleshooting

- Jika Laragon menampilkan HTML polos, pastikan document root menunjuk ke folder proyek atau `dist`, lalu lakukan hard refresh setelah mengubah file JavaScript.
- Jika `npm ci` mendapat `EPERM` pada binary native, hentikan proses Vite yang memegang file, hapus hanya `node_modules`, dan jalankan `npm ci` lagi. Jangan menghapus lockfile.
- Jika admin menampilkan error migration, jalankan migration Supabase sesuai urutan di [SUPABASE_SETUP.md](SUPABASE_SETUP.md), terutama `202609030001_portfolio_versions.sql` dan `202609040001_admin_content_expansion.sql`.

## Validasi

Build root Vite berhasil dengan Node lokal 22.11.0 dan menghasilkan warning rekomendasi Vite untuk Node 22.12+. Dependency binding Rolldown Windows tidak lagi menjadi dependency langsung backend.
