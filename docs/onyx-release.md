# Rilis portfolio Onyx — 21 Oktober 2026

## Production

- Aplikasi Next.js aktif pada proyek Vercel yang sudah ada, `portofolio-yhbh`, domain [portofolio-bworiey.vercel.app](https://portofolio-bworiey.vercel.app). Deployment `dpl_Tbi2JF7ScfwknwucMTuF6qS29B1t` sudah READY dan dipromosikan. Build menggunakan Next.js, Node 24, `npm ci`, dan `npm run build`.
- Environment Vercel Production/Preview berisi URL Supabase, publishable key, dan origin production. Secret/service-role key tidak dimasukkan ke browser.
- Supabase `txsqhxhnamgteofarqfz` sempat paused, berhasil di-resume dari Dashboard, dan status akhirnya **Healthy**. Konten publik kembali tampil. Dashboard Auth memakai Site URL `https://portofolio-bworiey.vercel.app` dan callback production serta localhost.
- Dua belas migrasi CMS yang telah direkonsiliasi tercatat di database: `202609030001`, `202609040001`, `202609080000–003`, `202609200001–006`. Fondasi legacy tidak diputar ulang. `202609040002_single_source_content.sql` dilewati karena backfill dapat mengubah status hero lama; kompatibilitas status yang diperlukan sudah ada di `202609080002`.
- Audit pasca-resume memastikan semua tabel tambahan CMS ada dan seluruh tabel publik mengaktifkan RLS. Jumlah record semua 24 tabel cocok dengan backup kecuali satu pesan uji yang ditambahkan dan perubahan izin yang memang ditambahkan; data `profiles`, `page_sections`, `educations`, `experiences`, `skills`, dan `certificates` tetap cocok.
- `npm run check:services` lulus. Kedua smoke test production lulus untuk route publik/privat, CSRF, validasi kontak, sitemap/robots, PDF, dan blokir preview development. Halaman utama menampilkan identitas dan tidak menunjukkan error data.
- Form kontak menerima pengujian idempoten dua kali dengan satu ID dan hanya menghasilkan satu record. Record memakai alamat `.invalid`, tidak mengirim email, dan sudah diarsipkan setelah tes. Email notifikasi belum dikonfigurasi.

## Backup dan sisa verifikasi

- Sebelum migrasi, backup logis skema, kebijakan, fungsi, metadata Storage, dan data 24 tabel disimpan privat di `.qa/production-before-schema.json` serta `.qa/production-before-data.json`. Ini bukan backup fisik PostgreSQL, bukan salinan objek Storage, dan belum diuji pemulihannya. Dashboard Supabase saat audit menunjukkan belum ada backup terjadwal.
- Ada satu akun super-admin dan empat akun admin aktif pada database. Login menggunakan kredensial pemilik, MFA, edit/publish konten, unggah file, dan inbox dengan kiriman pengunjung belum diuji manual.
- Supabase berada di paket Free; project Free dapat dijeda jika lama tidak menerima cukup aktivitas. Periksa [panduan pausing Supabase](https://supabase.com/docs/guides/platform/free-project-pausing). Tidak ada peningkatan paket berbayar yang dilakukan.
- Konten lama yang tersembunyi tetap tersembunyi. Tidak ada foto, CV, screenshot proyek, hasil, atau klaim yang dibuat-buat. Arsip proyek masih kosong; pengalaman, pendidikan, skill, dan sertifikat yang sudah tersimpan tampil dari database.

## Implementasi

- Tampilan mengikuti Onyx dari DESIGN.md yang dilampirkan: Bebas Neue, Inter, IBM Plex Mono, grid responsif, gerak yang menghormati reduced-motion, dan kontras teks yang jelas.
- Route publik `/about`, `/contact`, `/experiences`, `/educations`, `/skills`, `/certificates`, dan `/achievements` memakai konten Supabase. Metadata canonical/Open Graph, sitemap, dan robots berasal dari konfigurasi yang aktif.
- CMS mengelola profil, section, proyek, pengalaman, pendidikan, skill, sertifikat, prestasi, artikel, media, CV, sosial, versi portfolio, terjemahan, analitik, MFA, dan inbox. Draf, revisi, publikasi, pemulihan, RLS, validasi file, dan idempotensi kontak tersedia.
- Impor konten PRD hanya membuat draf dan menghormati section yang sengaja disembunyikan. Email publik, tautan sosial, CV, foto, dan detail kontribusi harus berasal dari pemilik.

## Validasi yang telah dilakukan

- Sebelum deploy: lint, TypeScript, 26 pengujian, production build, dua smoke test lokal, dan pemeriksaan responsif browser pada 320–1440 px.
- Production: domain utama merespons, isi profil/arsip tersedia, Auth URL tersimpan, preflight layanan lulus, RLS private ditolak untuk akses anonim, dan dua smoke test HTTP lulus.
- Production login/upload belum diverifikasi manual. Pengujian lokal tidak membuktikan keberhasilan login atau upload memakai akun pemilik.
