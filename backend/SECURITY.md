# Security policy

## Configuration

- Set `APP_ENV=production`, `APP_DEBUG=false`, dan HTTPS pada production.
- Gunakan password Super Admin dari environment, bukan source code.
- Set `REGISTRATION_ENABLED=false` kecuali alur pendaftaran memang dibutuhkan.
- Gunakan database-backed sessions (`SESSION_DRIVER=database`) untuk session management.
- Konfigurasikan mail/queue sebelum mengaktifkan reset password dan notifikasi produksi.

## Access control

Semua keputusan akses dilakukan server-side melalui Spatie Permission middleware, Gate, Policy, dan service. Menu Blade hanya membantu UX; menyembunyikan menu bukan kontrol keamanan.

Role sistem tidak boleh dihapus sembarangan. Akun Super Admin terakhir tidak dapat dinonaktifkan, dihapus, atau diturunkan. Pengguna tidak dapat mengubah privilege dirinya sendiri atau menghapus dirinya sendiri dari panel admin.

## Audit

Login berhasil/gagal, perubahan user, perubahan role/permission, dan pencabutan session dicatat. Password, token reset, cookie, session ID penuh, secret 2FA, dan recovery code tidak dicatat.
