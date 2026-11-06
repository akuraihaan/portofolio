# Database dan Storage

## Migration

Jalankan migration dari `supabase/migrations/` secara berurutan di Supabase SQL Editor atau Supabase CLI. Migration `202609040002_single_source_content.sql` aman dijalankan ulang, tidak mereset tabel, dan:

1. memindahkan nilai hero lama ke `page_sections` hanya jika field canonical masih kosong;
2. mempertahankan setting legacy sebagai private agar dapat dipulihkan;
3. memperluas status domain menjadi `draft`, `published`, `hidden`, dan `archived`;
4. meminta PostgREST memuat ulang schema.

Sebelum production, hitung row penting dan backup database. Migration ini tidak menghapus data lama. Jika perlu rollback, pulihkan nilai setting legacy secara manual setelah backup; constraint status dapat dikembalikan ke daftar sebelumnya hanya setelah seluruh row `hidden` ditangani.

## Status publikasi

- `draft`: hanya admin.
- `published`: boleh dibaca publik jika `published_at` sudah tiba.
- `hidden`: tersimpan, tetapi tidak dibaca publik.
- `archived`: tersimpan dan disembunyikan dari daftar utama admin.

Halaman publik hanya memanggil query published/visible. Tombol admin menggunakan status yang sama untuk semua tabel domain.

## Tabel inti

| Tanggung jawab | Tabel |
| --- | --- |
| Identitas dan global config | `profiles`, `site_settings` |
| Struktur halaman | `page_sections`, `navigation_items`, `statistics` |
| Konten | `projects`, `project_media`, `skills`, `services`, `experiences`, `educations`, `certificates`, `achievements`, `articles`, `testimonials`, `social_links` |
| Operasional | `contact_messages`, `media_assets`, `portfolio_versions` |

Project media memiliki foreign key ke project dengan cascade yang aman. Kolom audit (`created_by`, `updated_by`, timestamp), status, visibility, dan order dipakai sesuai schema yang sudah ada; migration tambahan tidak membuat tabel duplikat.

## Storage

Bucket `portfolio-public` dipakai untuk avatar, gambar section, thumbnail/cover/gallery proyek, logo, sertifikat, artikel, aset situs, dan PDF. Utility `js/services/storage-service.js` memvalidasi tipe/ukuran, membuat path unik, mengambil public URL, dan membersihkan file baru saat penyimpanan database gagal.

Jangan menaruh service-role key di browser atau repository. Client hanya memakai `VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY`.

