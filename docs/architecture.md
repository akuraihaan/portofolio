# Arsitektur portfolio

Aplikasi aktif menggunakan Next.js App Router, TypeScript, dan Supabase. Folder `backend/`, `js/`, serta konfigurasi Vite dipertahankan sebagai referensi legacy, bukan entry produksi.

## Data dan publikasi

`lib/data.ts` membaca profil, settings, section dan koleksi melalui Supabase dengan RLS. Halaman publik hanya membaca konten yang tersedia untuk pengunjung anonim. Tidak ada fallback identitas atau proyek ketika query gagal. React memoization hanya berlaku dalam satu permintaan; status publikasi diperiksa kembali pada permintaan berikutnya.

CMS menggunakan sesi Supabase Auth, pemeriksaan peran/izin, draf terpisah, revisi dan RPC publikasi atomik. Pemulihan riwayat atau sampah membuat draf untuk ditinjau. Setelah TOTP terverifikasi, akses admin memerlukan AAL2 di aplikasi dan database.

Versi portofolio mengambil snapshot saat diterbitkan. Snapshot mempertahankan isi dan urutan yang dipilih, tetapi sumber yang dicabut tidak boleh terus tampil. Renderer web dan PDF memeriksa akses sumber tersebut. Media privat dilayani melalui route yang memeriksa otorisasi, bukan service-role key di browser.

## Antarmuka

`components/portfolio.tsx` menyusun section dari database. Hero dan keahlian tersedia di `components/editorial.tsx`. Penjelajah proyek menyimpan pencarian, filter gabungan dan halaman di URL. Artikel memakai parser Markdown terbatas yang tidak mengeksekusi HTML pengguna.

Rute `/design-preview` memakai konten PRD terpisah hanya pada development. Produksi menolaknya dengan 404. Tombol impor PRD di admin menyiapkan draf yang belum ada, tanpa menerbitkan otomatis atau menimpa data pemilik.

## Status implementasi

Lihat [kesiapan rilis](prd-implementation.md) untuk urutan migrasi, hasil pengujian dan keterbatasan. Migrasi SQL yang tersedia di repository belum berarti sudah diterapkan pada database jarak jauh.
