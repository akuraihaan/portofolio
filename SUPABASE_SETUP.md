# Supabase untuk portfolio BWORIEY

Portfolio Next.js menggunakan proyek Supabase yang sudah terhubung. Domain production adalah `https://portofolio-bworiey.vercel.app`; pengaturan frontend memakai `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, dan `NEXT_PUBLIC_SITE_URL`. Publishable key boleh dipakai browser. Jangan masukkan service-role/secret key ke frontend, Vercel public env, atau repository.

## Status project production

Ref production: `txsqhxhnamgteofarqfz` (region Tokyo). Project sempat paused lalu berhasil di-resume pada 21 Oktober 2026; status akhir **Healthy**. Bila paused lagi, masuk ke [Supabase Dashboard](https://supabase.com/dashboard/project/txsqhxhnamgteofarqfz) dan gunakan **Resume project**. Situs Vercel bergantung pada database aktif. Project Free dapat dijeda setelah periode tanpa aktivitas; lihat [panduan Supabase](https://supabase.com/docs/guides/platform/free-project-pausing). Tidak ada paket berbayar yang diaktifkan.

Migrasi CMS yang sudah diterapkan dan direkonsiliasi: `202609030001`, `202609040001`, `202609080000–003`, `202609200001–006`. Jangan jalankan seluruh folder dari awal: schema legacy sudah ada, beberapa migration historis mengandung seed/perbaikan khusus, dan `202609040002_single_source_content.sql` sengaja tidak diputar ulang karena backfill-nya dapat mengubah status hero lama. Riwayat rilis dan backup pra-migrasi ada di [docs/onyx-release.md](docs/onyx-release.md); file backup privat di `.qa/` tidak dimasukkan ke Git atau deployment.

Sesudah project aktif, jalankan `npm run check:services`, periksa kelengkapan Auth user/role yang sudah ada, lalu uji `/login`, pengelolaan draft/publikasi, akses anonim ke konten draft, media, dan inbox. Jangan membuat akun admin baru atau membuka konten tersembunyi tanpa persetujuan pemilik.

## URL autentikasi

**Authentication → URL Configuration** sudah memakai Site URL production dan dua redirect berikut:

- Site URL: `https://portofolio-bworiey.vercel.app`
- Redirect URL: `https://portofolio-bworiey.vercel.app/auth/callback`
- Redirect URL lokal untuk pengembangan: `http://localhost:3000/auth/callback`

Callback mengarahkan ke `/admin`; pemulihan kata sandi mengarah ke `/reset-password`. Hanya tambahkan domain production atau development yang benar-benar dipakai.

## Storage dan kontak

Bucket `portfolio-public` menyimpan media yang memang diterbitkan. Bucket `portfolio-private` menahan berkas draf sampai publikasi mengizinkannya. Aplikasi mengizinkan gambar JPG/PNG/WebP dan dokumen PDF sesuai batas per jenis unggahan. Jangan membuat bucket publik atau melemahkan RLS untuk mengatasi kesalahan izin.

Formulir kontak memanggil RPC `cms_submit_contact`, memvalidasi panjang/topik, memiliki ID idempotensi, dan membatasi laju pengiriman. Pesan tersimpan di inbox admin; notifikasi email belum dikonfigurasi.

## Backup dan perubahan schema

Supabase backup SQL tidak otomatis mencakup objek file Storage. Backup logis sebelum migration rilis disimpan privat di `.qa/production-before-data.json` dan `.qa/production-before-schema.json`; ini belum merupakan backup fisik atau pemulihan yang teruji. Buat backup resmi database serta objek Storage sebelum perubahan schema besar, dan uji pemulihannya di lingkungan terpisah.
