# bworiey Portfolio

Portofolio kreatif dengan arah visual yang mengikuti `DESIGN.md`: kanvas near-black, cream typography, outlined pill controls, organic gradient shapes, dan taxonomy warna per disiplin.

## Yang sudah dibuat

- Hero editorial dengan headline besar, abstract portrait, dan animated organic shapes.
- Sticky navigation, mobile menu, smooth scroll, theme switcher, dan reduced-motion support.
- Section About, Capabilities, Selected Work, Process, Field Notes, dan Contact.
- Filter project untuk kategori Digital, Identity, dan Motion.
- Modal detail project yang dapat dibuka dari setiap project card.
- Contact form dengan validasi browser dan feedback status.
- Copy email ke clipboard dengan toast notification.
- Responsive layout untuk mobile, tablet, dan desktop.

## Menjalankan public site lokal

```bash
npm install
npm run dev
```

Untuk build production:

```bash
npm run build
```

## Menjalankan backend Laravel

Backend autentikasi berada di folder [`backend/`](C:/laragon/www/portofolio/backend). Jalankan:

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Sebelum menjalankan seeder, isi `SUPER_ADMIN_NAME`, `SUPER_ADMIN_EMAIL`, dan `SUPER_ADMIN_PASSWORD` di `backend/.env`. Registrasi publik sengaja nonaktif secara default.

## Catatan pengembangan

Repository sekarang memiliki public-facing front-end Vite dan backend Laravel 13 + Breeze Blade + Spatie Permission. Homepage Laravel membaca identitas, profil, judul profesional, social links, dan resume dari database; auth, role, permission, login history, activity log, dan admin access control sudah menggunakan database Laravel.
