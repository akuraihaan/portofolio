# bworiey Portfolio Backend

Backend Laravel untuk autentikasi, role, permission, audit login, dan panel admin portfolio.

## Setup

```bash
composer install
copy .env.example .env
php artisan key:generate
```

SQLite dipakai sebagai default lokal. Untuk MySQL/PostgreSQL, ubah `DB_CONNECTION` dan credential database di `.env`.

Isi credential Super Admin sebelum seeding:

```env
SUPER_ADMIN_NAME="bworiey Admin"
SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=change-this-before-seeding
```

Lalu jalankan:

```bash
php artisan migrate --seed
php artisan storage:link
npm install --include=optional
npm run build
php artisan serve
```

Login tersedia di `/login`; panel tersedia di `/admin/dashboard`. Konten publik diatur dari Site settings, Portfolio profile, Professional titles, Social links, dan Resumes.

## Role dan permission

- `Super Admin`: seluruh permission dan perlindungan akun terakhir.
- `Admin`: content, users terbatas, pesan/media, dan analitik sesuai permission.
- `Editor`: draft project/article, media, dan dashboard terbatas.
- `Viewer`: dashboard dan profile read-only.

Permission memakai pola `module.action`. Seeder bersifat idempotent dan mereset cache Spatie setelah sinkronisasi.

## Security notes

- Registrasi publik nonaktif melalui `REGISTRATION_ENABLED=false`.
- Login dibatasi 5 percobaan per menit dan memakai pesan error umum.
- Status `inactive`, `suspended`, `pending`, dan soft-deleted ditolak saat login.
- Session diregenerasi saat login dan di-invalidate saat logout.
- `last_login_at`, IP, user agent, dan login success/failure dicatat tanpa password/token.
- IP ditampilkan tersamarkan di UI.
- Route admin memakai `auth`, `verified`, `user.active`, `activity`, `admin.access`, dan permission middleware.
- Policy dan service melindungi Super Admin terakhir, self-delete, self-demotion, dan privilege escalation.
- Direct permission tersedia sebagai pengecualian terbatas dan hanya dapat diberikan oleh pemilik permission.

## Test dan validasi

```bash
php artisan test
php artisan route:list --except-vendor
php artisan view:cache
npm run build
```

2FA belum diaktifkan karena belum ada Fortify atau provider OTP di repository awal. Jangan menganggap 2FA tersedia sampai dependency dan challenge flow ditambahkan serta diuji.
