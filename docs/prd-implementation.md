# Implementasi PRD dan kesiapan rilis

Pekerjaan ini memperluas aplikasi Next.js yang sudah ada. Database produksi tidak dimigrasikan dan konten pemilik tidak diubah selama pengerjaan. Situs belum dinyatakan memenuhi seluruh kriteria rilis PRD 1.0.

## Yang tersedia

- Tampilan editorial responsif, hero dengan foto opsional atau monogram, kelompok keahlian tanpa persentase, proyek, pengalaman, kredensial, kontak, dan footer dari database.
- Pencarian proyek, filter kategori dan teknologi gabungan, parameter URL, pagination 12 item, reset filter, preview keyboard, serta tautan kembali ke hasil pencarian.
- Artikel dengan heading, daftar isi, tautan aman, daftar, kutipan, blok kode dan tombol salin. Arsip artikel dan playground memiliki pencarian, kategori, pagination, dan keadaan kosong.
- Formulir kontak sesuai batas PRD: nama 2–100, pesan 20–5000, topik yang diizinkan, fokus error, penghitung karakter, kunci idempotensi, dan retensi isian saat gagal. Database membatasi lima pengiriman per email per 15 menit dengan tambahan batas global.
- Inbox dengan pencarian, status termasuk Ditindaklanjuti, catatan internal, balas melalui aplikasi email, dan penghapusan dengan konfirmasi.
- Draf terpisah dari publikasi, konflik revisi, pengingat perubahan belum tersimpan, slug otomatis, riwayat privat, pemulihan sebagai draf, serta tempat sampah 30 hari.
- Snapshot pilihan konten, profil, section, dan settings saat versi diterbitkan. Status sumber diperiksa kembali setiap permintaan; sumber tersembunyi disaring. Versi tanpa konten utama tidak tersedia.
- Versi melalui tautan tidak diindeks secara bawaan. Sitemap dan robots dinamis menggantikan file statis lama yang disimpan di docs/legacy-public-*.
- PDF A4 langsung dari snapshot, nomor halaman, teks dapat dipilih, tautan dan QR. Akses versi/sumber diperiksa sebelum dan sesudah render. Gambar JPEG/PNG dari media privat yang terotorisasi didukung; URL eksternal tidak diambil renderer. Cetak browser tetap tersedia sebagai tindakan terpisah.
- Terjemahan Inggris dikelola terpisah, dengan referensi ke sumber terbit. Rute /en, canonical, hreflang dan pemberitahuan saat terjemahan belum tersedia. Tidak ada terjemahan otomatis yang diterbitkan tanpa tinjauan.
- Pengaturan TOTP dan tantangan MFA. Setelah ada faktor terverifikasi, migrasi menolak hak admin untuk token AAL1 pada database maupun aplikasi.
- Analitik dasar tanpa cookie, opt-in melalui variabel server; periode 7/30/90 hari, jumlah halaman/proyek/klik kontak dan kondisi belum ada data. Raw event dibatasi 90 hari saat pencatatan berikutnya.
- Migrasi perlindungan media yang masih dirujuk publikasi, draf, riwayat, versi, atau sampah. Izin publikasi wajib untuk testimoni.

## Migrasi baru

Terapkan setelah migrasi fondasi Next.js yang sudah disertakan di repository, dengan backup terpisah dan pemeriksaan riwayat migrasi:

1. `202609200001_prd_core.sql`: kontrak kontak, riwayat, pemulihan dan sampah, indeks versi.
2. `202609200002_version_snapshots.sql`: pembekuan revisi dan pemeriksaan pencabutan sumber.
3. `202609200003_translations.sql`: terjemahan yang terhubung ke sumber, RLS, dan perizinan.
4. `202609200004_analytics_inbox.sql`: raw event privat, status inbox, catatan, dan batas bucket 50 MB.
5. `202609200005_media_consent.sql`: referensi media snapshot, perlindungan penghapusan, dan izin testimoni.
6. `202609200006_mfa_audit.sql`: pemeriksaan AAL pada peran/izin dan audit tanpa salinan pesan/rahasia.

Migrasi tidak otomatis menerbitkan konten lama. Versi lama perlu diterbitkan ulang agar memperoleh snapshot. Testimoni perlu dikonfirmasi izinnya. File lama di bucket publik tetap memiliki perilaku akses bucket tersebut; migrasi file tersebut ke penyimpanan privat memerlukan inventaris dan penyesuaian referensi sebelum menjanjikan pencabutan akses penuh.

## Verifikasi lokal

- Lint, pemeriksaan TypeScript, production build, dan 26 pengujian otomatis.
- PostgreSQL terisolasi menguji publikasi atomik, RLS, konflik, snapshot tetap saat sumber berubah, pencabutan, sampah/pemulihan, kontak idempoten, pembatasan kontak dan hak admin AAL1/AAL2. Tidak memakai data pemilik.
- Browser Chromium: lebar 320, 360, 390, 768, 1024 dan 1440 tanpa overflow horizontal pada rancangan beranda. Menu ponsel, filter gabungan, modal preview dan fokus kesalahan formulir diperiksa.
- PDF dua halaman dirender dan diperiksa; ekstraksi teks dan anotasi tautan diverifikasi.
- Smoke test produksi memeriksa rute publik, login admin/preview, CSRF, penolakan media/PDF tidak tersedia, penolakan pratinjau development dan sitemap/robots.

## Batas dan pekerjaan sebelum rilis penuh

- Terapkan migrasi pada Supabase yang benar; uji memakai akun pemilik dan aktifkan TOTP. Pengujian login, upload, penyimpanan pesan valid, dan PDF dari data nyata belum dilakukan karena tidak ada sesi pemilik atau akses migrasi database dalam tugas ini.
- Tinjau lalu terbitkan identitas, hero, studi kasus, terjemahan dan versi. PRD menyediakan nama dan calon studi kasus, tetapi foto, CV, screenshot, tautan demo, detail kontribusi, tanggal dan bukti tetap memerlukan data pemilik. Impor melewati bagian hero lama yang sengaja tersembunyi.
- Tentukan penyedia notifikasi email, alamat tujuan terverifikasi, serta antrean/retry. Saat ini pesan tersimpan di inbox; notifikasi email belum diintegrasikan.
- Lengkapi instrumentasi server untuk CV/PDF yang benar-benar dilayani dan pesan tersimpan. Grafik saat ini tidak mengklaim peristiwa unduhan atau pengiriman yang belum direkam.
- Tambahkan pemeliharaan terjadwal: retensi inbox 12 bulan, pembersihan upload terputus/sampah, backup database dan media harian 30 hari; uji pemulihan pada lingkungan lain. Kebijakan belum dianggap terlaksana hanya karena tertulis.
- Lengkapi kontrol crop/focal point dan optimasi metadata gambar, drag/drop urutan dengan tombol naik/turun, snapshot galeri dan pilihan kontak individual. Galeri terkait proyek belum dipulihkan otomatis dari sampah. Jangan menghapus permanen proyek bergaleri sebelum langkah ini ditangani.
- Penandaan otomatis terjemahan usang, konten Inggris untuk seluruh modul, serta label PDF mengikuti bahasa versi masih perlu dilengkapi. Field sumber yang ditinjau sudah dicatat ketika terjemahan diterbitkan.
- Batasi ekspor dan login secara terdistribusi; pembatasan kontak saat ini berbasis email dan global, belum kombinasi jaringan/pengirim. Verifikasi keamanan unggahan pada penyimpanan yang sebenarnya.
- Uji Edge, Firefox, Safari, pembaca layar, keyboard lengkap, pengukuran Web Vitals dan dataset panjang/galeri/video. Hasil Chromium dan smoke HTTP bukan klaim kepatuhan WCAG atau performa lapangan.

Tidak ada deployment, pengiriman email, atau pendaftaran layanan berbayar yang dilakukan.
