# Portofolio Taufik Raihandani

Next.js App Router, TypeScript, dan proyek Supabase yang sudah ada. Tampilan aktif mengikuti referensi Onyx dalam [docs/design-onyx-reference.md](docs/design-onyx-reference.md). Referensi lama di DESIGN.md dan berkas legacy dipertahankan.

## Menjalankan

Gunakan Node.js 24 LTS atau Node.js 22.13+. Jalankan `npm ci`, isi `.env.local` sesuai `.env.example`, kemudian `npm run dev`. Jangan masukkan service-role key ke variabel browser.

- `/` membaca konten terbit dari Supabase.
- `/design-preview` hanya tersedia di development; isi dari sumber PRD untuk ditinjau, bukan publikasi atau fallback saat database gagal.
- `/projects`, `/projects/<slug>`, `/about`, `/contact`, `/experiences`, `/educations`, `/skills`, `/certificates`, `/achievements`, serta artikel bila ada konten terbit.
- `/login` untuk akun Supabase yang sudah memiliki peran admin; `/admin` untuk mengelola konten.

Dashboard mengelola profil, hero dan urutan bagian, proyek/galeri, kategori dan teknologi pada editor proyek, pengalaman, pendidikan, keahlian, sertifikasi, prestasi, artikel, CV, sosial, pengaturan, serta inbox. Draf terpisah dari publikasi. Panel kelengkapan menunjukkan isian yang perlu dilengkapi. Tidak ada pendaftaran admin publik.

## Pemeriksaan

```text
npm run lint
npm run typecheck
npm test
npm run build
npm run start -- --port 3101
```

Atur `QA_ORIGIN=http://127.0.0.1:3101`, lalu jalankan `node tests/production-smoke.mjs` dan `node tests/prd-production-smoke.mjs`. `npm run check:services` memeriksa akses tabel dan menolak input RPC kontak kosong tanpa membuat pesan. Exit code 1 menunjukkan layanan belum siap.

## Status rilis

Lihat [laporan implementasi Onyx](docs/onyx-release.md) untuk status rilis. Vercel production aktif di [portofolio-bworiey.vercel.app](https://portofolio-bworiey.vercel.app), migrasi CMS rilis sudah dipasang, dan Supabase kembali Healthy setelah di-resume.

Ikuti [panduan deployment](docs/deployment.md). Gunakan preset Next.js dan output bawaan, bukan dist atau SPA rewrite. Riwayat implementasi sebelumnya ada di docs/prd-implementation.md.
