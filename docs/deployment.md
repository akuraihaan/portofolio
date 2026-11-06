# Deployment dan verifikasi

## Next.js

Gunakan root repository, Node.js 22.13 atau LTS yang lebih baru, `npm ci`, lalu `npm run build`. Pada Vercel pilih preset Next.js dan output directory bawaan. Jangan memakai `dist` atau SPA rewrite dari aplikasi Vite lama.

Konfigurasikan `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, dan `NEXT_PUBLIC_SITE_URL` dengan origin HTTPS final. `PORTFOLIO_ANALYTICS` bersifat opt-in. Jangan memublikasikan `.env.local` atau service-role key.

Untuk menjalankan hasil build secara lokal: `npm run start -- --port 3100`. Laragon/Apache dapat menjadi reverse proxy ke proses Next.js; menunjuk document root ke repository saja tidak menjalankan App Router.

## Database

Periksa riwayat migrasi pada proyek Supabase target dan buat backup. Terapkan fondasi Next.js yang belum ada, kemudian enam migrasi `20260920` sesuai [catatan implementasi](prd-implementation.md). Build tidak menjalankan migrasi SQL. Hindari mengulang seed lama pada database pemilik.

Uji pemilik dengan AAL2, pengunjung anonim, publikasi/draf, upload privat, pencabutan versi/media, dan pemulihan. Tinjau konten PRD sebagai draf sebelum menerbitkannya.

## Pemeriksaan

Jalankan `npm run lint`, `npm run typecheck`, `npm test`, dan `npm run build`. Setelah server produksi aktif, jalankan `node tests/production-smoke.mjs` dan `node tests/prd-production-smoke.mjs`; keduanya memakai port 3100 atau variabel `QA_ORIGIN`.

Verifikasi canonical, sitemap, robots, halaman privat, kontak, PDF, tampilan ponsel dan keyboard pada origin final. Rute `/design-preview` harus berstatus 404 pada produksi. Lihat catatan implementasi untuk pemeriksaan nyata dan fitur operasional yang masih belum selesai; jangan menganggap semua persyaratan PRD telah terpenuhi hanya karena build berhasil.

## Referensi dan status terbaru

Tampilan mengikuti Onyx pada docs/design-onyx-reference.md. [Catatan rilis](onyx-release.md) mencatat status production terbaru, migrasi yang dipasang, backup pra-migrasi, dan langkah yang masih perlu dilakukan. Deployment Vercel aktif di `https://portofolio-bworiey.vercel.app`; Supabase sudah di-resume dan terakhir terlihat **Healthy**. Bila project paused lagi, resume lewat Dashboard lalu ulangi `npm run check:services` dan verifikasi login, upload, serta inbox.

`supabase/preflight.sql` membantu audit project sebelum migrasi. Jangan menjalankan `supabase db push` atau memutar ulang seluruh folder migration tanpa memeriksa riwayat dan baseline project.
