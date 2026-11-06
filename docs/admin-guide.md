# Panduan admin

## Login

Buka `/login` dan masuk dengan akun Supabase Authentication. Semua route `/admin` melewati pemeriksaan session, profile aktif, permission, dan RLS.

## Mengubah portfolio

1. Buka `/admin/profile` untuk nama, bio, avatar, dan telepon. SEO global, email publik, CV, dan aset situs berada di `/admin/settings`. Untuk CV, sunting pengaturan `resume_url` dan unggah PDF pada field CV.
2. Buka `/admin/sections` lalu edit Hero, Tentang, Proses, atau custom section. Atur judul, deskripsi, tombol, gambar, visibility, dan urutan.
3. Kelola proyek, keahlian, layanan, pengalaman, pendidikan, sertifikat, prestasi, artikel, testimoni, dan social links dari modul masing-masing.
4. Simpan sebagai `draft` saat belum siap. Pilih `published` setelah preview dan cek isi.
5. Gunakan `hidden` untuk menyembunyikan tanpa menghapus. `archived` disimpan untuk riwayat dan tidak muncul pada daftar utama.

## Media

Unggah melalui field gambar/file di admin. Sistem membuat nama file unik dan menyimpan metadata URL/path. Jangan menyalin URL Storage secara manual. Sebelum menghapus, periksa apakah aset masih dipakai section, profile, project media, sertifikat, artikel, atau settings.

## Urutan dan navigasi

Gunakan tombol Naik/Turun pada `/admin/sections` dan field Urutan pada modul konten. Navigasi dikelola dari `/admin/navigation`; item menuju section tersembunyi tidak dirender di publik.

## Portfolio Version

Buka `/admin/portfolio_versions` atau `/portfolio-builder`. Pilih item dari data Supabase, susun section, simpan sebagai draft, lalu publish untuk mendapatkan `/portfolio/<slug>`. Versi terbit menggunakan snapshot revisi yang dipilih; pencabutan sumber tetap berlaku. Perubahan sumber memerlukan publikasi ulang versi untuk memperbarui snapshot.

## Jika data belum tampil

Periksa konfigurasi Supabase, session, policy RLS, dan apakah migration terbaru sudah dijalankan. Setelah perubahan tersimpan, lakukan refresh halaman publik. Jika query gagal, detail teknis hanya dicatat di console admin; halaman publik menampilkan state kosong yang aman.
