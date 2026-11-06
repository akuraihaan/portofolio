# Deployment Vercel — Next.js

Aplikasi produksi memakai root repository, `npm ci`, `npm run build`, preset **Next.js**, Node.js 24 LTS, dan output directory bawaan. `vercel.json` sudah memakai Next.js. Konfigurasi Vite/dist dalam dokumentasi lama tidak berlaku.

Gunakan proyek Vercel yang sudah ada. Panduan rinci, kebutuhan akses dan verifikasi: [docs/deployment.md](docs/deployment.md) serta [docs/onyx-release.md](docs/onyx-release.md).

Environment production: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, NEXT_PUBLIC_SITE_URL (origin HTTPS final). PORTFOLIO_ANALYTICS opsional. Jangan mengekspos secret/service-role key.

Setelah sesi CLI tersedia, `npx vercel link` harus memilih proyek yang sudah ada. Periksa project link dan konfigurasi sebelum `npx vercel --prod`. Build tidak menjalankan migrasi Supabase. Verifikasi URL hasil deploy, autentikasi, publish/unpublish, media, dan penyimpanan pesan setelah migrasi diterapkan.
