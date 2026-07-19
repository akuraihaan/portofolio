# Deployment Vercel BWORIEY

## Konfigurasi project

Hubungkan repository ke Vercel dengan root project di folder yang berisi `package.json`, `index.html`, `script.js`, dan `vercel.json`.

| Pengaturan | Nilai |
| --- | --- |
| Framework preset | Vite |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node.js | versi yang kompatibel dengan Vite, minimal engine project |

`vercel.json` me-rewrite seluruh direct route ke `index.html`, sehingga refresh `/login`, `/admin`, dan subroute admin tidak menghasilkan 404.

## Environment variables

Tambahkan dua variable berikut pada tiga environment Vercel: **Production**, **Preview**, dan **Development**.

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

Jangan menambahkan `VITE_SUPABASE_SECRET_KEY` atau `VITE_SUPABASE_SERVICE_ROLE_KEY`. Setelah variable diubah, lakukan redeploy karena Vite memasukkan variable saat build.

## Domain dan Supabase Auth

Setelah domain Vercel tersedia, masukkan domain aktual ke **Supabase → Authentication → URL Configuration** sebagai Site URL dan Allowed Redirect URL. Tambahkan localhost untuk development. Jika custom domain aktif, tambahkan domain Vercel dan custom domain agar reset password dan session redirect tetap valid.

## Checklist deploy

```bash
npm ci
npm run build
```

Lalu uji:

1. `/` menampilkan portfolio.
2. `/login` dapat dibuka langsung.
3. `/admin` tanpa session diarahkan ke login.
4. Login Super Admin membuka dashboard.
5. Refresh `/admin/projects` tidak 404.
6. Draft tidak tampil di homepage.
7. Contact form masuk ke `contact_messages`.
8. Upload media mengikuti policy Storage.

Jika build gagal pada Windows karena dependency native, hapus `node_modules` dan `package-lock.json` lokal yang stale, lalu jalankan `npm install` ulang. Root project tidak memiliki dependency binding OS-specific langsung; lockfile boleh memuat optional package transitive milik toolchain Vite.
